// src/config/apiConfig.ts

type ApiConfig = {
  BASE_URL: string;
  AUTH: string;
  SUBSCRIPTION: string;
  SUBSCRIPTION_PLANS: string;
  DOWNLOADS: string;
  ASSETS: string;
  CATEGORIES: string;
};

// Environment mode
const isProduction = import.meta.env.PROD;
const environment = import.meta.env.MODE;

// Base URL resolution
const VITE_API_URL = import.meta.env.VITE_API_URL;
const FALLBACK_API_URL = isProduction
  ? 'https://api.mysite.com/api'
  : 'http://localhost:3000/api';

const BASE_URL = VITE_API_URL || FALLBACK_API_URL;

// API Endpoints
export const API_CONFIG: ApiConfig = {
  BASE_URL,
  AUTH: `${BASE_URL}/user/auth`,
  SUBSCRIPTION: `${BASE_URL}/subscription`,
  SUBSCRIPTION_PLANS: `${BASE_URL}/subscription-plans`,
  DOWNLOADS: `${BASE_URL}/downloads`,
  ASSETS: `${BASE_URL}/asset`,
  CATEGORIES: `${BASE_URL}`,
};

// Helper to debug current environment config
export const getCurrentApiConfig = () => ({
  environment,
  isProduction,
  viteApiUrl: VITE_API_URL,
  resolvedBaseUrl: BASE_URL,
});
