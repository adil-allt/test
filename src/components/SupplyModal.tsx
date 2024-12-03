import React, { useState } from 'react';
import { Package } from 'lucide-react';
import DraggableModal from './DraggableModal';

interface SupplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (supplyData: any) => void;
}

const presetSupplies = [
  { item: 'Papier d\'impression A4', prix: '45,00', typePaiement: 'Carte Bancaire', taxe: 'TTC' },
  { item: 'Stylos (lot de 10)', prix: '12,50', typePaiement: 'Espèces', taxe: 'TTC' },
  { item: 'Cartouches d\'encre', prix: '85,00', typePaiement: 'Carte Bancaire', taxe: 'TTC' },
  { item: 'Classeurs', prix: '25,00', typePaiement: 'Espèces', taxe: 'TTC' },
  { item: 'Post-it', prix: '8,50', typePaiement: 'Espèces', taxe: 'TTC' },
  { item: 'Chemises cartonnées (lot de 50)', prix: '15,00', typePaiement: 'Carte Bancaire', taxe: 'TTC' },
  { item: 'Agrafeuse', prix: '18,00', typePaiement: 'Espèces', taxe: 'TTC' },
  { item: 'Agrafes (boîte)', prix: '3,50', typePaiement: 'Espèces', taxe: 'TTC' },
  { item: 'Trombones (boîte)', prix: '2,50', typePaiement: 'Espèces', taxe: 'TTC' },
  { item: 'Cahier de notes', prix: '4,50', typePaiement: 'Espèces', taxe: 'TTC' }
];

export default function SupplyModal({ isOpen, onClose, onSubmit }: SupplyModalProps) {
  const [supply, setSupply] = useState({
    item: '',
    dateAchat: new Date().toISOString().split('T')[0],
    facture: false,
    prix: '',
    typePaiement: 'Carte Bancaire',
    taxe: 'TTC'
  });

  const handlePresetSelect = (preset: any) => {
    setSupply({
      ...supply,
      item: preset.item,
      prix: preset.prix,
      typePaiement: preset.typePaiement,
      taxe: preset.taxe
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...supply,
      id: Date.now().toString(),
      prix: supply.prix.includes(',') ? supply.prix : `${supply.prix},00`
    });
    setSupply({
      item: '',
      dateAchat: new Date().toISOString().split('T')[0],
      facture: false,
      prix: '',
      typePaiement: 'Carte Bancaire',
      taxe: 'TTC'
    });
  };

  return (
    <DraggableModal
      isOpen={isOpen}
      onClose={onClose}
      title="Nouvelle fourniture"
      className="w-full max-w-md"
    >
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sélectionner une fourniture prédéfinie
        </label>
        <select
          onChange={(e) => {
            const preset = presetSupplies[parseInt(e.target.value)];
            if (preset) handlePresetSelect(preset);
          }}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          defaultValue=""
        >
          <option value="" disabled>Sélectionner une fourniture...</option>
          {presetSupplies.map((preset, index) => (
            <option key={index} value={index}>
              {preset.item} - {preset.prix} Dhs
            </option>
          ))}
        </select>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            <div className="flex items-center">
              <Package className="h-4 w-4 mr-2" />
              Article
            </div>
          </label>
          <input
            type="text"
            value={supply.item}
            onChange={(e) => setSupply({...supply, item: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Date d'achat</label>
          <input
            type="date"
            value={supply.dateAchat}
            onChange={(e) => setSupply({...supply, dateAchat: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={supply.facture}
              onChange={(e) => setSupply({...supply, facture: e.target.checked})}
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <span className="text-sm font-medium text-gray-700">Facture disponible</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Prix (Dhs)</label>
          <input
            type="text"
            value={supply.prix}
            onChange={(e) => setSupply({...supply, prix: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
            placeholder="0,00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Type de paiement</label>
          <select
            value={supply.typePaiement}
            onChange={(e) => setSupply({...supply, typePaiement: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option>Carte Bancaire</option>
            <option>Espèces</option>
            <option>Virement</option>
            <option>Chèque</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Taxe</label>
          <select
            value={supply.taxe}
            onChange={(e) => setSupply({...supply, taxe: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option>TTC</option>
            <option>HT</option>
          </select>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Enregistrer
          </button>
        </div>
      </form>
    </DraggableModal>
  );
}