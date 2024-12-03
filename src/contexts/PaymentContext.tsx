import React, { createContext, useContext } from 'react';
import { useAppointments } from './AppointmentContext';
import { PaymentData, PaymentStatus } from '../types/payment';
import { getPaymentStatus, PAYMENT_STATUSES } from '../utils/paymentStatus';

interface PaymentContextType {
  updatePaymentStatus: (appointmentId: string, data: PaymentData) => void;
}

const PaymentContext = createContext<PaymentContextType | null>(null);

export function PaymentProvider({ children }: { children: React.ReactNode }) {
  const { updateAppointment } = useAppointments();

  const updatePaymentStatus = (appointmentId: string, data: PaymentData) => {
    const numAmount = parseFloat(data.amount.replace(',', '.'));
    let status = data.status;

    // Si le montant est supérieur à 0, forcer le statut "Payé"
    if (numAmount > 0) {
      status = getPaymentStatus(data.amount);
    }

    updateAppointment(appointmentId, {
      amount: data.amount,
      status,
      paymentMethod: numAmount === 0 ? '-' : data.paymentMethod,
      paid: status === PAYMENT_STATUSES.PAID || status.startsWith(PAYMENT_STATUSES.PAID)
    });
  };

  return (
    <PaymentContext.Provider value={{ updatePaymentStatus }}>
      {children}
    </PaymentContext.Provider>
  );
}

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};