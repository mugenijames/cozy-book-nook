// frontend/src/features/admin/books/BookFormPage.tsx

import {
  useEffect,
  useState,
  type ChangeEvent,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  useForm,
} from "react-hook-form";

import {
  ArrowLeft,
  BookOpen,
  FileText,
  Image as ImageIcon,
  Loader2,
  Save,
  Sparkles,
  Upload,
  X,
  ExternalLink,
} from "lucide-react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

/* ==========================================================================
   TYPES
   ========================================================================== */

interface BookFormValues {
  title: string;
  author: string;
  description: string;
  genre: string;
  publishedYear: string;
  pages: string;
  rating: string;
  listPrice: string;
  coverImage: string;
  pdfUrl: string;
  pdfPreviewImage: string;
  slug: string;
}

interface BookResponse {
  id: string;
  title: string;
  author: string;

  description?: string | null;
  genre?: string | null;

  publishedYear?: number | null;
  pages?: number | null;
  rating?: number | null;

  priceCents?: number | null;

  coverImage?: string | null;

  pdfUrl?: string | null;
  pdfPreviewImage?: string | null;

  aiSummary?: string | null;
  pdfSummary?: string | null;
  shortSummary?: string | null;

  keyThemes?: string[] | null;
  keywords?: string[] | null;

  readingTime?: string | null;
  targetAudience?: string | null;

  slug?: string | null;
}

interface PreviewResponse {
  success: boolean;
  message?: string;

  preview?: {
    shortSummary?: string;
    pdfSummary?: string;
    keyThemes?: string[];
    keywords?: string[];
    readingTime?: string;
    targetAudience?: string;
  };
}

interface CoverUploadResponse {
  url?: string;
  secure_url?: string;
  secureUrl?: string;
  coverImage?: string;
  message?: string;
  error?: string;
}

interface PdfUploadResponse {
  success?: boolean;
  pdfUrl?: string;
  pdfPreviewImage?: string;
  publicId?: string;
  filename?: string;
  message?: string;
  error?: string;
}

/* ==========================================================================
   API CONFIGURATION
   ========================================================================== */

const getApiBase = (): string => {
  const configuredBase =
    import.meta.env.VITE_API_BASE_URL;

  if (configuredBase) {
    return String(configuredBase).replace(/\/+$/, "");
  }

  return "http://localhost:5000";
};

/* ==========================================================================
   API FETCH
   ========================================================================== */

