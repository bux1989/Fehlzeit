export default {
  editor: {
    label: {
      en: 'Simple Test Component',
      de: 'Einfache Test Komponente'
    },
    icon: 'calendar',
    category: 'test',
  },
  properties: {
    testProp: {
      label: {
        en: 'Test Property',
        de: 'Test Eigenschaft'
      },
      type: 'Text',
      defaultValue: 'Hello WeWeb',
      bindable: true,
      section: 'test'
    }
  },
  events: [
    {
      name: 'test',
      label: {
        en: 'Test Event',
        de: 'Test Event'
      },
      group: 'Test Events'
    }
  ]
};