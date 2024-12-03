import React from 'react';
import { Phone, Globe, User, Mail, Share2, MessageSquare, Users, Megaphone, UserPlus, 
  Brain, AlertTriangle, Gift, UserCheck, Coffee } from 'lucide-react';
import { isSunday, isSaturday, getDay } from 'date-fns';

export const getStatusColor = (status: string | undefined) => {
  if (!status) return 'bg-gray-500 text-white';
  
  switch (status.toLowerCase()) {
    case 'confirmé':
      return 'bg-green-500 text-white';
    case 'en-attente':
      return 'bg-yellow-500 text-white';
    case 'annulé':
      return 'bg-red-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

export const getSourceIcon = (sourceId: string | undefined) => {
  if (!sourceId) return <User className="h-4 w-4 text-white" />;
  
  switch (sourceId) {
    case 'phone':
      return <Phone className="h-4 w-4 text-white" />;
    case 'email':
      return <Mail className="h-4 w-4 text-white" />;
    case 'website':
      return <Globe className="h-4 w-4 text-white" />;
    case 'social':
      return <Share2 className="h-4 w-4 text-white" />;
    case 'sms':
      return <MessageSquare className="h-4 w-4 text-white" />;
    case 'referral':
      return <Users className="h-4 w-4 text-white" />;
    case 'advertising':
      return <Megaphone className="h-4 w-4 text-white" />;
    default:
      return <User className="h-4 w-4 text-white" />;
  }
};

export const getTypeIcon = (type: string | undefined) => {
  const normalizedType = type?.toUpperCase();
  switch (normalizedType) {
    case 'NOUVELLE CONSULTATION':
      return <UserPlus className="h-4 w-4 text-white" />;
    case 'SUIVI':
      return <UserCheck className="h-4 w-4 text-white" />;
    case 'GRATUIT':
      return <Gift className="h-4 w-4 text-white" />;
    case 'ANNULÉ':
      return <AlertTriangle className="h-4 w-4 text-white" />;
    case 'PAUSE_DEJEUNER':
      return <Coffee className="h-4 w-4 text-white" />;
    default:
      return <User className="h-4 w-4 text-white" />;
  }
};

export const getAppointmentColor = (type: string | undefined, status: string | undefined) => {
  if (status?.toLowerCase() === 'annulé') {
    return 'bg-red-500 text-white';
  }

  const normalizedType = type?.toUpperCase();
  switch (normalizedType) {
    case 'NOUVELLE CONSULTATION':
      return 'bg-green-500 text-white';
    case 'SUIVI':
      return 'bg-blue-500 text-white';
    case 'URGENCE':
      return 'bg-red-500 text-white';
    case 'GRATUIT':
      return 'bg-gray-500 text-white';
    case 'PAUSE_DEJEUNER':
      return 'bg-gray-700 text-white';
    case 'DÉLÉGUÉ':
      return 'bg-yellow-500 text-white';
    case 'CONTRÔLE':
      return 'bg-purple-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

export const getAppointmentHoverColor = (type: string | undefined) => {
  const normalizedType = type?.toUpperCase();
  switch (normalizedType) {
    case 'NOUVELLE CONSULTATION':
      return 'hover:bg-green-600';
    case 'SUIVI':
      return 'hover:bg-blue-600';
    case 'URGENCE':
      return 'hover:bg-red-600';
    case 'GRATUIT':
      return 'hover:bg-gray-600';
    case 'PAUSE_DEJEUNER':
      return 'hover:bg-gray-800';
    case 'DÉLÉGUÉ':
      return 'hover:bg-yellow-600';
    case 'CONTRÔLE':
      return 'hover:bg-purple-600';
    default:
      return 'hover:bg-gray-600';
  }
};

export const isStripedSlot = (time: string, date: Date, appointments: any[] = []) => {
  const [hours, minutes] = time.split(':').map(Number);
  const timeValue = hours + minutes / 60;
  const dayOfWeek = getDay(date);

  // Vérifier si le créneau est une pause déjeuner
  const isLunchBreak = appointments.some(apt => {
    const aptTime = new Date(apt.time);
    return aptTime.getHours() === hours && 
           aptTime.getMinutes() === minutes && 
           apt.type?.toUpperCase() === 'PAUSE_DEJEUNER';
  });

  if (isLunchBreak) {
    return true;
  }

  // Dimanche (0) : toute la journée
  if (isSunday(date)) {
    return timeValue >= 9.0 && timeValue <= 20.5;
  }

  // Samedi (6) : après 13h30
  if (isSaturday(date)) {
    return timeValue >= 13.5 && timeValue <= 20.5;
  }

  // Lundi à vendredi (1-5) : après 17h30
  return timeValue >= 17.5 && timeValue <= 20.5;
};

export const getBreakTimeReason = (time: string, date: Date, appointments: any[] = []) => {
  const [hours, minutes] = time.split(':').map(Number);
  const timeValue = hours + minutes / 60;

  // Vérifier si le créneau est une pause déjeuner
  const isLunchBreak = appointments.some(apt => {
    const aptTime = new Date(apt.time);
    return aptTime.getHours() === hours && 
           aptTime.getMinutes() === minutes && 
           apt.type?.toUpperCase() === 'PAUSE_DEJEUNER';
  });

  if (isLunchBreak) {
    return 'Pause déjeuner';
  }

  if (isSunday(date)) {
    return 'Fermé le dimanche';
  }

  if (isSaturday(date) && timeValue >= 13.5) {
    return 'Fermé le samedi après-midi';
  }

  if (timeValue >= 17.5) {
    return 'Fin des consultations';
  }

  return '';
};