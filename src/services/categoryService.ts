import axios from 'axios';

export interface Category {
  id: string;
  categoryName: string;
  image?: string;
  _count: {
    assets: number;
  };
}

export interface CategoryResponse {
  categories: Category[];
}

const API_BASE_URL = '/api';

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    try {
      const response = await axios.get<Category[] | CategoryResponse>(`${API_BASE_URL}/category`);
      // Handle both possible response formats
      if (Array.isArray(response.data)) {
        return response.data;
      } else {
        return response.data.categories || [];
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      throw new Error('Failed to fetch categories');
    }
  }
};