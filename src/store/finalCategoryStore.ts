import { create } from 'zustand';

export interface FinalCategory {
  id: string;
  name: string;
}

interface FinalCategoryState {
  // Map of conferenceId -> final categories
  conferenceFinalCategories: Record<string, FinalCategory[]>;
  
  // Get final categories for specific conference
  getFinalCategoriesForConference: (conferenceId: string) => FinalCategory[];
  
  // Final category management per conference
  addFinalCategory: (conferenceId: string, name: string) => void;
  removeFinalCategory: (conferenceId: string, finalCategoryId: string) => void;
  updateFinalCategory: (conferenceId: string, finalCategoryId: string, name: string) => void;
}

// Default final categories for new conferences
const DEFAULT_FINAL_CATEGORIES: FinalCategory[] = [
  { id: 'e-poster', name: 'E-Poster' },
  { id: 'free-poster', name: 'Free Poster' },
  { id: 'oral-presentation', name: 'Oral Presentation' },
];

export const useFinalCategoryStore = create<FinalCategoryState>((set, get) => ({
  conferenceFinalCategories: {
    'CONF-001': DEFAULT_FINAL_CATEGORIES.map(c => ({ ...c })),
    'CONF-002': DEFAULT_FINAL_CATEGORIES.map(c => ({ ...c })),
    'EVT-001': DEFAULT_FINAL_CATEGORIES.map(c => ({ ...c })),
    'EVT-002': DEFAULT_FINAL_CATEGORIES.map(c => ({ ...c })),
  },

  getFinalCategoriesForConference: (conferenceId) => {
    const state = get();
    if (!state.conferenceFinalCategories[conferenceId]) {
      return DEFAULT_FINAL_CATEGORIES.map(c => ({ ...c }));
    }
    return state.conferenceFinalCategories[conferenceId];
  },

  addFinalCategory: (conferenceId, name) =>
    set((state) => ({
      conferenceFinalCategories: {
        ...state.conferenceFinalCategories,
        [conferenceId]: [
          ...(state.conferenceFinalCategories[conferenceId] || []),
          { id: `final-cat-${Date.now()}`, name },
        ],
      },
    })),

  removeFinalCategory: (conferenceId, finalCategoryId) =>
    set((state) => ({
      conferenceFinalCategories: {
        ...state.conferenceFinalCategories,
        [conferenceId]: (state.conferenceFinalCategories[conferenceId] || []).filter(
          (c) => c.id !== finalCategoryId
        ),
      },
    })),

  updateFinalCategory: (conferenceId, finalCategoryId, name) =>
    set((state) => ({
      conferenceFinalCategories: {
        ...state.conferenceFinalCategories,
        [conferenceId]: (state.conferenceFinalCategories[conferenceId] || []).map((c) =>
          c.id === finalCategoryId ? { ...c, name } : c
        ),
      },
    })),
}));
