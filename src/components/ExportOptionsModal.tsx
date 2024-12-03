import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { exportToExcel } from '../utils/excelExport';

interface Column {
  id: string;
  label: string;
}

interface ExportOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: () => void;
  totalPatients: number;
  patientsWithMutuelle: number;
  filteredData: any[];
  dateRange: {
    startDate: string;
    endDate: string;
  };
}

const columns: Column[] = [
  { id: 'numeroPatient', label: 'N° Patient' },
  { id: 'patient', label: 'Patient' },
  { id: 'date', label: 'Date' },
  { id: 'montant', label: 'Montant' },
  { id: 'statut', label: 'Statut' },
  { id: 'typePaiement', label: 'Type de paiement' },
  { id: 'mutuelleActive', label: 'Mutuelle' },
  { id: 'mutuelleName', label: 'Nom Mutuelle' },
  { id: 'derniereConsultation', label: 'Dernière consultation' }
];

export default function ExportOptionsModal({
  isOpen,
  onClose,
  onExport,
  totalPatients,
  patientsWithMutuelle,
  filteredData,
  dateRange: initialDateRange
}: ExportOptionsModalProps) {
  const [selectedColumns, setSelectedColumns] = useState<string[]>(columns.map(col => col.id));
  const [exportLimit, setExportLimit] = useState<string>('');
  const [dateRange, setDateRange] = useState(initialDateRange);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      const modalRect = modalRef.current.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      setPosition({
        x: (windowWidth - modalRect.width) / 2,
        y: (windowHeight - modalRect.height) / 2
      });
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target instanceof HTMLElement && e.target.closest('.modal-header')) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;

      const modalRect = modalRef.current?.getBoundingClientRect();
      if (!modalRect) return;

      const maxX = window.innerWidth - modalRect.width;
      const maxY = window.innerHeight - modalRect.height;

      setPosition({
        x: Math.min(Math.max(0, newX), maxX),
        y: Math.min(Math.max(0, newY), maxY)
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleColumnToggle = (columnId: string) => {
    setSelectedColumns(prev =>
      prev.includes(columnId)
        ? prev.filter(id => id !== columnId)
        : [...prev, columnId]
    );
  };

  const handleExport = () => {
    let dataToExport = filteredData.map(item => ({
      numeroPatient: item.patientDetails?.numeroPatient || '',
      patient: `${item.patientDetails?.nom} ${item.patientDetails?.prenom}`,
      date: format(new Date(item.time), 'dd/MM/yyyy', { locale: fr }),
      montant: item.amount || '0,00',
      statut: item.status || '-',
      typePaiement: item.paymentMethod || '-',
      mutuelleActive: item.patientDetails?.mutuelle?.active ? 'Oui' : 'Non',
      mutuelleName: item.patientDetails?.mutuelle?.active ? item.patientDetails.mutuelle.nom : '-',
      derniereConsultation: item.lastConsultAmount || '-'
    }));

    // Filtrer par date
    if (dateRange.startDate && dateRange.endDate) {
      const start = new Date(dateRange.startDate);
      const end = new Date(dateRange.endDate);
      dataToExport = dataToExport.filter(item => {
        const itemDate = new Date(item.date.split('/').reverse().join('-'));
        return itemDate >= start && itemDate <= end;
      });
    }

    // Séparer les patients avec et sans mutuelle
    const patientsAvecMutuelle = dataToExport.filter(item => item.mutuelleActive === 'Oui');
    const patientsSansMutuelle = dataToExport.filter(item => item.mutuelleActive === 'Non');

    // Appliquer la logique de limite
    const limit = parseInt(exportLimit);
    if (!isNaN(limit) && limit > 0) {
      if (patientsAvecMutuelle.length >= limit) {
        dataToExport = patientsAvecMutuelle;
      } else {
        const remainingSlots = limit - patientsAvecMutuelle.length;
        const randomSansMutuelle = patientsSansMutuelle
          .sort(() => Math.random() - 0.5)
          .slice(0, remainingSlots);
        
        dataToExport = [...patientsAvecMutuelle, ...randomSansMutuelle];
      }
    }

    const selectedData = dataToExport.map(item => {
      const filteredItem: any = {};
      selectedColumns.forEach(colId => {
        filteredItem[colId] = item[colId];
      });
      return filteredItem;
    });

    const formatDateForFilename = (dateStr: string) => {
      try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
          throw new Error('Invalid date');
        }
        return format(date, 'dd-MM', { locale: fr });
      } catch {
        return 'date-invalide';
      }
    };

    const startDateStr = formatDateForFilename(dateRange.startDate);
    const endDateStr = formatDateForFilename(dateRange.endDate);
    const exportDateStr = format(new Date(), 'dd-MM-yyyy', { locale: fr });
    const fileName = `Paiement_du_${startDateStr}_au_${endDateStr}_le_${exportDateStr}`;

    exportToExcel(selectedData, fileName, columns.filter(col => selectedColumns.includes(col.id)));
    onExport();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-start justify-start z-50"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div
        ref={modalRef}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          cursor: isDragging ? 'grabbing' : 'default'
        }}
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl"
        onMouseDown={handleMouseDown}
      >
        <div className="modal-header flex justify-between items-center p-4 border-b border-gray-200 cursor-grab active:cursor-grabbing">
          <h3 className="text-lg font-medium text-gray-900">Options d'exportation</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Sélectionnez les colonnes à exporter :
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {columns.map(column => (
                  <label key={column.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedColumns.includes(column.id)}
                      onChange={() => handleColumnToggle(column.id)}
                      className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{column.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Limite d'exportation (optionnel)
              </label>
              <input
                type="number"
                value={exportLimit}
                onChange={(e) => setExportLimit(e.target.value)}
                min="1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Nombre maximum de lignes"
              />
              <p className="mt-1 text-xs text-gray-500">
                Note: Si le nombre de patients avec mutuelle dépasse la limite, tous les patients avec mutuelle seront exportés.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date début
                </label>
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date fin
                </label>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-600">
                Total patients : {totalPatients} (dont {patientsWithMutuelle} avec mutuelle)
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleExport}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Exporter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}