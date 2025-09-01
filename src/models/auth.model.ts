// src/models/auth.model.ts

export interface Admin {
  id: number;
  username: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  admin: Admin;
}
