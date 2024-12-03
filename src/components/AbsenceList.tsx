import React from 'react';
import { Calendar, Clock, User } from 'lucide-react';

interface Absence {
  id: string;
  employee: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
}

interface AbsenceListProps {
  absences: Absence[];
  onStatusChange: (id: string, status: string) => void;
}

export default function AbsenceList({ absences, onStatusChange }: AbsenceListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approuvé':
        return 'bg-green-100 text-green-800';
      case 'Refusé':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-4">
      {absences.map((absence) => (
        <div
          key={absence.id}
          className="bg-white p-4 rounded-lg shadow border border-gray-200 hover:border-gray-300 transition-colors"
        >
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-400" />
                <span className="font-medium text-gray-900">{absence.employee}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>Du {absence.startDate} au {absence.endDate}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>{absence.reason}</span>
              </div>
            </div>
            <select
              value={absence.status}
              onChange={(e) => onStatusChange(absence.id, e.target.value)}
              className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(absence.status)}`}
            >
              <option value="En attente">En attente</option>
              <option value="Approuvé">Approuvé</option>
              <option value="Refusé">Refusé</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}