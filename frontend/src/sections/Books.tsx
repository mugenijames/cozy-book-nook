// frontend/src/sections/Books.tsx

import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BookOpen,
  Loader2,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";

import { getBooks } from "@/services/api";
import { BookShowcaseCard } from "@/components/BookShowcaseCard";

/**
 * Number of books displayed on the homepage.
 */
const HOME_BOOKS_PREVIEW = 4;

const Books = () => {
  const {
    data: books = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["books", "home-preview"],
    queryFn: getBooks,
  });

  const preview = books.slice(0, HOME_BOOKS_PREVIEW);
  const hasMore = books.length > preview.length;

  /*
   * ---------------------------------------------------------
   * LOADING STATE
   * ---------------------------------------------------------
   */
  if (isLoading) {
    return (
      <section
        id="books"
        className="relative overflow-hidden bg-[#F7F7F5] py-20 sm:py-24 lg:py-28"
      >
        <div className="container relative z-10 mx-auto px-5 sm:px-6 lg:px-8">
          {/* Heading */}
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <div className="mx-auto mb-4 h-4 w-32 animate-pulse rounded-full bg-gray-200" />

            <div className="mx-auto h-10 w-72 animate-pulse rounded-lg bg-gray-200 sm:w-96" />

            <div className="mx-auto mt-5 h-4 max-w-xl animate-pulse rounded-full bg-gray-200" />
            <div className="mx-auto mt-2 h-4 max-w-md animate-pulse rounded-full bg-gray-200" />
          </div>

          {/* Skeleton cards */}
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-2 md:grid-cols-4 lg:gap-7">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl bg-white shadow-sm"
              >
                <div className="aspect-[2/3] animate-pulse bg-gray-200" />

                <div className="space-y-3 p-4">
                  <div className="h-4 animate-pulse rounded bg-gray-200" />
                  <div className="h-3 w-2/3 animate-pulse rounded bg-gray-200" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /*
   * ---------------------------------------------------------
   * ERROR STATE
   * ---------------------------------------------------------
   */
  if (isError) {
    return (
      <section
        id="books"
        className="bg-[#F7F7F5] py-20 sm:py-24"
      >
        <div className="container mx-auto px-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-lg rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#4A1F0E]/10">
              <BookOpen className="h-6 w-6 text-[#4A1F0E]" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-[#4A1F0E]">
              Couldn't load the books
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Check your connection or try again in a moment.
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="
                mt-6
                inline-flex
                items-center
                justify-center
                rounded-full
                bg-[#4A1F0E]
                px-6
                py-3
                text-sm
                font-semibold
                text-white
                shadow-md
                transition
                duration-300
                hover:-translate-y-0.5
                hover:bg-[#2E1208]
                hover:shadow-lg
              "
            >
              Try again
            </button>
          </div>
        </div>
      </section>
    );
  }

  /*
   * ---------------------------------------------------------
   * EMPTY STATE
   * ---------------------------------------------------------
   */
  if (books.length === 0) {
    return (
      <section
        id="books"
        className="bg-[#F7F7F5] py-20 sm:py-24"
      >
        <div className="container mx-auto px-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#D4A017]/15">
              <BookOpen className="h-7 w-7 text-[#D4A017]" />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-[#4A1F0E] sm:text-3xl">
              Books coming soon
            </h2>

            <p className="mt-3 leading-7 text-gray-600">
              New titles will appear here once they are added to the
              collection.
            </p>
          </div>
        </div>
      </section>
    );
  }

  /*
   * ---------------------------------------------------------
   * MAIN BOOKS SECTION
   * ---------------------------------------------------------
   */
  return (
    <section
      id="books"
      className="
        relative
        overflow-hidden
        bg-[#F7F7F5]
        py-20
        sm:py-24
        lg:py-32
      "
    >
      {/* Decorative background elements */}
      <div
        className="
          pointer-events-none
          absolute
          -left-32
          top-20
          h-72
          w-72
          rounded-full
          bg-[#D4A017]/10
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-32
          bottom-0
          h-80
          w-80
          rounded-full
          bg-[#4A1F0E]/10
          blur-3xl
        "
      />

      <div className="container relative z-10 mx-auto px-5 sm:px-6 lg:px-8">

        {/* =====================================================
            SECTION HEADER
        ===================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-14 max-w-3xl text-center lg:mb-16"
        >
          {/* Eyebrow */}
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#D4A017]" />

            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#D4A017] sm:text-sm">
              The Library
            </p>

            <span className="h-px w-8 bg-[#D4A017]" />
          </div>

          {/* Main heading */}
          <h2 className="text-3xl font-bold leading-tight tracking-tight text-[#4A1F0E] sm:text-4xl md:text-5xl lg:text-6xl">
            Books that inspire.
            <span className="block text-[#D4A017]">
              Ideas that transform.
            </span>
          </h2>

          {/* Divider */}
          <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-[#D4A017]" />

          {/* Description */}
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
            Explore David Emuria's collection of books on purpose,
            identity, relationships, leadership, healing, faith, and
            personal transformation.
          </p>
        </motion.div>

        {/* =====================================================
            FEATURED BOOKS
        ===================================================== */}
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-2 md:grid-cols-4 lg:gap-7">
          {preview.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
              }}
              className="min-w-0"
            >
              <BookShowcaseCard
                id={String(book.id)}
                title={book.title}
                author={book.author}
                slug={book.slug}
                coverImage={book.coverImage}
                rating={book.rating}
                description={book.description}
                priceCents={book.priceCents}
              />
            </motion.div>
          ))}
        </div>

        {/* =====================================================
            BOTTOM CTA
        ===================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-14 flex flex-col items-center justify-center gap-4 sm:mt-16"
        >
          <Link
            to="/books"
            className="
              group
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-[#4A1F0E]
              px-7
              py-3.5
              text-sm
              font-semibold
              text-white
              shadow-lg
              transition-all
              duration-300
              hover:-translate-y-1
              hover:bg-[#2E1208]
              hover:shadow-xl
              sm:px-8
              sm:text-base
            "
          >
            Explore the full collection

            <ArrowRight
              className="
                h-4
                w-4
                transition-transform
                duration-300
                group-hover:translate-x-1
              "
              aria-hidden
            />
          </Link>

          {hasMore && (
            <p className="text-xs text-gray-500 sm:text-sm">
              Showing {preview.length} of {books.length} titles
            </p>
          )}
        </motion.div>

        {/* =====================================================
            AUTHOR STATEMENT
        ===================================================== */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="
            mx-auto
            mt-20
            max-w-4xl
            border-t
            border-gray-200
            pt-10
            text-center
            lg:mt-24
            lg:pt-12
          "
        >
          <Star className="mx-auto h-5 w-5 fill-[#D4A017] text-[#D4A017]" />

          <p className="mt-4 text-lg font-medium italic leading-8 text-[#4A1F0E] sm:text-xl">
            "Words have the power to challenge perspectives, awaken
            purpose, and inspire people to become more than they thought
            possible."
          </p>

          <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-[#D4A017]">
            David Emuria
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Books;