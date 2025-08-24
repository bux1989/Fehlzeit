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
    availableClasses: {
      label: {
        en: 'Available Classes',
        de: 'Verfügbare Klassen'
      },
      type: 'Array',
      defaultValue: [],
      bindable: true,
      section: 'data'
    },
    currentUser: {
      label: {
        en: 'Current User',
        de: 'Aktueller Benutzer'
      },
      type: 'Object',
      defaultValue: null,
      bindable: true,
      section: 'data'
    },
    isLoading: {
      label: {
        en: 'Loading State',
        de: 'Ladezustand'
      },
      type: 'OnOff',
      defaultValue: false,
      bindable: true,
      section: 'states'
    },
    error: {
      label: {
        en: 'Error Message',
        de: 'Fehlermeldung'
      },
      type: 'Text',
      defaultValue: '',
      bindable: true,
      section: 'states'
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
    },
    loadingText: {
      label: {
        en: 'Loading Text',
        de: 'Ladetext'
      },
      type: 'Text',
      defaultValue: 'Lädt Daten...',
      bindable: true,
      section: 'texts'
    },
    emptyText: {
      label: {
        en: 'Empty State Text',
        de: 'Text für leeren Zustand'
      },
      type: 'Text',
      defaultValue: 'Keine Fehlzeiten vorhanden',
      bindable: true,
      section: 'texts'
    }
  },
  events: [
    {
      name: 'addEntry',
      label: {
        en: 'Add Entry',
        de: 'Eintrag hinzufügen'
      },
      group: 'Data Actions'
    },
    {
      name: 'editEntry',
      label: {
        en: 'Edit Entry',
        de: 'Eintrag bearbeiten'
      },
      group: 'Data Actions'
    },
    {
      name: 'deleteEntry',
      label: {
        en: 'Delete Entry',
        de: 'Eintrag löschen'
      },
      group: 'Data Actions'
    },
    {
      name: 'filterChange',
      label: {
        en: 'Filter Changed',
        de: 'Filter geändert'
      },
      group: 'UI Events'
    },
    {
      name: 'sortChange',
      label: {
        en: 'Sort Changed',
        de: 'Sortierung geändert'
      },
      group: 'UI Events'
    },
    {
      name: 'error',
      label: {
        en: 'Error Occurred',
        de: 'Fehler aufgetreten'
      },
      group: 'Error Handling'
    }
  ]
};