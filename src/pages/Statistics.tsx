import React, { useState, useEffect } from 'react';
import { BarChart3, Filter } from 'lucide-react';
import StatisticCard from '../components/statistics/StatisticCard';
import DateRangePicker from '../components/statistics/DateRangePicker';
import { statisticOptions } from '../utils/statisticOptions';
import { useStatistics } from '../hooks/useStatistics';

export default function Statistics() {
  // Récupérer la sélection sauvegardée ou utiliser la liste complète par défaut
  const [selectedStats, setSelectedStats] = useState<string[]>(() => {
    const saved = localStorage.getItem('selectedStats');
    return saved ? JSON.parse(saved) : Object.keys(statisticOptions);
  });

  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  
  const stats = useStatistics(dateRange);

  // Sauvegarder la sélection dans le localStorage
  useEffect(() => {
    localStorage.setItem('selectedStats', JSON.stringify(selectedStats));
  }, [selectedStats]);

  const toggleStat = (statId: string) => {
    setSelectedStats(prev => 
      prev.includes(statId) 
        ? prev.filter(id => id !== statId)
        : [...prev, statId]
    );
  };

  const toggleAll = () => {
    setSelectedStats(prev => 
      prev.length === Object.keys(statisticOptions).length 
        ? [] 
        : Object.keys(statisticOptions)
    );
  };

  const getChartType = (statId: string) => {
    switch (statId) {
      case 'cityStats':
      case 'ageStats':
      case 'peakHours':
        return 'bar';
      case 'genderStats':
      case 'insuranceStats':
      case 'paymentTypeStats':
        return 'pie';
      case 'paymentStats':
      case 'appointmentEvolution':
        return 'line';
      default:
        return 'bar';
    }
  };

  const getStatData = (statId: string) => {
    switch (statId) {
      case 'cityStats':
        return stats.cityStats;
      case 'ageStats':
        return stats.ageStats;
      case 'appointmentStatus':
        return stats.appointmentStats?.status;
      case 'appointmentSource':
        return stats.appointmentStats?.source;
      case 'peakHours':
        return stats.appointmentStats?.hours;
      case 'insuranceStats':
        return stats.mutuelleStats;
      case 'paymentStats':
        return stats.paymentStats;
      case 'paymentTypeStats':
        return stats.paymentTypeStats;
      case 'consultationDuration':
        return stats.appointmentStats?.averageDuration 
          ? { 'Durée moyenne (minutes)': stats.appointmentStats.averageDuration }
          : {};
      default:
        return {};
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Statistiques</h2>
        <div className="flex items-center space-x-4">
          <DateRangePicker
            startDate={dateRange.startDate}
            endDate={dateRange.endDate}
            onStartDateChange={(date) => setDateRange(prev => ({ ...prev, startDate: date }))}
            onEndDateChange={(date) => setDateRange(prev => ({ ...prev, endDate: date }))}
          />
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-500">
              {selectedStats.length} statistiques sélectionnées
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-4">
        <div className="mb-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedStats.length === Object.keys(statisticOptions).length}
              onChange={toggleAll}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm font-medium text-gray-700">
              {selectedStats.length === Object.keys(statisticOptions).length 
                ? 'Tout désélectionner' 
                : 'Tout sélectionner'}
            </span>
          </label>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.entries(statisticOptions).map(([id, option]) => (
            <label key={id} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedStats.includes(id)}
                onChange={() => toggleStat(id)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {selectedStats.map(statId => {
          const option = statisticOptions[statId];
          const data = getStatData(statId);
          
          // Ne pas afficher la carte si aucune donnée n'est disponible
          if (!data || Object.keys(data).length === 0) return null;

          return (
            <StatisticCard
              key={statId}
              title={option.label}
              icon={<BarChart3 className="h-5 w-5" />}
              description={option.description}
              data={data}
              type={getChartType(statId)}
            />
          );
        })}
      </div>
    </div>
  );
}