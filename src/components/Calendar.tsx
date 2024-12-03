import React, { useState, useEffect } from 'react';
import { format, startOfWeek, addDays, startOfMonth, endOfMonth, eachDayOfInterval, 
  isSameMonth, isSameDay, addMonths, subMonths, isWithinInterval, parse } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus, 
  Phone, Globe, User } from 'lucide-react';

interface Appointment {
  id: string;
  patient: string;
  time: string;
  duration: string;
  type: string;
  source: string;
  status: 'confirmé' | 'en-attente' | 'annulé';
  contact?: string;
  location?: string;
  videoLink?: string;
}

interface CalendarProps {
  appointments: Appointment[];
  view: 'day' | 'week' | 'month' | 'miniMonth';
  onViewChange: (view: 'day' | 'week' | 'month' | 'miniMonth') => void;
  onAppointmentAdd?: (appointment: any) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmé':
      return 'bg-green-100 text-green-800';
    case 'en-attente':
      return 'bg-yellow-100 text-yellow-800';
    case 'annulé':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getSourceIcon = (source: string) => {
  switch (source) {
    case 'Téléphone':
      return <Phone className="h-4 w-4" />;
    case 'Site-Satli':
    case 'Doctolib':
    case 'Autres sites':
      return <Globe className="h-4 w-4" />;
    default:
      return <User className="h-4 w-4" />;
  }
};

export default function Calendar({ appointments, view, onViewChange, onAppointmentAdd }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectionRange, setSelectionRange] = useState<{ start: Date; end: Date } | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{ date: Date; time: string } | null>(null);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(direction === 'prev' ? subMonths(currentDate, 1) : addMonths(currentDate, 1));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    if (selectionRange) {
      setSelectionRange(null);
    }
    onViewChange('day');
  };

  const handleRangeSelect = (start: Date, end: Date) => {
    setSelectionRange({ start, end });
    const daysDiff = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 0) {
      onViewChange('day');
    } else if (daysDiff <= 7) {
      onViewChange('week');
    } else {
      onViewChange('month');
    }
  };

  const handleTimeSlotClick = (date: Date, time: string) => {
    setSelectedTimeSlot({ date, time });
    if (onAppointmentAdd) {
      onAppointmentAdd({
        date: format(date, 'yyyy-MM-dd'),
        time: time,
      });
    }
  };

  const renderDayView = () => {
    const timeSlots = Array.from({ length: 20 }, (_, i) => {
      const hour = Math.floor(i / 2) + 9;
      const minutes = i % 2 === 0 ? '00' : '30';
      return `${hour.toString().padStart(2, '0')}:${minutes}`;
    });

    const dayAppointments = appointments.filter(apt => 
      isSameDay(new Date(apt.time), selectedDate)
    );

    return (
      <div className="space-y-1">
        {timeSlots.map(time => {
          const [hours, minutes] = time.split(':').map(Number);
          const isLunchBreak = hours === 14 && minutes === 0;
          const isEveningBreak = (hours === 17 && minutes === 30) || hours === 18;
          const isPauseSlot = isLunchBreak || isEveningBreak;

          const slotAppointments = dayAppointments.filter(apt => 
            apt.time.includes(time)
          );

          return (
            <div
              key={time}
              className={`flex border-b border-gray-100 min-h-[48px] ${
                isPauseSlot ? 'bg-stripes-gray' : ''
              }`}
              onClick={() => !isPauseSlot && handleTimeSlotClick(selectedDate, time)}
            >
              <div className="w-20 text-right pr-4 text-gray-500 text-sm">
                {time}
              </div>
              <div className="flex-1 relative">
                {slotAppointments.map((apt, index) => (
                  <div
                    key={apt.id}
                    className={`mb-1 p-2 rounded ${getStatusColor(apt.status)}`}
                  >
                    <div className="flex items-center space-x-2">
                      {getSourceIcon(apt.source)}
                      <span className="font-medium">{apt.patient}</span>
                    </div>
                    <div className="text-xs">{apt.type}</div>
                  </div>
                ))}
                {!isPauseSlot && (
                  <div className="absolute inset-0 opacity-0 hover:opacity-100 bg-indigo-50 bg-opacity-50 flex items-center justify-center">
                    <Plus className="h-6 w-6 text-indigo-600" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderWeekView = () => {
    const weekStart = selectionRange ? selectionRange.start : startOfWeek(selectedDate, { locale: fr });
    const weekEnd = selectionRange ? selectionRange.end : addDays(weekStart, 6);
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return (
      <div className="grid" style={{ gridTemplateColumns: `auto repeat(${days.length}, 1fr)` }}>
        <div className="col-start-2 col-span-full grid" style={{ gridTemplateColumns: `repeat(${days.length}, 1fr)` }}>
          {days.map(day => (
            <div key={day.toString()} className="text-center p-2 font-medium">
              {format(day, 'EEE d', { locale: fr })}
            </div>
          ))}
        </div>
        {renderTimeGrid(days)}
      </div>
    );
  };

  const renderTimeGrid = (days: Date[]) => {
    const timeSlots = Array.from({ length: 20 }, (_, i) => {
      const hour = Math.floor(i / 2) + 9;
      const minutes = i % 2 === 0 ? '00' : '30';
      return `${hour.toString().padStart(2, '0')}:${minutes}`;
    });

    return timeSlots.map(time => {
      const [hours, minutes] = time.split(':').map(Number);
      const isLunchBreak = hours === 14 && minutes === 0;
      const isEveningBreak = (hours === 17 && minutes === 30) || hours === 18;
      const isPauseSlot = isLunchBreak || isEveningBreak;

      return (
        <React.Fragment key={time}>
          <div className="text-right pr-4 text-gray-500 text-sm">{time}</div>
          {days.map(day => {
            const dayAppointments = appointments.filter(
              apt => apt.time.includes(time) && isSameDay(new Date(apt.time), day)
            );

            return (
              <div
                key={day.toString()}
                className={`border border-gray-100 p-1 min-h-[40px] relative ${
                  isPauseSlot ? 'bg-stripes-gray' : ''
                }`}
                onClick={() => !isPauseSlot && handleTimeSlotClick(day, time)}
              >
                {dayAppointments.map((apt, i) => (
                  <div
                    key={`${apt.id}-${i}`}
                    className={`p-1 rounded text-xs ${getStatusColor(apt.status)}`}
                  >
                    <div className="flex items-center space-x-1">
                      {getSourceIcon(apt.source)}
                      <span className="font-medium truncate">{apt.patient}</span>
                    </div>
                  </div>
                ))}
                {!isPauseSlot && (
                  <div className="absolute inset-0 opacity-0 hover:opacity-100 bg-indigo-50 bg-opacity-50 flex items-center justify-center">
                    <Plus className="h-4 w-4 text-indigo-600" />
                  </div>
                )}
              </div>
            );
          })}
        </React.Fragment>
      );
    });
  };

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { locale: fr });
    const days = eachDayOfInterval({ start: startDate, end: monthEnd });

    return (
      <div className="grid grid-cols-7 gap-1">
        {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
          <div key={day} className="p-2 text-center font-semibold text-gray-600">
            {day}
          </div>
        ))}
        {days.map((day, idx) => {
          const dayAppointments = appointments.filter(
            apt => isSameDay(new Date(apt.time), day)
          );

          const isSelected = selectionRange && isWithinInterval(day, {
            start: selectionRange.start,
            end: selectionRange.end
          });

          return (
            <div
              key={idx}
              className={`min-h-[100px] p-2 border ${
                isSameMonth(day, currentDate)
                  ? 'bg-white'
                  : 'bg-gray-50'
              } ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200'
              } cursor-pointer`}
              onClick={() => handleDateClick(day)}
            >
              <div className="font-medium text-sm mb-1">
                {format(day, 'd')}
              </div>
              <div className="space-y-1">
                {dayAppointments.map((apt, i) => (
                  <div
                    key={`${apt.id}-${i}`}
                    className={`text-xs ${getStatusColor(apt.status)} p-1 rounded`}
                  >
                    {apt.patient}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-semibold">
              {format(currentDate, 'MMMM yyyy', { locale: fr })}
            </h2>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onViewChange('day')}
              className={`px-3 py-1 rounded ${
                view === 'day'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'hover:bg-gray-100'
              }`}
            >
              Jour
            </button>
            <button
              onClick={() => onViewChange('week')}
              className={`px-3 py-1 rounded ${
                view === 'week'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'hover:bg-gray-100'
              }`}
            >
              Semaine
            </button>
            <button
              onClick={() => onViewChange('month')}
              className={`px-3 py-1 rounded ${
                view === 'month'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'hover:bg-gray-100'
              }`}
            >
              Mois
            </button>
          </div>
        </div>
        {(view === 'day' || view === 'week') && (
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5 text-gray-400" />
            <input
              type="date"
              value={format(selectedDate, 'yyyy-MM-dd')}
              onChange={(e) => {
                const date = new Date(e.target.value);
                setSelectedDate(date);
                setCurrentDate(date);
              }}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            />
          </div>
        )}
      </div>

      <div className="p-4 overflow-x-auto">
        {view === 'day' && renderDayView()}
        {view === 'week' && renderWeekView()}
        {view === 'month' && renderMonthView()}
      </div>
    </div>
  );
}