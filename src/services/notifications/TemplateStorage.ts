import { NotificationTemplate } from './types';

const STORAGE_KEY = 'notification_templates';

export class TemplateStorage {
  public static saveTemplates(templates: NotificationTemplate[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
  }

  public static loadTemplates(): NotificationTemplate[] {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  }

  public static addTemplate(template: NotificationTemplate): void {
    const templates = this.loadTemplates();
    templates.push(template);
    this.saveTemplates(templates);
  }

  public static updateTemplate(id: string, updates: Partial<NotificationTemplate>): void {
    const templates = this.loadTemplates();
    const index = templates.findIndex(t => t.id === id);
    if (index !== -1) {
      templates[index] = { ...templates[index], ...updates };
      this.saveTemplates(templates);
    }
  }

  public static removeTemplate(id: string): void {
    const templates = this.loadTemplates();
    const filtered = templates.filter(t => t.id !== id);
    this.saveTemplates(filtered);
  }
}