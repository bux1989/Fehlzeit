# Fehlzeiten Dashboard - WeWeb Component

A comprehensive student absence tracking dashboard component for WeWeb. This component allows you to display, filter, sort, and manage student absence records in a clean, professional interface.

## Features

- **Responsive Table Display**: Clean table view of student absence records
- **Advanced Filtering**: Filter by class, student name, date, and status
- **Sorting**: Sort by any column (name, class, time, status)
- **Status Management**: Support for different absence statuses with color coding
- **Detail Modal**: Click any row to view detailed information
- **Export Functionality**: Trigger export events for CSV, XLSX, and PDF
- **Configurable UI**: Show/hide filters, export button, and add button
- **Mock Data**: Includes sample data for immediate testing

## Installation

1. Copy the entire `weweb-component` folder to your WeWeb custom components directory
2. The component will be available as "Fehlzeiten Dashboard" in your component library

## Configuration

### Data Properties

**students** (Array)
- Array of student absence records
- Each record should contain:
  ```javascript
  {
    id: "unique-id",
    firstName: "Student First Name",
    lastName: "Student Last Name", 
    studentClass: "5b",
    date: "18.08.2025",
    timeRange: "08:00–09:30", // Optional, null for full day
    status: "krankgemeldet", // krankgemeldet, unentschuldigt, beurlaubt, verspätet, ungeklärt
    reason: "Reason for absence",
    hasAttachment: true,
    duration: "Zeitfenster", // or "Ganzer Tag"
    sourceType: "eltern-app" // or "anwesenheit", "schuleingabe"
  }
  ```

**availableClasses** (Array)
- List of available class names for filtering
- Default: `['5a', '5b', '6a', '6b', '7a', '7b', '7c', '8a']`

### UI Configuration

**showFilters** (Boolean)
- Show/hide the filter section
- Default: `true`

**showExportButton** (Boolean)
- Show/hide the export button
- Default: `true`

**showAddButton** (Boolean)
- Show/hide the "Add Entry" button
- Default: `true`

**headerTitle** (String)
- Main title displayed at the top
- Default: "Fehlzeiten"

**allowEdit** (Boolean)
- Enable/disable edit functionality in detail modal
- Default: `true`

**allowDelete** (Boolean)
- Enable/disable delete functionality in detail modal
- Default: `false`

### Styling Configuration

**statusColors** (Object)
- Customize colors for different absence statuses:
  ```javascript
  {
    krankgemeldet: '#22c55e',    // Green
    unentschuldigt: '#ef4444',   // Red
    beurlaubt: '#3b82f6',        // Blue
    verspätet: '#f59e0b',        // Yellow
    ungeklärt: '#6b7280'         // Gray
  }
  ```

**dateFormat** (String)
- Date display format
- Options: 'dd.mm.yyyy', 'mm/dd/yyyy', 'yyyy-mm-dd'
- Default: 'dd.mm.yyyy'

### Sorting Configuration

**sortBy** (String)
- Default column to sort by
- Options: 'firstName', 'lastName', 'class', 'time', 'status'
- Default: 'time'

**sortOrder** (String)
- Default sort order
- Options: 'asc', 'desc'
- Default: 'asc'

## Events

The component emits the following events that you can handle in WeWeb:

### add-entry
Triggered when the "Add Entry" button is clicked
```javascript
{
  name: 'add-entry',
  event: { type: 'add' }
}
```

### edit-entry
Triggered when the "Edit" button is clicked in the detail modal
```javascript
{
  name: 'edit-entry',
  event: { 
    type: 'edit', 
    entry: selectedEntryObject 
  }
}
```

### delete-entry
Triggered when the "Delete" button is clicked in the detail modal
```javascript
{
  name: 'delete-entry',
  event: { 
    type: 'delete', 
    entry: selectedEntryObject 
  }
}
```

### export-data
Triggered when an export option is selected
```javascript
{
  name: 'export-data',
  event: { 
    type: 'export', 
    format: 'csv', // or 'xlsx', 'pdf'
    data: filteredDataArray 
  }
}
```

## Usage Example

1. **Add the component** to your WeWeb page
2. **Configure the data source** - either connect to your database or use the built-in mock data for testing
3. **Customize the appearance** using the configuration options
4. **Set up event handlers** for add, edit, delete, and export actions
5. **Style the component** using WeWeb's styling options

## Mock Data

The component includes sample data for 5 students with various absence types. This data is automatically used when no external data is provided, making it perfect for testing and development.

## Status Types

- **Krankgemeldet** (Sick/Reported): Green badge
- **Unentschuldigt** (Unexcused): Red badge  
- **Beurlaubt** (Excused/Leave): Blue badge
- **Verspätet** (Late): Yellow badge
- **Ungeklärt** (Unclear): Gray badge

## Responsive Design

The component is fully responsive and adapts to different screen sizes:
- Desktop: Full table layout with all features
- Tablet: Adjusted spacing and button arrangements
- Mobile: Stacked layout with simplified table view

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Requires ES6+ support

## Troubleshooting

### Component not appearing
- Ensure the component files are in the correct WeWeb directory
- Check that ww-config.js is properly configured
- Verify Vue 3 compatibility

### Data not displaying
- Check that the students array has the correct structure
- Verify that date formats match expected format (dd.mm.yyyy)
- Ensure required fields (id, firstName, lastName, studentClass) are present

### Styling issues
- Component uses scoped CSS to avoid conflicts
- Customization should be done through WeWeb's styling interface
- Check for CSS specificity conflicts if custom styles aren't applying

### Events not firing
- Verify event handlers are properly configured in WeWeb
- Check browser console for JavaScript errors
- Ensure event names match exactly (case-sensitive)

## Contributing

This component was created as a WeWeb wrapper for the original React-based Fehlzeiten dashboard. For bug reports or feature requests, please create an issue in the repository.

## License

MIT License - see LICENSE file for details.
