import React from 'react';

interface MutuelleSelectProps {
  value: {
    active: boolean;
    nom: string;
  };
  onChange: (value: { active: boolean; nom: string }) => void;
  mutuelles: string[];
  isEditing?: boolean;
}

export default function MutuelleSelect({ value, onChange, mutuelles, isEditing = true }: MutuelleSelectProps) {
  if (!isEditing) {
    return (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
        value.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {value.active ? `Oui - ${value.nom}` : 'Non'}
      </span>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-4">
        <label className="flex items-center">
          <input
            type="radio"
            checked={!value.active}
            onChange={() => onChange({
              active: false,
              nom: ''
            })}
            className="mr-2 text-red-600 focus:ring-red-500"
          />
          <span className="text-sm text-gray-600">Non</span>
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            checked={value.active}
            onChange={() => onChange({
              active: true,
              nom: value.nom || mutuelles[0]
            })}
            className="mr-2 text-green-600 focus:ring-green-500"
          />
          <span className="text-sm text-gray-600">Oui</span>
        </label>
      </div>
      {value.active && (
        <select
          value={value.nom}
          onChange={(e) => onChange({
            ...value,
            nom: e.target.value
          })}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          {mutuelles.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      )}
    </div>
  );
}