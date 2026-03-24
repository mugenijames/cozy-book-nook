import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, BookOpen, Loader2 } from "lucide-react";
import Header from "@/sections/Header";
import Footer from "@/sections/Footer";
import { getBooks } from "@/services/api";
import { BookShowcaseCard } from "@/components/BookShowcaseCard";

export default function BooksCatalogPage() {
  const { data: books = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["books", "catalog"],
    queryFn: getBooks,
  });

  return (
    <div className="min-h-screen bg-[#F9F6EF] text-[#2E1208]">
      <Header />

      <main className="pt-28 pb-20">
        <div className="container mx-auto max-w-7xl px-4">
          <nav className="mb-8 text-sm text-[#5C4436]">
            <Link to="/" className="inline-flex items-center gap-1 hover:text-[#8B4513]">
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Back to home
            </Link>
          </nav>

          <header className="mb-12 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8B4513]">
              Library
            </p>
            <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight md:text-4xl">
              All books
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-[#5C4436]">
              Every title in one place—read summaries and covers here, then use{" "}
              <strong className="font-medium text-[#2E1208]">Buy now</strong> or{" "}
              <strong className="font-medium text-[#2E1208]">Order / inquire</strong> to get your
              copy.
            </p>
          </header>

          {isLoading ? (
            <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-[#C17B4F]" aria-label="Loading" />
              <p className="text-[#5C4436]">Loading books…</p>
            </div>
          ) : isError ? (
            <div className="rounded-2xl border border-[#E8DDD4] bg-white p-10 text-center shadow-sm">
              <BookOpen className="mx-auto mb-4 h-12 w-12 text-[#C17B4F]/60" />
              <p className="text-[#2E1208] font-medium">Unable to load the catalog.</p>
              <button
                type="button"
                onClick={() => refetch()}
                className="mt-6 rounded-full bg-[#C17B4F] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#A55E36]"
              >
                Try again
              </button>
            </div>
          ) : books.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#C9B8A8] bg-white/80 p-12 text-center">
              <BookOpen className="mx-auto mb-4 h-12 w-12 text-[#C17B4F]/60" />
              <p className="text-lg text-[#2E1208]">No books yet</p>
              <p className="mt-2 text-[#5C4436]">Check back soon for new releases.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {books.map((book) => (
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
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
