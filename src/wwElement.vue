<template>
  <div class="ww-fehlzeiten-dashboard">
    <!-- Loading State -->
    <div v-if="content?.isLoading" class="flex items-center justify-center p-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      <span class="ml-3 text-gray-600">{{ content?.loadingText || 'Lädt Daten...' }}</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="p-6 border border-red-200 rounded-lg bg-red-50">
      <div class="flex items-center">
        <svg class="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
        </svg>
        <span class="text-red-800">{{ error }}</span>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!content?.data || content?.data.length === 0" class="text-center p-8 text-gray-500">
      <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
      </svg>
      <p>{{ content?.emptyText || 'Keine Fehlzeiten vorhanden' }}</p>
    </div>

    <!-- React App Container -->
    <div v-else ref="reactContainer" class="ww-react-container"></div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';

export default {
  props: {
    content: { 
      type: Object, 
      default: () => ({}) 
    },
    uid: { 
      type: String, 
      required: true 
    },
    /* wwEditor:start */
    wwEditorState: { 
      type: Object, 
      required: true 
    },
    /* wwEditor:end */
  },
  emits: ['trigger-event'],
  setup(props, { emit }) {
    const reactContainer = ref(null);
    const reactMounted = ref(false);
    const error = ref(props.content?.error || '');
    let reactRoot = null;
    let React = null;
    let ReactDOM = null;
    let FehlzeitenPageWrapper = null;

    // Editor state
    const isEditing = computed(() => {
      /* wwEditor:start */
      return props.wwEditorState?.isEditing;
      /* wwEditor:end */
      // eslint-disable-next-line no-unreachable
      return false;
    });

    const reactProps = computed(() => ({
      data: props.content?.data || [],
      availableClasses: props.content?.availableClasses || [],
      currentUser: props.content?.currentUser || null,
      readonly: props.content?.readonly || false,
      isEditing: isEditing.value,
      onAddEntry: handleAddEntry,
      onEditEntry: handleEditEntry,
      onDeleteEntry: handleDeleteEntry,
      onFilterChange: handleFilterChange,
      onSortChange: handleSortChange,
      onError: handleError
    }));

    // Load React dependencies once
    const loadReactDependencies = async () => {
      try {
        if (!React) {
          const ReactModule = await import('react');
          React = ReactModule.default || ReactModule;
        }

        if (!ReactDOM) {
          const ReactDOMModule = await import('react-dom/client');
          ReactDOM = ReactDOMModule.default || ReactDOMModule;
        }

        if (!FehlzeitenPageWrapper) {
          const FehlzeitenModule = await import('./FehlzeitenPageWrapper');
          FehlzeitenPageWrapper = FehlzeitenModule.default || FehlzeitenModule;
        }

        return true;
      } catch (err) {
        console.error('Failed to load React dependencies:', err);
        error.value = `Failed to load React: ${err.message}`;
        handleError(err);
        return false;
      }
    };

    const mountReactComponent = async () => {
      if (!reactContainer.value) return;

      try {
        const loaded = await loadReactDependencies();
        if (!loaded) return;

        if (!reactRoot && ReactDOM && reactContainer.value) {
          reactRoot = ReactDOM.createRoot(reactContainer.value);
        }

        if (reactRoot && React && FehlzeitenPageWrapper) {
          const element = React.createElement(FehlzeitenPageWrapper, reactProps.value);
          reactRoot.render(element);
          reactMounted.value = true;
          error.value = '';
        }
      } catch (err) {
        console.error('Error mounting React component:', err);
        error.value = `Error mounting React component: ${err.message}`;
        handleError(err);
      }
    };

    const updateReactComponent = async () => {
      if (!reactMounted.value || !reactRoot) return;

      try {
        const loaded = await loadReactDependencies();
        if (!loaded) return;

        if (React && FehlzeitenPageWrapper) {
          const element = React.createElement(FehlzeitenPageWrapper, reactProps.value);
          reactRoot.render(element);
        }
      } catch (err) {
        console.error('Error updating React component:', err);
        error.value = `Error updating React component: ${err.message}`;
        handleError(err);
      }
    };

    // Event handlers that emit WeWeb events
    const handleAddEntry = () => {
      if (isEditing.value) return;
      emit('trigger-event', { name: 'addEntry', event: {} });
    };

    const handleEditEntry = (entry) => {
      if (isEditing.value) return;
      emit('trigger-event', { name: 'editEntry', event: { entry } });
    };

    const handleDeleteEntry = (entryId) => {
      if (isEditing.value) return;
      emit('trigger-event', { name: 'deleteEntry', event: { entryId } });
    };

    const handleFilterChange = (filters) => {
      if (isEditing.value) return;
      emit('trigger-event', { name: 'filterChange', event: { filters } });
    };

    const handleSortChange = (sortConfig) => {
      if (isEditing.value) return;
      emit('trigger-event', { name: 'sortChange', event: { sortConfig } });
    };

    const handleError = (err) => {
      const errorMessage = err?.message || String(err);
      error.value = errorMessage;
      emit('trigger-event', { name: 'error', event: { error: errorMessage } });
    };

    // Watch for content error changes
    watch(() => props.content?.error, (newError) => {
      if (newError) {
        error.value = newError;
      }
    });

    // Lifecycle hooks
    onMounted(() => {
      mountReactComponent();
    });

    onBeforeUnmount(() => {
      if (reactMounted.value && reactRoot) {
        try {
          reactRoot.unmount();
        } catch (err) {
          console.error('Error unmounting React component:', err);
        }
        reactRoot = null;
        reactMounted.value = false;
      }
    });

    // Watch for changes in reactProps
    watch(reactProps, () => {
      if (reactMounted.value) {
        updateReactComponent();
      }
    }, { deep: true });

    // Watch for changes in the container element
    watch(reactContainer, () => {
      if (reactContainer.value && !reactMounted.value) {
        mountReactComponent();
      }
    });

    return {
      reactContainer,
      reactMounted,
      error
    };
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
  min-height: 400px;
}

/* Ensure Tailwind styles work */
.ww-react-container :deep(*) {
  box-sizing: border-box;
}
</style>
