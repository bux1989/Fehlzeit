import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Paperclip, Lock, CheckCircle, AlertCircle, Info, ArrowUpDown, ArrowUp, ArrowDown, Clock, Shield, HelpCircle } from 'lucide-react';
import { FehlzeitDetailModal } from './FehlzeitDetailModal';

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

interface FehlzeitenTableProps {
  data: FehlzeitEntry[];
  onEdit: (entry: FehlzeitEntry) => void;
  onDelete: (id: string) => void;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSort: (field: string) => void;
}

function StatusPill({ status, endDate, isMultiDay }: { 
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
        <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">
          <CheckCircle className="h-3 w-3 mr-1" />
          {getStatusText('Krankgemeldet')}
        </Badge>
      );
    case 'beurlaubt':
      return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100">
          <Shield className="h-3 w-3 mr-1" />
          {getStatusText('Beurlaubt')}
        </Badge>
      );
    case 'verspätet':
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100">
          <Clock className="h-3 w-3 mr-1" />
          {getStatusText('Verspätet')}
        </Badge>
      );
    case 'ungeklärt':
      return (
        <Badge variant="secondary" className="bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100">
          <HelpCircle className="h-3 w-3 mr-1" />
          {getStatusText('Ungeklärt')}
        </Badge>
      );
    case 'unentschuldigt':
      return (
        <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200 hover:bg-red-100">
          <AlertCircle className="h-3 w-3 mr-1" />
          {getStatusText('Unentschuldigt')}
        </Badge>
      );
    default:
      return (
        <Badge variant="secondary" className="bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100">
          <HelpCircle className="h-3 w-3 mr-1" />
          {getStatusText('Unbekannt')}
        </Badge>
      );
  }
}

function AttachmentIndicator({ hasAttachment, hasAccess }: { hasAttachment: boolean; hasAccess: boolean }) {
  if (!hasAttachment) {
    return <span className="text-muted-foreground">–</span>;
  }
  
  if (!hasAccess) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div className="inline-flex">
              <Lock className="h-4 w-4 text-muted-foreground" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Kein Zugriff auf Nachweise</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className="inline-flex">
            <Paperclip className="h-4 w-4 text-foreground" />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Nachweis vorhanden</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function ReasonCell({ reason }: { reason: string }) {
  if (reason.length <= 40) {
    return <span>{reason}</span>;
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className="text-left">
            <span>{reason.substring(0, 40)}...</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs">{reason}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function SortableHeader({ 
  children, 
  sortKey, 
  currentSort, 
  currentOrder, 
  onSort 
}: { 
  children: React.ReactNode; 
  sortKey: string; 
  currentSort: string; 
  currentOrder: 'asc' | 'desc'; 
  onSort: (field: string) => void; 
}) {
  const isActive = currentSort === sortKey;
  
  return (
    <TableHead>
      <Button
        variant="ghost"
        onClick={() => onSort(sortKey)}
        className="h-auto p-0 font-medium hover:bg-transparent flex items-center gap-2"
      >
        {children}
        {isActive ? (
          currentOrder === 'asc' ? (
            <ArrowUp className="h-4 w-4" />
          ) : (
            <ArrowDown className="h-4 w-4" />
          )
        ) : (
          <ArrowUpDown className="h-4 w-4 opacity-50" />
        )}
      </Button>
    </TableHead>
  );
}

export function FehlzeitenTable({ data, onEdit, onDelete, sortBy, sortOrder, onSort }: FehlzeitenTableProps) {
  const [selectedEntry, setSelectedEntry] = useState<FehlzeitEntry | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleRowClick = (entry: FehlzeitEntry) => {
    setSelectedEntry(entry);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedEntry(null);
  };
  if (data.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h3>Keine Einträge gefunden</h3>
            <p className="text-muted-foreground mt-2">
              Keine Einträge für den gewählten Zeitraum gefunden.
            </p>
          </div>
          <div className="flex gap-2 justify-center">
            <Button variant="outline">Filter zurücksetzen</Button>
            <Button>Fehlzeit eintragen</Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHeader sortKey="firstName" currentSort={sortBy} currentOrder={sortOrder} onSort={onSort}>
                Vorname
              </SortableHeader>
              <SortableHeader sortKey="lastName" currentSort={sortBy} currentOrder={sortOrder} onSort={onSort}>
                Nachname
              </SortableHeader>
              <SortableHeader sortKey="class" currentSort={sortBy} currentOrder={sortOrder} onSort={onSort}>
                Klasse
              </SortableHeader>
              <SortableHeader sortKey="time" currentSort={sortBy} currentOrder={sortOrder} onSort={onSort}>
                Zeit
              </SortableHeader>
              <SortableHeader sortKey="status" currentSort={sortBy} currentOrder={sortOrder} onSort={onSort}>
                Status
              </SortableHeader>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((entry) => (
              <TableRow 
                key={entry.id} 
                className="hover:bg-muted/50 cursor-pointer"
                onClick={() => handleRowClick(entry)}
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span>{entry.studentName.split(' ')[0] || ''}</span>
                    {entry.sourceType === 'eltern-app' && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <div className="inline-flex">
                              <Info className="h-3 w-3 text-blue-500" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Aus Eltern-App übernommen</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </TableCell>
                <TableCell>{entry.studentName.split(' ').slice(1).join(' ') || ''}</TableCell>
                <TableCell>{entry.studentClass}</TableCell>
                <TableCell>
                  {entry.dateRange ? (
                    <span>{entry.dateRange}</span>
                  ) : (
                    <span className="text-muted-foreground">ganztägig</span>
                  )}
                </TableCell>
                <TableCell>
                  <StatusPill status={entry.status} endDate={entry.endDate} isMultiDay={entry.isMultiDay} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <FehlzeitDetailModal
        entry={selectedEntry}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </Card>
  );
}