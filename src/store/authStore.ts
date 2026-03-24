import { create } from 'zustand';
import type { UserRole } from '@/data/mockData';

interface User {
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  institution?: string;
}

interface AuthState {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setRole: (role: UserRole) => void;
}

const mockUsers: Record<UserRole, User> = {
  admin: { name: 'Admin User', email: 'admin@conference.org', role: 'admin', institution: 'Conference Organization' },
  author: { name: 'Dr. Sarah Chen', email: 'sarah.chen@university.edu', role: 'author', institution: 'MIT' },
  reviewer: { name: 'Dr. James Wilson', email: 'jwilson@harvard.edu', role: 'reviewer', institution: 'Harvard University' },
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: 'admin',
  isAuthenticated: false,

  login: (_email, _password, role) =>
    set({ user: mockUsers[role], role, isAuthenticated: true }),

  logout: () =>
    set({ user: null, isAuthenticated: false }),

  setUser: (user) =>
    set({ user }),

  setRole: (role) =>
    set({ user: mockUsers[role], role }),
}));
