import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Loader2, ArrowRight } from "lucide-react";
import { getBooks } from "@/services/api";
import { BookShowcaseCard } from "@/components/BookShowcaseCard";

/** How many books to highlight on the home page before “View all”. */
const HOME_BOOKS_PREVIEW = 8;

const Books = () => {
  const { data: books = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["books", "home-preview"],
    queryFn: getBooks,
  });

  const preview = books.slice(0, HOME_BOOKS_PREVIEW);
  const hasMore = books.length > preview.length;

  if (isLoading) {
    return (
      <section id="books" className="py-12 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="mb-8 text-center">
            <h2 className="mb-3 text-2xl font-bold text-[#2E1208] md:text-3xl font-heading">
              Books to read &amp; own
            </h2>
            <p className="mx-auto max-w-2xl text-base text-[#5C4436]">
              Stories of healing, identity, leadership, and purpose—read more on each title or order
              your copy.
            </p>
            <div className="mx-auto mt-3 h-1 w-20 rounded-full bg-[#D4A017]" />
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl border border-[#E8DDD4] bg-white p-3">
                <div className="aspect-[2/3] rounded-lg bg-[#E8DDD4]/80 max-h-[200px]" />
                <div className="mt-3 h-4 w-4/5 rounded bg-[#E8DDD4]/80" />
                <div className="mt-1.5 h-3 w-3/5 rounded bg-[#E8DDD4]/60" />
              </div>
            ))}
          </div>
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-[#C17B4F]" aria-label="Loading books" />
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section id="books" className="py-12 bg-white">
        <div className="container mx-auto max-w-7xl px-4 text-center">
          <BookOpen className="mx-auto mb-4 h-10 w-10 text-[#C17B4F]/60" />
          <h2 className="text-xl font-bold text-[#2E1208]">Couldn&apos;t load books</h2>
          <p className="mt-2 text-sm text-[#5C4436]">Check your connection or try again in a moment.</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-5 rounded-full bg-[#C17B4F] px-5 py-2 text-sm font-semibold text-white hover:bg-[#A55E36]"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  if (books.length === 0) {
    return (
      <section id="books" className="py-12 bg-white">
        <div className="container mx-auto max-w-7xl px-4 text-center">
          <BookOpen className="mx-auto mb-4 h-10 w-10 text-[#C17B4F]/60" />
          <h2 className="text-xl font-bold text-[#2E1208]">Books coming soon</h2>
          <p className="mt-2 text-sm text-[#5C4436]">New titles will appear here once they&apos;re added.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="books" className="py-12 bg-white">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-8 text-center">
          <h2 className="mb-3 text-2xl font-bold text-[#2E1208] md:text-3xl font-heading">
            Books to read &amp; own
          </h2>
          <p className="mx-auto max-w-2xl text-base text-[#5C4436]">
            Explore the collection—open any book for the full description, then order or inquire when
            you&apos;re ready.
          </p>
          <div className="mx-auto mt-3 h-1 w-20 rounded-full bg-[#D4A017]" />
        </div>

        {/* Tighter grid with smaller cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
          {preview.map((book) => (
            <BookShowcaseCard
              key={book.id}
              id={String(book.id)}
              title={book.title}
              author={book.author}
              slug={book.slug}
              coverImage={book.coverImage}
              rating={book.rating}
              description={book.description}
              priceCents={book.priceCents}
            />
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-center sm:gap-4">
          <Link
            to="/books"
            className="inline-flex items-center gap-2 rounded-full bg-[#D4A017] px-6 py-2.5 text-sm font-semibold text-[#2E1208] shadow-md transition hover:bg-[#b58900]"
          >
            Browse full catalog
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          {hasMore ? (
            <p className="text-xs text-[#5C4436]">
              Showing {preview.length} of {books.length} titles
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default Books;