// src/pages/BookDetail.tsx
import { useParams, Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Star,
  Calendar,
  User,
  BookOpen,
  ArrowLeft,
  Loader2,
  ShoppingBag,
  CreditCard,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { resolveBookCoverUrl } from "@/lib/resolveBookCover";
import { bookPurchaseHref, bookPurchaseLabel } from "@/config/purchase";
import { formatPrice } from "@/lib/formatPrice";
import { createCheckoutSession, getBooks, getCheckoutStatus } from "@/services/api";

interface Book {
  id: number;
  title: string;
  author: string;
  slug?: string | null;
  description?: string;
  coverImage?: string;
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
  const [book, setBook] = useState<Book | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const { data: checkout } = useQuery({
    queryKey: ["checkout", "status"],
    queryFn: getCheckoutStatus,
    staleTime: 60_000,
  });

  useEffect(() => {
    const status = searchParams.get("checkout");
    if (status === "success") {
      toast.success("Payment received — thank you! You'll get a confirmation from Stripe.");
      searchParams.delete("checkout");
      setSearchParams(searchParams, { replace: true });
    } else if (status === "cancel") {
      toast.message("Checkout cancelled", {
        description: "You can try again whenever you're ready.",
      });
      searchParams.delete("checkout");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

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
        (b) =>
          b.slug === slug ||
          String(b.id) === slug ||
          (Number.isInteger(Number(slug)) && Number(b.id) === Number(slug))
      );

      if (foundBook) {
        setBook({
          id: Number(foundBook.id),
          title: foundBook.title,
          author: foundBook.author,
          slug: foundBook.slug ?? undefined,
          description: foundBook.description ?? undefined,
          coverImage: foundBook.coverImage ?? undefined,
          genre: foundBook.genre ?? undefined,
          publishedYear: foundBook.publishedYear ?? undefined,
          pages: foundBook.pages ?? undefined,
          rating: foundBook.rating,
          priceCents: foundBook.priceCents ?? undefined,
        });
      } else {
        setError("Book not found");
      }
    } catch (err: unknown) {
      console.error("Failed to fetch book:", err);
      setError("Book not found");
    } finally {
      setLoading(false);
    }
  };

  const stripeReady = Boolean(checkout?.enabled);
  const price = book?.priceCents != null ? Number(book.priceCents) : null;
  const canStripePay = stripeReady && price != null && price > 0;

  async function startCheckout() {
    if (!book || !canStripePay) return;
    setCheckoutLoading(true);
    try {
      const { url } = await createCheckoutSession(String(book.id));
      window.location.href = url;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Could not start checkout.";
      toast.error(msg);
    } finally {
      setCheckoutLoading(false);
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
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#2E1208] mb-4">
            {error || "Book not found"}
          </h1>
          <p className="text-gray-600 mb-6">
            The book you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link to="/">
            <Button className="bg-[#C17B4F] hover:bg-[#A55E36] text-white">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const inquireHref = bookPurchaseHref(book.slug);
  const inquireExternal = inquireHref.startsWith("http");

  return (
    <div className="min-h-screen bg-[#F9F6EF] py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex flex-wrap gap-3">
          <Link to="/">
            <Button variant="ghost" className="gap-2 text-[#2E1208] hover:text-[#C17B4F]">
              <ArrowLeft className="h-4 w-4" />
              Home
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
            <div className="flex items-center justify-center">
              {book.coverImage ? (
                <img
                  src={resolveBookCoverUrl(book.coverImage) || ""}
                  alt={book.title}
                  className="rounded-2xl shadow-xl w-full max-w-md h-auto object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg";
                  }}
                />
              ) : (
                <div className="w-full max-w-md aspect-[2/3] bg-gradient-to-br from-[#F9F6EF] to-[#E8E0D5] rounded-2xl flex items-center justify-center">
                  <BookOpen className="h-20 w-20 text-[#C17B4F]" />
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-[#2E1208] mb-2 font-heading">
                  {book.title}
                </h1>
                <p className="text-xl text-gray-600 flex items-center gap-2">
                  <User className="h-5 w-5 text-[#C17B4F]" />
                  by {book.author}
                </p>
                {price != null && price > 0 ? (
                  <p className="mt-3 text-2xl font-semibold text-[#2E1208]">
                    {formatPrice(price)}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-wrap gap-3">
                {book.rating != null && book.rating > 0 && (
                  <div className="flex items-center gap-1 px-3 py-1.5 bg-yellow-50 rounded-full">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-gray-700">{book.rating.toFixed(1)}</span>
                    <span className="text-gray-500 text-sm">/ 5.0</span>
                  </div>
                )}
                {book.publishedYear != null ? (
                  <div className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-full">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700">{book.publishedYear}</span>
                  </div>
                ) : null}
                {book.pages != null ? (
                  <div className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-full">
                    <BookOpen className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700">{book.pages} pages</span>
                  </div>
                ) : null}
                {book.genre != null ? (
                  <div className="px-3 py-1.5 bg-[#C17B4F]/10 text-[#C17B4F] rounded-full text-sm font-medium">
                    {book.genre}
                  </div>
                ) : null}
              </div>

              {book.description != null ? (
                <div>
                  <h2 className="text-xl font-semibold text-[#2E1208] mb-3">About this book</h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {book.description}
                  </p>
                </div>
              ) : null}

              <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:flex-wrap">
                {canStripePay ? (
                  <Button
                    type="button"
                    onClick={startCheckout}
                    disabled={checkoutLoading}
                    className="bg-[#D4A017] hover:bg-[#b58900] text-[#2E1208] px-8 py-6 text-lg rounded-full shadow-md gap-2 font-semibold"
                  >
                    {checkoutLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
                    ) : (
                      <CreditCard className="h-5 w-5" aria-hidden />
                    )}
                    Pay with card
                  </Button>
                ) : null}
                <Button
                  asChild
                  variant={canStripePay ? "outline" : "default"}
                  className={
                    canStripePay
                      ? "border-[#C9B8A8] text-[#2E1208] px-8 py-6 text-lg rounded-full gap-2"
                      : "bg-[#C17B4F] hover:bg-[#A55E36] text-white px-8 py-6 text-lg rounded-full shadow-md gap-2"
                  }
                >
                  <a
                    href={inquireHref}
                    {...(inquireExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    <ShoppingBag className="h-5 w-5" aria-hidden />
                    {bookPurchaseLabel()}
                    {canStripePay ? "" : " →"}
                  </a>
                </Button>
              </div>
              {canStripePay ? (
                <p className="text-sm text-[#5C4436]">
                  Secure checkout powered by Stripe. You can still use &quot;{bookPurchaseLabel()}&quot;
                  for other payment options.
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
