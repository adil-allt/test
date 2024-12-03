import React from 'react';
import { UserPlus, History, Gift, XCircle, Clock } from 'lucide-react';

interface ConsultationStatsProps {
  stats: {
    total: number;
    nouveauxPatients: number;
    anciensPatients: number;
    gratuites: number;
    annulees: number;
    enAttente: number;
  };
}

export default function ConsultationStats({ stats }: ConsultationStatsProps) {
  const statItems = [
    {
      icon: UserPlus,
      label: 'Nouveaux patients',
      value: stats.nouveauxPatients,
      color: 'text-green-600'
    },
    {
      icon: History,
      label: 'Anciens patients',
      value: stats.anciensPatients,
      color: 'text-blue-600'
    },
    {
      icon: Gift,
      label: 'Gratuités',
      value: stats.gratuites,
      color: 'text-purple-600'
    },
    {
      icon: XCircle,
      label: 'Rendez-vous annulés',
      value: stats.annulees,
      color: 'text-red-600'
    },
    {
      icon: Clock,
      label: 'Rendez-vous en attente',
      value: stats.enAttente,
      color: 'text-yellow-600'
    }
  ];

  return (
    <div className="space-y-3">
      <div className="text-xl font-semibold text-gray-900">
        Total: {stats.total}
      </div>
      <div className="space-y-2">
        {statItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <Icon className={`h-5 w-5 ${item.color} mr-2`} />
                <span className="text-sm text-gray-600">{item.label}</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{item.value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}