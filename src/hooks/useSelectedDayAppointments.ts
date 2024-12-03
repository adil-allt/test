import { useMemo } from 'react';
import { format, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Appointment } from '../components/calendar/types';

export const useSelectedDayAppointments = (
  appointments: Appointment[],
  selectedDate: Date
) => {
  const selectedDayAppointments = useMemo(() => {
    return appointments
      .filter(apt => isSameDay(new Date(apt.time), selectedDate))
      .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
  }, [appointments, selectedDate]);

  const summary = useMemo(() => {
    if (selectedDayAppointments.length === 0) {
      return {
        text: "Aucun rendez-vous",
        details: null
      };
    }

    const formattedDate = format(selectedDate, 'd MMMM yyyy', { locale: fr });
    const count = selectedDayAppointments.length;
    const appointmentDetails = selectedDayAppointments.map(apt => ({
      patient: apt.patient || 'Patient non spécifié',
      type: apt.type?.toLowerCase() || 'type non spécifié',
      time: format(new Date(apt.time), 'HH:mm')
    }));

    return {
      text: `Rendez-vous du ${formattedDate} :`,
      count: `${count} rendez-vous`,
      appointments: appointmentDetails.map(apt => 
        `${apt.time} - ${apt.patient} (${apt.type})`
      ).join('\n')
    };
  }, [selectedDayAppointments, selectedDate]);

  const appointmentsByType = useMemo(() => {
    return selectedDayAppointments.reduce((acc, apt) => {
      const type = apt.type?.toLowerCase() || 'non spécifié';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [selectedDayAppointments]);

  return {
    appointments: selectedDayAppointments,
    summary,
    appointmentsByType
  };
};