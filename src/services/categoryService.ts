import { apiConfig } from '@/config/api';

export interface Category {
  id: number;
  name: string;
  description?: string;
  slug: string;
  assetCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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

export const CategoryService = {
  async getCategories(): Promise<Category[]> {
    try {
      const response = await fetchWithAuth(`${apiConfig.baseURL}/categories`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.categories || [];
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to fetch categories');
    }
  },

  async getCategoryById(id: number): Promise<Category | null> {
    try {
      const response = await fetchWithAuth(`${apiConfig.baseURL}/categories/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.category || null;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to fetch category');
    }
  },

  async createCategory(categoryData: Partial<Category>): Promise<Category> {
    try {
      const response = await fetchWithAuth(`${apiConfig.baseURL}/categories`, {
        method: 'POST',
        body: JSON.stringify(categoryData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.category;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to create category');
    }
  },

  async updateCategory(id: number, categoryData: Partial<Category>): Promise<Category> {
    try {
      const response = await fetchWithAuth(`${apiConfig.baseURL}/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(categoryData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.category;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to update category');
    }
  },

  async deleteCategory(id: number): Promise<void> {
    try {
      const response = await fetchWithAuth(`${apiConfig.baseURL}/categories/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to delete category');
    }
  },

  async getPopularCategories(limit: number = 6): Promise<Category[]> {
    try {
      const response = await fetchWithAuth(`${apiConfig.baseURL}/categories/popular?limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.categories || [];
    } catch (error) {
      console.error('Error fetching popular categories:', error);
      return [];
    }
  },
};