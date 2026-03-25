// src/services/api.ts

const getApiBase = (): string => {
  if (import.meta.env.DEV) {
    return ''; // Vite proxy handles this in dev
  }
  const base = import.meta.env.VITE_API_BASE_URL;
  if (!base) {
    console.warn('VITE_API_BASE_URL is not set — falling back to localhost:5000');
    return 'http://localhost:5000';
  }
  return base.replace(/\/+$/, '');
};

const buildUrl = (endpoint: string): string => {
  const base = getApiBase();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${base}${cleanEndpoint}`;
};

const apiFetch = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = buildUrl(endpoint);

  // --- THE FIX: Grab the token from localStorage ---
  const token = localStorage.getItem("admin_token");

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        // --- THE FIX: Attach the Bearer token ---
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
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
  slug?: string | null;
  title: string;
  author: string;
  description?: string | null;
  genre?: string | null;
  coverImage?: string | null;
  publishedYear?: number | null;
  pages?: number | null;
  rating: number;
  /** Smallest currency unit (Stripe); omit or null = not sold online */
  priceCents?: number | null;
  createdAt: string;
  updatedAt: string;
}

export type BookInput = Omit<Book, 'id' | 'createdAt' | 'updatedAt'> & {
  rating?: number;
  priceCents?: number | null;
};

export type BookUpdateInput = Partial<BookInput>;

export const getBooks = (): Promise<Book[]> => apiFetch<Book[]>('/api/books');

export const getBook = (id: string): Promise<Book> =>
  apiFetch<Book>(`/api/books/${id}`);

export const createBook = (bookData: BookInput): Promise<Book> =>
  apiFetch<Book>('/api/books', {
    method: 'POST',
    body: JSON.stringify(bookData),
  });

export const updateBook = (id: string, bookData: BookUpdateInput): Promise<Book> =>
  apiFetch<Book>(`/api/books/${id}`, {
    method: 'PUT',
    body: JSON.stringify(bookData),
  });

export const deleteBook = (id: string): Promise<{ message: string }> =>
  apiFetch<{ message: string }>(`/api/books/${id}`, {
    method: 'DELETE',
  });

export type CheckoutStatus = { enabled: boolean };

export const getCheckoutStatus = (): Promise<CheckoutStatus> =>
  apiFetch<CheckoutStatus>('/api/checkout/status');

export const createCheckoutSession = (
  bookId: string
): Promise<{ url: string }> =>
  apiFetch<{ url: string }>('/api/checkout/session', {
    method: 'POST',
    body: JSON.stringify({ bookId }),
  });

export default {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
};