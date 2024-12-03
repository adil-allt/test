import React, { useState, useEffect } from 'react';
import { X, User, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useTimeSlots } from '../hooks/useTimeSlots';
import { APPOINTMENT_SOURCES } from '../constants/appointmentSources';
import DraggableModal from './DraggableModal';
import PatientModal from './PatientModal';
import AppointmentSourceModal from './AppointmentSourceModal';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (appointment: any) => void;
  onDelete?: (id: string) => void;
  initialDate?: Date;
  initialTime?: string;
  existingAppointment?: any;
  timezone?: string;
}

export default function AppointmentModal({
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  initialDate,
  initialTime,
  existingAppointment,
  timezone = 'GMT'
}: AppointmentModalProps) {
  const { patients, addPatient } = useData();
  const { timeSlots } = useTimeSlots(timezone);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPatients, setFilteredPatients] = useState(patients);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [showPatientSearch, setShowPatientSearch] = useState(false);

  const defaultAppointment = {
    nom: '',
    prenom: '',
    telephone: '',
    date: initialDate ? initialDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    time: initialTime || '09:00',
    duration: '30',
    source: APPOINTMENT_SOURCES.PHONE.id,
    isExistingPatient: false,
    isLunchBreak: false,
    isClinicalConsultation: false,
    clinicName: '',
    patientId: '',
    type: 'NOUVELLE CONSULTATION',
    status: 'confirmé',
    paid: false,
    paymentMethod: '',
    amount: '',
    isNewPatient: true,
    isDelegue: false,
    isGratuite: false,
    isCanceled: false
  };

  const [appointment, setAppointment] = useState(defaultAppointment);

  useEffect(() => {
    if (existingAppointment) {
      const patient = patients.find(p => p.id === existingAppointment.patientId);
      
      setAppointment({
        ...defaultAppointment,
        ...existingAppointment,
        nom: patient?.nom || existingAppointment.nom || '',
        prenom: patient?.prenom || existingAppointment.prenom || '',
        telephone: patient?.telephone || existingAppointment.telephone || '',
        date: initialDate ? initialDate.toISOString().split('T')[0] : new Date(existingAppointment.time).toISOString().split('T')[0],
        time: initialTime || new Date(existingAppointment.time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', hour12: false }),
        duration: typeof existingAppointment.duration === 'string' ? existingAppointment.duration.replace(/[^0-9]/g, '') : String(existingAppointment.duration || 30),
        isExistingPatient: !!existingAppointment.patientId,
      });

      if (existingAppointment.patientId && patient) {
        setSelectedPatient(patient);
      }
    } else {
      setAppointment(defaultAppointment);
      setSelectedPatient(null);
    }
  }, [existingAppointment, patients, initialDate, initialTime]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = patients.filter(patient => {
        const searchString = `${patient.nom} ${patient.prenom} ${patient.telephone}`.toLowerCase();
        return searchString.includes(searchTerm.toLowerCase());
      });
      setFilteredPatients(filtered);
      setShowPatientSearch(true);
    } else {
      setFilteredPatients([]);
      setShowPatientSearch(false);
    }
  }, [searchTerm, patients]);

  const handlePatientSelect = (patient: any) => {
    setSelectedPatient(patient);
    setAppointment(prev => ({
      ...prev,
      nom: patient.nom,
      prenom: patient.prenom,
      telephone: patient.telephone,
      patientId: patient.id,
      isExistingPatient: true,
      isNewPatient: false
    }));
    setSearchTerm('');
    setShowPatientSearch(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const appointmentData = {
      ...appointment,
      type: appointment.isLunchBreak ? 'PAUSE_DEJEUNER' : 
            appointment.isClinicalConsultation ? 'CONSULTATION_CLINIQUE' : 
            appointment.type,
      time: `${appointment.date}T${appointment.time}:00.000Z`,
      duration: `${appointment.duration} min`,
      patientId: selectedPatient?.id
    };

    onSubmit(appointmentData);
    setAppointment(defaultAppointment);
    onClose();
  };

  return (
    <DraggableModal
      isOpen={isOpen}
      onClose={onClose}
      title={existingAppointment ? "Modifier le rendez-vous" : "Nouveau rendez-vous"}
      className="w-full max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isExistingPatient"
              checked={appointment.isExistingPatient}
              onChange={(e) => {
                setAppointment(prev => ({ ...prev, isExistingPatient: e.target.checked }));
                if (!e.target.checked) {
                  setSelectedPatient(null);
                  setSearchTerm('');
                }
              }}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="isExistingPatient" className="text-sm text-gray-700">
              Patient existant
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isLunchBreak"
              checked={appointment.isLunchBreak}
              onChange={(e) => setAppointment(prev => ({ ...prev, isLunchBreak: e.target.checked }))}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="isLunchBreak" className="text-sm text-gray-700">
              Pause déjeuner
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isClinicalConsultation"
              checked={appointment.isClinicalConsultation}
              onChange={(e) => setAppointment(prev => ({ ...prev, isClinicalConsultation: e.target.checked }))}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="isClinicalConsultation" className="text-sm text-gray-700">
              Consultation Clinique
            </label>
          </div>
        </div>

        {appointment.isExistingPatient && (
          <div className="space-y-4">
            <div className="relative">
              <div className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  placeholder="Rechercher un patient..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md"
                />
                <button
                  type="button"
                  onClick={() => setIsPatientModalOpen(true)}
                  className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  <User className="h-5 w-5" />
                </button>
              </div>

              {showPatientSearch && (
                <div className="absolute z-10 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                  {filteredPatients.map((patient) => (
                    <div
                      key={patient.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handlePatientSelect(patient)}
                    >
                      <div className="font-medium">{patient.nom} {patient.prenom}</div>
                      <div className="text-sm text-gray-600">{patient.telephone}</div>
                    </div>
                  ))}
                </div>
              )}

              {selectedPatient && (
                <div className="mt-2 p-3 bg-gray-50 rounded-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{selectedPatient.nom} {selectedPatient.prenom}</div>
                      <div className="text-sm text-gray-600">{selectedPatient.telephone}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsPatientModalOpen(true)}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {!appointment.isLunchBreak && !appointment.isClinicalConsultation && !appointment.isExistingPatient && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom</label>
              <input
                type="text"
                value={appointment.nom}
                onChange={(e) => setAppointment(prev => ({ ...prev, nom: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required={!appointment.isLunchBreak}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Prénom</label>
              <input
                type="text"
                value={appointment.prenom}
                onChange={(e) => setAppointment(prev => ({ ...prev, prenom: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required={!appointment.isLunchBreak}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Téléphone</label>
              <input
                type="tel"
                value={appointment.telephone}
                onChange={(e) => setAppointment(prev => ({ ...prev, telephone: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required={!appointment.isLunchBreak}
                placeholder="0612345678"
              />
            </div>
          </div>
        )}

        {appointment.isClinicalConsultation && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom de la clinique</label>
            <input
              type="text"
              value={appointment.clinicName}
              onChange={(e) => setAppointment(prev => ({ ...prev, clinicName: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
        )}

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              value={appointment.date}
              onChange={(e) => setAppointment(prev => ({ ...prev, date: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Heure ({timezone})</label>
            <select
              value={appointment.time}
              onChange={(e) => setAppointment(prev => ({ ...prev, time: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            >
              {timeSlots.map((time) => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Durée (min)</label>
            <select
              value={appointment.duration}
              onChange={(e) => setAppointment(prev => ({ ...prev, duration: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="15">15</option>
              <option value="30">30</option>
              <option value="45">45</option>
              <option value="60">60</option>
              <option value="90">90</option>
              <option value="120">120</option>
            </select>
          </div>
        </div>

        {!appointment.isLunchBreak && !appointment.isClinicalConsultation && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Source du rendez-vous</label>
              <button
                type="button"
                onClick={() => setIsSourceModalOpen(true)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Edit className="h-5 w-5" />
              </button>
            </div>
            <select
              value={appointment.source}
              onChange={(e) => setAppointment(prev => ({ ...prev, source: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            >
              {Object.values(APPOINTMENT_SOURCES).map((source) => (
                <option key={source.id} value={source.id}>{source.label}</option>
              ))}
            </select>
          </div>
        )}

        <div className="flex justify-between space-x-3 pt-4">
          {existingAppointment && onDelete && (
            <button
              type="button"
              onClick={() => onDelete(existingAppointment.id)}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
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
              {existingAppointment ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </div>
      </form>

      <PatientModal
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
        onSubmit={(patientData) => {
          if (selectedPatient) {
            handlePatientSelect({ ...selectedPatient, ...patientData });
          } else {
            const newPatient = {
              ...patientData,
              id: Date.now().toString()
            };
            addPatient(newPatient);
            handlePatientSelect(newPatient);
          }
          setIsPatientModalOpen(false);
        }}
        initialData={selectedPatient}
      />

      <AppointmentSourceModal
        isOpen={isSourceModalOpen}
        onClose={() => setIsSourceModalOpen(false)}
        onUpdate={(updatedSources) => {
          setIsSourceModalOpen(false);
        }}
      />
    </DraggableModal>
  );
}