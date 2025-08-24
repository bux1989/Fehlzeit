<script>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

export default {
  name: 'ReactMountStep1',
  props: { content: { type: Object, default: () => ({}) }, uid: { type: String, required: true }, /* wwEditor:start */ wwEditorState: { type: Object, required: true }, /* wwEditor:end */ },
  emits: ['trigger-event'],
  setup(props, { emit }) {
    const reactContainer = ref(null);
    const loadingState = ref(false);
    const errorState = ref('');
    const reactMounted = ref(false);
    const reactAvailable = ref(false);
    let reactRoot = null;
    let reactPollTimer = null;

    const isEditing = computed(() => { /* wwEditor:start */ return !!props.wwEditorState?.isEditing; /* wwEditor:end */ return false; });
    const isLoading = computed(() => loadingState.value || props.content?.isLoading);
    const error = computed(() => errorState.value || props.content?.error);

    const handleButtonClick = () => {
      if (isEditing.value) return;
      console.log('[ReactMountStep1] Button clicked!');
      emit('trigger-event', { name: 'buttonClick', event: { message: 'Button clicked!' } });
    };

    const hasReact = () =>
      typeof window !== 'undefined' &&
      window.React &&
      window.ReactDOM &&
      typeof window.ReactDOM.createRoot === 'function';

    const tryMount = () => {
      try {
        const el = reactContainer.value;
        if (!el) return;
        reactRoot = window.ReactDOM.createRoot(el);
        const Hello = () => window.React.createElement('div', { className: 'p-2' }, 'Hello from React (Step 1)');
        reactRoot.render(window.React.createElement(Hello));
        reactMounted.value = true;
        emit('trigger-event', { name: 'reactMounted', event: { mounted: true } });
        console.log('[ReactMountStep1] React mounted successfully.');
      } catch (e) {
        errorState.value = `React mount failed: ${e?.message || String(e)}`;
        console.error('[ReactMountStep1] React mount failed:', e);
        emit('trigger-event', { name: 'error', event: { error: errorState.value } });
      }
    };

    onMounted(() => {
      console.log('[ReactMountStep1] onMounted — waiting for React globals…');
      const start = Date.now();
      const timeoutMs = 5000;
      const intervalMs = 100;

      const tick = () => {
        const available = hasReact();
        if (available) {
          reactAvailable.value = true;
          emit('trigger-event', { name: 'reactReady', event: { available: true } });
          clearInterval(reactPollTimer);
          reactPollTimer = null;
          tryMount();
          return;
        }
        if (Date.now() - start >= timeoutMs) {
          reactAvailable.value = false;
          emit('trigger-event', { name: 'reactReady', event: { available: false } });
          clearInterval(reactPollTimer);
          reactPollTimer = null;
          console.warn('[ReactMountStep1] React not found after 5s — keeping placeholder.');
        }
      };

      // immediate check + poll
      tick();
      if (!reactAvailable.value) {
        reactPollTimer = setInterval(tick, intervalMs);
      }
    });

    onBeforeUnmount(() => {
      try { if (reactPollTimer) clearInterval(reactPollTimer); } catch {}
      try {
        if (reactRoot) {
          reactRoot.unmount?.();
          reactRoot = null;
          reactMounted.value = false;
          emit('trigger-event', { name: 'reactMounted', event: { mounted: false } });
        }
      } catch (e) { console.error('[ReactMountStep1] Error during unmount:', e); }
    });

    return { reactContainer, isLoading, error, handleButtonClick, reactMounted, reactAvailable };
  }
};
</script>
