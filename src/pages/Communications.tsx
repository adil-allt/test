import React from 'react';
import { MessageSquare, Search, Plus, Mail, Phone } from 'lucide-react';

export default function Communications() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Communications</h2>
        <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
          <Plus className="h-5 w-5 mr-2" />
          Nouveau message
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Rechercher dans les messages..."
              />
            </div>
            <select className="block pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
              <option>Tous les types</option>
              <option>Email</option>
              <option>SMS</option>
              <option>Appel</option>
            </select>
          </div>
        </div>

        <div className="p-4">
          {[
            {
              type: 'email',
              patient: 'Marie Durant',
              subject: 'Confirmation rendez-vous',
              date: '15/03/2024',
              preview: 'Bonjour, je confirme notre rendez-vous du...',
              icon: Mail,
            },
            {
              type: 'phone',
              patient: 'Pierre Martin',
              subject: 'Appel manqué',
              date: '16/03/2024',
              preview: 'A essayé de vous joindre à 14:30',
              icon: Phone,
            },
            {
              type: 'sms',
              patient: 'Sophie Bernard',
              subject: 'Rappel rendez-vous',
              date: '17/03/2024',
              preview: 'Rappel: Votre rendez-vous est prévu pour...',
              icon: MessageSquare,
            },
          ].map((message, index) => {
            const Icon = message.icon;
            return (
              <div
                key={index}
                className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg mb-2 border border-gray-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-indigo-100 rounded-full p-2">
                    <Icon className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{message.patient}</p>
                    <p className="text-sm text-gray-900">{message.subject}</p>
                    <p className="text-sm text-gray-500">{message.preview}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{message.date}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}