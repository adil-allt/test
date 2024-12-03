import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { menuItems } from '../utils/menuItems';

export default function MenuButton() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { hasPermission } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-label="Menu principal"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1">
            {filteredItems.map((item, index) => {
              const Icon = item.icon;

              if (item.isSubmenu && item.submenu) {
                return (
                  <div key={index} className="px-4 py-2">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {item.label}
                    </div>
                    <div className="mt-1 space-y-1">
                      {item.submenu.map((subItem, subIndex) => {
                        const SubIcon = subItem.icon;
                        const isActive = location.pathname === subItem.path;

                        return (
                          <Link
                            key={subIndex}
                            to={subItem.path}
                            onClick={() => setIsOpen(false)}
                            className={`group flex items-center px-2 py-2 text-sm rounded-md ${
                              isActive
                                ? 'bg-indigo-100 text-indigo-700'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                          >
                            <SubIcon
                              className={`mr-3 h-4 w-4 ${
                                isActive
                                  ? 'text-indigo-700'
                                  : 'text-gray-400 group-hover:text-gray-500'
                              }`}
                            />
                            {subItem.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={index}
                  to={item.path || '#'}
                  onClick={() => setIsOpen(false)}
                  className={`group flex items-center px-4 py-2 text-sm ${
                    isActive
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon
                    className={`mr-3 h-4 w-4 ${
                      isActive
                        ? 'text-indigo-700'
                        : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}