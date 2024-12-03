import React, { useState, useMemo } from 'react';
import { format, startOfWeek, addDays, startOfMonth, endOfMonth, eachDayOfInterval, 
  isSameMonth, isSameDay, addMonths, subMonths, isWithinInterval, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, UserPlus, 
  UserCheck, Gift, XCircle } from 'lucide-react';

interface MiniCalendarProps {
  currentDate: Date;
  selectedDate: Date;
  selectionRange: { start: Date; end: Date } | null;
  onDateSelect: (date: Date) => void;
  onRangeSelect: (range: { start: Date; end: Date } | null) => void;
  appointments: Array<{
    id: string;
    type: string;
    time: string;
    isCanceled?: boolean;
  }>;
}

const APPOINTMENT_TYPES = {
  'NOUVELLE CONSULTATION': {
    label: 'Nouveau patient',
    color: 'text-green-500',
    icon: UserPlus,
    dotColor: 'bg-green-500'
  },
  'SUIVI': {
    label: 'Suivi',
    color: 'text-blue-500',
    icon: UserCheck,
    dotColor: 'bg-blue-500'
  },
  'GRATUIT': {
    label: 'Gratuit',
    color: 'text-gray-500',
    icon: Gift,
    dotColor: 'bg-gray-500'
  },
  'ANNULÉ': {
    label: 'Annulé',
    color: 'text-red-500',
    icon: XCircle,
    dotColor: 'bg-red-500'
  }
};

export default function MiniCalendar({
  currentDate,
  selectedDate,
  selectionRange,
  onDateSelect,
  onRangeSelect,
  appointments
}: MiniCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(currentDate);
  const [selectionStart, setSelectionStart] = useState<Date | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);

  // Calcul des statistiques pour la période sélectionnée
  const stats = useMemo(() => {
    const relevantAppointments = appointments.filter(apt => {
      const aptDate = parseISO(apt.time);
      if (selectionRange) {
        return isWithinInterval(aptDate, selectionRange);
      }
      return isSameDay(aptDate, selectedDate);
    });

    const typeCount = relevantAppointments.reduce((acc, apt) => {
      if (apt.isCanceled) {
        acc['ANNULÉ'] = (acc['ANNULÉ'] || 0) + 1;
      } else {
        const type = apt.type.toUpperCase();
        acc[type] = (acc[type] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return {
      total: relevantAppointments.length,
      byType: typeCount
    };
  }, [appointments, selectedDate, selectionRange]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { locale: fr });
  const days = eachDayOfInterval({ start: startDate, end: monthEnd });

  const weekDays = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

  const handleMouseDown = (date: Date) => {
    setSelectionStart(date);
    setIsSelecting(true);
    onRangeSelect(null);
  };

  const handleMouseMove = (date: Date) => {
    if (isSelecting && selectionStart) {
      const start = selectionStart < date ? selectionStart : date;
      const end = selectionStart < date ? date : selectionStart;
      onRangeSelect({ start, end });
    }
  };

  const handleMouseUp = () => {
    setIsSelecting(false);
    setSelectionStart(null);
    if (selectionRange) {
      onRangeSelect(selectionRange);
    }
  };

  const isDateInRange = (date: Date) => {
    if (!selectionRange) return false;
    return isWithinInterval(date, selectionRange);
  };

  const hasAppointmentsOnDate = (date: Date) => {
    return appointments.some(apt => isSameDay(parseISO(apt.time), date));
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-1 hover:bg-gray-100 rounded-full"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <h3 className="text-sm font-medium">
          {format(currentMonth, 'MMMM yyyy', { locale: fr })}
        </h3>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-1 hover:bg-gray-100 rounded-full"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((day, index) => (
          <div key={`header-${index}`} className="text-center font-medium text-gray-500 py-1">
            {day}
          </div>
        ))}
        {days.map((day, dayIndex) => (
          <button
            key={`day-${dayIndex}`}
            onMouseDown={() => handleMouseDown(day)}
            onMouseMove={() => handleMouseMove(day)}
            onMouseUp={handleMouseUp}
            onClick={() => !isSelecting && onDateSelect(day)}
            className={`
              aspect-square p-1 text-sm relative
              ${!isSameMonth(day, currentMonth) ? 'text-gray-400' : 'text-gray-900'}
              ${isSameDay(day, selectedDate) ? 'bg-indigo-600 text-white font-semibold rounded-full' : ''}
              ${isDateInRange(day) ? 'bg-indigo-100' : ''}
              ${isDateInRange(day) && !isSameDay(day, selectedDate) ? 'hover:bg-indigo-200' : 'hover:bg-gray-100'}
              rounded-full
              transition-colors
            `}
          >
            <span>{format(day, 'd')}</span>
            {hasAppointmentsOnDate(day) && !isSameDay(day, selectedDate) && (
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-indigo-400 rounded-full"></span>
            )}
          </button>
        ))}
      </div>

      {/* Statistiques */}
      <div className="mt-6 space-y-4">
        {/* Période sélectionnée */}
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <CalendarIcon className="h-4 w-4 text-gray-400" />
          <span>
            {selectionRange ? 
              `${format(selectionRange.start, 'd MMM', { locale: fr })} - ${format(selectionRange.end, 'd MMM', { locale: fr })}` :
              format(selectedDate, 'd MMMM yyyy', { locale: fr })
            }
          </span>
        </div>

        {/* Total des rendez-vous */}
        <div className="text-sm font-medium text-gray-700">
          Total : {stats.total} rendez-vous
        </div>

        {/* Types de rendez-vous */}
        {Object.keys(stats.byType).length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-gray-700">Types de rendez-vous</h4>
            <div className="space-y-2">
              {Object.entries(APPOINTMENT_TYPES).map(([type, config]) => {
                const count = stats.byType[type] || 0;
                if (count === 0) return null;

                const Icon = config.icon;
                return (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${config.dotColor}`} />
                      <Icon className={`h-4 w-4 ${config.color}`} />
                      <span className="text-xs text-gray-600">{config.label}</span>
                    </div>
                    <span className="text-xs font-medium text-gray-500">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}