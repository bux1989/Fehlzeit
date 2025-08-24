<template>
  <div v-if="isOpen && entry" class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
    <div 
      class="bg-background border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      @click.stop
    >
      <!-- Header -->
      <div class="p-4 border-b border-border">
        <h2 class="flex items-center gap-2">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Fehlzeit Details
        </h2>
      </div>

      <!-- Content -->
      <div class="p-4 space-y-4">
        <!-- Student Information -->
        <div class="p-3 bg-card border border-border rounded-lg">
          <div class="space-y-2">
            <h3 class="flex items-center gap-2">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Schüler*in
            </h3>
            <div>
              <div class="flex items-center gap-2">
                <span class="font-medium">{{ entry.studentName }}</span>
                <span class="px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded border">
                  {{ entry.studentClass }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Source Type -->
        <div class="p-3 bg-card border border-border rounded-lg">
          <div class="space-y-2">
            <h3 class="flex items-center gap-2">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Art der Meldung
            </h3>
            <div class="flex items-center gap-2">
              <span 
                v-if="entry.sourceType === 'eltern-app'"
                class="inline-flex items-center gap-1 px-3 py-1 text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded"
              >
                <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Eltern-App
              </span>
              <span 
                v-if="entry.sourceType === 'anwesenheit'"
                class="inline-flex items-center gap-1 px-3 py-1 text-xs bg-orange-50 text-orange-700 border border-orange-200 rounded"
              >
                <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Anwesenheit/Klassenbuch
              </span>
              <span 
                v-if="entry.sourceType === 'schuleingabe'"
                class="inline-flex items-center gap-1 px-3 py-1 text-xs bg-purple-50 text-purple-700 border border-purple-200 rounded"
              >
                <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Schuleingabe
              </span>
            </div>
          </div>
        </div>

        <!-- Date and Time Information -->
        <div class="p-3 bg-card border border-border rounded-lg">
          <div class="space-y-2">
            <h3 class="flex items-center gap-2">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Datum & Zeit
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label class="text-sm text-muted-foreground">Datum</label>
                <p class="font-medium">{{ entry.date }}</p>
              </div>
              <div>
                <label class="text-sm text-muted-foreground">Dauer</label>
                <p class="font-medium">{{ entry.duration }}</p>
              </div>
              <div v-if="entry.dateRange" class="md:col-span-2">
                <label class="text-sm text-muted-foreground">Zeitfenster</label>
                <p class="font-medium flex items-center gap-2">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ entry.dateRange }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Status -->
        <div class="p-3 bg-card border border-border rounded-lg">
          <div class="space-y-2">
            <h3 class="flex items-center gap-2">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Status
            </h3>
            <StatusPill :status="entry.status" />
          </div>
        </div>

        <!-- Reason -->
        <div class="p-3 bg-card border border-border rounded-lg">
          <div class="space-y-2">
            <h3 class="flex items-center gap-2">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Grund
            </h3>
            <p class="text-sm leading-relaxed">{{ entry.reason || 'Kein Grund angegeben' }}</p>
          </div>
        </div>

        <!-- Attachment -->
        <div class="p-3 bg-card border border-border rounded-lg">
          <div class="space-y-2">
            <h3 class="flex items-center gap-2">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              Nachweis
            </h3>
            <div v-if="!entry.hasAttachment" class="flex items-center gap-2 text-muted-foreground">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Kein Nachweis vorhanden</span>
            </div>
            <div v-else-if="!entry.hasAccess" class="flex items-center gap-2 text-muted-foreground">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Nachweis vorhanden (kein Zugriff)</span>
            </div>
            <div v-else class="flex items-center gap-2 text-foreground">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              <span>Nachweis vorhanden</span>
              <button class="px-3 py-1 text-sm border border-input bg-background hover:bg-accent rounded">
                Anzeigen
              </button>
            </div>
          </div>
        </div>

        <!-- Separator -->
        <div class="border-t border-border"></div>

        <!-- Meta Information -->
        <div class="space-y-1 text-sm text-muted-foreground">
          <div class="flex justify-between">
            <span>Erstellt von:</span>
            <span>{{ entry.createdBy }}</span>
          </div>
          <div class="flex justify-between">
            <span>Erstellt am:</span>
            <span>{{ entry.createdAt }}</span>
          </div>
          <div v-if="entry.lastEditedBy && entry.lastEditedAt" class="flex justify-between">
            <span>Zuletzt bearbeitet von:</span>
            <span>{{ entry.lastEditedBy }}</span>
          </div>
          <div v-if="entry.lastEditedBy && entry.lastEditedAt" class="flex justify-between">
            <span>Zuletzt bearbeitet am:</span>
            <span>{{ entry.lastEditedAt }}</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-between pt-3">
          <button
            type="button"
            class="px-4 py-2 border border-input bg-background hover:bg-accent rounded-md"
            @click="$emit('close')"
          >
            Schließen
          </button>
          <div class="flex gap-2">
            <button
              type="button"
              class="flex items-center gap-2 px-4 py-2 border border-input bg-background hover:bg-accent rounded-md"
              @click="handleEdit"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Bearbeiten
            </button>
            <button
              type="button"
              class="flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-md"
              @click="handleDelete"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Löschen
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import StatusPill from './StatusPill.vue'

const props = defineProps({
  entry: Object,
  isOpen: Boolean
})

const emit = defineEmits(['close', 'edit', 'delete'])

const handleEdit = () => {
  emit('edit', props.entry)
  emit('close')
}

const handleDelete = () => {
  if (confirm('Fehlzeit wirklich löschen?')) {
    emit('delete', props.entry.id)
    emit('close')
  }
}
</script>