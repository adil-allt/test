export interface NotificationTemplate {
  id: string;
  name: string;
  content: string;
  variables: string[];
  isActive: boolean;
  sendHoursBefore: number;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationConfig {
  senderPhone: string;
  templates: NotificationTemplate[];
}

export interface NotificationData {
  patientName: string;
  appointmentDate: string;
  appointmentTime: string;
  doctorName?: string;
  clinicName?: string;
}