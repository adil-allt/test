import { PaymentData } from '../types/payment';
import { getPaymentStatus, PAYMENT_STATUSES } from './paymentStatus';

export function formatAmount(amount: string | undefined): string {
  if (!amount) return '0,00';
  const numAmount = parseFloat(amount.replace(',', '.'));
  return numAmount.toFixed(2).replace('.', ',');
}

export function getPaymentMethod(amount: string, currentMethod: string): string {
  const numAmount = parseFloat(amount.replace(',', '.'));
  return numAmount === 0 ? '-' : currentMethod;
}

export function validatePaymentData(data: PaymentData): boolean {
  const numAmount = parseFloat(data.amount.replace(',', '.'));
  
  if (isNaN(numAmount)) return false;
  if (numAmount < 0) return false;
  
  if (numAmount === 0) {
    return [PAYMENT_STATUSES.UNPAID, PAYMENT_STATUSES.PENDING].includes(data.status);
  }
  
  return data.status === PAYMENT_STATUSES.PAID || data.status.startsWith(PAYMENT_STATUSES.PAID);
}

export function calculatePaymentSummary(payments: PaymentData[]): {
  total: number;
  paid: number;
  unpaid: number;
  pending: number;
} {
  return payments.reduce((acc, payment) => {
    const amount = parseFloat(payment.amount.replace(',', '.')) || 0;
    acc.total += amount;
    
    if (payment.status === PAYMENT_STATUSES.PAID || payment.status.startsWith(PAYMENT_STATUSES.PAID)) {
      acc.paid += amount;
    } else if (payment.status === PAYMENT_STATUSES.UNPAID) {
      acc.unpaid += amount;
    } else {
      acc.pending += amount;
    }
    
    return acc;
  }, {
    total: 0,
    paid: 0,
    unpaid: 0,
    pending: 0
  });
}