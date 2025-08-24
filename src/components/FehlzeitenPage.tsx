import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { FehlzeitenTable } from './FehlzeitenTable';
import { FehlzeitModal } from './FehlzeitModal';
import { Plus, Download, Filter, ArrowUpDown, ChevronDown, X, ChevronUp } from 'lucide-react';

interface FehlzeitEntry {
  id: string;
  studentName: string;
  studentClass: string;
  courseClass: string;
  date: string;
  dateRange?: string;
  duration: 'Ganzer Tag' | 'Zeitfenster';
  status: 'krankgemeldet' | 'unentschuldigt' | 'beurlaubt' | 'ungeklärt' | 'verspätet';
  reason: string;
  hasAttachment: boolean;
  hasAccess: boolean;
  createdBy: string;
  createdAt: string;
  sourceType: 'eltern-app' | 'anwesenheit' | 'schuleingabe';
  lastEditedBy?: string;
  lastEditedAt?: string;
  endDate?: string; // For multi-day absences
  isMultiDay?: boolean; // To track if this is part of a multi-day absence
}

const mockData: FehlzeitEntry[] = [
  // Monday - 18.08.2025
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
  {
    id: '3',
    studentName: 'Emma Taylor',
    studentClass: '6a',
    courseClass: '6a – Englisch',
    date: '18.08.2025',
    dateRange: '13:30–15:00',
    duration: 'Zeitfenster',
    status: 'krankgemeldet',
    reason: 'Familiärer Notfall',
    hasAttachment: true,
    hasAccess: false,
    createdBy: 'Weber, C.',
    createdAt: '18.08.2025, 13:00',
    sourceType: 'schuleingabe'
  },
  {
    id: '4',
    studentName: 'Max Müller',
    studentClass: '7c',
    courseClass: '7c – Geschichte',
    date: '18.08.2025',
    dateRange: '08:00–09:30',
    duration: 'Zeitfenster',
    status: 'verspätet',
    reason: 'Verschlafen',
    hasAttachment: false,
    hasAccess: true,
    createdBy: 'Fischer, D.',
    createdAt: '18.08.2025, 09:45',
    sourceType: 'anwesenheit'
  },
  {
    id: '5',
    studentName: 'Anna Lange',
    studentClass: '5b',
    courseClass: '5b – Sport',
    date: '18.08.2025',
    duration: 'Ganzer Tag',
    status: 'krankgemeldet',
    reason: 'Fieber und Husten',
    hasAttachment: true,
    hasAccess: true,
    createdBy: 'Kraft, M.',
    createdAt: '18.08.2025, 07:20',
    sourceType: 'eltern-app',
    endDate: '21.08.2025',
    isMultiDay: true
  },

  // Tuesday - 19.08.2025
  {
    id: '6',
    studentName: 'Tim Berg',
    studentClass: '6a',
    courseClass: '6a – Mathe',
    date: '19.08.2025',
    dateRange: '11:45–13:15',
    duration: 'Zeitfenster',
    status: 'krankgemeldet',
    reason: 'Zahnarzttermin',
    hasAttachment: true,
    hasAccess: true,
    createdBy: 'Müller, A.',
    createdAt: '19.08.2025, 08:15',
    sourceType: 'schuleingabe'
  },
  {
    id: '7',
    studentName: 'Sophie Richter',
    studentClass: '7a',
    courseClass: '7a – Physik',
    date: '19.08.2025',
    duration: 'Ganzer Tag',
    status: 'unentschuldigt',
    reason: 'Ohne Angabe',
    hasAttachment: false,
    hasAccess: true,
    createdBy: 'Klein, P.',
    createdAt: '19.08.2025, 08:00',
    sourceType: 'anwesenheit',
    lastEditedBy: 'KLE',
    lastEditedAt: '19.08.2025, 10:30'
  },
  {
    id: '8',
    studentName: 'Lucas Weber',
    studentClass: '5a',
    courseClass: '5a – Englisch',
    date: '19.08.2025',
    dateRange: '09:45–11:15',
    duration: 'Zeitfenster',
    status: 'krankgemeldet',
    reason: 'Behördentermin',
    hasAttachment: false,
    hasAccess: true,
    createdBy: 'Brown, J.',
    createdAt: '19.08.2025, 09:00',
    sourceType: 'eltern-app'
  },
  {
    id: '9',
    studentName: 'Lara Hansen',
    studentClass: '6b',
    courseClass: '6b – Deutsch',
    date: '19.08.2025',
    dateRange: '13:30–15:00',
    duration: 'Zeitfenster',
    status: 'krankgemeldet',
    reason: 'Migräne',
    hasAttachment: true,
    hasAccess: true,
    createdBy: 'Wagner, K.',
    createdAt: '19.08.2025, 12:45',
    sourceType: 'schuleingabe'
  },
  {
    id: '10',
    studentName: 'Felix Graf',
    studentClass: '8a',
    courseClass: '8a – Informatik',
    date: '19.08.2025',
    duration: 'Ganzer Tag',
    status: 'krankgemeldet',
    reason: 'Magen-Darm-Infekt',
    hasAttachment: true,
    hasAccess: true,
    createdBy: 'Tech, I.',
    createdAt: '19.08.2025, 07:30',
    sourceType: 'eltern-app'
  },

  // Wednesday - 20.08.2025
  {
    id: '11',
    studentName: 'Nina Peters',
    studentClass: '7b',
    courseClass: '7b – Biologie',
    date: '20.08.2025',
    dateRange: '08:00–09:30',
    duration: 'Zeitfenster',
    status: 'verspätet',
    reason: 'Bus verpasst',
    hasAttachment: false,
    hasAccess: true,
    createdBy: 'Grün, B.',
    createdAt: '20.08.2025, 09:45',
    sourceType: 'anwesenheit'
  },
  {
    id: '12',
    studentName: 'Julian Fischer',
    studentClass: '5a',
    courseClass: '5a – Mathe',
    date: '20.08.2025',
    duration: 'Ganzer Tag',
    status: 'krankgemeldet',
    reason: 'Erkältung mit Fieber',
    hasAttachment: true,
    hasAccess: true,
    createdBy: 'Müller, A.',
    createdAt: '20.08.2025, 07:15',
    sourceType: 'eltern-app'
  },
  {
    id: '13',
    studentName: 'Lea Cohen',
    studentClass: '6a',
    courseClass: '6a – Geschichte',
    date: '20.08.2025',
    dateRange: '10:15–11:45',
    duration: 'Zeitfenster',
    status: 'krankgemeldet',
    reason: 'Augenarzttermin',
    hasAttachment: true,
    hasAccess: true,
    createdBy: 'Alt, H.',
    createdAt: '20.08.2025, 09:30',
    sourceType: 'schuleingabe'
  },
  {
    id: '14',
    studentName: 'David Koch',
    studentClass: '7a',
    courseClass: '7a – Chemie',
    date: '20.08.2025',
    dateRange: '13:30–15:00',
    duration: 'Zeitfenster',
    status: 'ungeklärt',
    reason: 'Spontaner Termin',
    hasAttachment: false,
    hasAccess: true,
    createdBy: 'Lab, E.',
    createdAt: '20.08.2025, 15:15',
    sourceType: 'schuleingabe',
    lastEditedBy: 'SCH',
    lastEditedAt: '20.08.2025, 16:45'
  },
  {
    id: '15',
    studentName: 'Maya Schulz',
    studentClass: '5b',
    courseClass: '5b – Englisch',
    date: '20.08.2025',
    dateRange: '11:45–13:15',
    duration: 'Zeitfenster',
    status: 'krankgemeldet',
    reason: 'Therapietermin',
    hasAttachment: true,
    hasAccess: false,
    createdBy: 'Brown, J.',
    createdAt: '20.08.2025, 11:00',
    sourceType: 'eltern-app'
  },

  // Thursday - 21.08.2025
  {
    id: '16',
    studentName: 'Noah Vogt',
    studentClass: '6b',
    courseClass: '6b – Mathe',
    date: '21.08.2025',
    duration: 'Ganzer Tag',
    status: 'beurlaubt',
    reason: 'Familienfeier (Hochzeit)',
    hasAttachment: true,
    hasAccess: true,
    createdBy: 'Müller, A.',
    createdAt: '21.08.2025, 07:00',
    sourceType: 'schuleingabe'
  },
  {
    id: '17',
    studentName: 'Zoe Dahms',
    studentClass: '7c',
    courseClass: '7c – Geschichte',
    date: '21.08.2025',
    dateRange: '09:45–11:15',
    duration: 'Zeitfenster',
    status: 'unentschuldigt',
    reason: 'Hausaufgaben vergessen, daheim geholt',
    hasAttachment: false,
    hasAccess: true,
    createdBy: 'Fischer, D.',
    createdAt: '21.08.2025, 11:30',
    sourceType: 'anwesenheit'
  },
  {
    id: '18',
    studentName: 'Emil Jung',
    studentClass: '5a',
    courseClass: '5a – Deutsch',
    date: '21.08.2025',
    dateRange: '13:30–15:00',
    duration: 'Zeitfenster',
    status: 'krankgemeldet',
    reason: 'Übelkeit nach dem Mittagessen',
    hasAttachment: false,
    hasAccess: true,
    createdBy: 'Schmidt, B.',
    createdAt: '21.08.2025, 13:15',
    sourceType: 'schuleingabe'
  },
  {
    id: '19',
    studentName: 'Isla Meyer',
    studentClass: '8a',
    courseClass: '8a – Informatik',
    date: '21.08.2025',
    dateRange: '08:00–09:30',
    duration: 'Zeitfenster',
    status: 'krankgemeldet',
    reason: 'Impftermin',
    hasAttachment: true,
    hasAccess: true,
    createdBy: 'Tech, I.',
    createdAt: '21.08.2025, 07:45',
    sourceType: 'eltern-app'
  },
  {
    id: '20',
    studentName: 'Aaron Lehmann',
    studentClass: '6a',
    courseClass: '6a – Englisch',
    date: '21.08.2025',
    duration: 'Ganzer Tag',
    status: 'unentschuldigt',
    reason: 'Unentschuldigtes Fehlen',
    hasAttachment: false,
    hasAccess: true,
    createdBy: 'Brown, J.',
    createdAt: '21.08.2025, 08:15',
    sourceType: 'anwesenheit'
  },

  // Friday - 22.08.2025
  {
    id: '22',
    studentName: 'Ben Quandt',
    studentClass: '5b',
    courseClass: '5b – Sport',
    date: '22.08.2025',
    dateRange: '11:45–13:15',
    duration: 'Zeitfenster',
    status: 'krankgemeldet',
    reason: 'Verstauchter Knöchel',
    hasAttachment: true,
    hasAccess: true,
    createdBy: 'Kraft, M.',
    createdAt: '22.08.2025, 11:30',
    sourceType: 'eltern-app'
  },
  {
    id: '23',
    studentName: 'Hanna Andersen',
    studentClass: '6b',
    courseClass: '6b – Deutsch',
    date: '22.08.2025',
    duration: 'Ganzer Tag',
    status: 'krankgemeldet',
    reason: 'Starke Kopfschmerzen',
    hasAttachment: false,
    hasAccess: true,
    createdBy: 'Wagner, K.',
    createdAt: '22.08.2025, 07:30',
    sourceType: 'eltern-app'
  },
  {
    id: '24',
    studentName: 'Finn Zimmermann',
    studentClass: '7b',
    courseClass: '7b – Biologie',
    date: '22.08.2025',
    dateRange: '08:00–09:30',
    duration: 'Zeitfenster',
    status: 'verspätet',
    reason: 'Zu spät aufgestanden',
    hasAttachment: false,
    hasAccess: true,
    createdBy: 'Grün, B.',
    createdAt: '22.08.2025, 10:00',
    sourceType: 'anwesenheit'
  },
  {
    id: '25',
    studentName: 'Clara Engel',
    studentClass: '8a',
    courseClass: '8a – Informatik',
    date: '22.08.2025',
    dateRange: '13:30–15:00',
    duration: 'Zeitfenster',
    status: 'beurlaubt',
    reason: 'Verlängertes Wochenende (genehmigt)',
    hasAttachment: true,
    hasAccess: true,
    createdBy: 'Tech, I.',
    createdAt: '22.08.2025, 08:00',
    sourceType: 'schuleingabe'
  },

  // Multi-day entry examples:
  // Anna Lange: 18.-21. (4 days: 18., 19., 20., 21.) - should appear when filtering any of these dates
  // Mila Otto: 22.-24. (3 days: 22., 23., 24.) - should appear when filtering any of these dates
  {
    id: '26',
    studentName: 'Mila Otto',
    studentClass: '7a',
    courseClass: '7a – Physik',
    date: '22.08.2025',
    duration: 'Ganzer Tag',
    status: 'krankgemeldet',
    reason: 'Verlängertes Wochenende - Hautarzttermin',
    hasAttachment: true,
    hasAccess: true,
    createdBy: 'Klein, P.',
    createdAt: '22.08.2025, 09:00',
    sourceType: 'schuleingabe',
    endDate: '24.08.2025',
    isMultiDay: true
  }
];

