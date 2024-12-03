import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useData } from '../../contexts/DataContext';
import { useAppointments } from '../../contexts/AppointmentContext';
import { formatters } from '../../utils/formatters';
import ValidationModal from './ValidationModal';

interface ConsultationTableProps {
  visits: Array<{
    id: string;
    time: string;
    patient: string;
    nom?: string;
    prenom?: string;
    patientId?: string;
    amount: string;
    paid: boolean;
    paymentMethod: string;
    isDelegue: boolean;
    isGratuite: boolean;
    isNewPatient: boolean;
    isCanceled: boolean;
    ficheNumber?: string;
    status?: string;
  }>;
  selectedDate: Date;
  dateRange: { start: Date; end: Date };
  onDateSelect: (date: Date) => void;
  onRangeSelect: (range: { start: Date; end: Date } | null) => void;
}

export default function ConsultationTable({ 
  visits, 
  selectedDate, 
  dateRange, 
  onDateSelect, 
  onRangeSelect 
}: ConsultationTableProps) {
  const { patients } = useData();
  const { updateAppointment } = useAppointments();
  const [editingVisit, setEditingVisit] = useState<string | null>(null);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const [editValues, setEditValues] = useState<{
    [key: string]: {
      status: string;
      ficheNumber: string;
    };
  }>({});

  const validateFicheNumber = (number: string): boolean => {
    if (!number) return true;
    const pattern = /^F\d{2}-\d{4}$/i;
    return pattern.test(number);
  };

  const formatFicheNumber = (number: string): string => {
    if (!number) return '';
    
    const cleaned = number.replace(/[^\d-]/g, '');
    const parts = cleaned.split('-');
    
    if (parts.length === 2) {
      const [part1, part2] = parts;
      return `F${part1.padStart(2, '0')}-${part2.padStart(4, '0')}`;
    }
    
    return number;
  };

  const handleEdit = (visitId: string) => {
    const visit = visits.find(v => v.id === visitId);
    if (visit) {
      setEditingVisit(visitId);
      setEditValues({
        [visitId]: {
          status: visit.status || '-',
          ficheNumber: visit.ficheNumber || ''
        }
      });
    }
  };

  const handleSave = async (visitId: string) => {
    const editValue = editValues[visitId];
    const visit = visits.find(v => v.id === visitId);
    
    if (editValue && visit) {
      if (editValue.status === 'Confirmé') {
        if (!editValue.ficheNumber) {
          setValidationMessage('Le numéro de fiche patient est obligatoire pour un rendez-vous confirmé.');
          setShowValidationModal(true);
          return;
        }

        const formattedFicheNumber = formatFicheNumber(editValue.ficheNumber);
        if (!validateFicheNumber(formattedFicheNumber)) {
          setValidationMessage('Le numéro de fiche doit être au format FXX-XXXX');
          setShowValidationModal(true);
          return;
        }

        const ficheExists = visits.some(v => 
          v.id !== visitId && 
          v.ficheNumber === formattedFicheNumber
        );

        if (ficheExists) {
          setValidationMessage('Ce numéro de fiche existe déjà pour un autre patient');
          setShowValidationModal(true);
          return;
        }

        updateAppointment(visitId, {
          ...visit,
          status: editValue.status,
          ficheNumber: formattedFicheNumber
        });
      } else {
        updateAppointment(visitId, {
          ...visit,
          status: editValue.status,
          ficheNumber: ''
        });
      }
      
      setEditingVisit(null);
    }
  };

  const getStatusColor = (status: string | undefined): string => {
    switch (status) {
      case 'Confirmé':
        return 'bg-green-500 text-white';
      case 'Annulé':
        return 'bg-red-500 text-white';
      case 'Reporté':
        return 'bg-yellow-500 text-white';
      case 'Absent':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPatientFiches = (patientId: string | undefined) => {
    if (!patientId) return '';
    
    return visits
      .filter(v => v.patientId === patientId && v.ficheNumber)
      .map(v => v.ficheNumber)
      .filter((f, i, arr) => arr.indexOf(f) === i)
      .join(' / ');
  };

  const getPatientDisplayName = (visit: ConsultationTableProps['visits'][0]) => {
    if (visit.patientId) {
      const patient = patients.find(p => p.id === visit.patientId);
      if (patient) {
        return formatters.patientName(patient.nom, patient.prenom);
      }
    }
    
    if (visit.nom && visit.prenom) {
      return formatters.patientName(visit.nom, visit.prenom);
    }
    
    return visit.patient || '-';
  };

  return (
    <>
      <div className="bg-white shadow rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  N° Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Heure
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ancien Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ancien N° fiche Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  N° fiche Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Confirmation rendez-vous
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {visits.map((visit) => {
                const isEditing = editingVisit === visit.id;
                const editValue = editValues[visit.id] || {
                  status: visit.status || '-',
                  ficheNumber: visit.ficheNumber || ''
                };
                const patient = patients.find(p => p.id === visit.patientId);
                const isNewPatient = !patient;
                const previousFiches = getPatientFiches(visit.patientId);

                return (
                  <tr key={`visit-${visit.id}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatters.patientNumber(patient?.numeroPatient)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(parseISO(visit.time), 'HH:mm')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {isNewPatient && (
                          <UserPlus className="h-4 w-4 text-green-500 mr-2" />
                        )}
                        <span className="text-sm font-medium text-gray-900">
                          {getPatientDisplayName(visit)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {isNewPatient ? 'Non' : 'Oui'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {previousFiches || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {isEditing && editValue.status === 'Confirmé' ? (
                        <input
                          type="text"
                          value={editValue.ficheNumber}
                          onChange={(e) => setEditValues({
                            ...editValues,
                            [visit.id]: { ...editValue, ficheNumber: e.target.value }
                          })}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="FXX-XXXX"
                        />
                      ) : (
                        visit.ficheNumber || '-'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <select
                          value={editValue.status}
                          onChange={(e) => setEditValues({
                            ...editValues,
                            [visit.id]: { 
                              ...editValue, 
                              status: e.target.value,
                              ficheNumber: e.target.value === 'Confirmé' ? editValue.ficheNumber : ''
                            }
                          })}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          <option value="-">-</option>
                          <option value="Confirmé">Confirmé</option>
                          <option value="Annulé">Annulé</option>
                          <option value="Reporté">Reporté</option>
                          <option value="Absent">Absent</option>
                        </select>
                      ) : (
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(visit.status)}`}>
                          {visit.status || '-'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {visit.amount ? formatters.amount(visit.amount) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {isEditing ? (
                        <button
                          onClick={() => handleSave(visit.id)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Enregistrer
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEdit(visit.id)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Modifier
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <ValidationModal
        isOpen={showValidationModal}
        onClose={() => setShowValidationModal(false)}
        message={validationMessage}
      />
    </>
  );
}