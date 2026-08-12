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

        const book = await apiFetch<BookResponse>(
          `/api/books/${id}`
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

    /*
     * Reset input so the same file can be
     * selected again later.
     */
    event.target.value = "";

    if (!file) {
      return;
    }

    /* Validate type */

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

    /* Validate size */

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

      setCoverFileName(
        file.name
      );

      console.log(
        "========================================"
      );

      console.log(
        "🖼️ STARTING COVER UPLOAD"
      );

      console.log(
        "File:",
        file.name
      );

      console.log(
        "Size:",
        file.size
      );

      console.log(
        "Type:",
        file.type
      );

      console.log(
        "========================================"
      );

      const formData =
        new FormData();

      /*
       * IMPORTANT:
       *
       * Your backend upload.routes.ts expects:
       *
       * uploadImage.single("cover")
       *
       * Therefore the field MUST be "cover".
       */
      formData.append(
        "cover",
        file
      );

      const response =
        await apiFetch<CoverUploadResponse>(
          "/api/upload-cover",
          {
            method: "POST",
            body: formData,
          }
        );

      console.log(
        "🖼️ COVER UPLOAD RESPONSE:",
        response
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

      /*
       * Save directly into React Hook Form.
       */
      setValue(
        "coverImage",
        coverUrl,
        {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        }
      );

      console.log(
        "✅ COVER URL SAVED:",
        coverUrl
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
    console.log(
      "🗑️ Removing book cover"
    );

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

      setPdfFileName(
        file.name
      );

      console.log(
        "========================================"
      );

      console.log(
        "📕 STARTING PDF UPLOAD"
      );

      console.log(
        "File:",
        file.name
      );

      console.log(
        "Size:",
        file.size
      );

      console.log(
        "Type:",
        file.type
      );

      console.log(
        "========================================"
      );

      const formData =
        new FormData();

      /*
       * Backend expects:
       *
       * uploadPdf.single("pdf")
       */
      formData.append(
        "pdf",
        file
      );

      const response =
        await apiFetch<PdfUploadResponse>(
          "/api/upload-pdf",
          {
            method: "POST",
            body: formData,
          }
        );

      console.log(
        "📕 PDF UPLOAD RESPONSE:",
        response
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

      /*
       * Save PDF URL.
       */
      setValue(
        "pdfUrl",
        response.pdfUrl,
        {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        }
      );

      /*
       * Save preview image URL.
       */
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

      console.log(
        "✅ PDF URL SAVED:",
        response.pdfUrl
      );

      console.log(
        "🖼️ PDF PREVIEW SAVED:",
        response.pdfPreviewImage
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
    console.log(
      "🗑️ Removing PDF"
    );

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
     GENERATE AI PREVIEW
     ========================================================================== */

  const generatePreviewForBook = async (
    bookId: string,
    uploadedPdfUrl?: string | null
  ) => {
    if (!bookId) {
      throw new Error(
        "Cannot generate preview without a book ID."
      );
    }

    if (!uploadedPdfUrl) {
      console.log(
        "ℹ️ No PDF attached. Skipping AI preview."
      );

      return null;
    }

    try {
      setGeneratingPreview(true);

      console.log(
        "========================================"
      );

      console.log(
        "🤖 GENERATING AI BOOK PREVIEW"
      );

      console.log(
        "Book ID:",
        bookId
      );

      console.log(
        "PDF URL:",
        uploadedPdfUrl
      );

      console.log(
        "========================================"
      );

      const response =
        await apiFetch<PreviewResponse>(
          `/api/books/${bookId}/generate-preview`,
          {
            method: "POST",
          }
        );

      console.log(
        "🤖 AI PREVIEW RESPONSE:",
        response
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
     SUBMIT
     ========================================================================== */

  const onSubmit = async (
    values: BookFormValues
  ) => {
    if (uploadingPdf) {
      toast.error(
        "Please wait for the PDF upload to finish."
      );
      return;
    }

    if (uploadingCover) {
      toast.error(
        "Please wait for the cover upload to finish."
      );
      return;
    }

    if (generatingPreview) {
      toast.error(
        "Please wait for preview generation to finish."
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

      console.log(
        "========================================"
      );

      console.log(
        "📦 FORM SUBMISSION"
      );

      console.log(
        "Title:",
        values.title
      );

      console.log(
        "Cover:",
        currentCoverImage
      );

      console.log(
        "PDF:",
        currentPdfUrl
      );

      console.log(
        "PDF Preview:",
        currentPreviewImage
      );

      console.log(
        "========================================"
      );

      /* --------------------------------------------------------------------
         PRICE
         -------------------------------------------------------------------- */

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

      /* --------------------------------------------------------------------
         NUMERIC VALUES
         -------------------------------------------------------------------- */

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

      /* --------------------------------------------------------------------
         PAYLOAD
         -------------------------------------------------------------------- */

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

      console.log(
        "📦 PAYLOAD:",
        JSON.stringify(
          payload,
          null,
          2
        )
      );

      let savedBook:
        | BookResponse
        | undefined;

      /* --------------------------------------------------------------------
         UPDATE
         -------------------------------------------------------------------- */

      if (
        isEditing &&
        id
      ) {
        console.log(
          "✏️ Updating existing book:",
          id
        );

        savedBook =
          await apiFetch<BookResponse>(
            `/api/books/${id}`,
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
         CREATE
         -------------------------------------------------------------------- */

      else {
        console.log(
          "📚 Creating new book"
        );

        savedBook =
          await apiFetch<BookResponse>(
            "/api/books",
            {
              method: "POST",
              body:
                JSON.stringify(
                  payload
                ),
            }
          );
      }

      /* --------------------------------------------------------------------
         SAVED
         -------------------------------------------------------------------- */

      console.log(
        "========================================"
      );

      console.log(
        "✅ BOOK SUCCESSFULLY SAVED"
      );

      console.log(
        "Saved book:",
        savedBook
      );

      console.log(
        "Book ID:",
        savedBook?.id
      );

      console.log(
        "Saved cover:",
        savedBook?.coverImage
      );

      console.log(
        "Saved PDF:",
        savedBook?.pdfUrl
      );

      console.log(
        "Saved preview:",
        savedBook?.pdfPreviewImage
      );

      console.log(
        "========================================"
      );

      if (!savedBook?.id) {
        throw new Error(
          "The backend saved the book but did not return a book ID."
        );
      }

      /* --------------------------------------------------------------------
         AI PREVIEW
         -------------------------------------------------------------------- */

      if (
        savedBook.pdfUrl
      ) {
        await generatePreviewForBook(
          savedBook.id,
          savedBook.pdfUrl
        );
      }

      /* --------------------------------------------------------------------
         SUCCESS
         -------------------------------------------------------------------- */

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

        {/* ================================================================
            HEADER
            ================================================================ */}

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

        {/* ================================================================
            FORM
            ================================================================ */}

        <form
          onSubmit={handleSubmit(
            onSubmit
          )}
          className="space-y-6"
        >

          {/* ==============================================================
              BASIC INFORMATION
              ============================================================== */}

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
                  Price
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

                <p className="mt-1 text-xs text-gray-500">
                  Enter the selling price.
                </p>

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

          {/* ==============================================================
              BOOK COVER
              ============================================================== */}

          <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">

            <div className="mb-6 flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50">
                <ImageIcon className="h-5 w-5 text-orange-600" />
              </div>

              <div>
                <h2 className="font-bold text-[#2E1208]">
                  Book Cover
                </h2>

                <p className="text-sm text-gray-500">
                  Upload the cover image for this book.
                </p>
              </div>

            </div>

            {/* UPLOAD */}

            <label
              className={`
                flex
                min-h-[180px]
                cursor-pointer
                flex-col
                items-center
                justify-center
                rounded-2xl
                border-2
                border-dashed
                p-6
                text-center
                transition
                ${uploadingCover
                  ? "cursor-not-allowed border-orange-300 bg-orange-50"
                  : "border-gray-300 hover:border-[#C17B4F] hover:bg-[#C17B4F]/5"
                }
              `}
            >

              {uploadingCover ? (
                <>
                  <Loader2 className="mb-3 h-10 w-10 animate-spin text-orange-600" />

                  <p className="font-semibold text-orange-700">
                    Uploading cover...
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Please wait.
                  </p>
                </>
              ) : (
                <>
                  <Upload className="mb-3 h-10 w-10 text-[#C17B4F]" />

                  <p className="font-semibold text-[#2E1208]">
                    Click to upload book cover
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    JPG, PNG, WebP or GIF up to 10MB
                  </p>
                </>
              )}

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif"
                className="hidden"
                disabled={
                  uploadingCover ||
                  uploadingPdf ||
                  generatingPreview
                }
                onChange={
                  handleCoverUpload
                }
              />

            </label>

            {/* COVER PREVIEW */}

            {coverImage ? (
              <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 p-5">

                <div className="flex items-start gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-100">
                    <ImageIcon className="h-6 w-6 text-green-700" />
                  </div>

                  <div className="min-w-0 flex-1">

                    <div className="flex flex-wrap items-center justify-between gap-3">

                      <div>
                        <p className="font-semibold text-green-800">
                          Cover uploaded
                        </p>

                        <p className="text-sm text-green-700">
                          {coverFileName ||
                            "Book cover"}
                        </p>
                      </div>

                      <button
                        type="button"
                        disabled={
                          loading ||
                          uploadingCover ||
                          uploadingPdf ||
                          generatingPreview
                        }
                        onClick={
                          handleRemoveCover
                        }
                        className="rounded-full p-2 text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                        title="Remove cover"
                      >
                        <X className="h-5 w-5" />
                      </button>

                    </div>

                    {/* IMAGE */}

                    <div className="mt-4 overflow-hidden rounded-xl border bg-white p-4">

                      <img
                        src={coverImage}
                        alt={
                          valuesToAlt(
                            watch("title")
                          )
                        }
                        className="mx-auto block max-h-[500px] w-auto max-w-full rounded-lg object-contain"
                        onLoad={() => {
                          console.log(
                            "✅ Cover image loaded successfully"
                          );
                        }}
                        onError={(event) => {
                          console.error(
                            "❌ Cover image failed to load:",
                            coverImage
                          );

                          event.currentTarget.style.display =
                            "none";
                        }}
                      />

                    </div>

                    {/* URL */}

                    <div className="mt-4 rounded-lg bg-white p-3">

                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Cover Image URL
                      </p>

                      <p className="break-all text-xs text-gray-700">
                        {coverImage}
                      </p>

                    </div>

                    {/* OPEN IMAGE */}

                    <div className="mt-3">

                      <a
                        href={coverImage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-green-300 bg-white px-4 py-2 text-sm font-semibold text-green-700 hover:bg-green-100"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Open Cover
                      </a>

                    </div>

                  </div>
                </div>
              </div>
            ) : (
              !uploadingCover && (
                <div className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-700">
                  No book cover is currently attached.
                </div>
              )
            )}

          </section>

          {/* ==============================================================
              PDF
              ============================================================== */}

          <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">

            <div className="mb-6 flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>

              <div>
                <h2 className="font-bold text-[#2E1208]">
                  Digital PDF
                </h2>

                <p className="text-sm text-gray-500">
                  Upload the PDF for the digital edition.
                </p>
              </div>

            </div>

            {/* PDF UPLOAD */}

            <label
              className={`
                flex
                min-h-[180px]
                cursor-pointer
                flex-col
                items-center
                justify-center
                rounded-2xl
                border-2
                border-dashed
                p-6
                text-center
                transition
                ${uploadingPdf ||
                  generatingPreview
                  ? "cursor-not-allowed border-blue-300 bg-blue-50"
                  : "border-gray-300 hover:border-[#C17B4F] hover:bg-[#C17B4F]/5"
                }
              `}
            >

              {uploadingPdf ? (
                <>
                  <Loader2 className="mb-3 h-10 w-10 animate-spin text-blue-600" />

                  <p className="font-semibold text-blue-700">
                    Uploading PDF...
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Please wait.
                  </p>
                </>
              ) : (
                <>
                  <Upload className="mb-3 h-10 w-10 text-[#C17B4F]" />

                  <p className="font-semibold text-[#2E1208]">
                    Click to upload PDF
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    PDF files up to 20MB
                  </p>
                </>
              )}

              <input
                type="file"
                accept="application/pdf,.pdf"
                className="hidden"
                disabled={
                  uploadingPdf ||
                  uploadingCover ||
                  generatingPreview
                }
                onChange={
                  handlePdfUpload
                }
              />

            </label>

            {/* CURRENT PDF */}

            {pdfUrl ? (
              <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 p-5">

                <div className="flex items-start gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-100">
                    <FileText className="h-6 w-6 text-green-700" />
                  </div>

                  <div className="min-w-0 flex-1">

                    <div className="flex flex-wrap items-center justify-between gap-3">

                      <div>
                        <p className="font-semibold text-green-800">
                          PDF uploaded
                        </p>

                        <p className="text-sm text-green-700">
                          {pdfFileName ||
                            "Digital book PDF"}
                        </p>
                      </div>

                      <button
                        type="button"
                        disabled={
                          loading ||
                          uploadingPdf ||
                          uploadingCover ||
                          generatingPreview
                        }
                        onClick={
                          handleRemovePdf
                        }
                        className="rounded-full p-2 text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                        title="Remove PDF"
                      >
                        <X className="h-5 w-5" />
                      </button>

                    </div>

                    {/* PDF PREVIEW IMAGE */}

                    {pdfPreviewImage && (
                      <div className="mt-4 rounded-xl border bg-white p-4">

                        <p className="mb-3 text-sm font-semibold text-gray-700">
                          PDF Preview
                        </p>

                        <img
                          src={
                            pdfPreviewImage
                          }
                          alt="PDF first page preview"
                          className="mx-auto block max-h-[500px] w-auto max-w-full rounded-lg border object-contain"
                          onLoad={() => {
                            console.log(
                              "✅ PDF preview loaded"
                            );
                          }}
                          onError={() => {
                            console.error(
                              "❌ PDF preview failed:",
                              pdfPreviewImage
                            );
                          }}
                        />

                      </div>
                    )}

                    {/* PDF URL */}

                    <div className="mt-4 rounded-lg bg-white p-3">

                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        PDF URL
                      </p>

                      <p className="break-all text-xs text-gray-700">
                        {pdfUrl}
                      </p>

                    </div>

                    {/* ACTIONS */}

                    <div className="mt-4 flex flex-wrap gap-3">

                      <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-green-300 bg-white px-4 py-2 text-sm font-semibold text-green-700 hover:bg-green-100"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Open PDF
                      </a>

                      {pdfPreviewImage && (
                        <a
                          href={
                            pdfPreviewImage
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full border border-blue-300 bg-white px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Open Preview
                        </a>
                      )}

                    </div>

                  </div>
                </div>
              </div>
            ) : (
              !uploadingPdf &&
              !generatingPreview && (
                <div className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-700">
                  No PDF is currently attached to this book.
                </div>
              )
            )}

          </section>

          {/* ==============================================================
              AI PREVIEW
              ============================================================== */}

          <section className="rounded-2xl border border-purple-100 bg-purple-50 p-6">

            <div className="flex items-start gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-100">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>

              <div>

                <h3 className="font-bold text-purple-900">
                  AI Book Preview
                </h3>

                <p className="mt-1 text-sm leading-6 text-purple-800">
                  After the book is saved with a
                  PDF, the system automatically
                  analyzes the uploaded PDF and
                  generates the book preview.
                </p>

                <div className="mt-3 rounded-lg bg-white/70 p-3 text-xs text-purple-700">

                  <p>
                    <strong>
                      PDF →
                    </strong>{" "}
                    AI analysis →
                    summary →
                    key themes →
                    reading information →
                    Preview
                  </p>

                </div>

              </div>

            </div>

          </section>

          {/* ==============================================================
              SAVE
              ============================================================== */}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

            <Button
              type="button"
              variant="outline"
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
              className="rounded-full px-6"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                loading ||
                uploadingPdf ||
                uploadingCover ||
                generatingPreview
              }
              className="rounded-full bg-[#C17B4F] px-7 text-white hover:bg-[#A55E36]"
            >

              {loading ||
                generatingPreview ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Save className="mr-2 h-5 w-5" />
              )}

              {generatingPreview
                ? "Generating Preview..."
                : loading
                  ? "Saving..."
                  : isEditing
                    ? "Save Changes"
                    : "Create Book"}

            </Button>

          </div>

        </form>

      </div>
    </div>
  );
};

/* ==========================================================================
   HELPER
   ========================================================================== */

function valuesToAlt(
  title: string
): string {
  return title
    ? `${title} book cover`
    : "Book cover";
}

export default BookFormPage;