// src/services/bookService.ts

import { Book } from '../models/book.model';

interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

const API_BASE = 'http://localhost:3000/api/books';

function getAuthToken(): string | null {
  return localStorage.getItem('authToken');
}

async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getAuthToken();
  if (token) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return fetch(url, options);
}

export const createBook = async (data: Partial<Book>): Promise<Book> => {
  const res = await fetchWithAuth(`${API_BASE}/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorMsg = await res.text();
    throw new Error(errorMsg || 'Failed to create book');
  }

  const json = await res.json();          // ✅ updated
  return json.data as Book;               // ✅ return only book data
};

export const getBooks = async (params?: {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  authorId?: number;
}): Promise<{
  books: Book[];
  pagination: { total: number; page: number; limit: number; totalPages: number; }
}> => {
  const query = new URLSearchParams();
  if (params?.page) query.append('page', params.page.toString());
  if (params?.limit) query.append('limit', params.limit.toString());
  if (params?.category) query.append('category', params.category);
  if (params?.search) query.append('search', params.search);
  if (params?.authorId) query.append('authorId', params.authorId.toString());

  const res = await fetchWithAuth(`${API_BASE}/?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch books');

  return res.json(); // Assuming this returns correct shape with `books` and `pagination`
};

export const getBookById = async (id: number): Promise<Book> => {
  const res = await fetchWithAuth(`${API_BASE}/${id}`);
  if (!res.ok) throw new Error('Failed to fetch book');

  const json: ApiResponse<Book> = await res.json();
  return json.data;
};


export const updateBook = async (id: number, data: Partial<Book>): Promise<Book> => {
  const res = await fetchWithAuth(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update book');

  const json = await res.json();         // ✅ updated
  return json.data as Book;              // ✅ extract updated book
};

export const deleteBook = async (id: number): Promise<void> => {
  const res = await fetchWithAuth(`${API_BASE}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete book');
};
