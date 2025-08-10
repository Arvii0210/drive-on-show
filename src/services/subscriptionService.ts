import { apiConfig } from '@/config/api';

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: 'monthly' | 'yearly';
  features: string[];
  isPopular?: boolean;
  downloadLimit?: number;
}

export interface UserSubscription {
  id: string;
  planId: string;
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  plan: SubscriptionPlan;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

function getAuthToken(): string | null {
  return localStorage.getItem('authToken');
}

async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getAuthToken();
  if (token) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }
  return fetch(url, options);
}

export const SubscriptionService = {
  async getPlans(): Promise<SubscriptionPlan[]> {
    try {
      const response = await fetchWithAuth(`${apiConfig.baseURL}/subscription/plans`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.plans || [];
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      return [];
    }
  },

  async getCurrentSubscription(): Promise<UserSubscription | null> {
    try {
      const response = await fetchWithAuth(`${apiConfig.baseURL}/subscription/current`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null; // No subscription found
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.subscription || null;
    } catch (error) {
      console.error('Error fetching current subscription:', error);
      return null;
    }
  },

  async subscribe(planId: string, paymentMethodId?: string): Promise<{ success: boolean; redirectUrl?: string; }> {
    try {
      const response = await fetchWithAuth(`${apiConfig.baseURL}/subscription/subscribe`, {
        method: 'POST',
        body: JSON.stringify({
          planId,
          paymentMethodId,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        redirectUrl: data.redirectUrl,
      };
    } catch (error) {
      console.error('Error subscribing:', error);
      return { success: false };
    }
  },

  async cancelSubscription(): Promise<{ success: boolean; }> {
    try {
      const response = await fetchWithAuth(`${apiConfig.baseURL}/subscription/cancel`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return { success: true };
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      return { success: false };
    }
  },

  async updateSubscription(planId: string): Promise<{ success: boolean; }> {
    try {
      const response = await fetchWithAuth(`${apiConfig.baseURL}/subscription/update`, {
        method: 'POST',
        body: JSON.stringify({ planId }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return { success: true };
    } catch (error) {
      console.error('Error updating subscription:', error);
      return { success: false };
    }
  },

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    try {
      const response = await fetchWithAuth(`${apiConfig.baseURL}/subscription/payment-methods`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.paymentMethods || [];
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      return [];
    }
  },

  async addPaymentMethod(paymentMethodData: any): Promise<{ success: boolean; paymentMethod?: PaymentMethod; }> {
    try {
      const response = await fetchWithAuth(`${apiConfig.baseURL}/subscription/payment-methods`, {
        method: 'POST',
        body: JSON.stringify(paymentMethodData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        paymentMethod: data.paymentMethod,
      };
    } catch (error) {
      console.error('Error adding payment method:', error);
      return { success: false };
    }
  },

  async deletePaymentMethod(paymentMethodId: string): Promise<{ success: boolean; }> {
    try {
      const response = await fetchWithAuth(`${apiConfig.baseURL}/subscription/payment-methods/${paymentMethodId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting payment method:', error);
      return { success: false };
    }
  },

  async getBillingHistory(): Promise<any[]> {
    try {
      const response = await fetchWithAuth(`${apiConfig.baseURL}/subscription/billing-history`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.invoices || [];
    } catch (error) {
      console.error('Error fetching billing history:', error);
      return [];
    }
  },
};