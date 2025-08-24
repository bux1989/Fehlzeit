export default {
  editor: {
    label: {
      en: 'Fehlzeiten Dashboard',
      de: 'Fehlzeiten Dashboard'
    },
    icon: 'calendar',
    category: 'data',
  },
  properties: {
    data: {
      label: {
        en: 'Absence Data',
        de: 'Fehlzeiten-Daten'
      },
      type: 'Array',
      defaultValue: [],
      bindable: true,
      section: 'data'
    },
    readonly: {
      label: {
        en: 'Readonly Mode',
        de: 'Schreibgeschützt'
      },
      type: 'OnOff',
      defaultValue: false,
      bindable: true,
      section: 'settings'
    }
  },
  triggerEvents: [
    {
      name: 'addEntry',
      label: {
        en: 'Add Entry',
        de: 'Eintrag hinzufügen'
      }
    }
  ]
};
