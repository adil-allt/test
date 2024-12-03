import React, { createContext, useContext, useState, useEffect } from 'react';
import { format } from 'date-fns';
import { testPatients, testAppointments, testSupplies, testAbsences, testUsers } from '../data/testData';

// Clés pour le localStorage
const STORAGE_KEYS = {
  PATIENTS: 'cabinet_medical_patients',
  APPOINTMENTS: 'cabinet_medical_appointments',
  SUPPLIES: 'cabinet_medical_supplies',
  ABSENCES: 'cabinet_medical_absences',
  USERS: 'cabinet_medical_users',
  LAST_UPDATE: 'cabinet_medical_last_update'
};

interface DataContextType {
  patients: any[];
  appointments: any[];
  supplies: any[];
  absences: any[];
  users: any[];
  addPatient: (patient: any) => void;
  updatePatient: (id: string, patient: any) => void;
  deletePatient: (id: string) => void;
  addAppointment: (appointment: any) => void;
  updateAppointment: (id: string, appointment: any) => void;
  deleteAppointment: (id: string) => void;
  addSupply: (supply: any) => void;
  updateSupply: (id: string, supply: any) => void;
  deleteSupply: (id: string) => void;
  addAbsence: (absence: any) => void;
  updateAbsence: (id: string, absence: any) => void;
  deleteAbsence: (id: string) => void;
  addUser: (user: any) => void;
  updateUser: (id: string, user: any) => void;
  deleteUser: (id: string) => void;
  getPatientConsultations: (patientId: string) => any[];
  getLastConsultation: (patientId: string) => any | null;
  isNewPatient: (patientId: string) => boolean;
  getConsultationCount: (patientId: string) => number;
  reinitialiserDonnees: () => void;
}

const DataContext = createContext<DataContextType | null>(null);

// Fonction utilitaire pour charger les données du localStorage
const loadFromLocalStorage = (key: string, defaultValue: any[]) => {
  try {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : defaultValue;
  } catch (error) {
    console.error(`Erreur lors du chargement de ${key}:`, error);
    return defaultValue;
  }
};

// Fonction utilitaire pour sauvegarder les données dans le localStorage
const saveToLocalStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    localStorage.setItem(STORAGE_KEYS.LAST_UPDATE, new Date().toISOString());
  } catch (error) {
    console.error(`Erreur lors de la sauvegarde de ${key}:`, error);
  }
};

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [patients, setPatients] = useState<any[]>(() => 
    loadFromLocalStorage(STORAGE_KEYS.PATIENTS, testPatients)
  );
  const [appointments, setAppointments] = useState<any[]>(() => 
    loadFromLocalStorage(STORAGE_KEYS.APPOINTMENTS, testAppointments)
  );
  const [supplies, setSupplies] = useState<any[]>(() => 
    loadFromLocalStorage(STORAGE_KEYS.SUPPLIES, testSupplies)
  );
  const [absences, setAbsences] = useState<any[]>(() => 
    loadFromLocalStorage(STORAGE_KEYS.ABSENCES, testAbsences)
  );
  const [users, setUsers] = useState<any[]>(() => 
    loadFromLocalStorage(STORAGE_KEYS.USERS, testUsers)
  );

  // Sauvegarder automatiquement les changements dans le localStorage
  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.PATIENTS, patients);
  }, [patients]);

  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.APPOINTMENTS, appointments);
  }, [appointments]);

  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.SUPPLIES, supplies);
  }, [supplies]);

  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.ABSENCES, absences);
  }, [absences]);

  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.USERS, users);
  }, [users]);

  // Fonctions utilitaires pour la gestion des consultations
  const getPatientConsultations = (patientId: string) => {
    return appointments
      .filter(apt => apt.patientId === patientId && !apt.isCanceled)
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
  };

  const getLastConsultation = (patientId: string) => {
    const consultations = getPatientConsultations(patientId);
    return consultations.length > 1 ? consultations[1] : null;
  };

  const getConsultationCount = (patientId: string) => {
    return getPatientConsultations(patientId).length;
  };

  const isNewPatient = (patientId: string) => {
    return getConsultationCount(patientId) <= 1;
  };

  // Fonctions CRUD pour les patients
  const addPatient = (patient: any) => {
    const newPatient = {
      ...patient,
      id: crypto.randomUUID(),
      numeroPatient: `P${(patients.length + 1).toString().padStart(3, '0')}`,
      createdAt: new Date().toISOString()
    };
    setPatients(prev => [...prev, newPatient]);
  };

  const updatePatient = (id: string, patientData: any) => {
    setPatients(prev => prev.map(patient => 
      patient.id === id ? { ...patient, ...patientData, updatedAt: new Date().toISOString() } : patient
    ));
  };

  const deletePatient = (id: string) => {
    setPatients(prev => prev.filter(patient => patient.id !== id));
    // Supprimer également les rendez-vous associés
    setAppointments(prev => prev.filter(apt => apt.patientId !== id));
  };

  // Fonctions CRUD pour les rendez-vous
  const addAppointment = (appointment: any) => {
    const newAppointment = {
      ...appointment,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    setAppointments(prev => [...prev, newAppointment]);
  };

  const updateAppointment = (id: string, appointmentData: any) => {
    setAppointments(prev => prev.map(appointment => 
      appointment.id === id ? { ...appointment, ...appointmentData, updatedAt: new Date().toISOString() } : appointment
    ));
  };

  const deleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(appointment => appointment.id !== id));
  };

  // Fonctions CRUD pour les fournitures
  const addSupply = (supply: any) => {
    const newSupply = {
      ...supply,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    setSupplies(prev => [...prev, newSupply]);
  };

  const updateSupply = (id: string, supplyData: any) => {
    setSupplies(prev => prev.map(supply => 
      supply.id === id ? { ...supply, ...supplyData, updatedAt: new Date().toISOString() } : supply
    ));
  };

  const deleteSupply = (id: string) => {
    setSupplies(prev => prev.filter(supply => supply.id !== id));
  };

  // Fonctions CRUD pour les absences
  const addAbsence = (absence: any) => {
    const newAbsence = {
      ...absence,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    setAbsences(prev => [...prev, newAbsence]);
  };

  const updateAbsence = (id: string, absenceData: any) => {
    setAbsences(prev => prev.map(absence => 
      absence.id === id ? { ...absence, ...absenceData, updatedAt: new Date().toISOString() } : absence
    ));
  };

  const deleteAbsence = (id: string) => {
    setAbsences(prev => prev.filter(absence => absence.id !== id));
  };

  // Fonctions CRUD pour les utilisateurs
  const addUser = (user: any) => {
    const newUser = {
      ...user,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (id: string, userData: any) => {
    setUsers(prev => prev.map(user => 
      user.id === id ? { ...user, ...userData, updatedAt: new Date().toISOString() } : user
    ));
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  const reinitialiserDonnees = () => {
    setPatients(testPatients);
    setAppointments(testAppointments);
    setSupplies(testSupplies);
    setAbsences(testAbsences);
    setUsers(testUsers);
    localStorage.clear();
  };

  return (
    <DataContext.Provider value={{
      patients,
      appointments,
      supplies,
      absences,
      users,
      addPatient,
      updatePatient,
      deletePatient,
      addAppointment,
      updateAppointment,
      deleteAppointment,
      addSupply,
      updateSupply,
      deleteSupply,
      addAbsence,
      updateAbsence,
      deleteAbsence,
      addUser,
      updateUser,
      deleteUser,
      getPatientConsultations,
      getLastConsultation,
      isNewPatient,
      getConsultationCount,
      reinitialiserDonnees
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};