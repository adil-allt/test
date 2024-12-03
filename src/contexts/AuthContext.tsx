import React, { createContext, useContext, useState, useEffect } from 'react';

type Role = 'admin' | 'docteur' | 'secretaire';

interface User {
  id: string;
  username: string;
  role: Role;
  name: string;
  failedAttempts?: number;
  isBlocked?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  resetFailedAttempts: (userId: string) => void;
  blockUser: (userId: string) => void;
  unblockUser: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthUser {
  id: string;
  username: string;
  password: string;
  role: Role;
  name: string;
  failedAttempts: number;
  isBlocked: boolean;
}

const USERS: AuthUser[] = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    name: 'Administrateur',
    failedAttempts: 0,
    isBlocked: false
  },
  {
    id: '2',
    username: 'docteur',
    password: 'docteur123',
    role: 'docteur',
    name: 'Dr. Martin',
    failedAttempts: 0,
    isBlocked: false
  },
  {
    id: '3',
    username: 'secretaire',
    password: 'secretaire123',
    role: 'secretaire',
    name: 'Marie Secrétaire',
    failedAttempts: 0,
    isBlocked: false
  }
];

const MAX_LOGIN_ATTEMPTS = 5;

const PERMISSIONS: { [key in Role]: string[] } = {
  admin: [
    'view_dashboard',
    'manage_users',
    'reset_passwords',
    'block_users',
    'view_user_passwords',
    'view_appointments',
    'edit_appointments',
    'view_patients',
    'edit_patients',
    'view_billing',
    'edit_billing',
    'export_data',
    'view_treatments',
    'edit_treatments',
    'view_supplies',
    'edit_supplies',
    'delete_patients',
    'delete_appointments',
    'delete_treatments'
  ],
  docteur: [
    'view_dashboard',
    'view_appointments',
    'edit_appointments',
    'view_patients',
    'edit_patients',
    'view_billing',
    'edit_billing',
    'export_data',
    'view_treatments',
    'edit_treatments',
    'view_supplies',
    'edit_supplies',
    'delete_patients',
    'delete_appointments',
    'delete_treatments'
  ],
  secretaire: [
    'view_appointments',
    'edit_appointments',
    'view_patients',
    'edit_patients',
    'view_billing',
    'edit_billing',
    'view_supplies',
    'edit_supplies'
  ]
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<AuthUser[]>(USERS);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (username: string, password: string) => {
    const foundUser = users.find(u => u.username === username);
    
    if (!foundUser || foundUser.isBlocked) {
      throw new Error('Invalid credentials or account blocked');
    }

    if (foundUser.password !== password) {
      const updatedUsers = users.map(u => {
        if (u.id === foundUser.id) {
          const newAttempts = u.failedAttempts + 1;
          const isBlocked = newAttempts >= MAX_LOGIN_ATTEMPTS;
          return { ...u, failedAttempts: newAttempts, isBlocked };
        }
        return u;
      });
      setUsers(updatedUsers);
      throw new Error('Invalid credentials');
    }

    const { password: _, failedAttempts, isBlocked, ...userWithoutPassword } = foundUser;
    setUser(userWithoutPassword);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));

    // Reset failed attempts on successful login
    if (foundUser.failedAttempts > 0) {
      const updatedUsers = users.map(u => 
        u.id === foundUser.id ? { ...u, failedAttempts: 0 } : u
      );
      setUsers(updatedUsers);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const hasPermission = (permission: string) => {
    if (!user) return false;
    return PERMISSIONS[user.role].includes(permission);
  };

  const resetFailedAttempts = (userId: string) => {
    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, failedAttempts: 0, isBlocked: false } : u
    );
    setUsers(updatedUsers);
  };

  const blockUser = (userId: string) => {
    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, isBlocked: true } : u
    );
    setUsers(updatedUsers);
  };

  const unblockUser = (userId: string) => {
    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, isBlocked: false, failedAttempts: 0 } : u
    );
    setUsers(updatedUsers);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      hasPermission,
      resetFailedAttempts,
      blockUser,
      unblockUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}