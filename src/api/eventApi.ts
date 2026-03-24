const delay = (ms = 500) => new Promise(r => setTimeout(r, ms));

export interface EventData {
  id: string;
  name: string;
  conference: string;
  startDate: string;
  submissionDeadline: string;
  reviewDeadline: string;
  status: 'active' | 'upcoming' | 'completed';
  submissions: number;
}

export const getEvents = async (): Promise<EventData[]> => {
  await delay();
  return [];
};

export const createEvent = async (data: Omit<EventData, 'id'>): Promise<EventData> => {
  await delay();
  return { ...data, id: `EVT-${Date.now()}` };
};

export const sendBulkEmail = async (eventId: string, recipients: string[]): Promise<void> => {
  await delay(800);
};
