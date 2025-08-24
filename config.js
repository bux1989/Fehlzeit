export default {
  editor: {
    label: {
      en: 'Fehlzeiten Manager',
      de: 'Fehlzeiten Verwaltung'
    },
    icon: 'users',
    bubble: {
      icon: 'users'
    },
    customSettingsPropertiesOrder: [
      'userConfiguration',
      'dataConfiguration', 
      'uiConfiguration',
      'apiConfiguration',
      'featureFlags'
    ]
  },
  triggerEvents: [
    {
      name: 'save-absence',
      label: { en: 'Save Absence', de: 'Fehlzeit Speichern' },
      event: {
        data: {},
        user: {},
        timestamp: ''
      }
    },
    {
      name: 'delete-absence', 
      label: { en: 'Delete Absence', de: 'Fehlzeit Löschen' },
      event: {
        id: '',
        user: {},
        timestamp: ''
      }
    },
    {
      name: 'export-data',
      label: { en: 'Export Data', de: 'Daten Exportieren' },
      event: {
        config: {},
        user: {},
        timestamp: ''
      }
    },
    {
      name: 'user-action',
      label: { en: 'User Action', de: 'Benutzer Aktion' },
      event: {
        action: '',
        userId: '',
        data: {}
      }
    },
    {
      name: 'error',
      label: { en: 'Error Occurred', de: 'Fehler Aufgetreten' },
      event: {
        type: '',
        error: '',
        data: {}
      }
    },
    {
      name: 'data-changed',
      label: { en: 'Data Changed', de: 'Daten Geändert' },
      event: {
        type: '',
        data: {}
      }
    }
  ],
  properties: {
    // User Configuration
    userRole: {
      label: { en: 'User Role', de: 'Benutzerrolle' },
      type: 'TextSelect',
      section: 'userConfiguration',
      options: {
        options: [
          { value: 'teacher', label: { en: 'Teacher', de: 'Lehrer' } },
          { value: 'admin', label: { en: 'Administrator', de: 'Administrator' } },
          { value: 'coordinator', label: { en: 'Coordinator', de: 'Koordinator' } }
        ]
      },
      bindable: true,
      defaultValue: 'teacher'
    },
    userPermissions: {
      label: { en: 'User Permissions', de: 'Benutzerberechtigungen' },
      type: 'Array',
      section: 'userConfiguration',
      options: {
        item: {
          type: 'TextSelect',
          options: {
            options: [
              { value: 'view_own_classes', label: { en: 'View Own Classes', de: 'Eigene Klassen Anzeigen' } },
              { value: 'view_all_classes', label: { en: 'View All Classes', de: 'Alle Klassen Anzeigen' } },
              { value: 'create_absences', label: { en: 'Create Absences', de: 'Fehlzeiten Erstellen' } },
              { value: 'edit_own_absences', label: { en: 'Edit Own Absences', de: 'Eigene Fehlzeiten Bearbeiten' } },
              { value: 'edit_all_absences', label: { en: 'Edit All Absences', de: 'Alle Fehlzeiten Bearbeiten' } },
              { value: 'delete_absences', label: { en: 'Delete Absences', de: 'Fehlzeiten Löschen' } },
              { value: 'export_data', label: { en: 'Export Data', de: 'Daten Exportieren' } },
              { value: 'manage_attachments', label: { en: 'Manage Attachments', de: 'Anhänge Verwalten' } }
            ]
          }
        }
      },
      bindable: true,
      defaultValue: ['view_own_classes', 'create_absences', 'edit_own_absences']
    },
    currentUser: {
      label: { en: 'Current User', de: 'Aktueller Benutzer' },
      type: 'Object',
      section: 'userConfiguration',
      bindable: true,
      defaultValue: {
        id: 'current-user',
        name: 'Current User',
        abbreviation: 'CU',
        email: 'user@school.de'
      }
    },

    // Data Configuration
    availableClasses: {
      label: { en: 'Available Classes', de: 'Verfügbare Klassen' },
      type: 'Array',
      section: 'dataConfiguration',
      options: {
        item: {
          type: 'Text'
        }
      },
      bindable: true,
      defaultValue: ['5a', '5b', '6a', '6b', '7a', '7b', '7c', '8a']
    },
    studentsData: {
      label: { en: 'Students Data', de: 'Schülerdaten' },
      type: 'Array',
      section: 'dataConfiguration',
      bindable: true,
      defaultValue: []
    },
    absencesData: {
      label: { en: 'Absences Data', de: 'Fehlzeitendaten' },
      type: 'Array', 
      section: 'dataConfiguration',
      bindable: true,
      defaultValue: []
    },

    // API Configuration
    apiEndpoint: {
      label: { en: 'API Endpoint', de: 'API Endpunkt' },
      type: 'Text',
      section: 'apiConfiguration',
      bindable: true,
      defaultValue: ''
    },
    enableRealTimeUpdates: {
      label: { en: 'Enable Real-time Updates', de: 'Echtzeit-Updates Aktivieren' },
      type: 'OnOff',
      section: 'apiConfiguration',
      defaultValue: false
    },

    // UI Configuration
    theme: {
      label: { en: 'Theme', de: 'Design' },
      type: 'TextSelect',
      section: 'uiConfiguration',
      options: {
        options: [
          { value: 'light', label: { en: 'Light', de: 'Hell' } },
          { value: 'dark', label: { en: 'Dark', de: 'Dunkel' } },
          { value: 'auto', label: { en: 'Auto', de: 'Automatisch' } }
        ]
      },
      defaultValue: 'light'
    },
    defaultDateRange: {
      label: { en: 'Default Date Range', de: 'Standard Datumsbereich' },
      type: 'TextSelect',
      section: 'uiConfiguration',
      options: {
        options: [
          { value: 'today', label: { en: 'Today', de: 'Heute' } },
          { value: 'week', label: { en: 'This Week', de: 'Diese Woche' } },
          { value: 'month', label: { en: 'This Month', de: 'Dieser Monat' } }
        ]
      },
      defaultValue: 'today'
    },
    enableFileUpload: {
      label: { en: 'Enable File Upload', de: 'Datei-Upload Aktivieren' },
      type: 'OnOff',
      section: 'uiConfiguration',
      defaultValue: true
    },
    maxFileSize: {
      label: { en: 'Max File Size (bytes)', de: 'Maximale Dateigröße (Bytes)' },
      type: 'Number',
      section: 'uiConfiguration',
      options: {
        min: 1048576, // 1MB
        max: 52428800, // 50MB
        step: 1048576 // 1MB
      },
      defaultValue: 10485760 // 10MB
    },
    allowedFileTypes: {
      label: { en: 'Allowed File Types', de: 'Erlaubte Dateitypen' },
      type: 'Array',
      section: 'uiConfiguration',
      options: {
        item: {
          type: 'TextSelect',
          options: {
            options: [
              { value: 'pdf', label: 'PDF' },
              { value: 'jpg', label: 'JPG' },
              { value: 'jpeg', label: 'JPEG' },
              { value: 'png', label: 'PNG' },
              { value: 'doc', label: 'DOC' },
              { value: 'docx', label: 'DOCX' }
            ]
          }
        }
      },
      defaultValue: ['pdf', 'jpg', 'jpeg', 'png']
    },

    // Feature Flags
    enableExport: {
      label: { en: 'Enable Export', de: 'Export Aktivieren' },
      type: 'OnOff',
      section: 'featureFlags',
      defaultValue: true
    },
    enableDetailView: {
      label: { en: 'Enable Detail View', de: 'Detailansicht Aktivieren' },
      type: 'OnOff',
      section: 'featureFlags',
      defaultValue: true
    },
    enableBulkActions: {
      label: { en: 'Enable Bulk Actions', de: 'Stapelaktionen Aktivieren' },
      type: 'OnOff',
      section: 'featureFlags',
      defaultValue: false
    }
  },
  sections: {
    userConfiguration: {
      label: { en: 'User Configuration', de: 'Benutzerkonfiguration' },
      icon: 'user'
    },
    dataConfiguration: {
      label: { en: 'Data Configuration', de: 'Datenkonfiguration' },
      icon: 'database'
    },
    apiConfiguration: {
      label: { en: 'API Configuration', de: 'API Konfiguration' },
      icon: 'link'
    },
    uiConfiguration: {
      label: { en: 'UI Configuration', de: 'UI Konfiguration' },
      icon: 'palette'
    },
    featureFlags: {
      label: { en: 'Feature Flags', de: 'Feature Flags' },
      icon: 'toggle-left'
    }
  }
}