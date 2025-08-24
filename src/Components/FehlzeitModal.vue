<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
    <div 
      class="bg-background border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      @click.stop
    >
      <!-- Header -->
      <div class="p-4 border-b border-border">
        <h2>
          {{ editingEntry ? 'Fehlzeit bearbeiten' : 'Fehlzeit eintragen' }}
        </h2>
      </div>

      <!-- Content -->
      <div class="p-4 space-y-6">
        <!-- Student Selection -->
        <div class="space-y-2">
          <label for="student">Schüler*in *</label>
          <div class="relative">
            <input
              id="student"
              v-model="studentSearch"
              @input="handleStudentSearchInput"
              @focus="handleStudentSearchFocus"
              placeholder="Schüler*in suchen..."
              :class="[
                'w-full px-3 py-2 border border-input bg-input-background rounded-md',
                errors.studentName ? 'border-destructive' : ''
              ]"
            />
            <div 
              v-if="showStudentSuggestions && studentSearch.length > 0 && filteredStudents.length > 0"
              class="absolute z-10 w-full mt-1 max-h-40 overflow-y-auto bg-card border border-border rounded-md shadow-lg"
            >
              <div
                v-for="(student, index) in filteredStudents"
                :key="index"
                class="hover:bg-accent cursor-pointer border-b last:border-b-0"
                @click="handleStudentSelect(student)"
              >
                <div class="px-3 py-0">{{ student.name }} ({{ student.class }})</div>
              </div>
            </div>
          </div>
          <p v-if="errors.studentName" class="text-sm text-destructive">{{ errors.studentName }}</p>
          <p v-if="formData.studentClass" class="text-sm text-muted-foreground">
            Klasse: {{ formData.courseClass }}
          </p>
        </div>

        <!-- Date and Time -->
        <div class="space-y-4">
          <div class="flex items-center space-x-2">
            <input
              id="fullDay"
              v-model="isFullDay"
              type="checkbox"
              class="rounded border-input"
              @change="handleDurationChange"
            />
            <label for="fullDay">Ganzer Tag</label>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="space-y-2">
              <label for="date">Datum *</label>
              <input
                id="date"
                v-model="formData.date"
                type="date"
                :class="[
                  'w-full px-3 py-2 border border-input bg-input-background rounded-md',
                  errors.date ? 'border-destructive' : ''
                ]"
              />
              <p v-if="errors.date" class="text-sm text-destructive">{{ errors.date }}</p>
            </div>

            <template v-if="!isFullDay">
              <div class="space-y-2">
                <label for="timeFrom">Von</label>
                <input
                  id="timeFrom"
                  v-model="formData.timeFrom"
                  type="time"
                  :class="[
                    'w-full px-3 py-2 border border-input bg-input-background rounded-md',
                    errors.timeRange ? 'border-destructive' : ''
                  ]"
                />
              </div>
              <div class="space-y-2">
                <label for="timeTo">Bis</label>
                <input
                  id="timeTo"
                  v-model="formData.timeTo"
                  type="time"
                  :class="[
                    'w-full px-3 py-2 border border-input bg-input-background rounded-md',
                    errors.timeRange ? 'border-destructive' : ''
                  ]"
                />
              </div>
            </template>
          </div>
          <p v-if="errors.timeRange" class="text-sm text-destructive">{{ errors.timeRange }}</p>
        </div>

        <!-- Source Type (Read-only) -->
        <div class="space-y-2">
          <label>Art der Meldung</label>
          <div class="flex items-center gap-2 p-3 bg-muted/50 rounded-md">
            <svg class="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              <template v-if="formData.sourceType === 'eltern-app'">Eltern-App</template>
              <template v-if="formData.sourceType === 'anwesenheit'">Anwesenheit/Klassenbuch</template>
              <template v-if="formData.sourceType === 'schuleingabe'">Schuleingabe</template>
            </span>
          </div>
          <p class="text-sm text-muted-foreground">
            Diese Information kann nicht geändert werden.
          </p>
        </div>

        <!-- Status -->
        <div class="space-y-2">
          <label for="status">Status</label>
          <select 
            v-model="formData.status"
            :disabled="formData.sourceType === 'eltern-app'"
            class="w-full px-3 py-2 border border-input bg-input-background rounded-md"
          >
            <option value="unentschuldigt">Unentschuldigt</option>
            <option value="krankgemeldet">Krankgemeldet</option>
            <option value="beurlaubt">Beurlaubt</option>
            <option value="ungeklärt">Ungeklärt</option>
            <option value="verspätet">Verspätet</option>
          </select>
          <p v-if="formData.sourceType === 'eltern-app'" class="text-sm text-muted-foreground">
            Einträge aus der Eltern-App werden automatisch als "Krankgemeldet" gesetzt.
          </p>
        </div>

        <!-- Reason -->
        <div class="space-y-2">
          <label for="reason">Grund</label>
          <textarea
            id="reason"
            v-model="formData.reason"
            placeholder="Grund für die Fehlzeit..."
            rows="3"
            class="w-full px-3 py-2 border border-input bg-input-background rounded-md"
          ></textarea>
        </div>

        <!-- File Upload -->
        <div class="space-y-2">
          <label>Nachweis hochladen</label>
          <div class="border-2 border-dashed border-border rounded-lg p-4">
            <div v-if="uploadedFile" class="flex items-center justify-between">
              <span class="text-sm">{{ uploadedFile.name }}</span>
              <button
                type="button"
                class="p-1 hover:bg-accent rounded"
                @click="clearUploadedFile"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <label v-else class="flex flex-col items-center cursor-pointer">
              <svg class="h-8 w-8 text-muted-foreground mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span class="text-sm text-muted-foreground text-center">
                PDF, JPG oder PNG hochladen
              </span>
              <input
                type="file"
                class="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                @change="handleFileUpload"
              />
            </label>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-4 border-t border-border flex justify-end gap-2">
        <button
          type="button"
          class="px-4 py-2 border border-input bg-background hover:bg-accent rounded-md"
          @click="$emit('close')"
        >
          Abbrechen
        </button>
        <button
          type="button"
          class="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md disabled:opacity-50"
          :disabled="!isFormValid"
          @click="handleSave"
        >
          Speichern
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'

