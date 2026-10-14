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

export const getApiBase = (): string => {
  const configured =
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_URL;

  if (import.meta.env.DEV) {
    const devBase = configured || "http://localhost:5000";
    const cleanBase = devBase.replace(/\/+$/, "");
    console.log("📡 DEV API Base URL:", cleanBase);
    return cleanBase;
  }

  const prodBase =
    configured || "https://cozy-book-nook-1.onrender.com";
  const cleanBase = prodBase.replace(/\/+$/, "");
  console.log("📡 PROD API Base URL:", cleanBase);
  return cleanBase;
};

// ============================================================
// URL BUILDER
// ============================================================

const buildUrl = (endpoint: string): string => {
  const base = getApiBase();
  const cleanEndpoint = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`;

  return `${base}${cleanEndpoint}`;
};

// ============================================================
// ADMIN TOKEN
// ============================================================

const getAdminToken = (): string | null => {
  try {
    return localStorage.getItem("admin_token");
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
  const headers = new Headers(options.headers || {});

  if (
    !(options.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  console.log(`🌐 API ${options.method || "GET"} ${url}`);

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const contentType = response.headers.get("content-type") || "";
    let data: any = null;

    if (contentType.includes("application/json")) {
      try {
        data = await response.json();
      } catch {
        data = null;
      }
    } else {
      try {
        data = await response.text();
      } catch {
        data = null;
      }
    }

    if (!response.ok) {
      const serverMessage =
        typeof data === "object" && data
          ? data.error || data.message || data.detail
          : typeof data === "string"
          ? data
          : null;

      const message =
        serverMessage ||
        `Request failed with status ${response.status}`;

      console.error(`❌ API error ${response.status}:`, message);
      throw new Error(message);
    }

    return data as T;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.startsWith("API error (")) {
        throw error;
      }
      throw new Error(`API error (${endpoint}): ${error.message}`);
    }
    throw new Error(`API error (${endpoint}): Unknown error`);
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

export type BookUpdateInput = Partial<BookInput>;

// ============================================================
// COURSE TYPES
// ============================================================

export interface Lesson {
  id: string;
  title: string;
  description?: string | null;
  content?: string | null;
  videoUrl?: string | null;
  pdfUrl?: string | null;
  durationMinutes?: number | null;
  position: number;
  isFreePreview: boolean;
  isPublished: boolean;
  meetingUrl?: string | null;
  scheduledAt?: string | null;
  meetingInstructions?: string | null;
}

export interface CourseModule {
  id: string;
  title: string;
  description?: string | null;
  position: number;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  overview?: string | null;
  thumbnailUrl?: string | null;
  category?: string | null;
  level?: string | null;
  duration?: string | null;
  estimatedHours?: number | null;
  priceCents?: number | null;
  currency: string;
  isFree: boolean;
  isPublished: boolean;
  featured: boolean;
  unlockPercent: number;
  instructorName?: string | null;
  instructorTitle?: string | null;
  instructorBio?: string | null;
  instructorImage?: string | null;
  objectives?: any;
  targetAudience?: any;
  requirements?: any;
  whatYouLearn?: any;
  createdAt: string;
  updatedAt: string;
  modules?: CourseModule[];
  _count?: {
    enrollments?: number;
    modules?: number;
  };
}

export interface CourseEnrollment {
  id: string;
  courseId: string;
  fullName: string;
  email: string;
  phone?: string | null;
  paymentStatus: string;
  amountPaidCents: number;
  accessGranted: boolean;
  accessGrantedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  course?: Course;
  payments?: Array<{
    id: string;
    amountCents: number;
    method: string;
    transactionCode?: string | null;
    status: string;
    confirmedAt?: string | null;
    createdAt: string;
  }>;
}

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

export interface PurchaseStatus {
  purchased: boolean;
  orderId?: string;
  purchasedAt?: string;
}

export interface DownloadResponse {
  pdfUrl: string;
  title: string;
}

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

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  content: string;
  coverImage?: string | null;
  category?: string | null;
  tags?: string[] | null;
  author?: string | null;
  readingTime?: string | null;
  published: boolean;
  featured?: boolean;
  publishedAt?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  views?: number;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// SUBMIT BOOK INQUIRY
// ============================================================

export const submitBookInquiry = async (
  payload: InquiryPayload
): Promise<InquiryResponse> => {
  if (!payload) throw new Error("Inquiry data is required.");
  if (payload.orderType !== "INQUIRY") throw new Error("Invalid inquiry type.");
  if (!payload.customerName?.trim()) throw new Error("Customer name is required.");
  if (!payload.email?.trim()) throw new Error("Customer email is required.");
  if (!payload.notes?.trim()) throw new Error("Inquiry message is required.");
  if (!Array.isArray(payload.items) || payload.items.length === 0) {
    throw new Error("At least one book is required.");
  }

  const response = await apiFetch<InquiryResponse>("/api/orders", {
    method: "POST",
    body: JSON.stringify({
      orderType: "INQUIRY",
      customerName: payload.customerName.trim(),
      email: payload.email.trim().toLowerCase(),
      phoneNumber: payload.phoneNumber?.trim() || null,
      notes: payload.notes.trim(),
      deliveryNotes: payload.deliveryNotes?.trim() || payload.notes.trim(),
      items: payload.items,
    }),
  });

  return response;
};

// ============================================================
// BOOK FUNCTIONS
// ============================================================

export const getBooks = async (): Promise<Book[]> => {
  if (USE_MOCK_DATA) {
    return mockBooks.map((book) => ({
      ...book,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })) as Book[];
  }
  return apiFetch<Book[]>("/api/books");
};

export const getBook = async (idOrSlug: string): Promise<Book> => {
  if (USE_MOCK_DATA) {
    const book = mockBooks.find((b) => b.id === idOrSlug || b.slug === idOrSlug);
    if (!book) throw new Error("Book not found");
    return { ...book, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as Book;
  }
  return apiFetch<Book>(`/api/books/${encodeURIComponent(idOrSlug)}`);
};

export const createBook = (bookData: BookInput): Promise<Book> => {
  if (USE_MOCK_DATA) {
    return Promise.resolve({
      ...bookData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      rating: bookData.rating ?? 0,
    } as Book);
  }
  return apiFetch<Book>("/api/books", {
    method: "POST",
    body: JSON.stringify(bookData),
  });
};

export const updateBook = (id: string, bookData: BookUpdateInput): Promise<Book> => {
  if (USE_MOCK_DATA) {
    const existingBook = mockBooks.find((b) => b.id === id);
    if (!existingBook) return Promise.reject(new Error("Book not found"));
    return Promise.resolve({
      ...existingBook,
      ...bookData,
      id,
      updatedAt: new Date().toISOString(),
    } as Book);
  }
  return apiFetch<Book>(`/api/books/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(bookData),
  });
};

