import React from 'react';
import { usePayment } from '../contexts/PaymentContext';
import { PaymentData } from '../types/payment';
import { getAvailableStatuses, getStatusColor } from '../utils/paymentStatus';

interface PaymentStatusSelectProps {
  appointmentId: string;
  currentAmount: string;
  currentStatus: string;
  currentPaymentMethod: string;
  isEditing: boolean;
  onUpdate: (values: PaymentData) => void;
}

export default function PaymentStatusSelect({
  appointmentId,
  currentAmount,
  currentStatus,
  currentPaymentMethod,
  isEditing,
  onUpdate
}: PaymentStatusSelectProps) {
  const { updatePaymentStatus } = usePayment();

  const handleUpdate = (values: PaymentData) => {
    updatePaymentStatus(appointmentId, values);
    onUpdate(values);
  };

  if (!isEditing) {
    return (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
        getStatusColor(currentStatus)
      }`}>
        {currentStatus}
      </span>
    );
  }

  const numAmount = parseFloat(currentAmount.replace(',', '.'));
  const showPaymentMethod = numAmount > 0;

  return (
    <div className="space-y-2">
      <input
        type="text"
        value={currentAmount}
        onChange={(e) => handleUpdate({
          amount: e.target.value,
          status: currentStatus,
          paymentMethod: currentPaymentMethod
        })}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        placeholder="0,00"
      />
      
      {numAmount === 0 && (
        <select
          value={currentStatus}
          onChange={(e) => handleUpdate({
            amount: currentAmount,
            status: e.target.value,
            paymentMethod: currentPaymentMethod
          })}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          {getAvailableStatuses(currentAmount).map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      )}

      {showPaymentMethod && (
        <select
          value={currentPaymentMethod}
          onChange={(e) => handleUpdate({
            amount: currentAmount,
            status: currentStatus,
            paymentMethod: e.target.value
          })}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="Carte Bancaire">Carte Bancaire</option>
          <option value="Espèces">Espèces</option>
          <option value="Virement">Virement</option>
          <option value="Chèque">Chèque</option>
          <option value="-">-</option>
        </select>
      )}
    </div>
  );
}