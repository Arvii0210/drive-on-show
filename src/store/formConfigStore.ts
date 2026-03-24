import { create } from "zustand";

// ─── Author submission field configuration ───

export interface SubmissionField {
  id: string;
  label: string;
  type: "text" | "textarea" | "select" | "keywords" | "file" | "image" | "coauthors" | "category" | "subcategory" | "final-category";
  required: boolean;
  placeholder?: string;
  options?: string[]; // for select type
  enabled: boolean;
  order: number;
}

// ─── Reviewer evaluation criteria configuration ───

export interface ReviewCriterion {
  id: string;
  key: string;
  label: string;
  description: string;
  maxScore: number;
  enabled: boolean;
  order: number;
}

// ─── Per-event configuration ───

export interface EventFormConfig {
  eventId: string;
  submissionFields: SubmissionField[];
  reviewCriteria: ReviewCriterion[];
}

// ─── Default fields for new events ───

const defaultSubmissionFields: SubmissionField[] = [
  {
    id: "title",
    label: "Abstract Title",
    type: "text",
    required: true,
    placeholder: "Enter a descriptive title...",
    enabled: true,
    order: 0,
  },
  {
    id: "category",
    label: "Research Category",
    type: "select",
    required: true,
    enabled: true,
    order: 1,
  },
  {
    id: "keywords",
    label: "Keywords",
    type: "keywords",
    required: false,
    placeholder: "deep learning, image segmentation, neural networks",
    enabled: true,
    order: 2,
  },
  {
    id: "introduction",
    label: "Introduction",
    type: "textarea",
    required: true,
    placeholder: "Introduce the research context and problem...",
    enabled: true,
    order: 3,
  },
  {
    id: "aim",
    label: "Aim & Objectives",
    type: "textarea",
    required: true,
    placeholder: "State the aims and specific objectives...",
    enabled: true,
    order: 4,
  },
  {
    id: "methods",
    label: "Materials & Methods",
    type: "textarea",
    required: true,
    placeholder: "Describe the methodology and materials used...",
    enabled: true,
    order: 5,
  },
  {
    id: "results",
    label: "Results",
    type: "textarea",
    required: true,
    placeholder: "Present the key findings and results...",
    enabled: true,
    order: 6,
  },
  {
    id: "conclusion",
    label: "Conclusion",
    type: "textarea",
    required: true,
    placeholder: "Summarize the conclusions and implications...",
    enabled: true,
    order: 7,
  },
  {
    id: "file_upload",
    label: "File Upload",
    type: "file",
    required: false,
    enabled: true,
    order: 8,
  },
  {
    id: "coauthors",
    label: "Co-Authors",
    type: "coauthors",
    required: false,
    enabled: true,
    order: 9,
  },
  {
    id: "final_category",
    label: "Final Category",
    type: "final-category",
    required: false,
    enabled: true,
    order: 10,
  },
];

const defaultReviewCriteria: ReviewCriterion[] = [
  {
    id: "originality",
    key: "originality",
    label: "Originality",
    description: "Novelty and innovation of the research",
    maxScore: 10,
    enabled: true,
    order: 0,
  },
  {
    id: "methodology",
    key: "methodology",
    label: "Methodology",
    description: "Soundness of research methods and design",
    maxScore: 10,
    enabled: true,
    order: 1,
  },
  {
    id: "relevance",
    key: "relevance",
    label: "Relevance",
    description: "Significance and impact to the field",
    maxScore: 10,
    enabled: true,
    order: 2,
  },
  {
    id: "clarity",
    key: "clarity",
    label: "Clarity",
    description: "Quality of writing and presentation",
    maxScore: 10,
    enabled: true,
    order: 3,
  },
  {
    id: "significance",
    key: "significance",
    label: "Significance",
    description: "Importance and contribution of findings",
    maxScore: 10,
    enabled: true,
    order: 4,
  },
  {
    id: "presentation",
    key: "presentation",
    label: "Presentation",
    description: "Structure, figures, and overall layout",
    maxScore: 10,
    enabled: true,
    order: 5,
  },
  {
    id: "technical_quality",
    key: "technical_quality",
    label: "Technical Quality",
    description: "Correctness and rigor of technical work",
    maxScore: 10,
    enabled: true,
    order: 6,
  },
];

