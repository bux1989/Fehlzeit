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
      defaultValue: [
        {
          id: '1',
          name: 'Max Mustermann',
          class: '10A',
          startDate: '2023-09-01',
          endDate: '2023-09-03',
          reason: 'Krankheit'
        },
        {
          id: '2',
          name: 'Anna Schmidt',
          class: '11B',
          startDate: '2023-09-05',
          endDate: '2023-09-07',
          reason: 'Arzttermin'
        }
      ],
      bindable: true,
      section: 'data',
      /* wwEditor:start */
      bindingValidation: {
        type: 'array',
        tooltip: 'An array of absence data objects'
      },
      propertyHelp: {
        tooltip: 'The absence data to display in the dashboard'
      }
      /* wwEditor:end */
    },
    availableClasses: {
      label: {
        en: 'Available Classes',
        de: 'Verfügbare Klassen'
      },
      type: 'Array',
      defaultValue: [
        { id: '10A', name: '10A' },
        { id: '11B', name: '11B' },
        { id: '12C', name: '12C' }
      ],
      bindable: true,
      section: 'data',
      /* wwEditor:start */
      bindingValidation: {
        type: 'array',
        tooltip: 'An array of available class objects'
      },
      propertyHelp: {
        tooltip: 'The list of available classes to filter by'
      }
      /* wwEditor:end */
    },
    currentUser: {
      label: {
        en: 'Current User',
        de: 'Aktueller Benutzer'
      },
      type: 'Object',
      defaultValue: {
        id: '1',
        name: 'Admin User',
        role: 'admin'
      },
      bindable: true,
      section: 'data',
      /* wwEditor:start */
      bindingValidation: {
        type: 'object',
        tooltip: 'The current user object'
      },
      propertyHelp: {
        tooltip: 'The current user information for permission checks'
      }
      /* wwEditor:end */
    },
    isLoading: {
      label: {
        en: 'Loading State',
        de: 'Ladezustand'
      },
      type: 'OnOff',
      defaultValue: false,
      bindable: true,
      section: 'states',
      /* wwEditor:start */
      bindingValidation: {
        type: 'boolean',
        tooltip: 'Whether the dashboard is in loading state'
      },
      propertyHelp: {
        tooltip: 'Controls the loading state of the dashboard'
      }
      /* wwEditor:end */
    },
    error: {
      label: {
        en: 'Error Message',
        de: 'Fehlermeldung'
      },
      type: 'Text',
      defaultValue: '',
      bindable: true,
      section: 'states',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Error message to display'
      },
      propertyHelp: {
        tooltip: 'Error message to display when an error occurs'
      }
      /* wwEditor:end */
    },
    readonly: {
      label: {
        en: 'Readonly Mode',
        de: 'Schreibgeschützt'
      },
      type: 'OnOff',
      defaultValue: false,
      bindable: true,
      section: 'settings',
      /* wwEditor:start */
      bindingValidation: {
        type: 'boolean',
        tooltip: 'Whether the dashboard is in readonly mode'
      },
      propertyHelp: {
        tooltip: 'Controls whether users can edit data in the dashboard'
      }
      /* wwEditor:end */
    },
    loadingText: {
      label: {
        en: 'Loading Text',
        de: 'Ladetext'
      },
      type: 'Text',
      defaultValue: 'Lädt Daten...',
      bindable: true,
      section: 'texts',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Text to display during loading'
      },
      propertyHelp: {
        tooltip: 'The text shown while data is loading'
      }
      /* wwEditor:end */
    },
    emptyText: {
      label: {
        en: 'Empty State Text',
        de: 'Text für leeren Zustand'
      },
      type: 'Text',
      defaultValue: 'Keine Fehlzeiten vorhanden',
      bindable: true,
      section: 'texts',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Text to display when no data is available'
      },
      propertyHelp: {
        tooltip: 'The text shown when there is no absence data to display'
      }
      /* wwEditor:end */
    }
  },
  triggerEvents: [
    {
      name: 'addEntry',
      label: {
        en: 'Add Entry',
        de: 'Eintrag hinzufügen'
      },
      event: {}
    },
    {
      name: 'editEntry',
      label: {
        en: 'Edit Entry',
        de: 'Eintrag bearbeiten'
      },
      event: { entry: {} }
    },
    {
      name: 'deleteEntry',
      label: {
        en: 'Delete Entry',
        de: 'Eintrag löschen'
      },
      event: { entryId: '' }
    },
    {
      name: 'filterChange',
      label: {
        en: 'Filter Changed',
        de: 'Filter geändert'
      },
      event: { filters: {} }
    },
    {
      name: 'sortChange',
      label: {
        en: 'Sort Changed',
        de: 'Sortierung geändert'
      },
      event: { sortConfig: {} }
    },
    {
      name: 'error',
      label: {
        en: 'Error Occurred',
        de: 'Fehler aufgetreten'
      },
      event: { error: '' }
    }
  ]
};
