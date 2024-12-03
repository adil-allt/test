import { useState, useEffect } from 'react';
import { WhatsAppService } from '../services/whatsapp/WhatsAppService';
import { useAppointments } from '../contexts/AppointmentContext';

const whatsAppService = new WhatsAppService();

export function useWhatsAppNotifications() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { appointments } = useAppointments();

  useEffect(() => {
    const processNotifications = async () => {
      if (!whatsAppService.isConfigured() || isProcessing) return;

      setIsProcessing(true);
      try {
        await whatsAppService.processAppointmentNotifications(appointments);
      } catch (error) {
        console.error('Erreur lors du traitement des notifications:', error);
      } finally {
        setIsProcessing(false);
      }
    };

    // Vérifier les notifications toutes les minutes
    const interval = setInterval(processNotifications, 60 * 1000);
    processNotifications();

    return () => clearInterval(interval);
  }, [appointments, isProcessing]);

  return {
    isConfigured: whatsAppService.isConfigured(),
    configure: whatsAppService.configure.bind(whatsAppService),
    disconnect: whatsAppService.disconnect.bind(whatsAppService),
    addTemplate: whatsAppService.addTemplate.bind(whatsAppService),
    updateTemplate: whatsAppService.updateTemplate.bind(whatsAppService),
    removeTemplate: whatsAppService.removeTemplate.bind(whatsAppService),
    isProcessing
  };
}