# WeWeb Fehlzeiten Dashboard Component

This WeWeb component wraps the existing React Fehlzeit Dashboard application, enabling seamless integration with WeWeb workflows while preserving all original functionality.

## Quick Start

1. **Install Component**: Upload the component package to your WeWeb project
2. **Drag & Drop**: Place the component on your page
3. **Configure Data**: Bind the `data` prop to your absence collection
4. **Set Events**: Configure event handlers for CRUD operations

## Props

### Data Props
- **`data`** (Array): Absence entries data
  ```javascript
  [{
    id: "1",
    studentName: "Max Müller", 
    studentClass: "5b",
    date: "18.08.2025",
    status: "krankgemeldet",
    reason: "Arzttermin"
    // ... more fields
  }]
  ```

- **`availableClasses`** (Array): List of accessible class names
  ```javascript
  ["5a", "5b", "6a", "6b", "7a", "7b", "7c", "8a"]
  ```

- **`currentUser`** (Object): Current user information for audit trail
  ```javascript
  {
    id: "user123",
    name: "Müller, A.",
    abbreviation: "MÜL"
  }
  ```

### State Props
- **`isLoading`** (Boolean): Show loading spinner
- **`error`** (String): Display error message
- **`readonly`** (Boolean): Disable editing capabilities

### UI Customization Props
- **`loadingText`** (String): Custom loading message (default: "Lädt Daten...")
- **`emptyText`** (String): Custom empty state message (default: "Keine Fehlzeiten vorhanden")

## Events

### Data Events
- **`addEntry`**: User wants to add new absence entry
- **`editEntry`**: User wants to edit existing entry (receives entry object)
- **`deleteEntry`**: User wants to delete entry (receives entryId)

### UI Events  
- **`filterChange`**: Filters were applied (receives filters object)
- **`sortChange`**: Sorting was changed (receives sort config)
- **`error`**: Internal error occurred (receives error object)

## Example WeWeb Configuration

### Props Binding
```javascript
// Data
data: {{$collections.absences.data}}
availableClasses: {{$variables.schoolClasses}}
currentUser: {{$auth.user}}

// State
isLoading: {{$collections.absences.loading}}
error: {{$collections.absences.error}}
readonly: {{$variables.isViewMode}}

// UI Customization
loadingText: "Lade Fehlzeiten..."
emptyText: "Noch keine Fehlzeiten erfasst"
```

### Event Handlers
```javascript
// Data Actions
addEntry: () => wwLib.openModal('add-absence-modal')
editEntry: (event) => {
  wwLib.$store.dispatch('setSelectedEntry', event.entry);
  wwLib.openModal('edit-absence-modal');
}
deleteEntry: (event) => {
  wwLib.$store.dispatch('collections/absences/delete', event.entryId);
}

// UI Events
filterChange: (event) => {
  wwLib.$store.dispatch('setAbsenceFilters', event.filters);
}
sortChange: (event) => {
  wwLib.$store.dispatch('setAbsenceSort', event.sortConfig);
}
error: (event) => {
  wwLib.showToast({ message: event.error, type: 'error' });
}
```

## Features

### Core Functionality
- ✅ Complete absence data table with pagination
- ✅ Advanced filtering (class, student, date, status)
- ✅ Multi-column sorting capabilities
- ✅ Detailed absence view modal
- ✅ Multi-day absence support
- ✅ Responsive design
- ✅ Accessibility features

### Data Management
- ✅ Full CRUD operations via events
- ✅ Real-time data updates through props
- ✅ Audit trail tracking (created/edited by/at)
- ✅ Source type tracking (parent app, attendance, school entry)

### UI States
- ✅ Loading state with spinner
- ✅ Error state with custom messages
- ✅ Empty state with custom text
- ✅ Readonly mode support

### Status Types
- **krankgemeldet**: Reported sick (green)
- **unentschuldigt**: Unexcused (red)
- **beurlaubt**: Excused/Leave (blue)
- **ungeklärt**: Unclear/Pending (yellow)
- **verspätet**: Late (orange)

## Data Structure

### Absence Entry Schema
```typescript
interface FehlzeitEntry {
  id: string;
  studentName: string;
  studentClass: string;
  courseClass: string;
  date: string; // DD.MM.YYYY format
  dateRange?: string; // e.g., "10:15–11:45"
  duration: 'Ganzer Tag' | 'Zeitfenster';
  status: 'krankgemeldet' | 'unentschuldigt' | 'beurlaubt' | 'ungeklärt' | 'verspätet';
  reason: string;
  hasAttachment: boolean;
  hasAccess: boolean;
  createdBy: string;
  createdAt: string;
  sourceType: 'eltern-app' | 'anwesenheit' | 'schuleingabe';
  lastEditedBy?: string;
  lastEditedAt?: string;
  endDate?: string; // For multi-day absences
  isMultiDay?: boolean;
}
```

## Readonly Mode

When `readonly` is enabled:
- "Add Entry" button is disabled
- Edit/Delete buttons are hidden in detail modal
- All data modification operations are prevented
- Full viewing functionality remains available

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Notes

- Client-side filtering/sorting (optimal for < 1000 entries)
- For larger datasets, implement server-side filtering
- React components load dynamically to optimize bundle size
- CSS is scoped to prevent style conflicts

## Troubleshooting

### Component Not Loading
- Ensure Vue 3 and React 18+ are available
- Check browser console for JavaScript errors
- Verify all required props are bound

### Data Not Displaying
- Check data prop format matches schema
- Verify data is not empty or null
- Check for loading/error states

### Events Not Firing
- Ensure event handlers are properly configured
- Check WeWeb console for event logs
- Verify event binding syntax

### Styling Issues
- Component uses Tailwind CSS classes
- Ensure Tailwind is available in your WeWeb project
- Check for CSS conflicts with existing styles

## Technical Architecture

```
WeWeb Page
├── wwElement.vue (WeWeb Component)
    ├── Loading/Error/Empty States (Vue)
    └── React Container
        └── FehlzeitenPageWrapper.js (React Bridge)
            └── FehlzeitenPage.tsx (Modified Original)
                ├── FehlzeitenTable.tsx
                ├── FehlzeitModal.tsx
                └── FehlzeitDetailModal.tsx
```

## Support

For issues specific to this WeWeb component, please contact the component maintainer or refer to the WeWeb documentation for general component usage.