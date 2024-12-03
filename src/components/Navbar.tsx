import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, UserCircle, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ReminderBadge from './ReminderBadge';
import ReminderList from './ReminderList';
import MenuButton from './MenuButton';

export default function Navbar() {
  const [showReminders, setShowReminders] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-4">
            <MenuButton />
            <h1 className="text-xl font-semibold text-gray-900 truncate">
              Cabinet de Psychiatrie
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setShowReminders(!showReminders)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <ReminderBadge />
            </button>
            <div className="relative flex items-center space-x-4">
              <div className="hidden sm:flex items-center">
                <UserCircle className="h-8 w-8 text-gray-400" />
                <span className="ml-2 text-sm font-medium text-gray-700">
                  {user?.name} ({user?.role})
                </span>
              </div>
              <button
                onClick={logout}
                className="flex items-center text-gray-500 hover:text-gray-700"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {showReminders && (
        <div className="absolute right-4 mt-2 w-96 bg-white rounded-lg shadow-lg z-50">
          <ReminderList />
        </div>
      )}
    </nav>
  );
}