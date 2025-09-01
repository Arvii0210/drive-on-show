import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';
import { loginAdmin, logoutAdmin } from '@/services/auth.service';
import { LoginResponse } from '@/models/auth.model';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  token: string | null;
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
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      localStorage.setItem('authToken', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('authToken');
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const formattedUsername = username.includes('@')
        ? username.trim().toLowerCase()
        : username.trim();

      const { token, admin } = await loginAdmin({ username: formattedUsername, password });

      const loggedInUser: User = { id: admin.id.toString(), username: admin.username };
      setUser(loggedInUser);
      setToken(token);
      localStorage.setItem('user', JSON.stringify(loggedInUser));

      console.log('✅ Login successful');
      return true;
    } catch (err) {
      console.error('❌ Login error:', err);
      return false;
    }
  };

  const logout = async () => {
    // Ask for confirmation first
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (!confirmLogout) return;

    try {
      // Clear local user data immediately
      setUser(null);
      setToken(null);
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      delete axios.defaults.headers.common['Authorization'];

      // Call API logout (non-blocking)
      if (token) {
        logoutAdmin(token).catch(err => console.error('Logout API failed:', err));
      }

      console.log('✅ Logged out successfully');

      // Redirect to login
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('❌ Logout process error:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
};
