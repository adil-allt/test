import React from 'react';
import { formatters } from '../utils/formatters';
import { User, Phone, MapPin, CreditCard, Calendar } from 'lucide-react';

interface PatientInfoDisplayProps {
  patient: {
    numeroPatient: string;
    nom: string;
    prenom: string;
    telephone: string;
    ville: string;
    cin: string;
    dateNaissance: string;
    mutuelle?: {
      active: boolean;
      nom: string;
    };
  };
  compact?: boolean;
}

export default function PatientInfoDisplay({ patient, compact = false }: PatientInfoDisplayProps) {
  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-gray-500">{formatters.patientNumber(patient.numeroPatient)}</span>
        <span className="font-medium">
          {formatters.patientName(patient.nom, patient.prenom)}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <User className="h-4 w-4 text-gray-400" />
        <span className="font-medium">
          {formatters.patientNumber(patient.numeroPatient)} - {formatters.patientName(patient.nom, patient.prenom)}
        </span>
      </div>
      
      <div className="flex items-center space-x-2">
        <Phone className="h-4 w-4 text-gray-400" />
        <span>{formatters.phoneNumber(patient.telephone)}</span>
      </div>
      
      <div className="flex items-center space-x-2">
        <MapPin className="h-4 w-4 text-gray-400" />
        <span>{formatters.city(patient.ville)}</span>
      </div>
      
      <div className="flex items-center space-x-2">
        <CreditCard className="h-4 w-4 text-gray-400" />
        <span>{formatters.cin(patient.cin)}</span>
      </div>
      
      <div className="flex items-center space-x-2">
        <Calendar className="h-4 w-4 text-gray-400" />
        <span>{formatters.birthDate(patient.dateNaissance)}</span>
      </div>

      {patient.mutuelle && (
        <div className="mt-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            patient.mutuelle.active 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {patient.mutuelle.active ? `Mutuelle: ${patient.mutuelle.nom}` : 'Sans mutuelle'}
          </span>
        </div>
      )}
    </div>
  );
}