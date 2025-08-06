import axios from "axios";
import { API_CONFIG } from "../config/api";

const API_BASE = API_CONFIG.AUTH;

export const signup = (data: { name: string; email: string; password: string }) =>
  axios.post(`${API_BASE}/signup`, data);

export const verifyOtp = (data: { userId: number; otp: string }) =>
  axios.post(`${API_BASE}/verify-otp`, data);

export const loginWithEmail = (data: { email: string; password: string }) =>
  axios.post(`${API_BASE}/email`, data);

export const googleLogin = () => {
  window.location.href = `${API_BASE}/google`;
};
