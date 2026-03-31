// src/pages/BookDetail.tsx
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
  ChevronUp 
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { resolveBookCoverUrl } from "@/lib/resolveBookCover";
import { bookPurchaseHref, bookPurchaseLabel } from "@/config/purchase";
import { formatPrice } from "@/lib/formatPrice";
import { getBooks, downloadBookPdf, markBookAsPurchased, isBookPurchasedLocally } from "@/services/api";
import { PaymentModal } from "@/components/PaymentModal";

interface Book {
  id: string;
  title: string;
  author: string;
  slug?: string | null;
  description?: string;
  coverImage?: string;
  pdfUrl?: string | null;
  genre?: string;
  publishedYear?: number;
  pages?: number;
  rating?: number;
  priceCents?: number | null;
}

const BookDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [book, setBook] = useState<Book | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [descExpanded, setDescExpanded] = useState(false);
  const [purchased, setPurchased] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    const status = searchParams.get("checkout");
    if (status === "success") {
      toast.success("Payment received — thank you! Your download is ready below.");
      if (book) {
        markBookAsPurchased(book.id);
        setPurchased(true);
      }
      searchParams.delete("checkout");
      setSearchParams(searchParams, { replace: true });
    } else if (status === "cancel") {
      toast.message("Checkout cancelled", { description: "You can try again whenever you're ready." });
      searchParams.delete("checkout");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams, book]);

  useEffect(() => {
    if (slug) void fetchBookDetails();
  }, [slug]);

  const fetchBookDetails = async () => {
    if (!slug) return;
    try {
      setLoading(true);
      setError(null);
      const books = await getBooks();
      const foundBook = books.find((b) => b.slug === slug || String(b.id) === slug);
      if (foundBook) {
        const mapped: Book = {
          id: String(foundBook.id),
          title: foundBook.title,
          author: foundBook.author,
          slug: foundBook.slug ?? undefined,
          description: foundBook.description ?? undefined,
          coverImage: foundBook.coverImage ?? undefined,
          pdfUrl: foundBook.pdfUrl ?? undefined,
          genre: foundBook.genre ?? undefined,
          publishedYear: foundBook.publishedYear ?? undefined,
          pages: foundBook.pages ?? undefined,
          rating: foundBook.rating,
          priceCents: foundBook.priceCents ?? undefined,
        };
        setBook(mapped);
        setPurchased(isBookPurchasedLocally(String(foundBook.id)));
      } else {
        setError("Book not found");
      }
    } catch (err) {
      console.error("Failed to fetch book:", err);
      setError("Book not found");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!book) return;

    // Check if book has PDF
    if (!book.pdfUrl) {
      toast.error("PDF not available for this book yet");
      return;
    }

    setDownloading(true);
    try {
      // If book is free or purchased, download directly
      if (isFree || purchased) {
        // Open PDF directly if we have the URL
        if (book.pdfUrl) {
          window.open(book.pdfUrl, '_blank');
          toast.success(`Downloading ${book.title}`);
        } else {
          toast.error("PDF URL not found");
        }
      } else {
        // For paid books, verify with backend
        const { pdfUrl, title } = await downloadBookPdf(book.id);
        if (pdfUrl) {
          window.open(pdfUrl, '_blank');
          toast.success(`Downloading ${title}`);
        } else {
          toast.error("PDF URL not found");
        }
      }
    } catch (error: any) {
      console.error('Download error:', error);
      
      if (error.message?.includes('purchase') || error.message?.includes('403')) {
        toast.error("Please purchase this book first to download");
        setShowPayment(true);
      } else {
        toast.error(error.message || "Failed to download PDF");
      }
    } finally {
      setDownloading(false);
    }
  };

  const price = book?.priceCents != null ? Number(book.priceCents) : null;
  const isFree = price == null || price === 0;
  const hasPdf = !!book?.pdfUrl;

  function handleBuyClick() {
    // Check if book has PDF available
    if (!hasPdf) {
      toast.error("PDF not available for this book yet");
      return;
    }
    
    // If free, download directly
    if (isFree) {
      handleDownload();
      return;
    }
    
    // If purchased, download directly
    if (purchased) {
      handleDownload();
      return;
    }
    
    // Otherwise, show payment modal
    setShowPayment(true);
  }

  function handlePaymentSubmitted() {
    toast.success("Payment submitted! We'll verify and unlock your download shortly.");
    if (book) {
      markBookAsPurchased(book.id);
      setPurchased(true);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F6EF] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#C17B4F]" />
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-[#F9F6EF] flex items-center justify-center">
        <div className="text-center">
          <Book className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#2E1208] mb-4">{error || "Book not found"}</h1>
          <p className="text-gray-600 mb-6">The book you're looking for doesn't exist or has been removed.</p>
          <Link to="/"><Button className="bg-[#C17B4F] hover:bg-[#A55E36] text-white">Back to Home</Button></Link>
        </div>
      </div>
    );
  }

  const inquireHref = bookPurchaseHref(book.slug);
  const inquireExternal = inquireHref.startsWith("http");
  const DESC_LIMIT = 150;
  const longDesc = (book.description?.length ?? 0) > DESC_LIMIT;
  const visibleDesc = longDesc && !descExpanded
    ? book.description!.slice(0, DESC_LIMIT) + "…"
    : book.description;

  return (
    <>
      {showPayment && book && price != null && (
        <PaymentModal
          book={{ id: book.id, title: book.title, priceCents: price, slug: book.slug }}
          onClose={() => setShowPayment(false)}
          onPaymentSubmitted={handlePaymentSubmitted}
        />
      )}

      <div className="min-h-screen bg-[#F9F6EF] py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 flex flex-wrap gap-3">
            <Link to="/">
              <Button variant="ghost" className="gap-2 text-[#2E1208] hover:text-[#C17B4F]">
                <ArrowLeft className="h-4 w-4" />Home
              </Button>
            </Link>
            <Link to="/books">
              <Button variant="ghost" className="gap-2 text-[#2E1208] hover:text-[#C17B4F]">
                All books
              </Button>
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
              {/* Cover */}
              <div className="flex items-center justify-center">
                {book.coverImage ? (
                  <img
                    src={resolveBookCoverUrl(book.coverImage) || ""}
                    alt={book.title}
                    className="rounded-2xl shadow-xl w-full max-w-md h-auto object-cover"
                    onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }}
                  />
                ) : (
                  <div className="w-full max-w-md aspect-[2/3] bg-gradient-to-br from-[#F9F6EF] to-[#E8E0D5] rounded-2xl flex items-center justify-center">
                    <Book className="h-20 w-20 text-[#C17B4F]" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-[#2E1208] mb-2 font-heading">
                    {book.title}
                  </h1>
                  <p className="text-xl text-gray-600 flex items-center gap-2">
                    <User className="h-5 w-5 text-[#C17B4F]" />by {book.author}
                  </p>
                  {price != null && price > 0 && (
                    <p className="mt-3 text-2xl font-semibold text-[#2E1208]">
                      {formatPrice(price)}
                    </p>
                  )}
                  {isFree && (
                    <p className="mt-3 text-lg text-green-600 font-semibold">
                      Free Download
                    </p>
                  )}
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-3">
                  {book.rating != null && book.rating > 0 && (
                    <div className="flex items-center gap-1 px-3 py-1.5 bg-yellow-50 rounded-full">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-gray-700">{book.rating.toFixed(1)}</span>
                      <span className="text-gray-500 text-sm">/ 5.0</span>
                    </div>
                  )}
                  {book.publishedYear != null && (
                    <div className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-full">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-700">{book.publishedYear}</span>
                    </div>
                  )}
                  {book.pages != null && (
                    <div className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-full">
                      <Book className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-700">{book.pages} pages</span>
                    </div>
                  )}
                  {book.genre != null && (
                    <div className="px-3 py-1.5 bg-[#C17B4F]/10 text-[#C17B4F] rounded-full text-sm font-medium">
                      {book.genre}
                    </div>
                  )}
                  {hasPdf && (
                    <div className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm font-medium flex items-center gap-1">
                      <Download className="h-3 w-3" />
                      PDF Available
                    </div>
                  )}
                </div>

                {/* Description */}
                {book.description && (
                  <div>
                    <h2 className="text-xl font-semibold text-[#2E1208] mb-3">About this book</h2>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">{visibleDesc}</p>
                    {longDesc && (
                      <button
                        type="button"
                        onClick={() => setDescExpanded((v) => !v)}
                        className="mt-2 flex items-center gap-1 text-sm font-medium text-[#C17B4F] hover:text-[#A55E36]"
                      >
                        {descExpanded
                          ? <><ChevronUp className="h-4 w-4" /> Show less</>
                          : <><ChevronDown className="h-4 w-4" /> Read more</>}
                      </button>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:flex-wrap">
                  <Button
                    type="button"
                    onClick={handleBuyClick}
                    disabled={downloading}
                    className={`
                      px-8 py-6 text-lg rounded-full shadow-md gap-2 font-semibold
                      ${(purchased || isFree) 
                        ? 'bg-green-600 hover:bg-green-700 text-white' 
                        : 'bg-[#C17B4F] hover:bg-[#A55E36] text-white'
                      }
                      ${(!hasPdf && !isFree) ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    {downloading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Download className="h-5 w-5" />
                    )}
                    {purchased 
                      ? "Download Now" 
                      : isFree 
                        ? "Download Free" 
                        : "Buy & Download"
                    }
                  </Button>

                  {!isFree && !purchased && (
                    <Button
                      asChild
                      variant="outline"
                      className="border-[#C9B8A8] text-[#2E1208] px-8 py-6 text-lg rounded-full gap-2"
                    >
                      <a href={inquireHref} {...(inquireExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                        <ShoppingBag className="h-5 w-5" aria-hidden />
                        {bookPurchaseLabel()}
                      </a>
                    </Button>
                  )}
                </div>

                {/* Info Messages */}
                {!hasPdf && (
                  <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg mt-4">
                    ⚠️ PDF not yet available for this book. Check back soon!
                  </p>
                )}

                {!purchased && !isFree && hasPdf && (
                  <p className="text-sm text-[#5C4436] mt-4">
                    Click <strong>Buy & Download</strong> to pay via M-Pesa, PayPal, or bank transfer.
                    Your download unlocks after we verify your payment.
                  </p>
                )}

                {purchased && hasPdf && (
                  <p className="text-sm text-green-600 bg-green-50 p-3 rounded-lg mt-4">
                    ✓ You have purchased this book. Click Download Now to get your PDF copy.
                  </p>
                )}

                {isFree && hasPdf && (
                  <p className="text-sm text-blue-600 bg-blue-50 p-3 rounded-lg mt-4">
                    📚 This book is free! Click Download Free to get your PDF copy.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookDetail;