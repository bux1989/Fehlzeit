# Fehlzeiten WeWeb Component

A comprehensive absence management component for WeWeb that provides teachers and administrators with a powerful interface to manage student absences with role-based permissions.

## Features

- 📊 **Complete Absence Management** - Create, edit, delete, and view student absences
- 👥 **Role-Based Permissions** - Teacher, Admin, and Coordinator roles with different access levels
- 🔍 **Advanced Filtering** - Filter by class, student, date, and status
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- 📁 **File Attachments** - Upload and manage absence documentation
- 📈 **Export Functionality** - Export data in CSV, XLSX, and PDF formats
- 🎨 **Theme Support** - Light, dark, and auto themes
- 🔄 **Real-time Updates** - Optional real-time data synchronization
- 🌍 **Internationalization** - German and English language support

## Installation in WeWeb

### 1. Create Custom Component

1. In your WeWeb project, go to **Components** → **Custom Components**
2. Click **"Add Custom Component"**
3. Upload the component files or clone from repository
4. The component will appear in your components library

### 2. Component Files Structure

```
fehlzeiten-component/
├── package.json          # Package definition and dependencies
├── wwElement.vue         # Main WeWeb component
├── config.js            # WeWeb configuration
├── components/          # Vue component files
│   ├── FehlzeitenPage.vue
│   ├── FehlzeitenTable.vue
│   ├── FehlzeitModal.vue
│   ├── FehlzeitDetailModal.vue
│   └── StatusPill.vue
└── styles/
    └── globals.css      # Component styles
```

## Configuration

### User Configuration

| Property | Type | Description |
|----------|------|-------------|
| `userRole` | String | Current user role: 'teacher', 'admin', 'coordinator' |
| `userPermissions` | Array | Array of permission strings |
| `currentUser` | Object | Current user information |

### Data Configuration

| Property | Type | Description |
|----------|------|-------------|
| `availableClasses` | Array | List of classes the user can access |
| `studentsData` | Array | Student data from your database |
| `absencesData` | Array | Absence records from your database |

### API Configuration

| Property | Type | Description |
|----------|------|-------------|
| `apiEndpoint` | String | Base URL for API calls |
| `enableRealTimeUpdates` | Boolean | Enable real-time data synchronization |

### UI Configuration

| Property | Type | Description |
|----------|------|-------------|
| `theme` | String | 'light', 'dark', or 'auto' |
| `defaultDateRange` | String | Default date filter: 'today', 'week', 'month' |
| `enableFileUpload` | Boolean | Enable file attachment functionality |
| `maxFileSize` | Number | Maximum file size in bytes (default: 10MB) |
| `allowedFileTypes` | Array | Allowed file extensions |

### Feature Flags

| Property | Type | Description |
|----------|------|-------------|
| `enableExport` | Boolean | Enable data export functionality |
| `enableDetailView` | Boolean | Enable detailed absence view |
| `enableBulkActions` | Boolean | Enable bulk operations |

## Data Models

### Student Object
```javascript
{
  id: "student-123",
  name: "Max Mustermann",
  class: "5b",
  fullClass: "5b – Mathe"
}
```

### Absence Object
```javascript
{
  id: "absence-456",
  studentName: "Max Mustermann",
  studentClass: "5b",
  courseClass: "5b – Mathe",
  date: "18.08.2025",
  dateRange: "10:15–11:45", // Optional for partial day
  duration: "Zeitfenster", // or "Ganzer Tag"
  status: "krankgemeldet", // or "unentschuldigt", "beurlaubt", "ungeklärt", "verspätet"
  reason: "Arzttermin",
  hasAttachment: true,
  hasAccess: true,
  createdBy: "Müller, A.",
  createdAt: "18.08.2025, 08:30",
  sourceType: "eltern-app", // or "anwesenheit", "schuleingabe"
  lastEditedBy: "MÜL", // Optional
  lastEditedAt: "18.08.2025, 09:15" // Optional
}
```

## Events

### Component Events

| Event | Description | Payload |
|-------|-------------|---------|
| `save-absence` | Fired when an absence is saved | `{ data, user, timestamp }` |
| `delete-absence` | Fired when an absence is deleted | `{ id, user, timestamp }` |
| `export-data` | Fired when data export is requested | `{ config, user, timestamp }` |
| `user-action` | Fired for any user interaction | `{ action, userId, data }` |
| `error` | Fired when an error occurs | `{ type, error, data }` |
| `data-changed` | Fired when data is modified | `{ type, data }` |

## Usage Examples

### Basic Setup

1. **Add Component to Page**
   - Drag the Fehlzeiten Component to your page
   - Configure basic settings in the right panel

2. **Connect Data Sources**
   ```javascript
   // Bind to WeWeb collections
   studentsData: {{ students }}
   absencesData: {{ absences }}
   currentUser: {{ $auth.user }}
   ```

3. **Set User Role**
   ```javascript
   userRole: {{ $auth.user.role }}
   userPermissions: {{ $auth.user.permissions }}
   ```

### Advanced Configuration

1. **Custom API Integration**
   ```javascript
   // In WeWeb workflow
   apiEndpoint: "https://api.yourschool.de"
   enableRealTimeUpdates: true
   ```

2. **Role-Based Access**
   ```javascript
   // Teacher permissions
   userPermissions: [
     "view_own_classes",
     "create_absences", 
     "edit_own_absences"
   ]
   
   // Admin permissions  
   userPermissions: [
     "view_all_classes",
     "create_absences",
     "edit_all_absences", 
     "delete_absences",
     "export_data"
   ]
   ```

3. **Event Handling**
   ```javascript
   // Handle save event in WeWeb workflow
   onSaveAbsence: (event) => {
     // Save to database
     // Send notifications
     // Update UI
   }
   ```

## Styling

The component uses Tailwind CSS with custom design tokens. You can customize the appearance by:

1. **Modifying CSS Variables**
   ```css
   :root {
     --primary: #your-brand-color;
     --background: #your-background;
     /* ... other variables */
   }
   ```

2. **Theme Configuration**
   Set the `theme` prop to 'light', 'dark', or 'auto'

3. **Responsive Behavior**
   The component automatically adapts to different screen sizes

## Permissions System

### Teacher Role
- View classes they are assigned to
- Create absences for their students
- Edit absences they created
- View absence details

### Admin Role
- View all classes and students
- Create absences for any student
- Edit and delete any absence
- Export data
- Manage file attachments

### Coordinator Role
- View multiple classes (configured)
- Create and edit absences
- Limited administrative functions

## Development

### Prerequisites
- Vue.js 3.3+
- WeWeb project
- Modern browser with ES6+ support

### Local Development
```bash
# Install dependencies
npm install

# Development with WeWeb CLI (if available)
weweb dev

# Build for production
npm run build
```

### Testing
The component includes comprehensive mock data for testing all features without requiring a backend connection.

## Support

For technical support and feature requests:
- 📧 Email: support@flexwise.de
- 📖 Documentation: https://docs.flexwise.de/fehlzeiten
- 🐛 Issues: GitHub Issues

## License

MIT License - see LICENSE file for details.

---

**FlexWise Team** - Building the future of educational technology