import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { UserRole } from '@/data/mockData';

interface User {
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  institution?: string;
  salutation?: string;
  mobileNumber?: string;
  designation?: string;
}

interface AuthContextType {
  user: User | null;
  role: UserRole;
  setRole: (role: UserRole) => void;
  login: (email: string, password: string, role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: Record<UserRole, User> = {
  admin: { name: 'Admin User', email: 'admin@conference.org', role: 'admin', institution: 'Conference Organization' },
  author: { name: 'Dr. Sarah Chen', email: 'sarah.chen@university.edu', role: 'author', institution: 'MIT' },
  reviewer: { name: 'Dr. James Wilson', email: 'jwilson@harvard.edu', role: 'reviewer', institution: 'Harvard University' },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRoleState] = useState<UserRole>('admin');

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    setUser(mockUsers[newRole]);
  };

  const login = (_email: string, _password: string, loginRole: UserRole) => {
    // Try to find user in localStorage for name
    const users = JSON.parse(localStorage.getItem('app_users') || '[]');
    const found = users.find((u: any) => u.email === _email);
    if (found) {
      setRoleState(found.role);
      setUser({ name: found.name, email: found.email, role: found.role, institution: found.institution });
    } else {
      setRole(loginRole);
    }
  };

  const logout = () => {
    setUser(null);
    try { localStorage.removeItem('admin_selected_event'); } catch { /* ignore */ }
  };

  return (
    <AuthContext.Provider value={{ user, role, setRole, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
