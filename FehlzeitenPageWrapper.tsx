import React from 'react';

// Import the main component without the extension to let the bundler handle it
import { FehlzeitenPage } from './src/components/FehlzeitenPage';

// Import the CSS - this might be causing issues in WeWeb
// Let's make it conditional
try {
  import('./src/index.css');
} catch (error) {
  console.warn('Could not load CSS, styles might not work correctly:', error);
}

interface FehlzeitenPageWrapperProps {
  data?: any[];
  availableClasses?: string[];
  currentUser?: any;
  readonly?: boolean;
  onAddEntry?: () => void;
  onEditEntry?: (entry: any) => void;
  onDeleteEntry?: (entryId: string) => void;
  onFilterChange?: (filters: any) => void;
  onSortChange?: (sortConfig: any) => void;
  onError?: (error: any) => void;
}

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
}: FehlzeitenPageWrapperProps) {
  // Handle Add Entry
  const handleAddEntry = () => {
    if (onAddEntry) {
      onAddEntry();
    }
  };

  // Handle Edit Entry
  const handleEditEntry = (entry: any) => {
    if (onEditEntry) {
      onEditEntry(entry);
    }
  };

  // Handle Delete Entry
  const handleDeleteEntry = (entryId: string) => {
    if (onDeleteEntry) {
      onDeleteEntry(entryId);
    }
  };

  // Handle Filter Change
  const handleFilterChange = (filters: any) => {
    if (onFilterChange) {
      onFilterChange(filters);
    }
  };

  // Handle Sort Change
  const handleSortChange = (sortConfig: any) => {
    if (onSortChange) {
      onSortChange(sortConfig);
    }
  };

  // Handle Error
  const handleError = (error: any) => {
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
      style: { padding: '2rem', border: '1px solid red', background: '#ffeeee' } 
    }, `Error loading component: ${error.message}`);
  }
}

// Ensure default export with display name
FehlzeitenPageWrapper.displayName = 'FehlzeitenPageWrapper';

export default FehlzeitenPageWrapper;