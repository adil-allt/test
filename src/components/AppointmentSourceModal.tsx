import React, { useState } from 'react';
import { Plus, Edit, Trash2, Check } from 'lucide-react';
import DraggableModal from './DraggableModal';
import { APPOINTMENT_SOURCES } from '../constants/appointmentSources';

interface AppointmentSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (sources: typeof APPOINTMENT_SOURCES) => void;
}

export default function AppointmentSourceModal({
  isOpen,
  onClose,
  onUpdate
}: AppointmentSourceModalProps) {
  const [sources, setSources] = useState(APPOINTMENT_SOURCES);
  const [editingSource, setEditingSource] = useState<string | null>(null);
  const [newSourceLabel, setNewSourceLabel] = useState('');

  const handleEdit = (sourceId: string) => {
    setEditingSource(sourceId);
    setNewSourceLabel(sources[sourceId].label);
  };

  const handleSave = (sourceId: string) => {
    if (newSourceLabel.trim()) {
      setSources(prev => ({
        ...prev,
        [sourceId]: {
          ...prev[sourceId],
          label: newSourceLabel.trim()
        }
      }));
      setEditingSource(null);
      setNewSourceLabel('');
    }
  };

  const handleDelete = (sourceId: string) => {
    const updatedSources = { ...sources };
    delete updatedSources[sourceId];
    setSources(updatedSources);
  };

  const handleSubmit = () => {
    onUpdate(sources);
    onClose();
  };

  return (
    <DraggableModal
      isOpen={isOpen}
      onClose={onClose}
      title="Gérer les sources de rendez-vous"
      className="w-full max-w-md"
    >
      <div className="space-y-4">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <p className="text-sm text-yellow-700">
            Gérez la liste des sources possibles pour les rendez-vous.
          </p>
        </div>

        <div className="space-y-2">
          {Object.entries(sources).map(([id, source]) => (
            <div key={id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
              {editingSource === id ? (
                <input
                  type="text"
                  value={newSourceLabel}
                  onChange={(e) => setNewSourceLabel(e.target.value)}
                  className="flex-1 mr-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              ) : (
                <span className="text-sm font-medium text-gray-900">{source.label}</span>
              )}
              <div className="flex items-center space-x-2">
                {editingSource === id ? (
                  <button
                    onClick={() => handleSave(id)}
                    className="text-green-600 hover:text-green-900"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleEdit(id)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
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
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </DraggableModal>
  );
}