import React from 'react';
import { PanelLeft, PanelRightClose } from 'lucide-react';

interface SidebarToggleButtonProps {
  isVisible: boolean;
  onToggle: () => void;
}

export function SidebarToggleButton({ isVisible, onToggle }: SidebarToggleButtonProps) {
  return (
    <button
      onClick={onToggle}
      className="fixed top-20 left-4 z-50 p-2 rounded-md bg-white shadow-lg border border-gray-200 hover:bg-gray-50 transition-all duration-300"
      title={isVisible ? "Masquer le menu" : "Afficher le menu"}
    >
      {isVisible ? (
        <PanelRightClose className="h-5 w-5 text-gray-600" />
      ) : (
        <PanelLeft className="h-5 w-5 text-gray-600" />
      )}
    </button>
  );
}