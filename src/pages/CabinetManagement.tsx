import React, { useState, useMemo } from 'react';
import { Package, Search, Plus, Calendar, Edit, Trash2, Check, Download } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { testSupplies } from '../data/testData';
import SupplyModal from '../components/SupplyModal';
import SupplyExportModal from '../components/SupplyExportModal';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function CabinetManagement() {
  const { hasPermission } = useAuth();
  const [isSupplyModalOpen, setIsSupplyModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [editingSupply, setEditingSupply] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [supplies, setSupplies] = useState(testSupplies);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{
    [key: string]: {
      item: string;
      prix: string;
      typePaiement: string;
      taxe: string;
      facture: boolean;
    };
  }>({});

  const handleEdit = (supplyId: string) => {
    const supply = supplies.find(s => s.id === supplyId);
    if (supply) {
      setEditingSupply(supplyId);
      setEditValues({
        [supplyId]: {
          item: supply.item,
          prix: supply.prix,
          typePaiement: supply.typePaiement,
          taxe: supply.taxe,
          facture: supply.facture
        }
      });
    }
  };

  const handleSave = (supplyId: string) => {
    const editValue = editValues[supplyId];
    if (editValue) {
      setSupplies(prev => prev.map(supply => 
        supply.id === supplyId ? { ...supply, ...editValue } : supply
      ));
      setEditingSupply(null);
    }
  };

  const handleDelete = (id: string) => {
    setSupplies(prev => prev.filter(supply => supply.id !== id));
    setShowDeleteConfirm(null);
  };

  const handleSupplySubmit = (supplyData: any) => {
    setSupplies(prev => [...prev, { ...supplyData, id: Date.now().toString() }]);
    setIsSupplyModalOpen(false);
  };

  const handleExport = (exportDateRange: { startDate: string; endDate: string }) => {
    const dataToExport = filteredSupplies
      .filter(supply => {
        if (!exportDateRange.startDate || !exportDateRange.endDate) return true;
        
        const [day, month, year] = supply.dateAchat.split('/');
        const supplyDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        const start = new Date(exportDateRange.startDate);
        const end = new Date(exportDateRange.endDate);
        
        return supplyDate >= start && supplyDate <= end;
      })
      .map(supply => ({
        'Article': supply.item,
        'Date d\'achat': supply.dateAchat,
        'Facture': supply.facture ? 'Oui' : 'Non',
        'Prix (Dhs)': supply.prix,
        'Type de paiement': supply.typePaiement,
        'Taxe': supply.taxe
      }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    XLSX.utils.book_append_sheet(wb, ws, 'Fournitures');

    const startDateStr = exportDateRange.startDate ? format(new Date(exportDateRange.startDate), 'dd-MM', { locale: fr }) : '';
    const endDateStr = exportDateRange.endDate ? format(new Date(exportDateRange.endDate), 'dd-MM', { locale: fr }) : '';
    const currentDate = format(new Date(), 'dd-MM-yyyy', { locale: fr });
    
    let fileName = 'fournitures';
    if (startDateStr && endDateStr) {
      fileName = `fournitures_du_${startDateStr}_au_${endDateStr}_le_${currentDate}`;
    } else {
      fileName = `fournitures_le_${currentDate}`;
    }

    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  const filteredSupplies = useMemo(() => {
    return supplies.filter(supply => {
      const searchTerms = searchTerm.toLowerCase().split(' ');
      
      return searchTerms.every(term => {
        if (term.startsWith('*') && term.endsWith('*')) {
          const searchPattern = term.slice(1, -1).toLowerCase();
          if (searchPattern) {
            const searchableContent = [
              supply.item,
              supply.prix,
              supply.typePaiement,
              supply.taxe,
              supply.facture ? 'avec facture' : 'sans facture'
            ]
              .filter(Boolean)
              .join(' ')
              .toLowerCase();

            return searchableContent.includes(searchPattern);
          }
          return true;
        }

        const searchableContent = [
          supply.item,
          supply.prix,
          supply.typePaiement,
          supply.taxe,
          supply.facture ? 'avec facture' : 'sans facture'
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        return searchableContent.includes(term);
      });
      
      if (!dateRange.startDate || !dateRange.endDate) return true;

      const [day, month, year] = supply.dateAchat.split('/');
      const supplyDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      const start = new Date(dateRange.startDate);
      const end = new Date(dateRange.endDate);
      
      return supplyDate >= start && supplyDate <= end;
    });
  }, [supplies, searchTerm, dateRange]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Fournitures</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <Download className="h-5 w-5 mr-2" />
            Exporter
          </button>
          <button 
            onClick={() => setIsSupplyModalOpen(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nouvelle fourniture
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Rechercher une fourniture (utilisez * pour une recherche partielle)"
              />
            </div>
            <div className="flex items-center space-x-2 ml-4">
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
                  Article
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date d'achat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Facture
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix (Dhs)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type de paiement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Taxe
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSupplies.map((supply) => {
                const isEditing = editingSupply === supply.id;
                const editValue = editValues[supply.id] || {
                  item: supply.item,
                  prix: supply.prix,
                  typePaiement: supply.typePaiement,
                  taxe: supply.taxe,
                  facture: supply.facture
                };

                return (
                  <tr key={supply.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editValue.item}
                          onChange={(e) => setEditValues({
                            ...editValues,
                            [supply.id]: { ...editValue, item: e.target.value }
                          })}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      ) : (
                        <div className="flex items-center">
                          <Package className="h-5 w-5 text-gray-400 mr-2" />
                          <div className="text-sm font-medium text-gray-900">
                            {supply.item}
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {supply.dateAchat}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <select
                          value={editValue.facture ? 'true' : 'false'}
                          onChange={(e) => setEditValues({
                            ...editValues,
                            [supply.id]: { ...editValue, facture: e.target.value === 'true' }
                          })}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          <option value="true">Oui</option>
                          <option value="false">Non</option>
                        </select>
                      ) : (
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          supply.facture
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {supply.facture ? 'Oui' : 'Non'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editValue.prix}
                          onChange={(e) => setEditValues({
                            ...editValues,
                            [supply.id]: { ...editValue, prix: e.target.value }
                          })}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      ) : (
                        <span className="text-sm text-gray-900">{supply.prix}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <select
                          value={editValue.typePaiement}
                          onChange={(e) => setEditValues({
                            ...editValues,
                            [supply.id]: { ...editValue, typePaiement: e.target.value }
                          })}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          <option>Carte Bancaire</option>
                          <option>Espèces</option>
                          <option>Virement</option>
                          <option>Chèque</option>
                        </select>
                      ) : (
                        <span className="text-sm text-gray-500">{supply.typePaiement}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <select
                          value={editValue.taxe}
                          onChange={(e) => setEditValues({
                            ...editValues,
                            [supply.id]: { ...editValue, taxe: e.target.value }
                          })}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          <option>TTC</option>
                          <option>HT</option>
                        </select>
                      ) : (
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          supply.taxe === 'TTC'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {supply.taxe}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-3">
                        {isEditing ? (
                          <button
                            onClick={() => handleSave(supply.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Enregistrer"
                          >
                            <Check className="h-5 w-5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEdit(supply.id)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Modifier"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                        )}
                        <button
                          onClick={() => setShowDeleteConfirm(supply.id)}
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

      <SupplyModal
        isOpen={isSupplyModalOpen}
        onClose={() => setIsSupplyModalOpen(false)}
        onSubmit={handleSupplySubmit}
      />

      <SupplyExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
        totalSupplies={filteredSupplies.length}
      />

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirmer la suppression
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Êtes-vous sûr de vouloir supprimer cette fourniture ? Cette action est irréversible.
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