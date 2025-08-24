<template>
  <div class="ww-fehlzeiten-dashboard">
    <!-- Loading State -->
    <div v-if="content.isLoading" class="flex items-center justify-center p-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      <span class="ml-3 text-gray-600">{{ content.loadingText || 'Lädt Daten...' }}</span>
    </div>
    
    <!-- Error State -->
    <div v-else-if="content.error" class="p-6 border border-red-200 rounded-lg bg-red-50">
      <div class="flex items-center">
        <svg class="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
        </svg>
        <span class="text-red-800">{{ content.error }}</span>
      </div>
    </div>
    
    <!-- Empty State -->
    <div v-else-if="!content.data || content.data.length === 0" class="text-center p-8 text-gray-500">
      <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
      </svg>
      <p>{{ content.emptyText || 'Keine Fehlzeiten vorhanden' }}</p>
    </div>
    
    <!-- Debug Info -->
    <div v-else-if="debugMode" class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <h3 class="font-bold text-yellow-800">Debug Mode</h3>
      <p class="text-yellow-700">React Component Status: {{ reactStatus }}</p>
      <p class="text-yellow-700">Data entries: {{ (content.data || []).length }}</p>
      <p class="text-yellow-700">Props: {{ JSON.stringify(reactProps, null, 2) }}</p>
    </div>
    
    <!-- React App Container -->
    <div v-else ref="reactContainer" class="ww-react-container"></div>
  </div>
</template>

<script>
// Use require instead of import for better WeWeb compatibility
const wewebBridge = require('./weweb-bridge.js');
const React = wewebBridge.React;
const createRoot = wewebBridge.createRoot;
const FehlzeitenPageWrapper = wewebBridge.FehlzeitenPageWrapper;

export default {
  name: 'wwFehlzeitenDashboard',
  props: {
    content: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      reactMounted: false,
      reactRoot: null,
      reactStatus: 'Not mounted',
      debugMode: false
    };
  },
  computed: {
    reactProps() {
      return {
        data: this.content.data || [],
        availableClasses: this.content.availableClasses || [],
        currentUser: this.content.currentUser || null,
        readonly: this.content.readonly || false,
        onAddEntry: this.handleAddEntry,
        onEditEntry: this.handleEditEntry,
        onDeleteEntry: this.handleDeleteEntry,
        onFilterChange: this.handleFilterChange,
        onSortChange: this.handleSortChange,
        onError: this.handleError
      };
    }
  },
  mounted() {
    // Enable debug mode if data is empty for testing
    this.debugMode = !this.content.data || this.content.data.length === 0;
    
    if (!this.debugMode) {
      this.mountReactComponent();
    }
  },
  beforeUnmount() {
    if (this.reactMounted && this.reactRoot) {
      try {
        this.reactRoot.unmount();
        this.reactStatus = 'Unmounted';
      } catch (error) {
        console.error('Error unmounting React component:', error);
      }
      this.reactRoot = null;
      this.reactMounted = false;
    }
  },
  watch: {
    reactProps: {
      deep: true,
      handler() {
        if (this.reactMounted && this.content.data && this.content.data.length > 0) {
          this.updateReactComponent();
        }
      }
    }
  },
  methods: {
    mountReactComponent() {
      if (!this.$refs.reactContainer || !FehlzeitenPageWrapper) {
        this.reactStatus = 'Missing container or component';
        return;
      }
      
      try {
        if (!this.reactRoot) {
          this.reactRoot = createRoot(this.$refs.reactContainer);
        }
        
        const element = React.createElement(FehlzeitenPageWrapper, this.reactProps);
        this.reactRoot.render(element);
        this.reactMounted = true;
        this.reactStatus = 'Mounted successfully';
      } catch (error) {
        this.reactStatus = 'Mount failed: ' + error.message;
        console.error('Failed to mount React component:', error);
        this.$emit('trigger-event', {
          name: 'error',
          event: { message: 'Failed to mount component: ' + error.message }
        });
      }
    },
    
    updateReactComponent() {
      if (!this.reactMounted || !this.reactRoot || !FehlzeitenPageWrapper) {
        this.reactStatus = 'Update failed: component not ready';
        return;
      }
      
      try {
        const element = React.createElement(FehlzeitenPageWrapper, this.reactProps);
        this.reactRoot.render(element);
        this.reactStatus = 'Updated successfully';
      } catch (error) {
        this.reactStatus = 'Update failed: ' + error.message;
        console.error('Failed to update React component:', error);
      }
    },
    
    // Event handlers that emit WeWeb events
    handleAddEntry() {
      this.$emit('trigger-event', { name: 'addEntry', event: {} });
    },
    
    handleEditEntry(entry) {
      this.$emit('trigger-event', { name: 'editEntry', event: { entry } });
    },
    
    handleDeleteEntry(entryId) {
      this.$emit('trigger-event', { name: 'deleteEntry', event: { entryId } });
    },
    
    handleFilterChange(filters) {
      this.$emit('trigger-event', { name: 'filterChange', event: { filters } });
    },
    
    handleSortChange(sortConfig) {
      this.$emit('trigger-event', { name: 'sortChange', event: { sortConfig } });
    },
    
    handleError(error) {
      this.$emit('trigger-event', { name: 'error', event: { error } });
    }
  }
};
</script>

<style scoped>
.ww-fehlzeiten-dashboard {
  width: 100%;
  min-height: 400px;
}

.ww-react-container {
  width: 100%;
}

/* Ensure Tailwind styles work */
.ww-react-container :global(*) {
  box-sizing: border-box;
}

/* Basic Tailwind-like utility classes for fallback */
.flex { display: flex; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.p-4 { padding: 1rem; }
.p-6 { padding: 1.5rem; }
.p-8 { padding: 2rem; }
.bg-yellow-50 { background-color: #fefce8; }
.border { border-width: 1px; }
.border-yellow-200 { border-color: #fde047; }
.rounded-lg { border-radius: 0.5rem; }
.font-bold { font-weight: 700; }
.text-yellow-800 { color: #92400e; }
.text-yellow-700 { color: #b45309; }
</style>