// Mock data for available classes that the user has permission to access
const mockAvailableClasses = [
  '5a',
  '5b',
  '6a',
  '6b',
  '7a',
  '7b',
  '7c',
  '8a'
];

export function FehlzeitenPage() {
  const [data, setData] = useState<FehlzeitEntry[]>(mockData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<FehlzeitEntry | null>(null);
  // Get current date in YYYY-MM-DD format (defaulting to Monday of current mock week)
  const getCurrentDate = () => {
    // Default to Monday of our mock week (18.08.2025) for demonstration
    return '2025-08-18';
  };

  const [filters, setFilters] = useState({
    class: '',
    student: '',
    dateFrom: getCurrentDate(),
    status: 'alle'
  });
  const [sortBy, setSortBy] = useState('time');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [classSearchTerm, setClassSearchTerm] = useState('');

  const handleAddEntry = () => {
    setEditingEntry(null);
    setIsModalOpen(true);
  };

  const handleEditEntry = (entry: FehlzeitEntry) => {
    setEditingEntry(entry);
    setIsModalOpen(true);
  };

  const handleDeleteEntry = (id: string) => {
    if (confirm('Fehlzeit wirklich löschen?')) {
      setData(data.filter(item => item.id !== id));
    }
  };

  const handleSaveEntry = (entries: Omit<FehlzeitEntry, 'id' | 'createdBy' | 'createdAt' | 'lastEditedBy' | 'lastEditedAt'>[]) => {
    const currentTimestamp = new Date().toLocaleDateString('de-DE') + ', ' + new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    const currentUserAbbreviation = 'AKT'; // Aktueller Nutzer - in real app this would come from user context
    
    if (editingEntry) {
      // Edit existing entry
      const entry = entries[0]; // Always a single entry now
      
      const updatedEntry: FehlzeitEntry = {
        ...entry,
        id: editingEntry.id,
        createdBy: editingEntry.createdBy,
        createdAt: editingEntry.createdAt,
        lastEditedBy: currentUserAbbreviation,
        lastEditedAt: currentTimestamp
      };
      
      setData(data.map(item => 
        item.id === editingEntry.id ? updatedEntry : item
      ));
    } else {
      // Add new entry
      const newEntry: FehlzeitEntry = {
        ...entries[0],
        id: `${Date.now()}`,
        createdBy: 'Aktueller Nutzer',
        createdAt: currentTimestamp
      };
      setData([...data, newEntry]);
    }
    setIsModalOpen(false);
  };

  const filteredData = data.filter(item => {
    if (filters.class && item.studentClass !== filters.class) return false;
    if (filters.student && !item.studentName.toLowerCase().includes(filters.student.toLowerCase())) return false;
    if (filters.status !== 'alle' && item.status !== filters.status) return false;
    
    // Date filtering - convert German date format to comparable format
    if (filters.dateFrom) {
      const filterDate = new Date(filters.dateFrom);
      // Reset time to midnight for accurate date comparison
      filterDate.setHours(0, 0, 0, 0);
      
      const [day, month, year] = item.date.split('.');
      const itemStartDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      itemStartDate.setHours(0, 0, 0, 0);
      
      // For multi-day absences, check if the filter date falls within the range (inclusive)
      if (item.isMultiDay && item.endDate) {
        const [endDay, endMonth, endYear] = item.endDate.split('.');
        const itemEndDate = new Date(parseInt(endYear), parseInt(endMonth) - 1, parseInt(endDay));
        itemEndDate.setHours(23, 59, 59, 999); // Set to end of day to ensure inclusion
        
        // Show if filter date is within the absence range (inclusive of both start and end dates)
        if (filterDate >= itemStartDate && filterDate <= itemEndDate) {
          return true;
        }
        return false;
      } else {
        // For single-day absences, check exact date match
        if (itemStartDate.getTime() !== filterDate.getTime()) return false;
      }
    }
    
    return true;
  });

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const sortedData = [...filteredData].sort((a, b) => {
    let aVal: string, bVal: string;
    
    switch (sortBy) {
      case 'firstName':
        aVal = a.studentName.split(' ')[0] || '';
        bVal = b.studentName.split(' ')[0] || '';
        break;
      case 'lastName':
        aVal = a.studentName.split(' ').slice(1).join(' ') || '';
        bVal = b.studentName.split(' ').slice(1).join(' ') || '';
        break;
      case 'class':
        aVal = a.studentClass;
        bVal = b.studentClass;
        break;
      case 'time':
        // Handle full day vs time range sorting
        aVal = a.dateRange || (a.duration === 'Ganzer Tag' ? '00:00' : 'zzz');
        bVal = b.dateRange || (b.duration === 'Ganzer Tag' ? '00:00' : 'zzz');
        break;
      case 'duration':
        aVal = a.duration;
        bVal = b.duration;
        break;
      case 'status':
        aVal = a.status;
        bVal = b.status;
        break;
      case 'createdBy':
        aVal = a.createdBy;
        bVal = b.createdBy;
        break;
      default:
        aVal = a.dateRange || (a.duration === 'Ganzer Tag' ? '00:00' : 'zzz');
        bVal = b.dateRange || (b.duration === 'Ganzer Tag' ? '00:00' : 'zzz');
    }
    
    if (sortOrder === 'asc') {
      return aVal.localeCompare(bVal, 'de');
    } else {
      return bVal.localeCompare(aVal, 'de');
    }
  });

  // Get current display value
  const getClassDisplayValue = () => {
    if (!filters.class) return 'Alle';
    return filters.class;
  };

  // Filter classes based on search term
  const allClassOptions = ['Alle', ...mockAvailableClasses];
  const filteredClassOptions = classSearchTerm 
    ? allClassOptions.filter(className =>
        className.toLowerCase().includes(classSearchTerm.toLowerCase())
      )
    : allClassOptions;

  const handleClassSelect = (className: string) => {
    if (className === 'Alle') {
      setFilters({ ...filters, class: '' });
    } else {
      setFilters({ ...filters, class: className });
    }
    setShowClassDropdown(false);
    setClassSearchTerm('');
  };

  const handleClearClass = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFilters({ ...filters, class: '' });
    setClassSearchTerm('');
  };

  const toggleClassDropdown = () => {
    setShowClassDropdown(!showClassDropdown);
    setClassSearchTerm('');
  };

  const adjustDate = (direction: 'up' | 'down') => {
    const currentDate = new Date(filters.dateFrom);
    if (direction === 'up') {
      currentDate.setDate(currentDate.getDate() + 1);
    } else {
      currentDate.setDate(currentDate.getDate() - 1);
    }
    setFilters({ ...filters, dateFrom: currentDate.toISOString().split('T')[0] });
  };

  return (
    <div 
      className="p-6 space-y-6"
      onClick={() => {
        if (showClassDropdown) {
          setShowClassDropdown(false);
          setClassSearchTerm('');
        }
      }}
    >
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1>Fehlzeiten</h1>
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>CSV exportieren</DropdownMenuItem>
              <DropdownMenuItem>XLSX exportieren</DropdownMenuItem>
              <DropdownMenuItem>PDF exportieren</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={handleAddEntry}>
            <Plus className="h-4 w-4 mr-2" />
            Fehlzeit eintragen
          </Button>
        </div>
      </div>

      {/* Filters Card */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-48">
            <label className="block mb-2">Klasse</label>
            <div className="relative">
              <div
                className="flex items-center justify-between w-full px-3 py-2 border border-input bg-background rounded-md cursor-pointer hover:bg-accent/50"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleClassDropdown();
                }}
              >
                <span className={filters.class ? 'text-foreground' : 'text-muted-foreground'}>
                  {getClassDisplayValue()}
                </span>
                <div className="flex items-center gap-1">
                  {filters.class && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-destructive/20"
                      onClick={handleClearClass}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                  <ChevronDown className={`h-4 w-4 transition-transform ${showClassDropdown ? 'rotate-180' : ''}`} />
                </div>
              </div>
              
              {showClassDropdown && (
                <Card className="absolute z-10 w-full mt-1 max-h-64 overflow-hidden border border-border shadow-lg">
                  <div className="p-2 border-b">
                    <Input
                      placeholder="Suchen..."
                      value={classSearchTerm}
                      onChange={(e) => setClassSearchTerm(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {filteredClassOptions.map((className, index) => (
                      <div
                        key={index}
                        className={`p-3 hover:bg-accent cursor-pointer border-b last:border-b-0 ${
                          className === 'Alle' ? 'font-medium' : ''
                        } ${
                          className === getClassDisplayValue() ? 'bg-accent' : ''
                        }`}
                        onClick={() => handleClassSelect(className)}
                      >
                        <div>{className}</div>
                      </div>
                    ))}
                    {filteredClassOptions.length === 0 && (
                      <div className="p-3 text-muted-foreground text-center">
                        Keine Ergebnisse gefunden
                      </div>
                    )}
                  </div>
                </Card>
              )}
            </div>
          </div>
          
          <div className="flex-1 min-w-48">
            <label className="block mb-2">Schüler*in</label>
            <Input
              placeholder="Schüler*in suchen..."
              value={filters.student}
              onChange={(e) => setFilters({...filters, student: e.target.value})}
            />
          </div>
          
          <div className="flex-1 min-w-64">
            <label className="block mb-2">Datum</label>
            <div className="flex items-center">
              <Input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                className="rounded-r-none border-r-0"
              />
              <div className="flex flex-col border border-l-0 rounded-r-md">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 px-2 rounded-none rounded-tr-md border-b"
                  onClick={() => adjustDate('up')}
                >
                  <ChevronUp className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 px-2 rounded-none rounded-br-md"
                  onClick={() => adjustDate('down')}
                >
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="min-w-40">
            <label className="block mb-2">Status</label>
            <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alle">Alle</SelectItem>
                <SelectItem value="krankgemeldet">Krankgemeldet</SelectItem>
                <SelectItem value="unentschuldigt">Unentschuldigt</SelectItem>
                <SelectItem value="beurlaubt">Beurlaubt</SelectItem>
                <SelectItem value="ungeklärt">Ungeklärt</SelectItem>
                <SelectItem value="verspätet">Verspätet</SelectItem>
              </SelectContent>
            </Select>
          </div>



          <Button
            variant="outline"
            onClick={() => {
              setFilters({class: '', student: '', dateFrom: getCurrentDate(), status: 'alle'});
              setClassSearchTerm('');
            }}
          >
            <Filter className="h-4 w-4 mr-2" />
            Zurücksetzen
          </Button>
        </div>
      </Card>

      {/* Results Summary */}
      <div className="text-muted-foreground">
        {sortedData.length} Einträge gefunden
        {filteredData.length !== data.length && ` (${data.length} gesamt)`}
      </div>

      {/* Main Table */}
      <FehlzeitenTable
        data={sortedData}
        onEdit={handleEditEntry}
        onDelete={handleDeleteEntry}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
      />

      {/* Add/Edit Modal */}
      <FehlzeitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEntry}
        editingEntry={editingEntry}
      />
    </div>
  );
}