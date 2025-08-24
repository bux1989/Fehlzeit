<template>
  <div class="ww-simple-test">
    <h3>WeWeb Component Test</h3>
    <p>Props received: {{ JSON.stringify(content, null, 2) }}</p>
    <p>Component Status: {{ status }}</p>
    <button @click="testEvent">Test Event</button>
  </div>
</template>

<script>
export default {
  name: 'wwSimpleTest',
  props: {
    content: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      status: 'Component loaded successfully'
    };
  },
  mounted() {
    console.log('WeWeb component mounted with props:', this.content);
    this.status = 'Mounted and ready';
  },
  methods: {
    testEvent() {
      this.$emit('trigger-event', { 
        name: 'test', 
        event: { message: 'Test event from WeWeb component' } 
      });
    }
  }
};
</script>

<style scoped>
.ww-simple-test {
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #f9f9f9;
}
</style>