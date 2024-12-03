import React from 'react';
import { Clock } from 'lucide-react';

interface NotificationScheduleProps {
  sendHoursBefore: number;
  onScheduleChange: (hours: number) => void;
}

export default function NotificationSchedule({
  sendHoursBefore,
  onScheduleChange
}: NotificationScheduleProps) {
  return (
    <div className="flex items-center space-x-4">
      <Clock className="h-5 w-5 text-gray-400" />
      <select
        value={sendHoursBefore}
        onChange={(e) => onScheduleChange(parseInt(e.target.value))}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
      >
        <option value="1">1 heure avant</option>
        <option value="2">2 heures avant</option>
        <option value="4">4 heures avant</option>
        <option value="12">12 heures avant</option>
        <option value="24">24 heures avant</option>
        <option value="48">48 heures avant</option>
        <option value="72">72 heures avant</option>
      </select>
    </div>
  );
}