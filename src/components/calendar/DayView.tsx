import React from 'react';
import { isSameDay } from 'date-fns';
import { Plus, Video, MapPin } from 'lucide-react';
import { getSourceIcon, getTypeIcon, getAppointmentColor, getAppointmentHoverColor, isStripedSlot } from './utils';
import { Appointment } from './types';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';

interface DayViewProps {
  selectedDate: Date;
  appointments: Appointment[];
  onTimeSlotClick: (date: Date, time: string) => void;
  onAppointmentClick: (appointment: Appointment) => void;
  timezone?: string;
}

export default function DayView({ 
  selectedDate, 
  appointments, 
  onTimeSlotClick, 
  onAppointmentClick,
  timezone = 'GMT'
}: DayViewProps) {
  const { 
    draggedAppointment,
    handleDragStart,
    handleDragEnd,
    handleDrop
  } = useDragAndDrop();

  const timeSlots = Array.from({ length: 23 }, (_, i) => {
    const hour = Math.floor(i / 2) + 9;
    const minutes = i % 2 === 0 ? '00' : '30';
    return `${hour.toString().padStart(2, '0')}:${minutes}`;
  });

  return (
    <div className="flex flex-col space-y-1">
      {timeSlots.map((time) => {
        const isStriped = isStripedSlot(time, selectedDate);
        const slotAppointments = appointments.filter(
          (apt) => apt.time.includes(time) && isSameDay(new Date(apt.time), selectedDate)
        );
        const isSlotOccupied = slotAppointments.length > 0;

        return (
          <div
            key={time}
            className={`flex border-b border-gray-100 min-h-[60px] ${
              isStriped ? 'bg-stripes-gray hover:bg-stripes-gray-light' : ''
            } ${draggedAppointment ? 'hover:bg-indigo-50' : ''}`}
            onClick={() => !isSlotOccupied && onTimeSlotClick(selectedDate, time)}
            onDragOver={(e) => {
              e.preventDefault();
              if (!isSlotOccupied) {
                e.currentTarget.classList.add('bg-indigo-50');
              }
            }}
            onDragLeave={(e) => {
              e.currentTarget.classList.remove('bg-indigo-50');
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove('bg-indigo-50');
              if (!isSlotOccupied) {
                handleDrop(selectedDate, time);
              }
            }}
          >
            <div className="w-20 text-right pr-4 text-gray-500 text-sm py-2">
              {time}
            </div>
            <div className="flex-1 relative p-1">
              {slotAppointments.map((apt, i) => (
                <div
                  key={i}
                  draggable
                  onDragStart={() => handleDragStart(apt)}
                  onDragEnd={handleDragEnd}
                  className={`mb-1 p-2 rounded ${getAppointmentColor(apt.type, apt.status)} 
                    ${getAppointmentHoverColor(apt.type)} cursor-move transition-all`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAppointmentClick(apt);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(apt.type)}
                      <span className="font-medium text-sm text-white">{apt.patient}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {apt.location && <MapPin className="h-3 w-3 text-white" />}
                      {apt.videoLink && <Video className="h-3 w-3 text-white" />}
                    </div>
                  </div>
                  <div className="text-xs mt-1 text-white opacity-90">{apt.type}</div>
                </div>
              ))}
              {!isSlotOccupied && (
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
}