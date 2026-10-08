import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Edit3,
  Eye,
  Search,
  RefreshCw,
  Plus,
  Library,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { getBooks } from "@/services/api";

type Book = {
  id: string;
  title?: string;
  author?: string;
  price?: number | string;
  coverImage?: string;
  coverUrl?: string;
  image?: string;
  published?: boolean;
  isPublished?: boolean;
  status?: string;
  description?: string;
};

const formatPrice = (price: number | string | undefined) => {
  if (price === undefined || price === null || price === "") {
    return "—";
  }

  const numericPrice =
    typeof price === "number"
      ? price
      : Number(String(price).replace(/[^0-9.-]/g, ""));

  if (Number.isNaN(numericPrice)) {
    return String(price);
  }

  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(numericPrice);
};

const getCover = (book: Book) =>
  book.coverImage ||
  book.coverUrl ||
  book.image ||
  "";

const getPublishedState = (book: Book) => {
  if (typeof book.isPublished === "boolean") {
    return book.isPublished;
  }

  if (typeof book.published === "boolean") {
    return book.published;
  }

  const status = String(book.status || "").toUpperCase();

  if (["PUBLISHED", "LIVE", "ACTIVE"].includes(status)) {
    return true;
  }

  return false;
};

export default function AdminBooks() {
  const {
    data: books = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery<Book[]>({
    queryKey: ["books"],
    queryFn: getBooks,
  });

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | "PUBLISHED" | "DRAFT">("ALL");

  const filteredBooks = useMemo(() => {
    const query = search.trim().toLowerCase();

    return books.filter((book) => {
      const matchesSearch =
        !query ||
        String(book.title || "").toLowerCase().includes(query) ||
        String(book.author || "").toLowerCase().includes(query);

      const published = getPublishedState(book);

      const matchesFilter =
        filter === "ALL" ||
        (filter === "PUBLISHED" && published) ||
        (filter === "DRAFT" && !published);

      return matchesSearch && matchesFilter;
    });
  }, [books, search, filter]);

  const publishedCount = books.filter(getPublishedState).length;
  const draftCount = books.length - publishedCount;

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-8">
          <div className="h-3 w-28 animate-pulse rounded bg-slate-200" />
          <div className="mt-3 h-9 w-64 animate-pulse rounded-lg bg-slate-200" />
          <div className="mt-3 h-4 w-96 max-w-full animate-pulse rounded bg-slate-200" />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="space-y-4 p-6">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="flex animate-pulse items-center gap-4 border-b border-slate-100 pb-4"
              >
                <div className="h-16 w-12 rounded-lg bg-slate-200" />
                <div className="flex-1">
                  <div className="h-4 w-48 rounded bg-slate-200" />
                  <div className="mt-2 h-3 w-32 rounded bg-slate-200" />
                </div>
                <div className="h-8 w-20 rounded bg-slate-200" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-[1500px]">
        <div className="rounded-2xl border border-red-100 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <AlertCircle className="h-7 w-7 text-red-600" />
          </div>

          <h2 className="mt-5 text-lg font-semibold text-[#321c12]">
            Unable to load books
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            We couldn't retrieve the books from the publishing platform.
            Please try again.
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#3a2115] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4b2b1c]"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1500px] space-y-7">
      {/* Header */}
      <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#a47b45]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#c79a5a]" />
            Content Management
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-[#321c12] sm:text-4xl">
            Books
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Manage David Emuria's books, pricing, publication status and
            catalogue information.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#5b4030] shadow-sm transition hover:border-[#d8c3ac] hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </button>

          <Link
            to="/admin/books/new"
            className="inline-flex items-center gap-2 rounded-xl bg-[#3a2115] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#4b2b1c] hover:shadow-md"
          >
            <Plus className="h-4 w-4 text-[#e3bd7b]" />
            Add Book
          </Link>
        </div>
      </section>

      {/* Summary cards */}
      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_12px_rgba(40,30,20,0.04)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Total Books
              </p>

              <p className="mt-2 text-2xl font-semibold text-[#321c12]">
                {books.length}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f3eee8] text-[#7a5435]">
              <Library className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_12px_rgba(40,30,20,0.04)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Published
              </p>

              <p className="mt-2 text-2xl font-semibold text-[#321c12]">
                {publishedCount}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_12px_rgba(40,30,20,0.04)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Drafts
              </p>

              <p className="mt-2 text-2xl font-semibold text-[#321c12]">
                {draftCount}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <BookOpen className="h-5 w-5" />
            </div>
          </div>
        </div>
      </section>

      {/* Catalogue */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_12px_rgba(40,30,20,0.04)]">
        {/* Toolbar */}
        <div className="border-b border-slate-200 p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#321c12]">
                Book Catalogue
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {filteredBooks.length}{" "}
                {filteredBooks.length === 1 ? "book" : "books"} displayed
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              {/* Search */}
              <div className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search books..."
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-[#321c12] outline-none transition placeholder:text-slate-400 focus:border-[#b99261] focus:bg-white focus:ring-2 focus:ring-[#d8bd96]/30 sm:w-64"
                />
              </div>

              {/* Filter */}
              <select
                value={filter}
                onChange={(event) =>
                  setFilter(
                    event.target.value as "ALL" | "PUBLISHED" | "DRAFT"
                  )
                }
                className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-[#5b4030] outline-none transition focus:border-[#b99261] focus:bg-white focus:ring-2 focus:ring-[#d8bd96]/30"
              >
                <option value="ALL">All books</option>
                <option value="PUBLISHED">Published</option>
                <option value="DRAFT">Drafts</option>
              </select>
            </div>
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-[#f7f7f5]">
                <th className="px-6 py-3.5 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  Book
                </th>

                <th className="px-6 py-3.5 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  Author
                </th>

                <th className="px-6 py-3.5 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  Price
                </th>

                <th className="px-6 py-3.5 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  Status
                </th>

                <th className="px-6 py-3.5 text-right text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredBooks.length > 0 ? (
                filteredBooks.map((book) => {
                  const published = getPublishedState(book);
                  const cover = getCover(book);

                  return (
                    <tr
                      key={book.id}
                      className="border-b border-slate-100 transition-colors hover:bg-[#fafaf8]"
                    >
                      <td className="px-6 py-4">
                        <div className="flex min-w-[280px] items-center gap-4">
                          {cover ? (
                            <img
                              src={cover}
                              alt={book.title || "Book cover"}
                              className="h-16 w-12 rounded-lg object-cover shadow-sm ring-1 ring-black/5"
                            />
                          ) : (
                            <div className="flex h-16 w-12 shrink-0 items-center justify-center rounded-lg bg-[#f0ebe5] text-[#8a6344]">
                              <BookOpen className="h-5 w-5" />
                            </div>
                          )}

                          <div className="min-w-0">
                            <p className="truncate font-semibold text-[#321c12]">
                              {book.title || "Untitled Book"}
                            </p>

                            {book.description && (
                              <p className="mt-1 max-w-[360px] truncate text-xs text-slate-400">
                                {book.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {book.author || "David Emuria"}
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-[#4b3020]">
                          {formatPrice(book.price)}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        {published ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-100 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                            Draft
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <Link
                            to={`/admin/books/${book.id}`}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-[#654735] transition hover:border-[#cdb28e] hover:bg-[#faf7f3]"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                            Edit
                          </Link>

                          <Link
                            to={`/books/${book.id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-[#cdb28e] hover:bg-[#faf7f3] hover:text-[#654735]"
                            title="View book"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f4f0eb] text-[#876348]">
                      <BookOpen className="h-6 w-6" />
                    </div>

                    <h3 className="mt-4 text-base font-semibold text-[#321c12]">
                      {search || filter !== "ALL"
                        ? "No books found"
                        : "No books yet"}
                    </h3>

                    <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                      {search || filter !== "ALL"
                        ? "Try changing your search or filter to find a book."
                        : "Add your first book to start building the David Emuria catalogue."}
                    </p>

                    {!search && filter === "ALL" && (
                      <Link
                        to="/admin/books/new"
                        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#3a2115] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4b2b1c]"
                      >
                        <Plus className="h-4 w-4 text-[#e3bd7b]" />
                        Add First Book
                      </Link>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="divide-y divide-slate-100 md:hidden">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => {
              const published = getPublishedState(book);
              const cover = getCover(book);

              return (
                <div key={book.id} className="p-4">
                  <div className="flex gap-4">
                    {cover ? (
                      <img
                        src={cover}
                        alt={book.title || "Book cover"}
                        className="h-24 w-17 shrink-0 rounded-lg object-cover shadow-sm ring-1 ring-black/5"
                      />
                    ) : (
                      <div className="flex h-24 w-[68px] shrink-0 items-center justify-center rounded-lg bg-[#f0ebe5] text-[#8a6344]">
                        <BookOpen className="h-6 w-6" />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-[#321c12]">
                        {book.title || "Untitled Book"}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {book.author || "David Emuria"}
                      </p>

                      <p className="mt-3 text-sm font-semibold text-[#4b3020]">
                        {formatPrice(book.price)}
                      </p>

                      <div className="mt-2">
                        {published ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-100 bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                            Draft
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Link
                      to={`/admin/books/${book.id}`}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-[#654735] transition hover:bg-[#faf7f3]"
                    >
                      <Edit3 className="h-4 w-4" />
                      Edit Book
                    </Link>

                    <Link
                      to={`/books/${book.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center rounded-xl border border-slate-200 px-3 text-slate-500 transition hover:bg-[#faf7f3] hover:text-[#654735]"
                      title="View book"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="px-5 py-14 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f4f0eb] text-[#876348]">
                <BookOpen className="h-6 w-6" />
              </div>

              <h3 className="mt-4 font-semibold text-[#321c12]">
                No books found
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Try changing your search or filter.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

