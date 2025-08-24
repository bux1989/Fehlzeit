<template>
  <div class="ww-fehlzeiten-dashboard">
    <div v-if="content?.isLoading">Loading...</div>
    <div v-else-if="content?.error">{{ content.error }}</div>
    <div v-else>
      <input 
        type="text" 
        :value="content?.data" 
        @click="handleClick" 
        required 
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    content: { 
      type: Object, 
      default: () => ({}) 
    }
  },
  methods: {
    handleClick() {
      this.$emit('trigger-event', { name: 'addEntry' });
    }
  }
};
</script>

<style scoped>
.ww-fehlzeiten-dashboard {
  width: 100%;
}
</style>
