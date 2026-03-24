import { create } from 'zustand';
import {
  mockSubmissions,
  mockReviewers,
  mockReviews,
  mockNotifications,
  type Submission,
  type Reviewer,
  type Review,
  type NotificationItem,
  type SubmissionStatus,
} from '@/data/mockData';

interface Event {
  id: string;
  name: string;
  conference: string;
  startDate: string;
  submissionDeadline: string;
  reviewDeadline: string;
  status: 'active' | 'upcoming' | 'completed';
  submissions: number;
}

interface EmailLog {
  id: string;
  subject: string;
  recipients: string;
  sentAt: string;
  status: 'sent' | 'failed';
}

interface AppState {
  submissions: Submission[];
  reviewers: Reviewer[];
  reviews: Review[];
  notifications: NotificationItem[];
  events: Event[];
  emailLogs: EmailLog[];

  // Submission actions
  updateSubmissionStatus: (id: string, status: SubmissionStatus) => void;
  withdrawSubmission: (id: string) => void;
  addSubmission: (submission: Submission) => void;

  // Review actions
  submitReview: (review: Review) => void;
  updateReview: (id: string, updates: Partial<Review>) => void;

  // Notification actions
  addNotification: (notification: NotificationItem) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Event actions
  addEvent: (event: Event) => void;

  // Email actions
  addEmailLog: (log: EmailLog) => void;

  // Reviewer actions
  assignReviewer: (submissionId: string, reviewerName: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  submissions: [...mockSubmissions],
  reviewers: [...mockReviewers],
  reviews: [...mockReviews],
  notifications: [...mockNotifications],
  events: [
    {
      id: 'EVT-001',
      name: 'International Conference on AI 2024',
      conference: 'ICAI 2024',
      startDate: '2024-03-15',
      submissionDeadline: '2024-02-28',
      reviewDeadline: '2024-03-10',
      status: 'active',
      submissions: 89,
    },
    {
      id: 'EVT-002',
      name: 'Data Science Symposium 2024',
      conference: 'DSS 2024',
      startDate: '2024-06-20',
      submissionDeadline: '2024-05-15',
      reviewDeadline: '2024-06-10',
      status: 'upcoming',
      submissions: 12,
    },
  ],
  emailLogs: [],

  updateSubmissionStatus: (id, status) =>
    set((state) => ({
      submissions: state.submissions.map((s) =>
        s.id === id ? { ...s, status } : s
      ),
    })),

  withdrawSubmission: (id) =>
    set((state) => ({
      submissions: state.submissions.filter((s) => s.id !== id),
      notifications: [
        {
          id: `NOT-${Date.now()}`,
          title: 'Submission Withdrawn',
          message: `Submission ${id} has been withdrawn.`,
          type: 'warning',
          date: new Date().toISOString().split('T')[0],
          read: false,
        },
        ...state.notifications,
      ],
    })),

  addSubmission: (submission) =>
    set((state) => ({
      submissions: [submission, ...state.submissions],
      notifications: [
        {
          id: `NOT-${Date.now()}`,
          title: 'Abstract Submitted',
          message: `Your abstract "${submission.title}" has been successfully submitted.`,
          type: 'success',
          date: new Date().toISOString().split('T')[0],
          read: false,
        },
        ...state.notifications,
      ],
    })),

  submitReview: (review) =>
    set((state) => ({
      reviews: state.reviews.map((r) =>
        r.id === review.id ? review : r
      ),
      notifications: [
        {
          id: `NOT-${Date.now()}`,
          title: 'Review Submitted',
          message: `Review for submission ${review.submissionId} has been submitted.`,
          type: 'success',
          date: new Date().toISOString().split('T')[0],
          read: false,
        },
        ...state.notifications,
      ],
    })),

  updateReview: (id, updates) =>
    set((state) => ({
      reviews: state.reviews.map((r) =>
        r.id === id ? { ...r, ...updates } : r
      ),
    })),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
    })),

  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),

  markAllNotificationsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),

  addEvent: (event) =>
    set((state) => ({
      events: [event, ...state.events],
    })),

  addEmailLog: (log) =>
    set((state) => ({
      emailLogs: [log, ...state.emailLogs],
    })),

  assignReviewer: (submissionId, reviewerName) =>
    set((state) => ({
      submissions: state.submissions.map((s) =>
        s.id === submissionId && !s.assignedReviewers.includes(reviewerName)
          ? { ...s, assignedReviewers: [...s.assignedReviewers, reviewerName] }
          : s
      ),
    })),
}));
