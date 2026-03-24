import { create } from 'zustand';
import { type Category } from '@/data/mockData';

interface CategoryState {
  // Map of conferenceId -> categories
  conferenceCategories: Record<string, Category[]>;
  
  // Get categories for specific conference
  getCategoriesForConference: (conferenceId: string) => Category[];
  
  // Category management per conference
  addCategory: (conferenceId: string, name: string) => void;
  removeCategory: (conferenceId: string, categoryId: string) => void;
  updateCategory: (conferenceId: string, categoryId: string, name: string) => void;
  addSubcategory: (conferenceId: string, categoryId: string, name: string) => void;
  removeSubcategory: (conferenceId: string, categoryId: string, name: string) => void;
  updateSubcategory: (conferenceId: string, categoryId: string, oldName: string, newName: string) => void;
}

// Default categories for new conferences
const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'ai',
    name: 'Artificial Intelligence',
    subcategories: ['Machine Learning', 'Natural Language Processing', 'Computer Vision'],
  },
  {
    id: 'data-science',
    name: 'Data Science',
    subcategories: ['Analytics', 'Big Data'],
  },
  {
    id: 'robotics',
    name: 'Robotics',
    subcategories: [],
  },
];

export const useCategoryStore = create<CategoryState>((set, get) => ({
  conferenceCategories: {
    'CONF-001': DEFAULT_CATEGORIES.map(c => ({ ...c })),
    'CONF-002': DEFAULT_CATEGORIES.map(c => ({ ...c })),
    'EVT-001': DEFAULT_CATEGORIES.map(c => ({ ...c })),
    'EVT-002': DEFAULT_CATEGORIES.map(c => ({ ...c })),
  },

  getCategoriesForConference: (conferenceId) => {
    const state = get();
    if (!state.conferenceCategories[conferenceId]) {
      // Return default categories if conference doesn't have custom ones
      return DEFAULT_CATEGORIES.map(c => ({ ...c }));
    }
    return state.conferenceCategories[conferenceId];
  },

  addCategory: (conferenceId, name) =>
    set((state) => ({
      conferenceCategories: {
        ...state.conferenceCategories,
        [conferenceId]: [
          ...(state.conferenceCategories[conferenceId] || []),
          { id: `cat-${Date.now()}`, name, subcategories: [] },
        ],
      },
    })),

  removeCategory: (conferenceId, categoryId) =>
    set((state) => ({
      conferenceCategories: {
        ...state.conferenceCategories,
        [conferenceId]: (state.conferenceCategories[conferenceId] || []).filter(
          (c) => c.id !== categoryId
        ),
      },
    })),

  updateCategory: (conferenceId, categoryId, name) =>
    set((state) => ({
      conferenceCategories: {
        ...state.conferenceCategories,
        [conferenceId]: (state.conferenceCategories[conferenceId] || []).map((c) =>
          c.id === categoryId ? { ...c, name } : c
        ),
      },
    })),

  addSubcategory: (conferenceId, categoryId, name) =>
    set((state) => ({
      conferenceCategories: {
        ...state.conferenceCategories,
        [conferenceId]: (state.conferenceCategories[conferenceId] || []).map((c) =>
          c.id === categoryId
            ? {
                ...c,
                subcategories: c.subcategories.includes(name)
                  ? c.subcategories
                  : [...c.subcategories, name],
              }
            : c
        ),
      },
    })),

  removeSubcategory: (conferenceId, categoryId, name) =>
    set((state) => ({
      conferenceCategories: {
        ...state.conferenceCategories,
        [conferenceId]: (state.conferenceCategories[conferenceId] || []).map((c) =>
          c.id === categoryId
            ? {
                ...c,
                subcategories: c.subcategories.filter((s) => s !== name),
              }
            : c
        ),
      },
    })),

  updateSubcategory: (conferenceId, categoryId, oldName, newName) =>
    set((state) => ({
      conferenceCategories: {
        ...state.conferenceCategories,
        [conferenceId]: (state.conferenceCategories[conferenceId] || []).map((c) =>
          c.id === categoryId
            ? {
                ...c,
                subcategories: c.subcategories.map((s) =>
                  s === oldName ? newName : s
                ),
              }
            : c
        ),
      },
    })),
}));
