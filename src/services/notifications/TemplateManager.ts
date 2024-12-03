import { NotificationTemplate, NotificationData } from './types';
import { TemplateStorage } from './TemplateStorage';

export class TemplateManager {
  private templates: NotificationTemplate[];

  constructor() {
    this.templates = TemplateStorage.loadTemplates();
  }

  public getTemplates(): NotificationTemplate[] {
    return this.templates;
  }

  public addTemplate(template: Omit<NotificationTemplate, 'id' | 'createdAt' | 'updatedAt'>): NotificationTemplate {
    const newTemplate: NotificationTemplate = {
      ...template,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.templates.push(newTemplate);
    TemplateStorage.addTemplate(newTemplate);
    return newTemplate;
  }

  public updateTemplate(id: string, updates: Partial<Omit<NotificationTemplate, 'id' | 'createdAt'>>): void {
    const template = this.templates.find(t => t.id === id);
    if (template) {
      const updatedTemplate = {
        ...template,
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      this.templates = this.templates.map(t => 
        t.id === id ? updatedTemplate : t
      );
      
      TemplateStorage.updateTemplate(id, updatedTemplate);
    }
  }

  public removeTemplate(id: string): void {
    this.templates = this.templates.filter(t => t.id !== id);
    TemplateStorage.removeTemplate(id);
  }

  public formatMessage(template: NotificationTemplate, data: NotificationData): string {
    let message = template.content;
    const variables = {
      patientName: data.patientName,
      appointmentDate: data.appointmentDate,
      appointmentTime: data.appointmentTime,
      doctorName: data.doctorName || "Dr. Martin",
      clinicName: data.clinicName || "Cabinet de Psychiatrie"
    };

    for (const [key, value] of Object.entries(variables)) {
      message = message.replace(new RegExp(`{${key}}`, 'g'), value);
    }

    return message;
  }
}