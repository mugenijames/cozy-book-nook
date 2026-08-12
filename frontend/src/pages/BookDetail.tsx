import { useParams, Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Star,
  Calendar,
  User,
  Book,
  ArrowLeft,
  Loader2,
  ShoppingBag,
  Download,
  ChevronDown,
  ChevronUp,
  Eye,
  X,
  BookOpen,
  FileText,
  Clock,
  Users,
  Tag,
} from "lucide-react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { resolveBookCoverUrl } from "@/lib/resolveBookCover";

import {
  bookPurchaseHref,
  bookPurchaseLabel,
} from "@/config/purchase";

import { formatPrice } from "@/lib/formatPrice";

import {
  getBooks,
  downloadBookPdf,
  markBookAsPurchased,
  isBookPurchasedLocally,
} from "@/services/api";

import { PaymentModal } from "@/components/PaymentModal";

interface Book {
  id: string;
  title: string;
  author: string;
  slug?: string | null;

  description?: string | null;

  coverImage?: string | null;

  pdfUrl?: string | null;
  pdfPreviewImage?: string | null;

  genre?: string | null;

  publishedYear?: number | null;
  pages?: number | null;
  rating?: number | null;
  priceCents?: number | null;

  /*
   * AI-generated book analysis
   */
  aiSummary?: string | null;
  summary?: string | null;
  shortSummary?: string | null;

  keyThemes?: unknown;
  keywords?: unknown;

  readingTime?: string | null;
  targetAudience?: string | null;
}

