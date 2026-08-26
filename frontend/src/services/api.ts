// frontend/src/services/api.ts

import { mockBooks } from "@/data/mockBooks";

// ============================================================
// CONFIGURATION
// ============================================================

const USE_MOCK_DATA =
  String(import.meta.env.VITE_USE_MOCK_DATA || "").toLowerCase() ===
  "true";

// ============================================================
// API BASE URL
// ============================================================

/**
 * Returns the backend base URL.
 *
 * IMPORTANT:
 * Keep VITE_API_BASE_URL WITHOUT /api.
 *
 * Example:
 *
 * VITE_API_BASE_URL=https://cozy-book-nook-1.onrender.com
 *
 * Endpoints are then written as:
 *
 * /api/books
 * /api/orders
 * /api/upload-pdf
 */
export const getApiBase = (): string => {
  const configured =
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_URL;

  // ----------------------------------------------------------
  // DEVELOPMENT
  // ----------------------------------------------------------

  if (import.meta.env.DEV) {
    const devBase =
      configured || "http://localhost:5000";

    const cleanBase =
      devBase.replace(/\/+$/, "");

    console.log(
      "📡 DEV API Base URL:",
      cleanBase
    );

    return cleanBase;
  }

  // ----------------------------------------------------------
  // PRODUCTION
  // ----------------------------------------------------------

  const prodBase =
    configured ||
    "https://cozy-book-nook-1.onrender.com";

  const cleanBase =
    prodBase.replace(/\/+$/, "");

  console.log(
    "📡 PROD API Base URL:",
    cleanBase
  );

  return cleanBase;
};

// ============================================================
// URL BUILDER
// ============================================================

const buildUrl = (
  endpoint: string
): string => {
  const base = getApiBase();

  const cleanEndpoint =
    endpoint.startsWith("/")
      ? endpoint
      : `/${endpoint}`;

  return `${base}${cleanEndpoint}`;
};

// ============================================================
// ADMIN TOKEN
// ============================================================

const getAdminToken = (): string | null => {
  try {
    return localStorage.getItem(
      "admin_token"
    );
  } catch {
    return null;
  }
};

// ============================================================
// GENERIC API FETCH
// ============================================================

export const apiFetch = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = buildUrl(endpoint);

  const token = getAdminToken();

  const headers = new Headers(
    options.headers || {}
  );

  // ----------------------------------------------------------
  // CONTENT TYPE
  // ----------------------------------------------------------
  //
  // Do NOT manually set Content-Type for FormData.
  // The browser automatically creates the multipart boundary.
  // ----------------------------------------------------------

  if (
    !(options.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set(
      "Content-Type",
      "application/json"
    );
  }

  // ----------------------------------------------------------
  // ADMIN AUTHORIZATION
  // ----------------------------------------------------------

  if (token) {
    headers.set(
      "Authorization",
      `Bearer ${token}`
    );
  }

  console.log(
    `🌐 API ${options.method || "GET"} ${url}`
  );

  try {
    const response = await fetch(
      url,
      {
        ...options,
        headers,
      }
    );

    const contentType =
      response.headers.get(
        "content-type"
      ) || "";

    let data: any = null;

    // --------------------------------------------------------
    // JSON RESPONSE
    // --------------------------------------------------------

    if (
      contentType.includes(
        "application/json"
      )
    ) {
      try {
        data = await response.json();
      } catch {
        data = null;
      }
    }

    // --------------------------------------------------------
    // TEXT RESPONSE
    // --------------------------------------------------------

    else {
      try {
        data = await response.text();
      } catch {
        data = null;
      }
    }

    // --------------------------------------------------------
    // HTTP ERROR
    // --------------------------------------------------------

    if (!response.ok) {
      const serverMessage =
        typeof data === "object" &&
        data
          ? data.error ||
            data.message ||
            data.detail
          : typeof data === "string"
          ? data
          : null;

      const message =
        serverMessage ||
        `Request failed with status ${response.status}`;

      console.error(
        `❌ API error ${response.status}:`,
        message
      );

      throw new Error(message);
    }

    return data as T;
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message.startsWith(
          "API error ("
        )
      ) {
        throw error;
      }

      throw new Error(
        `API error (${endpoint}): ${error.message}`
      );
    }

    throw new Error(
      `API error (${endpoint}): Unknown error`
    );
  }
};

// ============================================================
// BOOK TYPES
// ============================================================

