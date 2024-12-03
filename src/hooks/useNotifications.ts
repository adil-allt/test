import { useState } from 'react';
import { NotificationService, NotificationTemplate } from '../services/notifications/NotificationService';

const notificationService = new NotificationService();

export function useNotifications() {
  const [senderPhone, setSenderPhone] = useState(notificationService.getSenderPhone());
  const [templates, setTemplates] = useState(notificationService.getTemplates());

  const updateSenderPhone = (phone: string) => {
    notificationService.setSenderPhone(phone);
    setSenderPhone(phone);
  };

  const addTemplate = (template: NotificationTemplate) => {
    notificationService.addTemplate(template);
    setTemplates(notificationService.getTemplates());
  };

  const updateTemplate = (id: string, updates: Partial<NotificationTemplate>) => {
    notificationService.updateTemplate(id, updates);
    setTemplates(notificationService.getTemplates());
  };

  const removeTemplate = (id: string) => {
    notificationService.removeTemplate(id);
    setTemplates(notificationService.getTemplates());
  };

  const exportNotifications = (appointments: any[], dateRange: { start: Date; end: Date }) => {
    notificationService.exportNotificationsToExcel(appointments, dateRange);
  };

  const openWhatsApp = (phone: string, message: string) => {
    notificationService.openWhatsApp(phone, message);
  };

  const formatMessage = (template: NotificationTemplate, data: {
    patientName: string;
    appointmentDate: string;
    appointmentTime: string;
  }) => {
    return notificationService.formatMessage(template, data);
  };

  return {
    senderPhone,
    templates,
    updateSenderPhone,
    addTemplate,
    updateTemplate,
    removeTemplate,
    exportNotifications,
    openWhatsApp,
    formatMessage
  };
}