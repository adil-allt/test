import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { menuItems } from '../../utils/menuItems';
import { MenuItem } from './MenuItem';

interface MenuItemsProps {
  onItemClick: () => void;
}

export function MenuItems({ onItemClick }: MenuItemsProps) {
  const location = useLocation();
  const { hasPermission } = useAuth();

  const filteredItems = menuItems.filter(item => {
    if (item.permissions) {
      return item.permissions.some(permission => hasPermission(permission));
    }
    if (item.submenu) {
      return item.submenu.some(subItem => 
        subItem.permissions.some(permission => hasPermission(permission))
      );
    }
    return true;
  });

  return (
    <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
      <div className="py-1">
        {filteredItems.map((item, index) => (
          <MenuItem 
            key={index}
            item={item}
            isActive={location.pathname === item.path}
            onClick={onItemClick}
          />
        ))}
      </div>
    </div>
  );
}