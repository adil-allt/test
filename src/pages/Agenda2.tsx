import React, { useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { format, addMinutes, parseISO, isBefore, isAfter, differenceInDays, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAppointments } from '../contexts/AppointmentContext';
import AppointmentModal from '../components/AppointmentModal';
import MiniCalendar from '../components/calendar/MiniCalendar';
import { Plus } from 'lucide-react';

const frLocale = {
  code: 'fr',
  week: {
    dow: 1,
    doy: 4
  },
  buttonText: {
    today: "Aujourd'hui",
    month: 'Mois',
    week: 'Semaine',
    day: 'Jour',
    list: 'Liste'
  },
  weekText: 'Sem.',
  allDayText: 'Toute la journée',
  moreLinkText: 'en plus',
  noEventsText: 'Aucun événement à afficher'
};

interface AppointmentWithTimes {
  id: string;
  start: Date;
  end: Date;
  duration: number;
  [key: string]: any;
}

export default function Agenda2() {
  const { appointments, addAppointment, updateAppointment, deleteAppointment } = useAppointments();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date } | null>(null);
  const calendarRef = useRef<any>(null);

  const events = appointments.map(apt => ({
    id: apt.id,
    title: apt.patient,
    start: new Date(apt.time),
    end: addMinutes(new Date(apt.time), parseInt(apt.duration || '30')),
    extendedProps: {
      ...apt
    },
    backgroundColor: getEventColor(apt),
    borderColor: getEventColor(apt),
    textColor: '#FFFFFF'
  }));

  function getEventColor(appointment: any) {
    if (appointment.isCanceled) return '#EF4444';
    if (appointment.isNewPatient) return '#10B981';
    if (appointment.isDelegue) return '#F59E0B';
    if (appointment.isGratuite) return '#6B7280';
    return '#3B82F6';
  }

  const getAppointmentsAfter = (date: Date, excludeId?: string): AppointmentWithTimes[] => {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart);
    dayEnd.setHours(23, 59, 59, 999);

    return appointments
      .filter(apt => {
        const aptDate = new Date(apt.time);
        return aptDate >= dayStart && 
               aptDate <= dayEnd && 
               (!excludeId || apt.id !== excludeId) &&
               aptDate >= date;
      })
      .map(apt => ({
        ...apt,
        start: new Date(apt.time),
        end: addMinutes(new Date(apt.time), parseInt(apt.duration || '30')),
        duration: parseInt(apt.duration || '30')
      }))
      .sort((a, b) => a.start.getTime() - b.start.getTime());
  };

  const hasOverlap = (apt1: AppointmentWithTimes, apt2: AppointmentWithTimes): boolean => {
    return (apt1.start < apt2.end && apt1.end > apt2.start);
  };

  const adjustOverlappingAppointments = (resizedAppointment: AppointmentWithTimes) => {
    let currentEnd = resizedAppointment.end;
    let appointmentsToAdjust = getAppointmentsAfter(resizedAppointment.start, resizedAppointment.id);
    let adjustedAppointments: AppointmentWithTimes[] = [];

    for (let i = 0; i < appointmentsToAdjust.length; i++) {
      const currentApt = appointmentsToAdjust[i];
      
      if (currentApt.start < currentEnd) {
        const newStart = new Date(currentEnd);
        const newEnd = addMinutes(newStart, currentApt.duration);
        
        const adjustedApt = {
          ...currentApt,
          start: newStart,
          end: newEnd,
          time: newStart.toISOString()
        };
        
        adjustedAppointments.push(adjustedApt);
        currentEnd = newEnd;

        updateAppointment(currentApt.id, {
          ...currentApt,
          time: newStart.toISOString()
        });
      } else {
        currentEnd = currentApt.end;
      }
    }

    return adjustedAppointments;
  };

  const validateAppointmentChange = (start: Date, end: Date, appointmentId?: string): boolean => {
    const dayAppointments = appointments.filter(apt => {
      const aptDate = new Date(apt.time);
      return aptDate.getDate() === start.getDate() && 
             aptDate.getMonth() === start.getMonth() && 
             aptDate.getFullYear() === start.getFullYear() &&
             apt.id !== appointmentId;
    });

    const startHour = start.getHours() + start.getMinutes() / 60;
    const endHour = end.getHours() + end.getMinutes() / 60;
    
    if (startHour < 9 || endHour > 21) {
      return false;
    }

    return true;
  };

  const handleDateSelect = (selectInfo: any) => {
    const selectedDate = selectInfo.start;
    const hours = selectedDate.getHours();
    const minutes = selectedDate.getMinutes();
    
    setSelectedDate(selectedDate);
    setSelectedTime(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleEventClick = (clickInfo: any) => {
    setSelectedEvent(clickInfo.event.extendedProps);
    setSelectedDate(clickInfo.event.start);
    setSelectedTime(format(clickInfo.event.start, 'HH:mm'));
    setIsModalOpen(true);
  };

  const handleEventDrop = (dropInfo: any) => {
    const appointment = dropInfo.event.extendedProps;
    const newStart = dropInfo.event.start;
    const newEnd = dropInfo.event.end;
    
    if (!validateAppointmentChange(newStart, newEnd, appointment.id)) {
      dropInfo.revert();
      alert('Ce créneau horaire est en dehors des heures de travail (9h-21h)');
      return;
    }

    const droppedAppointment = {
      ...appointment,
      start: newStart,
      end: newEnd,
      duration: (newEnd.getTime() - newStart.getTime()) / 60000
    };

    adjustOverlappingAppointments(droppedAppointment);

    updateAppointment(appointment.id, {
      ...appointment,
      time: newStart.toISOString()
    });
  };

  const handleEventResize = (resizeInfo: any) => {
    const appointment = resizeInfo.event.extendedProps;
    const newStart = resizeInfo.event.start;
    const newEnd = resizeInfo.event.end;
    const newDuration = (newEnd.getTime() - newStart.getTime()) / 60000;

    if (!validateAppointmentChange(newStart, newEnd, appointment.id)) {
      resizeInfo.revert();
      alert('Ce créneau horaire est en dehors des heures de travail (9h-21h)');
      return;
    }
    
    const resizedAppointment = {
      ...appointment,
      start: newStart,
      end: newEnd,
      duration: newDuration
    };

    adjustOverlappingAppointments(resizedAppointment);

    updateAppointment(appointment.id, {
      ...appointment,
      duration: newDuration.toString(),
      time: newStart.toISOString()
    });
  };

  const handleSubmit = (appointmentData: any) => {
    const start = new Date(appointmentData.time);
    const end = addMinutes(start, parseInt(appointmentData.duration));

    if (!validateAppointmentChange(start, end, selectedEvent?.id)) {
      alert('Ce créneau horaire est en dehors des heures de travail (9h-21h)');
      return;
    }

    if (selectedEvent) {
      const updatedAppointment = {
        ...selectedEvent,
        ...appointmentData,
        start,
        end,
        duration: parseInt(appointmentData.duration)
      };
      
      adjustOverlappingAppointments(updatedAppointment);
      updateAppointment(selectedEvent.id, appointmentData);
    } else {
      const newAppointment = {
        ...appointmentData,
        id: Date.now().toString(),
        start,
        end,
        duration: parseInt(appointmentData.duration)
      };
      
      adjustOverlappingAppointments(newAppointment);
      addAppointment(appointmentData);
    }
    
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const handleMiniCalendarSelect = (date: Date) => {
    setSelectedDate(date);
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.gotoDate(date);
      
      if (dateRange) {
        const daysDiff = differenceInDays(dateRange.end, dateRange.start) + 1;
        if (daysDiff === 1) {
          calendarApi.changeView('timeGridDay');
        } else if (daysDiff <= 7) {
          calendarApi.changeView('timeGridCustomWeek');
          calendarApi.setOption('hiddenDays', getHiddenDays(dateRange.start, daysDiff));
        } else {
          calendarApi.changeView('dayGridMonth');
        }
      }
    }
  };

  const handleRangeSelect = (range: { start: Date; end: Date } | null) => {
    setDateRange(range);
    if (range && calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.gotoDate(range.start);
      
      const daysDiff = differenceInDays(range.end, range.start) + 1;
      if (daysDiff === 1) {
        calendarApi.changeView('timeGridDay');
      } else if (daysDiff <= 7) {
        calendarApi.changeView('timeGridCustomWeek');
        calendarApi.setOption('hiddenDays', getHiddenDays(range.start, daysDiff));
      } else {
        calendarApi.changeView('dayGridMonth');
      }
    }
  };

  const getHiddenDays = (startDate: Date, numDays: number): number[] => {
    const visibleDays = new Set();
    for (let i = 0; i < numDays; i++) {
      const day = addDays(startDate, i);
      visibleDays.add(day.getDay());
    }
    
    return [0, 1, 2, 3, 4, 5, 6].filter(day => !visibleDays.has(day));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Agenda</h2>
        <button
          onClick={() => {
            setSelectedDate(new Date());
            setSelectedTime('09:00');
            setSelectedEvent(null);
            setIsModalOpen(true);
          }}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nouveau rendez-vous
        </button>
      </div>

      <div className="flex space-x-4">
        <div className="w-64 flex-shrink-0">
          <MiniCalendar
            currentDate={selectedDate}
            selectedDate={selectedDate}
            selectionRange={dateRange}
            onDateSelect={handleMiniCalendarSelect}
            onRangeSelect={handleRangeSelect}
            appointments={appointments}
          />
        </div>

        <div className="flex-1 bg-white rounded-lg shadow p-6">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridCustomWeek,timeGridDay'
            }}
            views={{
              timeGridCustomWeek: {
                type: 'timeGrid',
                duration: { days: 7 }
              }
            }}
            locale={frLocale}
            firstDay={1}
            slotMinTime="09:00:00"
            slotMaxTime="21:00:00"
            allDaySlot={false}
            slotDuration="00:30:00"
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            events={events}
            select={handleDateSelect}
            eventClick={handleEventClick}
            eventDrop={handleEventDrop}
            eventResize={handleEventResize}
            editable={true}
            droppable={true}
            height="auto"
            businessHours={{
              daysOfWeek: [1, 2, 3, 4, 5, 6],
              startTime: '09:00',
              endTime: '21:00',
            }}
            slotLabelFormat={{
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            }}
            views={{
              timeGridCustomWeek: {
                type: 'timeGrid',
                duration: { days: 7 },
                titleFormat: { year: 'numeric', month: 'long', day: 'numeric' }
              },
              timeGridDay: {
                titleFormat: { year: 'numeric', month: 'long', day: 'numeric' }
              },
              dayGridMonth: {
                titleFormat: { year: 'numeric', month: 'long' }
              }
            }}
            nowIndicator={true}
            scrollTime="09:00:00"
          />
        </div>
      </div>

      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEvent(null);
        }}
        onSubmit={handleSubmit}
        onDelete={selectedEvent ? deleteAppointment : undefined}
        initialDate={selectedDate}
        initialTime={selectedTime}
        existingAppointment={selectedEvent}
      />
    </div>
  );
}