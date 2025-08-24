import React from 'react';
import FehlzeitenPage from './src/components/FehlzeitenPage.tsx';

/**
 * React Bridge Component for WeWeb
 * 
 * This component serves as a bridge between the WeWeb Vue component and the React application.
 * It handles prop mapping and event forwarding between the two frameworks.
 */
function FehlzeitenPageWrapper({
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
}) {
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

  return React.createElement(FehlzeitenPage, fehlzeitenPageProps);
}

export default FehlzeitenPageWrapper;