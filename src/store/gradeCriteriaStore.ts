import { create } from 'zustand';

export interface GradeThreshold {
  id: string;
  label: string;
  status: 'accepted' | 'rejected' | 'revision_required';
  min: number;
  max: number;
  color: string;
}

interface EventGradeConfig {
  eventId: string;
  thresholds: GradeThreshold[];
}

interface GradeCriteriaState {
  // Legacy global thresholds for backwards compatibility
  thresholds: GradeThreshold[];
  // Per-event configurations
  eventConfigs: EventGradeConfig[];

  // Legacy global methods
  setThresholds: (thresholds: GradeThreshold[]) => void;
  updateThreshold: (id: string, updates: Partial<GradeThreshold>) => void;
  addThreshold: (threshold: GradeThreshold) => void;
  removeThreshold: (id: string) => void;
  getStatusForScore: (score: number) => 'accepted' | 'rejected' | 'revision_required' | null;

  // Per-event methods
  getEventThresholds: (eventId: string) => GradeThreshold[];
  setEventThresholds: (eventId: string, thresholds: GradeThreshold[]) => void;
  updateEventThreshold: (eventId: string, id: string, updates: Partial<GradeThreshold>) => void;
  addEventThreshold: (eventId: string, threshold: GradeThreshold) => void;
  removeEventThreshold: (eventId: string, id: string) => void;
  getEventStatusForScore: (eventId: string, score: number) => 'accepted' | 'rejected' | 'revision_required' | null;
}

const defaultThresholds: GradeThreshold[] = [
  { id: 'grade-1', label: 'Rejected', status: 'rejected', min: 0, max: 4.0, color: 'text-destructive' },
  { id: 'grade-2', label: 'Revision Required', status: 'revision_required', min: 4.1, max: 6.0, color: 'text-warning' },
  { id: 'grade-3', label: 'Accepted', status: 'accepted', min: 6.1, max: 10.0, color: 'text-success' },
];

export const useGradeCriteriaStore = create<GradeCriteriaState>((set, get) => ({
  thresholds: defaultThresholds,
  eventConfigs: [],

  setThresholds: (thresholds) => set({ thresholds }),

  updateThreshold: (id, updates) =>
    set((state) => ({
      thresholds: state.thresholds.map(t => t.id === id ? { ...t, ...updates } : t),
    })),

  addThreshold: (threshold) =>
    set((state) => ({ thresholds: [...state.thresholds, threshold] })),

  removeThreshold: (id) =>
    set((state) => ({ thresholds: state.thresholds.filter(t => t.id !== id) })),

  getStatusForScore: (score) => {
    const { thresholds } = get();
    const sorted = [...thresholds].sort((a, b) => a.min - b.min);
    for (const t of sorted) {
      if (score >= t.min && score <= t.max) return t.status;
    }
    return null;
  },

  // Per-event methods
  getEventThresholds: (eventId) => {
    const config = get().eventConfigs.find(c => c.eventId === eventId);
    return config?.thresholds || defaultThresholds.map(t => ({ ...t }));
  },

  setEventThresholds: (eventId, thresholds) =>
    set((state) => {
      const existing = state.eventConfigs.find(c => c.eventId === eventId);
      if (existing) {
        return {
          eventConfigs: state.eventConfigs.map(c =>
            c.eventId === eventId ? { ...c, thresholds } : c,
          ),
        };
      }
      return {
        eventConfigs: [...state.eventConfigs, { eventId, thresholds }],
      };
    }),

  updateEventThreshold: (eventId, id, updates) =>
    set((state) => {
      const existing = state.eventConfigs.find(c => c.eventId === eventId);
      if (existing) {
        return {
          eventConfigs: state.eventConfigs.map(c =>
            c.eventId === eventId
              ? {
                  ...c,
                  thresholds: c.thresholds.map(t =>
                    t.id === id ? { ...t, ...updates } : t,
                  ),
                }
              : c,
          ),
        };
      }
      return state;
    }),

  addEventThreshold: (eventId, threshold) =>
    set((state) => {
      const existing = state.eventConfigs.find(c => c.eventId === eventId);
      if (existing) {
        return {
          eventConfigs: state.eventConfigs.map(c =>
            c.eventId === eventId
              ? { ...c, thresholds: [...c.thresholds, threshold] }
              : c,
          ),
        };
      }
      return {
        eventConfigs: [
          ...state.eventConfigs,
          { eventId, thresholds: [threshold] },
        ],
      };
    }),

  removeEventThreshold: (eventId, id) =>
    set((state) => ({
      eventConfigs: state.eventConfigs.map(c =>
        c.eventId === eventId
          ? { ...c, thresholds: c.thresholds.filter(t => t.id !== id) }
          : c,
      ),
    })),

  getEventStatusForScore: (eventId, score) => {
    const thresholds = get().getEventThresholds(eventId);
    const sorted = [...thresholds].sort((a, b) => a.min - b.min);
    for (const t of sorted) {
      if (score >= t.min && score <= t.max) return t.status;
    }
    return null;
  },
}));
