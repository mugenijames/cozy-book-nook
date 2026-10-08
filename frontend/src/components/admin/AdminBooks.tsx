import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Eye,
  Pencil,
  Plus,
  Trash2,
  RefreshCw,
  Search,
} from "lucide-react";

import { getApiBase } from "@/services/api";
import { getAdminToken } from "@/services/adminAuth";

type Book = {
  id: string;
  title: string;
  slug: string;
  author?: string | null;
  price?: number | null;
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
    } catch (err: any) {
      console.error("Failed to load books:", err);

      setError(
        err?.message || "Unable to load books. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
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
    } catch (err: any) {
      console.error("Failed to delete book:", err);

      setError(
        err?.message || "Unable to delete the book."
      );
    } finally {
      setDeleting(null);
    }
  };

  /* -------------------------------------------------------------------------- */
  /* SEARCH                                                                     */
  /* -------------------------------------------------------------------------- */

  const filteredBooks = books.filter((book) => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return true;
    }

    return (
      book.title?.toLowerCase().includes(query) ||
      book.author?.toLowerCase().includes(query) ||
      book.slug?.toLowerCase().includes(query)
    );
  });

  /* -------------------------------------------------------------------------- */
  /* RENDER                                                                     */
  /* -------------------------------------------------------------------------- */

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Books
              </h1>

              <p className="text-sm text-muted-foreground">
                Manage books in the David Emuria Library.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate("/admin/books/new")}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Add New Book
        </button>
      </div>

      {/* SEARCH + REFRESH */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search books..."
            className="w-full rounded-lg border bg-background py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <button
          type="button"
          onClick={loadBooks}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-300">
          {error}
        </div>
      )}

      {/* BOOK COUNT */}
      {!loading && (
        <div className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">
            {filteredBooks.length}
          </span>{" "}
          {filteredBooks.length === 1 ? "book" : "books"}
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="flex min-h-[300px] items-center justify-center rounded-xl border bg-card">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <RefreshCw className="h-7 w-7 animate-spin" />

            <p className="text-sm">Loading books...</p>
          </div>
        </div>
      )}

      {/* DESKTOP TABLE */}
      {!loading && filteredBooks.length > 0 && (
        <div className="hidden overflow-hidden rounded-xl border bg-card md:block">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/40">
                <tr>
                  <th className="px-5 py-4 text-left font-semibold">
                    Book
                  </th>

                  <th className="px-5 py-4 text-left font-semibold">
                    Author
                  </th>

                  <th className="px-5 py-4 text-left font-semibold">
                    Price
                  </th>

                  <th className="px-5 py-4 text-left font-semibold">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {filteredBooks.map((book) => (
                  <tr
                    key={book.id}
                    className="transition hover:bg-muted/30"
                  >
                    {/* BOOK */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-14 w-11 shrink-0 overflow-hidden rounded-md bg-muted">
                          {book.coverImage ? (
                            <img
                              src={book.coverImage}
                              alt={book.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <BookOpen className="h-5 w-5 text-muted-foreground" />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-medium">
                            {book.title}
                          </p>

                          <p className="mt-0.5 max-w-[260px] truncate text-xs text-muted-foreground">
                            /book/{book.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* AUTHOR */}
                    <td className="px-5 py-4 text-muted-foreground">
                      {book.author || "David Emuria"}
                    </td>

                    {/* PRICE */}
                    <td className="px-5 py-4 font-medium">
                      {book.price != null
                        ? `KES ${Number(book.price).toLocaleString()}`
                        : "Free"}
                    </td>

                    {/* STATUS */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          book.published
                            ? "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400"
                        }`}
                      >
                        {book.published ? "Published" : "Draft"}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {/* VIEW */}
                        {book.slug ? (
                          <a
                            href={`/book/${book.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-xs font-medium transition hover:bg-muted"
                            title="View public book"
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </a>
                        ) : (
                          <button
                            type="button"
                            disabled
                            className="inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-xs font-medium opacity-50"
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </button>
                        )}

                        {/* EDIT */}
                        <a
                          href={`/admin/books/${book.id}/edit`}
                          className="inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-xs font-medium transition hover:bg-muted"
                          title="Edit book"
                        >
                          <Pencil className="h-4 w-4" />
                          Edit
                        </a>

                        {/* DELETE */}
                        <button
                          type="button"
                          onClick={() => handleDelete(book)}
                          disabled={deleting === book.id}
                          className="inline-flex h-9 items-center gap-2 rounded-lg border border-red-200 px-3 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900/40 dark:hover:bg-red-950/20"
                          title="Delete book"
                        >
                          {deleting === book.id ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MOBILE CARDS */}
      {!loading && filteredBooks.length > 0 && (
        <div className="grid gap-4 md:hidden">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="rounded-xl border bg-card p-4"
            >
              <div className="flex gap-4">
                {/* COVER */}
                <div className="h-24 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                  {book.coverImage ? (
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <BookOpen className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* DETAILS */}
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold">
                    {book.title}
                  </h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {book.author || "David Emuria"}
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    {book.price != null
                      ? `KES ${Number(book.price).toLocaleString()}`
                      : "Free"}
                  </p>

                  <span
                    className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                      book.published
                        ? "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400"
                    }`}
                  >
                    {book.published ? "Published" : "Draft"}
                  </span>
                </div>
              </div>

              {/* MOBILE ACTIONS */}
              <div className="mt-4 grid grid-cols-3 gap-2">
                {/* VIEW */}
                {book.slug ? (
                  <a
                    href={`/book/${book.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-9 items-center justify-center gap-1 rounded-lg border text-xs font-medium transition hover:bg-muted"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="inline-flex h-9 items-center justify-center gap-1 rounded-lg border text-xs font-medium opacity-50"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </button>
                )}

                {/* EDIT */}
                <a
                  href={`/admin/books/${book.id}/edit`}
                  className="inline-flex h-9 items-center justify-center gap-1 rounded-lg border text-xs font-medium transition hover:bg-muted"
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </a>

                {/* DELETE */}
                <button
                  type="button"
                  onClick={() => handleDelete(book)}
                  disabled={deleting === book.id}
                  className="inline-flex h-9 items-center justify-center gap-1 rounded-lg border border-red-200 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900/40"
                >
                  {deleting === book.id ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EMPTY */}
      {!loading && filteredBooks.length === 0 && (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border bg-card px-6 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <BookOpen className="h-7 w-7 text-muted-foreground" />
          </div>

          <h2 className="text-lg font-semibold">
            {search ? "No books found" : "No books yet"}
          </h2>

          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            {search
              ? "Try changing your search term."
              : "Create your first book to start building the library."}
          </p>

          {!search && (
            <button
              type="button"
              onClick={() => navigate("/admin/books/new")}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"
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

