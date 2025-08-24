<template>
  <div class="bg-card border border-border rounded-lg">
    <div v-if="props.data.length === 0" class="p-12 text-center">
      <div class="space-y-4">
        <div class="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
          <svg class="h-8 w-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <div>
          <h3>Keine Einträge gefunden</h3>
          <p class="text-muted-foreground mt-2">
            Keine Einträge für den gewählten Zeitraum gefunden.
          </p>
        </div>
        <div class="flex gap-2 justify-center">
          <button class="px-4 py-2 border border-input bg-background hover:bg-accent rounded-md">Filter zurücksetzen</button>
          <button class="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md">Fehlzeit eintragen</button>
        </div>
      </div>
    </div>

    <div v-else class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-border">
            <th class="text-left p-3">
              <button
                class="flex items-center gap-2 hover:bg-transparent font-medium"
                @click="$emit('sort', 'firstName')"
              >
                Vorname
                <svg 
                  v-if="sortBy === 'firstName'"
                  class="h-4 w-4"
                  :class="sortOrder === 'asc' ? '' : 'rotate-180'"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                </svg>
                <svg 
                  v-else
                  class="h-4 w-4 opacity-50" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </button>
            </th>
            <th class="text-left p-3">
              <button
                class="flex items-center gap-2 hover:bg-transparent font-medium"
                @click="$emit('sort', 'lastName')"
              >
                Nachname
                <svg 
                  v-if="sortBy === 'lastName'"
                  class="h-4 w-4"
                  :class="sortOrder === 'asc' ? '' : 'rotate-180'"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                </svg>
                <svg 
                  v-else
                  class="h-4 w-4 opacity-50" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </button>
            </th>
            <th class="text-left p-3">
              <button
                class="flex items-center gap-2 hover:bg-transparent font-medium"
                @click="$emit('sort', 'class')"
              >
                Klasse
                <svg 
                  v-if="sortBy === 'class'"
                  class="h-4 w-4"
                  :class="sortOrder === 'asc' ? '' : 'rotate-180'"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                </svg>
                <svg 
                  v-else
                  class="h-4 w-4 opacity-50" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </button>
            </th>
            <th class="text-left p-3">
              <button
                class="flex items-center gap-2 hover:bg-transparent font-medium"
                @click="$emit('sort', 'time')"
              >
                Zeit
                <svg 
                  v-if="sortBy === 'time'"
                  class="h-4 w-4"
                  :class="sortOrder === 'asc' ? '' : 'rotate-180'"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                </svg>
                <svg 
                  v-else
                  class="h-4 w-4 opacity-50" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </button>
            </th>
            <th class="text-left p-3">
              <button
                class="flex items-center gap-2 hover:bg-transparent font-medium"
                @click="$emit('sort', 'status')"
              >
                Status
                <svg 
                  v-if="sortBy === 'status'"
                  class="h-4 w-4"
                  :class="sortOrder === 'asc' ? '' : 'rotate-180'"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                </svg>
                <svg 
                  v-else
                  class="h-4 w-4 opacity-50" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="entry in props.data" 
            :key="entry.id"
            class="border-b border-border hover:bg-muted/50 cursor-pointer"
            @click="handleRowClick(entry)"
          >
            <td class="p-3">
              <div class="flex items-center gap-2">
                <span>{{ entry.studentName.split(' ')[0] || '' }}</span>
                <div
                  v-if="entry.sourceType === 'eltern-app'"
                  class="relative"
                  @mouseenter="showTooltip = entry.id"
                  @mouseleave="showTooltip = null"
                >
                  <svg class="h-3 w-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div 
                    v-if="showTooltip === entry.id"
                    class="absolute z-10 px-2 py-1 text-xs bg-popover border border-border rounded shadow-lg -top-8 left-0 whitespace-nowrap"
                  >
                    Aus Eltern-App übernommen
                  </div>
                </div>
              </div>
            </td>
            <td class="p-3">{{ entry.studentName.split(' ').slice(1).join(' ') || '' }}</td>
            <td class="p-3">{{ entry.studentClass }}</td>
            <td class="p-3">
              <span v-if="entry.dateRange">{{ entry.dateRange }}</span>
              <span v-else class="text-muted-foreground">ganztägig</span>
            </td>
            <td class="p-3">
              <StatusPill :status="entry.status" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Detail Modal -->
    <FehlzeitDetailModal
      :entry="selectedEntry"
      :is-open="isDetailModalOpen"
      @close="handleCloseDetailModal"
      @edit="(entry) => $emit('edit', entry)"
      @delete="(id) => $emit('delete', id)"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import StatusPill from './StatusPill.vue'
import FehlzeitDetailModal from './FehlzeitDetailModal.vue'

const props = defineProps({
  data: Array,
  sortBy: String,
  sortOrder: String
})

const emit = defineEmits(['edit', 'delete', 'sort'])

const selectedEntry = ref(null)
const isDetailModalOpen = ref(false)
const showTooltip = ref(null)

const handleRowClick = (entry) => {
  selectedEntry.value = entry
  isDetailModalOpen.value = true
}

const handleCloseDetailModal = () => {
  isDetailModalOpen.value = false
  selectedEntry.value = null
}
</script>