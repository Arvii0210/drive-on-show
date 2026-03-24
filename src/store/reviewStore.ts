import { create } from 'zustand';
import { mockReviewers, mockReviews, type Reviewer, type Review, calcReviewTotal } from '@/data/mockData';
import { useSubmissionStore } from './submissionStore';

interface ReviewState {
  reviewers: Reviewer[];
  reviews: Review[];
  submitReview: (review: Review) => void;
  updateReview: (id: string, updates: Partial<Review>) => void;
  getReviewsBySubmission: (submissionId: string) => Review[];
  reassignReviewer: (submissionId: string, oldReviewerName: string, newReviewerName: string) => void;
  removeReviewerFromSubmission: (submissionId: string, reviewerName: string) => void;
}

export const useReviewStore = create<ReviewState>((set, get) => ({
  reviewers: [...mockReviewers],
  reviews: [...mockReviews],

  submitReview: (review) =>
    set((state) => ({
      reviews: state.reviews.map((r) =>
        r.id === review.id ? { ...review, totalScore: calcReviewTotal(review.scores) } : r
      ),
    })),

  updateReview: (id, updates) =>
    set((state) => ({
      reviews: state.reviews.map((r) =>
        r.id === id ? { ...r, ...updates } : r
      ),
    })),

  getReviewsBySubmission: (submissionId) =>
    get().reviews.filter(r => r.submissionId === submissionId),

  reassignReviewer: (submissionId, oldReviewerName, newReviewerName) => {
    // Update reviews: mark old review as reassigned, create new pending review
    set((state) => {
      const updatedReviews = state.reviews.map(r => {
        if (r.submissionId === submissionId && r.reviewerName === oldReviewerName && r.status !== 'completed') {
          return { ...r, reviewerName: newReviewerName, status: 'pending' as const };
        }
        return r;
      });

      // Update reviewer counts
      const updatedReviewers = state.reviewers.map(r => {
        if (r.name === oldReviewerName) {
          return { ...r, assignedReviews: Math.max(0, r.assignedReviews - 1) };
        }
        if (r.name === newReviewerName) {
          return { ...r, assignedReviews: r.assignedReviews + 1 };
        }
        return r;
      });

      return { reviews: updatedReviews, reviewers: updatedReviewers };
    });

    // Also update the submission's assignedReviewers array
    const { updateSubmission } = useSubmissionStore.getState();
    const submission = useSubmissionStore.getState().submissions.find(s => s.id === submissionId);
    if (submission) {
      const newAssigned = submission.assignedReviewers
        .filter(name => name !== oldReviewerName)
        .concat(newReviewerName);
      updateSubmission(submissionId, { assignedReviewers: newAssigned });
    }
  },

  removeReviewerFromSubmission: (submissionId, reviewerName) => {
    set((state) => {
      // Remove review if pending
      const updatedReviews = state.reviews.filter(r =>
        !(r.submissionId === submissionId && r.reviewerName === reviewerName && r.status !== 'completed')
      );

      // Update reviewer counts
      const updatedReviewers = state.reviewers.map(r => {
        if (r.name === reviewerName) {
          return { ...r, assignedReviews: Math.max(0, r.assignedReviews - 1) };
        }
        return r;
      });

      return { reviews: updatedReviews, reviewers: updatedReviewers };
    });

    // Update submission's assignedReviewers
    const { updateSubmission } = useSubmissionStore.getState();
    const submission = useSubmissionStore.getState().submissions.find(s => s.id === submissionId);
    if (submission) {
      updateSubmission(submissionId, {
        assignedReviewers: submission.assignedReviewers.filter(name => name !== reviewerName)
      });
    }
  },
}));
