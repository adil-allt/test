import React, { useState, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import { MenuItems } from './MenuItems';

export default function MenuButton() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(menuRef, () => setIsOpen(false));

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-label="Menu principal"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {isOpen && <MenuItems onItemClick={() => setIsOpen(false)} />}
    </div>
  );
}