<template>
  <div class="ww-fehlzeiten-dashboard">
    <!-- Loading -->
    <div v-if="content?.isLoading" class="flex items-center justify-center p-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      <span class="ml-3 text-gray-600">{{ content?.loadingText || 'Lädt Daten...' }}</span>
    </div>

    <!-- Error -->
    <div v-else-if="content?.error" class="p-6 border border-red-200 rounded-lg bg-red-50">
      <div class="flex items-center">
        <svg class="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
        </svg>
        <span class="text-red-800">{{ content?.error }}</span>
      </div>
    </div>

    <!-- Empty -->
    <div v-else-if="!content?.data || content?.data.length === 0" class="text-center p-8 text-gray-500">
      <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
      </svg>
      <p>{{ content?.emptyText || 'Keine Fehlzeiten vorhanden' }}</p>
    </div>

    <!-- Mount point -->
    <div v-else class="p-4">
      <div class="mb-2 text-sm text-gray-500">
        React: <b>{{ reactAvailable ? 'ready' : 'no' }}</b> ·
        Wrapper: <b>{{ wrapperAvailable ? 'ready' : 'no' }}</b> ·
        Mounted: <b>{{ reactMounted ? 'yes' : 'no' }}</b>
      </div>
      <div ref="reactContainer" class="ww-react-container"></div>

      <!-- Basic Vue list stays (debug) -->
      <ul class="mt-4 space-y-1">
        <li v-for="row in content.data" :key="row.id" class="text-sm">
          <span class="font-medium">{{ row?.name || row?.title || 'Eintrag' }}</span>
          <span class="text-gray-500 ml-2">#{{ row?.id ?? '—' }}</span>
          <button v-if="!readonly && !isEditing" class="ml-3 underline" @click="handleEditEntry(row)">Bearbeiten</button>
        </li>
      </ul>

      <div class="mt-4 flex gap-3">
        <button v-if="!readonly && !isEditing" class="px-3 py-1 rounded bg-gray-100" @click="handleAddEntry">Neuer Eintrag</button>
        <button class="px-3 py-1 rounded bg-gray-100" @click="emitFilter">Filter ändern (Demo)</button>
        <button class="px-3 py-1 rounded bg-gray-100" @click="emitSort">Sortierung ändern (Demo)</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';

export default {
  name: 'FehlzeitenWeWebStep3',
  props: {
    content: { type: Object, default: () => ({}) },
    uid: { type: String, required: true },
    /* wwEditor:start */ wwEditorState: { type: Object, required: true }, /* wwEditor:end */
  },
  emits: ['trigger-event'],
  setup(props, { emit }) {
    const reactContainer = ref(null);
    const reactMounted = ref(false);
    const reactAvailable = ref(false);
    const wrapperAvailable = ref(false);
    let reactRoot = null;

    const isEditing = computed(() => { /* wwEditor:start */ return props.wwEditorState?.isEditing; /* wwEditor:end */ return false; });
    const readonly = computed(() => props.content?.readonly || false);

    // Map Vue -> React props, including event bridges
    const getReactProps = () => ({
      data: props.content?.data || [],
      availableClasses: props.content?.availableClasses || [],
      currentUser: props.content?.currentUser || null,
      readonly: props.content?.readonly || false,
      isEditing: isEditing.value,
      onAddEntry: () => { if (!isEditing.value) emit('trigger-event', { name: 'addEntry', event: {} }); },
      onEditEntry: (entry) => { if (!isEditing.value) emit('trigger-event', { name: 'editEntry', event: { entry } }); },
      onDeleteEntry: (entryId) => { if (!isEditing.value) emit('trigger-event', { name: 'deleteEntry', event: { entryId } }); },
      onFilterChange: (filters) => { if (!isEditing.value) emit('trigger-event', { name: 'filterChange', event: { filters } }); },
      onSortChange: (sortConfig) => { if (!isEditing.value) emit('trigger-event', { name: 'sortChange', event: { sortConfig } }); },
      onError: (error) => emit('trigger-event', { name: 'error', event: { error: error?.message || String(error) } }),
    });

    const mountReact = () => {
      const hasReact = typeof window !== 'undefined'
        && window.React && window.ReactDOM
        && typeof window.ReactDOM.createRoot === 'function';

      reactAvailable.value = !!hasReact;
      emit('trigger-event', { name: 'reactReady', event: { available: !!hasReact } });
      if (!hasReact) return;

      const Wrapper = window.FehlzeitenPageWrapper;
      wrapperAvailable.value = !!Wrapper;
      emit('trigger-event', { name: 'wrapperReady', event: { available: !!Wrapper } });

      const el = reactContainer.value;
      if (!el) return;

      try {
        reactRoot = window.ReactDOM.createRoot(el);
        let element;

        if (Wrapper) {
          element = window.React.createElement(Wrapper, getReactProps());
        } else {
          // Fallback debug node if wrapper not yet loaded
          const DebugHello = (p) =>
            window.React.createElement('div', { style: { padding: '8px', fontSize: 14 } },
              `Hello from React (fallback). Items: ${(props.content?.data || []).length}`
            );
          element = window.React.createElement(DebugHello);
        }

        reactRoot.render(element);
        reactMounted.value = true;
        emit('trigger-event', { name: 'reactMounted', event: { mounted: true } });
      } catch (e) {
        emit('trigger-event', { name: 'error', event: { error: `React mount failed: ${e?.message || String(e)}` } });
      }
    };

    const rerenderReact = () => {
      if (!reactRoot || !reactMounted.value || !window.React) return;
      const Wrapper = window.FehlzeitenPageWrapper;
      const element = Wrapper
        ? window.React.createElement(Wrapper, getReactProps())
        : window.React.createElement('div', null, `Hello from React (fallback). Items: ${(props.content?.data || []).length}`);
      reactRoot.render(element);
    };

    onMounted(mountReact);
    onBeforeUnmount(() => {
      try {
        if (reactRoot) {
          reactRoot.unmount?.();
          reactRoot = null;
          reactMounted.value = false;
          emit('trigger-event', { name: 'reactMounted', event: { mounted: false } });
        }
      } catch (_) {}
    });

    // Re-render React when content changes
    watch(() => props.content, () => { rerenderReact(); }, { deep: true });

    // Vue-side buttons (still useful)
    const handleAddEntry = () => { if (isEditing.value) return; emit('trigger-event', { name: 'addEntry', event: {} }); };
    const handleEditEntry = (entry) => { if (isEditing.value) return; emit('trigger-event', { name: 'editEntry', event: { entry } }); };
    const handleDeleteEntry = (entryId) => { if (isEditing.value) return; emit('trigger-event', { name: 'deleteEntry', event: { entryId } }); };
    const emitFilter = () => { if (isEditing.value) return; emit('trigger-event', { name: 'filterChange', event: { filters: { demo: true } } }); };
    const emitSort = () => { if (isEditing.value) return; emit('trigger-event', { name: 'sortChange', event: { sortConfig: { field: 'id', dir: 'asc' } } }); };

    return {
      reactContainer,
      isEditing,
      readonly,
      handleAddEntry,
      handleEditEntry,
      handleDeleteEntry,
      emitFilter,
      emitSort,
      reactMounted,
      reactAvailable,
      wrapperAvailable,
    };
  },
};
</script>

<style scoped>
.ww-fehlzeiten-dashboard { width: 100%; min-height: 400px; }
.ww-react-container { width: 100%; min-height: 160px; border: 1px dashed #e5e7eb; border-radius: 0.5rem; }
.ww-react-container :deep(*) { box-sizing: border-box; }
</style>
