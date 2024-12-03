import React, { useState } from 'react';
import { Plus, Search, MessageSquare, Clock, Edit, Trash2, Check, AlertTriangle, Settings, QrCode } from 'lucide-react';
import NotificationTemplateModal from '../components/NotificationTemplateModal';
import NotificationSettingsModal from '../components/NotificationSettingsModal';
import WhatsAppQRModal from '../components/WhatsAppQRModal';
import { useAuth } from '../contexts/AuthContext';
import { useWhatsApp } from '../contexts/WhatsAppContext';

interface Template {
  id: string;
  name: string;
  content: string;
  isActive: boolean;
  sendHoursBefore: number;
  lastModified: string;
}

export default function Notifications() {
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const { isConnected, phoneNumber } = useWhatsApp();

  const handleTemplateSubmit = (template: Template) => {
    if (editingTemplate) {
      setTemplates(prev => prev.map(t => t.id === template.id ? template : t));
    } else {
      setTemplates(prev => [...prev, template]);
    }
    setIsTemplateModalOpen(false);
    setEditingTemplate(null);
  };

  const handleTemplateEdit = (template: Template) => {
    setEditingTemplate(template);
    setIsTemplateModalOpen(true);
  };

  const handleTemplateDelete = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
  };

  const handleUpdateSettings = (templateId: string, sendHoursBefore: number) => {
    setTemplates(prev => prev.map(t => 
      t.id === templateId ? { ...t, sendHoursBefore } : t
    ));
  };

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Notifications WhatsApp</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => setIsQRModalOpen(true)}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            <QrCode className="h-5 w-5 mr-2" />
            {isConnected ? `Connecté (${phoneNumber})` : 'Configurer WhatsApp'}
          </button>
          <button
            onClick={() => setIsSettingsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            <Settings className="h-5 w-5 mr-2" />
            Paramètres
          </button>
          <button
            onClick={() => setIsTemplateModalOpen(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nouveau modèle
          </button>
        </div>
      </div>

      {!isConnected && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                WhatsApp n'est pas configuré. Veuillez scanner le code QR pour activer les notifications.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow rounded-lg">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
              placeholder="Rechercher un modèle..."
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom du modèle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Délai d'envoi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTemplates.map((template) => (
                <tr key={template.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <MessageSquare className="h-5 w-5 text-green-500 mr-2" />
                      <div className="text-sm font-medium text-gray-900">
                        {template.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-2" />
                      {template.sendHoursBefore}h avant
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      template.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {template.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleTemplateEdit(template)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleTemplateDelete(template.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <NotificationTemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => {
          setIsTemplateModalOpen(false);
          setEditingTemplate(null);
        }}
        onSubmit={handleTemplateSubmit}
        initialData={editingTemplate}
      />

      <NotificationSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        templates={templates}
        onUpdate={handleUpdateSettings}
      />

      <WhatsAppQRModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
      />
    </div>
  );
}