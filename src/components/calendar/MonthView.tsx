import React from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { getAppointmentColor } from './utils';
import { Appointment } from './types';
import { Video } from 'lucide-react';

interface MonthViewProps {
  currentDate: Date;
  appointments: Appointment[];
  onDateClick: (date: Date) => void;
  onAppointmentClick: (appointment: Appointment) => void;
}

export default function MonthView({
  currentDate,
  appointments,
  onDateClick,
  onAppointmentClick
}: MonthViewProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { locale: fr });
  const days = eachDayOfInterval({ start: startDate, end: monthEnd });

  const renderDaySummary = (dayAppointments: Appointment[]) => {
    if (dayAppointments.length === 0) return null;

    // Regrouper les rendez-vous par type
    const typeCount = dayAppointments.reduce((acc, apt) => {
      const type = apt.type || 'autre';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const maxCount = Math.max(...Object.values(typeCount));
    const hasVideoAppointments = dayAppointments.some(apt => apt.videoLink);

    return (
      <div className="space-y-2 mt-2">
        {Object.entries(typeCount).map(([type, count], index) => (
          <div key={index} className="flex items-center space-x-1">
            <div
              className={`h-2 rounded-full ${getAppointmentColor(type, 'confirmé')}`}
              style={{ 
                width: `${(count / maxCount) * 100}%`,
                minWidth: '20%'
              }}
            />
            <span className="text-xs text-gray-500">{count}</span>
          </div>
        ))}
        <div className="text-xs text-center text-gray-600 font-medium">
          {hasVideoAppointments && (
            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-1" />
          )}
          Total: {dayAppointments.length}
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-7 gap-1">
      {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
        <div key={day} className="p-2 text-center font-semibold text-gray-600">
          {day}
        </div>
      ))}
      {days.map((day, idx) => {
        const dayAppointments = appointments.filter(
          (apt) => isSameDay(new Date(apt.time), day)
        );

        return (
          <div
            key={idx}
            className={`min-h-[120px] p-2 border ${
              isSameMonth(day, currentDate)
                ? 'bg-white'
                : 'bg-gray-50'
            } ${
              isSameDay(day, new Date())
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200'
            } cursor-pointer transition-colors hover:bg-gray-50`}
            onClick={() => onDateClick(day)}
          >
            <div className="font-medium text-sm">
              {format(day, 'd')}
            </div>
            {renderDaySummary(dayAppointments)}
          </div>
        );
      })}
    </div>
  );
}