const props = defineProps({
  isOpen: Boolean,
  editingEntry: Object
})

const emit = defineEmits(['close', 'save'])

// Mock student data
const mockStudents = [
  { name: 'Mara Klein', class: '5b', fullClass: '5b – Mathe' },
  { name: 'Leon Schmidt', class: '5b', fullClass: '5b – Deutsch' },
  { name: 'Emma Taylor', class: '6a', fullClass: '6a – Englisch' },
  { name: 'Max Müller', class: '7c', fullClass: '7c – Geschichte' },
  { name: 'Anna Lange', class: '5b', fullClass: '5b – Mathe' },
  { name: 'Tim Berg', class: '6a', fullClass: '6a – Mathe' },
  { name: 'Sophie Richter', class: '7a', fullClass: '7a – Physik' },
  { name: 'Lucas Weber', class: '5a', fullClass: '5a – Englisch' },
  { name: 'Lara Hansen', class: '6b', fullClass: '6b – Deutsch' },
  { name: 'Felix Graf', class: '8a', fullClass: '8a – Informatik' },
  { name: 'Nina Peters', class: '7b', fullClass: '7b – Biologie' },
  { name: 'Julian Fischer', class: '5a', fullClass: '5a – Mathe' },
  { name: 'Lea Cohen', class: '6a', fullClass: '6a – Geschichte' },
  { name: 'David Koch', class: '7a', fullClass: '7a – Chemie' },
  { name: 'Maya Schulz', class: '5b', fullClass: '5b – Englisch' }
]

// Reactive state
const formData = reactive({
  studentName: '',
  studentClass: '',
  courseClass: '',
  date: '',
  timeFrom: '',
  timeTo: '',
  duration: 'Ganzer Tag',
  status: 'krankgemeldet',
  reason: '',
  hasAttachment: false,
  hasAccess: true,
  sourceType: 'schuleingabe'
})

const isFullDay = ref(true)
const studentSearch = ref('')
const showStudentSuggestions = ref(false)
const uploadedFile = ref(null)
const errors = ref({})

