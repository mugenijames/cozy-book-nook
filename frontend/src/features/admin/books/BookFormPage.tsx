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
  Upload,
  X,
} from "lucide-react";

import { toast } from "sonner";

import {
  Button,
} from "@/components/ui/button";

import {
  Input,
} from "@/components/ui/input";

import {
  Textarea,
} from "@/components/ui/textarea";

// IMPORTANT:
// apiFetch must be exported from src/services/api.ts
import {
  apiFetch,
} from "@/services/api";

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

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
  slug?: string | null;
}

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                  */
/* -------------------------------------------------------------------------- */

const BookFormPage = () => {
  const navigate = useNavigate();

  const { id } = useParams<{
    id: string;
  }>();

  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);

  const [loadingBook, setLoadingBook] =
    useState(isEditing);

  const [uploadingPdf, setUploadingPdf] =
    useState(false);

  const [uploadingCover, setUploadingCover] =
    useState(false);

  const [pdfFileName, setPdfFileName] =
    useState("");

  const [coverFileName, setCoverFileName] =
    useState("");

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

  const pdfUrl = watch("pdfUrl");

  const coverImage = watch("coverImage");

  /* ------------------------------------------------------------------------ */
  /* LOAD EXISTING BOOK                                                       */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!id) {
      setLoadingBook(false);
      return;
    }

    const loadBook = async () => {
      try {
        setLoadingBook(true);

        const book =
          await apiFetch<BookResponse>(
            `/api/books/${id}`
          );

        console.log(
          "📚 Existing book loaded:",
          book
        );

        reset({
          title: book.title || "",

          author: book.author || "",

          description:
            book.description || "",

          genre: book.genre || "",

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
                  Number(book.priceCents) / 100
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

          console.log(
            "📕 Existing PDF URL:",
            book.pdfUrl
          );
        }

        if (book.coverImage) {
          setCoverFileName(
            "Existing uploaded cover"
          );

          console.log(
            "🖼️ Existing cover URL:",
            book.coverImage
          );
        }
      } catch (error) {
        console.error(
          "❌ Failed to load book:",
          error
        );

        toast.error(
          "Failed to load book"
        );
      } finally {
        setLoadingBook(false);
      }
    };

    void loadBook();
  }, [id, reset]);

  /* ------------------------------------------------------------------------ */
  /* COVER IMAGE UPLOAD                                                       */
  /* ------------------------------------------------------------------------ */

  const handleCoverUpload = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    /* ---------------------------------------------------------------------- */
    /* Validate image type                                                    */
    /* ---------------------------------------------------------------------- */

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      toast.error(
        "Please select a JPG, PNG, or WebP image."
      );

      event.target.value = "";

      return;
    }

    /* ---------------------------------------------------------------------- */
    /* Validate size                                                          */
    /* ---------------------------------------------------------------------- */

    const MAX_SIZE =
      10 * 1024 * 1024;

    if (file.size > MAX_SIZE) {
      toast.error(
        "Book cover must be smaller than 10MB."
      );

      event.target.value = "";

      return;
    }

    try {
      setUploadingCover(true);

      setCoverFileName(
        file.name
      );

      console.log(
        "🖼️ Starting cover upload:",
        {
          name: file.name,
          size: file.size,
          type: file.type,
        }
      );

      const formData =
        new FormData();

      formData.append(
        "cover",
        file
      );

      /* -------------------------------------------------------------------- */
      /* Upload to backend                                                    */
      /* -------------------------------------------------------------------- */

      const apiBase =
        import.meta.env
          .VITE_API_BASE_URL ||
        "http://localhost:5000";

      const token =
        localStorage.getItem(
          "admin_token"
        );

      const response =
        await fetch(
          `${apiBase}/api/upload-cover`,
          {
            method: "POST",

            body: formData,

            credentials: "include",

            headers: {
              ...(token
                ? {
                    Authorization:
                      `Bearer ${token}`,
                  }
                : {}),
            },
          }
        );

      const rawText =
        await response.text();

      let data: any = {};

      try {
        data = rawText
          ? JSON.parse(rawText)
          : {};
      } catch {
        console.error(
          "❌ Cover upload returned non-JSON:",
          rawText
        );
      }

      console.log(
        "🖼️ Cover upload response:",
        {
          status:
            response.status,
          ok:
            response.ok,
          data,
        }
      );

      if (!response.ok) {
        throw new Error(
          data?.error ||
            data?.message ||
            `Cover upload failed (${response.status})`
        );
      }

      /* -------------------------------------------------------------------- */
      /* Support different response names                                     */
      /* -------------------------------------------------------------------- */

      const uploadedCoverUrl =
        data?.url ||
        data?.coverImage ||
        data?.secure_url ||
        data?.secureUrl;

      if (!uploadedCoverUrl) {
        console.error(
          "❌ Cover upload succeeded but no URL was returned:",
          data
        );

        throw new Error(
          "Cover uploaded, but the server did not return a cover URL."
        );
      }

      /* -------------------------------------------------------------------- */
      /* Store URL in React Hook Form                                         */
      /* -------------------------------------------------------------------- */

      setValue(
        "coverImage",
        String(uploadedCoverUrl),
        {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        }
      );

      console.log(
        "✅ Cover URL stored in form:",
        uploadedCoverUrl
      );

      toast.success(
        "Book cover uploaded successfully"
      );
    } catch (error: any) {
      console.error(
        "❌ Cover upload error:",
        error
      );

      setCoverFileName("");

      setValue(
        "coverImage",
        "",
        {
          shouldDirty: true,
        }
      );

      toast.error(
        error?.message ||
          "Failed to upload book cover"
      );
    } finally {
      setUploadingCover(false);

      event.target.value = "";
    }
  };

  /* ------------------------------------------------------------------------ */
  /* REMOVE COVER                                                             */
  /* ------------------------------------------------------------------------ */

  const handleRemoveCover = () => {
    setValue(
      "coverImage",
      "",
      {
        shouldDirty: true,
        shouldTouch: true,
      }
    );

    setCoverFileName("");

    toast.success(
      "Book cover removed"
    );
  };

  /* ------------------------------------------------------------------------ */
  /* PDF UPLOAD                                                               */
  /* ------------------------------------------------------------------------ */

  const handlePdfUpload = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      file.type !==
        "application/pdf" &&
      !file.name
        .toLowerCase()
        .endsWith(".pdf")
    ) {
      toast.error(
        "Please select a PDF file."
      );

      event.target.value = "";

      return;
    }

    const MAX_SIZE =
      50 * 1024 * 1024;

    if (file.size > MAX_SIZE) {
      toast.error(
        "PDF must be smaller than 50MB."
      );

      event.target.value = "";

      return;
    }

    try {
      setUploadingPdf(true);

      setPdfFileName(
        file.name
      );

      console.log(
        "📕 Starting PDF upload:",
        {
          name: file.name,
          size: file.size,
          type: file.type,
        }
      );

      const formData =
        new FormData();

      formData.append(
        "pdf",
        file
      );

      const apiBase =
        import.meta.env
          .VITE_API_BASE_URL ||
        "http://localhost:5000";

      const token =
        localStorage.getItem(
          "admin_token"
        );

      const response =
        await fetch(
          `${apiBase}/api/upload-pdf`,
          {
            method: "POST",

            body: formData,

            credentials: "include",

            headers: {
              ...(token
                ? {
                    Authorization:
                      `Bearer ${token}`,
                  }
                : {}),
            },
          }
        );

      const rawText =
        await response.text();

      let data: any = {};

      try {
        data = rawText
          ? JSON.parse(rawText)
          : {};
      } catch {
        console.error(
          "❌ Upload returned non-JSON:",
          rawText
        );
      }

      console.log(
        "📕 PDF upload response:",
        {
          status:
            response.status,
          ok:
            response.ok,
          data,
        }
      );

      if (!response.ok) {
        throw new Error(
          data?.error ||
            data?.message ||
            `PDF upload failed (${response.status})`
        );
      }

      const uploadedPdfUrl =
        data?.url ||
        data?.pdfUrl ||
        data?.secure_url ||
        data?.secureUrl;

      if (!uploadedPdfUrl) {
        console.error(
          "❌ Upload succeeded but no URL was returned:",
          data
        );

        throw new Error(
          "PDF uploaded, but the server did not return a PDF URL."
        );
      }

      setValue(
        "pdfUrl",
        String(uploadedPdfUrl),
        {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        }
      );

      console.log(
        "✅ PDF URL stored in form:",
        uploadedPdfUrl
      );

      toast.success(
        "PDF uploaded successfully"
      );
    } catch (error: any) {
      console.error(
        "❌ PDF Upload error:",
        error
      );

      setPdfFileName("");

      setValue(
        "pdfUrl",
        "",
        {
          shouldDirty: true,
        }
      );

      toast.error(
        error?.message ||
          "Failed to upload PDF"
      );
    } finally {
      setUploadingPdf(false);

      event.target.value = "";
    }
  };

  /* ------------------------------------------------------------------------ */
  /* REMOVE PDF                                                               */
  /* ------------------------------------------------------------------------ */

  const handleRemovePdf = () => {
    setValue(
      "pdfUrl",
      "",
      {
        shouldDirty: true,
        shouldTouch: true,
      }
    );

    setPdfFileName("");

    toast.success(
      "PDF removed from this book"
    );
  };

  /* ------------------------------------------------------------------------ */
  /* SUBMIT                                                                   */
  /* ------------------------------------------------------------------------ */

  const onSubmit = async (
    values: BookFormValues
  ) => {
    if (
      uploadingPdf ||
      uploadingCover
    ) {
      toast.error(
        "Please wait for all uploads to finish."
      );

      return;
    }

    try {
      setLoading(true);

      const currentPdfUrl =
        values.pdfUrl?.trim() ||
        null;

      const currentCoverImage =
        values.coverImage?.trim() ||
        null;

      console.log(
        "========================================"
      );

      console.log(
        "📦 FORM SUBMISSION"
      );

      console.log(
        "PDF URL:",
        currentPdfUrl
      );

      console.log(
        "COVER URL:",
        currentCoverImage
      );

      console.log(
        "========================================"
      );

      /* -------------------------------------------------------------------- */
      /* PRICE                                                                 */
      /* -------------------------------------------------------------------- */

      let priceCents:
        | number
        | null = null;

      if (
        values.listPrice !==
          undefined &&
        values.listPrice !==
          null &&
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

      /* -------------------------------------------------------------------- */
      /* PAYLOAD                                                               */
      /* -------------------------------------------------------------------- */

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

        publishedYear:
          values.publishedYear.trim() !==
          ""
            ? Number(
                values.publishedYear
              )
            : null,

        pages:
          values.pages.trim() !==
          ""
            ? Number(
                values.pages
              )
            : null,

        rating:
          values.rating.trim() !==
          ""
            ? Number(
                values.rating
              )
            : 0,

        priceCents,

        /*
         * IMPORTANT:
         * This is now the Cloudinary URL returned
         * after uploading the actual cover image.
         */
        coverImage:
          currentCoverImage,

        /*
         * PDF uploaded through the PDF uploader.
         */
        pdfUrl:
          currentPdfUrl,

        pdfPreviewImage:
          values.pdfPreviewImage.trim() ||
          null,

        slug:
          values.slug.trim() ||
          undefined,
      };

      console.log(
        "📦 PAYLOAD BEING SENT TO BACKEND:"
      );

      console.log(
        JSON.stringify(
          payload,
          null,
          2
        )
      );

      let savedBook:
        | BookResponse
        | undefined;

      /* -------------------------------------------------------------------- */
      /* UPDATE                                                               */
      /* -------------------------------------------------------------------- */

      if (
        isEditing &&
        id
      ) {
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

      /* -------------------------------------------------------------------- */
      /* CREATE                                                               */
      /* -------------------------------------------------------------------- */

      else {
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

      console.log(
        "✅ BOOK SAVED:",
        savedBook
      );

      console.log(
        "📕 SAVED PDF URL:",
        savedBook?.pdfUrl
      );

      console.log(
        "🖼️ SAVED COVER URL:",
        savedBook?.coverImage
      );

      /* -------------------------------------------------------------------- */
      /* VERIFY PDF                                                           */
      /* -------------------------------------------------------------------- */

      if (
        currentPdfUrl &&
        !savedBook?.pdfUrl
      ) {
        toast.warning(
          "Book saved, but the PDF URL was not returned by the server."
        );
      }

      /* -------------------------------------------------------------------- */
      /* VERIFY COVER                                                         */
      /* -------------------------------------------------------------------- */

      if (
        currentCoverImage &&
        !savedBook?.coverImage
      ) {
        toast.warning(
          "Book saved, but the cover image URL was not returned by the server."
        );
      }

      /* -------------------------------------------------------------------- */
      /* SUCCESS                                                              */
      /* -------------------------------------------------------------------- */

      if (
        currentPdfUrl &&
        currentCoverImage
      ) {
        toast.success(
          "Book, cover and PDF saved successfully."
        );
      } else if (
        currentPdfUrl
      ) {
        toast.success(
          "Book and PDF saved successfully."
        );
      } else if (
        currentCoverImage
      ) {
        toast.success(
          "Book and cover saved successfully."
        );
      } else {
        toast.success(
          isEditing
            ? "Book updated successfully."
            : "Book created successfully."
        );
      }

      navigate(
        "/admin/books"
      );
    } catch (error: any) {
      console.error(
        "❌ Submit error:",
        error
      );

      toast.error(
        error?.message ||
          "Failed to save book"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ------------------------------------------------------------------------ */
  /* LOADING                                                                  */
  /* ------------------------------------------------------------------------ */

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

  /* ------------------------------------------------------------------------ */
  /* RENDER                                                                   */
  /* ------------------------------------------------------------------------ */

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
                cover and digital PDF
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
                  Enter the selling price
                  in your currency.
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

          {/* ---------------------------------------------------------------- */}
          {/* BOOK COVER                                                        */}
          {/* ---------------------------------------------------------------- */}

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
                  Upload the actual book cover image.
                </p>
              </div>

            </div>

            {/* UPLOAD COVER */}

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
                ${
                  uploadingCover
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
                  <ImageIcon className="mb-3 h-10 w-10 text-[#C17B4F]" />

                  <p className="font-semibold text-[#2E1208]">
                    Click to upload book cover
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    JPG, PNG or WebP up to 10MB
                  </p>
                </>
              )}

              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                className="hidden"
                disabled={
                  uploadingCover
                }
                onChange={
                  handleCoverUpload
                }
              />

            </label>

            {/* COVER PREVIEW */}

            {coverImage && (
              <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 p-5">

                <div className="flex flex-col gap-5 sm:flex-row">

                  {/* IMAGE */}

                  <div className="flex justify-center sm:justify-start">
                    <div className="overflow-hidden rounded-xl border bg-white p-2 shadow-sm">
                      <img
                        src={
                          coverImage
                        }
                        alt={
                          "Book cover"
                        }
                        className="h-64 w-44 rounded-lg object-cover"
                        onError={(
                          event
                        ) => {
                          event.currentTarget.style.display =
                            "none";
                        }}
                      />
                    </div>
                  </div>

                  {/* INFORMATION */}

                  <div className="min-w-0 flex-1">

                    <div className="flex items-start justify-between gap-3">

                      <div>
                        <p className="font-semibold text-green-800">
                          Cover uploaded
                        </p>

                        <p className="text-sm text-green-700">
                          {coverFileName ||
                            "Book cover image"}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={
                          handleRemoveCover
                        }
                        className="rounded-full p-2 text-red-600 transition hover:bg-red-100"
                        title="Remove cover"
                      >
                        <X className="h-5 w-5" />
                      </button>

                    </div>

                    <div className="mt-4 rounded-lg bg-white p-3">

                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Cover URL
                      </p>

                      <p className="break-all text-xs text-gray-700">
                        {coverImage}
                      </p>

                    </div>

                    <a
                      href={
                        coverImage
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center rounded-full border border-green-300 bg-white px-4 py-2 text-sm font-semibold text-green-700 hover:bg-green-100"
                    >
                      View Cover
                    </a>

                  </div>

                </div>

              </div>
            )}

            {!coverImage &&
              !uploadingCover && (
                <div className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-700">
                  No book cover is currently attached.
                </div>
              )}

          </section>

          {/* ---------------------------------------------------------------- */}
          {/* PDF                                                                */}
          {/* ---------------------------------------------------------------- */}

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
                  Upload the PDF that will be used
                  for the digital edition and preview.
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
                ${
                  uploadingPdf
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
                    Please wait until the upload finishes.
                  </p>
                </>
              ) : (
                <>
                  <Upload className="mb-3 h-10 w-10 text-[#C17B4F]" />

                  <p className="font-semibold text-[#2E1208]">
                    Click to upload PDF
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    PDF files up to 50MB
                  </p>
                </>
              )}

              <input
                type="file"
                accept="application/pdf,.pdf"
                className="hidden"
                disabled={
                  uploadingPdf
                }
                onChange={
                  handlePdfUpload
                }
              />

            </label>

            {/* CURRENT PDF */}

            {pdfUrl && (
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
                        onClick={
                          handleRemovePdf
                        }
                        className="rounded-full p-2 text-red-600 transition hover:bg-red-100"
                        title="Remove PDF"
                      >
                        <X className="h-5 w-5" />
                      </button>

                    </div>

                    <div className="mt-3 rounded-lg bg-white p-3">

                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        PDF URL
                      </p>

                      <p className="break-all text-xs text-gray-700">
                        {pdfUrl}
                      </p>

                    </div>

                    <div className="mt-4 flex flex-wrap gap-3">

                      <a
                        href={
                          pdfUrl
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center rounded-full border border-green-300 bg-white px-4 py-2 text-sm font-semibold text-green-700 hover:bg-green-100"
                      >
                        Open PDF
                      </a>

                    </div>

                  </div>

                </div>

              </div>
            )}

            {!pdfUrl &&
              !uploadingPdf && (
                <div className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-700">
                  No PDF is currently attached to this book.
                </div>
              )}

          </section>

          {/* ---------------------------------------------------------------- */}
          {/* SAVE                                                               */}
          {/* ---------------------------------------------------------------- */}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

            <Button
              type="button"
              variant="outline"
              disabled={
                loading ||
                uploadingPdf ||
                uploadingCover
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
                uploadingCover
              }
              className="rounded-full bg-[#C17B4F] px-7 text-white hover:bg-[#A55E36]"
            >

              {loading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Save className="mr-2 h-5 w-5" />
              )}

              {loading
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

export default BookFormPage;