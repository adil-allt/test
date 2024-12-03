import React, { createContext, useContext, useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { Appointment } from '../components/calendar/types';
import { testAppointments } from '../data/testData';

interface AppointmentContextType {
  appointments: Appointment[];
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (id: string, appointment: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
  getAppointmentsByDate: (date: Date) => Appointment[];
  getAppointmentById: (id: string) => Appointment | undefined;
  isTimeSlotAvailable: (date: Date, time: string, excludeId?: string) => boolean;
  todayAppointments: Appointment[];
}

const AppointmentContext = createContext<AppointmentContextType | null>(null);

export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error('useAppointments must be used within an AppointmentProvider');
  }
  return context;
};

interface AppointmentProviderProps {
  children: React.ReactNode;
}

export const AppointmentProvider = ({ children }: AppointmentProviderProps) => {
  const [appointments, setAppointments] = useState<Appointment[]>(testAppointments);
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');
    
    const filteredAppointments = appointments.filter(apt => {
      const aptDate = parseISO(apt.time);
      return format(aptDate, 'yyyy-MM-dd') === todayStr;
    }).sort((a, b) => {
      const timeA = parseISO(a.time);
      const timeB = parseISO(b.time);
      return timeA.getTime() - timeB.getTime();
    });

    setTodayAppointments(filteredAppointments);
  }, [appointments]);

  const addAppointment = (appointment: Appointment) => {
    setAppointments(prev => [...prev, appointment]);
  };

  const updateAppointment = (id: string, updatedData: Partial<Appointment>) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === id ? { ...apt, ...updatedData } : apt
    ));
  };

  const deleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(apt => apt.id !== id));
  };

  const getAppointmentsByDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return appointments.filter(apt => {
      const aptDate = parseISO(apt.time);
      return format(aptDate, 'yyyy-MM-dd') === dateStr;
    });
  };

  const getAppointmentById = (id: string) => {
    return appointments.find(apt => apt.id === id);
  };

  const isTimeSlotAvailable = (date: Date, time: string, excludeId?: string) => {
    const dateTimeToCheck = format(date, "yyyy-MM-dd HH:mm");
    
    return !appointments.some(apt => {
      if (excludeId && apt.id === excludeId) return false;
      
      const aptDate = parseISO(apt.time);
      const aptDateTime = format(aptDate, "yyyy-MM-dd HH:mm");
      
      return aptDateTime === dateTimeToCheck;
    });
  };

  return (
    <AppointmentContext.Provider value={{
      appointments,
      addAppointment,
      updateAppointment,
      deleteAppointment,
      getAppointmentsByDate,
      getAppointmentById,
      isTimeSlotAvailable,
      todayAppointments
    }}>
      {children}
    </AppointmentContext.Provider>
  );
};