interface FormConfigState {
  configs: EventFormConfig[];

  getConfigForEvent: (eventId: string) => EventFormConfig;
  getSubmissionFields: (eventId: string) => SubmissionField[];
  getReviewCriteria: (eventId: string) => ReviewCriterion[];

  // Author config actions
  addSubmissionField: (eventId: string, field: SubmissionField) => void;
  updateSubmissionField: (
    eventId: string,
    fieldId: string,
    updates: Partial<SubmissionField>,
  ) => void;
  removeSubmissionField: (eventId: string, fieldId: string) => void;
  toggleSubmissionField: (eventId: string, fieldId: string) => void;
  reorderSubmissionFields: (eventId: string, fields: SubmissionField[]) => void;
  addFieldOption: (eventId: string, fieldId: string, option: string) => void;
  removeFieldOption: (eventId: string, fieldId: string, option: string) => void;
  updateFieldOptions: (eventId: string, fieldId: string, options: string[]) => void;

  // Reviewer config actions
  addReviewCriterion: (eventId: string, criterion: ReviewCriterion) => void;
  updateReviewCriterion: (
    eventId: string,
    criterionId: string,
    updates: Partial<ReviewCriterion>,
  ) => void;
  removeReviewCriterion: (eventId: string, criterionId: string) => void;
  toggleReviewCriterion: (eventId: string, criterionId: string) => void;
  reorderReviewCriteria: (eventId: string, criteria: ReviewCriterion[]) => void;
}

function ensureConfig(
  configs: EventFormConfig[],
  eventId: string,
): EventFormConfig[] {
  if (configs.find((c) => c.eventId === eventId)) return configs;
  return [
    ...configs,
    {
      eventId,
      submissionFields: defaultSubmissionFields.map((f) => ({ ...f })),
      reviewCriteria: defaultReviewCriteria.map((c) => ({ ...c })),
    },
  ];
}

