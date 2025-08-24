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
    <div v-else ref="reactContainer" class="react-container">
      <div class="fallback-content">
        <h2>React Component Placeholder</h2>
        <p>This is a placeholder for the React component.</p>
        <button @click="handleButtonClick" class="demo-button">Click Me</button>
        <p class="mt-2 text-xs">
          React ready: <strong>{{ reactAvailable ? 'yes' : 'no' }}</strong> ·
          Mounted: <strong>{{ reactMounted ? 'yes' : 'no' }}</strong>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

export default {
  name: 'ReactMountStep1',
  props: {
    // WeWeb may still pass null, so we normalize in computed below
    content: { type: Object, default: () => ({}) },
    uid: { type: String, required: true },
    /* wwEditor:start */
    wwEditorState: { type: Object, required: true },
    /* wwEditor:end */
  },
  emits: ['trigger-event'],
  setup(props, { emit }) {
    const reactContainer = ref(null);
    const loadingState = ref(false);
    const errorState = ref('');
    const reactMounted = ref(false);
    const reactAvailable = ref(false);
    let reactRoot = null;

    // Normalize content so no consumer ever reads null
    const safeContent = computed(() => {
      const c = (props.content && typeof props.content === 'object') ? props.content : {};
      return {
        isLoading: !!c.isLoading,
        error: (c.error ?? ''),
        loadingText: (typeof c.loadingText === 'string' ? c.loadingText : 'Lädt Daten...'),
        emptyText: (typeof c.emptyText === 'string' ? c.emptyText : 'Keine Fehlzeiten vorhanden'),
        // always an array
        data: Array.isArray(c.data) ? c.data : [],
        availableClasses: Array.isArray(c.availableClasses) ? c.availableClasses : [],
        currentUser: c.currentUser ?? null,
        readonly: !!c.readonly,
      };
    });

    const isEditing = computed(() => {
      /* wwEditor:start */
      return !!props.wwEditorState?.isEditing;
      /* wwEditor:end */
      // eslint-disable-next-line no-unreachable
      return false;
    });

    const isLoading = computed(() => loadingState.value || safeContent.value.isLoading);
    const error = computed(() => errorState.value || safeContent.value.error);

    const emitSafe = (name, eventObj) => {
      // ensure an object for WeWeb's internal Object.keys usage
      const payload = (eventObj && typeof eventObj === 'object') ? eventObj : {};
      try {
        emit('trigger-event', { name, event: payload });
      } catch (e) {
        // never throw to WeWeb
        console.error('[ReactMountStep1] emit error', e);
      }
    };

    const handleButtonClick = () => {
      if (isEditing.value) return;
      console.log('[ReactMountStep1] Button clicked!');
      emitSafe('buttonClick', { message: 'Button clicked!' });
    };

    onMounted(() => {
      console.log('[ReactMountStep1] onMounted — checking for React globals…');

      const hasReact = typeof window !== 'undefined'
        && window.React
        && window.ReactDOM
        && typeof window.ReactDOM.createRoot === 'function';

      reactAvailable.value = !!hasReact;
      console.log('[ReactMountStep1] React available?', hasReact);

      emitSafe('reactReady', { available: !!hasReact });

      if (!hasReact) {
        console.warn('[ReactMountStep1] No React detected on window — keeping Vue placeholder.');
        return;
      }

      try {
        const el = reactContainer.value;
        if (!el) {
          console.error('[ReactMountStep1] No reactContainer element found!');
          return;
        }

        console.log('[ReactMountStep1] Creating React root…');
        reactRoot = window.ReactDOM.createRoot(el);

        const Hello = () =>
          window.React.createElement('div', { className: 'p-2' }, 'Hello from React (Step 1)');
        const tree = window.React.createElement(Hello);

        console.log('[ReactMountStep1] Rendering React element…');
        reactRoot.render(tree);
        reactMounted.value = true;

        console.log('[ReactMountStep1] React mounted successfully.');
        emitSafe('reactMounted', { mounted: true });
      } catch (e) {
        errorState.value = `React mount failed: ${e?.message || String(e)}`;
        console.error('[ReactMountStep1] React mount failed:', e);
        emitSafe('error', { error: errorState.value });
      }
    });

    onBeforeUnmount(() => {
      console.log('[ReactMountStep1] onBeforeUnmount');
      try {
        if (reactRoot) {
          console.log('[ReactMountStep1] Unmounting React root…');
          reactRoot.unmount?.();
          reactRoot = null;
          reactMounted.value = false;
          emitSafe('reactMounted', { mounted: false });
        }
      } catch (e) {
        console.error('[ReactMountStep1] Error during unmount:', e);
      }
    });

    return {
      reactContainer,
      safeContent,
      isLoading,
      error,
      handleButtonClick,
      reactMounted,
      reactAvailable,
    };
  }
};
</script>

<style scoped>
.react-app-wrapper { width: 100%; min-height: 200px; position: relative; }

.loading-container { display: flex; align-items: center; justify-content: center; padding: 20px; height: 100%; min-height: 200px; }
.loading-spinner { width: 24px; height: 24px; border: 3px solid #f3f3f3; border-top: 3px solid #3498db; border-radius: 50%; animation: spin 1s linear infinite; margin-right: 10px; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

.error-container { padding: 16px; background-color: #ffebee; color: #c62828; border-radius: 4px; border: 1px solid #ffcdd2; }

.react-container { width: 100%; min-height: 200px; }
.fallback-content { padding: 20px; background-color: #f0f0f0; border-radius: 4px; text-align: center; }

.demo-button { margin-top: 15px; padding: 8px 16px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; }
.demo-button:hover { background-color: #45a049; }
</style>
