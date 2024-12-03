import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface WhatsAppConfig {
  apiKey: string;
  phoneNumber: string;
}

interface NotificationTemplate {
  id: string;
  name: string;
  content: string;
  variables: string[];
  isActive: boolean;
  sendHoursBefore: number;
}

interface Appointment {
  id: string;
  patient: string;
  time: string;
  contact?: string;
}

export class WhatsAppService {
  private config: WhatsAppConfig | null = null;
  private templates: NotificationTemplate[] = [];

  constructor() {
    this.loadConfig();
  }

  private loadConfig() {
    const savedConfig = localStorage.getItem('whatsapp_config');
    if (savedConfig) {
      this.config = JSON.parse(savedConfig);
    }
  }

  public isConfigured(): boolean {
    return this.config !== null;
  }

  public async configure(apiKey: string, phoneNumber: string): Promise<boolean> {
    try {
      // Vérifier le format du numéro
      if (!/^\+[1-9]\d{1,14}$/.test(phoneNumber)) {
        throw new Error('Format de numéro invalide');
      }

      // Vérifier l'API key
      if (!apiKey || apiKey.length < 32) {
        throw new Error('Clé API invalide');
      }

      this.config = { apiKey, phoneNumber };
      localStorage.setItem('whatsapp_config', JSON.stringify(this.config));
      return true;
    } catch (error) {
      console.error('Erreur de configuration:', error);
      return false;
    }
  }

  public disconnect(): void {
    this.config = null;
    localStorage.removeItem('whatsapp_config');
  }

  public async sendMessage(to: string, message: string): Promise<boolean> {
    if (!this.config) return false;

    try {
      const response = await fetch('https://graph.facebook.com/v17.0/FROM_PHONE_NUMBER_ID/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: to,
          type: 'text',
          text: { body: message }
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Erreur d\'envoi:', error);
      return false;
    }
  }

  public addTemplate(template: NotificationTemplate): void {
    this.templates.push(template);
    this.saveTemplates();
  }

  public updateTemplate(id: string, updates: Partial<NotificationTemplate>): void {
    this.templates = this.templates.map(template =>
      template.id === id ? { ...template, ...updates } : template
    );
    this.saveTemplates();
  }

  public removeTemplate(id: string): void {
    this.templates = this.templates.filter(template => template.id !== id);
    this.saveTemplates();
  }

  private saveTemplates(): void {
    localStorage.setItem('whatsapp_templates', JSON.stringify(this.templates));
  }

  private loadTemplates(): void {
    const savedTemplates = localStorage.getItem('whatsapp_templates');
    if (savedTemplates) {
      this.templates = JSON.parse(savedTemplates);
    }
  }

  public async processAppointmentNotifications(appointments: Appointment[]): Promise<void> {
    if (!this.config) return;

    for (const template of this.templates) {
      if (!template.isActive) continue;

      const notificationTime = template.sendHoursBefore * 60 * 60 * 1000;
      const now = new Date().getTime();

      for (const appointment of appointments) {
        const appointmentTime = new Date(appointment.time).getTime();
        const shouldSendNow = appointmentTime - now <= notificationTime && 
                            appointmentTime - now > notificationTime - (5 * 60 * 1000); // 5 minutes window

        if (shouldSendNow && appointment.contact) {
          const message = this.formatMessage(template, appointment);
          await this.sendMessage(appointment.contact, message);
        }
      }
    }
  }

  private formatMessage(template: NotificationTemplate, appointment: Appointment): string {
    let message = template.content;

    const variables = {
      patientName: appointment.patient,
      appointmentDate: format(new Date(appointment.time), 'EEEE d MMMM yyyy', { locale: fr }),
      appointmentTime: format(new Date(appointment.time), 'HH:mm'),
      doctorName: "Dr. Martin",
      clinicName: "Cabinet de Psychiatrie"
    };

    for (const [key, value] of Object.entries(variables)) {
      message = message.replace(new RegExp(`{${key}}`, 'g'), value);
    }

    return message;
  }
}