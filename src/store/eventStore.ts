import { create } from 'zustand';

export interface Event {
  id: string;
  name: string;
  conference: string;
  slug: string;
  startDate: string;
  submissionStartDate?: string;
  submissionDeadline: string;
  reviewDeadline: string;
  eventDate?: string;
  location?: string;
  categories: string[];
  authorGuidelines?: string;
  reviewerGuidelines?: string;
  status: 'active' | 'upcoming' | 'completed';
  submissions: number;
  maxSubmissionsPerAuthor?: number;
  allowEditingAfterDeadline?: boolean;
}

interface EmailLog {
  id: string;
  subject: string;
  recipients: string;
  sentAt: string;
  status: 'sent' | 'failed';
}

interface EventState {
  events: Event[];
  emailLogs: EmailLog[];
  addEvent: (event: Event) => void;
  updateEvent: (id: string, data: Partial<Event>) => void;
  addEmailLog: (log: EmailLog) => void;
}

export const useEventStore = create<EventState>((set) => ({
  events: [
    {
      id: 'EVT-001',
      name: 'International Conference on AI 2024',
      conference: 'ICAI 2024',
      slug: 'icai-2024',
      startDate: '2024-03-15',
      submissionDeadline: '2024-02-28',
      reviewDeadline: '2024-03-10',
      categories: ['Artificial Intelligence', 'Machine Learning', 'Data Science'],
      status: 'active',
      submissions: 89,
      maxSubmissionsPerAuthor: 3,
      allowEditingAfterDeadline: true,
    },
    {
      id: 'EVT-002',
      name: 'Data Science Symposium 2024',
      conference: 'DSS 2024',
      slug: 'dss-2024',
      startDate: '2024-06-20',
      submissionDeadline: '2024-05-15',
      reviewDeadline: '2024-06-10',
      categories: ['Data Science', 'Machine Learning'],
      status: 'upcoming',
      submissions: 12,
      maxSubmissionsPerAuthor: 5,
    },
  ],
  emailLogs: [],

  addEvent: (event) =>
    set((state) => ({ events: [event, ...state.events] })),

  updateEvent: (id, data) =>
    set((state) => ({
      events: state.events.map((e) => (e.id === id ? { ...e, ...data } : e)),
    })),

  addEmailLog: (log) =>
    set((state) => ({ emailLogs: [log, ...state.emailLogs] })),
}));
