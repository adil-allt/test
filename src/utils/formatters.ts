import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const formatters = {
  patientNumber: (number: string | undefined | null) => {
    if (!number) return '-';
    const numericPart = number.replace(/\D/g, '');
    return `P${numericPart.padStart(4, '0')}`;
  },

  patientName: (nom: string | undefined | null, prenom: string | undefined | null) => {
    const safeName = nom?.trim() || '';
    const safePrenom = prenom?.trim() || '';
    return `${safeName.toUpperCase()} ${safePrenom.charAt(0).toUpperCase()}${safePrenom.slice(1).toLowerCase()}`.trim();
  },

  phoneNumber: (phone: string | undefined | null) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length !== 10) return phone;
    return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
  },

  city: (city: string | undefined | null) => {
    if (!city) return '';
    return city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
  },

  cin: (cin: string | undefined | null) => {
    if (!cin) return '';
    const cleaned = cin.replace(/[^a-zA-Z0-9]/g, '');
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  },

  birthDate: (date: string | undefined | null) => {
    if (!date) return '';
    try {
      const parsedDate = new Date(date);
      return format(parsedDate, 'dd/MM/yyyy', { locale: fr });
    } catch {
      return date;
    }
  },

  amount: (amount: string | number | undefined | null) => {
    if (amount === undefined || amount === null) return '0,00 Dhs';
    const numAmount = typeof amount === 'string' ? parseFloat(amount.replace(',', '.')) : amount;
    return `${numAmount.toFixed(2).replace('.', ',')} Dhs`;
  },

  dateTime: (dateTime: string | undefined | null) => {
    if (!dateTime) return '';
    try {
      const date = new Date(dateTime);
      return format(date, 'dd/MM/yyyy HH:mm', { locale: fr });
    } catch {
      return dateTime;
    }
  },

  ficheNumber: (number: string | undefined | null): string => {
    if (!number) return '';
    
    // Si le numéro commence déjà par F, le retourner tel quel
    if (number.toUpperCase().startsWith('F')) {
      return number.toUpperCase();
    }
    
    // Sinon, ajouter le F au début
    const cleanedNumber = number.replace(/[^0-9-]/g, '');
    if (cleanedNumber.includes('-')) {
      return `F${cleanedNumber}`.toUpperCase();
    }
    
    return '';
  }
};

export const validateFormatters = {
  phoneNumber: (phone: string | undefined | null) => {
    if (!phone) return false;
    return /^\d{10}$/.test(phone.replace(/\D/g, ''));
  },

  cin: (cin: string | undefined | null) => {
    if (!cin) return false;
    return /^[A-Z][A-Z0-9]+$/.test(cin);
  },

  patientNumber: (number: string | undefined | null) => {
    if (!number) return false;
    return /^P\d{4}$/.test(number);
  }
};