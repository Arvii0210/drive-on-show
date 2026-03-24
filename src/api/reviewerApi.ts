import { mockReviewers, mockReviews, type Reviewer, type Review } from '@/data/mockData';

const delay = (ms = 500) => new Promise(r => setTimeout(r, ms));

export const getReviewers = async (): Promise<Reviewer[]> => {
  await delay();
  return [...mockReviewers];
};

export const getReviews = async (): Promise<Review[]> => {
  await delay();
  return [...mockReviews];
};

export const getReviewsBySubmission = async (submissionId: string): Promise<Review[]> => {
  await delay(300);
  return mockReviews.filter(r => r.submissionId === submissionId);
};

export const submitReview = async (review: Review): Promise<void> => {
  await delay();
};

export const assignReviewer = async (submissionId: string, reviewerName: string): Promise<void> => {
  await delay(300);
};