export interface Book {
  id: string;

  slug?: string | null;

  title: string;

  author: string;

  description?: string | null;

  genre?: string | null;

  coverImage?: string | null;

  pdfUrl?: string | null;

  pdfPreviewImage?: string | null;

  publishedYear?: number | null;

  pages?: number | null;

  rating: number;

  /**
   * Smallest currency unit.
   *
   * Example:
   * KES 500 = 50000 cents
   */
  priceCents?: number | null;

  aiSummary?: string | null;

  shortSummary?: string | null;

  keyThemes?: string[] | null;

  keywords?: string[] | null;

  readingTime?: number | null;

  targetAudience?: string | null;

  summary?: string | null;

  createdAt: string;

  updatedAt: string;
}

// ============================================================
// BOOK INPUT TYPES
// ============================================================

export type BookInput = {
  slug?: string | null;

  title: string;

  author: string;

  description?: string | null;

  genre?: string | null;

  coverImage?: string | null;

  pdfUrl?: string | null;

  pdfPreviewImage?: string | null;

  publishedYear?: number | null;

  pages?: number | null;

  rating?: number;

  priceCents?: number | null;

  aiSummary?: string | null;

  shortSummary?: string | null;

  keyThemes?: string[] | null;

  keywords?: string[] | null;

  readingTime?: number | null;

  targetAudience?: string | null;

  summary?: string | null;
};

export type BookUpdateInput =
  Partial<BookInput>;

// ============================================================
// ORDER TYPES
// ============================================================

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

// ============================================================
// PURCHASE TYPES
// ============================================================

export interface PurchaseStatus {
  purchased: boolean;

  orderId?: string;

  purchasedAt?: string;
}

// ============================================================
// DOWNLOAD TYPES
// ============================================================

export interface DownloadResponse {
  pdfUrl: string;

  title: string;
}

// ============================================================
// PDF UPLOAD TYPES
// ============================================================

export interface PdfUploadResponse {
  success?: boolean;

  message?: string;

  pdfUrl: string;

  url?: string;

  pdfPreviewImage?: string | null;

  filename?: string;

  size?: number;

  mimetype?: string;
}

// ============================================================
// INQUIRY TYPES
// ============================================================

export interface InquiryPayload {
  orderType: "INQUIRY";

  customerName: string;

  email: string;

  phoneNumber?: string | null;

  notes: string;

  deliveryNotes?: string | null;

  items: Array<{
    bookId: string;

    quantity: number;
  }>;
}

export interface InquiryResponse {
  success?: boolean;

  message?: string;

  order?: {
    id?: string;

    orderNumber?: string;
  };

  id?: string;

  orderNumber?: string;

  emailNotifications?: {
    admin?: boolean;

    customer?: boolean;

    [key: string]: any;
  };

  [key: string]: any;
}

// ============================================================
// SUBMIT BOOK INQUIRY
// ============================================================

/**
 * Submit a book inquiry.
 *
 * Backend endpoint:
 *
 * POST /api/orders
 *
 * The backend should recognize:
 *
 * orderType: "INQUIRY"
 */
export const submitBookInquiry =
  async (
    payload: InquiryPayload
  ): Promise<InquiryResponse> => {
    if (!payload) {
      throw new Error(
        "Inquiry data is required."
      );
    }

    if (
      payload.orderType !==
      "INQUIRY"
    ) {
      throw new Error(
        "Invalid inquiry type."
      );
    }

    if (
      !payload.customerName?.trim()
    ) {
      throw new Error(
        "Customer name is required."
      );
    }

    if (!payload.email?.trim()) {
      throw new Error(
        "Customer email is required."
      );
    }

    if (!payload.notes?.trim()) {
      throw new Error(
        "Inquiry message is required."
      );
    }

    if (
      !Array.isArray(
        payload.items
      ) ||
      payload.items.length === 0
    ) {
      throw new Error(
        "At least one book is required."
      );
    }

    console.log(
      "📨 Submitting book inquiry:",
      payload
    );

    const response =
      await apiFetch<InquiryResponse>(
        "/api/orders",
        {
          method: "POST",

          body: JSON.stringify({
            orderType:
              "INQUIRY",

            customerName:
              payload.customerName.trim(),

            email:
              payload.email
                .trim()
                .toLowerCase(),

            phoneNumber:
              payload.phoneNumber
                ?.trim() || null,

            notes:
              payload.notes.trim(),

            deliveryNotes:
              payload.deliveryNotes
                ?.trim() ||
              payload.notes.trim(),

            items:
              payload.items,
          }),
        }
      );

    console.log(
      "✅ Book inquiry submitted:",
      response
    );

    console.log(
      "📧 Inquiry email notification status:",
      response?.emailNotifications
    );

    return response;
  };

