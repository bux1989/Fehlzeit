<template>
  <div 
    class="p-6 space-y-6"
    @click="handlePageClick"
  >
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <h1>Fehlzeiten</h1>
      <div class="flex items-center gap-3">
        <div class="relative">
          <button 
            class="flex items-center gap-2 px-3 py-2 text-sm border border-input bg-background rounded-md hover:bg-accent"
            @click="showExportDropdown = !showExportDropdown"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export
          </button>
          <div 
            v-if="showExportDropdown"
            class="absolute right-0 mt-1 w-48 bg-popover border border-border rounded-md shadow-lg z-10"
          >
            <div class="py-1">
              <button class="block w-full px-4 py-2 text-sm text-left hover:bg-accent">CSV exportieren</button>
              <button class="block w-full px-4 py-2 text-sm text-left hover:bg-accent">XLSX exportieren</button>
              <button class="block w-full px-4 py-2 text-sm text-left hover:bg-accent">PDF exportieren</button>
            </div>
          </div>
        </div>
        <button 
          class="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          @click="handleAddEntry"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Fehlzeit eintragen
        </button>
      </div>
    </div>

    <!-- Filters Card -->
    <div class="p-4 bg-card border border-border rounded-lg">
      <div class="flex flex-wrap gap-4 items-end">
        <div class="flex-1 min-w-48">
          <label class="block mb-2">Klasse</label>
          <div class="relative">
            <div
              class="flex items-center justify-between w-full px-3 py-2 border border-input bg-background rounded-md cursor-pointer hover:bg-accent/50"
              @click.stop="toggleClassDropdown"
            >
              <span :class="filters.class ? 'text-foreground' : 'text-muted-foreground'">
                {{ getClassDisplayValue() }}
              </span>
              <div class="flex items-center gap-1">
                <button
                  v-if="filters.class"
                  class="h-4 w-4 p-0 hover:bg-destructive/20 rounded"
                  @click.stop="handleClearClass"
                >
                  <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <svg 
                  class="h-4 w-4 transition-transform"
                  :class="showClassDropdown ? 'rotate-180' : ''"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            
            <div 
              v-if="showClassDropdown"
              class="absolute z-10 w-full mt-1 max-h-64 overflow-hidden border border-border shadow-lg bg-card rounded-md"
            >
              <div class="p-2 border-b">
                <input
                  v-model="classSearchTerm"
                  placeholder="Suchen..."
                  class="w-full px-3 py-2 border border-input bg-input-background rounded-md"
                  @click.stop
                />
              </div>
              <div class="max-h-48 overflow-y-auto">
                <div
                  v-for="className in filteredClassOptions"
                  :key="className"
                  class="p-3 hover:bg-accent cursor-pointer border-b last:border-b-0"
                  :class="{
                    'font-medium': className === 'Alle',
                    'bg-accent': className === getClassDisplayValue()
                  }"
                  @click="handleClassSelect(className)"
                >
                  {{ className }}
                </div>
                <div 
                  v-if="filteredClassOptions.length === 0"
                  class="p-3 text-muted-foreground text-center"
                >
                  Keine Ergebnisse gefunden
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="flex-1 min-w-48">
          <label class="block mb-2">Schüler*in</label>
          <input
            v-model="filters.student"
            placeholder="Schüler*in suchen..."
            class="w-full px-3 py-2 border border-input bg-input-background rounded-md"
          />
        </div>
        
        <div class="flex-1 min-w-64">
          <label class="block mb-2">Datum</label>
          <div class="flex items-center">
            <input
              v-model="filters.dateFrom"
              type="date"
              class="w-full px-3 py-2 border border-input bg-input-background rounded-l-md border-r-0"
            />
            <div class="flex flex-col border border-l-0 rounded-r-md">
              <button
                class="h-4 px-2 rounded-none rounded-tr-md border-b hover:bg-accent"
                @click="adjustDate('up')"
              >
                <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <button
                class="h-4 px-2 rounded-none rounded-br-md hover:bg-accent"
                @click="adjustDate('down')"
              >
                <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <div class="min-w-40">
          <label class="block mb-2">Status</label>
          <select 
            v-model="filters.status"
            class="w-full px-3 py-2 border border-input bg-input-background rounded-md"
          >
            <option value="alle">Alle</option>
            <option value="krankgemeldet">Krankgemeldet</option>
            <option value="unentschuldigt">Unentschuldigt</option>
            <option value="beurlaubt">Beurlaubt</option>
            <option value="ungeklärt">Ungeklärt</option>
            <option value="verspätet">Verspätet</option>
          </select>
        </div>

        <button
          class="flex items-center gap-2 px-4 py-2 border border-input bg-background hover:bg-accent rounded-md"
          @click="resetFilters"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
          </svg>
          Zurücksetzen
        </button>
      </div>
    </div>

    <!-- Results Summary -->
    <div class="text-muted-foreground">
      {{ sortedData.length }} Einträge gefunden
      <span v-if="filteredData.length !== data.length">({{ data.length }} gesamt)</span>
    </div>

    <!-- Main Table -->
    <FehlzeitenTable
      :data="sortedData"
      :sort-by="sortBy"
      :sort-order="sortOrder"
      @edit="handleEditEntry"
      @delete="handleDeleteEntry"
      @sort="handleSort"
    />

    <!-- Add/Edit Modal -->
    <FehlzeitModal
      :is-open="isModalOpen"
      :editing-entry="editingEntry"
      @close="() => isModalOpen = false"
      @save="handleSaveEntry"
    />
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import FehlzeitenTable from './FehlzeitenTable.vue'
import FehlzeitModal from './FehlzeitModal.vue'

