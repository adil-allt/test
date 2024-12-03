import React, { useState } from 'react';
import { Plus, Edit, Trash2, Check } from 'lucide-react';
import DraggableModal from './DraggableModal';

interface MutuelleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (mutuelles: string[]) => void;
  initialMutuelles: string[];
}

export default function MutuelleModal({
  isOpen,
  onClose,
  onUpdate,
  initialMutuelles
}: MutuelleModalProps) {
  const [mutuelles, setMutuelles] = useState(initialMutuelles);
  const [editingMutuelle, setEditingMutuelle] = useState<string | null>(null);
  const [newMutuelleName, setNewMutuelleName] = useState('');
  const [newMutuelle, setNewMutuelle] = useState('');

  const handleEdit = (mutuelle: string) => {
    setEditingMutuelle(mutuelle);
    setNewMutuelleName(mutuelle);
  };

  const handleSave = (oldMutuelle: string) => {
    if (newMutuelleName.trim()) {
      setMutuelles(prev => prev.map(m => m === oldMutuelle ? newMutuelleName.trim() : m));
      setEditingMutuelle(null);
      setNewMutuelleName('');
    }
  };

  const handleDelete = (mutuelle: string) => {
    setMutuelles(prev => prev.filter(m => m !== mutuelle));
  };

  const handleAdd = () => {
    if (newMutuelle.trim() && !mutuelles.includes(newMutuelle.trim())) {
      setMutuelles(prev => [...prev, newMutuelle.trim()]);
      setNewMutuelle('');
    }
  };

  const handleSubmit = () => {
    onUpdate(mutuelles);
    onClose();
  };

  return (
    <DraggableModal
      isOpen={isOpen}
      onClose={onClose}
      title="Gérer les mutuelles"
      className="w-full max-w-md"
    >
      <div className="space-y-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMutuelle}
            onChange={(e) => setNewMutuelle(e.target.value)}
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Nouvelle mutuelle..."
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
          {mutuelles.map((mutuelle) => (
            <div key={mutuelle} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
              {editingMutuelle === mutuelle ? (
                <input
                  type="text"
                  value={newMutuelleName}
                  onChange={(e) => setNewMutuelleName(e.target.value)}
                  className="flex-1 mr-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              ) : (
                <span className="text-sm font-medium text-gray-900">{mutuelle}</span>
              )}
              <div className="flex items-center space-x-2">
                {editingMutuelle === mutuelle ? (
                  <button
                    onClick={() => handleSave(mutuelle)}
                    className="text-green-600 hover:text-green-900"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleEdit(mutuelle)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(mutuelle)}
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