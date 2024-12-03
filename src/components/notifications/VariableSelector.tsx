import React from 'react';
import { Variable } from 'lucide-react';

interface VariableSelectorProps {
  onVariableSelect: (variable: string) => void;
}

const AVAILABLE_VARIABLES = [
  { id: 'patientName', label: 'Nom du patient' },
  { id: 'appointmentDate', label: 'Date du rendez-vous' },
  { id: 'appointmentTime', label: 'Heure du rendez-vous' },
  { id: 'doctorName', label: 'Nom du médecin' },
  { id: 'clinicName', label: 'Nom de la clinique' }
];

export default function VariableSelector({ onVariableSelect }: VariableSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        <div className="flex items-center space-x-2">
          <Variable className="h-4 w-4" />
          <span>Variables disponibles</span>
        </div>
      </label>
      <div className="flex flex-wrap gap-2">
        {AVAILABLE_VARIABLES.map((variable) => (
          <button
            key={variable.id}
            type="button"
            onClick={() => onVariableSelect(variable.id)}
            className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            {variable.label}
          </button>
        ))}
      </div>
    </div>
  );
}