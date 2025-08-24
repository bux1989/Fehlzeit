<template>
  <div class="fehlzeiten-dashboard" :style="dashboardStyles">
    <!-- Header -->
    <div class="dashboard-header">
      <h1 class="dashboard-title">{{ content.headerTitle }}</h1>
      <div class="header-actions">
        <button
          v-if="content.showExportButton"
          class="export-btn"
          @click="showExportMenu = !showExportMenu"
        >
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7,10 12,15 17,10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Export
        </button>
        <div v-if="showExportMenu" class="export-menu">
          <button @click="exportData('csv')">CSV exportieren</button>
          <button @click="exportData('xlsx')">XLSX exportieren</button>
          <button @click="exportData('pdf')">PDF exportieren</button>
        </div>
        <button
          v-if="content.showAddButton"
          class="add-btn primary-btn"
          @click="openAddModal"
        >
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Fehlzeit eintragen
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div v-if="content.showFilters" class="filters-card">
      <div class="filters-grid">
        <div class="filter-group">
          <label>Klasse</label>
          <select v-model="filters.class" class="filter-select">
            <option value="">Alle</option>
            <option
              v-for="className in content.availableClasses"
              :key="className"
              :value="className"
            >
              {{ className }}
            </option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>Schüler*in</label>
          <input
            v-model="filters.student"
            type="text"
            placeholder="Schüler*in suchen..."
            class="filter-input"
          />
        </div>
        
        <div class="filter-group">
          <label>Datum</label>
          <input
            v-model="filters.dateFrom"
            type="date"
            class="filter-input"
          />
        </div>
        
        <div class="filter-group">
          <label>Status</label>
          <select v-model="filters.status" class="filter-select">
            <option value="alle">Alle</option>
            <option value="krankgemeldet">Krankgemeldet</option>
            <option value="unentschuldigt">Unentschuldigt</option>
            <option value="beurlaubt">Beurlaubt</option>
            <option value="ungeklärt">Ungeklärt</option>
            <option value="verspätet">Verspätet</option>
          </select>
        </div>
        
        <button class="reset-btn" @click="resetFilters">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/>
          </svg>
          Zurücksetzen
        </button>
      </div>
    </div>

    <!-- Results Summary -->
    <div class="results-summary">
      {{ filteredData.length }} Einträge gefunden
      <span v-if="filteredData.length !== studentsData.length">
        ({{ studentsData.length }} gesamt)
      </span>
    </div>

    <!-- Table -->
    <div class="table-container">
      <table class="fehlzeiten-table">
        <thead>
          <tr>
            <th @click="handleSort('firstName')" class="sortable-header">
              <span>Vorname</span>
              <svg class="sort-icon" :class="getSortIconClass('firstName')" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 8l4-4 4 4"/>
                <path d="M7 4v16"/>
                <path d="M21 16l-4 4-4-4"/>
                <path d="M17 20V4"/>
              </svg>
            </th>
            <th @click="handleSort('lastName')" class="sortable-header">
              <span>Nachname</span>
              <svg class="sort-icon" :class="getSortIconClass('lastName')" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 8l4-4 4 4"/>
                <path d="M7 4v16"/>
                <path d="M21 16l-4 4-4-4"/>
                <path d="M17 20V4"/>
              </svg>
            </th>
            <th @click="handleSort('class')" class="sortable-header">
              <span>Klasse</span>
              <svg class="sort-icon" :class="getSortIconClass('class')" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 8l4-4 4 4"/>
                <path d="M7 4v16"/>
                <path d="M21 16l-4 4-4-4"/>
                <path d="M17 20V4"/>
              </svg>
            </th>
            <th @click="handleSort('time')" class="sortable-header">
              <span>Zeit</span>
              <svg class="sort-icon" :class="getSortIconClass('time')" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 8l4-4 4 4"/>
                <path d="M7 4v16"/>
                <path d="M21 16l-4 4-4-4"/>
                <path d="M17 20V4"/>
              </svg>
            </th>
            <th @click="handleSort('status')" class="sortable-header">
              <span>Status</span>
              <svg class="sort-icon" :class="getSortIconClass('status')" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 8l4-4 4 4"/>
                <path d="M7 4v16"/>
                <path d="M21 16l-4 4-4-4"/>
                <path d="M17 20V4"/>
              </svg>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="entry in sortedData"
            :key="entry.id"
            class="table-row"
            @click="openDetailModal(entry)"
          >
            <td>
              <div class="student-name-cell">
                <span>{{ entry.firstName }}</span>
                <svg
                  v-if="entry.sourceType === 'eltern-app'"
                  class="source-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  title="Aus Eltern-App übernommen"
                >
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="16" x2="12" y2="12"/>
                  <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
              </div>
            </td>
            <td>{{ entry.lastName }}</td>
            <td>{{ entry.studentClass }}</td>
            <td>
              <span v-if="entry.timeRange">{{ entry.timeRange }}</span>
              <span v-else class="full-day">ganztägig</span>
            </td>
            <td>
              <span 
                class="status-badge"
                :style="{ backgroundColor: getStatusColor(entry.status) }"
              >
                {{ getStatusText(entry.status) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- Empty State -->
      <div v-if="sortedData.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        </div>
        <h3>Keine Einträge gefunden</h3>
        <p>Keine Einträge für den gewählten Zeitraum gefunden.</p>
        <div class="empty-actions">
          <button class="outline-btn" @click="resetFilters">Filter zurücksetzen</button>
          <button class="primary-btn" @click="openAddModal">Fehlzeit eintragen</button>
        </div>
      </div>
    </div>

    <!-- Detail Modal -->
    <div v-if="showDetailModal" class="modal-overlay" @click="closeDetailModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Fehlzeit Details</h2>
          <button class="close-btn" @click="closeDetailModal">×</button>
        </div>
        <div v-if="selectedEntry" class="modal-body">
          <div class="detail-grid">
            <div class="detail-item">
              <label>Name:</label>
              <span>{{ selectedEntry.firstName }} {{ selectedEntry.lastName }}</span>
            </div>
            <div class="detail-item">
              <label>Klasse:</label>
              <span>{{ selectedEntry.studentClass }}</span>
            </div>
            <div class="detail-item">
              <label>Datum:</label>
              <span>{{ selectedEntry.date }}</span>
            </div>
            <div class="detail-item">
              <label>Zeit:</label>
              <span>{{ selectedEntry.timeRange || 'Ganztägig' }}</span>
            </div>
            <div class="detail-item">
              <label>Status:</label>
              <span 
                class="status-badge"
                :style="{ backgroundColor: getStatusColor(selectedEntry.status) }"
              >
                {{ getStatusText(selectedEntry.status) }}
              </span>
            </div>
            <div class="detail-item">
              <label>Grund:</label>
              <span>{{ selectedEntry.reason }}</span>
            </div>
            <div class="detail-item">
              <label>Nachweis:</label>
              <span>{{ selectedEntry.hasAttachment ? 'Vorhanden' : 'Nicht vorhanden' }}</span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button v-if="content.allowEdit" class="primary-btn" @click="editEntry">Bearbeiten</button>
          <button v-if="content.allowDelete" class="danger-btn" @click="deleteEntry">Löschen</button>
          <button class="outline-btn" @click="closeDetailModal">Schließen</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    content: { type: Object, required: true },
    /* wwEditor:start */
    wwEditorState: { type: Object, required: true },
    /* wwEditor:end */
  },
  emits: ['update:content', 'trigger-event'],
  data() {
    return {
      filters: {
        class: '',
        student: '',
        dateFrom: new Date().toISOString().split('T')[0],
        status: 'alle'
      },
      sortBy: this.content.sortBy || 'time',
      sortOrder: this.content.sortOrder || 'asc',
      showExportMenu: false,
      showDetailModal: false,
      selectedEntry: null
    };
  },
  computed: {
    dashboardStyles() {
      return {
        padding: '20px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12)',
        minHeight: '400px'
      };
    },
    studentsData() {
      if (!this.content.students || !Array.isArray(this.content.students)) {
        return this.getMockData();
      }
      return this.content.students.map(student => ({
        ...student,
        firstName: student.firstName || student.studentName?.split(' ')[0] || '',
        lastName: student.lastName || student.studentName?.split(' ').slice(1).join(' ') || ''
      }));
    },
    filteredData() {
      return this.studentsData.filter(item => {
        if (this.filters.class && item.studentClass !== this.filters.class) return false;
        if (this.filters.student && !`${item.firstName} ${item.lastName}`.toLowerCase().includes(this.filters.student.toLowerCase())) return false;
        if (this.filters.status !== 'alle' && item.status !== this.filters.status) return false;
        
        // Date filtering
        if (this.filters.dateFrom && item.date) {
          const filterDate = new Date(this.filters.dateFrom);
          const [day, month, year] = item.date.split('.');
          const itemDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
          if (itemDate.toDateString() !== filterDate.toDateString()) return false;
        }
        
        return true;
      });
    },
    sortedData() {
      return [...this.filteredData].sort((a, b) => {
        let aVal, bVal;
        
        switch (this.sortBy) {
          case 'firstName':
            aVal = a.firstName || '';
            bVal = b.firstName || '';
            break;
          case 'lastName':
            aVal = a.lastName || '';
            bVal = b.lastName || '';
            break;
          case 'class':
            aVal = a.studentClass || '';
            bVal = b.studentClass || '';
            break;
          case 'time':
            aVal = a.timeRange || (a.duration === 'Ganzer Tag' ? '00:00' : 'zzz');
            bVal = b.timeRange || (b.duration === 'Ganzer Tag' ? '00:00' : 'zzz');
            break;
          case 'status':
            aVal = a.status || '';
            bVal = b.status || '';
            break;
          default:
            aVal = a.timeRange || '00:00';
            bVal = b.timeRange || '00:00';
        }
        
        if (this.sortOrder === 'asc') {
          return aVal.localeCompare(bVal, 'de');
        } else {
          return bVal.localeCompare(aVal, 'de');
        }
      });
    }
  },
  methods: {
    getMockData() {
      return [
        {
          id: '1',
          firstName: 'Leon',
          lastName: 'Schmidt',
          studentClass: '5b',
          date: '18.08.2025',
          timeRange: null,
          duration: 'Ganzer Tag',
          status: 'unentschuldigt',
          reason: 'Krankheit',
          hasAttachment: true,
          sourceType: 'anwesenheit'
        },
        {
          id: '2',
          firstName: 'Anna',
          lastName: 'Lange',
          studentClass: '5b',
          date: '18.08.2025',
          timeRange: null,
          duration: 'Ganzer Tag',
          status: 'krankgemeldet',
          reason: 'Fieber und Husten - Krankgemeldet bis 21.08.2025',
          hasAttachment: true,
          sourceType: 'eltern-app'
        },
        {
          id: '3',
          firstName: 'Max',
          lastName: 'Müller',
          studentClass: '7c',
          date: '18.08.2025',
          timeRange: '08:00–09:30',
          duration: 'Zeitfenster',
          status: 'verspätet',
          reason: 'Verschlafen',
          hasAttachment: false,
          sourceType: 'anwesenheit'
        },
        {
          id: '4',
          firstName: 'Mara',
          lastName: 'Klein',
          studentClass: '5b',
          date: '18.08.2025',
          timeRange: '10:15–11:45',
          duration: 'Zeitfenster',
          status: 'krankgemeldet',
          reason: 'Arzttermin – Nachweis angekündigt',
          hasAttachment: false,
          sourceType: 'eltern-app'
        },
        {
          id: '5',
          firstName: 'Emma',
          lastName: 'Taylor',
          studentClass: '6a',
          date: '18.08.2025',
          timeRange: '13:30–15:00',
          duration: 'Zeitfenster',
          status: 'krankgemeldet',
          reason: 'Familiärer Notfall',
          hasAttachment: true,
          sourceType: 'schuleingabe'
        }
      ];
    },
    handleSort(field) {
      if (this.sortBy === field) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortBy = field;
        this.sortOrder = 'asc';
      }
    },
    getSortIconClass(field) {
      if (this.sortBy !== field) return 'sort-inactive';
      return this.sortOrder === 'asc' ? 'sort-asc' : 'sort-desc';
    },
    resetFilters() {
      this.filters = {
        class: '',
        student: '',
        dateFrom: new Date().toISOString().split('T')[0],
        status: 'alle'
      };
    },
    getStatusColor(status) {
      return this.content.statusColors?.[status] || '#6b7280';
    },
    getStatusText(status) {
      const statusMap = {
        krankgemeldet: 'Krankgemeldet',
        unentschuldigt: 'Unentschuldigt',
        beurlaubt: 'Beurlaubt',
        verspätet: 'Verspätet',
        ungeklärt: 'Ungeklärt'
      };
      return statusMap[status] || status;
    },
    openDetailModal(entry) {
      this.selectedEntry = entry;
      this.showDetailModal = true;
    },
    closeDetailModal() {
      this.showDetailModal = false;
      this.selectedEntry = null;
    },
    openAddModal() {
      this.$emit('trigger-event', {
        name: 'add-entry',
        event: { type: 'add' }
      });
    },
    editEntry() {
      this.$emit('trigger-event', {
        name: 'edit-entry',
        event: { type: 'edit', entry: this.selectedEntry }
      });
      this.closeDetailModal();
    },
    deleteEntry() {
      if (confirm('Fehlzeit wirklich löschen?')) {
        this.$emit('trigger-event', {
          name: 'delete-entry',
          event: { type: 'delete', entry: this.selectedEntry }
        });
        this.closeDetailModal();
      }
    },
    exportData(format) {
      this.$emit('trigger-event', {
        name: 'export-data',
        event: { type: 'export', format, data: this.filteredData }
      });
      this.showExportMenu = false;
    }
  }
};
</script>
