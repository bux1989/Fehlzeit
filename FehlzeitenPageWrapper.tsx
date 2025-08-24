import React from 'react';

// Import a placeholder component to avoid build errors
// We'll handle the actual component loading in the render function
let FehlzeitenPage;

// Attempt to load the actual component
try {
  // Use a relative path that's more likely to work in WeWeb
  const FehlzeitenPageModule = require('./components/FehlzeitenPage');
  FehlzeitenPage = FehlzeitenPageModule.FehlzeitenPage || FehlzeitenPageModule.default;
} catch (error) {
  console.error('Failed to load FehlzeitenPage component:', error);
  // Create a placeholder component if the real one fails to load
  FehlzeitenPage = (props) => (
    <div style={{ padding: '2rem', border: '1px solid 
                    #ccc', background: '
                    #f8f8f8' }}>
      <h3>Fehlzeiten Dashboard</h3>
      <p>Component could not be loaded. Please check the console for errors.</p>
    </div>
  );
}

// Simplified props definition without TypeScript interface
function FehlzeitenPageWrapper(props) {
  const {
    data = [],
    availableClasses = [],
    currentUser = null,
    readonly = false,
    onAddEntry,
    onEditEntry,
    onDeleteEntry,
    onFilterChange,
    onSortChange,
    onError
  } = props;

  // Handle Add Entry
  const handleAddEntry = () => {
    if (onAddEntry) {
      onAddEntry();
    }
  };

  // Handle Edit Entry
  const handleEditEntry = (entry) => {
    if (onEditEntry) {
      onEditEntry(entry);
    }
  };

  // Handle Delete Entry
  const handleDeleteEntry = (entryId) => {
    if (onDeleteEntry) {
      onDeleteEntry(entryId);
    }
  };

  // Handle Filter Change
  const handleFilterChange = (filters) => {
    if (onFilterChange) {
      onFilterChange(filters);
    }
  };

  // Handle Sort Change
  const handleSortChange = (sortConfig) => {
    if (onSortChange) {
      onSortChange(sortConfig);
    }
  };

  // Handle Error
  const handleError = (error) => {
    if (onError) {
      onError(error);
    }
  };

  // Props for the FehlzeitenPage component
  const fehlzeitenPageProps = {
    // Data props
    initialData: data,
    availableClasses,
    currentUser,

    // Configuration props
    readonly,

    // Event handlers
    onAddEntry: handleAddEntry,
    onEditEntry: handleEditEntry,
    onDeleteEntry: handleDeleteEntry,
    onFilterChange: handleFilterChange,
    onSortChange: handleSortChange,
    onError: handleError
  };

  try {
    return React.createElement(FehlzeitenPage, fehlzeitenPageProps);
  } catch (error) {
    console.error('Error rendering FehlzeitenPage:', error);
    return React.createElement('div', { 
      style: { padding: '2rem', border: '1px solid red', background: '
                    #ffeeee' } 
    }, `Error loading component: ${error.message}`);
  }
}

// Ensure default export with display name
FehlzeitenPageWrapper.displayName = 'FehlzeitenPageWrapper';

export default FehlzeitenPageWrapper;
