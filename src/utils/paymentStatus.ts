import { PaymentStatus } from '../types/payment';

export const PAYMENT_STATUSES = {
  PAID: 'Payé',
  UNPAID: 'Non payé',
  PENDING: 'En attente'
} as const;

export function calculateReduction(amount: number): number {
  if (amount >= 400) return 0;
  return Math.round(((400 - amount) / 400) * 100);
}

export function getPaymentStatus(amount: string | undefined): string {
  if (!amount) return PAYMENT_STATUSES.PENDING;
  
  const numAmount = parseFloat(amount.replace(',', '.'));
  
  if (numAmount === 0) {
    return PAYMENT_STATUSES.UNPAID;
  }

  if (numAmount > 0) {
    const reduction = calculateReduction(numAmount);
    return reduction > 0 ? `${PAYMENT_STATUSES.PAID} - Réduction ${reduction}%` : PAYMENT_STATUSES.PAID;
  }

  return PAYMENT_STATUSES.UNPAID;
}

export function getAvailableStatuses(amount: string | undefined): PaymentStatus[] {
  const numAmount = amount ? parseFloat(amount.replace(',', '.')) : 0;
  
  if (numAmount === 0) {
    return [PAYMENT_STATUSES.UNPAID];
     return [PAYMENT_STATUSES.PENDING];
  }
  
  return [PAYMENT_STATUSES.PAID];
}

export function getStatusColor(status: string): string {
  if (status === PAYMENT_STATUSES.PAID) {
    return 'bg-gradient-to-r from-green-800 to-green-700 text-white';
  }
  if (status.startsWith(PAYMENT_STATUSES.PAID)) {
    return 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white';
  }
  if (status === PAYMENT_STATUSES.UNPAID) {
    return 'bg-gradient-to-r from-red-600 to-red-500 text-white';
  }
  return 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-white';
}