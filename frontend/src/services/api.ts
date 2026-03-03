import { Book, BookInput } from "../types/book";

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Generic fetch wrapper
const apiFetch = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Request failed: ${response.status}`);
  }

  return response.json();
};

// 🔥 Typed API functions
export const getBooks = (): Promise<Book[]> =>
  apiFetch<Book[]>('/api/books');

export const getBook = (id: string): Promise<Book> =>
  apiFetch<Book>(`/api/books/${id}`);

export const createBook = (bookData: BookInput): Promise<Book> =>
  apiFetch<Book>('/api/books', {
    method: 'POST',
    body: JSON.stringify(bookData),
  });

export const updateBook = (id: string, bookData: BookInput): Promise<Book> =>
  apiFetch<Book>(`/api/books/${id}`, {
    method: 'PUT',
    body: JSON.stringify(bookData),
  });

export const deleteBook = (id: string): Promise<{ message: string }> =>
  apiFetch<{ message: string }>(`/api/books/${id}`, {
    method: 'DELETE',
  });