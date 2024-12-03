import React from 'react';
import { Bell } from 'lucide-react';
import { useReminders } from '../contexts/ReminderContext';

export default function ReminderBadge() {
  const { getPendingReminders } = useReminders();
  const pendingReminders = getPendingReminders();

  if (pendingReminders.length === 0) return null;

  return (
    <div className="relative">
      <Bell className="h-6 w-6 text-gray-400 hover:text-gray-500" />
      <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
        {pendingReminders.length}
      </span>
    </div>
  );
}