import { useState } from 'react';

export const useAppointmentValidation = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const validateAppointment = (data: {
    patient: string;
    contact: string;
    time: string;
    type: string;
    source: string;
  }) => {
    const newErrors: Record<string, string> = {};

    if (!data.patient.trim()) {
      newErrors.patient = 'Le nom du patient est requis';
    }

    if (!validatePhoneNumber(data.contact)) {
      newErrors.contact = 'Le numéro de téléphone doit contenir exactement 10 chiffres';
    }

    if (!data.time) {
      newErrors.time = 'L\'heure du rendez-vous est requise';
    }

    if (!data.type) {
      newErrors.type = 'Le type de rendez-vous est requis';
    }

    if (!data.source) {
      newErrors.source = 'La source du rendez-vous est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearErrors = () => {
    setErrors({});
  };

  return {
    errors,
    validateAppointment,
    clearErrors,
    validatePhoneNumber
  };
};