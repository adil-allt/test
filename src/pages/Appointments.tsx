import React, { useState } from 'react';
import Calendar from '../components/calendar/Calendar';
import AppointmentModal from '../components/AppointmentModal';
import MiniCalendar from '../components/calendar/MiniCalendar';
import { Appointment } from '../components/calendar/types';
import { format, parseISO, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAppointments } from '../contexts/AppointmentContext';
import { useCalendarView } from '../hooks/useCalendarView';
import { Calendar as CalendarIcon } from 'lucide-react';

export default function Appointments() {
  const { appointments, addAppointment, updateAppointment, deleteAppointment } = useAppointments();
  const {
    view,
    setView,
    selectedDate,
    dateRange,
    handleDateSelect,
    handleDateRangeChange,
    handleRangeSelect
  } = useCalendarView();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const getDateRangeDisplay = () => {
    if (!dateRange) return format(selectedDate, 'd MMMM yyyy', { locale: fr });
    
    if (isSameDay(dateRange.start, dateRange.end)) {
      return format(dateRange.start, 'd MMMM yyyy', { locale: fr });
    }

    const startMonth = format(dateRange.start, 'MM yyyy');
    const endMonth = format(dateRange.end, 'MM yyyy');

    if (startMonth === endMonth) {
      return `${format(dateRange.start, 'd')} - ${format(dateRange.end, 'd MMMM yyyy', { locale: fr })}`;
    }
    
    return `${format(dateRange.start, 'd MMM')} - ${format(dateRange.end, 'd MMM yyyy', { locale: fr })}`;
  };

  const handleSubmit = (appointmentData: any) => {
    try {
      if (selectedAppointment) {
        // Pour la modification, on conserve les données existantes non modifiées
        const updatedAppointment = {
          ...selectedAppointment,
          ...appointmentData
        };
        updateAppointment(selectedAppointment.id, updatedAppointment);
        const newDate = parseISO(appointmentData.time);
        handleDateSelect(newDate);
      } else {
        const newAppointment = {
          ...appointmentData,
          id: Date.now().toString(),
          duration: '30 min'
        };
        addAppointment(newAppointment);
        const appointmentDate = parseISO(appointmentData.time);
        handleDateSelect(appointmentDate);
      }

      setIsModalOpen(false);
      setSelectedAppointment(null);
      setSelectedTime(null);
    } catch (error) {
      console.error('Erreur lors de la gestion du rendez-vous:', error);
    }
  };

  const handleDelete = (id: string) => {
    deleteAppointment(id);
    setIsModalOpen(false);
    setSelectedAppointment(null);
    setSelectedTime(null);
  };

  const handleAppointmentAdd = (appointment: any) => {
    const { date, time } = appointment;
    handleDateSelect(date);
    setSelectedTime(time);
    setSelectedAppointment(null);
    setIsModalOpen(true);
  };

  const handleAppointmentEdit = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    handleDateSelect(parseISO(appointment.time));
    setSelectedTime(format(parseISO(appointment.time), 'HH:mm'));
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
          <span>Agenda</span>
          <span className="text-gray-400">-</span>
          <span className="flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2 text-gray-400" />
            {getDateRangeDisplay()}
          </span>
        </h2>
      </div>

      <div className="flex space-x-4">
        <div className="w-64 flex-shrink-0">
          <MiniCalendar
            currentDate={selectedDate}
            selectedDate={selectedDate}
            selectionRange={dateRange}
            onDateSelect={handleDateSelect}
            onRangeSelect={handleRangeSelect}
            appointments={appointments}
          />
        </div>
        
        <div className="flex-1">
          <Calendar
            view={view}
            onViewChange={setView}
            onAppointmentAdd={handleAppointmentAdd}
            onAppointmentUpdate={handleAppointmentEdit}
            dateRange={dateRange}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            onDateRangeChange={handleDateRangeChange}
          />
        </div>
      </div>

      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAppointment(null);
          setSelectedTime(null);
        }}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        initialDate={selectedDate}
        initialTime={selectedTime}
        existingAppointment={selectedAppointment}
      />
    </div>
  );
}