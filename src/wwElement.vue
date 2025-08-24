<template>
  <div class="react-app-wrapper">
    <!-- Loading State -->
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <span>Loading...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <span>{{ error }}</span>
    </div>

    <!-- React App Container -->
    <div v-else ref="reactContainer" class="react-container"></div>
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
    const isLoading = ref(false);
    const error = ref('');
    let reactRoot = null;
    let React = null;
    let ReactDOM = null;

    // Editor state
    const isEditing = computed(() => {
      /* wwEditor:start */
      return props.wwEditorState?.isEditing;
      /* wwEditor:end */
      // eslint-disable-next-line no-unreachable
      return false;
    });

    // Simple React component to render
    const createSimpleReactComponent = () => {
      if (!React) return null;

      return React.createElement('div', {
        style: {
          padding: '20px',
          backgroundColor: '
                    #f0f0f0',
          borderRadius: '4px',
          textAlign: 'center'
        }
      }, [
        React.createElement('h2', {
          style: { color: '
                    #333' }
        }, 'Hello from React!'),
        React.createElement('p', {
          style: { marginTop: '10px' }
        }, 'This is a simple React component rendered inside WeWeb.'),
        React.createElement('button', {
          style: {
            marginTop: '15px',
            padding: '8px 16px',
            backgroundColor: '
                    #4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          },
          onClick: () => {
            if (!isEditing.value) {
              emit('trigger-event', { 
                name: 'buttonClick', 
                event: { message: 'Button clicked!' } 
              });
            }
          }
        }, 'Click Me')
      ]);
    };

    // Load React and ReactDOM
    const loadReactDependencies = async () => {
      isLoading.value = true;
      error.value = '';

      try {
        // Import React and ReactDOM
        const ReactModule = await import('react');
        const ReactDOMModule = await import('react-dom/client');

        React = ReactModule.default;
        ReactDOM = ReactDOMModule.default;

        return true;
      } catch (err) {
        console.error('Failed to load React dependencies:', err);
        error.value = 'Failed to load React dependencies';
        return false;
      } finally {
        isLoading.value = false;
      }
    };

    // Mount React component
    const mountReactComponent = async () => {
      if (!reactContainer.value) return;

      const loaded = await loadReactDependencies();
      if (!loaded) return;

      try {
        // Create root and render component
        reactRoot = ReactDOM.createRoot(reactContainer.value);
        const element = createSimpleReactComponent();
        reactRoot.render(element);
      } catch (err) {
        console.error('Failed to mount React component:', err);
        error.value = 'Failed to mount React component';
      }
    };

    // Unmount React component
    const unmountReactComponent = () => {
      if (reactRoot) {
        try {
          reactRoot.unmount();
        } catch (err) {
          console.error('Failed to unmount React component:', err);
        }
        reactRoot = null;
      }
    };

    // Lifecycle hooks
    onMounted(() => {
      mountReactComponent();
    });

    onBeforeUnmount(() => {
      unmountReactComponent();
    });

    return {
      reactContainer,
      isLoading: computed(() => isLoading.value || props.content?.isLoading),
      error: computed(() => error.value || props.content?.error)
    };
  }
};
</script>

<style scoped>
.react-app-wrapper {
  width: 100%;
  min-height: 200px;
  position: relative;
}

.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  height: 100%;
  min-height: 200px;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 3px solid 
                    #f3f3f3;
  border-top: 3px solid 
                    #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-container {
  padding: 16px;
  background-color: 
                    #ffebee;
  color: 
                    #c62828;
  border-radius: 4px;
  border: 1px solid 
                    #ffcdd2;
}

.react-container {
  width: 100%;
  min-height: 200px;
}
</style>
