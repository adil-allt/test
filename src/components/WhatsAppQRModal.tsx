import React, { useState } from 'react';
import { Phone, X, Key } from 'lucide-react';
import DraggableModal from './DraggableModal';
import { useWhatsApp } from '../contexts/WhatsAppContext';

interface WhatsAppQRModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WhatsAppQRModal({ isOpen, onClose }: WhatsAppQRModalProps) {
  const { isConnected, phoneNumber, connect, disconnect } = useWhatsApp();
  const [phone, setPhone] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');

  const handleConnect = async () => {
    setError('');
    const success = await connect(phone, apiKey);
    if (success) {
      onClose();
    } else {
      setError('Échec de la connexion. Vérifiez vos informations.');
    }
  };

  return (
    <DraggableModal
      isOpen={isOpen}
      onClose={onClose}
      title="Configuration WhatsApp Business"
      className="w-full max-w-md"
    >
      <div className="space-y-6">
        {isConnected ? (
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 text-green-600 mb-4">
              <Phone className="h-6 w-6" />
              <span className="text-lg font-medium">Connecté</span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              WhatsApp Business est connecté avec le numéro : {phoneNumber}
            </p>
            <button
              onClick={disconnect}
              className="px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50"
            >
              <div className="flex items-center justify-center space-x-2">
                <X className="h-4 w-4" />
                <span>Déconnecter</span>
              </div>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <p className="text-sm text-yellow-700">
                Pour utiliser l'API WhatsApp Business, vous devez :
                <br />
                1. Avoir un compte WhatsApp Business
                <br />
                2. Être approuvé par Meta pour l'API
                <br />
                3. Avoir une clé API valide
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  Numéro WhatsApp Business
                </div>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+212600000000"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">Format international (+XXX...)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                <div className="flex items-center">
                  <Key className="h-4 w-4 mr-2" />
                  Clé API WhatsApp Business
                </div>
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
              />
            </div>

            <button
              onClick={handleConnect}
              className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
            >
              Connecter
            </button>
          </div>
        )}
      </div>
    </DraggableModal>
  );
}