import React from 'react';
import { BarChart3, PieChart, TrendingUp, Download } from 'lucide-react';

export default function Reports() {
  return (
    <div className="space-y-6">
      {/* Statistiques clés en haut */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: 'Nouveaux patients',
            value: '24',
            change: '+12%',
            changeType: 'positive',
          },
          {
            label: 'Consultations',
            value: '156',
            change: '+8%',
            changeType: 'positive',
          },
          {
            label: 'Taux de présence',
            value: '95%',
            change: '+2%',
            changeType: 'positive',
          },
          {
            label: 'Revenu mensuel',
            value: '12 450 €',
            change: '+15%',
            changeType: 'positive',
          },
        ].map((stat, index) => (
          <div key={index} className="bg-white shadow rounded-lg p-6">
            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
            <p className="mt-2 text-3xl font-semibold text-gray-900">{stat.value}</p>
            <p className={`mt-2 text-sm ${
              stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}>
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Rapports détaillés</h2>
        <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
          <Download className="h-5 w-5 mr-2" />
          Exporter
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Consultations par type</h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            [Graphique des consultations]
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Répartition des patients</h3>
            <PieChart className="h-5 w-5 text-gray-400" />
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            [Graphique de répartition]
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Évolution mensuelle</h3>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            [Graphique d'évolution]
          </div>
        </div>
      </div>
    </div>
  );
}