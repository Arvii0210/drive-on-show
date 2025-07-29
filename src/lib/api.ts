// API client for backend integration
import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("pextee-user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;

// ============ SUBSCRIPTION API ============
export const subscriptionAPI = {
  // Get all subscription plans
  getPlans: () => api.get("/subscription/plans"),
  
  // Get plan by ID
  getPlanById: (id: string) => api.get(`/subscription/plans/${id}`),
  
  // Create new subscription
  createSubscription: (planId: string) => api.post("/subscription", { planId }),
  
  // Get user's current subscription
  getCurrentSubscription: () => api.get("/subscription/me"),
  
  // Get user subscription stats
  getUserStats: (userId: string) => api.get(`/subscription/user/${userId}/stats`),
  
  // Cancel subscription
  cancelSubscription: (id: string) => api.patch(`/subscription/${id}/cancel`),
  
  // Check download eligibility
  checkDownloadEligibility: (assetId: string) => 
    api.get(`/subscription/can-download/${assetId}`),
};

// ============ DOWNLOAD API ============
export const downloadAPI = {
  // Check if user can download asset
  checkEligibility: (assetId: string) => 
    api.get(`/download/check-eligibility?assetId=${assetId}`),
  
  // Record a download
  recordDownload: (data: { userId: string; assetId: string; type: "standard" | "premium" }) =>
    api.post("/download/record", data),
  
  // Get user download history
  getUserDownloads: (userId: string) => api.get(`/download/user/${userId}`),
};

// ============ AUTH API ============
export const authAPI = {
  login: (email: string, password: string) =>
    api.post("/user/auth/email", { email, password }),
  
  register: (data: { name: string; email: string; password: string }) =>
    api.post("/user/auth/signup", data),
  
  verifyOtp: (data: { userId: number; otp: string }) =>
    api.post("/user/auth/verify-otp", data),
  
  googleLogin: () => {
    window.location.href = `${API_BASE_URL}/user/auth/google`;
  },
};

// ============ ASSETS API ============
export const assetsAPI = {
  getAssets: (params?: any) => api.get("/assets", { params }),
  getAssetById: (id: string) => api.get(`/assets/${id}`),
  searchAssets: (query: string, filters?: any) => 
    api.get(`/assets/search?q=${query}`, { params: filters }),
};