// Computed properties
const filteredStudents = computed(() => {
  return mockStudents.filter(student =>
    student.name.toLowerCase().includes(studentSearch.value.toLowerCase())
  )
})

const isFormValid = computed(() => {
  return formData.studentName.trim() && 
         formData.date && 
         (isFullDay.value || (formData.timeFrom && formData.timeTo))
})

// Methods
const handleStudentSearchInput = (e) => {
  studentSearch.value = e.target.value
  showStudentSuggestions.value = e.target.value.length > 0
}

const handleStudentSearchFocus = () => {
  showStudentSuggestions.value = studentSearch.value.length > 0
}

const handleStudentSelect = (student) => {
  Object.assign(formData, {
    studentName: student.name,
    studentClass: student.class,
    courseClass: student.fullClass
  })
  studentSearch.value = student.name
  showStudentSuggestions.value = false
}

const handleDurationChange = () => {
  formData.duration = isFullDay.value ? 'Ganzer Tag' : 'Zeitfenster'
}

const handleFileUpload = (event) => {
  const file = event.target.files?.[0]
  if (file) {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png']
    if (allowedTypes.includes(file.type)) {
      uploadedFile.value = file
      formData.hasAttachment = true
    } else {
      alert('Nur PDF, JPG und PNG Dateien sind erlaubt.')
    }
  }
}

const clearUploadedFile = () => {
  uploadedFile.value = null
  formData.hasAttachment = false
}

const validateForm = () => {
  const newErrors = {}

  if (!formData.studentName.trim()) {
    newErrors.studentName = 'Schüler*in ist erforderlich'
  }
  if (!formData.date) {
    newErrors.date = 'Datum ist erforderlich'
  }
  if (!isFullDay.value && (!formData.timeFrom || !formData.timeTo)) {
    newErrors.timeRange = 'Zeitfenster ist erforderlich'
  }

  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

const handleSave = () => {
  if (!validateForm()) return

  const dateRange = !isFullDay.value && formData.timeFrom && formData.timeTo
    ? `${formData.timeFrom}–${formData.timeTo}`
    : undefined

  const finalStatus = formData.sourceType === 'eltern-app' ? 'krankgemeldet' : formData.status

  const entryData = {
    studentName: formData.studentName,
    studentClass: formData.studentClass,
    courseClass: formData.courseClass,
    date: new Date(formData.date).toLocaleDateString('de-DE'),
    dateRange,
    duration: formData.duration,
    status: finalStatus,
    reason: formData.reason,
    hasAttachment: formData.hasAttachment,
    hasAccess: formData.hasAccess,
    sourceType: formData.sourceType
  }

  emit('save', entryData)
}

// Reset form when modal opens/closes or editing entry changes
watch([() => props.editingEntry, () => props.isOpen], () => {
  if (props.editingEntry) {
    const timeRange = props.editingEntry.dateRange?.split('–') || []
    Object.assign(formData, {
      studentName: props.editingEntry.studentName,
      studentClass: props.editingEntry.studentClass,
      courseClass: props.editingEntry.courseClass,
      date: props.editingEntry.date.split('.').reverse().join('-'),
      timeFrom: timeRange[0]?.trim() || '',
      timeTo: timeRange[1]?.trim() || '',
      duration: props.editingEntry.duration,
      status: props.editingEntry.status,
      reason: props.editingEntry.reason,
      hasAttachment: props.editingEntry.hasAttachment,
      hasAccess: props.editingEntry.hasAccess,
      sourceType: props.editingEntry.sourceType
    })
    isFullDay.value = props.editingEntry.duration === 'Ganzer Tag'
    studentSearch.value = props.editingEntry.studentName
  } else {
    const today = new Date().toISOString().split('T')[0]
    Object.assign(formData, {
      studentName: '',
      studentClass: '',
      courseClass: '',
      date: today,
      timeFrom: '',
      timeTo: '',
      duration: 'Ganzer Tag',
      status: 'krankgemeldet',
      reason: '',
      hasAttachment: false,
      hasAccess: true,
      sourceType: 'schuleingabe'
    })
    isFullDay.value = true
    studentSearch.value = ''
    uploadedFile.value = null
  }
  errors.value = {}
})
</script>