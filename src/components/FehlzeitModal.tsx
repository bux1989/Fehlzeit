import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Card } from './ui/card';
import { Upload, X, Info } from 'lucide-react';

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

interface FehlzeitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entries: Omit<FehlzeitEntry, 'id' | 'createdBy' | 'createdAt' | 'lastEditedBy' | 'lastEditedAt'>[]) => void;
  editingEntry: FehlzeitEntry | null;
}

// Mock student data for autocomplete
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
  { name: 'Maya Schulz', class: '5b', fullClass: '5b – Englisch' },
];

export function FehlzeitModal({ isOpen, onClose, onSave, editingEntry }: FehlzeitModalProps) {
  const [formData, setFormData] = useState({
    studentName: '',
    studentClass: '',
    courseClass: '',
    date: '',
    dateTo: '',
    timeFrom: '',
    timeTo: '',
    duration: 'Ganzer Tag' as 'Ganzer Tag' | 'Zeitfenster',
    status: 'unentschuldigt' as 'krankgemeldet' | 'unentschuldigt' | 'beurlaubt' | 'ungeklärt' | 'verspätet',
    reason: '',
    hasAttachment: false,
    hasAccess: true,
    sourceType: 'schuleingabe' as 'eltern-app' | 'anwesenheit' | 'schuleingabe'
  });

  const [isFullDay, setIsFullDay] = useState(true);
  const [isMultipleDays, setIsMultipleDays] = useState(false);
  const [studentSearch, setStudentSearch] = useState('');
  const [showStudentSuggestions, setShowStudentSuggestions] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingEntry) {
      const timeRange = editingEntry.dateRange?.split('–') || [];
      
      // Convert dates from DD.MM.YYYY to YYYY-MM-DD
      const startDate = editingEntry.date.split('.').reverse().join('-');
      const endDate = editingEntry.endDate ? editingEntry.endDate.split('.').reverse().join('-') : '';
      
      setFormData({
        studentName: editingEntry.studentName,
        studentClass: editingEntry.studentClass,
        courseClass: editingEntry.courseClass,
        date: startDate,
        dateTo: endDate,
        timeFrom: timeRange[0]?.trim() || '',
        timeTo: timeRange[1]?.trim() || '',
        duration: editingEntry.duration,
        status: editingEntry.status,
        reason: editingEntry.reason,
        hasAttachment: editingEntry.hasAttachment,
        hasAccess: editingEntry.hasAccess,
        sourceType: editingEntry.sourceType
      });
      setIsFullDay(editingEntry.duration === 'Ganzer Tag');
      setIsMultipleDays(editingEntry.isMultiDay || false);
      setStudentSearch(editingEntry.studentName);
    } else {
      // Reset form for new entry - default to school entry
      const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
      setFormData({
        studentName: '',
        studentClass: '',
        courseClass: '',
        date: today,
        dateTo: '',
        timeFrom: '',
        timeTo: '',
        duration: 'Ganzer Tag',
        status: 'krankgemeldet',
        reason: '',
        hasAttachment: false,
        hasAccess: true,
        sourceType: 'schuleingabe'
      });
      setIsFullDay(true);
      setIsMultipleDays(false);
      setStudentSearch('');
      setUploadedFile(null);
    }
    setErrors({});
  }, [editingEntry, isOpen]);

  const filteredStudents = mockStudents.filter(student =>
    student.name.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const handleStudentSelect = (student: typeof mockStudents[0]) => {
    setFormData({
      ...formData,
      studentName: student.name,
      studentClass: student.class,
      courseClass: student.fullClass
    });
    setStudentSearch(student.name);
    setShowStudentSuggestions(false);
  };

  const handleDurationChange = (isFullDayChecked: boolean) => {
    // If multiple days is selected, always force full day
    if (isMultipleDays) {
      setIsFullDay(true);
      setFormData({
        ...formData,
        duration: 'Ganzer Tag',
        timeFrom: '',
        timeTo: ''
      });
    } else {
      setIsFullDay(isFullDayChecked);
      setFormData({
        ...formData,
        duration: isFullDayChecked ? 'Ganzer Tag' : 'Zeitfenster'
      });
    }
  };

  const handleMultipleDaysChange = (isMultipleDaysChecked: boolean) => {
    setIsMultipleDays(isMultipleDaysChecked);
    
    // If multiple days is selected, force full day
    if (isMultipleDaysChecked) {
      setIsFullDay(true);
      setFormData({
        ...formData,
        duration: 'Ganzer Tag',
        timeFrom: '',
        timeTo: ''
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (allowedTypes.includes(file.type)) {
        setUploadedFile(file);
        setFormData({ ...formData, hasAttachment: true });
      } else {
        alert('Nur PDF, JPG und PNG Dateien sind erlaubt.');
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.studentName.trim()) {
      newErrors.studentName = 'Schüler*in ist erforderlich';
    }
    if (!formData.date) {
      newErrors.date = 'Datum ist erforderlich';
    }
    if (isMultipleDays && !formData.dateTo) {
      newErrors.dateTo = 'End-Datum ist erforderlich';
    }
    if (isMultipleDays && formData.dateTo && formData.date) {
      const startDate = new Date(formData.date);
      const endDate = new Date(formData.dateTo);
      if (endDate < startDate) {
        newErrors.dateTo = 'End-Datum muss nach Start-Datum liegen';
      } else if (endDate.getTime() === startDate.getTime()) {
        newErrors.dateTo = 'Für einen einzigen Tag verwenden Sie bitte "Mehrere Tage" nicht';
      }
    }
    if (!isFullDay && !isMultipleDays && (!formData.timeFrom || !formData.timeTo)) {
      newErrors.timeRange = 'Zeitfenster ist erforderlich';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const dateRange = !isFullDay && formData.timeFrom && formData.timeTo
      ? `${formData.timeFrom}–${formData.timeTo}`
      : undefined;

    if (isMultipleDays && formData.dateTo) {
      // Create a single entry that represents the entire multi-day absence
      const startDate = new Date(formData.date);
      const endDate = new Date(formData.dateTo);
      
      const entryData = {
        studentName: formData.studentName,
        studentClass: formData.studentClass,
        courseClass: formData.courseClass,
        date: startDate.toLocaleDateString('de-DE'),
        dateRange,
        duration: formData.duration,
        status: formData.status,
        reason: formData.reason,
        hasAttachment: formData.hasAttachment,
        hasAccess: formData.hasAccess,
        sourceType: formData.sourceType,
        endDate: endDate.toLocaleDateString('de-DE'),
        isMultiDay: true
      };
      
      onSave([entryData]);
    } else {
      // Single day entry
      const entryData = {
        studentName: formData.studentName,
        studentClass: formData.studentClass,
        courseClass: formData.courseClass,
        date: new Date(formData.date).toLocaleDateString('de-DE'),
        dateRange,
        duration: formData.duration,
        status: formData.status,
        reason: formData.reason,
        hasAttachment: formData.hasAttachment,
        hasAccess: formData.hasAccess,
        sourceType: formData.sourceType,
        isMultiDay: false
      };

      onSave([entryData]);
    }
  };

  const isFormValid = formData.studentName.trim() && formData.date && 
    (!isMultipleDays || formData.dateTo) &&
    (isFullDay || isMultipleDays || (formData.timeFrom && formData.timeTo));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingEntry ? 'Fehlzeit bearbeiten' : 'Fehlzeit eintragen'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Student Selection */}
          <div className="space-y-2">
            <Label htmlFor="student">Schüler*in *</Label>
            <div className="relative">
              <Input
                id="student"
                value={studentSearch}
                onChange={(e) => {
                  setStudentSearch(e.target.value);
                  setShowStudentSuggestions(e.target.value.length > 0);
                }}
                onFocus={() => setShowStudentSuggestions(studentSearch.length > 0)}
                placeholder="Schüler*in suchen..."
                className={errors.studentName ? 'border-destructive' : ''}
              />
              {showStudentSuggestions && studentSearch.length > 0 && filteredStudents.length > 0 && (
                <Card className="absolute z-10 w-full mt-1 max-h-40 overflow-y-auto">
                  {filteredStudents.map((student, index) => (
                    <div
                      key={index}
                      className="hover:bg-accent cursor-pointer border-b last:border-b-0"
                      onClick={() => handleStudentSelect(student)}
                    >
                      <div className="px-3 py-0">{student.name} ({student.class})</div>
                    </div>
                  ))}
                </Card>
              )}
            </div>
            {errors.studentName && (
              <p className="text-sm text-destructive">{errors.studentName}</p>
            )}
            {formData.studentClass && (
              <p className="text-sm text-muted-foreground">
                Klasse: {formData.courseClass}
              </p>
            )}
          </div>

          {/* Date and Time */}
          <div className="space-y-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="fullDay"
                  checked={isFullDay}
                  onCheckedChange={handleDurationChange}
                  disabled={isMultipleDays}
                />
                <Label htmlFor="fullDay" className={isMultipleDays ? 'text-muted-foreground' : ''}>
                  Ganzer Tag
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="multipleDays"
                  checked={isMultipleDays}
                  onCheckedChange={handleMultipleDaysChange}
                />
                <Label htmlFor="multipleDays">Mehrere Tage</Label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">{isMultipleDays ? 'Von Datum *' : 'Datum *'}</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className={errors.date ? 'border-destructive' : ''}
                />
                {errors.date && (
                  <p className="text-sm text-destructive">{errors.date}</p>
                )}
              </div>

              {isMultipleDays && (
                <div className="space-y-2">
                  <Label htmlFor="dateTo">Bis Datum *</Label>
                  <Input
                    id="dateTo"
                    type="date"
                    value={formData.dateTo}
                    onChange={(e) => setFormData({ ...formData, dateTo: e.target.value })}
                    className={errors.dateTo ? 'border-destructive' : ''}
                  />
                  {errors.dateTo && (
                    <p className="text-sm text-destructive">{errors.dateTo}</p>
                  )}
                </div>
              )}

              {!isFullDay && !isMultipleDays && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="timeFrom">Von</Label>
                    <Input
                      id="timeFrom"
                      type="time"
                      value={formData.timeFrom}
                      onChange={(e) => setFormData({ ...formData, timeFrom: e.target.value })}
                      className={errors.timeRange ? 'border-destructive' : ''}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeTo">Bis</Label>
                    <Input
                      id="timeTo"
                      type="time"
                      value={formData.timeTo}
                      onChange={(e) => setFormData({ ...formData, timeTo: e.target.value })}
                      className={errors.timeRange ? 'border-destructive' : ''}
                    />
                  </div>
                </>
              )}
            </div>
            {errors.timeRange && (
              <p className="text-sm text-destructive">{errors.timeRange}</p>
            )}
            {isMultipleDays && (
              <p className="text-sm text-muted-foreground">
                Bei mehreren Tagen sind nur ganze Tage möglich. Die Fehlzeit umfasst alle Tage von Start- bis End-Datum (inklusive).
                <br />
                Beispiel: 18.08. bis 21.08. = 4 Tage (18., 19., 20., 21.)
              </p>
            )}
          </div>

          {/* Source Type (Read-only) */}
          <div className="space-y-2">
            <Label>Art der Meldung</Label>
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md">
              <Info className="h-4 w-4 text-muted-foreground" />
              <span>
                {formData.sourceType === 'eltern-app' && 'Eltern-App'}
                {formData.sourceType === 'anwesenheit' && 'Anwesenheit/Klassenbuch'}
                {formData.sourceType === 'schuleingabe' && 'Schuleingabe'}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Diese Information kann nicht geändert werden.
            </p>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value: 'krankgemeldet' | 'unentschuldigt' | 'beurlaubt' | 'ungeklärt' | 'verspätet') => 
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unentschuldigt">Unentschuldigt</SelectItem>
                <SelectItem value="krankgemeldet">Krankgemeldet</SelectItem>
                <SelectItem value="beurlaubt">Beurlaubt</SelectItem>
                <SelectItem value="ungeklärt">Ungeklärt</SelectItem>
                <SelectItem value="verspätet">Verspätet</SelectItem>
              </SelectContent>
            </Select>
            {formData.sourceType === 'eltern-app' && (
              <p className="text-sm text-muted-foreground">
                Einträge aus der Eltern-App erhalten standardmäßig den Status "Krankgemeldet", können aber geändert werden.
              </p>
            )}
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">Grund</Label>
            <Textarea
              id="reason"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="Grund für die Fehlzeit..."
              rows={3}
            />
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label>Nachweis hochladen</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-4">
              {uploadedFile ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm">{uploadedFile.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setUploadedFile(null);
                      setFormData({ ...formData, hasAttachment: false });
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center cursor-pointer">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground text-center">
                    PDF, JPG oder PNG hochladen
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Abbrechen
          </Button>
          <Button onClick={handleSave} disabled={!isFormValid}>
            Speichern
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}