// Mock data for available classes
const mockAvailableClasses = [
  '5a', '5b', '6a', '6b', '7a', '7b', '7c', '8a'
]

// Mock data
const mockData = [
  {
    id: '1',
    studentName: 'Mara Klein',
    studentClass: '5b',
    courseClass: '5b – Mathe',
    date: '18.08.2025',
    dateRange: '10:15–11:45',
    duration: 'Zeitfenster',
    status: 'krankgemeldet',
    reason: 'Arzttermin – Nachweis angekündigt',
    hasAttachment: false,
    hasAccess: true,
    createdBy: 'Müller, A.',
    createdAt: '18.08.2025, 08:30',
    sourceType: 'eltern-app'
  },
  {
    id: '2',
    studentName: 'Leon Schmidt',
    studentClass: '5b',
    courseClass: '5b – Deutsch',
    date: '18.08.2025',
    duration: 'Ganzer Tag',
    status: 'unentschuldigt',
    reason: 'Krankheit',
    hasAttachment: true,
    hasAccess: true,
    createdBy: 'Schmidt, B.',
    createdAt: '18.08.2025, 07:45',
    sourceType: 'anwesenheit',
    lastEditedBy: 'MÜL',
    lastEditedAt: '18.08.2025, 09:15'
  },
  // ... (rest of the mock data would go here - truncated for brevity)
]

// Reactive state
const data = ref([...mockData])
const isModalOpen = ref(false)
const editingEntry = ref(null)
const showExportDropdown = ref(false)
const showClassDropdown = ref(false)
const classSearchTerm = ref('')

const filters = reactive({
  class: '',
  student: '',
  dateFrom: '2025-08-18', // Default to Monday of mock week
  status: 'alle'
})

const sortBy = ref('time')
const sortOrder = ref('asc')

// Computed properties
const getClassDisplayValue = () => {
  return filters.class || 'Alle'
}

const allClassOptions = computed(() => ['Alle', ...mockAvailableClasses])

const filteredClassOptions = computed(() => {
  return classSearchTerm.value 
    ? allClassOptions.value.filter(className =>
        className.toLowerCase().includes(classSearchTerm.value.toLowerCase())
      )
    : allClassOptions.value
})

const filteredData = computed(() => {
  return data.value.filter(item => {
    if (filters.class && item.studentClass !== filters.class) return false
    if (filters.student && !item.studentName.toLowerCase().includes(filters.student.toLowerCase())) return false
    if (filters.status !== 'alle' && item.status !== filters.status) return false
    
    // Date filtering
    if (filters.dateFrom) {
      const filterDate = new Date(filters.dateFrom)
      const [day, month, year] = item.date.split('.')
      const itemDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
      
      if (itemDate.toDateString() !== filterDate.toDateString()) return false
    }
    
    return true
  })
})

