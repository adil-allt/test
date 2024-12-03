import * as XLSX from 'xlsx';

interface Column {
  id: string;
  label: string;
}

export const exportToExcel = (data: any[], filename: string, columns: Column[]) => {
  // Préparer les données pour l'export avec les labels traduits
  const exportData = data.map(item => {
    const translatedItem: any = {};
    Object.keys(item).forEach(key => {
      const column = columns.find(col => col.id === key);
      if (column) {
        translatedItem[column.label] = typeof item[key] === 'boolean' 
          ? (item[key] ? 'Oui' : 'Non')
          : item[key];
      }
    });
    return translatedItem;
  });

  // Créer un nouveau classeur
  const wb = XLSX.utils.book_new();
  
  // Convertir les données en feuille de calcul
  const ws = XLSX.utils.json_to_sheet(exportData);
  
  // Ajouter la feuille au classeur
  XLSX.utils.book_append_sheet(wb, ws, 'Facturations');
  
  // Générer le fichier Excel
  XLSX.writeFile(wb, `${filename}.xlsx`);
};