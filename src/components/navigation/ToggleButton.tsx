import React from 'react';

interface ToggleButtonProps {
  onClick: () => void;
  disabled: boolean;
  title: string;
  icon: React.ReactNode;
}

export function ToggleButton({ onClick, disabled, title, icon }: ToggleButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-md hover:bg-gray-100 transition-colors ${
        disabled ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600'
      }`}
      disabled={disabled}
      title={title}
    >
      {icon}
    </button>
  );
}