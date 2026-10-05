// Initial copy of the currently published site. Import once into an empty dataset.
import {writeFileSync} from 'node:fs'

const tr = (sk, uk) => ({_type: 'localizedString', sk, uk})
const paragraph = (sk, uk, key) => ({_type: 'localizedText', _key: key, sk, uk})
const settings = {
  _id: 'siteSettings',
  _type: 'siteSettings',
  brand: tr('Evgenia Tarcha', 'Євгенія Тарча'),
  navAbout: tr('O mne', 'Про мене'),
  navPrices: tr('Cenník', 'Прайс'),
  navContact: tr('Kontakt', 'Контакти'),
  navBooking: tr('Objednať sa', 'Записатись'),
  heroEyebrow: tr('Kozmetička', 'Косметолог'),
  heroTitle: tr('Evgenia Tarcha —\nestetická medicína\nso srdcom', 'Євгенія Тарча —\nестетична медицина\nз душею'),
  heroBookingTitle: tr('Objednávka procedúry', 'Запис на процедуру'),
  heroServices: tr('Botox · Filery · Biorevitalizácia', 'Ботокс · Філери · Біоревіталізація'),
  heroNote: tr('Prirodzený výsledok bez „prerobiť“ — už po prvej procedúre', 'Натуральний результат без «перероблено» — вже після першої процедури'),
  heroButton: tr('Objednať sa na procedúru', 'Записатись на процедуру'),
  aboutEyebrow: tr('O mne', 'Про мене'),
  aboutTitle: tr('Evgenia Tarcha', 'Євгенія Тарча'),
  aboutParagraphs: [
    paragraph('Som lekárka-dermatologička. Pracujem v oblasti estetickej kozmetológie už 8 rokov, konkrétne sa venujem kompletnej kontúrovej plastike tváre.', 'Я — лікарка-дерматолог. Працюю у сфері естетичної косметології вже 8 років, зокрема займаюся комплексною контурною пластикою обличчя.', 'about-1'),
    paragraph('Pracujem s prípadmi rôznej náročnosti: ptóza tváre, asymetria pier, asymetria tváre.', 'Працюю з випадками різної складності: птоз обличчя, асиметрія губ, асиметрія обличчя.', 'about-2'),
    paragraph('Vzdelávam lekárov-dermatológov v estetických zákrokoch, ako sú: botox, modelácia pier, kontúrovanie tváre, zlepšenie kvality pokožky a pod.', 'Навчаю лікарів-дерматологів естетичним процедурам: ботокс, моделювання губ, контурування обличчя, покращення якості шкіри.', 'about-3'),
    paragraph('Taktiež spolupracujem s plastickými chirurgmi, ktorí dokážu vykonať náročnejšie zákroky, ktoré nie je možné riešiť injekčnými technikami.', "Також співпрацюю з пластичними хірургами, які виконують складніші процедури, що неможливо вирішити ін'єкційними техніками.", 'about-4'),
    paragraph('Vždy vám rada pomôžem stať sa lepšou verziou seba samých.', 'Завжди рада допомогти вам стати кращою версією себе.', 'about-5'),
  ],
  aboutButton: tr('Objednať sa', 'Записатись'),
  statistics: [
    {_type: 'statistic', _key: 'stat-1', value: '8+', label: tr('rokov skúseností', 'років досвіду')},
    {_type: 'statistic', _key: 'stat-2', value: '500+', label: tr('spokojných klientov', 'задоволених клієнтів')},
    {_type: 'statistic', _key: 'stat-3', value: '20+', label: tr('druhov procedúr', 'видів процедур')},
    {_type: 'statistic', _key: 'stat-4', value: '100%', label: tr('bezpečné prípravky', 'безпечні препарати')},
  ],
  pricesEyebrow: tr('Cenník', 'Прейскурант'),
  pricesTitle: tr('Ceny služieb', 'Ціни на послуги'),
  pricesButton: tr('Objednať sa na konzultáciu', 'Записатись на консультацію'),
  currency: '€',
  contactEyebrow: tr('Objednávka', 'Запис'),
  contactTitle: tr('Objednať sa', 'Записатись'),
  contactDirect: tr('Alebo kontaktujte priamo', "Або зв'яжіться напряму"),
  callLabel: tr('Zavolať', 'Зателефонувати'),
  whatsappLabel: tr('WhatsApp', 'WhatsApp'),
  telegramLabel: tr('Telegram', 'Telegram'),
  phone: '+380999177111',
  phoneDisplay: '+380 99 917 71 11',
  whatsappPhone: '+380999177111',
  telegramUrl: 'https://t.me/+380999177111',
  city: tr('Bratislava, Slovensko', 'Братислава, Словаччина'),
  hours: tr('Po–So: 9:00 – 19:00', 'Пн–Сб: 9:00 – 19:00'),
  galleryEnabled: false,
  galleryEyebrow: tr('Portfólio', 'Портфоліо'),
  galleryTitle: tr('Moje práce', 'Мої роботи'),
  footerTagline: tr('Estetická medicína so srdcom', 'Естетична медицина з душею'),
  seoTitle: tr('Evgenia Tarcha — Kozmetička Bratislava | Botox, Filery', 'Євгенія Тарча — Косметолог Братислава | Ботокс, Філери'),
  seoDescription: {_type: 'localizedText', sk: 'Estetická medicína v Bratislave. Botox, filery, biorevitalizácia. Objednanie telefonicky, cez WhatsApp alebo Telegram.', uk: 'Професійна естетична медицина у Братиславі. Ботокс, філери, біоревіталізація. Запис телефоном, через WhatsApp або Telegram.'},
}

