// src/services/api.ts
import { mockBooks } from "@/data/mockBooks";

// Mock mode is optional. Default is OFF so dev uses real backend when available.
// To enable mock mode: set `VITE_USE_MOCK_DATA=true` in `frontend/.env.local`.
const USE_MOCK_DATA = String(import.meta.env.VITE_USE_MOCK_DATA || "").toLowerCase() === "true";

export const getApiBase = (): string => {
  // In development, use environment variable or localhost fallback
  if (import.meta.env.DEV) {
    const devBase = import.meta.env.VITE_API_BASE_URL;
    if (devBase) {
      console.log('📡 DEV mode: Using VITE_API_BASE_URL =', devBase);
      return devBase.replace(/\/+$/, '');
    }
    console.log('📡 DEV mode: Using localhost:5000 fallback');
    return 'http://localhost:5000'; // Local development fallback
  }

  // In production, MUST use the environment variable
  const prodBase = import.meta.env.VITE_API_BASE_URL;
  if (!prodBase) {
    console.error('❌ VITE_API_BASE_URL is not set in production!');
    throw new Error('API base URL is not configured for production');
  }
  console.log('📡 PROD mode: Using VITE_API_BASE_URL =', prodBase);
  return prodBase.replace(/\/+$/, '');
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

  // Grab the token from localStorage
  const token = localStorage.getItem("admin_token");

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        // Attach the Bearer token if it exists
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
  pdfUrl?: string | null;
  publishedYear?: number | null;
  pages?: number | null;
  rating: number;
  /** Smallest currency unit (Stripe); omit or null = not sold online */
  priceCents?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  bookId: string;
  bookTitle: string;
  paymentMethod: string;
  transactionCode: string;
  email: string;
  amountCents: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  book?: Book;
}

export interface PurchaseStatus {
  purchased: boolean;
  orderId?: string;
  purchasedAt?: string;
}

export interface DownloadResponse {
  pdfUrl: string;
  title: string;
}

export type BookInput = Omit<Book, 'id' | 'createdAt' | 'updatedAt'> & {
  rating?: number;
  priceCents?: number | null;
  pdfUrl?: string | null;
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

// ──────────────────────────────────────────────
// Checkout & Payment Functions
// ──────────────────────────────────────────────

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

// ──────────────────────────────────────────────
// Purchase & Download Functions
// ──────────────────────────────────────────────

/**
 * Check if a user has purchased a specific book
 * @param bookId - The ID of the book
 * @param email - The user's email address
 */
export const checkPurchaseStatus = async (bookId: string, email: string): Promise<PurchaseStatus> => {
  if (USE_MOCK_DATA) {
    // Mock: Check localStorage for purchased books
    const purchasedBooks = JSON.parse(localStorage.getItem("purchased_books") || "[]");
    const purchased = purchasedBooks.some((book: any) => book.id === bookId);
    return { purchased };
  }
  
  const apiBase = getApiBase();
  const response = await fetch(`${apiBase}/api/checkout/purchase/${bookId}?email=${encodeURIComponent(email)}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to check purchase status');
  }
  
  return response.json();
};

/**
 * Get download URL for a purchased book
 * @param bookId - The ID of the book
 * @param email - The user's email address
 */
export const getDownloadUrl = async (bookId: string, email: string): Promise<DownloadResponse> => {
  if (USE_MOCK_DATA) {
    // Mock: Return a placeholder URL
    console.warn("⚠️ Mock mode: Returning placeholder PDF URL");
    return {
      pdfUrl: "https://example.com/sample.pdf",
      title: "Sample Book",
    };
  }
  
  const apiBase = getApiBase();
  const response = await fetch(`${apiBase}/api/checkout/download/${bookId}?email=${encodeURIComponent(email)}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get download URL');
  }
  
  return response.json();
};

/**
 * Get all purchases for a user
 * @param email - The user's email address
 */
export const getUserPurchases = async (email: string): Promise<Order[]> => {
  if (USE_MOCK_DATA) {
    // Mock: Return sample purchases
    console.warn("⚠️ Mock mode: Returning sample purchases");
    return [];
  }
  
  const apiBase = getApiBase();
  const response = await fetch(`${apiBase}/api/checkout/my-purchases?email=${encodeURIComponent(email)}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch purchases');
  }
  
  return response.json();
};

/**
 * Approve a manual payment (admin only)
 * @param data - Payment details
 */
export const approveManualPayment = async (data: {
  bookId: string;
  email: string;
  transactionCode: string;
  paymentMethod: string;
  amountCents?: number;
}): Promise<{ success: boolean; orderId: string; message: string }> => {
  const token = localStorage.getItem("admin_token");
  
  if (!token) {
    throw new Error("Admin authentication required");
  }
  
  const apiBase = getApiBase();
  const response = await fetch(`${apiBase}/api/checkout/approve-manual`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to approve payment');
  }
  
  return response.json();
};

/**
 * Helper to download a book PDF
 * @param bookId - The ID of the book
 * @param email - The user's email address
 */
export const downloadBook = async (bookId: string, email: string): Promise<void> => {
  try {
    const { pdfUrl, title } = await getDownloadUrl(bookId, email);
    
    // Open PDF in new tab or trigger download
    window.open(pdfUrl, '_blank');
    
    // Track download in localStorage for UI updates
    const downloadedBooks = JSON.parse(localStorage.getItem("downloaded_books") || "[]");
    if (!downloadedBooks.includes(bookId)) {
      localStorage.setItem("downloaded_books", JSON.stringify([...downloadedBooks, bookId]));
    }
    
    console.log(`✅ Download started for ${title}`);
  } catch (error) {
    console.error('Download error:', error);
    throw error;
  }
};

/**
 * Helper to mark a book as purchased in localStorage (for UI state)
 * @param bookId - The ID of the book
 */
export const markBookAsPurchased = (bookId: string): void => {
  const purchasedBooks = JSON.parse(localStorage.getItem("purchased_books") || "[]");
  if (!purchasedBooks.some((book: any) => book.id === bookId)) {
    localStorage.setItem(
      "purchased_books", 
      JSON.stringify([...purchasedBooks, { id: bookId, purchasedAt: new Date().toISOString() }])
    );
  }
};

/**
 * Check if a book is purchased (from localStorage)
 * @param bookId - The ID of the book
 */
export const isBookPurchasedLocally = (bookId: string): boolean => {
  const purchasedBooks = JSON.parse(localStorage.getItem("purchased_books") || "[]");
  return purchasedBooks.some((book: any) => book.id === bookId);
};

export default {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  getCheckoutStatus,
  createCheckoutSession,
  checkPurchaseStatus,
  getDownloadUrl,
  getUserPurchases,
  approveManualPayment,
  downloadBook,
  markBookAsPurchased,
  isBookPurchasedLocally,
};