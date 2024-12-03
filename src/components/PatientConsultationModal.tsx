import React, { useState, useEffect, useCallback } from 'react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { FileText, Download, Plus, Edit, Trash2, Save, Upload, X } from 'lucide-react';
import DraggableModal from './DraggableModal';
import { useData } from '../contexts/DataContext';

interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
}

interface Consultation {
  id: string;
  date: string;
  ficheNumber: string;
  type: string;
  notes: string;
  documents: Document[];
  archived?: boolean;
  archivedNotes?: Array<{
    timestamp: string;
    content: string;
    author: string;
  }>;
  lastModified?: string;
}

interface PatientConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: {
    id: string;
    nom: string;
    prenom: string;
    numeroPatient: string;
    consultations: Consultation[];
  };
}

export default function PatientConsultationModal({
  isOpen,
  onClose,
  patient
}: PatientConsultationModalProps) {
  const { updatePatient } = useData();
  const [selectedConsultation, setSelectedConsultation] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedNotes, setEditedNotes] = useState('');
  const [showNewConsultation, setShowNewConsultation] = useState(false);
  const [newConsultation, setNewConsultation] = useState({
    notes: '',
    type: 'Consultation standard'
  });

  // Filtrer les consultations uniques
  const uniqueConsultations = patient.consultations.reduce((acc, current) => {
    const existingConsultation = acc.find(c => c.ficheNumber === current.ficheNumber);
    if (!existingConsultation) {
      acc.push(current);
    }
    return acc;
  }, [] as Consultation[]);

  // Trouver la consultation sélectionnée
  const consultation = uniqueConsultations.find(c => c.id === selectedConsultation);

  // Initialiser la consultation sélectionnée
  useEffect(() => {
    if (uniqueConsultations.length > 0 && !selectedConsultation) {
      setSelectedConsultation(uniqueConsultations[0].id);
    }
  }, [uniqueConsultations, selectedConsultation]);

  // Mettre à jour les notes éditées quand la consultation change
  useEffect(() => {
    if (consultation) {
      setEditedNotes(consultation.notes || '');
    }
  }, [consultation]);

  // Fonction de sauvegarde des notes
  const saveNotes = useCallback((notes: string, isAutoSave = false) => {
    if (!consultation) return;

    const currentTime = format(new Date(), 'dd/MM/yyyy HH:mm:ss');
    const updatedConsultation = {
      ...consultation,
      notes: notes,
      lastModified: currentTime,
      archivedNotes: [
        ...(consultation.archivedNotes || []),
        {
          timestamp: currentTime,
          content: consultation.notes || '',
          author: isAutoSave ? 'Système (Auto-save)' : 'Utilisateur'
        }
      ]
    };

    const updatedConsultations = uniqueConsultations.map(c => 
      c.id === consultation.id ? updatedConsultation : c
    );

    updatePatient(patient.id, {
      ...patient,
      consultations: updatedConsultations
    });

    // Mettre à jour l'état local
    setSelectedConsultation(updatedConsultation.id);
  }, [consultation, patient, uniqueConsultations, updatePatient]);

  // Auto-sauvegarde pendant l'édition
  useEffect(() => {
    if (isEditing && consultation && editedNotes !== consultation.notes) {
      const timeoutId = setTimeout(() => {
        saveNotes(editedNotes, true);
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [editedNotes, consultation, isEditing, saveNotes]);

  const handleEdit = () => {
    if (consultation) {
      setEditedNotes(consultation.notes || '');
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    if (!consultation) return;
    saveNotes(editedNotes);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (!consultation) return;
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette consultation ?')) return;

    const currentTime = format(new Date(), 'dd/MM/yyyy HH:mm:ss');
    const updatedConsultation = {
      ...consultation,
      archived: true,
      lastModified: currentTime,
      archivedNotes: [
        ...(consultation.archivedNotes || []),
        {
          timestamp: currentTime,
          content: 'CONSULTATION SUPPRIMÉE',
          author: 'Utilisateur'
        }
      ]
    };

    const updatedConsultations = uniqueConsultations.map(c => 
      c.id === consultation.id ? updatedConsultation : c
    );

    updatePatient(patient.id, {
      ...patient,
      consultations: updatedConsultations
    });
  };

  const handleNewConsultation = () => {
    const currentTime = format(new Date(), 'dd/MM/yyyy HH:mm:ss');
    const newConsultationData: Consultation = {
      id: `new-${Date.now()}`,
      date: new Date().toISOString(),
      ficheNumber: `F${Date.now().toString().slice(-6)}`,
      type: newConsultation.type,
      notes: newConsultation.notes,
      documents: [],
      archivedNotes: [],
      lastModified: currentTime
    };

    const updatedConsultations = [...uniqueConsultations, newConsultationData];
    updatePatient(patient.id, {
      ...patient,
      consultations: updatedConsultations
    });

    setSelectedConsultation(newConsultationData.id);
    setShowNewConsultation(false);
    setNewConsultation({ notes: '', type: 'Consultation standard' });
  };

  return (
    <DraggableModal
      isOpen={isOpen}
      onClose={onClose}
      title="Détails des consultations"
      className="w-full max-w-4xl"
    >
      <div className="flex h-[calc(100vh-200px)]">
        <div className="w-1/3 border-r border-gray-200 p-4 overflow-y-auto">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {patient.nom} {patient.prenom}
            </h3>
            <p className="text-sm text-gray-500">N° Patient: {patient.numeroPatient}</p>
          </div>

          <div className="space-y-2">
            {uniqueConsultations.map((consult, index) => (
              <button
                key={`${consult.id}-${index}`}
                onClick={() => {
                  setSelectedConsultation(consult.id);
                  setIsEditing(false);
                }}
                className={`w-full text-left p-2 rounded ${
                  selectedConsultation === consult.id
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="font-medium">
                  {format(parseISO(consult.date), 'dd/MM/yyyy', { locale: fr })}
                </div>
                <div className="text-sm text-gray-500">
                  Fiche N° {consult.ficheNumber}
                </div>
                {consult.notes && (
                  <div className="mt-1 text-xs text-gray-500 truncate">
                    {consult.notes}
                  </div>
                )}
                {consult.lastModified && (
                  <div className="mt-1 text-xs text-gray-400">
                    Modifié le {consult.lastModified}
                  </div>
                )}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowNewConsultation(true)}
            className="mt-4 w-full flex items-center justify-center px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            Nouvelle consultation
          </button>
        </div>

        <div className="flex-1 flex flex-col">
          {consultation && !showNewConsultation ? (
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">
                      Consultation du {format(parseISO(consultation.date), 'dd MMMM yyyy', { locale: fr })}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Fiche N° {consultation.ficheNumber}
                      {consultation.lastModified && (
                        <span className="ml-2 text-gray-400">
                          (Dernière modification : {consultation.lastModified})
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    {isEditing ? (
                      <button
                        onClick={handleSave}
                        className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        <Save className="h-4 w-4 mr-1" />
                        Enregistrer
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={handleEdit}
                          className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Modifier
                        </button>
                        <button
                          onClick={handleDelete}
                          className="flex items-center px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Supprimer
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex-1 p-4 overflow-y-auto">
                {isEditing ? (
                  <textarea
                    value={editedNotes}
                    onChange={(e) => setEditedNotes(e.target.value)}
                    className="w-full h-full p-4 border rounded-lg resize-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Saisissez vos notes ici..."
                  />
                ) : (
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg border">
                      <div className="prose max-w-none">
                        <div className="text-sm text-gray-700 whitespace-pre-wrap">
                          {consultation.notes || 'Aucune note pour cette consultation'}
                        </div>
                      </div>
                    </div>

                    {consultation.archivedNotes?.length > 0 && (
                      <div className="mt-4">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Historique des modifications</h5>
                        <div className="space-y-2">
                          {consultation.archivedNotes.map((note, index) => (
                            <div key={`archived-${index}`} className="text-sm bg-gray-50 p-3 rounded">
                              <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>{note.author}</span>
                                <span>{note.timestamp}</span>
                              </div>
                              <div className="text-gray-700">{note.content}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-sm font-medium text-gray-700">Documents associés</h5>
                  <label className="cursor-pointer">
                    <Upload className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          console.log('Upload du fichier:', file.name);
                        }
                      }}
                      accept=".pdf,.doc,.docx"
                    />
                  </label>
                </div>
                <div className="flex flex-wrap gap-2">
                  {consultation.documents?.map((doc, index) => (
                    <div
                      key={`${doc.id}-${index}`}
                      className="flex items-center p-2 bg-gray-50 rounded-md"
                    >
                      <FileText className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm mr-2">{doc.name}</span>
                      <button
                        onClick={() => console.log('Téléchargement:', doc.name)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : showNewConsultation ? (
            <div className="p-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type de consultation</label>
                  <select
                    value={newConsultation.type}
                    onChange={(e) => setNewConsultation({ ...newConsultation, type: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option>Consultation standard</option>
                    <option>Suivi</option>
                    <option>Urgence</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
                  <textarea
                    value={newConsultation.notes}
                    onChange={(e) => setNewConsultation({ ...newConsultation, notes: e.target.value })}
                    rows={15}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Saisissez vos notes..."
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowNewConsultation(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleNewConsultation}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Enregistrer
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </DraggableModal>
  );
}