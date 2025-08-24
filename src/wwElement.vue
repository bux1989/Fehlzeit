<template>
  <div class="ww-fehlzeiten-dashboard">
    <!-- Loading State -->
    <div v-if="content?.isLoading" class="flex items-center justify-center p-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      <span class="ml-3 text-gray-600">{{ content?.loadingText || 'Lädt Daten...' }}</span>
    </div>

    <!-- Error State -->
    <div v-else-if="content?.error" class="p-6 border border-red-200 rounded-lg bg-red-50">
      <div class="flex items-center">
        <svg class="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 
               1.414L8.586 10l-1.293 1.293a1 1 0 101.414 
               1.414L10 11.414l1.293 1.293a1 1 0 
               001.414-1.414L11.414 10l1.293-1.293a1 
               1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clip-rule="evenodd"></path>
        </svg>
        <span class="text-red-800">{{ content?.error }}</span>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!content?.data || content?.data.length === 0" class="text-center p-8 text-gray-500">
      <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor"
        viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 
             0 012-2h5.586a1 1 0 01.707.293l5.414 
             5.414a1 1 0 01.293.707V19a2 2 0 
             01-2 2z"></path>
      </svg>
      <p>{{ content?.emptyText || 'Keine Fehlzeiten vorhanden' }}</p>
    </div>

    <!-- React App Container -->
    <div v-else ref="reactContainer" class="ww-react-container">
      <!-- Placeholder in case React fails to mount -->
      <div class="p-4 text-sm text-gray-500">
        <p>React Placeholder (waiting for fehlzeiten-app.umd.js)</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

export default {
  name: 'FehlzeitenWeWebElement',
  props: {
    content: { type: Object, default: () => ({}) },
    uid: { type: String, required: true },
    /* wwEditor:start */
    wwEditorState: { type: Object, required: true },
    /* wwEditor:end */
  },
  emits: ['trigger-event'],
  setup(props, { emit }) {
    const reactContainer = ref(null);
    let unmountFn = null;

    const getReactProps = () => ({
      data: Array.isArray(props.content?.data) ? props.content.data : [],
      availableClasses: Array.isArray(props.content?.availableClasses)
        ? props.content.availableClasses
        : [],
      currentUser: props.content?.currentUser ?? null,
      readonly: !!props.content?.readonly,
      isEditing: !!props.wwEditorState?.isEditing,
      onAddEntry: () => emit('trigger-event', { name: 'addEntry', event: {} }),
      onEditEntry: (entry) => emit('trigger-event', { name: 'editEntry', event: { entry } }),
      onDeleteEntry: (id) => emit('trigger-event', { name: 'deleteEntry', event: { entryId: id } }),
      onFilterChange: (filters) =>
        emit('trigger-event', { name: 'filterChange', event: { filters } }),
      onSortChange: (sortConfig) =>
        emit('trigger-event', { name: 'sortChange', event: { sortConfig } }),
      onError: (e) =>
        emit('trigger-event', { name: 'error', event: { error: e?.message || String(e) } }),
    });

    onMounted(() => {
      const el = reactContainer.value;
      if (!el) return;

      const app = window.FehlzeitenApp; // provided by fehlzeiten-app.umd.js
      if (app?.mount) {
        unmountFn = app.mount(el, getReactProps());
        emit('trigger-event', { name: 'reactMounted', event: { mounted: true } });
        console.log('[WeWeb] React app mounted');
      } else {
        console.warn(
          '[WeWeb] window.FehlzeitenApp.mount not found — did you add fehlzeiten-app.umd.js as an External script?'
        );
      }
    });

    onBeforeUnmount(() => {
      try {
        if (unmountFn) {
          unmountFn();
          console.log('[WeWeb] React app unmounted');
        }
      } catch (e) {
        console.error('[WeWeb] Error during unmount', e);
      }
    });

    return {
      reactContainer,
    };
  },
};
</script>

<style scoped>
.ww-fehlzeiten-dashboard {
  width: 100%;
  min-height: 400px;
}
.ww-react-container {
  width: 100%;
  min-height: 200px;
  border: 1px dashed #e5e7eb;
  border-radius: 0.5rem;
}
</style>
