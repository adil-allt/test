import React, { createContext, useContext, useState } from 'react';

interface WhatsAppContextType {
  isConnected: boolean;
  phoneNumber: string | null;
  connect: (phoneNumber: string, apiKey: string) => Promise<boolean>;
  disconnect: () => void;
  sendMessage: (to: string, message: string) => Promise<boolean>;
}

const WhatsAppContext = createContext<WhatsAppContextType | null>(null);

export const useWhatsApp = () => {
  const context = useContext(WhatsAppContext);
  if (!context) {
    throw new Error('useWhatsApp must be used within a WhatsAppProvider');
  }
  return context;
};

export function WhatsAppProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);

  const connect = async (phone: string, key: string): Promise<boolean> => {
    try {
      // Vérification du format du numéro
      const phoneRegex = /^\+[1-9]\d{1,14}$/;
      if (!phoneRegex.test(phone)) {
        throw new Error('Format de numéro invalide. Utilisez le format international (+XXX...)');
      }

      // Vérification de l'API key
      if (!key || key.length < 32) {
        throw new Error('Clé API invalide');
      }

      // Simuler une requête de vérification à l'API WhatsApp Business
      const response = await fetch('https://graph.facebook.com/v17.0/whatsapp_business_account_id/message_templates', {
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Échec de la connexion à l\'API WhatsApp Business');
      }

      setPhoneNumber(phone);
      setApiKey(key);
      setIsConnected(true);

      // Sauvegarder les informations de connexion
      localStorage.setItem('whatsapp_business', JSON.stringify({
        phoneNumber: phone,
        apiKey: key,
        isConnected: true
      }));

      return true;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      return false;
    }
  };

  const disconnect = () => {
    setIsConnected(false);
    setPhoneNumber(null);
    setApiKey(null);
    localStorage.removeItem('whatsapp_business');
  };

  const sendMessage = async (to: string, message: string): Promise<boolean> => {
    if (!isConnected || !apiKey || !phoneNumber) return false;

    try {
      // Configuration de la requête à l'API WhatsApp Business
      const response = await fetch(`https://graph.facebook.com/v17.0/FROM_PHONE_NUMBER_ID/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: to,
          type: 'text',
          text: { body: message }
        })
      });

      if (!response.ok) {
        throw new Error('Échec de l\'envoi du message');
      }

      return true;
    } catch (error) {
      console.error('Erreur d\'envoi:', error);
      return false;
    }
  };

  return (
    <WhatsAppContext.Provider value={{
      isConnected,
      phoneNumber,
      connect,
      disconnect,
      sendMessage
    }}>
      {children}
    </WhatsAppContext.Provider>
  );
}