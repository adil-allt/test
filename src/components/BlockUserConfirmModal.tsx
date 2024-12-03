import React, { useState } from 'react';
import { Lock, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import DraggableModal from './DraggableModal';

interface BlockUserConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
  action: 'block' | 'unblock';
}

export default function BlockUserConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  userName,
  action
}: BlockUserConfirmModalProps) {
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Vérifier le mot de passe admin (à adapter selon votre logique d'authentification)
    if (adminPassword === 'admin123') {
      onConfirm();
      setAdminPassword('');
      setError('');
      onClose();
    } else {
      setError('Mot de passe administrateur incorrect');
    }
  };

  return (
    <DraggableModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Confirmation ${action === 'block' ? 'du blocage' : 'du déblocage'}`}
      className="w-full max-w-md"
    >
      <div className="flex items-center mb-4 text-yellow-700 bg-yellow-50 p-4 rounded-md">
        <AlertTriangle className="h-5 w-5 mr-2" />
        <p>
          Vous êtes sur le point de {action === 'block' ? 'bloquer' : 'débloquer'} l'utilisateur <strong>{userName}</strong>.
          {action === 'block' && " Cette action empêchera l'utilisateur de se connecter."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            <div className="flex items-center">
              <Lock className="h-4 w-4 mr-2" />
              Mot de passe administrateur
            </div>
          </label>
          <div className="relative mt-1">
            <input
              type={showPassword ? "text" : "password"}
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="text-sm text-red-600">
            {error}
          </div>
        )}

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
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              action === 'block' 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {action === 'block' ? 'Bloquer' : 'Débloquer'}
          </button>
        </div>
      </form>
    </DraggableModal>
  );
}