export const deleteBook = (id: string): Promise<{ message: string }> => {
  if (USE_MOCK_DATA) return Promise.resolve({ message: "Book deleted (mock)" });
  return apiFetch<{ message: string }>(`/api/books/${encodeURIComponent(id)}`, { method: "DELETE" });
};

// ============================================================
// COURSE API FUNCTIONS
// ============================================================

export const getPublicCourses = async (): Promise<Course[]> => {
  const data = await apiFetch<{ success: boolean; courses: Course[] }>("/api/courses");
  return data.courses || [];
};

export const getPublicCourseBySlug = async (slug: string): Promise<Course> => {
  const data = await apiFetch<{ success: boolean; course: Course }>(`/api/courses/${encodeURIComponent(slug)}`);
  return data.course;
};

export const enrolInCourse = async (
  courseId: string,
  payload: { fullName: string; email: string; phone?: string }
): Promise<{ success: boolean; alreadyEnrolled: boolean; enrollment: CourseEnrollment }> => {
  return apiFetch(`/api/courses/${encodeURIComponent(courseId)}/enrol`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const submitCoursePayment = async (
  enrollmentId: string,
  payload: { amountCents: number; method: string; transactionCode?: string; notes?: string }
): Promise<any> => {
  return apiFetch(`/api/courses/enrollments/${encodeURIComponent(enrollmentId)}/payments`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const getMyCourseEnrollment = async (courseId: string, email: string): Promise<any> => {
  return apiFetch(`/api/courses/${encodeURIComponent(courseId)}/my-enrollment?email=${encodeURIComponent(email)}`);
};

export const getProtectedLesson = async (courseId: string, lessonId: string, email: string): Promise<Lesson> => {
  const data = await apiFetch<{ success: boolean; lesson: Lesson }>(
    `/api/courses/${encodeURIComponent(courseId)}/lessons/${encodeURIComponent(lessonId)}?email=${encodeURIComponent(email)}`
  );
  return data.lesson;
};

// ============================================================
// ADMIN COURSE API FUNCTIONS
// ============================================================

export const getAdminCourses = async (): Promise<Course[]> => {
  const data = await apiFetch<{ success: boolean; courses: Course[] }>("/api/courses/admin/all");
  return data.courses || [];
};

export const createCourse = async (courseData: Partial<Course>): Promise<Course> => {
  const data = await apiFetch<{ success: boolean; course: Course }>("/api/courses/admin", {
    method: "POST",
    body: JSON.stringify(courseData),
  });
  return data.course;
};

export const updateCourse = async (id: string, courseData: Partial<Course>): Promise<Course> => {
  const data = await apiFetch<{ success: boolean; course: Course }>(`/api/courses/admin/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(courseData),
  });
  return data.course;
};

export const deleteCourse = async (id: string): Promise<{ message: string }> => {
  return apiFetch<{ message: string }>(`/api/courses/admin/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
};

export const createCourseModule = async (courseId: string, moduleData: { title: string; description?: string; position?: number }): Promise<CourseModule> => {
  const data = await apiFetch<{ success: boolean; module: CourseModule }>(`/api/courses/admin/${encodeURIComponent(courseId)}/modules`, {
    method: "POST",
    body: JSON.stringify(moduleData),
  });
  return data.module;
};

export const createModuleLesson = async (moduleId: string, lessonData: Partial<Lesson>): Promise<Lesson> => {
  const data = await apiFetch<{ success: boolean; lesson: Lesson }>(`/api/courses/admin/modules/${encodeURIComponent(moduleId)}/lessons`, {
    method: "POST",
    body: JSON.stringify(lessonData),
  });
  return data.lesson;
};

export const getCourseEnrollmentsAdmin = async (courseId: string): Promise<CourseEnrollment[]> => {
  const data = await apiFetch<{ success: boolean; enrollments: CourseEnrollment[] }>(`/api/courses/admin/${encodeURIComponent(courseId)}/enrollments`);
  return data.enrollments || [];
};

export const confirmAdminCoursePayment = async (
  enrollmentId: string,
  payload: { amountCents: number; method: string; transactionCode?: string; notes?: string }
): Promise<any> => {
  return apiFetch(`/api/courses/admin/enrollments/${encodeURIComponent(enrollmentId)}/confirm-payment`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

// ============================================================
// PDF & DOWNLOAD FUNCTIONS
// ============================================================

export const uploadBookPdf = async (file: File): Promise<PdfUploadResponse> => {
  if (!file) throw new Error("No PDF file selected.");
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiFetch<PdfUploadResponse>("/api/upload-pdf", {
    method: "POST",
    body: formData,
  });

  const pdfUrl = response.pdfUrl || response.url;
  if (!pdfUrl) throw new Error("PDF upload succeeded, but server returned no URL.");
  return { ...response, pdfUrl };
};

export const uploadPdfAndUpdateBook = async (bookId: string, file: File): Promise<Book> => {
  const upload = await uploadBookPdf(file);
  return updateBook(bookId, { pdfUrl: upload.pdfUrl });
};

export const downloadBookPdf = async (bookId: string): Promise<DownloadResponse> => {
  if (USE_MOCK_DATA) return { pdfUrl: "https://example.com/sample.pdf", title: "Sample Book" };
  const response = await apiFetch<DownloadResponse>(`/api/books/${encodeURIComponent(bookId)}/download`);
  if (!response.pdfUrl) throw new Error("PDF URL not found.");
  return response;
};

export const markBookAsPurchased = (bookId: string): void => {
  const purchasedBooks = JSON.parse(localStorage.getItem("purchased_books") || "[]");
  if (!purchasedBooks.some((book: any) => book.id === bookId)) {
    localStorage.setItem(
      "purchased_books",
      JSON.stringify([...purchasedBooks, { id: bookId, purchasedAt: new Date().toISOString() }])
    );
  }
};

export const isBookPurchasedLocally = (bookId: string): boolean => {
  const purchasedBooks = JSON.parse(localStorage.getItem("purchased_books") || "[]");
  return purchasedBooks.some((book: any) => book.id === bookId);
};

// ============================================================
// BLOG FUNCTIONS
// ============================================================

export const getBlogPosts = async (): Promise<BlogPost[]> => {
  if (USE_MOCK_DATA) return [];
  const data = await apiFetch<any>("/api/blogs");
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.blogs)) return data.blogs;
  if (Array.isArray(data?.posts)) return data.posts;
  return [];
};

export const getBlogPost = async (slug: string): Promise<BlogPost> => {
  const data = await apiFetch<any>(`/api/blogs/${encodeURIComponent(slug)}`);
  return data?.blog || data;
};

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default {
  getApiBase,
  apiFetch,
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  getPublicCourses,
  getPublicCourseBySlug,
  enrolInCourse,
  submitCoursePayment,
  getMyCourseEnrollment,
  getProtectedLesson,
  getAdminCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  createCourseModule,
  createModuleLesson,
  getCourseEnrollmentsAdmin,
  confirmAdminCoursePayment,
  uploadBookPdf,
  uploadPdfAndUpdateBook,
  downloadBookPdf,
  markBookAsPurchased,
  isBookPurchasedLocally,
  getBlogPosts,
  getBlogPost,
};