// ============================================================
// GET ALL BOOKS
// ============================================================

export const getBooks =
  async (): Promise<Book[]> => {
    if (USE_MOCK_DATA) {
      console.log(
        "📚 Using mock data - showing sample books"
      );

      return mockBooks.map(
        (book) => ({
          ...book,

          createdAt:
            new Date().toISOString(),

          updatedAt:
            new Date().toISOString(),
        })
      ) as Book[];
    }

    return apiFetch<Book[]>(
      "/api/books"
    );
  };

// ============================================================
// GET SINGLE BOOK
// ============================================================

export const getBook =
  async (
    idOrSlug: string
  ): Promise<Book> => {
    if (USE_MOCK_DATA) {
      console.log(
        "📚 Using mock data for book:",
        idOrSlug
      );

      const book =
        mockBooks.find(
          (b) =>
            b.id === idOrSlug ||
            b.slug === idOrSlug
        );

      if (!book) {
        throw new Error(
          "Book not found"
        );
      }

      return {
        ...book,

        createdAt:
          new Date().toISOString(),

        updatedAt:
          new Date().toISOString(),
      } as Book;
    }

    return apiFetch<Book>(
      `/api/books/${encodeURIComponent(
        idOrSlug
      )}`
    );
  };

// ============================================================
// CREATE BOOK
// ============================================================

export const createBook = (
  bookData: BookInput
): Promise<Book> => {
  if (USE_MOCK_DATA) {
    console.warn(
      "⚠️ Mock mode: createBook"
    );

    const newBook = {
      ...bookData,

      id: Date.now().toString(),

      createdAt:
        new Date().toISOString(),

      updatedAt:
        new Date().toISOString(),

      rating:
        bookData.rating ?? 0,
    } as Book;

    return Promise.resolve(
      newBook
    );
  }

  return apiFetch<Book>(
    "/api/books",
    {
      method: "POST",

      body: JSON.stringify(
        bookData
      ),
    }
  );
};

// ============================================================
// UPDATE BOOK
// ============================================================

export const updateBook = (
  id: string,
  bookData: BookUpdateInput
): Promise<Book> => {
  if (USE_MOCK_DATA) {
    console.warn(
      "⚠️ Mock mode: updateBook"
    );

    const existingBook =
      mockBooks.find(
        (b) => b.id === id
      );

    if (!existingBook) {
      return Promise.reject(
        new Error(
          "Book not found"
        )
      );
    }

    const updatedBook = {
      ...existingBook,

      ...bookData,

      id,

      updatedAt:
        new Date().toISOString(),

      rating:
        bookData.rating !==
        undefined
          ? bookData.rating
          : existingBook.rating,
    } as Book;

    return Promise.resolve(
      updatedBook
    );
  }

  return apiFetch<Book>(
    `/api/books/${encodeURIComponent(
      id
    )}`,
    {
      method: "PUT",

      body: JSON.stringify(
        bookData
      ),
    }
  );
};

// ============================================================
// DELETE BOOK
// ============================================================

export const deleteBook = (
  id: string
): Promise<{
  message: string;
}> => {
  if (USE_MOCK_DATA) {
    console.warn(
      "⚠️ Mock mode: deleteBook"
    );

    return Promise.resolve({
      message:
        "Book deleted (mock)",
    });
  }

  return apiFetch<{
    message: string;
  }>(
    `/api/books/${encodeURIComponent(
      id
    )}`,
    {
      method: "DELETE",
    }
  );
};

// ============================================================
// PDF UPLOAD
// ============================================================

/**
 * Upload a PDF to the backend.
 *
 * IMPORTANT:
 * Do NOT manually set Content-Type.
 *
 * The browser automatically sets:
 *
 * multipart/form-data; boundary=...
 */
