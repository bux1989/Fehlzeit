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
          reason: 'Arzttermin – Nachweis angek��ndigt',
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

<style scoped>
/* Base Styles */
.fehlzeiten-dashboard {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #1f2937;
  line-height: 1.5;
  width: 100%;
}

/* Header */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.dashboard-title {
  font-size: 32px;
  font-weight: 700;
  margin: 0;
  color: #111827;
}

.header-actions {
  display: flex;
  gap: 12px;
  position: relative;
}

/* Buttons */
.primary-btn {
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s;
}

.primary-btn:hover {
  background: #2563eb;
}

.outline-btn {
  background: transparent;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.outline-btn:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.export-btn {
  background: transparent;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.export-btn:hover {
  background: #f9fafb;
}

.reset-btn {
  background: transparent;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.reset-btn:hover {
  background: #f9fafb;
}

.danger-btn {
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.danger-btn:hover {
  background: #dc2626;
}

/* Icons */
.icon {
  width: 16px;
  height: 16px;
  stroke-width: 2;
}

/* Export Menu */
.export-menu {
  position: absolute;
  top: 100%;
  right: 72px;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  z-index: 10;
  min-width: 160px;
}

.export-menu button {
  display: block;
  width: 100%;
  padding: 12px 16px;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: #374151;
  border-bottom: 1px solid #f3f4f6;
}

.export-menu button:last-child {
  border-bottom: none;
}

.export-menu button:hover {
  background: #f9fafb;
}

/* Filters */
.filters-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
}

.filter-group label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

.filter-input,
.filter-select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  transition: border-color 0.2s;
}

.filter-input:focus,
.filter-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Results Summary */
.results-summary {
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 16px;
}

/* Table */
.table-container {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.fehlzeiten-table {
  width: 100%;
  border-collapse: collapse;
}

.fehlzeiten-table th {
  background: #f9fafb;
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
}

.sortable-header {
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s;
}

.sortable-header:hover {
  background: #f3f4f6;
}

.sortable-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
}

.sort-icon {
  width: 16px;
  height: 16px;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.sort-icon.sort-active {
  opacity: 1;
}

.sort-icon.sort-inactive {
  opacity: 0.3;
}

.table-row {
  cursor: pointer;
  transition: background-color 0.2s;
}

.table-row:hover {
  background: #f9fafb;
}

.fehlzeiten-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: middle;
}

.student-name-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.source-icon {
  width: 14px;
  height: 14px;
  color: #3b82f6;
}

.full-day {
  color: #6b7280;
  font-style: italic;
}

/* Status Badge */
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: white;
  white-space: nowrap;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 48px 24px;
  color: #6b7280;
}

.empty-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  color: #d1d5db;
}

.empty-icon svg {
  width: 100%;
  height: 100%;
}

.empty-state h3 {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px;
}

.empty-state p {
  margin: 0 0 24px;
}

.empty-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #111827;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #6b7280;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background: #f3f4f6;
}

.modal-body {
  padding: 24px;
}

.detail-grid {
  display: grid;
  gap: 16px;
}

.detail-item {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 12px;
  align-items: center;
}

.detail-item label {
  font-weight: 500;
  color: #374151;
}

.modal-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 20px 24px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}

/* Responsive Design */
@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .header-actions {
    justify-content: space-between;
  }

  .filters-grid {
    grid-template-columns: 1fr;
  }

  .fehlzeiten-table {
    font-size: 14px;
  }

  .fehlzeiten-table th,
  .fehlzeiten-table td {
    padding: 8px 12px;
  }

  .modal-content {
    width: 95%;
    margin: 20px;
  }

  .detail-item {
    grid-template-columns: 1fr;
    gap: 4px;
  }

  .modal-footer {
    flex-direction: column-reverse;
  }
}

@media (max-width: 640px) {
  .empty-actions {
    flex-direction: column;
    align-items: center;
  }

  .dashboard-title {
    font-size: 24px;
  }
}
</style>
