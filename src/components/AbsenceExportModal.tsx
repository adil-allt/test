import React, { useState } from 'react';
import { X, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import DraggableModal from './DraggableModal';

interface AbsenceExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (dateRange: { startDate: string; endDate: string }) => void;
  totalAbsences: number;
}

export default function AbsenceExportModal({
  isOpen,
  onClose,
  onExport,
  totalAbsences
}: AbsenceExportModalProps) {
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  const handleExport = () => {
    onExport(dateRange);
    setDateRange({ startDate: '', endDate: '' });
    onClose();
  };

  return (
    <DraggableModal
      isOpen={isOpen}
      onClose={onClose}
      title="Options d'exportation"
      className="w-full max-w-lg"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Date début
              </div>
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
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Date fin
              </div>
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
            Total absences à exporter : {totalAbsences}
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
    </DraggableModal>
  );
}