export const uploadBookPdf =
  async (
    file: File
  ): Promise<PdfUploadResponse> => {
    if (!file) {
      throw new Error(
        "No PDF file selected."
      );
    }

    if (
      file.type !==
        "application/pdf" &&
      !file.name
        .toLowerCase()
        .endsWith(".pdf")
    ) {
      throw new Error(
        "Please select a valid PDF file."
      );
    }

    const formData =
      new FormData();

    formData.append(
      "file",
      file
    );

    console.log(
      "📤 Uploading PDF:",
      file.name
    );

    const response =
      await apiFetch<PdfUploadResponse>(
        "/api/upload-pdf",
        {
          method: "POST",

          body: formData,
        }
      );

    const pdfUrl =
      response.pdfUrl ||
      response.url;

    if (!pdfUrl) {
      console.error(
        "❌ Upload succeeded but no PDF URL was returned:",
        response
      );

      throw new Error(
        "PDF upload succeeded, but the server did not return a PDF URL."
      );
    }

    return {
      ...response,

      pdfUrl,
    };
  };

// ============================================================
// UPDATE BOOK PDF
// ============================================================

export const uploadPdfAndUpdateBook =
  async (
    bookId: string,
    file: File
  ): Promise<Book> => {
    console.log(
      "📚 Uploading PDF for book:",
      bookId
    );

    const upload =
      await uploadBookPdf(file);

    if (!upload.pdfUrl) {
      throw new Error(
        "PDF URL was not returned after upload."
      );
    }

    console.log(
      "✅ PDF uploaded:",
      upload.pdfUrl
    );

    const updatedBook =
      await updateBook(
        bookId,
        {
          pdfUrl:
            upload.pdfUrl,

          ...(upload.pdfPreviewImage
            ? {
                pdfPreviewImage:
                  upload.pdfPreviewImage,
              }
            : {}),
        }
      );

    console.log(
      "✅ Book updated with PDF URL:",
      updatedBook.pdfUrl
    );

    return updatedBook;
  };

// ============================================================
// CHECKOUT STATUS
// ============================================================

export type CheckoutStatus = {
  enabled: boolean;
};

export const getCheckoutStatus =
  (): Promise<CheckoutStatus> => {
    if (USE_MOCK_DATA) {
      return Promise.resolve({
        enabled: false,
      });
    }

    return apiFetch<CheckoutStatus>(
      "/api/checkout/status"
    );
  };

// ============================================================
// CREATE CHECKOUT SESSION
// ============================================================

export const createCheckoutSession =
  (
    bookId: string
  ): Promise<{
    url: string;
  }> => {
    if (USE_MOCK_DATA) {
      console.warn(
        "⚠️ Mock mode: Stripe checkout disabled"
      );

      return Promise.resolve({
        url: "/#books",
      });
    }

    return apiFetch<{
      url: string;
    }>(
      "/api/checkout/session",
      {
        method: "POST",

        body: JSON.stringify({
          bookId,
        }),
      }
    );
  };

// ============================================================
// DOWNLOAD PURCHASED BOOK
// ============================================================

export const downloadBookPdf =
  async (
    bookId: string
  ): Promise<DownloadResponse> => {
    if (USE_MOCK_DATA) {
      console.warn(
        "⚠️ Mock mode: Returning placeholder PDF URL"
      );

      return {
        pdfUrl:
          "https://example.com/sample.pdf",

        title:
          "Sample Book",
      };
    }

    const response =
      await apiFetch<DownloadResponse>(
        `/api/books/${encodeURIComponent(
          bookId
        )}/download`
      );

    if (!response.pdfUrl) {
      throw new Error(
        "PDF URL not found."
      );
    }

    return response;
  };

// ============================================================
// DOWNLOAD BY EMAIL
// ============================================================

export const downloadBookByEmail =
  async (
    bookId: string,
    email: string
  ): Promise<DownloadResponse> => {
    if (USE_MOCK_DATA) {
      console.warn(
        "⚠️ Mock mode: Returning placeholder PDF URL"
      );

      return {
        pdfUrl:
          "https://example.com/sample.pdf",

        title:
          "Sample Book",
      };
    }

    return apiFetch<DownloadResponse>(
      `/api/checkout/download/${encodeURIComponent(
        bookId
      )}?email=${encodeURIComponent(
        email
      )}`
    );
  };

// ============================================================
// DOWNLOAD BOOK
// ============================================================