const rows = [
  ['lips', 'Pery', 'Губи', [
    ['Pery 1 ml', 'Губи — 1 мл', 180], ['Pery 0.5', 'Губи — 0,5 мл', 100],
  ]],
  ['botox', 'Botox', 'Ботокс', [
    ['Botox 1 zona', 'Ботокс — 1 зона', 90], ['Botox 2 zony', 'Ботокс — 2 зони', 150], ['Botox 3 zony', 'Ботокс — 3 зони', 200], ['Botox Full', 'Ботокс — комплексно', 460, 'hit', 'хіт'],
  ]],
  ['threads', 'Nite', 'Нитки', [
    ['Nite kolagen 1 ks', 'Колагенові нитки — 1 шт.', 25], ['Nite cog, aptos 1 ks', 'Нитки КОГ / Аптос — 1 шт.', 45],
  ]],
  ['fillers', 'Filery tváre', 'Філери обличчя', [
    ['Sanka 1 ml', 'Нижня щелепа — 1 мл', 180], ['Lica ml', 'Щоки — 1 мл', 180], ['Brada 1 ml', 'Підборіддя — 1 мл', 180], ['Kruhy', 'Кола під очима', 200], ['Kyselina Full', 'Гіалуронова кислота — комплексно', 580],
  ]],
  ['injections', 'Injekcie / Lipolýza', "Ін'єкції / Ліполіз", [
    ['Lidaza', 'Лідаза', 80], ['Nos Botox', 'Ботокс носа', 150], ['Masetery Botox', 'Ботокс жувальних м’язів', 160], ['Mezoterapia', 'Мезотерапія', 150], ['Liporedukcia', 'Ліпоредукція', 180], ['Nos Kyselina', 'Гіалуронова кислота — ніс', 180],
  ]],
  ['biorevitalization', 'Biorevitalizácia', 'Біоревіталізація', [
    ['Botox Krk', 'Ботокс шиї', 150], ['Biorevitalizacia', 'Біоревіталізація', 180], ['Lumi Eyes', 'Люмі Айз', 220], ['Prohfilo', 'Профайло', 260], ['Radiesse', 'Радієс', 280], ['Polinukleotydi', 'Полінуклеотиди', 250],
  ]],
]

const categories = rows.map(([id, sk, uk, services], index) => ({
  _id: `priceCategory-${id}`,
  _type: 'priceCategory',
  title: tr(sk, uk),
  sortOrder: (index + 1) * 10,
  hidden: false,
  services: services.map(([skName, ukName, price, skBadge, ukBadge], itemIndex) => ({
    _type: 'service',
    _key: `${id}-${itemIndex + 1}`,
    name: tr(skName, ukName),
    price,
    hidden: false,
    ...(skBadge ? {badge: tr(skBadge, ukBadge)} : {}),
  })),
}))

writeFileSync(new URL('./seed.ndjson', import.meta.url), [...categories, settings].map((doc) => JSON.stringify(doc)).join('\n') + '\n')
writeFileSync(new URL('../diz/cms-defaults.js', import.meta.url), `window.TARCHA_DEFAULT_CONTENT = ${JSON.stringify({settings, categories})};\n`)
console.log('Created seed.ndjson with current prices and site content')
