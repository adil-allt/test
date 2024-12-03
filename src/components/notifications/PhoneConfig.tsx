import React from 'react';
import { Phone } from 'lucide-react';

interface PhoneConfigProps {
  phone: string;
  onPhoneChange: (phone: string) => void;
}

export default function PhoneConfig({ phone, onPhoneChange }: PhoneConfigProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        <div className="flex items-center space-x-2">
          <Phone className="h-4 w-4" />
          <span>Numéro de téléphone pour l'envoi</span>
        </div>
      </label>
      <input
        type="tel"
        value={phone}
        onChange={(e) => onPhoneChange(e.target.value)}
        placeholder="+212600000000"
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
      />
      <p className="text-xs text-gray-500">
        Format international requis (ex: +212600000000)
      </p>
    </div>
  );
}