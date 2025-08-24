export default {
  editor: {
    label: {
      en: 'React App Wrapper',
      de: 'React App Wrapper'
    },
    icon: 'code',
  },
  properties: {
    isLoading: {
      label: {
        en: 'Loading State',
        de: 'Ladezustand'
      },
      type: 'OnOff',
      defaultValue: false,
      bindable: true,
      section: 'settings',
      /* wwEditor:start */
      bindingValidation: {
        type: 'boolean',
        tooltip: 'Whether the component is in loading state'
      },
      propertyHelp: {
        tooltip: 'Controls the loading state of the component'
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
      section: 'settings',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Error message to display'
      },
      propertyHelp: {
        tooltip: 'Error message to display when an error occurs'
      }
      /* wwEditor:end */
    }
  },
  triggerEvents: [
    {
      name: 'buttonClick',
      label: {
        en: 'On Button Click',
        de: 'Beim Button-Klick'
      },
      event: { message: '' }
    }
  ]
};
