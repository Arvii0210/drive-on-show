import type { UserRole } from '@/data/mockData';

const delay = (ms = 500) => new Promise(r => setTimeout(r, ms));

export interface UserProfile {
  name: string;
  email: string;
  role: UserRole;
  institution?: string;
  department?: string;
  avatar?: string;
}

export const login = async (email: string, password: string, role: UserRole): Promise<UserProfile> => {
  await delay(600);
  return { name: 'Mock User', email, role };
};

export const register = async (data: Partial<UserProfile> & { password: string }): Promise<UserProfile> => {
  await delay(800);
  return { name: data.name || '', email: data.email || '', role: data.role || 'author' };
};

export const getProfile = async (): Promise<UserProfile> => {
  await delay(300);
  return { name: 'Mock User', email: 'user@example.com', role: 'author' };
};

export const updateProfile = async (data: Partial<UserProfile>): Promise<UserProfile> => {
  await delay(500);
  return { name: 'Mock User', email: 'user@example.com', role: 'author', ...data };
};
