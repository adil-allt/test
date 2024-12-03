import React, { useState, useMemo } from 'react';
import { Search, Download, Calendar } from 'lucide-react';
import { useAppointments } from '../contexts/AppointmentContext';
import { useData } from '../contexts/DataContext';
import { formatters } from '../utils/formatters';
import { parseISO, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import ExportOptionsModal from '../components/ExportOptionsModal';
import MutuelleSelect from '../components/MutuelleSelect';
import { ConsultationType, CONSULTATION_TYPES, PaymentStatus } from '../types/payment';
import { getPaymentStatus, getStatusColor, getAvailableStatuses } from '../utils/paymentStatus';

const MUTUELLES = ['RMA', 'CNSS', 'CNOPS', 'SAHAM', 'AXA', 'MCMA', 'Allianz', 'Sanad', 'MGPAP', 'AtlantaSanad'];

export default function Billing() {
  const { appointments, updateAppointment } = useAppointments();
  const { patients } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [showExportModal, setShowExportModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{
    [key: string]: {
      amount: string;
      paymentMethod: string;
      mutuelle: { active: boolean; nom: string };
      type: ConsultationType;
      status: PaymentStatus;
    };
  }>({});

  const handleEdit = (appointmentId: string) => {
    const appointment = paidAppointments.find(apt => apt.id === appointmentId);
    if (appointment) {
      const numAmount = parseFloat(appointment.amount?.replace(',', '.') || '0');
      setEditingAppointment(appointmentId);
      setEditValues({
        [appointmentId]: {
          amount: appointment.amount || '0,00',
          paymentMethod: numAmount === 0 ? '-' : (appointment.paymentMethod || 'Carte Bancaire'),
          mutuelle: appointment.mutuelle || { active: false, nom: '' },
          type: appointment.type as ConsultationType || 'Autre',
          status: appointment.status || 'En attente'
        }
      });
    }
  };

  const handleSave = (appointmentId: string) => {
    const editValue = editValues[appointmentId];
    if (editValue) {
      const numAmount = parseFloat(editValue.amount.replace(',', '.'));
      
      updateAppointment(appointmentId, {
        amount: editValue.amount || '0,00',
        paymentMethod: numAmount === 0 ? '-' : editValue.paymentMethod,
        mutuelle: editValue.mutuelle,
        type: editValue.type,
        status: numAmount === 0 ? editValue.status : getPaymentStatus(editValue.amount)
      });
      setEditingAppointment(null);
    }
  };

  const paidAppointments = useMemo(() => {
    return appointments
      .filter(apt => {
        const patient = patients.find(p => p.id === apt.patientId);
        return patient !== undefined;
      })
      .map(apt => {
        const patient = patients.find(p => p.id === apt.patientId);
        const patientAppointments = appointments
          .filter(a => a.patientId === apt.patientId && a.id !== apt.id)
          .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
        const lastConsultAmount = patientAppointments[0]?.amount || '-';
        
        return {
          ...apt,
          patientDetails: patient,
          lastConsultAmount,
          displayStatus: getPaymentStatus(apt.amount)
        };
      })
      .sort((a, b) => parseISO(b.time).getTime() - parseISO(a.time).getTime());
  }, [appointments, patients]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Paiements</h2>
        <button
          onClick={() => setShowExportModal(true)}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          <Download className="h-5 w-5 mr-2" />
          Exporter
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between space-x-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Rechercher un paiement..."
              />
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div className="flex items-center space-x-2">
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                />
                <span className="text-gray-500">à</span>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  N° Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant dernière consultation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type de paiement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mutuelle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type de consultation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paidAppointments.map((appointment) => {
                const isEditing = editingAppointment === appointment.id;
                const editValue = editValues[appointment.id] || {
                  amount: appointment.amount || '0,00',
                  paymentMethod: appointment.paymentMethod || '-',
                  mutuelle: appointment.mutuelle || { active: false, nom: '' },
                  type: appointment.type as ConsultationType || 'Autre',
                  status: appointment.status || 'En attente'
                };

                const numAmount = parseFloat(editValue.amount.replace(',', '.'));
                const showPaymentMethod = numAmount > 0;

                return (
                  <tr key={appointment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatters.patientNumber(appointment.patientDetails?.numeroPatient)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {`${appointment.patientDetails?.nom.toUpperCase()} ${appointment.patientDetails?.prenom}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(parseISO(appointment.time), 'dd/MM/yyyy', { locale: fr })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {appointment.lastConsultAmount === '-' ? '-' : formatters.amount(appointment.lastConsultAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editValue.amount}
                          onChange={(e) => {
                            const newAmount = e.target.value;
                            const numAmount = parseFloat(newAmount.replace(',', '.'));
                            setEditValues({
                              ...editValues,
                              [appointment.id]: {
                                ...editValue,
                                amount: newAmount,
                                paymentMethod: numAmount === 0 ? '-' : editValue.paymentMethod
                              }
                            });
                          }}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      ) : (
                        formatters.amount(appointment.amount || '0,00')
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {isEditing && showPaymentMethod ? (
                        <select
                          value={editValue.paymentMethod}
                          onChange={(e) => setEditValues({
                            ...editValues,
                            [appointment.id]: { ...editValue, paymentMethod: e.target.value }
                          })}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          <option value="Carte Bancaire">Carte Bancaire</option>
                          <option value="Espèces">Espèces</option>
                          <option value="Virement">Virement</option>
                          <option value="Chèque">Chèque</option>
                          <option value="-">-</option>
                        </select>
                      ) : (
                        editValue.paymentMethod || '-'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <MutuelleSelect
                        value={editValue.mutuelle}
                        onChange={(mutuelle) => setEditValues({
                          ...editValues,
                          [appointment.id]: { ...editValue, mutuelle }
                        })}
                        mutuelles={MUTUELLES}
                        isEditing={isEditing}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing && numAmount === 0 ? (
                        <select
                          value={editValue.status}
                          onChange={(e) => setEditValues({
                            ...editValues,
                            [appointment.id]: { ...editValue, status: e.target.value as PaymentStatus }
                          })}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          {getAvailableStatuses(editValue.amount).map(status => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      ) : (
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(appointment.displayStatus)}`}>
                          {appointment.displayStatus}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {isEditing ? (
                        <select
                          value={editValue.type}
                          onChange={(e) => setEditValues({
                            ...editValues,
                            [appointment.id]: { ...editValue, type: e.target.value as ConsultationType }
                          })}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          {CONSULTATION_TYPES.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      ) : (
                        editValue.type || 'Autre'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {isEditing ? (
                        <button
                          onClick={() => handleSave(appointment.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Enregistrer
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEdit(appointment.id)}
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

      <ExportOptionsModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={() => setShowExportModal(false)}
        totalPatients={paidAppointments.length}
        patientsWithMutuelle={paidAppointments.filter(apt => apt.patientDetails?.mutuelle?.active).length}
        filteredData={paidAppointments}
        dateRange={dateRange}
      />
    </div>
  );
}