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
      <section id="books" className="py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-[#2E1208] md:text-4xl font-heading">
              Books to read &amp; own
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-[#5C4436]">
              Stories of healing, identity, leadership, and purpose—read more on each title or order
              your copy.
            </p>
            <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-[#D4A017]" />
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-2xl border border-[#E8DDD4] bg-white p-4">
                <div className="aspect-[2/3] rounded-lg bg-[#E8DDD4]/80" />
                <div className="mt-4 h-5 w-4/5 rounded bg-[#E8DDD4]/80" />
                <div className="mt-2 h-4 w-3/5 rounded bg-[#E8DDD4]/60" />
              </div>
            ))}
          </div>
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-[#C17B4F]" aria-label="Loading books" />
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section id="books" className="py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-4 text-center">
          <BookOpen className="mx-auto mb-4 h-12 w-12 text-[#C17B4F]/60" />
          <h2 className="text-2xl font-bold text-[#2E1208]">Couldn&apos;t load books</h2>
          <p className="mt-2 text-[#5C4436]">Check your connection or try again in a moment.</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-6 rounded-full bg-[#C17B4F] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#A55E36]"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  if (books.length === 0) {
    return (
      <section id="books" className="py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-4 text-center">
          <BookOpen className="mx-auto mb-4 h-12 w-12 text-[#C17B4F]/60" />
          <h2 className="text-2xl font-bold text-[#2E1208]">Books coming soon</h2>
          <p className="mt-2 text-[#5C4436]">New titles will appear here once they&apos;re added.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="books" className="py-20 bg-white">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-[#2E1208] md:text-4xl font-heading">
            Books to read &amp; own
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-[#5C4436]">
            Explore the collection—open any book for the full description, then order or inquire when
            you&apos;re ready.
          </p>
          <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-[#D4A017]" />
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
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

        <div className="mt-12 flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-center sm:gap-4">
          <Link
            to="/books"
            className="inline-flex items-center gap-2 rounded-full bg-[#D4A017] px-8 py-3.5 text-base font-semibold text-[#2E1208] shadow-md transition hover:bg-[#b58900]"
          >
            Browse full catalog
            <ArrowRight className="h-5 w-5" aria-hidden />
          </Link>
          {hasMore ? (
            <p className="text-sm text-[#5C4436]">
              Showing {preview.length} of {books.length} titles — see the rest on the catalog page.
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default Books;
