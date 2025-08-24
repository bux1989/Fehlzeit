import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Separator } from './ui/separator';
import { CheckCircle, AlertCircle, Paperclip, Lock, Info, Edit2, Trash2, Calendar, Clock, User, FileText, Shield, HelpCircle } from 'lucide-react';

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

interface FehlzeitDetailModalProps {
  entry: FehlzeitEntry | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (entry: FehlzeitEntry) => void;
  onDelete: (id: string) => void;
}

function StatusDisplay({ status, endDate, isMultiDay }: { 
  status: 'krankgemeldet' | 'unentschuldigt' | 'beurlaubt' | 'ungeklärt' | 'verspätet';
  endDate?: string;
  isMultiDay?: boolean;
}) {
  const getStatusText = (baseStatus: string) => {
    if (isMultiDay && endDate) {
      return `${baseStatus} bis ${endDate}`;
    }
    return baseStatus;
  };

  switch (status) {
    case 'krankgemeldet':
      return (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-800 rounded-lg">
            <CheckCircle className="h-4 w-4" />
            <span className="font-medium">{getStatusText('Krankgemeldet')}</span>
          </div>
        </div>
      );
    case 'beurlaubt':
      return (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-800 rounded-lg">
            <Shield className="h-4 w-4" />
            <span className="font-medium">{getStatusText('Beurlaubt')}</span>
          </div>
        </div>
      );
    case 'verspätet':
      return (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-2 bg-yellow-100 text-yellow-800 rounded-lg">
            <Clock className="h-4 w-4" />
            <span className="font-medium">{getStatusText('Verspätet')}</span>
          </div>
        </div>
      );
    case 'ungeklärt':
      return (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-800 rounded-lg">
            <HelpCircle className="h-4 w-4" />
            <span className="font-medium">{getStatusText('Ungeklärt')}</span>
          </div>
        </div>
      );
    case 'unentschuldigt':
      return (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-2 bg-red-100 text-red-800 rounded-lg">
            <AlertCircle className="h-4 w-4" />
            <span className="font-medium">{getStatusText('Unentschuldigt')}</span>
          </div>
        </div>
      );
    default:
      return (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-800 rounded-lg">
            <HelpCircle className="h-4 w-4" />
            <span className="font-medium">{getStatusText('Unbekannt')}</span>
          </div>
        </div>
      );
  }
}

function AttachmentDisplay({ hasAttachment, hasAccess }: { hasAttachment: boolean; hasAccess: boolean }) {
  if (!hasAttachment) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <FileText className="h-4 w-4" />
        <span>Kein Nachweis vorhanden</span>
      </div>
    );
  }
  
  if (!hasAccess) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Lock className="h-4 w-4" />
        <span>Nachweis vorhanden (kein Zugriff)</span>
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-2 text-foreground">
      <Paperclip className="h-4 w-4" />
      <span>Nachweis vorhanden</span>
      <Button variant="outline" size="sm">
        Anzeigen
      </Button>
    </div>
  );
}

export function FehlzeitDetailModal({ entry, isOpen, onClose, onEdit, onDelete }: FehlzeitDetailModalProps) {
  if (!entry) return null;

  const handleDelete = () => {
    if (confirm('Fehlzeit wirklich löschen?')) {
      onDelete(entry.id);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-4">
        <DialogHeader className="pb-2">
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Fehlzeit Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Student Information */}
          <Card className="p-3">
            <div className="space-y-2">
              <h3 className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Schüler*in
              </h3>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{entry.studentName}</span>
                  <Badge variant="outline">{entry.studentClass}</Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Source Type */}
          <Card className="p-3">
            <div className="space-y-2">
              <h3 className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                Art der Meldung
              </h3>
              <div className="flex items-center gap-2">
                {entry.sourceType === 'eltern-app' && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    <Info className="h-3 w-3 mr-1" />
                    Eltern-App
                  </Badge>
                )}
                {entry.sourceType === 'anwesenheit' && (
                  <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Anwesenheit/Klassenbuch
                  </Badge>
                )}
                {entry.sourceType === 'schuleingabe' && (
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                    <Shield className="h-3 w-3 mr-1" />
                    Schuleingabe
                  </Badge>
                )}
              </div>
            </div>
          </Card>

          {/* Date and Time Information */}
          <Card className="p-3">
            <div className="space-y-2">
              <h3 className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Datum & Zeit
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-muted-foreground">Datum</label>
                  <p className="font-medium">{entry.date}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Dauer</label>
                  <p className="font-medium">{entry.duration}</p>
                </div>
                {entry.isMultiDay && entry.endDate && (
                  <div className="md:col-span-2">
                    <label className="text-sm text-muted-foreground">Fehlzeit bis</label>
                    <p className="font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {entry.endDate}
                    </p>
                  </div>
                )}
                {entry.dateRange && (
                  <div className="md:col-span-2">
                    <label className="text-sm text-muted-foreground">Zeitfenster</label>
                    <p className="font-medium flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {entry.dateRange}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Status */}
          <Card className="p-3">
            <div className="space-y-2">
              <h3 className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Status
              </h3>
              <StatusDisplay status={entry.status} endDate={entry.endDate} isMultiDay={entry.isMultiDay} />
            </div>
          </Card>

          {/* Reason */}
          <Card className="p-3">
            <div className="space-y-2">
              <h3 className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Grund
              </h3>
              <p className="text-sm leading-relaxed">{entry.reason || 'Kein Grund angegeben'}</p>
            </div>
          </Card>

          {/* Attachment */}
          <Card className="p-3">
            <div className="space-y-2">
              <h3 className="flex items-center gap-2">
                <Paperclip className="h-4 w-4" />
                Nachweis
              </h3>
              <AttachmentDisplay hasAttachment={entry.hasAttachment} hasAccess={entry.hasAccess} />
            </div>
          </Card>

          <Separator />

          {/* Meta Information */}
          <div className="space-y-1 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Erstellt von:</span>
              <span>{entry.createdBy}</span>
            </div>
            <div className="flex justify-between">
              <span>Erstellt am:</span>
              <span>{entry.createdAt}</span>
            </div>
            {entry.lastEditedBy && entry.lastEditedAt && (
              <>
                <div className="flex justify-between">
                  <span>Zuletzt bearbeitet von:</span>
                  <span>{entry.lastEditedBy}</span>
                </div>
                <div className="flex justify-between">
                  <span>Zuletzt bearbeitet am:</span>
                  <span>{entry.lastEditedAt}</span>
                </div>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-3">
            <Button variant="outline" onClick={onClose}>
              Schließen
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  onEdit(entry);
                  onClose();
                }}
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Bearbeiten
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Löschen
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}