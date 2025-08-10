// src/services/auth.service.ts
import axios from 'axios';
import { LoginRequest, LoginResponse } from '@/models/auth.model';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/api';

export const loginAdmin = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(`${API_URL}/auth/login`, credentials);
  return response.data;
};

export const logoutAdmin = async (token: string) => {
  return axios.post(`${API_URL}/auth/logout`, null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