export const downloadBook =
  async (
    bookId: string,
    email: string
  ): Promise<void> => {
    try {
      const {
        pdfUrl,
        title,
      } =
        await downloadBookByEmail(
          bookId,
          email
        );

      if (!pdfUrl) {
        throw new Error(
          "PDF URL not available."
        );
      }

      window.open(
        pdfUrl,
        "_blank",
        "noopener,noreferrer"
      );

      const downloadedBooks =
        JSON.parse(
          localStorage.getItem(
            "downloaded_books"
          ) || "[]"
        );

      if (
        !downloadedBooks.includes(
          bookId
        )
      ) {
        localStorage.setItem(
          "downloaded_books",
          JSON.stringify([
            ...downloadedBooks,
            bookId,
          ])
        );
      }

      console.log(
        `✅ Download started for ${title}`
      );
    } catch (error) {
      console.error(
        "❌ Download error:",
        error
      );

      throw error;
    }
  };

// ============================================================
// CHECK PURCHASE STATUS
// ============================================================

export const checkPurchaseStatus =
  async (
    bookId: string,
    email: string
  ): Promise<PurchaseStatus> => {
    if (USE_MOCK_DATA) {
      const purchasedBooks =
        JSON.parse(
          localStorage.getItem(
            "purchased_books"
          ) || "[]"
        );

      const purchased =
        purchasedBooks.some(
          (book: any) =>
            book.id === bookId
        );

      return {
        purchased,
      };
    }

    return apiFetch<PurchaseStatus>(
      `/api/checkout/purchase/${encodeURIComponent(
        bookId
      )}?email=${encodeURIComponent(
        email
      )}`
    );
  };

// ============================================================
// GET USER PURCHASES
// ============================================================

export const getUserPurchases =
  async (
    email: string
  ): Promise<Order[]> => {
    if (USE_MOCK_DATA) {
      console.warn(
        "⚠️ Mock mode: Returning sample purchases"
      );

      return [];
    }

    return apiFetch<Order[]>(
      `/api/checkout/my-purchases?email=${encodeURIComponent(
        email
      )}`
    );
  };

// ============================================================
// APPROVE MANUAL PAYMENT
// ============================================================

export const approveManualPayment =
  async (data: {
    bookId: string;

    email: string;

    transactionCode: string;

    paymentMethod: string;

    amountCents?: number;
  }): Promise<{
    success: boolean;

    orderId: string;

    message: string;
  }> => {
    const token =
      getAdminToken();

    if (!token) {
      throw new Error(
        "Admin authentication required."
      );
    }

    return apiFetch<{
      success: boolean;

      orderId: string;

      message: string;
    }>(
      "/api/checkout/approve-manual",
      {
        method: "POST",

        body: JSON.stringify(
          data
        ),
      }
    );
  };

// ============================================================
// LOCAL PURCHASE STATE
// ============================================================

export const markBookAsPurchased =
  (
    bookId: string
  ): void => {
    const purchasedBooks =
      JSON.parse(
        localStorage.getItem(
          "purchased_books"
        ) || "[]"
      );

    if (
      !purchasedBooks.some(
        (book: any) =>
          book.id === bookId
      )
    ) {
      localStorage.setItem(
        "purchased_books",
        JSON.stringify([
          ...purchasedBooks,
          {
            id: bookId,

            purchasedAt:
              new Date().toISOString(),
          },
        ])
      );
    }
  };

// ============================================================
// CHECK LOCAL PURCHASE
// ============================================================

export const isBookPurchasedLocally =
  (
    bookId: string
  ): boolean => {
    const purchasedBooks =
      JSON.parse(
        localStorage.getItem(
          "purchased_books"
        ) || "[]"
      );

    return purchasedBooks.some(
      (book: any) =>
        book.id === bookId
    );
  };

// ============================================================
// GET DIRECT PDF URL
// ============================================================

export const getBookPdfUrl =
  async (
    bookId: string
  ): Promise<string> => {
    const book =
      await getBook(bookId);

    if (!book.pdfUrl) {
      throw new Error(
        "This book does not have a PDF uploaded yet."
      );
    }

    return book.pdfUrl;
  };

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default {
  getApiBase,

  apiFetch,

  submitBookInquiry,

  getBooks,

  getBook,

  createBook,

  updateBook,

  deleteBook,

  uploadBookPdf,

  uploadPdfAndUpdateBook,

  getBookPdfUrl,

  getCheckoutStatus,

  createCheckoutSession,

  downloadBookPdf,

  downloadBookByEmail,

  downloadBook,

  checkPurchaseStatus,

  getUserPurchases,

  approveManualPayment,

  markBookAsPurchased,

  isBookPurchasedLocally,
};