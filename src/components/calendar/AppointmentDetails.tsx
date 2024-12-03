import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { X, User, Clock, MapPin, AlertCircle, Users, Bell, Video } from 'lucide-react';
import { getStatusColor } from './utils';
import { Appointment } from './types';

interface AppointmentDetailsProps {
  appointment: Appointment;
  onClose: () => void;
  onUpdate?: () => void;
}

export default function AppointmentDetails({ appointment, onClose, onUpdate }: AppointmentDetailsProps) {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Détails du rendez-vous
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-gray-400" />
            <span className="font-medium">{appointment.patient}</span>
          </div>

          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-gray-400" />
            <span>{format(new Date(appointment.time), "d MMMM yyyy 'à' HH:mm", { locale: fr })}</span>
          </div>

          {appointment.location && (
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-gray-400" />
              <span>{appointment.location}</span>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-gray-400" />
            <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(appointment.status)}`}>
              {appointment.status}
            </span>
          </div>

          {appointment.participants && appointment.participants.length > 0 && (
            <div className="flex items-start space-x-2">
              <Users className="h-5 w-5 text-gray-400 mt-1" />
              <div className="flex-1">
                <p className="font-medium mb-1">Participants</p>
                <div className="space-y-1">
                  {appointment.participants.map((participant, index) => (
                    <div key={index} className="text-sm text-gray-600">
                      {participant}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {appointment.notifications && appointment.notifications.length > 0 && (
            <div className="flex items-start space-x-2">
              <Bell className="h-5 w-5 text-gray-400 mt-1" />
              <div className="flex-1">
                <p className="font-medium mb-1">Rappels</p>
                <div className="space-y-1">
                  {appointment.notifications.map((notification, index) => (
                    <div key={index} className="text-sm text-gray-600">
                      {notification.type} - {notification.time} minutes avant
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {appointment.videoLink && (
            <div className="flex items-center space-x-2">
              <Video className="h-5 w-5 text-blue-500" />
              <a
                href={appointment.videoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                Rejoindre la visioconférence
              </a>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Fermer
            </button>
            {onUpdate && (
              <button
                onClick={onUpdate}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Modifier
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}