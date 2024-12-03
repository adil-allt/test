import React, { createContext, useContext, useState, useEffect } from 'react';
import { addDays, isPast, parseISO } from 'date-fns';
import { useData } from './DataContext';

interface Reminder {
  id: string;
  type: 'payment' | 'appointment' | 'followup';
  patientId: string;
  appointmentId?: string;
  message: string;
  dueDate: string;
  status: 'pending' | 'sent' | 'completed';
  createdAt: string;
  updatedAt?: string;
}

interface ReminderContextType {
  reminders: Reminder[];
  addReminder: (reminder: Omit<Reminder, 'id' | 'createdAt'>) => void;
  updateReminder: (id: string, data: Partial<Reminder>) => void;
  deleteReminder: (id: string) => void;
  getPatientReminders: (patientId: string) => Reminder[];
  getPendingReminders: () => Reminder[];
}

const ReminderContext = createContext<ReminderContextType | null>(null);

const STORAGE_KEY = 'cabinet_medical_reminders';

export function ReminderProvider({ children }: { children: React.ReactNode }) {
  const [reminders, setReminders] = useState<Reminder[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const { appointments, patients } = useData();

  // Sauvegarder les rappels dans le localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
  }, [reminders]);

  // Vérifier les paiements en attente
  useEffect(() => {
    appointments.forEach(apt => {
      if (!apt.paid && !apt.isGratuite && !apt.isDelegue && !apt.isCanceled) {
        const patient = patients.find(p => p.id === apt.patientId);
        if (patient) {
          const existingReminder = reminders.find(
            r => r.appointmentId === apt.id && r.type === 'payment' && r.status === 'pending'
          );

          if (!existingReminder) {
            addReminder({
              type: 'payment',
              patientId: patient.id,
              appointmentId: apt.id,
              message: `Paiement en attente pour la consultation du ${apt.time}`,
              dueDate: addDays(new Date(), 7).toISOString(),
              status: 'pending'
            });
          }
        }
      }
    });
  }, [appointments]);

  // Vérifier les rendez-vous manqués
  useEffect(() => {
    appointments.forEach(apt => {
      const appointmentDate = parseISO(apt.time);
      if (isPast(appointmentDate) && !apt.isCanceled && !apt.attended) {
        const patient = patients.find(p => p.id === apt.patientId);
        if (patient) {
          const existingReminder = reminders.find(
            r => r.appointmentId === apt.id && r.type === 'followup' && r.status === 'pending'
          );

          if (!existingReminder) {
            addReminder({
              type: 'followup',
              patientId: patient.id,
              appointmentId: apt.id,
              message: `Suivi nécessaire pour le rendez-vous manqué du ${apt.time}`,
              dueDate: addDays(new Date(), 1).toISOString(),
              status: 'pending'
            });
          }
        }
      }
    });
  }, [appointments]);

  const addReminder = (reminderData: Omit<Reminder, 'id' | 'createdAt'>) => {
    const newReminder: Reminder = {
      ...reminderData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    setReminders(prev => [...prev, newReminder]);
  };

  const updateReminder = (id: string, data: Partial<Reminder>) => {
    setReminders(prev => prev.map(reminder => 
      reminder.id === id 
        ? { ...reminder, ...data, updatedAt: new Date().toISOString() }
        : reminder
    ));
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(reminder => reminder.id !== id));
  };

  const getPatientReminders = (patientId: string) => {
    return reminders.filter(reminder => reminder.patientId === patientId);
  };

  const getPendingReminders = () => {
    return reminders.filter(reminder => reminder.status === 'pending');
  };

  return (
    <ReminderContext.Provider value={{
      reminders,
      addReminder,
      updateReminder,
      deleteReminder,
      getPatientReminders,
      getPendingReminders
    }}>
      {children}
    </ReminderContext.Provider>
  );
}

export const useReminders = () => {
  const context = useContext(ReminderContext);
  if (!context) {
    throw new Error('useReminders must be used within a ReminderProvider');
  }
  return context;
};