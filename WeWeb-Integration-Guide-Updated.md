# Complete WeWeb Integration Guide for Fehlzeiten Component

## Overview
This guide provides step-by-step instructions for integrating the Fehlzeiten (absence management) component into WeWeb using the custom component system. The component is built with Vue 3 and designed specifically for educational institutions.

## 📁 File Structure Required for WeWeb

Your WeWeb custom component needs these specific files:

```
fehlzeiten-component/
├── package.json          # Dependencies and metadata ✅
├── wwElement.vue         # Main WeWeb component entry point ✅  
├── config.js            # WeWeb editor configuration ✅
├── components/          # Vue component files
│   ├── FehlzeitenPage.vue
│   ├── FehlzeitenTable.vue
│   ├── FehlzeitModal.vue
│   ├── FehlzeitDetailModal.vue
│   └── StatusPill.vue
└── styles/
    └── globals.css      # Tailwind styles and design tokens
```

## 🚀 Step 1: WeWeb Project Setup

### 1.1 Prerequisites
- WeWeb account with custom component access
- Project with Vue 3 support enabled
- Tailwind CSS configured in your WeWeb project

### 1.2 Enable Custom Components
1. Go to your WeWeb project settings
2. Navigate to **Advanced** → **Custom Components**
3. Enable "Allow Custom Components"
4. Ensure Vue 3 is selected as the framework

## 📦 Step 2: Dependency Resolution

### 2.1 Why You Can't Paste the Element Yet
The reason you cannot copy-paste `wwElement.vue` is likely because WeWeb needs to resolve the dependencies first. Our `package.json` specifies:

```json
{
  "dependencies": {
    "vue": "^3.3.0",
    "lucide-vue-next": "^0.263.1"
  }
}
```

### 2.2 Adding the Component to WeWeb

**Method 1: Upload as ZIP (Recommended)**
1. Create a ZIP file containing all component files
2. In WeWeb, go to **Components** → **Custom Components**
3. Click **"Upload Component"**
4. Select your ZIP file
5. WeWeb will automatically install dependencies

**Method 2: GitHub Integration**
1. Push your component to a GitHub repository
2. In WeWeb, use **"Import from GitHub"**
3. Connect your repository
4. WeWeb will clone and install dependencies

**Method 3: Manual File Upload**
1. Upload `package.json` first
2. Wait for dependency installation to complete
3. Then upload remaining files

## ⚙️ Step 3: Component Configuration

### 3.1 Understanding config.js
Our `config.js` defines the WeWeb editor interface with 5 main sections:

```javascript
// Section breakdown:
userConfiguration    // User roles and permissions
dataConfiguration   // Data sources and collections  
apiConfiguration    // API endpoints and settings
uiConfiguration     // Theme, file upload, UI options
featureFlags        // Enable/disable features
```

### 3.2 Available Properties in WeWeb Editor

When you add the component to a page, you'll see these configurable properties:

#### User Configuration
- **User Role**: teacher, admin, coordinator
- **User Permissions**: Array of permission strings
- **Current User**: User object with id, name, email

#### Data Configuration  
- **Available Classes**: Array of class names
- **Students Data**: Collection of student records
- **Absences Data**: Collection of absence records

#### API Configuration
- **API Endpoint**: Base URL for your absence API
- **Enable Real-time Updates**: Boolean for live data sync

#### UI Configuration
- **Theme**: light, dark, auto
- **Default Date Range**: today, week, month
- **File Upload Settings**: max size, allowed types

#### Feature Flags
- **Enable Export**: Show/hide export functionality
- **Enable Detail View**: Show/hide detailed absence view
- **Enable Bulk Actions**: Future feature toggle

## 🔗 Step 4: Data Binding

### 4.1 Connect to WeWeb Collections

**Create Collections:**
1. Go to **Data** → **Collections**
2. Create these collections:
   - `students` (student records)
   - `absences` (absence records) 
   - `classes` (class information)

**Bind Collections to Component:**
```javascript
// In component properties
studentsData: {{ students }}
absencesData: {{ absences }}
availableClasses: {{ classes.map(c => c.name) }}
```

