import {defineArrayMember, defineField, defineType} from 'sanity'

const localizedString = defineType({
  name: 'localizedString',
  title: 'Текст двома мовами',
  type: 'object',
  fields: [
    defineField({name: 'sk', title: 'Slovensky', type: 'string'}),
    defineField({name: 'uk', title: 'Українською', type: 'string'}),
  ],
  preview: {select: {title: 'sk', subtitle: 'uk'}},
})

const localizedText = defineType({
  name: 'localizedText',
  title: 'Абзац двома мовами',
  type: 'object',
  fields: [
    defineField({name: 'sk', title: 'Slovensky', type: 'text', rows: 4}),
    defineField({name: 'uk', title: 'Українською', type: 'text', rows: 4}),
  ],
  preview: {select: {title: 'sk', subtitle: 'uk'}},
})

const statistic = defineType({
  name: 'statistic',
  title: 'Показник',
  type: 'object',
  fields: [
    defineField({name: 'value', title: 'Число', type: 'string'}),
    defineField({name: 'label', title: 'Підпис', type: 'localizedString'}),
  ],
  preview: {select: {title: 'value', subtitle: 'label.sk'}},
})

const service = defineType({
  name: 'service',
  title: 'Послуга',
  type: 'object',
  fields: [
    defineField({name: 'name', title: 'Назва послуги', type: 'localizedString', validation: (Rule) => Rule.required()}),
    defineField({name: 'price', title: 'Ціна', type: 'number', validation: (Rule) => Rule.required().min(0)}),
    defineField({name: 'badge', title: 'Позначка (необов’язково)', type: 'localizedString'}),
    defineField({name: 'hidden', title: 'Приховати послугу', type: 'boolean', initialValue: false}),
  ],
  preview: {select: {title: 'name.sk', price: 'price'}, prepare: ({title, price}) => ({title, subtitle: `${price ?? '—'} €`})},
})

const priceCategory = defineType({
  name: 'priceCategory',
  title: 'Категорія прайсу',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Назва категорії', type: 'localizedString', validation: (Rule) => Rule.required()}),
    defineField({name: 'sortOrder', title: 'Порядок категорії', type: 'number', initialValue: 100}),
    defineField({name: 'hidden', title: 'Приховати категорію', type: 'boolean', initialValue: false}),
    defineField({name: 'services', title: 'Послуги (можна перетягувати)', type: 'array', of: [defineArrayMember({type: 'service'})]}),
  ],
  preview: {select: {title: 'title.sk', subtitle: 'title.uk'}},
})