const BookDetail = () => {
  const { slug } = useParams<{ slug: string }>();

  const [searchParams, setSearchParams] =
    useSearchParams();

  const [loading, setLoading] = useState(true);

  const [book, setBook] =
    useState<Book | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  const [downloading, setDownloading] =
    useState(false);

  const [descExpanded, setDescExpanded] =
    useState(false);

  const [purchased, setPurchased] =
    useState(false);

  const [showPayment, setShowPayment] =
    useState(false);

  const [showPdfPreview, setShowPdfPreview] =
    useState(false);

  /*
  |--------------------------------------------------------------------------
  | Fetch book
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (slug) {
      void fetchBookDetails();
    }
  }, [slug]);

  const fetchBookDetails = async () => {
    if (!slug) return;

    try {
      setLoading(true);
      setError(null);

      const books = await getBooks();

      const foundBook = books.find(
        (b: any) =>
          b.slug === slug ||
          String(b.id) === slug
      );

      if (!foundBook) {
        setError("Book not found");
        return;
      }

      const mapped: Book = {
        id: String(foundBook.id),

        title: foundBook.title,

        author: foundBook.author,

        slug:
          foundBook.slug ??
          undefined,

        description:
          foundBook.description ??
          undefined,

        coverImage:
          foundBook.coverImage ??
          undefined,

        pdfUrl:
          foundBook.pdfUrl ??
          undefined,

        pdfPreviewImage:
          foundBook.pdfPreviewImage ??
          undefined,

        genre:
          foundBook.genre ??
          undefined,

        publishedYear:
          foundBook.publishedYear ??
          undefined,

        pages:
          foundBook.pages ??
          undefined,

        rating:
          foundBook.rating ??
          undefined,

        priceCents:
          foundBook.priceCents ??
          undefined,

        /*
         * AI-generated fields
         */
        aiSummary:
          foundBook.aiSummary ??
          undefined,

        summary:
          foundBook.summary ??
          undefined,

        shortSummary:
          foundBook.shortSummary ??
          undefined,

        keyThemes:
          foundBook.keyThemes ??
          undefined,

        keywords:
          foundBook.keywords ??
          undefined,

        readingTime:
          foundBook.readingTime ??
          undefined,

        targetAudience:
          foundBook.targetAudience ??
          undefined,
      };

      setBook(mapped);

      setPurchased(
        isBookPurchasedLocally(
          String(foundBook.id)
        )
      );
    } catch (err) {
      console.error(
        "Failed to fetch book:",
        err
      );

      setError("Book not found");
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Checkout result
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const status =
      searchParams.get("checkout");

    if (!status || !book) return;

    if (status === "success") {
      toast.success(
        "Payment received — thank you! Your download is ready below."
      );

      markBookAsPurchased(book.id);

      setPurchased(true);

      searchParams.delete("checkout");

      setSearchParams(
        searchParams,
        {
          replace: true,
        }
      );
    }

    if (status === "cancel") {
      toast.message(
        "Checkout cancelled",
        {
          description:
            "You can try again whenever you're ready.",
        }
      );

      searchParams.delete("checkout");

      setSearchParams(
        searchParams,
        {
          replace: true,
        }
      );
    }
  }, [
    searchParams,
    setSearchParams,
    book,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Book pricing
  |--------------------------------------------------------------------------
  */

  const price =
    book?.priceCents != null
      ? Number(book.priceCents)
      : null;

  const isFree =
    price == null ||
    price === 0;

  /*
  |--------------------------------------------------------------------------
  | PDF availability
  |--------------------------------------------------------------------------
  |
  | IMPORTANT:
  |
  | Preview is ONLY available when a PDF has
  | actually been uploaded.
  |
  */

  const hasPdf =
    Boolean(
      book?.pdfUrl &&
      book.pdfUrl.trim()
    );

  /*
  |--------------------------------------------------------------------------
  | AI Preview availability
  |--------------------------------------------------------------------------
  |
  | We deliberately DO NOT use description here.
  |
  | The preview must come from the AI analysis
  | associated with the uploaded PDF.
  */

  const aiPreviewText =
    book?.summary?.trim() ||
    book?.aiSummary?.trim() ||
    book?.shortSummary?.trim() ||
    null;

  const hasAiPreview =
    Boolean(aiPreviewText);

  /*
  |--------------------------------------------------------------------------
  | PDF Download
  |--------------------------------------------------------------------------
  */

  const handleDownload = async () => {
    if (!book) return;

    if (!book.pdfUrl) {
      toast.error(
        "PDF not available for this book yet."
      );

      return;
    }

    setDownloading(true);

    try {
      /*
       * Free books and already purchased books
       * can open the PDF directly.
       */

      if (isFree || purchased) {
        window.open(
          book.pdfUrl,
          "_blank",
          "noopener,noreferrer"
        );

        toast.success(
          `Opening ${book.title}`
        );

        return;
      }

      /*
       * Paid book:
       * ask backend to authorize the download.
       */

      const {
        pdfUrl,
        title,
      } = await downloadBookPdf(
        book.id
      );

      if (!pdfUrl) {
        toast.error(
          "PDF URL not found."
        );

        return;
      }

      window.open(
        pdfUrl,
        "_blank",
        "noopener,noreferrer"
      );

      toast.success(
        `Opening ${title}`
      );
    } catch (error: any) {
      console.error(
        "Download error:",
        error
      );

      const message =
        error?.message || "";

      if (
        message
          .toLowerCase()
          .includes("purchase") ||
        message.includes("403")
      ) {
        toast.error(
          "Please purchase this book first to download."
        );

        setShowPayment(true);
      } else {
        toast.error(
          message ||
            "Failed to download PDF."
        );
      }
    } finally {
      setDownloading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Text-based PDF Preview
  |--------------------------------------------------------------------------
  |
  | The PDF itself is NOT displayed.
  |
  | We only show the AI-generated analysis of
  | the uploaded PDF.
  */

  const handlePreviewPdf = () => {
    if (!book?.pdfUrl) {
      toast.error(
        "Preview is only available when a PDF has been uploaded."
      );

      return;
    }

    setShowPdfPreview(true);
  };

  /*
  |--------------------------------------------------------------------------
  | Buy / Download
  |--------------------------------------------------------------------------
  */

  const handleBuyClick = () => {
    if (!book) return;

    if (!hasPdf) {
      toast.error(
        "PDF not available for this book yet."
      );

      return;
    }

    /*
     * Free book
     */

    if (isFree) {
      void handleDownload();

      return;
    }

    /*
     * Already purchased
     */

    if (purchased) {
      void handleDownload();

      return;
    }

    /*
     * Paid book
     */

    setShowPayment(true);
  };

  /*
  |--------------------------------------------------------------------------
  | Payment submitted
  |--------------------------------------------------------------------------
  */

  const handlePaymentSubmitted = () => {
    if (!book) return;

    toast.success(
      "Payment submitted! We'll verify and unlock your download shortly."
    );

    markBookAsPurchased(
      book.id
    );

    setPurchased(true);

    setShowPayment(false);
  };

  /*
  |--------------------------------------------------------------------------
  | Normalize AI JSON fields
  |--------------------------------------------------------------------------
  */

  const getStringArray = (
    value: unknown
  ): string[] => {
    if (Array.isArray(value)) {
      return value
        .filter(
          (item) =>
            typeof item === "string"
        )
        .map((item) =>
          item.trim()
        )
        .filter(Boolean);
    }

    if (
      typeof value === "string"
    ) {
      return value
        .split(",")
        .map((item) =>
          item.trim()
        )
        .filter(Boolean);
    }

    return [];
  };

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-[#EEF2F7] flex items-center justify-center px-6">
        <div className="flex flex-col items-center text-center">
          <Loader2 className="h-10 w-10 animate-spin text-[#C17B4F]" />

          <p className="mt-4 text-sm text-gray-600">
            Loading book...
          </p>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Error
  |--------------------------------------------------------------------------
  */

  if (error || !book) {
    return (
      <div className="min-h-[70vh] bg-[#EEF2F7] flex items-center justify-center px-6">
        <div className="max-w-md text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#C17B4F]/10">
            <BookOpen className="h-8 w-8 text-[#C17B4F]" />
          </div>

          <h1 className="mt-6 text-2xl font-bold text-[#2E1208]">
            {error || "Book not found"}
          </h1>

          <p className="mt-3 text-gray-600">
            The book you're looking for doesn't
            exist or may have been removed.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3">

            <Link to="/">
              <Button className="rounded-full bg-[#2E1208] px-6">
                Back to Home
              </Button>
            </Link>

            <Link to="/books">
              <Button
                variant="outline"
                className="rounded-full px-6"
              >
                Browse Books
              </Button>
            </Link>

          </div>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Description
  |--------------------------------------------------------------------------
  */

  const inquireHref =
    bookPurchaseHref(
      book.slug
    );

  const inquireExternal =
    inquireHref.startsWith(
      "http"
    );

  const DESC_LIMIT = 220;

  const longDesc =
    (book.description?.length ?? 0) >
    DESC_LIMIT;

  const visibleDesc =
    longDesc &&
    !descExpanded
      ? `${book.description!.slice(
          0,
          DESC_LIMIT
        )}…`
      : book.description;

  const coverSrc =
    resolveBookCoverUrl(
      book.coverImage
    );

  /*
  |--------------------------------------------------------------------------
  | AI Preview data
  |--------------------------------------------------------------------------
  */

  const themes =
    getStringArray(
      book.keyThemes
    );

  const keywords =
    getStringArray(
      book.keywords
    );

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <>
      {/* =========================================================
          TEXT-BASED BOOK PREVIEW MODAL
      ========================================================== */}

      <Dialog
        open={showPdfPreview}
        onOpenChange={
          setShowPdfPreview
        }
      >
        <DialogContent
          className="
            max-w-4xl
            w-[95vw]
            max-h-[90vh]
            overflow-hidden
            rounded-2xl
            p-0
          "
        >

          {/* Header */}

          <DialogHeader
            className="
              border-b
              bg-white
              px-6
              py-5
              pr-12
            "
          >

            <div className="flex items-start gap-3">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#C17B4F]/10">
                <BookOpen className="h-5 w-5 text-[#C17B4F]" />
              </div>

              <div className="min-w-0">

                <DialogTitle className="text-xl font-bold text-[#2E1208] sm:text-2xl">
                  Book Preview
                </DialogTitle>

                <p className="mt-1 text-sm text-gray-500">
                  {book.title}
                </p>

              </div>

            </div>

          </DialogHeader>

          {/* Preview content */}

          <div className="max-h-[calc(90vh-100px)] overflow-y-auto bg-[#F8FAFC] px-5 py-6 sm:px-8">

            {/* Book heading */}

            <div className="rounded-2xl border border-[#E8DED5] bg-white p-6 shadow-sm">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

                {coverSrc && (
                  <img
                    src={coverSrc}
                    alt={`${book.title} cover`}
                    className="
                      h-28
                      w-20
                      rounded-lg
                      object-cover
                      shadow-md
                    "
                    onError={(
                      event
                    ) => {
                      event.currentTarget.onerror =
                        null;

                      event.currentTarget.src =
                        "/placeholder.svg";
                    }}
                  />
                )}

                <div>

                  <h2 className="text-2xl font-bold text-[#2E1208] sm:text-3xl">
                    {book.title}
                  </h2>

                  <p className="mt-2 flex items-center gap-2 text-gray-600">
                    <User className="h-4 w-4 text-[#C17B4F]" />

                    by{" "}

                    <strong className="text-[#2E1208]">
                      {book.author}
                    </strong>
                  </p>

                  {book.genre && (
                    <span className="mt-3 inline-flex rounded-full bg-[#C17B4F]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#C17B4F]">
                      {book.genre}
                    </span>
                  )}

                </div>

              </div>

            </div>

            {/* AI summary */}

            <div className="mt-5 rounded-2xl border border-[#E8DED5] bg-white p-6 shadow-sm">

              <div className="flex items-center gap-2">

                <BookOpen className="h-5 w-5 text-[#C17B4F]" />

                <h3 className="text-xl font-bold text-[#2E1208]">
                  About this book
                </h3>

              </div>

              {hasAiPreview ? (
                <div className="mt-5">

                  <p className="whitespace-pre-line text-[15px] leading-8 text-gray-700 sm:text-base">
                    {aiPreviewText}
                  </p>

                  <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4">

                    <p className="text-sm leading-6 text-blue-700">
                      This preview is based on the
                      uploaded PDF and its AI-generated
                      analysis.
                    </p>

                  </div>

                </div>
              ) : (
                <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-5">

                  <div className="flex items-start gap-3">

                    <FileText className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

                    <div>

                      <p className="font-semibold text-amber-800">
                        Preview is being prepared
                      </p>

                      <p className="mt-1 text-sm leading-6 text-amber-700">
                        The PDF has been uploaded,
                        but the AI-generated book
                        summary is not available yet.
                        Please check again shortly.
                      </p>

                    </div>

                  </div>

                </div>
              )}

            </div>

            {/* Book information */}

            {(book.pages != null ||
              book.publishedYear != null ||
              book.readingTime ||
              book.targetAudience) && (

              <div className="mt-5 grid gap-4 sm:grid-cols-2">

                {book.pages != null && (
                  <div className="rounded-xl bg-[#EEF2F7] p-5">

                    <div className="flex items-center gap-3">

                      <FileText className="h-5 w-5 text-[#C17B4F]" />

                      <div>

                        <p className="text-sm text-gray-500">
                          Length
                        </p>

                        <p className="mt-1 font-bold text-[#2E1208]">
                          {book.pages} pages
                        </p>

                      </div>

                    </div>

                  </div>
                )}

                {book.publishedYear != null && (
                  <div className="rounded-xl bg-[#EEF2F7] p-5">

                    <div className="flex items-center gap-3">

                      <Calendar className="h-5 w-5 text-[#C17B4F]" />

                      <div>

                        <p className="text-sm text-gray-500">
                          Published
                        </p>

                        <p className="mt-1 font-bold text-[#2E1208]">
                          {book.publishedYear}
                        </p>

                      </div>

                    </div>

                  </div>
                )}

                {book.readingTime && (
                  <div className="rounded-xl bg-[#EEF2F7] p-5">

                    <div className="flex items-center gap-3">

                      <Clock className="h-5 w-5 text-[#C17B4F]" />

                      <div>

                        <p className="text-sm text-gray-500">
                          Reading time
                        </p>

                        <p className="mt-1 font-bold text-[#2E1208]">
                          {book.readingTime}
                        </p>

                      </div>

                    </div>

                  </div>
                )}

                {book.targetAudience && (
                  <div className="rounded-xl bg-[#EEF2F7] p-5">

                    <div className="flex items-center gap-3">

                      <Users className="h-5 w-5 text-[#C17B4F]" />

                      <div>

                        <p className="text-sm text-gray-500">
                          Ideal for
                        </p>

                        <p className="mt-1 font-bold text-[#2E1208]">
                          {book.targetAudience}
                        </p>

                      </div>

                    </div>

                  </div>
                )}

              </div>
            )}

            {/* Key themes */}

            {themes.length > 0 && (
              <div className="mt-5 rounded-2xl border border-[#E8DED5] bg-white p-6 shadow-sm">

                <div className="flex items-center gap-2">

                  <Tag className="h-5 w-5 text-[#C17B4F]" />

                  <h3 className="text-lg font-bold text-[#2E1208]">
                    Key Themes
                  </h3>

                </div>

                <div className="mt-4 flex flex-wrap gap-2">

                  {themes.map(
                    (
                      theme,
                      index
                    ) => (
                      <span
                        key={`${theme}-${index}`}
                        className="
                          rounded-full
                          bg-[#C17B4F]/10
                          px-3
                          py-1.5
                          text-sm
                          font-medium
                          text-[#8B4F2F]
                        "
                      >
                        {theme}
                      </span>
                    )
                  )}

                </div>

              </div>
            )}

            {/* Keywords */}

            {keywords.length > 0 && (
              <div className="mt-5 rounded-2xl border border-[#E8DED5] bg-white p-6 shadow-sm">

                <h3 className="text-lg font-bold text-[#2E1208]">
                  Keywords
                </h3>

                <div className="mt-4 flex flex-wrap gap-2">

                  {keywords.map(
                    (
                      keyword,
                      index
                    ) => (
                      <span
                        key={`${keyword}-${index}`}
                        className="
                          rounded-full
                          border
                          border-gray-200
                          bg-gray-50
                          px-3
                          py-1.5
                          text-sm
                          text-gray-600
                        "
                      >
                        {keyword}
                      </span>
                    )
                  )}

                </div>

              </div>
            )}

            {/* Preview note */}

            <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4">

              <p className="text-sm leading-6 text-green-700">

                <strong>Preview:</strong>{" "}
                This preview is generated from the
                uploaded PDF. The complete PDF is
                available after purchase or where the
                book is offered for free.

              </p>

            </div>

          </div>

        </DialogContent>
      </Dialog>

      {/* =========================================================
          PAYMENT MODAL
      ========================================================== */}

      {showPayment &&
        price != null && (
          <PaymentModal
            book={{
              id: book.id,
              title: book.title,
              priceCents: price,
              slug: book.slug,
            }}
            onClose={() =>
              setShowPayment(false)
            }
            onPaymentSubmitted={
              handlePaymentSubmitted
            }
          />
        )}

      {/* =========================================================
          MAIN PAGE
      ========================================================== */}

      <main className="min-h-screen overflow-x-hidden bg-[#EEF2F7] py-8 sm:py-12">

        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Navigation */}

          <div className="mb-7 flex flex-wrap items-center gap-2">

            <Link to="/">
              <Button
                variant="ghost"
                className="
                  gap-2
                  rounded-full
                  text-[#2E1208]
                  hover:bg-white
                  hover:text-[#C17B4F]
                "
              >
                <ArrowLeft className="h-4 w-4" />

                Home
              </Button>
            </Link>

            <span className="text-gray-300">
              /
            </span>

            <Link to="/books">
              <Button
                variant="ghost"
                className="
                  rounded-full
                  text-[#2E1208]
                  hover:bg-white
                  hover:text-[#C17B4F]
                "
              >
                All Books
              </Button>
            </Link>

          </div>

          {/* Book container */}

          <section
            className="
              overflow-hidden
              rounded-[2rem]
              border
              border-black/5
              bg-white
              shadow-xl
            "
          >

            <div
              className="
                grid
                gap-10
                p-5
                sm:p-8
                md:grid-cols-[minmax(280px,0.8fr)_1.2fr]
                md:gap-12
                md:p-12
                lg:p-16
              "
            >

              {/* Book cover */}

              <div className="flex items-start justify-center">

                <div className="relative w-full max-w-[330px]">

                  <div
                    className="
                      absolute
                      inset-x-5
                      bottom-0
                      h-8
                      rounded-full
                      bg-black/20
                      blur-2xl
                    "
                  />

                  <div
                    className="
                      relative
                      rounded-r-2xl
                      rounded-l-md
                      bg-[#2E1208]
                      p-[5px]
                      shadow-[12px_16px_30px_rgba(0,0,0,0.25)]
                      transition-transform
                      duration-500
                      hover:-translate-y-1
                    "
                  >

                    <div
                      className="
                        absolute
                        left-0
                        top-0
                        z-10
                        h-full
                        w-2
                        rounded-l-md
                        bg-black/25
                      "
                    />

                    {coverSrc ? (
                      <img
                        src={coverSrc}
                        alt={`${book.title} by ${book.author}`}
                        className="
                          relative
                          block
                          aspect-[2/3]
                          w-full
                          rounded-r-xl
                          object-cover
                          object-top
                        "
                        onError={(
                          event
                        ) => {
                          event.currentTarget.onerror =
                            null;

                          event.currentTarget.src =
                            "/placeholder.svg";
                        }}
                      />
                    ) : (
                      <div
                        className="
                          flex
                          aspect-[2/3]
                          w-full
                          items-center
                          justify-center
                          rounded-r-xl
                          bg-gradient-to-br
                          from-[#F5E6D8]
                          to-[#E2D2C2]
                        "
                      >
                        <Book className="h-20 w-20 text-[#C17B4F]" />
                      </div>
                    )}

                  </div>

                  <p className="mt-5 text-center text-xs text-gray-500">
                    {purchased
                      ? "You own this book"
                      : isFree
                      ? "Available as a free digital copy"
                      : "Digital edition available"}
                  </p>

                </div>
              </div>

              {/* Book information */}

              <div className="flex min-w-0 flex-col">

                {/* Category */}

                {book.genre && (
                  <span
                    className="
                      mb-4
                      inline-flex
                      w-fit
                      rounded-full
                      bg-[#C17B4F]/10
                      px-4
                      py-1.5
                      text-xs
                      font-bold
                      uppercase
                      tracking-wider
                      text-[#C17B4F]
                    "
                  >
                    {book.genre}
                  </span>
                )}

                {/* Title */}

                <h1
                  className="
                    font-heading
                    text-3xl
                    font-bold
                    leading-tight
                    tracking-tight
                    text-[#2E1208]
                    sm:text-4xl
                    lg:text-5xl
                  "
                >
                  {book.title}
                </h1>

                {/* Author */}

                <p
                  className="
                    mt-4
                    flex
                    items-center
                    gap-2
                    text-base
                    text-gray-600
                    sm:text-lg
                  "
                >
                  <User className="h-5 w-5 text-[#C17B4F]" />

                  <span>
                    by{" "}

                    <strong className="text-[#2E1208]">
                      {book.author}
                    </strong>
                  </span>
                </p>

                {/* Rating */}

                {book.rating != null &&
                  book.rating > 0 && (
                    <div className="mt-5 flex items-center gap-1">

                      {Array.from({
                        length: 5,
                      }).map(
                        (_, index) => (
                          <Star
                            key={index}
                            className={`
                              h-5
                              w-5
                              ${
                                index <
                                Math.round(
                                  book.rating || 0
                                )
                                  ? "fill-[#D4A017] text-[#D4A017]"
                                  : "text-gray-300"
                              }
                            `}
                          />
                        )
                      )}

                      <span className="ml-2 text-sm font-semibold text-gray-600">
                        {book.rating.toFixed(
                          1
                        )}{" "}
                        / 5.0
                      </span>

                    </div>
                  )}

                {/* Price */}

                <div className="mt-6">

                  {isFree ? (
                    <div>

                      <span className="text-sm text-gray-500">
                        Digital edition
                      </span>

                      <p className="mt-1 text-2xl font-bold text-green-600">
                        Free Download
                      </p>

                    </div>
                  ) : (
                    <div>

                      <span className="text-sm text-gray-500">
                        Price
                      </span>

                      <p className="mt-1 text-3xl font-bold text-[#2E1208]">
                        {formatPrice(
                          price!
                        )}
                      </p>

                    </div>
                  )}

                </div>

                {/* Metadata */}

                <div className="mt-6 flex flex-wrap gap-2">

                  {book.publishedYear !=
                    null && (
                    <div className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-2 text-sm text-gray-700">

                      <Calendar className="h-4 w-4 text-gray-500" />

                      {book.publishedYear}

                    </div>
                  )}

                  {book.pages != null && (
                    <div className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-2 text-sm text-gray-700">

                      <Book className="h-4 w-4 text-gray-500" />

                      {book.pages} pages

                    </div>
                  )}

                  {/* PDF indicator */}

                  {hasPdf && (
                    <div className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600">

                      <FileText className="h-4 w-4" />

                      PDF Available

                    </div>
                  )}

                </div>

                <div className="my-7 h-px bg-gray-100" />

                {/* Description */}

                {book.description && (
                  <div>

                    <h2 className="text-xl font-bold text-[#2E1208]">
                      About this book
                    </h2>

                    <p
                      className="
                        mt-3
                        whitespace-pre-line
                        text-sm
                        leading-7
                        text-gray-600
                        sm:text-base
                      "
                    >
                      {visibleDesc}
                    </p>

                    {longDesc && (
                      <button
                        type="button"
                        onClick={() =>
                          setDescExpanded(
                            (value) =>
                              !value
                          )
                        }
                        className="
                          mt-3
                          inline-flex
                          items-center
                          gap-1
                          text-sm
                          font-semibold
                          text-[#C17B4F]
                          transition
                          hover:text-[#A55E36]
                        "
                      >

                        {descExpanded ? (
                          <>
                            <ChevronUp className="h-4 w-4" />

                            Show less
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-4 w-4" />

                            Read more
                          </>
                        )}

                      </button>
                    )}

                  </div>
                )}

                {/* =================================================
                    ACTIONS
                ================================================== */}

                <div
                  className="
                    mt-8
                    flex
                    flex-col
                    gap-3
                    sm:flex-row
                    sm:flex-wrap
                  "
                >

                  {/* =================================================
                      PREVIEW BUTTON
                  =================================================
                  
                      IMPORTANT:
                      This button ONLY appears when pdfUrl exists.
                  */}

                  {hasPdf && (
                    <Button
                      type="button"
                      onClick={
                        handlePreviewPdf
                      }
                      variant="outline"
                      className="
                        min-h-[52px]
                        rounded-full
                        border-[#C9B8A8]
                        px-6
                        text-[#2E1208]
                        hover:border-[#C17B4F]
                        hover:text-[#C17B4F]
                      "
                    >

                      <Eye className="mr-2 h-5 w-5" />

                      Preview

                    </Button>
                  )}

                  {/* Buy / Download */}

                  <Button
                    type="button"
                    onClick={
                      handleBuyClick
                    }
                    disabled={
                      downloading ||
                      (!hasPdf &&
                        !isFree)
                    }
                    className={`
                      min-h-[52px]
                      rounded-full
                      px-7
                      font-semibold
                      shadow-md
                      transition-all
                      ${
                        purchased ||
                        isFree
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-[#C17B4F] text-white hover:bg-[#A55E36]"
                      }
                    `}
                  >

                    {downloading ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <Download className="mr-2 h-5 w-5" />
                    )}

                    {purchased
                      ? "Download Now"
                      : isFree
                      ? "Download Free"
                      : "Buy & Download"}

                  </Button>

                  {/* Inquiry */}

                  {!isFree &&
                    !purchased && (
                      <Button
                        asChild
                        variant="outline"
                        className="
                          min-h-[52px]
                          rounded-full
                          border-[#C9B8A8]
                          px-7
                          text-[#2E1208]
                          hover:border-[#D4A017]
                          hover:bg-[#D4A017]/10
                        "
                      >

                        <a
                          href={
                            inquireHref
                          }
                          {...(inquireExternal
                            ? {
                                target:
                                  "_blank",
                                rel:
                                  "noopener noreferrer",
                              }
                            : {})}
                        >

                          <ShoppingBag className="mr-2 h-5 w-5" />

                          {bookPurchaseLabel()}

                        </a>

                      </Button>
                    )}

                </div>

                {/* =================================================
                    STATUS MESSAGES
                ================================================== */}

                {!hasPdf && (
                  <div
                    className="
                      mt-5
                      rounded-xl
                      border
                      border-amber-200
                      bg-amber-50
                      p-4
                      text-sm
                      text-amber-700
                    "
                  >

                    <strong>
                      PDF coming soon.
                    </strong>{" "}

                    The digital copy for this title
                    is not available yet.

                  </div>
                )}

                {!purchased &&
                  !isFree &&
                  hasPdf && (
                    <div
                      className="
                        mt-5
                        rounded-xl
                        bg-[#EEF2F7]
                        p-4
                        text-sm
                        leading-6
                        text-[#5C4436]
                      "
                    >

                      Click{" "}

                      <strong>
                        Buy & Download
                      </strong>{" "}

                      to purchase this book.
                      Your download will be
                      unlocked after payment
                      verification.

                    </div>
                  )}

                {purchased &&
                  hasPdf && (
                    <div
                      className="
                        mt-5
                        rounded-xl
                        border
                        border-green-200
                        bg-green-50
                        p-4
                        text-sm
                        text-green-700
                      "
                    >

                      ✓ You have purchased this
                      book. Click{" "}

                      <strong>
                        Download Now
                      </strong>{" "}

                      to access your PDF copy.

                    </div>
                  )}

                {isFree &&
                  hasPdf && (
                    <div
                      className="
                        mt-5
                        rounded-xl
                        border
                        border-blue-200
                        bg-blue-50
                        p-4
                        text-sm
                        text-blue-700
                      "
                    >

                      📚 This book is free. You
                      can preview or download the
                      PDF at no cost.

                    </div>
                  )}

              </div>
            </div>
          </section>

          {/* Back to books */}

          <div className="mt-8 flex justify-center">

            <Link
              to="/books"
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                px-6
                py-3
                text-sm
                font-semibold
                text-[#2E1208]
                transition
                hover:bg-white
                hover:text-[#C17B4F]
              "
            >

              <ArrowLeft className="h-4 w-4" />

              Browse all books

            </Link>

          </div>

        </div>
      </main>
    </>
  );
};

export default BookDetail;