import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import DraggableModal from './DraggableModal';

interface AbsenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (absence: any) => void;
}

export default function AbsenceModal({ isOpen, onClose, onSubmit }: AbsenceModalProps) {
  const [absence, setAbsence] = useState({
    employee: '',
    startDate: '',
    endDate: '',
    reason: 'Congé',
    status: 'En attente'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...absence,
      id: Date.now().toString()
    });
    setAbsence({
      employee: '',
      startDate: '',
      endDate: '',
      reason: 'Congé',
      status: 'En attente'
    });
  };

  return (
    <DraggableModal
      isOpen={isOpen}
      onClose={onClose}
      title="Nouvelle absence"
      className="w-full max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Employé</label>
          <input
            type="text"
            value={absence.employee}
            onChange={(e) => setAbsence({...absence, employee: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Date de début
              </div>
            </label>
            <input
              type="date"
              value={absence.startDate}
              onChange={(e) => setAbsence({...absence, startDate: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Date de fin
              </div>
            </label>
            <input
              type="date"
              value={absence.endDate}
              onChange={(e) => setAbsence({...absence, endDate: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Type d'absence</label>
          <select
            value={absence.reason}
            onChange={(e) => setAbsence({...absence, reason: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option>Congé</option>
            <option>Maladie</option>
            <option>Formation</option>
            <option>Autre</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Statut</label>
          <select
            value={absence.status}
            onChange={(e) => setAbsence({...absence, status: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option>En attente</option>
            <option>Approuvé</option>
            <option>Refusé</option>
          </select>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Enregistrer
          </button>
        </div>
      </form>
    </DraggableModal>
  );
}