import { useMemo } from 'react';

export const useAppointmentColors = () => {
  // Couleurs vives pour les types de consultation
  const typeColors = useMemo(() => ({
    'NOUVELLE CONSULTATION': 'bg-green-500 text-white',
    'SUIVI': 'bg-blue-500 text-white',
    'URGENCE': 'bg-red-500 text-white',
    'GRATUIT': 'bg-gray-500 text-white',
    'DELEGUE': 'bg-yellow-500 text-white',
    'CONTROLE': 'bg-purple-500 text-white',
    'ANNULE': 'bg-red-500 text-white'
  }), []);

  // Couleurs vives pour les sources
  const sourceColors = useMemo(() => ({
    'PHONE': 'bg-blue-500 text-white',
    'EMAIL': 'bg-purple-500 text-white',
    'WEBSITE': 'bg-cyan-500 text-white',
    'DIRECT': 'bg-teal-500 text-white',
    'OTHER': 'bg-gray-500 text-white'
  }), []);

  const getAppointmentColor = (type: string | undefined, status: string | undefined) => {
    if (status?.toLowerCase() === 'annulé') {
      return 'bg-red-500 text-white';
    }

    const normalizedType = type?.toUpperCase();
    return typeColors[normalizedType as keyof typeof typeColors] || 'bg-gray-500 text-white';
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
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

  const getHoverColor = (type: string | undefined) => {
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
      case 'DELEGUE':
        return 'hover:bg-yellow-600';
      case 'CONTROLE':
        return 'hover:bg-purple-600';
      default:
        return 'hover:bg-gray-600';
    }
  };

  return {
    typeColors,
    sourceColors,
    getAppointmentColor,
    getStatusColor,
    getHoverColor
  };
};