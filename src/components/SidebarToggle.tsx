import React from 'react';
import { PanelLeft, PanelRightClose } from 'lucide-react';

interface SidebarToggleProps {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
}

export default function SidebarToggle({ isVisible, setIsVisible }: SidebarToggleProps) {
  const handleShowSidebar = () => {
    setIsVisible(true);
  };

  const handleHideSidebar = () => {
    setIsVisible(false);
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={handleShowSidebar}
        className={`p-2 rounded-md hover:bg-gray-100 transition-colors ${
          isVisible ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600'
        }`}
        disabled={isVisible}
        title="Afficher le menu"
      >
        <PanelLeft className="h-5 w-5" />
      </button>
      <button
        onClick={handleHideSidebar}
        className={`p-2 rounded-md hover:bg-gray-100 transition-colors ${
          !isVisible ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600'
        }`}
        disabled={!isVisible}
        title="Masquer le menu"
      >
        <PanelRightClose className="h-5 w-5" />
      </button>
    </div>
  );
}