import axios from 'axios';
import { LoginRequest, LoginResponse } from '@/models/auth.model';

const API_URL = 'http://localhost:3000/api';

export const loginAdmin = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await axios.post<{ data: LoginResponse }>(`${API_URL}/auth/login`, credentials);
  return response.data.data; // unwrap "data"
};

export const logoutAdmin = async (token: string) => {
  return axios.post(`${API_URL}/auth/logout`, null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
