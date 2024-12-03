import React, { useState, useMemo } from 'react';
import { Plus, Search, Calendar, Check, Edit, Trash2, Download } from 'lucide-react';
import AbsenceModal from '../components/AbsenceModal';
import AbsenceExportModal from '../components/AbsenceExportModal';
import { testAbsences } from '../data/testData';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function Absences() {
  const [isAbsenceModalOpen, setIsAbsenceModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [editingAbsence, setEditingAbsence] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [absences, setAbsences] = useState(testAbsences);
  const [editValues, setEditValues] = useState<{
    [key: string]: {
      employee: string;
      startDate: string;
      endDate: string;
      reason: string;
      status: string;
    };
  }>({});

  const handleAbsenceSubmit = (absence: any) => {
    setAbsences([...absences, absence]);
    setIsAbsenceModalOpen(false);
  };

  const handleEdit = (absenceId: string) => {
    const absence = absences.find(a => a.id === absenceId);
    if (absence) {
      setEditingAbsence(absenceId);
      setEditValues({
        [absenceId]: {
          employee: absence.employee,
          startDate: absence.startDate,
          endDate: absence.endDate,
          reason: absence.reason,
          status: absence.status
        }
      });
    }
  };

  const handleSave = (absenceId: string) => {
    const editValue = editValues[absenceId];
    if (editValue) {
      setAbsences(prev => prev.map(absence => 
        absence.id === absenceId ? { ...absence, ...editValue } : absence
      ));
      setEditingAbsence(null);
    }
  };

  const handleDelete = (id: string) => {
    setAbsences(prev => prev.filter(absence => absence.id !== id));
    setShowDeleteConfirm(null);
  };

  const handleExport = (exportDateRange: { startDate: string; endDate: string }) => {
    // Préparer les données pour l'export
    const dataToExport = filteredAbsences
      .filter(absence => {
        if (!exportDateRange.startDate || !exportDateRange.endDate) return true;
        
        const [startDay, startMonth, startYear] = absence.startDate.split('/');
        const absenceStart = new Date(parseInt(startYear), parseInt(startMonth) - 1, parseInt(startDay));
        const start = new Date(exportDateRange.startDate);
        const end = new Date(exportDateRange.endDate);
        
        return absenceStart >= start && absenceStart <= end;
      })
      .map(absence => ({
        'Employé': absence.employee,
        'Date de début': absence.startDate,
        'Date de fin': absence.endDate,
        'Motif': absence.reason,
        'Statut': absence.status
      }));

    // Créer un nouveau classeur
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(dataToExport);

    // Ajouter la feuille au classeur
    XLSX.utils.book_append_sheet(wb, ws, 'Absences');

    // Générer le nom du fichier
    const startDateStr = exportDateRange.startDate ? format(new Date(exportDateRange.startDate), 'dd-MM', { locale: fr }) : '';
    const endDateStr = exportDateRange.endDate ? format(new Date(exportDateRange.endDate), 'dd-MM', { locale: fr }) : '';
    const currentDate = format(new Date(), 'dd-MM-yyyy', { locale: fr });
    
    let fileName = 'absences';
    if (startDateStr && endDateStr) {
      fileName = `absences_du_${startDateStr}_au_${endDateStr}_le_${currentDate}`;
    } else {
      fileName = `absences_le_${currentDate}`;
    }

    // Sauvegarder le fichier
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  const filteredAbsences = useMemo(() => {
    return absences.filter(absence => {
      const searchTerms = searchTerm.toLowerCase().split(' ');
      
      const matchesSearch = searchTerms.every(term => {
        if (term.startsWith('*') && term.endsWith('*')) {
          const searchPattern = term.slice(1, -1).toLowerCase();
          if (searchPattern) {
            const searchableContent = [
              absence.employee,
              absence.reason,
              absence.status,
              absence.startDate,
              absence.endDate
            ]
              .filter(Boolean)
              .join(' ')
              .toLowerCase();

            return searchableContent.includes(searchPattern);
          }
          return true;
        }

        const searchableContent = [
          absence.employee,
          absence.reason,
          absence.status,
          absence.startDate,
          absence.endDate
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        return searchableContent.includes(term);
      });
      
      if (!dateRange.startDate || !dateRange.endDate) return matchesSearch;
      
      const [startDay, startMonth, startYear] = absence.startDate.split('/');
      const [endDay, endMonth, endYear] = absence.endDate.split('/');
      
      const absenceStart = new Date(parseInt(startYear), parseInt(startMonth) - 1, parseInt(startDay));
      const absenceEnd = new Date(parseInt(endYear), parseInt(endMonth) - 1, parseInt(endDay));
      const start = new Date(dateRange.startDate);
      const end = new Date(dateRange.endDate);
      
      const matchesDate = absenceStart >= start && absenceEnd <= end;
      
      return matchesSearch && matchesDate;
    });
  }, [absences, searchTerm, dateRange]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approuvé':
        return 'bg-green-100 text-green-800';
      case 'Refusé':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Absences ({filteredAbsences.length})
        </h2>
        <div className="flex space-x-4">
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <Download className="h-5 w-5 mr-2" />
            Exporter
          </button>
          <button 
            onClick={() => setIsAbsenceModalOpen(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nouvelle absence
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between space-x-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Rechercher une absence (utilisez * pour une recherche partielle)"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div className="flex items-center space-x-2">
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                />
                <span className="text-gray-500">à</span>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employé
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date de début
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date de fin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Motif
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAbsences.map((absence) => {
                const isEditing = editingAbsence === absence.id;
                const editValue = editValues[absence.id] || {
                  employee: absence.employee,
                  startDate: absence.startDate,
                  endDate: absence.endDate,
                  reason: absence.reason,
                  status: absence.status
                };

                return (
                  <tr key={absence.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editValue.employee}
                          onChange={(e) => setEditValues({
                            ...editValues,
                            [absence.id]: { ...editValue, employee: e.target.value }
                          })}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      ) : (
                        <div className="text-sm font-medium text-gray-900">
                          {absence.employee}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editValue.startDate}
                          onChange={(e) => setEditValues({
                            ...editValues,
                            [absence.id]: { ...editValue, startDate: e.target.value }
                          })}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      ) : (
                        absence.startDate
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editValue.endDate}
                          onChange={(e) => setEditValues({
                            ...editValues,
                            [absence.id]: { ...editValue, endDate: e.target.value }
                          })}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      ) : (
                        absence.endDate
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editValue.reason}
                          onChange={(e) => setEditValues({
                            ...editValues,
                            [absence.id]: { ...editValue, reason: e.target.value }
                          })}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      ) : (
                        absence.reason
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <select
                          value={editValue.status}
                          onChange={(e) => setEditValues({
                            ...editValues,
                            [absence.id]: { ...editValue, status: e.target.value }
                          })}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          <option value="En attente">En attente</option>
                          <option value="Approuvé">Approuvé</option>
                          <option value="Refusé">Refusé</option>
                        </select>
                      ) : (
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(absence.status)}`}>
                          {absence.status}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-3">
                        {isEditing ? (
                          <button
                            onClick={() => handleSave(absence.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Enregistrer"
                          >
                            <Check className="h-5 w-5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEdit(absence.id)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Modifier"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                        )}
                        <button
                          onClick={() => setShowDeleteConfirm(absence.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Supprimer"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AbsenceModal
        isOpen={isAbsenceModalOpen}
        onClose={() => setIsAbsenceModalOpen(false)}
        onSubmit={handleAbsenceSubmit}
      />

      <AbsenceExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
        totalAbsences={filteredAbsences.length}
      />

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirmer la suppression
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Êtes-vous sûr de vouloir supprimer cette absence ? Cette action est irréversible.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}