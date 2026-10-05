(() => {
  const defaults = window.TARCHA_DEFAULT_CONTENT;
  if (!defaults) return;

  const lang = location.pathname.startsWith('/uk/') ? 'uk' : 'sk';
  const original = defaults.settings;
  const pick = (value) => value?.[lang] || value?.sk || '';
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[char]));
  const textNodes = (root) => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    return nodes;
  };
  const replaceExact = (root, oldValue, newValue) => {
    if (!root || !oldValue || newValue == null || oldValue === newValue) return;
    for (const node of textNodes(root)) {
      if (node.nodeValue.trim() === oldValue) node.nodeValue = node.nodeValue.replace(oldValue, newValue);
    }
  };
  const replaceWithin = (root, oldValue, newValue) => {
    if (!root || !oldValue || !newValue || oldValue === newValue) return;
    for (const node of textNodes(root)) {
      if (node.nodeValue.includes(oldValue)) node.nodeValue = node.nodeValue.replaceAll(oldValue, newValue);
    }
  };
  const replaceField = (root, field, settings) => replaceExact(root, pick(original[field]), pick(settings[field]));
  const setHeading = (selector, value) => {
    if (!value) return;
    const clean = value.replace(/\s+/g, '');
    for (const heading of document.querySelectorAll(selector)) {
      if (heading.textContent.replace(/\s+/g, '') === clean) continue;
      const lines = value.split('\n');
      heading.replaceChildren(...lines.flatMap((line, index) => index ? [document.createElement('br'), document.createTextNode(line)] : [document.createTextNode(line)]));
    }
  };
  const setLinkText = (selector, value) => {
    if (!value) return;
    for (const link of document.querySelectorAll(selector)) {
      setElementText(link, value);
    }
  };
  const setElementText = (element, value) => {
    const first = textNodes(element).find((node) => node.nodeValue.trim());
    if (first && first.nodeValue.trim() !== value) first.nodeValue = first.nodeValue.replace(first.nodeValue.trim(), value);
  };

  let content;
  let priceSignature = '';
  let gallerySignature = '';
  let applying = false;
  let scheduled = false;

  function applySettings(settings) {
    const header = document.querySelector('header');
    if (header) {
      const brand = header.querySelector('a[href="/sk/"] span, a[href="/uk/"] span');
      if (brand && pick(settings.brand) && brand.textContent !== pick(settings.brand)) brand.textContent = pick(settings.brand);
      setLinkText('header a[href="#about"]', pick(settings.navAbout));
      setLinkText('header a[href="#prices"]', pick(settings.navPrices));
      setLinkText('header nav a[href="#contact"]', pick(settings.navContact));
      for (const link of header.querySelectorAll('a[href="#contact"]')) {
        if (!link.closest('nav') && pick(settings.navBooking)) setElementText(link, pick(settings.navBooking));
      }
    }

    const hero = document.querySelector('#hero');
    if (hero) {
      replaceField(hero, 'heroEyebrow', settings);
      replaceField(hero, 'heroBookingTitle', settings);
      replaceField(hero, 'heroServices', settings);
      replaceField(hero, 'heroNote', settings);
      replaceField(hero, 'heroButton', settings);
      setHeading('#hero h1', pick(settings.heroTitle));
      const images = hero.querySelectorAll('img');
      if (images[0] && settings.heroMobileImageUrl && images[0].getAttribute('src') !== settings.heroMobileImageUrl) images[0].src = settings.heroMobileImageUrl;
      if (images[1] && settings.heroDesktopImageUrl && images[1].getAttribute('src') !== settings.heroDesktopImageUrl) images[1].src = settings.heroDesktopImageUrl;
    }

    const about = document.querySelector('#about');
    if (about) {
      replaceField(about, 'aboutEyebrow', settings);
      replaceField(about, 'aboutButton', settings);
      setHeading('#about h2', pick(settings.aboutTitle));
      for (let index = 0; index < original.aboutParagraphs.length; index++) {
        replaceExact(about, pick(original.aboutParagraphs[index]), pick(settings.aboutParagraphs?.[index]));
      }
      for (let index = 0; index < original.statistics.length; index++) {
        replaceExact(about, original.statistics[index].value, settings.statistics?.[index]?.value);
        replaceExact(about, pick(original.statistics[index].label), pick(settings.statistics?.[index]?.label));
      }
    }

    const prices = document.querySelector('#prices');
    if (prices) {
      replaceField(prices, 'pricesEyebrow', settings);
      setHeading('#prices h2', pick(settings.pricesTitle));
      replaceField(prices, 'pricesButton', settings);
    }

    const contact = document.querySelector('#contact');
    if (contact) {
      replaceField(contact, 'contactEyebrow', settings);
      setHeading('#contact h2', pick(settings.contactTitle));
      replaceField(contact, 'contactDirect', settings);
      replaceField(contact, 'city', settings);
      replaceField(contact, 'hours', settings);
      replaceField(contact, 'callLabel', settings);
      replaceField(contact, 'whatsappLabel', settings);
      replaceField(contact, 'telegramLabel', settings);
    }

    const gallery = document.querySelector('#gallery');
    if (gallery) {
      replaceField(gallery, 'galleryEyebrow', settings);
      setHeading('#gallery h2', pick(settings.galleryTitle));
    }

    const digits = (settings.phone || original.phone).replace(/\D/g, '');
    const whatsapp = (settings.whatsappPhone || settings.phone || original.phone).replace(/\D/g, '');
    const phoneDisplay = settings.phoneDisplay || settings.phone || original.phoneDisplay;
    const telegram = /^https:\/\/t\.me\//i.test(settings.telegramUrl || '') ? settings.telegramUrl : original.telegramUrl;
    for (const link of document.querySelectorAll('a[href^="tel:"]')) {
      if (link.getAttribute('href') !== `tel:+${digits}`) link.href = `tel:+${digits}`;
      replaceExact(link, original.phoneDisplay, phoneDisplay);
    }
    for (const link of document.querySelectorAll('a[href*="wa.me/"]')) {
      if (link.getAttribute('href') !== `https://wa.me/${whatsapp}`) link.href = `https://wa.me/${whatsapp}`;
    }
    for (const link of document.querySelectorAll('a[href*="t.me/"]')) {
      if (link.getAttribute('href') !== telegram) link.href = telegram;
    }
    const footer = document.querySelector('footer');
    if (footer) {
      replaceWithin(footer, pick(original.brand), pick(settings.brand));
      replaceField(footer, 'footerTagline', settings);
      setLinkText('footer a[href="#about"]', pick(settings.navAbout));
      setLinkText('footer a[href="#prices"]', pick(settings.navPrices));
      setLinkText('footer a[href="#contact"]', pick(settings.navContact));
    }

    if (pick(settings.seoTitle) && document.title !== pick(settings.seoTitle)) document.title = pick(settings.seoTitle);
    const meta = document.querySelector('meta[name="description"]');
    if (meta && pick(settings.seoDescription) && meta.content !== pick(settings.seoDescription)) meta.content = pick(settings.seoDescription);
  }

  function applyPrices(settings, categories) {
    const section = document.querySelector('#prices');
    const grid = section?.querySelector('.grid.grid-cols-1');
    if (!grid) return;
    const visible = (categories || []).filter((category) => !category.hidden);
    const signature = JSON.stringify([visible, settings.currency, lang]);
    if (grid.dataset.cmsSignature === signature && priceSignature === signature && grid.querySelector('.cms-price-card')) return;
    priceSignature = signature;
    grid.classList.add('cms-price-grid');
    grid.dataset.cmsSignature = signature;
    grid.innerHTML = visible.map((category, index) => `
      <article class="cms-price-card">
        <div class="cms-price-category"><span>${String(index + 1).padStart(2, '0')}</span><h3>${esc(pick(category.title))}</h3></div>
        <div class="cms-price-items">${(category.services || []).filter((service) => !service.hidden).map((service) => `
          <div class="cms-price-item"><span class="cms-price-name">${esc(pick(service.name))}${pick(service.badge) ? `<em>${esc(pick(service.badge))}</em>` : ''}</span><span class="cms-price-value">${esc(service.price)} <small>${esc(settings.currency || '€')}</small></span></div>
        `).join('')}</div>
      </article>
    `).join('');
    replaceExact(section, String(defaults.categories.length), String(visible.length));
  }

  function applyGallery(settings) {
    const gallery = document.querySelector('#gallery');
    const images = (settings.galleryImages || []).filter((image) => image?.url);
    const enabled = settings.galleryEnabled && images.length > 0;
    document.documentElement.classList.toggle('cms-gallery-enabled', enabled);
    if (!gallery || !enabled) return;
    const grid = gallery.querySelector('.grid');
    if (!grid) return;
    const signature = JSON.stringify(images);
    if (grid.dataset.cmsSignature === signature && gallerySignature === signature && grid.querySelector('.cms-gallery-item')) return;
    gallerySignature = signature;
    grid.dataset.cmsSignature = signature;
    grid.classList.add('cms-gallery-grid');
    grid.innerHTML = images.map((image, index) => `<button type="button" class="cms-gallery-item" data-full-image="${esc(image.url)}" aria-label="${lang === 'uk' ? 'Відкрити фото' : 'Otvoriť fotografiu'} ${index + 1}"><img src="${esc(image.url)}" alt="${esc(pick(settings.galleryTitle))} ${index + 1}" loading="lazy"></button>`).join('');
  }

  function apply() {
    if (!content || applying) return;
    applying = true;
    try {
      applySettings(content.settings);
      applyPrices(content.settings, content.categories);
      applyGallery(content.settings);
    } finally { applying = false; }
  }

  const query = `{"settings": *[_id == "siteSettings"][0]{..., "heroDesktopImageUrl": heroDesktopImage.asset->url, "heroMobileImageUrl": heroMobileImage.asset->url, "galleryImages": galleryImages[]{"url": asset->url}}, "categories": *[_type == "priceCategory"] | order(sortOrder asc){title,hidden,services}}`;
  const url = `https://9qrql5jr.apicdn.sanity.io/v2025-02-19/data/query/production?query=${encodeURIComponent(query)}`;
  fetch(url).then((response) => {
    if (!response.ok) throw new Error(`Sanity HTTP ${response.status}`);
    return response.json();
  }).then(({result}) => {
    if (!result?.settings || !Array.isArray(result.categories)) throw new Error('Sanity content is not ready');
    content = result;
    apply();
    new MutationObserver(() => {
      if (applying || scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => { scheduled = false; apply(); });
    }).observe(document.body, {subtree: true, childList: true, characterData: true});
  }).catch((error) => console.error('Sanity content unavailable; showing published fallback.', error));

  document.addEventListener('click', (event) => {
    const button = event.target.closest?.('.cms-gallery-item');
    if (!button) return;
    const overlay = document.createElement('div');
    overlay.className = 'cms-gallery-overlay';
    overlay.innerHTML = `<button type="button" aria-label="Close">×</button><img src="${esc(button.dataset.fullImage)}" alt="">`;
    overlay.addEventListener('click', () => overlay.remove());
    document.body.append(overlay);
  });
})();
