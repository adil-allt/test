import React, { useState } from 'react';
import { Plus, Edit, Trash2, Check } from 'lucide-react';
import DraggableModal from './DraggableModal';

interface AntecedentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (antecedents: string[]) => void;
  initialAntecedents: string[];
}

export default function AntecedentsModal({
  isOpen,
  onClose,
  onUpdate,
  initialAntecedents
}: AntecedentsModalProps) {
  const [antecedents, setAntecedents] = useState(initialAntecedents);
  const [editingAntecedent, setEditingAntecedent] = useState<string | null>(null);
  const [newAntecedentName, setNewAntecedentName] = useState('');
  const [newAntecedent, setNewAntecedent] = useState('');

  const handleEdit = (antecedent: string) => {
    setEditingAntecedent(antecedent);
    setNewAntecedentName(antecedent);
  };

  const handleSave = (oldAntecedent: string) => {
    if (newAntecedentName.trim()) {
      setAntecedents(prev => prev.map(a => a === oldAntecedent ? newAntecedentName.trim() : a));
      setEditingAntecedent(null);
      setNewAntecedentName('');
    }
  };

  const handleDelete = (antecedent: string) => {
    setAntecedents(prev => prev.filter(a => a !== antecedent));
  };

  const handleAdd = () => {
    if (newAntecedent.trim() && !antecedents.includes(newAntecedent.trim())) {
      setAntecedents(prev => [...prev, newAntecedent.trim()]);
      setNewAntecedent('');
    }
  };

  const handleSubmit = () => {
    onUpdate(antecedents);
    onClose();
  };

  return (
    <DraggableModal
      isOpen={isOpen}
      onClose={onClose}
      title="Gérer les antécédents médicaux"
      className="w-full max-w-md"
    >
      <div className="space-y-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newAntecedent}
            onChange={(e) => setNewAntecedent(e.target.value)}
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Nouvel antécédent..."
          />
          <button
            onClick={handleAdd}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            Ajouter
          </button>
        </div>

        <div className="space-y-2">
          {antecedents.map((antecedent) => (
            <div key={antecedent} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
              {editingAntecedent === antecedent ? (
                <input
                  type="text"
                  value={newAntecedentName}
                  onChange={(e) => setNewAntecedentName(e.target.value)}
                  className="flex-1 mr-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              ) : (
                <span className="text-sm font-medium text-gray-900">{antecedent}</span>
              )}
              <div className="flex items-center space-x-2">
                {editingAntecedent === antecedent ? (
                  <button
                    onClick={() => handleSave(antecedent)}
                    className="text-green-600 hover:text-green-900"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleEdit(antecedent)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(antecedent)}
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
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
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