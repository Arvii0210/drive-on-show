// API Configuration for different environments
const getApiBaseUrl = (): string => {
  // Check if VITE_API_URL is set (for production deployments)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Environment-based fallbacks
  if (import.meta.env.PROD) {
    // Production fallback
    return 'https://api.mysite.com/api';
  } else {
    // Development fallback
    return 'http://localhost:3000/api';
  }
};

export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  AUTH: `${getApiBaseUrl()}/user/auth`,
  SUBSCRIPTION: `${getApiBaseUrl()}/subscription`,
  SUBSCRIPTION_PLANS: `${getApiBaseUrl()}/subscription-plans`,
  DOWNLOADS: `${getApiBaseUrl()}/downloads`,
  ASSETS: `${getApiBaseUrl()}/asset`,
  CATEGORIES: `${getApiBaseUrl()}`,
} as const;

// Export for debugging
export const getCurrentApiConfig = () => ({
  baseUrl: API_CONFIG.BASE_URL,
  environment: import.meta.env.MODE,
  isProduction: import.meta.env.PROD,
  viteApiUrl: import.meta.env.VITE_API_URL,
});