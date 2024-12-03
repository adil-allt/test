import React from 'react';
import { useAppointmentColors } from '../../hooks/useAppointmentColors';

export default function AppointmentLegend() {
  const { typeColors } = useAppointmentColors();

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h4 className="text-xs font-medium text-gray-700 mb-2">Types de rendez-vous</h4>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(typeColors).map(([type, color]) => (
          <div key={type} className="flex items-center">
            <span className={`w-3 h-3 rounded-full ${color.split(' ')[0]} mr-2`}></span>
            <span className="text-xs text-gray-600">{type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}