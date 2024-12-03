import { useState } from 'react';
import { DateRange } from '../components/calendar/types';
import { isSameMonth, startOfMonth, endOfMonth, differenceInDays } from 'date-fns';

type CalendarView = 'day' | 'week' | 'month' | 'custom';

export const useCalendarView = () => {
  const [view, setView] = useState<CalendarView>('week');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateRange, setDateRange] = useState<DateRange>({
    start: new Date(),
    end: new Date()
  });

  const updateViewFromDateRange = (start: Date, end: Date) => {
    const diffDays = differenceInDays(end, start) + 1;

    // Si c'est le même jour
    if (diffDays === 1) {
      setView('day');
      return;
    }

    // Si c'est entre 2 et 7 jours
    if (diffDays >= 2 && diffDays <= 7) {
      setView('custom');
      return;
    }

    // Pour tous les autres cas (plus de 7 jours)
    setView('month');
  };

  const handleDateSelect = (date: Date, isRangeSelection = false) => {
    setSelectedDate(date);
    if (!isRangeSelection) {
      setDateRange({ start: date, end: date });
      setView('day');
    }
  };

  const handleDateRangeChange = (startDate: string, endDate: string) => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (start <= end) {
        setDateRange({ start, end });
        setSelectedDate(start);
        updateViewFromDateRange(start, end);
      }
    }
  };

  const handleRangeSelect = (range: DateRange | null) => {
    if (range) {
      setDateRange(range);
      setSelectedDate(range.start);
      updateViewFromDateRange(range.start, range.end);
    }
  };

  return {
    view,
    setView,
    selectedDate,
    setSelectedDate,
    dateRange,
    setDateRange,
    handleDateSelect,
    handleDateRangeChange,
    handleRangeSelect
  };
};