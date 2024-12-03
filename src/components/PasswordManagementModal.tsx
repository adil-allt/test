import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import DraggableModal from './DraggableModal';

interface PasswordManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

export default function PasswordManagementModal({ isOpen, onClose, user }: PasswordManagementModalProps) {
  const { hasPermission } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    // Simuler la mise à jour du mot de passe
    console.log(`Mot de passe mis à jour pour ${user?.name}`);
    
    // Réinitialiser le formulaire
    setPassword('');
    setConfirmPassword('');
    setCurrentPassword('');
    setError('');
    onClose();
  };

  if (!isOpen || !user) return null;

  return (
    <DraggableModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Gestion du mot de passe - ${user.name}`}
      className="w-full max-w-md"
    >
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {!hasPermission('reset_passwords') && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              <div className="flex items-center">
                <Lock className="h-4 w-4 mr-2" />
                Mot de passe actuel
              </div>
            </label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
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
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            <div className="flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              Nouveau mot de passe
            </div>
          </label>
          <div className="relative mt-1">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

        <div>
          <label className="block text-sm font-medium text-gray-700">
            <div className="flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              Confirmer le nouveau mot de passe
            </div>
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        {hasPermission('view_user_passwords') && (
          <div className="mt-4 p-4 bg-yellow-50 rounded-md">
            <p className="text-sm text-yellow-700">
              En tant qu'administrateur, vous pouvez voir le mot de passe : {password}
            </p>
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
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Mettre à jour
          </button>
        </div>
      </form>
    </DraggableModal>
  );
}