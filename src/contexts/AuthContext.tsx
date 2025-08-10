// src/contexts/AuthContext.tsx

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';
import { LoginResponse } from '@/models/auth.model';

interface User {
  id: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  token: string | null; // optional: helpful if you want to access token elsewhere
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState<string | null>(() => localStorage.getItem('authToken'));

  // Automatically apply token to axios and localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('authToken', token); // ✅ consistently using 'authToken'
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('💾 Token stored in localStorage and axios');
    } else {
      localStorage.removeItem('authToken');
      delete axios.defaults.headers.common['Authorization'];
      console.log('🧹 Token removed from localStorage and axios');
    }
  }, [token]);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post<{ data: LoginResponse }>(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'}/auth/login`,
        { username, password }
      );

      const { token, admin } = response.data.data;

      const loggedInUser: User = { id: admin.id.toString(), username: admin.username };

      setUser(loggedInUser);
      setToken(token);

      // Save user
      localStorage.setItem('user', JSON.stringify(loggedInUser));

      console.log('✅ Login successful');
      return true;
    } catch (err) {
      console.error('❌ Login error:', err);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    delete axios.defaults.headers.common['Authorization'];
    console.log('👋 Logged out');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
};
