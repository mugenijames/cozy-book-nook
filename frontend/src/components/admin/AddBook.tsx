
import { useState } from "react";
import axios from "axios";
import {
  ArrowLeft,
  AlertCircle,
  BookOpen,
  CheckCircle2,
  Loader2,
  Plus,
  Save,
} from "lucide-react";
import { Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

type AddBookProps = {
  onAdded: () => void;
};

type BookForm = {
  title: string;
  author: string;
  description: string;
  price: string;
};

const initialForm: BookForm = {
  title: "",
  author: "",
  description: "",
  price: "",
};

export default function AddBook({ onAdded }: AddBookProps) {
  const [form, setForm] = useState<BookForm>(initialForm);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: keyof BookForm, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setError(null);
    setSuccess(false);
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();

    setError(null);
    setSuccess(false);

    const title = form.title.trim();
    const author = form.author.trim();
    const description = form.description.trim();
    const price = Number(form.price);

    if (!title) {
      setError("Please enter the book title.");
      return;
    }

    if (!author) {
      setError("Please enter the author name.");
      return;
    }

    if (!form.price.trim() || Number.isNaN(price)) {
      setError("Please enter a valid book price.");
      return;
    }

    if (price < 0) {
      setError("Book price cannot be negative.");
      return;
    }

    if (!API) {
      setError(
        "The API address is not configured. Please check VITE_API_URL."
      );
      return;
    }

    try {
      setIsSubmitting(true);

      await axios.post(`${API}/books`, {
        title,
        author,
        description,
        price,
      });

      setForm(initialForm);
      setSuccess(true);

      onAdded();

      setTimeout(() => {
        setSuccess(false);
      }, 4000);
    } catch (err: any) {
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Unable to add the book. Please try again.";

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1100px] space-y-7">
      {/* Header */}
      <section>
        <Link
          to="/admin/books"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-[#5b3b27]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Books
        </Link>

        <div className="mt-5">
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#a47b45]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#c79a5a]" />
            Content Management
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-[#321c12] sm:text-4xl">
            Add New Book
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Add a new publication to the David Emuria book catalogue.
          </p>
        </div>
      </section>

      {/* Success */}
      {success && (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-4 text-emerald-800">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

          <div>
            <p className="text-sm font-semibold">
              Book added successfully
            </p>

            <p className="mt-0.5 text-xs text-emerald-700">
              The new book has been added to your catalogue.
            </p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-4 text-red-800">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

          <div>
            <p className="text-sm font-semibold">
              Unable to add book
            </p>

            <p className="mt-0.5 text-xs leading-5 text-red-700">
              {error}
            </p>
          </div>
        </div>
      )}

      <form onSubmit={submit}>
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Main form */}
          <section className="rounded-2xl border border-slate-200 bg-white shadow-[0_2px_12px_rgba(40,30,20,0.04)]">
            <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f3eee8] text-[#7a5435]">
                  <BookOpen className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-semibold text-[#321c12]">
                    Book Information
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Enter the basic details for the publication.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-5 p-5 sm:p-6">
              {/* Title */}
              <div>
                <label
                  htmlFor="book-title"
                  className="mb-2 block text-sm font-semibold text-[#4a3020]"
                >
                  Book Title
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <input
                  id="book-title"
                  type="text"
                  value={form.title}
                  onChange={(e) =>
                    updateField("title", e.target.value)
                  }
                  placeholder="Enter the book title"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#321c12] outline-none transition placeholder:text-slate-400 focus:border-[#b99261] focus:bg-white focus:ring-2 focus:ring-[#d8bd96]/30"
                />
              </div>

              {/* Author */}
              <div>
                <label
                  htmlFor="book-author"
                  className="mb-2 block text-sm font-semibold text-[#4a3020]"
                >
                  Author
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <input
                  id="book-author"
                  type="text"
                  value={form.author}
                  onChange={(e) =>
                    updateField("author", e.target.value)
                  }
                  placeholder="Enter author name"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#321c12] outline-none transition placeholder:text-slate-400 focus:border-[#b99261] focus:bg-white focus:ring-2 focus:ring-[#d8bd96]/30"
                />
              </div>

              {/* Description */}
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label
                    htmlFor="book-description"
                    className="block text-sm font-semibold text-[#4a3020]"
                  >
                    Description
                  </label>

                  <span className="text-[11px] text-slate-400">
                    {form.description.length} characters
                  </span>
                </div>

                <textarea
                  id="book-description"
                  value={form.description}
                  onChange={(e) =>
                    updateField("description", e.target.value)
                  }
                  placeholder="Write a clear and engaging description of the book..."
                  rows={9}
                  className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-[#321c12] outline-none transition placeholder:text-slate-400 focus:border-[#b99261] focus:bg-white focus:ring-2 focus:ring-[#d8bd96]/30"
                />

                <p className="mt-2 text-xs leading-5 text-slate-400">
                  Give readers a concise introduction to what the
                  book is about.
                </p>
              </div>
            </div>
          </section>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Pricing */}
            <section className="rounded-2xl border border-slate-200 bg-white shadow-[0_2px_12px_rgba(40,30,20,0.04)]">
              <div className="border-b border-slate-200 px-5 py-5">
                <h2 className="font-semibold text-[#321c12]">
                  Pricing
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Set the selling price for this publication.
                </p>
              </div>

              <div className="p-5">
                <label
                  htmlFor="book-price"
                  className="mb-2 block text-sm font-semibold text-[#4a3020]"
                >
                  Price
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#8a6a4c]">
                    KES
                  </span>

                  <input
                    id="book-price"
                    type="number"
                    min="0"
                    step="1"
                    value={form.price}
                    onChange={(e) =>
                      updateField("price", e.target.value)
                    }
                    placeholder="0"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-14 pr-4 text-sm font-semibold text-[#321c12] outline-none transition placeholder:text-slate-400 focus:border-[#b99261] focus:bg-white focus:ring-2 focus:ring-[#d8bd96]/30"
                  />
                </div>

                <p className="mt-2 text-xs leading-5 text-slate-400">
                  Enter the price in Kenyan Shillings.
                </p>
              </div>
            </section>

            {/* Preview */}
            <section className="rounded-2xl border border-slate-200 bg-white shadow-[0_2px_12px_rgba(40,30,20,0.04)]">
              <div className="border-b border-slate-200 px-5 py-5">
                <h2 className="font-semibold text-[#321c12]">
                  Preview
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  A quick preview of the catalogue entry.
                </p>
              </div>

              <div className="p-5">
                <div className="rounded-2xl border border-slate-200 bg-[#f7f7f5] p-4">
                  <div className="flex gap-4">
                    <div className="flex h-20 w-14 shrink-0 items-center justify-center rounded-lg bg-[#3a2115] shadow-sm">
                      <BookOpen className="h-6 w-6 text-[#e3bd7b]" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold text-[#321c12]">
                        {form.title || "Untitled Book"}
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        {form.author || "Author"}
                      </p>

                      <p className="mt-3 text-sm font-semibold text-[#5b3b27]">
                        {form.price
                          ? `KES ${Number(form.price).toLocaleString(
                              "en-KE"
                            )}`
                          : "KES 0"}
                      </p>
                    </div>
                  </div>

                  {form.description && (
                    <p className="mt-4 line-clamp-3 text-xs leading-5 text-slate-500">
                      {form.description}
                    </p>
                  )}
                </div>
              </div>
            </section>
          </aside>
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 z-20 mt-6 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-[0_-4px_20px_rgba(30,20,10,0.06)] backdrop-blur sm:p-5">
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Link
              to="/admin/books"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-[#654735] transition hover:bg-slate-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#3a2115] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#4b2b1c] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Adding Book...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 text-[#e3bd7b]" />
                  Add Book
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Small footer note */}
      <div className="flex items-center justify-center gap-2 pb-4 text-xs text-slate-400">
        <Plus className="h-3.5 w-3.5" />
        New publications can be edited later from the Books catalogue.
      </div>
    </div>
  );
}

