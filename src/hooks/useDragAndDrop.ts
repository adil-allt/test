import { useState } from 'react';
import { format } from 'date-fns';
import { Appointment } from '../components/calendar/types';
import { useAppointments } from '../contexts/AppointmentContext';

export const useDragAndDrop = () => {
  const [draggedAppointment, setDraggedAppointment] = useState<Appointment | null>(null);
  const { updateAppointment, isTimeSlotAvailable } = useAppointments();

  const handleDragStart = (appointment: Appointment) => {
    setDraggedAppointment(appointment);
  };

  const handleDragEnd = () => {
    setDraggedAppointment(null);
  };

  const handleDrop = (date: Date, time: string) => {
    if (!draggedAppointment) return;

    const newDateTime = format(date, "yyyy-MM-dd'T'") + time + ':00.000Z';

    if (isTimeSlotAvailable(date, time, draggedAppointment.id)) {
      updateAppointment(draggedAppointment.id, {
        ...draggedAppointment,
        time: newDateTime
      });
    } else {
      alert('Ce créneau horaire est déjà occupé');
    }

    setDraggedAppointment(null);
  };

  return {
    draggedAppointment,
    handleDragStart,
    handleDragEnd,
    handleDrop
  };
};