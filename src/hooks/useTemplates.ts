import { useState, useEffect } from 'react';
import { NotificationTemplate, NotificationData } from '../services/notifications/types';
import { TemplateManager } from '../services/notifications/TemplateManager';

const templateManager = new TemplateManager();

export function useTemplates() {
  const [templates, setTemplates] = useState<NotificationTemplate[]>(templateManager.getTemplates());

  useEffect(() => {
    setTemplates(templateManager.getTemplates());
  }, []);

  const addTemplate = (template: Omit<NotificationTemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTemplate = templateManager.addTemplate(template);
    setTemplates(templateManager.getTemplates());
    return newTemplate;
  };

  const updateTemplate = (id: string, updates: Partial<Omit<NotificationTemplate, 'id' | 'createdAt'>>) => {
    templateManager.updateTemplate(id, updates);
    setTemplates(templateManager.getTemplates());
  };

  const removeTemplate = (id: string) => {
    templateManager.removeTemplate(id);
    setTemplates(templateManager.getTemplates());
  };

  const formatMessage = (template: NotificationTemplate, data: NotificationData) => {
    return templateManager.formatMessage(template, data);
  };

  return {
    templates,
    addTemplate,
    updateTemplate,
    removeTemplate,
    formatMessage
  };
}