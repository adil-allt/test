import React from 'react';
import { Clock } from 'lucide-react';
import StatCard from './StatCard';

interface ConsultationTimeStatsProps {
  stats: {
    averageTime: number;
    shortestTime: number;
    longestTime: number;
    weeklyChange: number;
  };
}

export default function ConsultationTimeStats({ stats }: ConsultationTimeStatsProps) {
  const formatTime = (minutes: number) => `${minutes} min`;

  return (
    <StatCard
      icon={<Clock className="h-6 w-6 text-white" />}
      iconBgColor="bg-orange-500"
      title="Temps de consultation"
    >
      <div className="space-y-3">
        <div className="text-xl font-semibold text-gray-900">
          Temps moyen : {formatTime(stats.averageTime)}
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Plus court</span>
            <span className="text-sm font-medium text-gray-900">
              {formatTime(stats.shortestTime)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Plus long</span>
            <span className="text-sm font-medium text-gray-900">
              {formatTime(stats.longestTime)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">vs. semaine précédente</span>
            <span className={`text-sm font-medium ${
              stats.weeklyChange >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {stats.weeklyChange}%
            </span>
          </div>
        </div>
      </div>
    </StatCard>
  );
}