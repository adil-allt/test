import React from 'react';
import { Download } from 'lucide-react';

interface ExportButtonProps {
  onExport: () => void;
  disabled?: boolean;
}

export default function ExportButton({ onExport, disabled }: ExportButtonProps) {
  return (
    <button
      onClick={onExport}
      disabled={disabled}
      className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${
        disabled
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-green-600 text-white hover:bg-green-700'
      }`}
    >
      <Download className="h-5 w-5 mr-2" />
      Exporter les notifications
    </button>
  );
}