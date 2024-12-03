export type PaymentStatus = 'Payé' | 'Non payé' | 'En attente';

export type ConsultationType =
  | 'Suivi'
  | 'Thérapie'
  | 'Nouvelle consultation'
  | 'Visio'
  | 'Délégué'
  | 'Gratuité'
  | 'Contrôle'
  | 'Non payé'
  | 'Clinique'
  | 'Autre';

export interface PaymentData {
  amount: string;
  status: PaymentStatus;
  paymentMethod: string;
  type?: ConsultationType;
}

export const CONSULTATION_TYPES: ConsultationType[] = [
  'Suivi',
  'Thérapie',
  'Nouvelle consultation',
  'Visio',
  'Délégué',
  'Gratuité',
  'Contrôle',
  'Non payé',
  'Clinique',
  'Autre'
];