import React from 'react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Bell, Check, X } from 'lucide-react';
import { useReminders } from '../contexts/ReminderContext';

export default function ReminderList() {
  const { reminders, updateReminder, deleteReminder } = useReminders();

  const handleComplete = (id: string) => {
    updateReminder(id, { status: 'completed' });
  };

  const handleDismiss = (id: string) => {
    deleteReminder(id);
  };

  const getReminderTypeIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return '💰';
      case 'appointment':
        return '📅';
      case 'followup':
        return '📞';
      default:
        return '🔔';
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center">
          <Bell className="h-5 w-5 text-gray-400 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Relances</h3>
        </div>
      </div>
      <div className="divide-y divide-gray-200">
        {reminders.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            Aucune relance en attente
          </div>
        ) : (
          reminders.map(reminder => (
            <div key={reminder.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="mr-2">{getReminderTypeIcon(reminder.type)}</span>
                    <p className="text-sm font-medium text-gray-900">
                      {reminder.message}
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Échéance : {format(parseISO(reminder.dueDate), 'dd MMMM yyyy', { locale: fr })}
                  </p>
                </div>
                <div className="ml-4 flex items-center space-x-2">
                  <button
                    onClick={() => handleComplete(reminder.id)}
                    className="text-green-600 hover:text-green-900"
                    title="Marquer comme effectué"
                  >
                    <Check className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDismiss(reminder.id)}
                    className="text-red-600 hover:text-red-900"
                    title="Supprimer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}