async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const base = getApiBase();

  const cleanEndpoint = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`;

  const url = `${base}${cleanEndpoint}`;

  const token =
    localStorage.getItem("admin_token");

  console.log(
    `🌐 API ${options.method || "GET"} ${url}`
  );

  const headers = new Headers(
    options.headers || {}
  );

  /*
   * IMPORTANT:
   * Never manually set Content-Type when using FormData.
   */
  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set(
      "Content-Type",
      "application/json"
    );
  }

  if (token) {
    headers.set(
      "Authorization",
      `Bearer ${token}`
    );
  }

  const response = await fetch(
    url,
    {
      ...options,
      headers,
    }
  );

  const rawText =
    await response.text();

  let data: any = null;

  if (rawText) {
    try {
      data = JSON.parse(rawText);
    } catch {
      data = rawText;
    }
  }

  if (!response.ok) {
    const message =
      data?.error ||
      data?.message ||
      `Request failed with status ${response.status}`;

    throw new Error(
      `API error (${endpoint}): ${message}`
    );
  }

  return data as T;
}

/* ==========================================================================
   COMPONENT
   ========================================================================== */

const BookFormPage = () => {
  const navigate = useNavigate();

  const { id } = useParams<{
    id: string;
  }>();

  const isEditing = Boolean(id);

  /* ------------------------------------------------------------------------
     STATE
     ------------------------------------------------------------------------ */

  const [loading, setLoading] =
    useState(false);

  const [loadingBook, setLoadingBook] =
    useState(isEditing);

  const [uploadingPdf, setUploadingPdf] =
    useState(false);

  const [uploadingCover, setUploadingCover] =
    useState(false);

  const [generatingPreview, setGeneratingPreview] =
    useState(false);

  const [pdfFileName, setPdfFileName] =
    useState("");

  const [coverFileName, setCoverFileName] =
    useState("");

  /* ------------------------------------------------------------------------
     FORM
     ------------------------------------------------------------------------ */

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: {
      errors,
    },
  } = useForm<BookFormValues>({
    defaultValues: {
      title: "",
      author: "",
      description: "",
      genre: "",
      publishedYear: "",
      pages: "",
      rating: "",
      listPrice: "",
      coverImage: "",
      pdfUrl: "",
      pdfPreviewImage: "",
      slug: "",
    },
  });

  const pdfUrl =
    watch("pdfUrl");

  const coverImage =
    watch("coverImage");

  const pdfPreviewImage =
    watch("pdfPreviewImage");

  /* ==========================================================================
     LOAD EXISTING BOOK
     ========================================================================== */

  useEffect(() => {
    if (!id) {
      setLoadingBook(false);
      return;
    }

    const loadBook = async () => {
      try {
        setLoadingBook(true);

        // Fetch using the admin endpoint to ensure pdfUrl is included
        const book = await apiFetch<BookResponse>(
          `/api/admin/books/${id}`
        );

        console.log(
          "📚 Existing book loaded:",
          book
        );

        reset({
          title:
            book.title || "",

          author:
            book.author || "",

          description:
            book.description || "",

          genre:
            book.genre || "",

          publishedYear:
            book.publishedYear != null
              ? String(book.publishedYear)
              : "",

          pages:
            book.pages != null
              ? String(book.pages)
              : "",

          rating:
            book.rating != null
              ? String(book.rating)
              : "",

          listPrice:
            book.priceCents != null
              ? (
                  Number(book.priceCents) /
                  100
                ).toFixed(2)
              : "",

          coverImage:
            book.coverImage || "",

          pdfUrl:
            book.pdfUrl || "",

          pdfPreviewImage:
            book.pdfPreviewImage || "",

          slug:
            book.slug || "",
        });

        if (book.pdfUrl) {
          setPdfFileName(
            "Existing uploaded PDF"
          );
        }

        if (book.coverImage) {
          setCoverFileName(
            "Existing book cover"
          );
        }

        console.log(
          "📕 Existing PDF:",
          book.pdfUrl
        );

        console.log(
          "🖼️ Existing cover:",
          book.coverImage
        );

        console.log(
          "🖼️ Existing PDF preview:",
          book.pdfPreviewImage
        );
      } catch (error) {
        console.error(
          "❌ Failed to load book:",
          error
        );

        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to load book"
        );
      } finally {
        setLoadingBook(false);
      }
    };

    void loadBook();
  }, [id, reset]);

  /* ==========================================================================
     COVER UPLOAD
     ========================================================================== */

  const handleCoverUpload = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    event.target.value = "";

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "Please upload a JPG, PNG, WebP or GIF image."
      );
      return;
    }

    const maxSize =
      10 * 1024 * 1024;

    if (file.size > maxSize) {
      toast.error(
        "Book cover must be smaller than 10MB."
      );
      return;
    }

    try {
      setUploadingCover(true);
      setCoverFileName(file.name);

      const formData = new FormData();
      formData.append("cover", file);

      const response =
        await apiFetch<CoverUploadResponse>(
          "/api/upload-cover",
          {
            method: "POST",
            body: formData,
          }
        );

      const coverUrl =
        response.url ||
        response.secure_url ||
        response.secureUrl ||
        response.coverImage;

      if (!coverUrl) {
        throw new Error(
          response.error ||
          "Cover upload succeeded but no image URL was returned."
        );
      }

      setValue(
        "coverImage",
        coverUrl,
        {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        }
      );

      toast.success(
        "Book cover uploaded successfully."
      );
    } catch (error) {
      console.error(
        "❌ COVER UPLOAD ERROR:",
        error
      );

      setCoverFileName("");

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to upload book cover."
      );
    } finally {
      setUploadingCover(false);
    }
  };

  /* ==========================================================================
     REMOVE COVER
     ========================================================================== */

  const handleRemoveCover = () => {
    setValue(
      "coverImage",
      "",
      {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      }
    );

    setCoverFileName("");

    toast.success(
      "Book cover removed. Save the book to apply the change."
    );
  };

  /* ==========================================================================
     PDF UPLOAD
     ========================================================================== */

  const handlePdfUpload = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    event.target.value = "";

    if (!file) {
      return;
    }

    if (
      file.type !==
      "application/pdf"
    ) {
      toast.error(
        "Please select a PDF file."
      );
      return;
    }

    const maxSize =
      20 * 1024 * 1024;

    if (file.size > maxSize) {
      toast.error(
        "PDF must be smaller than 20MB."
      );
      return;
    }

    try {
      setUploadingPdf(true);
      setPdfFileName(file.name);

      const formData = new FormData();
      formData.append("pdf", file);

      const response =
        await apiFetch<PdfUploadResponse>(
          "/api/upload-pdf",
          {
            method: "POST",
            body: formData,
          }
        );

      if (
        !response.success ||
        !response.pdfUrl
      ) {
        throw new Error(
          response.error ||
          "PDF upload did not return a URL."
        );
      }

      setValue(
        "pdfUrl",
        response.pdfUrl,
        {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        }
      );

      setValue(
        "pdfPreviewImage",
        response.pdfPreviewImage ||
        "",
        {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        }
      );

      toast.success(
        "PDF uploaded successfully."
      );
    } catch (error) {
      console.error(
        "❌ PDF UPLOAD ERROR:",
        error
      );

      setPdfFileName("");

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to upload PDF."
      );
    } finally {
      setUploadingPdf(false);
    }
  };

  /* ==========================================================================
     REMOVE PDF
     ========================================================================== */

  const handleRemovePdf = () => {
    setValue(
      "pdfUrl",
      "",
      {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      }
    );

    setValue(
      "pdfPreviewImage",
      "",
      {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      }
    );

    setPdfFileName("");

    toast.success(
      "PDF removed. Save the book to apply the change."
    );
  };

  /* ==========================================================================
     GENRE & PREVIEW
     ========================================================================== */

  const generatePreviewForBook = async (
    bookId: string,
    uploadedPdfUrl?: string | null
  ) => {
    if (!bookId || !uploadedPdfUrl) {
      return null;
    }

    try {
      setGeneratingPreview(true);

      const response =
        await apiFetch<PreviewResponse>(
          `/api/books/${bookId}/generate-preview`,
          {
            method: "POST",
          }
        );

      if (!response.success) {
        throw new Error(
          response.message ||
          "Preview generation failed."
        );
      }

      toast.success(
        "AI book preview generated successfully."
      );

      return response;
    } catch (error) {
      console.error(
        "❌ AI preview generation failed:",
        error
      );

      toast.warning(
        error instanceof Error
          ? `Book saved, but preview generation failed: ${error.message}`
          : "Book saved, but preview generation failed."
      );

      return null;
    } finally {
      setGeneratingPreview(false);
    }
  };

  /* ==========================================================================
     SUBMIT (FIXED TO TARGET /api/admin/books)
     ========================================================================== */

  const onSubmit = async (
    values: BookFormValues
  ) => {
    if (uploadingPdf || uploadingCover || generatingPreview) {
      toast.error(
        "Please wait for ongoing uploads or tasks to finish."
      );
      return;
    }

    try {
      setLoading(true);

      const currentPdfUrl =
        values.pdfUrl?.trim() || null;

      const currentCoverImage =
        values.coverImage?.trim() || null;

      const currentPreviewImage =
        values.pdfPreviewImage?.trim() ||
        null;

      let priceCents:
        | number
        | null = null;

      if (
        values.listPrice &&
        values.listPrice.trim() !== ""
      ) {
        const price =
          Number(
            values.listPrice
          );

        if (
          Number.isFinite(price) &&
          price >= 0
        ) {
          priceCents =
            Math.round(
              price * 100
            );
        }
      }

      const publishedYear =
        values.publishedYear.trim() !== ""
          ? Number(
              values.publishedYear
            )
          : null;

      const pages =
        values.pages.trim() !== ""
          ? Number(
              values.pages
            )
          : null;

      const rating =
        values.rating.trim() !== ""
          ? Number(
              values.rating
            )
          : 0;

      const payload = {
        title:
          values.title.trim(),

        author:
          values.author.trim(),

        description:
          values.description.trim() ||
          null,

        genre:
          values.genre.trim() ||
          null,

        publishedYear,

        pages,

        rating,

        priceCents,

        coverImage:
          currentCoverImage,

        pdfUrl:
          currentPdfUrl,

        pdfPreviewImage:
          currentPreviewImage,

        slug:
          values.slug.trim() ||
          undefined,
      };

      let savedBook:
        | BookResponse
        | undefined;

      /* --------------------------------------------------------------------
         UPDATE BOOK (Targeting /api/admin/books/:id)
         -------------------------------------------------------------------- */

      if (
        isEditing &&
        id
      ) {
        savedBook =
          await apiFetch<BookResponse>(
            `/api/admin/books/${id}`,
            {
              method: "PUT",
              body:
                JSON.stringify(
                  payload
                ),
            }
          );
      }

      /* --------------------------------------------------------------------
         CREATE BOOK (Targeting /api/admin/books)
         -------------------------------------------------------------------- */

      else {
        savedBook =
          await apiFetch<BookResponse>(
            "/api/admin/books",
            {
              method: "POST",
              body:
                JSON.stringify(
                  payload
                ),
            }
          );
      }

      if (!savedBook?.id) {
        throw new Error(
          "The backend saved the book but did not return a book ID."
        );
      }

      if (
        savedBook.pdfUrl
      ) {
        await generatePreviewForBook(
          savedBook.id,
          savedBook.pdfUrl
        );
      }

      toast.success(
        isEditing
          ? "Book updated successfully."
          : "Book created successfully."
      );

      navigate(
        "/admin/books"
      );
    } catch (error) {
      console.error(
        "❌ SUBMIT ERROR:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save book."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ==========================================================================
     LOADING
     ========================================================================== */

  if (loadingBook) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-sm text-gray-500">
            Loading book...
          </p>
        </div>
      </div>
    );
  }

  /* ==========================================================================
     RENDER
     ========================================================================== */

  return (
    <div className="min-h-screen bg-[#EEF2F7] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">

        {/* HEADER */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={
                loading ||
                uploadingPdf ||
                uploadingCover ||
                generatingPreview
              }
              onClick={() =>
                navigate(
                  "/admin/books"
                )
              }
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>

            <div>
              <h1 className="text-2xl font-bold text-[#2E1208]">
                {isEditing
                  ? "Edit Book"
                  : "Add Book"}
              </h1>

              <p className="text-sm text-gray-500">
                Manage book information,
                cover and digital PDF.
              </p>
            </div>
          </div>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit(
            onSubmit
          )}
          className="space-y-6"
        >

          {/* BASIC INFORMATION */}
          <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C17B4F]/10">
                <BookOpen className="h-5 w-5 text-[#C17B4F]" />
              </div>

              <div>
                <h2 className="font-bold text-[#2E1208]">
                  Book Information
                </h2>

                <p className="text-sm text-gray-500">
                  Enter the details of the book.
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">

              {/* TITLE */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Title *
                </label>

                <Input
                  {...register(
                    "title",
                    {
                      required:
                        "Title is required",
                    }
                  )}
                  placeholder="Book title"
                />

                {errors.title && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* AUTHOR */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Author *
                </label>

                <Input
                  {...register(
                    "author",
                    {
                      required:
                        "Author is required",
                    }
                  )}
                  placeholder="Author name"
                />

                {errors.author && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.author.message}
                  </p>
                )}
              </div>

              {/* GENRE */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Genre
                </label>

                <Input
                  {...register(
                    "genre"
                  )}
                  placeholder="Fiction, Business, Christian..."
                />
              </div>

              {/* YEAR */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Published Year
                </label>

                <Input
                  type="number"
                  {...register(
                    "publishedYear"
                  )}
                  placeholder="2026"
                />
              </div>

              {/* PAGES */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Pages
                </label>

                <Input
                  type="number"
                  {...register(
                    "pages"
                  )}
                  placeholder="250"
                />
              </div>

              {/* RATING */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Rating
                </label>

                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  {...register(
                    "rating"
                  )}
                  placeholder="4.5"
                />
              </div>

              {/* PRICE */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Price ($)
                </label>

                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register(
                    "listPrice"
                  )}
                  placeholder="10.00"
                />
              </div>

              {/* SLUG */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Slug
                </label>

                <Input
                  {...register(
                    "slug"
                  )}
                  placeholder="book-title"
                />
              </div>

              {/* DESCRIPTION */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Description
                </label>

                <Textarea
                  {...register(
                    "description"
                  )}
                  rows={6}
                  placeholder="Write a description of the book..."
                />
              </div>

            </div>
          </section>

          {/* COVER IMAGE SECTION */}
          <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50">
                <ImageIcon className="h-5 w-5 text-orange-600" />
              </div>

              <div>
                <h2 className="font-bold text-[#2E1208]">
                  Book Cover Image
                </h2>
                <p className="text-sm text-gray-500">
                  Upload a cover image for the book.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {coverImage ? (
                <div className="flex items-center justify-between rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={coverImage}
                      alt="Cover Preview"
                      className="h-16 w-12 rounded object-cover shadow-sm"
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {coverFileName || "Cover Image Loaded"}
                      </p>
                      <a
                        href={coverImage}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1"
                      >
                        View Full Image <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleRemoveCover}
                  >
                    <X className="h-4 w-4 mr-1" /> Remove
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-6 text-center hover:border-gray-400">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm font-medium text-gray-700">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, WEBP up to 10MB
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    className="mt-4 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer"
                  />
                </div>
              )}
              {uploadingCover && (
                <div className="flex items-center gap-2 text-sm text-orange-600">
                  <Loader2 className="h-4 w-4 animate-spin" /> Uploading cover image...
                </div>
              )}
            </div>
          </section>

          {/* DIGITAL PDF SECTION */}
          <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>

              <div>
                <h2 className="font-bold text-[#2E1208]">
                  Digital Edition (PDF)
                </h2>
                <p className="text-sm text-gray-500">
                  Upload the book's PDF document for digital distribution.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {pdfUrl ? (
                <div className="flex items-center justify-between rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-10 items-center justify-center rounded bg-blue-100 text-blue-700 font-bold">
                      PDF
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {pdfFileName || "PDF Document Attached"}
                      </p>
                      <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1"
                      >
                        View PDF File <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleRemovePdf}
                  >
                    <X className="h-4 w-4 mr-1" /> Remove
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-6 text-center hover:border-gray-400">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm font-medium text-gray-700">
                    Click to upload or drag and drop PDF file
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PDF format up to 20MB
                  </p>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handlePdfUpload}
                    className="mt-4 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                  />
                </div>
              )}
              {uploadingPdf && (
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <Loader2 className="h-4 w-4 animate-spin" /> Uploading PDF file...
                </div>
              )}
            </div>
          </section>

          {/* SUBMIT BUTTON */}
          <div className="flex items-center justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              disabled={loading || uploadingPdf || uploadingCover}
              onClick={() => navigate("/admin/books")}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={loading || uploadingPdf || uploadingCover || generatingPreview}
              className="bg-[#2E1208] text-white hover:bg-[#3d180b]"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" /> {isEditing ? "Update Book" : "Create Book"}
                </>
              )}
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default BookFormPage;