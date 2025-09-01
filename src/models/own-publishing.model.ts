// src/models/own-publishing.model.ts

export type PersonRole = 'AUTHOR' | 'TRANSLATOR' | 'EDITOR' | 'PROPRIETOR' | 'AGENCY' | 'PUBLISHER';

export type OrderType = 'NORMAL' | 'LIBRARY' | 'SPECIAL_SCHEME' | 'EBOOK' | 'AUDIOBOOK' | 'MOVIEBOOK';

export const OrderTypeLabels: Record<OrderType, string> = {
  NORMAL: 'Normal',
  LIBRARY: 'Library',
  SPECIAL_SCHEME: 'Special Scheme',
  EBOOK: 'Ebook',
  AUDIOBOOK: 'Audiobook',
  MOVIEBOOK: 'Moviebook',
};

export type PublishingStatus = 'PENDING' | 'PAID' | 'COMPLETED';

export const PublishingStatusLabels: Record<PublishingStatus, string> = {
  PENDING: 'Pending',
  PAID: 'Paid',
  COMPLETED: 'Completed',
};

export interface OwnPublishing {
  id: number;
  bookId: number;
  bookName: string;
  editionYear: number;
  personId: string;
  personName: string;
  personRole: PersonRole;
  orderType: OrderType;
  discount?: number;       // optional
  numberOfCopies: number;
  bookPrice: number;
  percentage?: number;     // optional
  totalAmount: number;
  royalty: number;
  status: PublishingStatus;
  receivedAmount: number;
  createdAt: string;       // ISO string datetime
}

// Payload for create
export interface OwnPublishingCreatePayload {
  bookName: string;
  editionYear?: number;
  personName: string;
  personRole: PersonRole;
  orderType: OrderType;
  discount?: number;
  numberOfCopies: number;
  bookPrice: number;
  percentage?: number;
  totalAmount: number;
  royalty: number;
  status: PublishingStatus;
  receivedAmount: number;
}


// Payload for update (all optional except ID)
export interface OwnPublishingUpdatePayload {
  bookName?: string;
  editionYear?: number;
  personName?: string;
  personRole?: PersonRole;
  orderType?: OrderType;
  discount?: number;
  numberOfCopies?: number;
  bookPrice?: number;
  percentage?: number;
  receivedAmount: number;
  totalAmount?: number;
  royalty?: number;
  status?: PublishingStatus;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface OwnPublishingListResponse {
  ownPublishings: OwnPublishing[];
  pagination: Pagination;
}
