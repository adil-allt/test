import React from 'react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import DraggableModal from './DraggableModal';

interface ConsultationListModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: {
    nom: string;
    prenom: string;
    consultations: Array<{
      id: string;
      date: string;
      ficheNumber: string;
    }>;
  };
}

export default function ConsultationListModal({
  isOpen,
  onClose,
  patient
}: ConsultationListModalProps) {
  return (
    <DraggableModal
      isOpen={isOpen}
      onClose={onClose}
      title="Liste des consultations"
      className="w-full max-w-lg"
    >
      <div className="space-y-4">
        <div className="text-lg font-medium text-gray-900 mb-4">
          {patient.nom} {patient.prenom}
        </div>

        <div className="divide-y divide-gray-200">
          {patient.consultations.map((consultation, index) => (
            <div
              key={`${consultation.id}-${index}`}
              className="flex items-center justify-between py-3 hover:bg-gray-50"
            >
              <div className="text-sm text-gray-900">
                Consultation le {format(parseISO(consultation.date), 'd MMMM yyyy', { locale: fr })}
              </div>
              <div className="text-sm text-gray-500">
                Fiche N° {consultation.ficheNumber}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DraggableModal>
  );
}