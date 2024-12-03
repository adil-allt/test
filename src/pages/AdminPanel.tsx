import React, { useState } from 'react';
import { UserPlus, Search, Lock, Unlock, RefreshCw, Edit, Trash2, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import UserModal from '../components/UserModal';
import PasswordManagementModal from '../components/PasswordManagementModal';
import BlockUserConfirmModal from '../components/BlockUserConfirmModal';
import { testUsers } from '../data/testData';

export default function AdminPanel() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isBlockConfirmModalOpen, setIsBlockConfirmModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [blockAction, setBlockAction] = useState<'block' | 'unblock'>('block');
  const { hasPermission, resetFailedAttempts, blockUser, unblockUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState(testUsers);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{
    [key: string]: {
      username: string;
      name: string;
      role: string;
      specialite: string;
    };
  }>({});

  const handleAddUser = (userData: any) => {
    const newUser = {
      id: crypto.randomUUID(),
      ...userData,
      dateCreation: new Date().toLocaleDateString('fr-FR'),
      failedAttempts: 0,
      isBlocked: false
    };
    setUsers([...users, newUser]);
    setIsModalOpen(false);
  };

  const handleEdit = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setEditingUser(userId);
      setEditValues({
        [userId]: {
          username: user.username,
          name: user.name,
          role: user.role,
          specialite: user.specialite || ''
        }
      });
    }
  };

  const handleSave = (userId: string) => {
    const editValue = editValues[userId];
    if (editValue) {
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, ...editValue } : user
      ));
      setEditingUser(null);
    }
  };

  const handleDelete = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
    setShowDeleteConfirm(null);
  };

  const handlePasswordManagement = (user: any) => {
    setSelectedUser(user);
    setIsPasswordModalOpen(true);
  };

  const handleBlockToggle = (userId: string, currentlyBlocked: boolean) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setBlockAction(currentlyBlocked ? 'unblock' : 'block');
      setIsBlockConfirmModalOpen(true);
    }
  };

  const handleBlockConfirm = () => {
    if (selectedUser) {
      if (blockAction === 'block') {
        blockUser(selectedUser.id);
      } else {
        unblockUser(selectedUser.id);
      }
      setUsers(users.map(user => 
        user.id === selectedUser.id ? { ...user, isBlocked: blockAction === 'block' } : user
      ));
      setIsBlockConfirmModalOpen(false);
    }
  };

  const handleResetAttempts = (userId: string) => {
    resetFailedAttempts(userId);
    setUsers(users.map(user => 
      user.id === userId ? { ...user, failedAttempts: 0, isBlocked: false } : user
    ));
  };

  const filteredUsers = users.filter(user => {
    const searchTerms = searchTerm.toLowerCase().split(' ');
    
    return searchTerms.every(term => {
      if (term.startsWith('*') && term.endsWith('*')) {
        const searchPattern = term.slice(1, -1).toLowerCase();
        if (searchPattern) {
          const searchableContent = [
            user.name,
            user.username,
            user.role,
            user.specialite,
            user.dateCreation,
            user.isBlocked ? 'bloqué' : 'actif',
            `${user.failedAttempts} tentatives`
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();

          return searchableContent.includes(searchPattern);
        }
        return true;
      }

      const searchableContent = [
        user.name,
        user.username,
        user.role,
        user.specialite,
        user.dateCreation,
        user.isBlocked ? 'bloqué' : 'actif',
        `${user.failedAttempts} tentatives`
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchableContent.includes(term);
    });
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Utilisateurs</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          <UserPlus className="h-5 w-5 mr-2" />
          Nouvel utilisateur
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Rechercher un utilisateur (utilisez * pour une recherche partielle)..."
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom d'utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rôle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Spécialité
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date de création
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => {
                const isEditing = editingUser === user.id;
                const editValue = editValues[user.id] || {
                  username: user.username,
                  name: user.name,
                  role: user.role,
                  specialite: user.specialite || ''
                };

                return (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editValue.name}
                          onChange={(e) => setEditValues({
                            ...editValues,
                            [user.id]: { ...editValue, name: e.target.value }
                          })}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      ) : (
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editValue.username}
                          onChange={(e) => setEditValues({
                            ...editValues,
                            [user.id]: { ...editValue, username: e.target.value }
                          })}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      ) : (
                        <div className="text-sm text-gray-500">
                          {user.username}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <select
                          value={editValue.role}
                          onChange={(e) => setEditValues({
                            ...editValues,
                            [user.id]: { ...editValue, role: e.target.value }
                          })}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          <option value="admin">Administrateur</option>
                          <option value="docteur">Docteur</option>
                          <option value="secretaire">Secrétaire</option>
                        </select>
                      ) : (
                        <div className="text-sm text-gray-500">
                          {user.role}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editValue.specialite}
                          onChange={(e) => setEditValues({
                            ...editValues,
                            [user.id]: { ...editValue, specialite: e.target.value }
                          })}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      ) : (
                        <div className="text-sm text-gray-500">
                          {user.specialite || '-'}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.dateCreation}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.isBlocked ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Bloqué
                        </span>
                      ) : user.failedAttempts > 0 ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          {user.failedAttempts}/5 tentatives
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Actif
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-3">
                        {user.failedAttempts > 0 && !user.isBlocked && (
                          <button
                            onClick={() => handleResetAttempts(user.id)}
                            className="text-yellow-600 hover:text-yellow-900"
                            title="Réinitialiser les tentatives"
                          >
                            <RefreshCw className="h-5 w-5" />
                          </button>
                        )}
                        {isEditing ? (
                          <button
                            onClick={() => handleSave(user.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Enregistrer"
                          >
                            <Check className="h-5 w-5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEdit(user.id)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Modifier"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                        )}
                        <button
                          onClick={() => handlePasswordManagement(user)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Gérer le mot de passe"
                        >
                          <Lock className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleBlockToggle(user.id, user.isBlocked)}
                          className={user.isBlocked ? "text-green-600 hover:text-green-900" : "text-red-600 hover:text-red-900"}
                          title={user.isBlocked ? "Débloquer l'utilisateur" : "Bloquer l'utilisateur"}
                        >
                          {user.isBlocked ? <Unlock className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(user.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Supprimer"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddUser}
      />

      <PasswordManagementModal
        isOpen={isPasswordModalOpen}
        onClose={() => {
          setIsPasswordModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
      />

      <BlockUserConfirmModal
        isOpen={isBlockConfirmModalOpen}
        onClose={() => {
          setIsBlockConfirmModalOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={handleBlockConfirm}
        userName={selectedUser?.name || ''}
        action={blockAction}
      />

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirmer la suppression
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}