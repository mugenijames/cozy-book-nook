// src/services/api.ts
import { mockBooks } from "@/data/mockBooks";

// Mock mode is optional. Default is OFF so dev uses real backend when available.
// To enable mock mode: set `VITE_USE_MOCK_DATA=true` in `frontend/.env.local`.
const USE_MOCK_DATA = String(import.meta.env.VITE_USE_MOCK_DATA || "").toLowerCase() === "true";

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
// Typed Book API functions with Mock Data Support
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

// Get all books - with mock data fallback
export const getBooks = async (): Promise<Book[]> => {
  if (USE_MOCK_DATA) {
    console.log("📚 Using mock data - showing sample books");
    // Add createdAt and updatedAt to mock books
    return mockBooks.map(book => ({
      ...book,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
  }
  return apiFetch<Book[]>('/api/books');
};

// Get single book - with mock data fallback
export const getBook = async (id: string): Promise<Book> => {
  if (USE_MOCK_DATA) {
    console.log("📚 Using mock data for book:", id);
    const book = mockBooks.find(b => b.id === id || b.slug === id);
    if (!book) {
      throw new Error("Book not found");
    }
    return {
      ...book,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
  return apiFetch<Book>(`/api/books/${id}`);
};

// Create book - uses real API (admin only)
export const createBook = (bookData: BookInput): Promise<Book> => {
  if (USE_MOCK_DATA) {
    console.warn("⚠️ Mock mode: createBook would send to API in production");
    // Simulate API response
    const newBook: Book = {
      ...bookData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      rating: bookData.rating || 0,
    };
    return Promise.resolve(newBook);
  }
  return apiFetch<Book>('/api/books', {
    method: 'POST',
    body: JSON.stringify(bookData),
  });
};

// Update book - uses real API (admin only)
export const updateBook = (id: string, bookData: BookUpdateInput): Promise<Book> => {
  if (USE_MOCK_DATA) {
    console.warn("⚠️ Mock mode: updateBook would send to API in production");
    // Simulate API response
    const existingBook = mockBooks.find(b => b.id === id);
    if (!existingBook) throw new Error("Book not found");
    const updatedBook: Book = {
      ...existingBook,
      ...bookData,
      id,
      updatedAt: new Date().toISOString(),
      rating: bookData.rating !== undefined ? bookData.rating : existingBook.rating,
    };
    return Promise.resolve(updatedBook);
  }
  return apiFetch<Book>(`/api/books/${id}`, {
    method: 'PUT',
    body: JSON.stringify(bookData),
  });
};

// Delete book - uses real API (admin only)
export const deleteBook = (id: string): Promise<{ message: string }> => {
  if (USE_MOCK_DATA) {
    console.warn("⚠️ Mock mode: deleteBook would send to API in production");
    return Promise.resolve({ message: "Book deleted (mock)" });
  }
  return apiFetch<{ message: string }>(`/api/books/${id}`, {
    method: 'DELETE',
  });
};

export type CheckoutStatus = { enabled: boolean };

export const getCheckoutStatus = (): Promise<CheckoutStatus> => {
  if (USE_MOCK_DATA) {
    return Promise.resolve({ enabled: false });
  }
  return apiFetch<CheckoutStatus>('/api/checkout/status');
};

export const createCheckoutSession = (bookId: string): Promise<{ url: string }> => {
  if (USE_MOCK_DATA) {
    console.warn("⚠️ Mock mode: Stripe checkout disabled");
    return Promise.resolve({ url: "/#books" });
  }
  return apiFetch<{ url: string }>('/api/checkout/session', {
    method: 'POST',
    body: JSON.stringify({ bookId }),
  });
};

export default {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
};