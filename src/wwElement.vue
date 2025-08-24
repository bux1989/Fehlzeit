<template>
  <div class="fehlzeiten-component">
    <!-- Main Fehlzeiten Application -->
    <FehlzeitenPage
      :user-role="userRole"
      :user-permissions="userPermissions"
      :available-classes="availableClasses"
      :students-data="studentsData"
      :absences-data="absencesData"
      :current-user="currentUser"
      @save-absence="handleSaveAbsence"
      @delete-absence="handleDeleteAbsence"
      @export-data="handleExportData"
    />
  </div>
</template>

<script>
import { defineComponent, computed, ref, watch, onMounted } from 'vue'
import FehlzeitenPage from './components/FehlzeitenPage.vue'

export default defineComponent({
  name: 'FehlzeitenComponent',
  components: {
    FehlzeitenPage
  },
  props: {
    // WeWeb data binding props
    userRole: {
      type: String,
      default: 'teacher',
      validator: (value) => ['teacher', 'admin', 'coordinator'].includes(value)
    },
    userPermissions: {
      type: Array,
      default: () => ['view_own_classes', 'create_absences', 'edit_own_absences']
    },
    availableClasses: {
      type: Array,
      default: () => []
    },
    studentsData: {
      type: Array,
      default: () => []
    },
    absencesData: {
      type: Array,
      default: () => []
    },
    currentUser: {
      type: Object,
      default: () => ({
        id: 'current-user',
        name: 'Current User',
        abbreviation: 'CU',
        email: 'user@school.de'
      })
    },
    // API Configuration
    apiEndpoint: {
      type: String,
      default: ''
    },
    enableRealTimeUpdates: {
      type: Boolean,
      default: false
    },
    // UI Configuration
    theme: {
      type: String,
      default: 'light',
      validator: (value) => ['light', 'dark', 'auto'].includes(value)
    },
    defaultDateRange: {
      type: String,
      default: 'today'
    },
    enableFileUpload: {
      type: Boolean,
      default: true
    },
    maxFileSize: {
      type: Number,
      default: 10485760 // 10MB in bytes
    },
    allowedFileTypes: {
      type: Array,
      default: () => ['pdf', 'jpg', 'jpeg', 'png']
    },
    // Feature flags
    enableExport: {
      type: Boolean,
      default: true
    },
    enableDetailView: {
      type: Boolean,
      default: true
    },
    enableBulkActions: {
      type: Boolean,
      default: false
    }
  },
  emits: [
    'save-absence',
    'delete-absence',
    'export-data',
    'user-action',
    'error',
    'data-changed'
  ],
  setup(props, { emit }) {
    // Reactive state
    const loading = ref(false)
    const error = ref(null)
    
    // Computed properties for WeWeb integration
    const isAdmin = computed(() => props.userRole === 'admin')
    const canCreateAbsences = computed(() => 
      props.userPermissions.includes('create_absences') || isAdmin.value
    )
    const canEditAllAbsences = computed(() => 
      props.userPermissions.includes('edit_all_absences') || isAdmin.value
    )
    const canDeleteAbsences = computed(() => 
      props.userPermissions.includes('delete_absences') || isAdmin.value
    )

    // Event handlers for WeWeb
    const handleSaveAbsence = async (absenceData) => {
      try {
        loading.value = true
        error.value = null
        
        // Emit to WeWeb for handling
        emit('save-absence', {
          data: absenceData,
          user: props.currentUser,
          timestamp: new Date().toISOString()
        })
        
        // Emit generic user action for analytics
        emit('user-action', {
          action: absenceData.id ? 'edit_absence' : 'create_absence',
          userId: props.currentUser.id,
          data: absenceData
        })
        
        emit('data-changed', { type: 'absence_saved', data: absenceData })
        
      } catch (err) {
        error.value = err.message
        emit('error', {
          type: 'save_absence_failed',
          error: err.message,
          data: absenceData
        })
      } finally {
        loading.value = false
      }
    }

    const handleDeleteAbsence = async (absenceId) => {
      try {
        loading.value = true
        error.value = null
        
        emit('delete-absence', {
          id: absenceId,
          user: props.currentUser,
          timestamp: new Date().toISOString()
        })
        
        emit('user-action', {
          action: 'delete_absence',
          userId: props.currentUser.id,
          absenceId: absenceId
        })
        
        emit('data-changed', { type: 'absence_deleted', id: absenceId })
        
      } catch (err) {
        error.value = err.message
        emit('error', {
          type: 'delete_absence_failed',
          error: err.message,
          absenceId: absenceId
        })
      } finally {
        loading.value = false
      }
    }

    const handleExportData = (exportConfig) => {
      emit('export-data', {
        config: exportConfig,
        user: props.currentUser,
        timestamp: new Date().toISOString()
      })
      
      emit('user-action', {
        action: 'export_data',
        userId: props.currentUser.id,
        exportType: exportConfig.format
      })
    }

    // Watchers for prop changes
    watch(() => props.theme, (newTheme) => {
      // Apply theme class to component
      const element = document.querySelector('.fehlzeiten-component')
      if (element) {
        element.classList.remove('light', 'dark')
        if (newTheme !== 'auto') {
          element.classList.add(newTheme)
        }
      }
    }, { immediate: true })

    // Lifecycle hooks
    onMounted(() => {
      // Initialize component
      emit('user-action', {
        action: 'component_mounted',
        userId: props.currentUser.id,
        timestamp: new Date().toISOString()
      })
    })

    return {
      loading,
      error,
      isAdmin,
      canCreateAbsences,
      canEditAllAbsences,
      canDeleteAbsences,
      handleSaveAbsence,
      handleDeleteAbsence,
      handleExportData
    }
  }
})
</script>

<style scoped>
.fehlzeiten-component {
  width: 100%;
  height: 100%;
  font-family: system-ui, -apple-system, sans-serif;
}

/* Theme-specific styles */
.fehlzeiten-component.dark {
  color-scheme: dark;
}

.fehlzeiten-component.light {
  color-scheme: light;
}

/* Responsive adjustments for WeWeb */
@media (max-width: 768px) {
  .fehlzeiten-component {
    padding: 0.5rem;
  }
}

/* WeWeb integration styles */
.fehlzeiten-component :deep(.ww-editor-overlay) {
  pointer-events: none;
}

.fehlzeiten-component :deep(.ww-component-selected) {
  outline: 2px solid var(--ww-color-primary, #007bff);
  outline-offset: 2px;
}
</style>