### 4.2 User Context Binding
```javascript
// Bind user information
currentUser: {{ $auth.user }}
userRole: {{ $auth.user.role }}
userPermissions: {{ $auth.user.permissions }}
```

### 4.3 Dynamic Properties
```javascript
// Example bindings in WeWeb
apiEndpoint: {{ $variables.apiUrl }}
theme: {{ $variables.userTheme }}
enableFileUpload: {{ $auth.user.role === 'admin' }}
```

## 📡 Step 5: Event Handling & Workflows

### 5.1 Component Events
The component emits these events that you can handle in WeWeb workflows:

#### save-absence
```javascript
// Triggered when: User saves/creates an absence
// Payload: { data: absenceObject, user: userObject, timestamp: string }
// Use for: Save to database, send notifications
```

#### delete-absence  
```javascript
// Triggered when: User deletes an absence
// Payload: { id: string, user: userObject, timestamp: string }
// Use for: Remove from database, log action
```

#### export-data
```javascript
// Triggered when: User exports data
// Payload: { config: exportConfig, user: userObject, timestamp: string }
// Use for: Generate reports, track usage
```

#### user-action
```javascript
// Triggered when: Any user interaction
// Payload: { action: string, userId: string, data: object }
// Use for: Analytics, audit logging
```

#### error
```javascript
// Triggered when: Component error occurs
// Payload: { type: string, error: string, data: object }
// Use for: Error handling, user notifications
```

### 5.2 Setting Up Workflows

**Example: Save Absence Workflow**
1. Go to **Logic** → **Workflows**
2. Create new workflow triggered by `save-absence` event
3. Add actions:
   ```javascript
   // Action 1: Validate data
   if (!event.data.studentName) {
     return { error: 'Student name required' }
   }
   
   // Action 2: Save to database
   await $api.post('/absences', event.data)
   
   // Action 3: Refresh collections
   await $collections.refresh('absences')
   
   // Action 4: Show success message
   $notifications.success('Absence saved successfully')
   ```

## 🎨 Step 6: Styling Integration

### 6.1 Ensure Tailwind CSS
Make sure your WeWeb project has Tailwind CSS configured:
1. Go to **Design System** → **CSS Framework**
2. Select **Tailwind CSS v4**
3. Import our `globals.css` custom properties

### 6.2 Design Tokens
Our component uses these custom CSS variables:
```css
--background, --foreground, --primary, --secondary
--muted, --accent, --destructive, --border
--input-background, --card, --popover
```

These should be added to your WeWeb project's global CSS.

## 🔧 Step 7: Testing the Integration

### 7.1 Component Verification Checklist
- [ ] Component appears in WeWeb component library
- [ ] All configuration sections visible in editor
- [ ] Data binding works with collections
- [ ] Events trigger workflows correctly
- [ ] Styling matches design system
- [ ] Responsive behavior works
- [ ] File upload functions (if enabled)

### 7.2 Test with Mock Data
Before connecting real data sources, test with the built-in mock data:
1. Add component to a test page
2. Leave data bindings empty (will use mock data)
3. Test all functionality:
   - Creating new absences
   - Editing existing absences  
   - Filtering and sorting
   - Detail view modal
   - File upload

## 🗃️ Step 8: Database Schema

### 8.1 Required Database Tables

**Students Table:**
```sql
students {
  id: string (primary key)
  name: string
  class: string
  email?: string
  created_at: timestamp
}
```

**Absences Table:**
```sql
absences {
  id: string (primary key)
  student_id: string (foreign key)
  student_name: string
  student_class: string
  course_class: string
  date: date
  date_range?: string
  duration: enum('Ganzer Tag', 'Zeitfenster')
  status: enum('krankgemeldet', 'unentschuldigt', 'beurlaubt', 'ungeklärt', 'verspätet')
  reason: text
  has_attachment: boolean
  attachment_url?: string
  source_type: enum('eltern-app', 'anwesenheit', 'schuleingabe')
  created_by: string
  created_at: timestamp
  last_edited_by?: string
  last_edited_at?: timestamp
}
```

