import React from 'react';
import { Clock } from 'lucide-react';
import DraggableModal from './DraggableModal';

interface NotificationTemplate {
  id: string;
  name: string;
  sendHoursBefore: number;
}

interface NotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  templates: NotificationTemplate[];
  onUpdate: (templateId: string, sendHoursBefore: number) => void;
}

export default function NotificationSettingsModal({
  isOpen,
  onClose,
  templates,
  onUpdate
}: NotificationSettingsModalProps) {
  return (
    <DraggableModal
      isOpen={isOpen}
      onClose={onClose}
      title="Paramètres des notifications"
      className="w-full max-w-2xl"
    >
      <div className="space-y-6">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Clock className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Définissez le délai d'envoi des notifications WhatsApp avant chaque rendez-vous.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {templates.map((template) => (
            <div key={template.id} className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-3">{template.name}</h3>
              <div className="flex items-center space-x-4">
                <label className="text-sm text-gray-700">Envoyer</label>
                <select
                  value={template.sendHoursBefore}
                  onChange={(e) => onUpdate(template.id, parseInt(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                >
                  <option value="24">24 heures avant</option>
                  <option value="48">48 heures avant</option>
                  <option value="72">72 heures avant</option>
                  <option value="12">12 heures avant</option>
                  <option value="6">6 heures avant</option>
                </select>
                <label className="text-sm text-gray-700">le rendez-vous</label>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
          >
            Fermer
          </button>
        </div>
      </div>
    </DraggableModal>
  );
}