const sortedData = computed(() => {
  const sorted = [...filteredData.value].sort((a, b) => {
    let aVal, bVal
    
    switch (sortBy.value) {
      case 'firstName':
        aVal = a.studentName.split(' ')[0] || ''
        bVal = b.studentName.split(' ')[0] || ''
        break
      case 'lastName':
        aVal = a.studentName.split(' ').slice(1).join(' ') || ''
        bVal = b.studentName.split(' ').slice(1).join(' ') || ''
        break
      case 'class':
        aVal = a.studentClass
        bVal = b.studentClass
        break
      case 'time':
        aVal = a.dateRange || (a.duration === 'Ganzer Tag' ? '00:00' : 'zzz')
        bVal = b.dateRange || (b.duration === 'Ganzer Tag' ? '00:00' : 'zzz')
        break
      case 'duration':
        aVal = a.duration
        bVal = b.duration
        break
      case 'status':
        aVal = a.status
        bVal = b.status
        break
      case 'createdBy':
        aVal = a.createdBy
        bVal = b.createdBy
        break
      default:
        aVal = a.dateRange || (a.duration === 'Ganzer Tag' ? '00:00' : 'zzz')
        bVal = b.dateRange || (b.duration === 'Ganzer Tag' ? '00:00' : 'zzz')
    }
    
    if (sortOrder.value === 'asc') {
      return aVal.localeCompare(bVal, 'de')
    } else {
      return bVal.localeCompare(aVal, 'de')
    }
  })
  
  return sorted
})

// Methods
const handleAddEntry = () => {
  editingEntry.value = null
  isModalOpen.value = true
}

const handleEditEntry = (entry) => {
  editingEntry.value = entry
  isModalOpen.value = true
}

const handleDeleteEntry = (id) => {
  if (confirm('Fehlzeit wirklich löschen?')) {
    data.value = data.value.filter(item => item.id !== id)
  }
}

const handleSaveEntry = (entry) => {
  const currentTimestamp = new Date().toLocaleDateString('de-DE') + ', ' + new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
  const currentUserAbbreviation = 'AKT'
  
  if (editingEntry.value) {
    // Edit existing
    const index = data.value.findIndex(item => item.id === editingEntry.value.id)
    if (index !== -1) {
      data.value[index] = {
        ...entry,
        id: editingEntry.value.id,
        createdBy: data.value[index].createdBy,
        createdAt: data.value[index].createdAt,
        lastEditedBy: currentUserAbbreviation,
        lastEditedAt: currentTimestamp
      }
    }
  } else {
    // Add new
    const newEntry = {
      ...entry,
      id: Date.now().toString(),
      createdBy: 'Aktueller Nutzer',
      createdAt: currentTimestamp
    }
    data.value.push(newEntry)
  }
  isModalOpen.value = false
}

const handleSort = (field) => {
  if (sortBy.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = field
    sortOrder.value = 'asc'
  }
}

const handleClassSelect = (className) => {
  if (className === 'Alle') {
    filters.class = ''
  } else {
    filters.class = className
  }
  showClassDropdown.value = false
  classSearchTerm.value = ''
}

const handleClearClass = () => {
  filters.class = ''
  classSearchTerm.value = ''
}

const toggleClassDropdown = () => {
  showClassDropdown.value = !showClassDropdown.value
  classSearchTerm.value = ''
}

const adjustDate = (direction) => {
  const currentDate = new Date(filters.dateFrom)
  if (direction === 'up') {
    currentDate.setDate(currentDate.getDate() + 1)
  } else {
    currentDate.setDate(currentDate.getDate() - 1)
  }
  filters.dateFrom = currentDate.toISOString().split('T')[0]
}

const resetFilters = () => {
  filters.class = ''
  filters.student = ''
  filters.dateFrom = '2025-08-18'
  filters.status = 'alle'
  classSearchTerm.value = ''
}

const handlePageClick = () => {
  if (showClassDropdown.value) {
    showClassDropdown.value = false
    classSearchTerm.value = ''
  }
  if (showExportDropdown.value) {
    showExportDropdown.value = false
  }
}
</script>