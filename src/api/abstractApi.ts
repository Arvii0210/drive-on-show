import { mockSubmissions, type Submission, type SubmissionStatus } from '@/data/mockData';

const delay = (ms = 500) => new Promise(r => setTimeout(r, ms));

export const getSubmissions = async (): Promise<Submission[]> => {
  await delay();
  return [...mockSubmissions];
};

export const getSubmissionById = async (id: string): Promise<Submission | undefined> => {
  await delay(300);
  return mockSubmissions.find(s => s.id === id);
};

export const createSubmission = async (data: Omit<Submission, 'id'>): Promise<Submission> => {
  await delay();
  return { ...data, id: `ABS-${Date.now()}` };
};

export const updateSubmissionStatus = async (id: string, status: SubmissionStatus): Promise<void> => {
  await delay(300);
};

export const withdrawSubmission = async (id: string): Promise<void> => {
  await delay(300);
};
