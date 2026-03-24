import { create } from 'zustand';
import { mockSubmissions, type Submission, type SubmissionStatus } from '@/data/mockData';
import { useEventStore } from './eventStore';

interface SubmissionState {
  submissions: Submission[];
  updateSubmissionStatus: (id: string, status: SubmissionStatus) => void;
  withdrawSubmission: (id: string) => void;
  addSubmission: (submission: Submission) => void;
  updateSubmission: (id: string, data: Partial<Submission>) => void;
  assignReviewer: (submissionId: string, reviewerName: string) => void;
  checkCanEditSubmission: (submissionId: string, eventId: string) => { allowed: boolean; reason?: string };
  canAddSubmission: (authorEmail: string, eventId: string) => { allowed: boolean; reason?: string; currentCount?: number; maxCount?: number };
  updateSubmissionWithVersion: (id: string, data: Partial<Submission>, changeSummary: string) => void;
}

export const useSubmissionStore = create<SubmissionState>((set, get) => ({
  submissions: [...mockSubmissions],

  updateSubmissionStatus: (id, status) =>
    set((state) => ({
      submissions: state.submissions.map((s) =>
        s.id === id ? { ...s, status } : s
      ),
    })),

  withdrawSubmission: (id) =>
    set((state) => ({
      submissions: state.submissions.map((s) =>
        s.id === id ? { ...s, status: 'withdrawn' as SubmissionStatus } : s
      ),
    })),

  addSubmission: (submission) =>
    set((state) => ({
      submissions: [submission, ...state.submissions],
    })),

  updateSubmission: (id, data) =>
    set((state) => ({
      submissions: state.submissions.map((s) =>
        s.id === id ? { ...s, ...data } : s
      ),
    })),

  assignReviewer: (submissionId, reviewerName) =>
    set((state) => ({
      submissions: state.submissions.map((s) =>
        s.id === submissionId && !s.assignedReviewers.includes(reviewerName)
          ? { ...s, assignedReviewers: [...s.assignedReviewers, reviewerName] }
          : s
      ),
    })),

  checkCanEditSubmission: (submissionId: string, eventId: string) => {
    const state = get();
    const submission = state.submissions.find(s => s.id === submissionId);
    const eventStore = useEventStore.getState();
    const event = eventStore.events.find(e => e.id === eventId);
    
    if (!submission) {
      return { allowed: false, reason: 'Submission not found' };
    }

    // Cannot edit if already withdrawn
    if (submission.status === 'withdrawn') {
      return { allowed: false, reason: 'Cannot edit withdrawn submissions' };
    }

    // Cannot edit if under review or already reviewed
    if (['under_review', 'accepted', 'rejected'].includes(submission.status)) {
      return { allowed: false, reason: 'Cannot edit submissions that are under review or have been reviewed' };
    }

    // Check deadline - cannot edit after submission deadline unless allowed by admin settings
    if (event) {
      const deadline = new Date(event.submissionDeadline);
      const now = new Date();
      if (now > deadline) {
        return { allowed: false, reason: 'Submission deadline has passed - editing is no longer allowed' };
      }
    }

    // Can edit draft, submitted, or revision_required (before deadline)
    return { allowed: true };
  },

  canAddSubmission: (authorEmail: string, eventId: string) => {
    const state = get();
    const eventStore = useEventStore.getState();
    const event = eventStore.events.find(e => e.id === eventId);
    
    if (!event) {
      return { allowed: false, reason: 'Event not found' };
    }

    // Check submission deadline
    const deadline = new Date(event.submissionDeadline);
    const now = new Date();
    if (now > deadline) {
      return { allowed: false, reason: 'Submission deadline has passed' };
    }

    // Check submission limit per author
    const maxSubmissions = event.maxSubmissionsPerAuthor || 5; // Default to 5 if not set
    const authorSubmissions = state.submissions.filter(
      s => s.authorEmail === authorEmail && 
           s.conference === event.conference &&
           s.status !== 'withdrawn' // Don't count withdrawn submissions
    );
    
    const currentCount = authorSubmissions.length;
    if (currentCount >= maxSubmissions) {
      return {
        allowed: false,
        reason: `You have reached the maximum number of submissions (${maxSubmissions}) for this conference`,
        currentCount,
        maxCount: maxSubmissions
      };
    }

    return { 
      allowed: true, 
      currentCount, 
      maxCount: maxSubmissions 
    };
  },

  updateSubmissionWithVersion: (id: string, data: Partial<Submission>, changeSummary: string) => {
    set((state) => ({
      submissions: state.submissions.map((s) =>
        s.id === id ? { ...s, ...data } : s
      ),
    }));
  },
}));
