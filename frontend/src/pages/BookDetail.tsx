// frontend/src/pages/BookDetail.tsx

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
  BookOpen,
  FileText,
} from "lucide-react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { resolveBookCoverUrl } from "@/lib/resolveBookCover";

import { formatPrice } from "@/lib/formatPrice";

import {
  getBooks,
  downloadBookPdf,
  markBookAsPurchased,
  isBookPurchasedLocally,
} from "@/services/api";

import { PaymentModal } from "@/components/PaymentModal";
import HardcopyOrderModal from "@/components/HardcopyOrderModal";
import InquiryModal from "@/components/InquiryModal";
import { rememberBuyerEmail, getRememberedBuyerEmail } from "@/services/bookAccess";

/* =========================================================
   BOOK TYPE
========================================================= */

interface BookData {
  id: string;
  title: string;
  author: string;
  slug?: string | null;

  description?: string | null;

  coverImage?: string | null;

  pdfUrl?: string | null;

  genre?: string | null;

  publishedYear?: number | null;
  pages?: number | null;
  rating?: number | null;
  priceCents?: number | null;
}

/* =========================================================
   BOOK DETAIL PAGE
========================================================= */

const BookDetail = () => {
  const { slug } = useParams<{ slug: string }>();

  const [searchParams, setSearchParams] =
    useSearchParams();

  const [loading, setLoading] =
    useState(true);

  const [book, setBook] =
    useState<BookData | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  const [downloading, setDownloading] =
    useState(false);

  const [purchased, setPurchased] =
    useState(false);

  const [showPayment, setShowPayment] =
    useState(false);

  const [showHardcopyOrder, setShowHardcopyOrder] =
    useState(false);

  const [showInquiry, setShowInquiry] =
    useState(false);

  const [buyerEmail, setBuyerEmail] =
    useState<string | null>(null);

  /* =========================================================
     FETCH BOOK
  ========================================================= */

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

      const mapped: BookData = {
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
      };

      setBook(mapped);

      setPurchased(
        isBookPurchasedLocally(
          String(foundBook.id)
        )
      );

      setBuyerEmail(
        getRememberedBuyerEmail(String(foundBook.id))
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

  /* =========================================================
     CHECKOUT RESULT
  ========================================================= */

  useEffect(() => {
    const status =
      searchParams.get("checkout");

    if (!status || !book) return;

    if (status === "success") {
      toast.success(
        "Payment received — opening your download now."
      );

      markBookAsPurchased(book.id);

      setPurchased(true);

      const paypalEmail = localStorage.getItem("checkout_email");
      if (paypalEmail) {
        rememberBuyerEmail(book.id, paypalEmail);
        setBuyerEmail(paypalEmail);
      }

      searchParams.delete("checkout");

      setSearchParams(
        searchParams,
        {
          replace: true,
        }
      );

      void handleDownload();
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

  /* =========================================================
     BOOK PRICE
  ========================================================= */

  const price =
    book?.priceCents != null
      ? Number(book.priceCents)
      : null;

  const isFree =
    price == null ||
    price === 0;

  /* =========================================================
     PDF AVAILABILITY
  ========================================================= */

  const hasPdf =
    Boolean(
      book?.pdfUrl &&
      book.pdfUrl.trim()
    );

  /* =========================================================
     DOWNLOAD BOOK
  ========================================================= */

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

  /* =========================================================
     BUY / DOWNLOAD BUTTON
  ========================================================= */

  const handleBuyClick = () => {
    if (!book) return;

    /*
     * If there is no PDF, don't allow
     * a digital download.
     */

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

  /* =========================================================
     PAYMENT SUBMITTED
  ========================================================= */

  const handlePaymentSubmitted = (submittedBuyerEmail: string) => {
    if (!book) return;

    markBookAsPurchased(
      book.id
    );

    setPurchased(true);

    setShowPayment(false);

    rememberBuyerEmail(book.id, submittedBuyerEmail);
    setBuyerEmail(submittedBuyerEmail);

    /*
     * Payment is already confirmed by this point (PaymentModal only
     * calls this after M-Pesa polling succeeds, or after a successful
     * PayPal return). So we open the download immediately instead of
     * waiting for the user to click "Download Now" again.
     */
    void handleDownload();
  };

  /* =========================================================
     LOADING STATE
  ========================================================= */

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#EEF2F7] px-6">
        <div className="flex flex-col items-center text-center">

          <Loader2
            className="
              h-10
              w-10
              animate-spin
              text-[#C17B4F]
            "
          />

          <p className="mt-4 text-sm text-gray-600">
            Loading book...
          </p>

        </div>
      </div>
    );
  }

  /* =========================================================
     ERROR STATE
  ========================================================= */

  if (error || !book) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#EEF2F7] px-6">

        <div className="max-w-md text-center">

          <div
            className="
              mx-auto
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-full
              bg-[#C17B4F]/10
            "
          >
            <BookOpen
              className="
                h-8
                w-8
                text-[#C17B4F]
              "
            />
          </div>

          <h1
            className="
              mt-6
              text-2xl
              font-bold
              text-[#2E1208]
            "
          >
            {error || "Book not found"}
          </h1>

          <p className="mt-3 text-gray-600">
            The book you're looking for doesn't
            exist or may have been removed.
          </p>

          <div
            className="
              mt-7
              flex
              flex-wrap
              justify-center
              gap-3
            "
          >

            <Link to="/">
              <Button
                className="
                  rounded-full
                  bg-[#2E1208]
                  px-6
                "
              >
                Back to Home
              </Button>
            </Link>

            <Link to="/books">
              <Button
                variant="outline"
                className="
                  rounded-full
                  px-6
                "
              >
                Browse Books
              </Button>
            </Link>

          </div>

        </div>

      </div>
    );
  }

  /* =========================================================
     COVER
  ========================================================= */

  const coverSrc =
    resolveBookCoverUrl(
      book.coverImage
    );

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <>
      {/* =====================================================
          PAYMENT MODAL
      ===================================================== */}

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

      {/* =====================================================
          HARDCOPY ORDER MODAL
      ===================================================== */}

      <HardcopyOrderModal
        isOpen={showHardcopyOrder}
        book={{
          id: book.id,
          title: book.title,
          author: book.author,
          priceCents: book.priceCents ?? null,
          coverImage: book.coverImage,
        }}
        onClose={() =>
          setShowHardcopyOrder(false)
        }
      />

      {/* =====================================================
          INQUIRY MODAL
      ===================================================== */}

      {showInquiry && (
        <InquiryModal
          book={{
            id: book.id,
            title: book.title,
            author: book.author,
          }}
          onClose={() =>
            setShowInquiry(false)
          }
        />
      )}

      {/* =====================================================
          MAIN PAGE
      ===================================================== */}

      <main
        className="
          min-h-screen
          overflow-x-hidden
          bg-[#EEF2F7]
          py-8
          sm:py-12
        "
      >

        <div
          className="
            mx-auto
            w-full
            max-w-7xl
            px-4
            sm:px-6
            lg:px-8
          "
        >

          {/* =================================================
              NAVIGATION
          ================================================= */}

          <div
            className="
              mb-7
              flex
              flex-wrap
              items-center
              gap-2
            "
          >

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

          {/* =================================================
              BOOK CONTAINER
          ================================================= */}

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

              {/* =================================================
                  BOOK COVER
              ================================================= */}

              <div
                className="
                  flex
                  items-start
                  justify-center
                "
              >

                <div
                  className="
                    relative
                    w-full
                    max-w-[330px]
                  "
                >

                  {/* Shadow */}

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

                  {/* Book */}

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

                    {/* Spine */}

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
                        <Book
                          className="
                            h-20
                            w-20
                            text-[#C17B4F]
                          "
                        />
                      </div>
                    )}

                  </div>

                  {/* Ownership / availability */}

                  <p
                    className="
                      mt-5
                      text-center
                      text-xs
                      text-gray-500
                    "
                  >
                    {purchased
                      ? "You own this book"
                      : isFree
                        ? "Available as a free digital copy"
                        : "Digital edition available"}
                  </p>

                </div>

              </div>

              {/* =================================================
                  BOOK INFORMATION
              ================================================= */}

              <div
                className="
                  flex
                  min-w-0
                  flex-col
                "
              >

                {/* =================================================
                    GENRE
                ================================================= */}

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

                {/* =================================================
                    TITLE
                ================================================= */}

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

                {/* =================================================
                    AUTHOR
                ================================================= */}

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

                  <User
                    className="
                      h-5
                      w-5
                      text-[#C17B4F]
                    "
                  />

                  <span>
                    by{" "}

                    <strong
                      className="
                        text-[#2E1208]
                      "
                    >
                      {book.author}
                    </strong>
                  </span>

                </p>

                {/* =================================================
                    RATING
                ================================================= */}

                {book.rating != null &&
                  book.rating > 0 && (
                    <div
                      className="
                        mt-5
                        flex
                        items-center
                        gap-1
                      "
                    >

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

                      <span
                        className="
                          ml-2
                          text-sm
                          font-semibold
                          text-gray-600
                        "
                      >
                        {book.rating.toFixed(
                          1
                        )}{" "}
                        / 5.0
                      </span>

                    </div>
                  )}

                {/* =================================================
                    PRICE
                ================================================= */}

                <div className="mt-6">

                  {isFree ? (
                    <div>

                      <span
                        className="
                          text-sm
                          text-gray-500
                        "
                      >
                        Digital edition
                      </span>

                      <p
                        className="
                          mt-1
                          text-2xl
                          font-bold
                          text-green-600
                        "
                      >
                        Free Download
                      </p>

                    </div>
                  ) : (
                    <div>

                      <span
                        className="
                          text-sm
                          text-gray-500
                        "
                      >
                        Price
                      </span>

                      <p
                        className="
                          mt-1
                          text-3xl
                          font-bold
                          text-[#2E1208]
                        "
                      >
                        {formatPrice(
                          price!
                        )}
                      </p>

                    </div>
                  )}

                </div>

                {/* =================================================
                    METADATA
                ================================================= */}

                <div
                  className="
                    mt-6
                    flex
                    flex-wrap
                    gap-2
                  "
                >

                  {book.publishedYear !=
                    null && (
                      <div
                        className="
                          flex
                          items-center
                          gap-2
                          rounded-full
                          bg-gray-100
                          px-3
                          py-2
                          text-sm
                          text-gray-700
                        "
                      >

                        <Calendar
                          className="
                            h-4
                            w-4
                            text-gray-500
                          "
                        />

                        {book.publishedYear}

                      </div>
                    )}

                  {book.pages != null && (
                    <div
                      className="
                        flex
                        items-center
                        gap-2
                        rounded-full
                        bg-gray-100
                        px-3
                        py-2
                        text-sm
                        text-gray-700
                      "
                    >

                      <Book
                        className="
                          h-4
                          w-4
                          text-gray-500
                        "
                      />

                      {book.pages} pages

                    </div>
                  )}

                  {/*  */}

                </div>

                {/* =================================================
                    DIVIDER
                ================================================= */}

                <div
                  className="
                    my-7
                    h-px
                    bg-gray-100
                  "
                />

                {/* =================================================
                    FULL BOOK DESCRIPTION
                ================================================= */}

                {book.description && (
                  <div>

                    <h2
                      className="
                        text-xl
                        font-bold
                        text-[#2E1208]
                      "
                    >
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
                      {book.description}
                    </p>

                  </div>
                )}

                {/* =================================================
                    ACTIONS
                ================================================= */}

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
                      BUY / DOWNLOAD
                  ================================================= */}

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
                      <Loader2
                        className="
                          mr-2
                          h-5
                          w-5
                          animate-spin
                        "
                      />
                    ) : (
                      <Download
                        className="
                          mr-2
                          h-5
                          w-5
                        "
                      />
                    )}

                    {purchased
                      ? "Download Now"
                      : isFree
                        ? "Download Free"
                        : "Buy & Download"}

                  </Button>

                  {/* =================================================
                      ORDER HARD COPY
                  ================================================= */}

                  <Button
                    type="button"
                    onClick={() =>
                      setShowHardcopyOrder(true)
                    }
                    className="
                      min-h-[52px]
                      rounded-full
                      bg-[#2E1208]
                      px-7
                      font-semibold
                      text-white
                      shadow-md
                      transition-all
                      hover:bg-[#4A2112]
                    "
                  >

                    <ShoppingBag
                      className="
                        mr-2
                        h-5
                        w-5
                      "
                    />

                    Order Hard Copy

                  </Button>

                  {/* =================================================
                      INQUIRY
                  ================================================= */}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      setShowInquiry(true)
                    }
                    className="
                      min-h-[52px]
                      rounded-full
                      border-[#C9B8A8]
                      px-7
                      font-semibold
                      text-[#2E1208]
                      hover:border-[#D4A017]
                      hover:bg-[#D4A017]/10
                    "
                  >

                    <FileText
                      className="
                        mr-2
                        h-5
                        w-5
                      "
                    />

                    Inquiry

                  </Button>

                </div>

                {/* =================================================
                    STATUS: PDF NOT AVAILABLE
                ================================================= */}

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

                    The digital copy for this
                    title is not available yet.

                  </div>
                )}

                {/* =================================================
                    STATUS: PAID BOOK
                ================================================= */}

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

                {/* =================================================
                    STATUS: PURCHASED
                ================================================= */}

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

                      ✓ You have purchased
                      this book. Click{" "}

                      <strong>
                        Download Now
                      </strong>{" "}

                      to access your PDF copy.

                    </div>
                  )}

                {/* =================================================
                    STATUS: FREE
                ================================================= */}

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

                      📚 This book is free.
                      You can download the
                      PDF at no cost.

                    </div>
                  )}

              </div>

            </div>

          </section>

          {/* =================================================
              BACK TO BOOKS
          ================================================= */}

          <div
            className="
              mt-8
              flex
              justify-center
            "
          >

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

              <ArrowLeft
                className="
                  h-4
                  w-4
                "
              />

              Browse all books

            </Link>

          </div>

        </div>

      </main>
    </>
  );
};

export default BookDetail;