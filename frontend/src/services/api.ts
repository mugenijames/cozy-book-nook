// src/services/api.ts

// Base URL logic — works in both dev (proxy) and production (env var)
const getApiBase = (): string => {
  // In Vite dev mode → use relative path (Vite proxy forwards /api → backend)
  if (import.meta.env.DEV) {
    return '';
  }

  // In production → read from environment variable
  const base = import.meta.env.VITE_API_BASE_URL;

  if (!base) {
    console.warn('VITE_API_BASE_URL is not set — falling back to default');
    return 'http://localhost:5000'; // fallback for local testing
  }

  // Remove trailing slash if present
  return base.replace(/\/+$/, '');
};

// Build full URL
const buildUrl = (endpoint: string): string => {
  const base = getApiBase();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${base}${cleanEndpoint}`;
};

// Generic typed fetch wrapper with better error handling
const apiFetch = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = buildUrl(endpoint);

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      let errorMessage = `Request failed with status ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        // ignore json parse error
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    // Add more context to the error
    if (error instanceof Error) {
      throw new Error(`API error (${endpoint}): ${error.message}`);
    }
    throw error;
  }
};

// ──────────────────────────────────────────────
// Typed Book API functions
// ──────────────────────────────────────────────

export interface Book {
  id: string;
  title: string;
  author: string;
  description?: string | null;
  genre?: string | null;
  coverImage?: string | null;
  publishedYear?: number | null;
  pages?: number | null;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export type BookInput = Omit<Book, 'id' | 'createdAt' | 'updatedAt'> & {
  rating?: number;
};

export type BookUpdateInput = Partial<BookInput>;

// GET /api/books - List all books
export const getBooks = (): Promise<Book[]> => apiFetch<Book[]>('/api/books');

// GET /api/books/:id - Get single book
export const getBook = (id: string): Promise<Book> =>
  apiFetch<Book>(`/api/books/${id}`);

// POST /api/books - Create a new book
export const createBook = (bookData: BookInput): Promise<Book> =>
  apiFetch<Book>('/api/books', {
    method: 'POST',
    body: JSON.stringify(bookData),
  });

// PUT /api/books/:id - Update a book (partial update)
export const updateBook = (id: string, bookData: BookUpdateInput): Promise<Book> =>
  apiFetch<Book>(`/api/books/${id}`, {
    method: 'PUT',
    body: JSON.stringify(bookData),
  });

// DELETE /api/books/:id - Delete a book
export const deleteBook = (id: string): Promise<{ message: string }> =>
  apiFetch<{ message: string }>(`/api/books/${id}`, {
    method: 'DELETE',
  });

// Optional: Health check / ping the backend
export const checkApiStatus = (): Promise<{ message: string }> =>
  apiFetch<{ message: string }>('/');

export default {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  checkApiStatus,
};