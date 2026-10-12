// frontend/src/pages/admin/AdminBooks.tsx

import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Eye,
  Pencil,
  Plus,
  Trash2,
  RefreshCw,
  Search,
  CheckCircle2,
  Clock,
  Tag,
} from "lucide-react";

import { getApiBase } from "@/services/api";
import { getAdminToken } from "@/services/adminAuth";
import { resolveBookCoverUrl } from "@/lib/resolveBookCover";
import { formatPrice } from "@/lib/formatPrice";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

type Book = {
  id: string;
  title: string;
  slug: string;
  author?: string | null;
  price?: number | null;
  priceCents?: number | null;
  coverImage?: string | null;
  shortSummary?: string | null;
  published?: boolean;
  createdAt?: string;
};

export default function AdminBooks() {
  const navigate = useNavigate();

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [error, setError] = useState("");

  const apiBase = getApiBase();

  /* -------------------------------------------------------------------------- */
  /* LOAD BOOKS                                                                 */
  /* -------------------------------------------------------------------------- */

  const loadBooks = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getAdminToken();

      const response = await fetch(`${apiBase}/api/admin/books`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {}),
        },
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);

        throw new Error(
          data?.error || `Failed to load books (${response.status})`
        );
      }

      const data = await response.json();

      setBooks(Array.isArray(data) ? data : []);
      toast.success("Catalog updated successfully");
    } catch (err: any) {
      console.error("Failed to load books:", err);

      setError(
        err?.message || "Unable to load books. Please try again."
      );
      toast.error("Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadBooks();
  }, []);

  /* -------------------------------------------------------------------------- */
  /* DELETE BOOK                                                                */
  /* -------------------------------------------------------------------------- */

  const handleDelete = async (book: Book) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${book.title}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(book.id);
      setError("");

      const token = getAdminToken();

      const response = await fetch(
        `${apiBase}/api/admin/books/${book.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            ...(token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {}),
          },
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => null);

        throw new Error(
          data?.error || `Failed to delete book (${response.status})`
        );
      }

      setBooks((currentBooks) =>
        currentBooks.filter((item) => item.id !== book.id)
      );
      toast.success("Book removed from catalog");
    } catch (err: any) {
      console.error("Failed to delete book:", err);

      setError(
        err?.message || "Unable to delete the book."
      );
      toast.error("Failed to delete book");
    } finally {
      setDeleting(null);
    }
  };

  /* -------------------------------------------------------------------------- */
  /* STATS & FILTERING                                                          */
  /* -------------------------------------------------------------------------- */

  const stats = useMemo(() => {
    return {
      total: books.length,
      published: books.filter((b) => b.published).length,
      drafts: books.filter((b) => !b.published).length,
      free: books.filter(
        (b) => (!b.price && !b.priceCents) || b.price === 0 || b.priceCents === 0
      ).length,
    };
  }, [books]);

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        book.title?.toLowerCase().includes(query) ||
        book.author?.toLowerCase().includes(query) ||
        book.slug?.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "published" && book.published) ||
        (statusFilter === "draft" && !book.published);

      return matchesSearch && matchesStatus;
    });
  }, [books, search, statusFilter]);

  /* -------------------------------------------------------------------------- */
  /* RENDER                                                                     */
  /* -------------------------------------------------------------------------- */

  return (
    <div className="space-y-8 p-6 lg:p-8 bg-[#FAF8F5] min-h-screen text-[#2E1208]">
      {/* =========================================================
          HERO BANNER
      ========================================================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#2E1208] via-[#4A1F0E] to-[#2E1208] p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-[#E8DDD4] backdrop-blur-md">
              <BookOpen className="h-3.5 w-3.5 text-[#C17B4F]" />
              Catalog Management
            </div>
            <h1 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Books
            </h1>
            <p className="text-sm text-[#E8DDD4]/80 max-w-xl">
              Manage titles, digital downloads, hardcopy availability, and pricing in the David Emuria Library.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => void loadBooks()}
              disabled={loading}
              className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 bg-white/10 px-5 text-sm font-semibold text-white transition-all hover:bg-white/20 disabled:opacity-50"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin/books/new")}
              className="inline-flex h-12 items-center justify-center rounded-xl bg-[#C17B4F] px-6 text-sm font-semibold text-white shadow-lg transition-all hover:bg-[#A55E36] active:scale-95"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add New Book
            </button>
          </div>
        </div>

        {/* Ambient background accent */}
        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-[#C17B4F]/10 blur-3xl" />
      </div>

      {/* =========================================================
          STATISTICS OVERVIEW CARDS
      ========================================================= */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-6">
        <Card className="border border-[#E8DDD4] bg-white shadow-sm transition-all hover:shadow-md">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Total Titles
              </p>
              <h3 className="mt-1 font-heading text-2xl font-bold text-[#2E1208]">
                {stats.total}
              </h3>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F8F6F2] text-[#4A1F0E]">
              <BookOpen className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-[#E8DDD4] bg-white shadow-sm transition-all hover:shadow-md">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Published
              </p>
              <h3 className="mt-1 font-heading text-2xl font-bold text-emerald-600">
                {stats.published}
              </h3>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-[#E8DDD4] bg-white shadow-sm transition-all hover:shadow-md">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Drafts
              </p>
              <h3 className="mt-1 font-heading text-2xl font-bold text-amber-600">
                {stats.drafts}
              </h3>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
              <Clock className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-[#E8DDD4] bg-white shadow-sm transition-all hover:shadow-md">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Free Copies
              </p>
              <h3 className="mt-1 font-heading text-2xl font-bold text-[#C17B4F]">
                {stats.free}
              </h3>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#C17B4F]/10 text-[#C17B4F]">
              <Tag className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* =========================================================
          CONTROLS: SEARCH & FILTERS
      ========================================================= */}
      <div className="flex flex-col gap-4 rounded-2xl border border-[#E8DDD4] bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search title, author or slug..."
            className="h-10 w-full rounded-xl border border-[#E8DDD4] bg-white pl-10 pr-4 text-sm outline-none transition focus:border-[#C17B4F] focus:ring-2 focus:ring-[#C17B4F]/20"
          />
        </div>

        <div className="flex items-center gap-1.5 rounded-xl bg-[#F8F6F2] p-1 border border-[#E8DDD4]">
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-all ${
              statusFilter === "all"
                ? "bg-[#2E1208] text-white shadow-sm"
                : "text-gray-600 hover:text-[#2E1208]"
            }`}
          >
            All ({stats.total})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("published")}
            className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-all ${
              statusFilter === "published"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-gray-600 hover:text-[#2E1208]"
            }`}
          >
            Published ({stats.published})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("draft")}
            className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-all ${
              statusFilter === "draft"
                ? "bg-amber-600 text-white shadow-sm"
                : "text-gray-600 hover:text-[#2E1208]"
            }`}
          >
            Drafts ({stats.drafts})
          </button>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-[#E8DDD4] bg-white">
          <div className="flex flex-col items-center gap-3 text-gray-500">
            <RefreshCw className="h-7 w-7 animate-spin text-[#C17B4F]" />
            <p className="text-sm">Loading books...</p>
          </div>
        </div>
      )}

      {/* DESKTOP TABLE */}
      {!loading && filteredBooks.length > 0 && (
        <div className="hidden overflow-hidden rounded-2xl border border-[#E8DDD4] bg-white shadow-sm md:block">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[#E8DDD4] bg-[#F8F6F2] text-[11px] font-bold uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-6 py-4">Book</th>
                  <th className="px-6 py-4">Author</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DDD4]">
                {filteredBooks.map((book) => {
                  const coverSrc = resolveBookCoverUrl(book.coverImage);
                  const resolvedPrice = book.price ?? book.priceCents;
                  const isFree = !resolvedPrice || resolvedPrice === 0;

                  return (
                    <tr
                      key={book.id}
                      className="group transition-colors hover:bg-[#F8F6F2]/50"
                    >
                      {/* BOOK */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-9 shrink-0 overflow-hidden rounded-md border border-[#E8DDD4] bg-[#2E1208] shadow-sm">
                            {coverSrc ? (
                              <img
                                src={coverSrc}
                                alt={book.title}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = "/placeholder.svg";
                                }}
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[#C17B4F]">
                                <BookOpen className="h-4 w-4" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-[#2E1208] group-hover:text-[#C17B4F] transition-colors">
                              {book.title}
                            </p>
                            <p className="text-xs text-gray-400 font-mono">
                              /book/{book.slug}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* AUTHOR */}
                      <td className="px-6 py-4 font-medium text-gray-700">
                        {book.author || "David Emuria"}
                      </td>

                      {/* PRICE */}
                      <td className="px-6 py-4">
                        {isFree ? (
                          <span className="font-semibold text-emerald-600">
                            Free
                          </span>
                        ) : (
                          <span className="font-semibold text-[#2E1208]">
                            {formatPrice(resolvedPrice!, "KES")}
                          </span>
                        )}
                      </td>

                      {/* STATUS */}
                      <td className="px-6 py-4">
                        {book.published ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                            Draft
                          </span>
                        )}
                      </td>

                      {/* ACTIONS */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {book.slug ? (
                            <a
                              href={`/book/${book.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 rounded-lg border border-[#E8DDD4] bg-white px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-[#F8F6F2] hover:text-[#2E1208] transition-colors shadow-sm"
                              title="View public book"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              View
                            </a>
                          ) : (
                            <button
                              type="button"
                              disabled
                              className="inline-flex items-center gap-1 rounded-lg border border-[#E8DDD4] bg-white px-2.5 py-1.5 text-xs font-medium text-gray-400 opacity-50 shadow-sm"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              View
                            </button>
                          )}

                          <a
                            href={`/admin/books/${book.id}/edit`}
                            className="inline-flex items-center gap-1 rounded-lg border border-[#E8DDD4] bg-white px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-[#F8F6F2] hover:text-[#C17B4F] transition-colors shadow-sm"
                            title="Edit book"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </a>

                          <button
                            type="button"
                            onClick={() => void handleDelete(book)}
                            disabled={deleting === book.id}
                            className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-white px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors shadow-sm disabled:opacity-50"
                            title="Delete book"
                          >
                            {deleting === book.id ? (
                              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="h-3.5 w-3.5" />
                            )}
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MOBILE CARDS */}
      {!loading && filteredBooks.length > 0 && (
        <div className="grid gap-4 md:hidden">
          {filteredBooks.map((book) => {
            const coverSrc = resolveBookCoverUrl(book.coverImage);
            const resolvedPrice = book.price ?? book.priceCents;
            const isFree = !resolvedPrice || resolvedPrice === 0;

            return (
              <div
                key={book.id}
                className="rounded-2xl border border-[#E8DDD4] bg-white p-4 shadow-sm"
              >
                <div className="flex gap-4">
                  <div className="h-24 w-16 shrink-0 overflow-hidden rounded-xl bg-[#2E1208] border border-[#E8DDD4]">
                    {coverSrc ? (
                      <img
                        src={coverSrc}
                        alt={book.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[#C17B4F]">
                        <BookOpen className="h-6 w-6" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold text-[#2E1208]">
                      {book.title}
                    </h3>
                    <p className="mt-0.5 text-sm text-gray-500">
                      {book.author || "David Emuria"}
                    </p>
                    <p className="mt-1 text-sm font-bold text-[#2E1208]">
                      {isFree ? "Free" : formatPrice(resolvedPrice!, "KES")}
                    </p>

                    <div className="mt-2">
                      {book.published ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                          Draft
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 border-t border-[#E8DDD4] pt-3">
                  {book.slug ? (
                    <a
                      href={`/book/${book.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-9 items-center justify-center gap-1 rounded-lg border border-[#E8DDD4] bg-white text-xs font-medium text-gray-700 hover:bg-[#F8F6F2]"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </a>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="inline-flex h-9 items-center justify-center gap-1 rounded-lg border border-[#E8DDD4] bg-white text-xs font-medium text-gray-400 opacity-50"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </button>
                  )}

                  <a
                    href={`/admin/books/${book.id}/edit`}
                    className="inline-flex h-9 items-center justify-center gap-1 rounded-lg border border-[#E8DDD4] bg-white text-xs font-medium text-gray-700 hover:bg-[#F8F6F2]"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </a>

                  <button
                    type="button"
                    onClick={() => void handleDelete(book)}
                    disabled={deleting === book.id}
                    className="inline-flex h-9 items-center justify-center gap-1 rounded-lg border border-red-200 bg-white text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    {deleting === book.id ? (
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* EMPTY */}
      {!loading && filteredBooks.length === 0 && (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-[#E8DDD4] bg-white px-6 text-center shadow-sm">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#F8F6F2] text-gray-400">
            <BookOpen className="h-7 w-7" />
          </div>

          <h2 className="text-lg font-semibold text-[#2E1208]">
            {search || statusFilter !== "all" ? "No books found" : "No books yet"}
          </h2>

          <p className="mt-1 max-w-md text-sm text-gray-500">
            {search || statusFilter !== "all"
              ? "Try clearing your search terms or filters."
              : "Create your first book to start building the library."}
          </p>

          {!search && statusFilter === "all" && (
            <button
              type="button"
              onClick={() => navigate("/admin/books/new")}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#C17B4F] px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-[#A55E36]"
            >
              <Plus className="h-4 w-4" />
              Add New Book
            </button>
          )}
        </div>
      )}
    </div>
  );
}