import React, { useState, useEffect } from 'react';
import { X, User, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import DraggableModal from './DraggableModal';
import MutuelleModal from './MutuelleModal';
import AntecedentsModal from './AntecedentsModal';

interface PatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (patient: any) => void;
  onDelete?: (patientId: string) => void;
  initialData?: any;
}

export default function PatientModal({
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  initialData
}: PatientModalProps) {
  const { deletePatient } = useData();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isMutuelleModalOpen, setIsMutuelleModalOpen] = useState(false);
  const [isAntecedentsModalOpen, setIsAntecedentsModalOpen] = useState(false);
  const [patient, setPatient] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    ville: '',
    secteur: '',
    cin: '',
    dateNaissance: '',
    mutuelle: {
      active: false,
      nom: ''
    },
    antecedents: {
      active: false,
      liste: [] as string[]
    }
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [savedMutuelles, setSavedMutuelles] = useState<string[]>([
    'CNOPS', 'CNSS', 'RMA', 'SAHAM', 'AXA'
  ]);
  const [savedAntecedents, setSavedAntecedents] = useState<string[]>(() => {
    const saved = localStorage.getItem('savedAntecedents');
    return saved ? JSON.parse(saved) : [
      'Diabète',
      'Hypertension',
      'Asthme',
      'Allergie',
      'Dépression',
      'Anxiété'
    ];
  });

  useEffect(() => {
    if (initialData) {
      setPatient({
        ...patient,
        ...initialData,
        mutuelle: {
          active: initialData.mutuelle?.active ?? false,
          nom: initialData.mutuelle?.nom || ''
        },
        antecedents: {
          active: initialData.antecedents?.length > 0 ?? false,
          liste: initialData.antecedents || []
        }
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: {[key: string]: string} = {};
    const nameRegex = /^[a-zA-ZÀ-ÿ\s-]+$/;
    const cinRegex = /^[A-Za-z0-9]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!nameRegex.test(patient.nom)) {
      newErrors.nom = 'Le nom ne doit contenir que des lettres, espaces et tirets';
    }
    
    if (!nameRegex.test(patient.prenom)) {
      newErrors.prenom = 'Le prénom ne doit contenir que des lettres, espaces et tirets';
    }

    if (!cinRegex.test(patient.cin)) {
      newErrors.cin = 'Le CIN doit contenir uniquement des lettres et des chiffres';
    }

    if (!phoneRegex.test(patient.telephone)) {
      newErrors.telephone = 'Le numéro de téléphone doit contenir exactement 10 chiffres';
    }

    if (patient.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patient.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const patientData = {
      ...patient,
      ville: patient.ville.trim(),
      secteur: patient.ville.toLowerCase() === 'marrakech' ? patient.secteur : '',
      antecedents: patient.antecedents.active ? patient.antecedents.liste : []
    };

    onSubmit(patientData);
  };

  const handleDelete = () => {
    if (initialData?.id) {
      if (onDelete) {
        onDelete(initialData.id);
      } else {
        deletePatient(initialData.id);
      }
      onClose();
    }
  };

  const handleMutuelleUpdate = (mutuelles: string[]) => {
    setSavedMutuelles(mutuelles);
  };

  const handleAntecedentsUpdate = (antecedents: string[]) => {
    setSavedAntecedents(antecedents);
    localStorage.setItem('savedAntecedents', JSON.stringify(antecedents));
  };

  if (!isOpen) return null;

  if (showDeleteConfirm) {
    return (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">
              Confirmer la suppression
            </h3>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Êtes-vous sûr de vouloir supprimer définitivement ce patient ? Cette action est irréversible.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DraggableModal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Modifier le patient' : 'Nouveau patient'}
      className="w-full max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom</label>
            <input
              type="text"
              value={patient.nom}
              onChange={(e) => setPatient({...patient, nom: e.target.value})}
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                errors.nom 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
              }`}
              required
            />
            {errors.nom && (
              <p className="mt-1 text-xs text-red-600">{errors.nom}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Prénom</label>
            <input
              type="text"
              value={patient.prenom}
              onChange={(e) => setPatient({...patient, prenom: e.target.value})}
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                errors.prenom 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
              }`}
              required
            />
            {errors.prenom && (
              <p className="mt-1 text-xs text-red-600">{errors.prenom}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Téléphone</label>
            <input
              type="tel"
              value={patient.telephone}
              onChange={(e) => setPatient({...patient, telephone: e.target.value})}
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                errors.telephone 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
              }`}
              required
            />
            {errors.telephone && (
              <p className="mt-1 text-xs text-red-600">{errors.telephone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={patient.email}
              onChange={(e) => setPatient({...patient, email: e.target.value})}
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                errors.email 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Ville</label>
            <input
              type="text"
              value={patient.ville}
              onChange={(e) => setPatient({...patient, ville: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">CIN</label>
            <input
              type="text"
              value={patient.cin}
              onChange={(e) => setPatient({...patient, cin: e.target.value})}
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                errors.cin 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
              }`}
              required
            />
            {errors.cin && (
              <p className="mt-1 text-xs text-red-600">{errors.cin}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Date de naissance</label>
            <input
              type="date"
              value={patient.dateNaissance}
              onChange={(e) => setPatient({...patient, dateNaissance: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div className="col-span-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={patient.mutuelle.active}
                  onChange={(e) => setPatient({
                    ...patient,
                    mutuelle: {
                      ...patient.mutuelle,
                      active: e.target.checked,
                      nom: e.target.checked ? patient.mutuelle.nom : ''
                    }
                  })}
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-gray-700">Mutuelle</span>
              </label>
              <button
                type="button"
                onClick={() => setIsMutuelleModalOpen(true)}
                className="text-indigo-600 hover:text-indigo-900"
              >
                <Edit className="h-4 w-4" />
              </button>
            </div>
            {patient.mutuelle.active && (
              <select
                value={patient.mutuelle.nom}
                onChange={(e) => setPatient({
                  ...patient,
                  mutuelle: {
                    ...patient.mutuelle,
                    nom: e.target.value
                  }
                })}
                className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Sélectionner une mutuelle</option>
                {savedMutuelles.map((mutuelle) => (
                  <option key={mutuelle} value={mutuelle}>{mutuelle}</option>
                ))}
              </select>
            )}
          </div>

          <div className="col-span-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={patient.antecedents.active}
                  onChange={(e) => setPatient({
                    ...patient,
                    antecedents: {
                      ...patient.antecedents,
                      active: e.target.checked,
                      liste: e.target.checked ? patient.antecedents.liste : []
                    }
                  })}
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-gray-700">Antécédents médicaux</span>
              </label>
              <button
                type="button"
                onClick={() => setIsAntecedentsModalOpen(true)}
                className="text-indigo-600 hover:text-indigo-900"
              >
                <Edit className="h-4 w-4" />
              </button>
            </div>
            {patient.antecedents.active && (
              <div className="mt-2 space-y-2">
                <p className="text-xs text-gray-500 italic">
                  Maintenez Ctrl (Windows) ou Cmd (Mac) pour sélectionner plusieurs antécédents
                </p>
                <select
                  multiple
                  value={patient.antecedents.liste}
                  onChange={(e) => {
                    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                    setPatient({
                      ...patient,
                      antecedents: {
                        ...patient.antecedents,
                        liste: selectedOptions
                      }
                    });
                  }}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  size={4}
                >
                  {savedAntecedents.map((antecedent) => (
                    <option 
                      key={antecedent} 
                      value={antecedent}
                      className="p-2 hover:bg-indigo-50"
                    >
                      {antecedent}
                    </option>
                  ))}
                </select>
                <div className="text-sm text-gray-600">
                  Sélectionnés : {patient.antecedents.liste.length > 0 
                    ? patient.antecedents.liste.join(', ') 
                    : 'Aucun antécédent sélectionné'}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between space-x-3 pt-4">
          {initialData && (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer
            </button>
          )}
          <div className="flex space-x-3 ml-auto">
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
              {initialData ? 'Valider' : 'Enregistrer'}
            </button>
          </div>
        </div>
      </form>

      <MutuelleModal
        isOpen={isMutuelleModalOpen}
        onClose={() => setIsMutuelleModalOpen(false)}
        onUpdate={handleMutuelleUpdate}
        initialMutuelles={savedMutuelles}
      />

      <AntecedentsModal
        isOpen={isAntecedentsModalOpen}
        onClose={() => setIsAntecedentsModalOpen(false)}
        onUpdate={handleAntecedentsUpdate}
        initialAntecedents={savedAntecedents}
      />
    </DraggableModal>
  );
}