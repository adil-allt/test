import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import DraggableModal from './DraggableModal';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: any) => void;
  initialData?: any;
}

export default function UserModal({ isOpen, onClose, onSubmit, initialData }: UserModalProps) {
  const { hasPermission } = useAuth();
  const [userData, setUserData] = useState({
    username: initialData?.username || '',
    password: '',
    name: initialData?.name || '',
    role: initialData?.role || 'secretaire',
    specialite: initialData?.specialite || ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!userData.username.trim()) {
      newErrors.username = "Le nom d'utilisateur est requis";
    }

    if (!initialData && !userData.password) {
      newErrors.password = "Le mot de passe est requis";
    }

    if (!userData.name.trim()) {
      newErrors.name = "Le nom complet est requis";
    }

    if (!userData.role) {
      newErrors.role = "Le rôle est requis";
    }

    if (userData.role === 'docteur' && !userData.specialite.trim()) {
      newErrors.specialite = "La spécialité est requise pour un docteur";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit(userData);
    setUserData({
      username: '',
      password: '',
      name: '',
      role: 'secretaire',
      specialite: ''
    });
    setErrors({});
  };

  return (
    <DraggableModal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Modifier utilisateur' : 'Nouvel utilisateur'}
      className="w-full max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              Nom d'utilisateur
            </div>
          </label>
          <input
            type="text"
            value={userData.username}
            onChange={(e) => setUserData({...userData, username: e.target.value})}
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
              errors.username 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
            }`}
          />
          {errors.username && (
            <p className="mt-1 text-xs text-red-600">{errors.username}</p>
          )}
        </div>

        {!initialData && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              <div className="flex items-center">
                <Lock className="h-4 w-4 mr-2" />
                Mot de passe
              </div>
            </label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                value={userData.password}
                onChange={(e) => setUserData({...userData, password: e.target.value})}
                className={`block w-full rounded-md shadow-sm sm:text-sm ${
                  errors.password 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                }`}
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
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">{errors.password}</p>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              Nom complet
            </div>
          </label>
          <input
            type="text"
            value={userData.name}
            onChange={(e) => setUserData({...userData, name: e.target.value})}
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
              errors.name 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
            }`}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Rôle</label>
          <select
            value={userData.role}
            onChange={(e) => setUserData({...userData, role: e.target.value})}
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
              errors.role 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
            }`}
          >
            <option value="admin">Administrateur</option>
            <option value="docteur">Docteur</option>
            <option value="secretaire">Secrétaire</option>
          </select>
          {errors.role && (
            <p className="mt-1 text-xs text-red-600">{errors.role}</p>
          )}
        </div>

        {userData.role === 'docteur' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Spécialité</label>
            <input
              type="text"
              value={userData.specialite}
              onChange={(e) => setUserData({...userData, specialite: e.target.value})}
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                errors.specialite 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
              }`}
            />
            {errors.specialite && (
              <p className="mt-1 text-xs text-red-600">{errors.specialite}</p>
            )}
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
            {initialData ? 'Modifier' : 'Créer'}
          </button>
        </div>
      </form>
    </DraggableModal>
  );
}