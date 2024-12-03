import React from 'react';
import { Download } from 'lucide-react';
import { useData } from '../contexts/DataContext';

export default function ExportButton() {
  const { exporterDonnees } = useData();

  return (
    <button
      onClick={exporterDonnees}
      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
      title="Exporter les données"
    >
      <Download className="h-5 w-5 mr-2" />
      Sauvegarder
    </button>
  );
}