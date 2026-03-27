// src/services/api.ts

const getApiBase = (): string => {
  // In development, use Vite proxy (relative URL)
  if (import.meta.env.DEV) {
    return '';
  }
  // In production, use environment variable
  const base = import.meta.env.VITE_API_BASE_URL;
  if (!base) {
    console.warn('VITE_API_BASE_URL is not set — using relative path');
    return '';
  }
  return base.replace(/\/+$/, '');
};

// IMPORTANT: Set this to false to use real backend
// Mock mode is now DISABLED by default
const USE_MOCK_DATA = false;  // ← Change to false or remove mock data entirely

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
  
  const token = localStorage.getItem("admin_token") || localStorage.getItem("token");
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  console.log(`📡 API Request: ${options.method || 'GET'} ${url}`); // Debug log
  
  try {
    const response = await fetch(url, {
      ...options,
      headers,
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

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`API error (${endpoint}): ${error.message}`);
    }
    throw error;
  }
};

// ──────────────────────────────────────────────
// Book API functions
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
  priceCents?: number | null;
  createdAt: string;
  updatedAt: string;
}

export type BookInput = Omit<Book, 'id' | 'createdAt' | 'updatedAt'> & {
  rating?: number;
  priceCents?: number | null;
};

export type BookUpdateInput = Partial<BookInput>;

// Direct API calls - NO MOCK DATA
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

export const createCheckoutSession = (bookId: string): Promise<{ url: string }> =>
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
  getCheckoutStatus,
  createCheckoutSession,
};