### 8.2 WeWeb Collection Configuration
```javascript
// students collection
{
  name: 'students',
  source: 'database',
  table: 'students',
  fields: ['id', 'name', 'class', 'email']
}

// absences collection  
{
  name: 'absences',
  source: 'database', 
  table: 'absences',
  fields: ['*'], // all fields
  filter: userRole === 'teacher' ? { created_by: $auth.user.id } : {}
}
```

## 🔐 Step 9: Security & Permissions

### 9.1 Role-Based Access Control
```javascript
// Teacher permissions
const teacherPermissions = [
  'view_own_classes',
  'create_absences', 
  'edit_own_absences'
]

// Admin permissions
const adminPermissions = [
  'view_all_classes',
  'create_absences',
  'edit_all_absences',
  'delete_absences', 
  'export_data',
  'manage_attachments'
]
```

### 9.2 Data Filtering by Role
```javascript
// In WeWeb collection filters
absences: {
  filter: $auth.user.role === 'teacher' 
    ? { teacher_id: $auth.user.id }
    : {} // admin sees all
}

students: {
  filter: $auth.user.role === 'teacher'
    ? { class: { in: $auth.user.assigned_classes } }
    : {} // admin sees all
}
```

## 🚨 Step 10: Troubleshooting

### 10.1 Common Issues

**Issue: "Component won't upload"**
- Solution: Ensure `package.json` is valid JSON
- Check that all Vue files have proper syntax
- Verify WeWeb supports the dependencies

**Issue: "Dependencies not installing"**  
- Solution: Upload `package.json` first, wait for installation
- Use only supported packages (Vue 3, Lucide icons)
- Check WeWeb's dependency compatibility list

**Issue: "Component doesn't show properties"**
- Solution: Verify `config.js` syntax is correct
- Ensure all property types are valid WeWeb types
- Check for circular references in configuration

**Issue: "Data binding not working"**
- Solution: Create collections first, then bind
- Use exact collection names in bindings
- Check collection permissions and filters

**Issue: "Events not triggering"**
- Solution: Create workflows for events
- Verify event names match config.js
- Check workflow trigger conditions

### 10.2 Debug Mode
Enable WeWeb debug mode to see:
- Component loading errors
- Event firing logs  
- Data binding status
- Console error messages

## 📚 Step 11: Advanced Configuration

### 11.1 Custom API Integration
```javascript
// API configuration for real backend
{
  apiEndpoint: 'https://your-school-api.com/api',
  enableRealTimeUpdates: true,
  
  // Custom headers
  apiHeaders: {
    'Authorization': `Bearer ${$auth.token}`,
    'School-ID': $variables.schoolId
  }
}
```

### 11.2 Multi-language Support
```javascript
// Language configuration
{
  locale: {{ $variables.userLocale }}, // 'de' or 'en'
  labels: {
    de: { /* German labels */ },
    en: { /* English labels */ }
  }
}
```

### 11.3 Custom Workflows
```javascript
// Example: Automated email on absence creation
workflow: 'on-absence-created' {
  trigger: 'save-absence',
  conditions: event.data.status === 'unentschuldigt',
  actions: [
    'send-email-to-parents',
    'notify-administration', 
    'log-absence-alert'
  ]
}
```

## ✅ Success Checklist

Before going live, ensure:
- [ ] All components load without errors
- [ ] Data flows correctly between WeWeb and component
- [ ] User permissions work as expected  
- [ ] File uploads save to correct location
- [ ] Responsive design works on all devices
- [ ] Performance is acceptable with real data volumes
- [ ] Error handling provides user-friendly messages
- [ ] Export functionality generates correct formats
- [ ] Security measures prevent unauthorized access

## 📞 Support Resources

- **WeWeb Documentation**: [Custom Components Guide](https://docs.weweb.io/custom-components)
- **Vue 3 Documentation**: [Composition API](https://vuejs.org/guide/composition-api/)
- **Component Issues**: Create GitHub issue in your component repository
- **WeWeb Support**: Use WeWeb's support chat for platform issues

---

Your Fehlzeiten component is now ready for professional use in WeWeb! 🎉