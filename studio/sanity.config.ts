import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'evgenia-tarcha',
  title: 'Сайт Євгенії Тарча',
  projectId: '9qrql5jr',
  dataset: 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Вміст сайту')
          .items([
            S.listItem()
              .title('Тексти, контакти та фото')
              .id('siteSettings')
              .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
            S.divider(),
            S.documentTypeListItem('priceCategory').title('Прайс — категорії та послуги'),
          ]),
    }),
  ],
  schema: {types: schemaTypes},
  document: {
    newDocumentOptions: (prev) => prev.filter((item) => item.templateId !== 'siteSettings'),
    actions: (prev, context) =>
      context.schemaType === 'siteSettings'
        ? prev.filter((action) => action.action !== 'delete' && action.action !== 'duplicate')
        : prev,
  },
})
