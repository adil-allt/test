import { format, addHours, isWithinInterval } from 'date-fns';
import { fr } from 'date-fns/locale';
import * as XLSX from 'xlsx';

export interface NotificationTemplate {
  id: string;
  name: string;
  content: string;
  variables: string[];
  isActive: boolean;
  sendHoursBefore: number;
}

export interface NotificationConfig {
  senderPhone: string;
  templates: NotificationTemplate[];
}

export class NotificationService {
  private config: NotificationConfig = {
    senderPhone: '',
    templates: []
  };

  constructor() {
    this.loadConfig();
  }

  private loadConfig() {
    const savedConfig = localStorage.getItem('notification_config');
    if (savedConfig) {
      this.config = JSON.parse(savedConfig);
    }
  }

  private saveConfig() {
    localStorage.setItem('notification_config', JSON.stringify(this.config));
  }

  public setSenderPhone(phone: string) {
    this.config.senderPhone = phone;
    this.saveConfig();
  }

  public getSenderPhone(): string {
    return this.config.senderPhone;
  }

  public getTemplates(): NotificationTemplate[] {
    return this.config.templates;
  }

  public addTemplate(template: NotificationTemplate) {
    this.config.templates.push(template);
    this.saveConfig();
  }

  public updateTemplate(id: string, updates: Partial<NotificationTemplate>) {
    this.config.templates = this.config.templates.map(template =>
      template.id === id ? { ...template, ...updates } : template
    );
    this.saveConfig();
  }

  public removeTemplate(id: string) {
    this.config.templates = this.config.templates.filter(template => template.id !== id);
    this.saveConfig();
  }

  public formatMessage(template: NotificationTemplate, data: {
    patientName: string;
    appointmentDate: string;
    appointmentTime: string;
  }): string {
    let message = template.content;
    const variables = {
      patientName: data.patientName,
      appointmentDate: data.appointmentDate,
      appointmentTime: data.appointmentTime,
      doctorName: "Dr. Martin",
      clinicName: "Cabinet de Psychiatrie"
    };

    for (const [key, value] of Object.entries(variables)) {
      message = message.replace(new RegExp(`{${key}}`, 'g'), value);
    }

    return message;
  }

  public openWhatsApp(phone: string, message: string) {
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
  }

  public exportNotificationsToExcel(appointments: any[], dateRange: { start: Date; end: Date }) {
    const notificationsToSend = this.getNotificationsForRange(appointments, dateRange);
    
    const workbook = XLSX.utils.book_new();
    
    // Créer une feuille par template actif
    this.config.templates
      .filter(template => template.isActive)
      .forEach(template => {
        const notifications = notificationsToSend
          .filter(notif => notif.templateId === template.id)
          .map(notif => ({
            'Patient': notif.patientName,
            'Téléphone': notif.phone,
            'Date RDV': format(new Date(notif.appointmentTime), 'dd/MM/yyyy', { locale: fr }),
            'Heure RDV': format(new Date(notif.appointmentTime), 'HH:mm', { locale: fr }),
            'Heure envoi': format(
              addHours(new Date(notif.appointmentTime), -template.sendHoursBefore),
              'dd/MM/yyyy HH:mm',
              { locale: fr }
            ),
            'Message': notif.message
          }));

        if (notifications.length > 0) {
          const worksheet = XLSX.utils.json_to_sheet(notifications);
          XLSX.utils.book_append_sheet(workbook, worksheet, template.name);
        }
      });

    // Générer le fichier Excel
    const fileName = `notifications_${format(dateRange.start, 'dd-MM-yyyy')}_${format(dateRange.end, 'dd-MM-yyyy')}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  }

  private getNotificationsForRange(appointments: any[], dateRange: { start: Date; end: Date }) {
    const notifications: any[] = [];

    appointments.forEach(apt => {
      const appointmentTime = new Date(apt.time);
      
      // Vérifier si le rendez-vous est dans la plage de dates
      if (isWithinInterval(appointmentTime, dateRange)) {
        this.config.templates
          .filter(template => template.isActive)
          .forEach(template => {
            const message = this.formatMessage(template, {
              patientName: apt.patient,
              appointmentDate: format(appointmentTime, 'EEEE d MMMM yyyy', { locale: fr }),
              appointmentTime: format(appointmentTime, 'HH:mm', { locale: fr })
            });

            notifications.push({
              templateId: template.id,
              patientName: apt.patient,
              phone: apt.contact,
              appointmentTime: apt.time,
              message,
              sendTime: addHours(appointmentTime, -template.sendHoursBefore)
            });
          });
      }
    });

    return notifications.sort((a, b) => a.sendTime.getTime() - b.sendTime.getTime());
  }
}