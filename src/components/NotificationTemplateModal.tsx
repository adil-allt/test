import React, { useState, useEffect } from 'react';
import { MessageSquare, Clock } from 'lucide-react';
import DraggableModal from './DraggableModal';

interface NotificationTemplate {
  id: string;
  type: 'whatsapp';
  name: string;
  content: string;
  variables: string[];
  isActive: boolean;
  sendHoursBefore: number;
}

interface NotificationTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (template: NotificationTemplate) => void;
  initialData?: NotificationTemplate | null;
}

const AVAILABLE_VARIABLES = [
  { id: 'patientName', label: 'Nom du patient' },
  { id: 'appointmentDate', label: 'Date du rendez-vous' },
  { id: 'appointmentTime', label: 'Heure du rendez-vous' },
  { id: 'doctorName', label: 'Nom du médecin' },
  { id: 'clinicName', label: 'Nom de la clinique' }
];

export default function NotificationTemplateModal({
  isOpen,
  onClose,
  onSubmit,
  initialData
}: NotificationTemplateModalProps) {
  const [template, setTemplate] = useState<Omit<NotificationTemplate, 'id'>>({
    type: 'whatsapp',
    name: '',
    content: '',
    variables: [],
    isActive: true,
    sendHoursBefore: 24
  });

  useEffect(() => {
    if (initialData) {
      setTemplate(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...template,
      id: initialData?.id || Date.now().toString()
    });
    setTemplate({
      type: 'whatsapp',
      name: '',
      content: '',
      variables: [],
      isActive: true,
      sendHoursBefore: 24
    });
  };

  const insertVariable = (variable: string) => {
    const newContent = template.content + `{${variable}}`;
    setTemplate({
      ...template,
      content: newContent,
      variables: [...new Set([...template.variables, variable])]
    });
  };

  return (
    <DraggableModal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Modifier le modèle' : 'Nouveau modèle WhatsApp'}
      className="w-full max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center space-x-2 text-green-600">
          <MessageSquare className="h-5 w-5" />
          <span className="text-sm font-medium">Message WhatsApp</span>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Nom du modèle</label>
          <input
            type="text"
            value={template.name}
            onChange={(e) => setTemplate({ ...template, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Délai d'envoi</label>
          <div className="mt-1 flex items-center space-x-2">
            <Clock className="h-5 w-5 text-gray-400" />
            <select
              value={template.sendHoursBefore}
              onChange={(e) => setTemplate({ ...template, sendHoursBefore: parseInt(e.target.value) })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
            >
              <option value="24">24 heures avant</option>
              <option value="48">48 heures avant</option>
              <option value="72">72 heures avant</option>
              <option value="12">12 heures avant</option>
              <option value="6">6 heures avant</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Variables disponibles</label>
          <div className="mt-1 flex flex-wrap gap-2">
            {AVAILABLE_VARIABLES.map((variable) => (
              <button
                key={variable.id}
                type="button"
                onClick={() => insertVariable(variable.id)}
                className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                {variable.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Message</label>
          <textarea
            value={template.content}
            onChange={(e) => setTemplate({ ...template, content: e.target.value })}
            rows={6}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
            required
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={template.isActive}
            onChange={(e) => setTemplate({ ...template, isActive: e.target.checked })}
            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">
            Activer ce modèle
          </label>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
          >
            {initialData ? 'Modifier' : 'Créer'}
          </button>
        </div>
      </form>
    </DraggableModal>
  );
}