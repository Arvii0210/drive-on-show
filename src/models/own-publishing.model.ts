// src/models/own-publishing.model.ts

export type PersonType =
  | "AUTHOR"
  | "TRANSLATOR"
  | "EDITOR"
  | "PROPRIETOR"
  | "AGENCY"
  | "PUBLISHER";

export type OrderType = "NORMAL" | "LIBRARY" | "SPECIAL_SCHEME";

export interface Person {
  id: number;
  name: string;
  personType: PersonType;
}

export interface Book {
  id: number;
  title: string;
  author?: Person; // Based on backend relation
}

export interface OwnPublishing {
  id: number;
  bookId: number;
  personId: number;
  personRole: PersonType;
  orderType: OrderType;
  numberOfCopies: number;
  bookPrice: number;
  percentage?: number;
  person: Person;
  book: Book;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  deletedAt?: string | null;
}

export interface OwnPublishingListResponse {
  ownPublishings: OwnPublishing[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface OwnPublishingCreatePayload {
  bookId: number;
  personId: number;
  personRole: PersonType;
  orderType: OrderType;
  numberOfCopies: number;
  bookPrice: number;
  percentage?: number;
}

export interface OwnPublishingUpdatePayload {
  bookId?: number;
  personId?: number;
  personRole?: PersonType;
  orderType?: OrderType;
  numberOfCopies?: number;
  bookPrice?: number;
  percentage?: number;
}
