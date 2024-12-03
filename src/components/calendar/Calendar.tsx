import React, { useState } from 'react';
import { format, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Filter, Globe } from 'lucide-react';
import DayView from './DayView';
import MonthView from './MonthView';
import CustomRangeView from './CustomRangeView';
import { useAppointments } from '../../contexts/AppointmentContext';
import { useAppointmentColors } from '../../hooks/useAppointmentColors';
import { Appointment } from './types';
import './styles.css';

interface CalendarProps {
  view: 'day' | 'week' | 'month' | 'custom';
  onViewChange: (view: 'day' | 'week' | 'month' | 'custom') => void;
  onAppointmentAdd?: (appointment: { date: Date; time: string }) => void;
  onAppointmentUpdate?: (appointment: Appointment) => void;
  dateRange: { start: Date; end: Date } | null;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onDateRangeChange: (startDate: string, endDate: string) => void;
}

const TIMEZONES = [
  { value: 'GMT', label: 'GMT+0' },
  { value: 'GMT+1', label: 'GMT+1' },
  { value: 'GMT+2', label: 'GMT+2' },
  { value: 'GMT+3', label: 'GMT+3' },
  { value: 'GMT+4', label: 'GMT+4' }
];

export default function Calendar({ 
  view, 
  onViewChange,
  onAppointmentAdd,
  onAppointmentUpdate,
  dateRange,
  selectedDate,
  onDateSelect,
  onDateRangeChange
}: CalendarProps) {
  const { appointments } = useAppointments();
  const { typeColors } = useAppointmentColors();
  const [selectedTimezone, setSelectedTimezone] = useState('GMT');

  const handleTimeSlotClick = (date: Date, time: string) => {
    if (onAppointmentAdd) {
      onAppointmentAdd({ date, time });
    }
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    if (onAppointmentUpdate) {
      onAppointmentUpdate(appointment);
    }
  };

  const renderCalendarView = () => {
    if (!dateRange) return null;

    const daysDiff = differenceInDays(dateRange.end, dateRange.start) + 1;

    if (daysDiff === 1 || view === 'day') {
      return (
        <DayView
          selectedDate={selectedDate}
          appointments={appointments}
          onTimeSlotClick={handleTimeSlotClick}
          onAppointmentClick={handleAppointmentClick}
          timezone={selectedTimezone}
        />
      );
    }

    if (daysDiff >= 2 && daysDiff <= 7) {
      return (
        <CustomRangeView
          selectionRange={dateRange}
          appointments={appointments}
          onTimeSlotClick={handleTimeSlotClick}
          onAppointmentClick={handleAppointmentClick}
          timezone={selectedTimezone}
          days={Array.from({ length: daysDiff }, (_, i) => {
            const date = new Date(dateRange.start);
            date.setDate(date.getDate() + i);
            return date;
          })}
        />
      );
    }

    return (
      <MonthView
        currentDate={selectedDate}
        appointments={appointments}
        onDateClick={onDateSelect}
        onAppointmentClick={handleAppointmentClick}
        timezone={selectedTimezone}
      />
    );
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="border-b border-gray-200">
        <div className="p-4">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {dateRange && `${format(dateRange.start, 'd MMMM', { locale: fr })} - ${format(dateRange.end, 'd MMMM yyyy', { locale: fr })}`}
              </h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Globe className="h-5 w-5 text-gray-400" />
                  <select
                    value={selectedTimezone}
                    onChange={(e) => setSelectedTimezone(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    {TIMEZONES.map(tz => (
                      <option key={tz.value} value={tz.value}>
                        {tz.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-3 bg-gray-50 flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Période :</span>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={dateRange?.start ? format(dateRange.start, 'yyyy-MM-dd') : ''}
              onChange={(e) => {
                const startDate = e.target.value;
                const endDate = dateRange?.end ? format(dateRange.end, 'yyyy-MM-dd') : startDate;
                onDateRangeChange(startDate, endDate);
              }}
              className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md shadow-sm"
            />
            <span className="text-sm text-gray-500">à</span>
            <input
              type="date"
              value={dateRange?.end ? format(dateRange.end, 'yyyy-MM-dd') : ''}
              onChange={(e) => {
                const endDate = e.target.value;
                const startDate = dateRange?.start ? format(dateRange.start, 'yyyy-MM-dd') : endDate;
                onDateRangeChange(startDate, endDate);
              }}
              className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="p-4 overflow-x-auto">
        {renderCalendarView()}
      </div>
    </div>
  );
}