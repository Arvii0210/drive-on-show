import axios from "axios";

const API_BASE = "http://localhost:3000/api/user/auth";

export const signup = (data: { name: string; email: string; password: string }) =>
  axios.post(`${API_BASE}/signup`, data);

export const verifyOtp = (data: { userId: number; otp: string }) =>
  axios.post(`${API_BASE}/verify-otp`, data);

export const loginWithEmail = (data: { email: string; password: string }) =>
  axios.post(`${API_BASE}/email`, data);

export const googleLogin = () => {
  window.location.href = `${API_BASE}/google`;
};
