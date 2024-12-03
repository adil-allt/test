import React from 'react';
import { MessageSquare } from 'lucide-react';

interface NotificationPreviewProps {
  message: string;
  patientName: string;
  appointmentDate: string;
  appointmentTime: string;
}

export default function NotificationPreview({
  message,
  patientName,
  appointmentDate,
  appointmentTime
}: NotificationPreviewProps) {
  const formattedMessage = message
    .replace('{patientName}', patientName)
    .replace('{appointmentDate}', appointmentDate)
    .replace('{appointmentTime}', appointmentTime)
    .replace('{doctorName}', 'Dr. Martin')
    .replace('{clinicName}', 'Cabinet de Psychiatrie');

  return (
    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
      <div className="flex items-start space-x-3">
        <div className="bg-green-100 rounded-full p-2">
          <MessageSquare className="h-5 w-5 text-green-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-green-800 mb-1">Aperçu du message</p>
          <p className="text-sm text-green-700 whitespace-pre-wrap">{formattedMessage}</p>
        </div>
      </div>
    </div>
  );
}