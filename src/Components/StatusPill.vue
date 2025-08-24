<template>
  <div class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium" :class="statusClasses">
    <component :is="statusIcon" class="h-3 w-3" />
    {{ statusText }}
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: String
})

const statusConfig = computed(() => {
  switch (props.status) {
    case 'krankgemeldet':
      return {
        classes: 'bg-green-100 text-green-800 border border-green-200',
        text: 'Krankgemeldet',
        icon: 'CheckIcon'
      }
    case 'beurlaubt':
      return {
        classes: 'bg-blue-100 text-blue-800 border border-blue-200',
        text: 'Beurlaubt',
        icon: 'ShieldIcon'
      }
    case 'verspätet':
      return {
        classes: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
        text: 'Verspätet',
        icon: 'ClockIcon'
      }
    case 'ungeklärt':
      return {
        classes: 'bg-gray-100 text-gray-800 border border-gray-200',
        text: 'Ungeklärt',
        icon: 'HelpIcon'
      }
    case 'unentschuldigt':
      return {
        classes: 'bg-red-100 text-red-800 border border-red-200',
        text: 'Unentschuldigt',
        icon: 'AlertIcon'
      }
    default:
      return {
        classes: 'bg-gray-100 text-gray-800 border border-gray-200',
        text: 'Unbekannt',
        icon: 'HelpIcon'
      }
  }
})

const statusClasses = computed(() => statusConfig.value.classes)
const statusText = computed(() => statusConfig.value.text)
const statusIcon = computed(() => {
  const iconMap = {
    CheckIcon: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, 
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M5 13l4 4L19 7' })
    ),
    ShieldIcon: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, 
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' })
    ),
    ClockIcon: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, 
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' })
    ),
    AlertIcon: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, 
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z' })
    ),
    HelpIcon: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, 
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' })
    )
  }
  return iconMap[statusConfig.value.icon] || iconMap.HelpIcon
})
</script>