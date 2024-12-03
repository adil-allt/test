import React from 'react';
import { format, startOfYear, endOfYear, eachMonthOfInterval, getMonth, getYear } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Appointment } from './types';

interface YearViewProps {
  currentDate: Date;
  appointments: Appointment[];
  onMonthClick: (date: Date) => void;
}

export default function YearView({ currentDate, appointments, onMonthClick }: YearViewProps) {
  const yearStart = startOfYear(currentDate);
  const yearEnd = endOfYear(currentDate);
  const months = eachMonthOfInterval({ start: yearStart, end: yearEnd });

  return (
    <div className="grid grid-cols-4 gap-4">
      {months.map((month) => {
        const monthAppointments = appointments.filter(
          (apt) => getMonth(new Date(apt.time)) === getMonth(month) &&
                  getYear(new Date(apt.time)) === getYear(month)
        );

        return (
          <div
            key={month.toString()}
            className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50"
            onClick={() => onMonthClick(month)}
          >
            <h3 className="font-medium text-center mb-2">
              {format(month, 'MMMM', { locale: fr })}
            </h3>
            <div className="text-sm text-gray-500 text-center">
              {monthAppointments.length} rendez-vous
            </div>
          </div>
        );
      })}
    </div>
  );
}