export const useFormConfigStore = create<FormConfigState>((set, get) => ({
  configs: [
    {
      eventId: "EVT-001",
      submissionFields: defaultSubmissionFields.map((f) => ({ ...f })),
      reviewCriteria: defaultReviewCriteria.map((c) => ({ ...c })),
    },
    {
      eventId: "EVT-002",
      submissionFields: defaultSubmissionFields.map((f) => ({ ...f })),
      reviewCriteria: defaultReviewCriteria.map((c) => ({ ...c })),
    },
  ],

  getConfigForEvent: (eventId) => {
    const config = get().configs.find((c) => c.eventId === eventId);
    if (config) return config;
    return {
      eventId,
      submissionFields: defaultSubmissionFields.map((f) => ({ ...f })),
      reviewCriteria: defaultReviewCriteria.map((c) => ({ ...c })),
    };
  },

  getSubmissionFields: (eventId) => {
    return get()
      .getConfigForEvent(eventId)
      .submissionFields.filter((f) => f.enabled)
      .sort((a, b) => a.order - b.order);
  },

  getReviewCriteria: (eventId) => {
    return get()
      .getConfigForEvent(eventId)
      .reviewCriteria.filter((c) => c.enabled)
      .sort((a, b) => a.order - b.order);
  },

  addSubmissionField: (eventId, field) =>
    set((state) => {
      const configs = ensureConfig(state.configs, eventId);
      return {
        configs: configs.map((c) =>
          c.eventId === eventId
            ? { ...c, submissionFields: [...c.submissionFields, field] }
            : c,
        ),
      };
    }),

  updateSubmissionField: (eventId, fieldId, updates) =>
    set((state) => ({
      configs: state.configs.map((c) =>
        c.eventId === eventId
          ? {
              ...c,
              submissionFields: c.submissionFields.map((f) =>
                f.id === fieldId ? { ...f, ...updates } : f,
              ),
            }
          : c,
      ),
    })),

  removeSubmissionField: (eventId, fieldId) =>
    set((state) => ({
      configs: state.configs.map((c) =>
        c.eventId === eventId
          ? {
              ...c,
              submissionFields: c.submissionFields.filter(
                (f) => f.id !== fieldId,
              ),
            }
          : c,
      ),
    })),

  toggleSubmissionField: (eventId, fieldId) =>
    set((state) => ({
      configs: state.configs.map((c) =>
        c.eventId === eventId
          ? {
              ...c,
              submissionFields: c.submissionFields.map((f) =>
                f.id === fieldId ? { ...f, enabled: !f.enabled } : f,
              ),
            }
          : c,
      ),
    })),

  addReviewCriterion: (eventId, criterion) =>
    set((state) => {
      const configs = ensureConfig(state.configs, eventId);
      return {
        configs: configs.map((c) =>
          c.eventId === eventId
            ? { ...c, reviewCriteria: [...c.reviewCriteria, criterion] }
            : c,
        ),
      };
    }),

  updateReviewCriterion: (eventId, criterionId, updates) =>
    set((state) => ({
      configs: state.configs.map((c) =>
        c.eventId === eventId
          ? {
              ...c,
              reviewCriteria: c.reviewCriteria.map((cr) =>
                cr.id === criterionId ? { ...cr, ...updates } : cr,
              ),
            }
          : c,
      ),
    })),

  removeReviewCriterion: (eventId, criterionId) =>
    set((state) => ({
      configs: state.configs.map((c) =>
        c.eventId === eventId
          ? {
              ...c,
              reviewCriteria: c.reviewCriteria.filter(
                (cr) => cr.id !== criterionId,
              ),
            }
          : c,
      ),
    })),

  toggleReviewCriterion: (eventId, criterionId) =>
    set((state) => ({
      configs: state.configs.map((c) =>
        c.eventId === eventId
          ? {
              ...c,
              reviewCriteria: c.reviewCriteria.map((cr) =>
                cr.id === criterionId ? { ...cr, enabled: !cr.enabled } : cr,
              ),
            }
          : c,
      ),
    })),

  reorderSubmissionFields: (eventId, fields) =>
    set((state) => ({
      configs: state.configs.map((c) =>
        c.eventId === eventId ? { ...c, submissionFields: fields } : c,
      ),
    })),

  addFieldOption: (eventId, fieldId, option) =>
    set((state) => ({
      configs: state.configs.map((c) =>
        c.eventId === eventId
          ? {
              ...c,
              submissionFields: c.submissionFields.map((f) =>
                f.id === fieldId
                  ? {
                      ...f,
                      options: [...(f.options || []), option],
                    }
                  : f,
              ),
            }
          : c,
      ),
    })),

  removeFieldOption: (eventId, fieldId, option) =>
    set((state) => ({
      configs: state.configs.map((c) =>
        c.eventId === eventId
          ? {
              ...c,
              submissionFields: c.submissionFields.map((f) =>
                f.id === fieldId
                  ? {
                      ...f,
                      options: (f.options || []).filter((o) => o !== option),
                    }
                  : f,
              ),
            }
          : c,
      ),
    })),

  updateFieldOptions: (eventId, fieldId, options) =>
    set((state) => ({
      configs: state.configs.map((c) =>
        c.eventId === eventId
          ? {
              ...c,
              submissionFields: c.submissionFields.map((f) =>
                f.id === fieldId ? { ...f, options } : f,
              ),
            }
          : c,
      ),
    })),

  reorderReviewCriteria: (eventId, criteria) =>
    set((state) => ({
      configs: state.configs.map((c) =>
        c.eventId === eventId ? { ...c, reviewCriteria: criteria } : c,
      ),
    })),
}));

export { defaultSubmissionFields, defaultReviewCriteria };
