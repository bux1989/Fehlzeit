export default {
    editor: {
        label: 'Fehlzeiten Dashboard',
        icon: 'calendar-check',
        bubble: {
            icon: 'calendar-check',
        },
        customStylePropertiesOrder: ['display', 'background', 'border', 'spacing', 'typography'],
        customSettingsPropertiesOrder: [
            'data',
            'filters',
            'ui',
            'actions'
        ],
    },
    inherit: {
        type: 'ww-container',
        values: {
            style: {
                default: {
                    padding: '20px',
                    borderRadius: '8px',
                    backgroundColor: '#ffffff',
                    minHeight: '400px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
                }
            }
        },
    },
    properties: {
        students: {
            label: 'Students Data',
            type: 'Array',
            options: {
                item: {
                    type: 'Object',
                    options: {
                        object: {
                            id: { type: 'Text' },
                            firstName: { type: 'Text' },
                            lastName: { type: 'Text' },
                            studentClass: { type: 'Text' },
                            date: { type: 'Text' },
                            timeRange: { type: 'Text' },
                            status: { type: 'Text' },
                            reason: { type: 'Text' },
                            hasAttachment: { type: 'Boolean' },
                            duration: { type: 'Text' },
                        }
                    }
                }
            },
            defaultValue: []
        },
        showFilters: {
            label: 'Show Filters',
            type: 'OnOff',
            defaultValue: true,
        },
        showExportButton: {
            label: 'Show Export Button',
            type: 'OnOff',
            defaultValue: true,
        },
        showAddButton: {
            label: 'Show Add Button',
            type: 'OnOff',
            defaultValue: true,
        },
        headerTitle: {
            label: 'Header Title',
            type: 'Text',
            defaultValue: 'Fehlzeiten'
        },
        allowEdit: {
            label: 'Allow Edit',
            type: 'OnOff',
            defaultValue: true,
        },
        allowDelete: {
            label: 'Allow Delete',
            type: 'OnOff',
            defaultValue: false,
        },
        dateFormat: {
            label: 'Date Format',
            type: 'TextSelect',
            options: {
                options: [
                    { value: 'dd.mm.yyyy', label: 'DD.MM.YYYY' },
                    { value: 'mm/dd/yyyy', label: 'MM/DD/YYYY' },
                    { value: 'yyyy-mm-dd', label: 'YYYY-MM-DD' }
                ]
            },
            defaultValue: 'dd.mm.yyyy'
        },
        statusColors: {
            label: 'Status Colors',
            type: 'Object',
            options: {
                object: {
                    krankgemeldet: { type: 'Color', defaultValue: '#22c55e' },
                    unentschuldigt: { type: 'Color', defaultValue: '#ef4444' },
                    beurlaubt: { type: 'Color', defaultValue: '#3b82f6' },
                    verspätet: { type: 'Color', defaultValue: '#f59e0b' },
                    ungeklärt: { type: 'Color', defaultValue: '#6b7280' }
                }
            },
            defaultValue: {
                krankgemeldet: '#22c55e',
                unentschuldigt: '#ef4444',
                beurlaubt: '#3b82f6',
                verspätet: '#f59e0b',
                ungeklärt: '#6b7280'
            }
        },
        availableClasses: {
            label: 'Available Classes',
            type: 'Array',
            options: {
                item: { type: 'Text' }
            },
            defaultValue: ['5a', '5b', '6a', '6b', '7a', '7b', '7c', '8a']
        },
        sortBy: {
            label: 'Default Sort By',
            type: 'TextSelect',
            options: {
                options: [
                    { value: 'firstName', label: 'First Name' },
                    { value: 'lastName', label: 'Last Name' },
                    { value: 'class', label: 'Class' },
                    { value: 'time', label: 'Time' },
                    { value: 'status', label: 'Status' }
                ]
            },
            defaultValue: 'time'
        },
        sortOrder: {
            label: 'Default Sort Order',
            type: 'TextSelect',
            options: {
                options: [
                    { value: 'asc', label: 'Ascending' },
                    { value: 'desc', label: 'Descending' }
                ]
            },
            defaultValue: 'asc'
        }
    },
};
