import React from 'react';
import { Calendar, Clock, CreditCard, FileText } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { formatters } from '../utils/formatters';
import DraggableModal from './DraggableModal';

interface ConsultationHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: {
    nom: string;
    prenom: string;
    consultations: Array<{
      date: string;
      type: string;
      montant: string;
      status?: string;
      paymentMethod?: string;
      hasFicheConsultation?: boolean;
    }>;
  };
}

export default function ConsultationHistoryModal({
  isOpen,
  onClose,
  patient
}: ConsultationHistoryModalProps) {
  if (!isOpen) return null;

  const totalAmount = patient.consultations.reduce((sum, consultation) => {
    const amount = parseFloat(consultation.montant.replace(',', '.'));
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  const handleFicheClick = (consultation: any) => {
    // Logique pour afficher/télécharger la fiche de consultation
    console.log('Afficher la fiche de consultation:', consultation);
  };

  return (
    <DraggableModal
      isOpen={isOpen}
      onClose={onClose}
      title="Historique des consultations"
      className="w-full max-w-2xl"
    >
      <p className="text-sm text-gray-500 mb-4">
        {patient.nom} {patient.prenom} - {patient.consultations.length} consultation{patient.consultations.length > 1 ? 's' : ''}
      </p>

      <div className="flex-1 overflow-y-auto max-h-[60vh]">
        {patient.consultations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Calendar className="h-12 w-12 mb-2" />
            <p>Aucune consultation</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date et heure
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fiche
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {patient.consultations.map((consultation, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900">
                        {format(parseISO(consultation.date), 'EEEE d MMMM yyyy', { locale: fr })}
                      </span>
                      <Clock className="h-4 w-4 text-gray-400 ml-2" />
                      <span className="text-sm text-gray-900">
                        {format(parseISO(consultation.date), 'HH:mm')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">
                        {formatters.amount(consultation.montant)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleFicheClick(consultation)}
                      className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-md hover:bg-indigo-200"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Fiche de consultation
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {patient.consultations.length > 0 && (
        <div className="mt-4 pt-4 border-t flex items-center justify-between bg-gray-50 px-6 py-3 rounded-lg">
          <div className="text-sm font-medium text-gray-700">
            Total des consultations
          </div>
          <div className="text-lg font-bold text-gray-900">
            {formatters.amount(totalAmount.toFixed(2).replace('.', ','))}
          </div>
        </div>
      )}
    </DraggableModal>
  );
}