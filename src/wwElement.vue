<template>
<div class="ww-fehlzeiten-dashboard">
  <!-- Loading State -->
  <div v-if="content?.isLoading" class="flex items-center justify-center p-8">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    <span class="ml-3 text-gray-600">{{ content?.loadingText || 'Lädt Daten...' }}</span>
  </div>

  <!-- Error State -->
  <div v-else-if="content?.error" class="p-6 border border-red-200 rounded-lg bg-red-50">
    <span class="text-red-800">{{ content?.error }}</span>
  </div>

  <!-- Empty State -->
  <div v-else-if="!content?.data || content?.data.length === 0" class="text-center p-8 text-gray-500">
    <p>{{ content?.emptyText || 'Keine Fehlzeiten vorhanden' }}</p>
  </div>

  <!-- React App Container -->
  <div v-else ref="reactContainer" class="ww-react-container"></div>
</div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';

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
    wwEditorState: { 
      type: Object, 
      required: true 
    }
  },
  emits: ['trigger-event'],
  setup(props, { emit }) {
    const reactContainer = ref(null);

    const isEditing = computed(() => {
      return props.wwEditorState?.isEditing || false;
    });

    const handleError = (error) => {
      emit('trigger-event', { 
        name: 'error', 
        event: { error: error?.message || String(error) } 
      });
    };

    onMounted(async () => {
      try {
        // Minimal React component mounting logic
        const React = await import('react');
        const ReactDOM = await import('react-dom/client');
        const FehlzeitenModule = await import('./FehlzeitenPageWrapper');

        if (!reactContainer.value) return;

        const root = ReactDOM.createRoot(reactContainer.value);
        const FehlzeitenPageWrapper = FehlzeitenModule.default;

        root.render(
          React.createElement(FehlzeitenPageWrapper, {
            data: props.content?.data || [],
            isEditing: isEditing.value
          })
        );
      } catch (error) {
        console.error('Failed to mount React component:', error);
        handleError(error);
      }
    });

    return {
      reactContainer
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
}
</style>
