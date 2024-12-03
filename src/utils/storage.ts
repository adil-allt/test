import { saveAs } from 'file-saver';

const STORAGE_KEY = 'cabinet_medical_data';

interface StorageData {
  patients: any[];
  paiements: any[];
  rendezVous: any[];
  documents: any[];
  lastUpdate?: string;
}

export const saveToLocalStorage = (data: StorageData) => {
  try {
    const dataToSave = {
      ...data,
      lastUpdate: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des données:', error);
  }
};

export const loadFromLocalStorage = (): StorageData | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error);
    return null;
  }
};

export const exportData = (data: StorageData) => {
  try {
    const dataToExport = {
      ...data,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: 'application/json'
    });

    const fileName = `cabinet_medical_backup_${new Date().toISOString().split('T')[0]}.json`;
    saveAs(blob, fileName);
  } catch (error) {
    console.error('Erreur lors de l\'export des données:', error);
    alert('Une erreur est survenue lors de l\'export des données');
  }
};

export const importData = async (file: File): Promise<StorageData | null> => {
  try {
    const text = await file.text();
    const data = JSON.parse(text);
    
    // Validation basique des données
    if (!data.patients || !data.paiements || !data.rendezVous || !data.documents) {
      throw new Error('Format de fichier invalide');
    }

    return data;
  } catch (error) {
    console.error('Erreur lors de l\'import des données:', error);
    return null;
  }
};