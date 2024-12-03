export const APPOINTMENT_TYPES = {
  THERAPY: {
    id: 'therapy',
    label: 'Thérapie',
    color: 'bg-purple-500 text-white',
    hoverColor: 'hover:bg-purple-600',
    icon: 'Brain'
  },
  EMERGENCY: {
    id: 'emergency',
    label: 'Urgence',
    color: 'bg-red-500 text-white',
    hoverColor: 'hover:bg-red-600',
    icon: 'AlertTriangle'
  },
  FREE: {
    id: 'free',
    label: 'Gratuit',
    color: 'bg-gray-500 text-white',
    hoverColor: 'hover:bg-gray-600',
    icon: 'Gift'
  },
  DELEGATE: {
    id: 'delegate',
    label: 'Délégué',
    color: 'bg-yellow-500 text-white',
    hoverColor: 'hover:bg-yellow-600',
    icon: 'Users'
  },
  NEW_CONSULTATION: {
    id: 'new_consultation',
    label: 'Nouvelle consultation',
    color: 'bg-green-500 text-white',
    hoverColor: 'hover:bg-green-600',
    icon: 'UserPlus'
  },
  FOLLOW_UP: {
    id: 'follow_up',
    label: 'Suivi',
    color: 'bg-blue-500 text-white',
    hoverColor: 'hover:bg-blue-600',
    icon: 'UserCheck'
  }
} as const;