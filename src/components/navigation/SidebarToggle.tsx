import React from 'react';
import { PanelLeft, PanelRightClose } from 'lucide-react';
import { ToggleButton } from './ToggleButton';

interface SidebarToggleProps {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
}

export default function SidebarToggle({ isVisible, setIsVisible }: SidebarToggleProps) {
  return (
    <div className="flex items-center space-x-2">
      <ToggleButton
        onClick={() => setIsVisible(true)}
        disabled={isVisible}
        title="Afficher le menu"
        icon={<PanelLeft className="h-5 w-5" />}
      />
      <ToggleButton
        onClick={() => setIsVisible(false)}
        disabled={!isVisible}
        title="Masquer le menu"
        icon={<PanelRightClose className="h-5 w-5" />}
      />
    </div>
  );
}