const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Вміст сайту',
  type: 'document',
  groups: [
    {name: 'general', title: 'Загальне', default: true},
    {name: 'hero', title: 'Головний екран'},
    {name: 'about', title: 'Про мене'},
    {name: 'prices', title: 'Прайс'},
    {name: 'contact', title: 'Контакти'},
    {name: 'gallery', title: 'Портфоліо'},
    {name: 'seo', title: 'Пошук Google'},
  ],
  fields: [
    defineField({name: 'brand', title: 'Ім’я / назва сайту', type: 'localizedString', group: 'general'}),
    defineField({name: 'navAbout', title: 'Меню: про мене', type: 'localizedString', group: 'general'}),
    defineField({name: 'navPrices', title: 'Меню: прайс', type: 'localizedString', group: 'general'}),
    defineField({name: 'navContact', title: 'Меню: контакти', type: 'localizedString', group: 'general'}),
    defineField({name: 'navBooking', title: 'Кнопка запису в меню', type: 'localizedString', group: 'general'}),
    defineField({name: 'heroEyebrow', title: 'Короткий підпис', type: 'localizedString', group: 'hero'}),
    defineField({name: 'heroTitle', title: 'Головний заголовок', type: 'localizedString', group: 'hero'}),
    defineField({name: 'heroBookingTitle', title: 'Підпис у картці запису', type: 'localizedString', group: 'hero'}),
    defineField({name: 'heroServices', title: 'Короткий список процедур', type: 'localizedString', group: 'hero'}),
    defineField({name: 'heroNote', title: 'Пояснення в картці', type: 'localizedString', group: 'hero'}),
    defineField({name: 'heroButton', title: 'Кнопка в картці', type: 'localizedString', group: 'hero'}),
    defineField({name: 'heroDesktopImage', title: 'Фото головного екрана — комп’ютер', type: 'image', options: {hotspot: true}, group: 'hero'}),
    defineField({name: 'heroMobileImage', title: 'Фото головного екрана — телефон', type: 'image', options: {hotspot: true}, group: 'hero'}),
    defineField({name: 'aboutEyebrow', title: 'Підпис', type: 'localizedString', group: 'about'}),
    defineField({name: 'aboutTitle', title: 'Заголовок', type: 'localizedString', group: 'about'}),
    defineField({name: 'aboutParagraphs', title: 'П’ять абзаців про мене (можна змінювати порядок)', type: 'array', of: [defineArrayMember({type: 'localizedText'})], validation: (Rule) => Rule.length(5), group: 'about'}),
    defineField({name: 'aboutButton', title: 'Кнопка', type: 'localizedString', group: 'about'}),
    defineField({name: 'statistics', title: 'Чотири показники', type: 'array', of: [defineArrayMember({type: 'statistic'})], validation: (Rule) => Rule.length(4), group: 'about'}),
    defineField({name: 'pricesEyebrow', title: 'Підпис прайсу', type: 'localizedString', group: 'prices'}),
    defineField({name: 'pricesTitle', title: 'Заголовок прайсу', type: 'localizedString', group: 'prices'}),
    defineField({name: 'pricesButton', title: 'Кнопка під прайсом', type: 'localizedString', group: 'prices'}),
    defineField({name: 'currency', title: 'Валюта', type: 'string', initialValue: '€', group: 'prices'}),
    defineField({name: 'contactEyebrow', title: 'Підпис', type: 'localizedString', group: 'contact'}),
    defineField({name: 'contactTitle', title: 'Заголовок', type: 'localizedString', group: 'contact'}),
    defineField({name: 'contactDirect', title: 'Напис над способами зв’язку', type: 'localizedString', group: 'contact'}),
    defineField({name: 'callLabel', title: 'Кнопка телефону', type: 'localizedString', group: 'contact'}),
    defineField({name: 'whatsappLabel', title: 'Кнопка WhatsApp', type: 'localizedString', group: 'contact'}),
    defineField({name: 'telegramLabel', title: 'Кнопка Telegram', type: 'localizedString', group: 'contact'}),
    defineField({name: 'phone', title: 'Номер телефону (міжнародний формат)', type: 'string', group: 'contact'}),
    defineField({name: 'phoneDisplay', title: 'Номер телефону для показу', type: 'string', group: 'contact'}),
    defineField({name: 'whatsappPhone', title: 'Номер WhatsApp', type: 'string', group: 'contact'}),
    defineField({name: 'telegramUrl', title: 'Посилання Telegram', type: 'url', group: 'contact'}),
    defineField({name: 'city', title: 'Місто', type: 'localizedString', group: 'contact'}),
    defineField({name: 'hours', title: 'Години роботи', type: 'localizedString', group: 'contact'}),
    defineField({name: 'galleryEnabled', title: 'Показати портфоліо на сайті', type: 'boolean', initialValue: false, group: 'gallery'}),
    defineField({name: 'galleryEyebrow', title: 'Підпис', type: 'localizedString', group: 'gallery'}),
    defineField({name: 'galleryTitle', title: 'Заголовок', type: 'localizedString', group: 'gallery'}),
    defineField({name: 'galleryImages', title: 'Зображення', type: 'array', of: [defineArrayMember({type: 'image', options: {hotspot: true}})], group: 'gallery'}),
    defineField({name: 'footerTagline', title: 'Слоган у підвалі сайту', type: 'localizedString', group: 'general'}),
    defineField({name: 'seoTitle', title: 'Заголовок вкладки / Google', type: 'localizedString', group: 'seo'}),
    defineField({name: 'seoDescription', title: 'Опис для пошуку', type: 'localizedText', group: 'seo'}),
  ],
  preview: {prepare: () => ({title: 'Тексти, контакти та фото'})},
})

export const schemaTypes = [localizedString, localizedText, statistic, service, priceCategory, siteSettings]
