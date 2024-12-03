import React, { useEffect, useRef } from 'react';
import { Download } from 'lucide-react';
import Chart from 'chart.js/auto';

interface StatisticCardProps {
  title: string;
  icon: React.ReactNode;
  description: string;
  data?: { [key: string]: number };
  type?: 'bar' | 'line' | 'pie' | 'doughnut';
}

export default function StatisticCard({ 
  title, 
  icon, 
  description, 
  data = {},
  type = 'bar' 
}: StatisticCardProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      // Détruire le graphique existant s'il y en a un
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        // Vérifier si les données sont vides
        const hasData = Object.keys(data).length > 0;

        if (!hasData) {
          // Afficher un message si aucune donnée n'est disponible
          ctx.font = '14px Arial';
          ctx.fillStyle = '#6B7280';
          ctx.textAlign = 'center';
          ctx.fillText('Aucune donnée disponible', chartRef.current.width / 2, chartRef.current.height / 2);
          return;
        }

        chartInstance.current = new Chart(ctx, {
          type,
          data: {
            labels: Object.keys(data),
            datasets: [{
              label: title,
              data: Object.values(data),
              backgroundColor: [
                'rgba(99, 102, 241, 0.5)',
                'rgba(59, 130, 246, 0.5)',
                'rgba(16, 185, 129, 0.5)',
                'rgba(245, 158, 11, 0.5)',
                'rgba(239, 68, 68, 0.5)',
                'rgba(168, 85, 247, 0.5)'
              ],
              borderColor: [
                'rgba(99, 102, 241, 1)',
                'rgba(59, 130, 246, 1)',
                'rgba(16, 185, 129, 1)',
                'rgba(245, 158, 11, 1)',
                'rgba(239, 68, 68, 1)',
                'rgba(168, 85, 247, 1)'
              ],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: type !== 'bar'
              }
            }
          }
        });
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, type, title]);

  const handleDownload = () => {
    if (chartRef.current) {
      const url = chartRef.current.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${title.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = url;
      link.click();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            {icon}
          </div>
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>
        <button 
          onClick={handleDownload}
          className="text-gray-400 hover:text-gray-600"
          disabled={Object.keys(data).length === 0}
        >
          <Download className="h-5 w-5" />
        </button>
      </div>
      <p className="text-sm text-gray-500 mb-4">{description}</p>
      <div className="h-48">
        <canvas ref={chartRef} />
      </div>
    </div>
  );
}