import React, { useState } from 'react';
import { Download, Upload, RefreshCw, AlertTriangle } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { saveAs } from 'file-saver';
import { defaultData } from '../data/defaultData';

export default function Backup() {
  const { patients, appointments, exporterDonnees, importerDonnees, reinitialiserDonnees } = useData();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  const handleExport = () => {
    try {
      const dataToExport = {
        patients,
        appointments,
        exportDate: new Date().toISOString(),
        version: '1.0',
        defaultData // Inclure les données par défaut dans l'export
      };

      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
        type: 'application/json'
      });

      const fileName = `cabinet_medical_backup_${new Date().toISOString().split('T')[0]}.json`;
      saveAs(blob, fileName);
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      alert('Une erreur est survenue lors de l\'export des données');
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      // Validation basique des données
      if (!data.patients || !data.appointments) {
        throw new Error('Format de fichier invalide');
      }

      // Import des données
      importerDonnees(data);
      setImportError(null);
      
      // Réinitialiser l'input file
      event.target.value = '';
      
      alert('Les données ont été importées avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'import:', error);
      setImportError('Le fichier sélectionné n\'est pas valide');
      event.target.value = '';
    }
  };

  const handleReset = () => {
    try {
      // Réinitialiser avec les données par défaut
      reinitialiserDonnees(defaultData);
      setShowResetConfirm(false);
      alert('Les données ont été réinitialisées avec succès');
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error);
      alert('Une erreur est survenue lors de la réinitialisation des données');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Sauvegarde</h2>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="space-y-4">
          <button
            onClick={handleExport}
            className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Download className="h-5 w-5 mr-2" />
            Sauvegarder les infos
          </button>

          <label className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer transition-colors">
            <Upload className="h-5 w-5 mr-2" />
            Importer les infos
            <input
              type="file"
              onChange={handleImport}
              className="hidden"
              accept=".json"
            />
          </label>

          {importError && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {importError}
            </div>
          )}

          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full flex items-center justify-center px-4 py-3 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Réinitialiser
          </button>
        </div>
      </div>

      {showResetConfirm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-yellow-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">
                Confirmer la réinitialisation
              </h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Cette action réinitialisera les données tout en conservant les configurations de base (sources de rendez-vous, types de consultation, mutuelles, etc.). Voulez-vous continuer ?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700"
              >
                Réinitialiser
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}