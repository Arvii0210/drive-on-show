import axios from 'axios';
import { API_CONFIG } from '../config/api';

export interface Category {
  id: string;
  categoryName: string;
  imageUrl?: string | null;
  description?: string;
  status?: string;
  _count: {
    assets: number;
  };
}

const API_BASE_URL = API_CONFIG.CATEGORIES;

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories/`);
      // Extract categories from response.data.message.data due to your backend format
      const categories = response.data?.message?.data;
      if (Array.isArray(categories)) {
        return categories;
      } else {
        console.warn('Unexpected categories data format:', response.data);
        return [];
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      throw new Error('Failed to fetch categories');
    }
  },

  async getCategoryById(id: string): Promise<Category | null> {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories/${id}`);
      const category = response.data?.message?.data;
      if (category) {
        return category;
      } else {
        console.warn('Category not found or unexpected response:', response.data);
        return null;
      }
    } catch (error) {
      console.error(`Failed to fetch category with id ${id}:`, error);
      return null;
    }
  },
};
