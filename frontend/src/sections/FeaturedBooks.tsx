// frontend/src/sections/FeaturedBooks.tsx

import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Star,
} from "lucide-react";

import { getBooks } from "@/services/api";
import Book3D from "@/components/Book3D";
import LocalizedPrice from "@/components/LocalizedPrice";

const FEATURED_BOOKS_COUNT = 3;

const FeaturedBooks = () => {
  const {
    data: books = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["books", "featured"],
    queryFn: getBooks,
  });

  const featuredBooks = books.slice(0, FEATURED_BOOKS_COUNT);

  /*
  |--------------------------------------------------------------------------
  | Loading State
  |--------------------------------------------------------------------------
  */

  if (isLoading) {
    return (
      <section
        id="featured-books"
        className="relative overflow-hidden bg-[#EEF2F7] py-14 sm:py-16 lg:py-20"
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Header Skeleton */}
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <div className="mx-auto h-3 w-28 animate-pulse rounded-full bg-gray-200" />

            <div className="mx-auto mt-4 h-9 w-64 animate-pulse rounded-lg bg-gray-200 sm:h-10 sm:w-80" />

            <div className="mx-auto mt-4 h-4 max-w-lg animate-pulse rounded-full bg-gray-200" />
          </div>

          {/* Cards Skeleton */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
            {Array.from({ length: FEATURED_BOOKS_COUNT }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-black/5 bg-white p-4 shadow-sm"
              >
                <div className="mx-auto h-[250px] w-[170px] animate-pulse rounded-lg bg-gray-200" />

                <div className="mt-5 space-y-3">
                  <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />

                  <div className="h-5 w-4/5 animate-pulse rounded bg-gray-200" />

                  <div className="h-3 w-2/5 animate-pulse rounded bg-gray-200" />

                  <div className="h-3 w-full animate-pulse rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Error State
  |--------------------------------------------------------------------------
  */

  if (isError) {
    return (
      <section
        id="featured-books"
        className="bg-[#EEF2F7] py-14 sm:py-16"
      >
        <div className="mx-auto max-w-md px-5 text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#D4A017]/10">
            <BookOpen className="h-7 w-7 text-[#D4A017]" />
          </div>

          <h2 className="mt-5 text-xl font-bold text-[#4A1F0E]">
            Unable to load books
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            We couldn't retrieve the book collection right now.
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="
              mt-6
              rounded-full
              bg-[#4A1F0E]
              px-6
              py-3
              text-sm
              font-semibold
              text-white
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:bg-[#2E1208]
              hover:shadow-lg
            "
          >
            Try Again
          </button>

        </div>
      </section>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Empty State
  |--------------------------------------------------------------------------
  */

  if (featuredBooks.length === 0) {
    return (
      <section
        id="featured-books"
        className="bg-[#EEF2F7] py-14 sm:py-16"
      >
        <div className="mx-auto max-w-xl px-5 text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#D4A017]/10">
            <BookOpen className="h-7 w-7 text-[#D4A017]" />
          </div>

          <h2 className="mt-5 text-2xl font-bold text-[#4A1F0E]">
            Books coming soon
          </h2>

          <p className="mt-3 text-gray-600">
            New titles will be featured here as they become available.
          </p>

        </div>
      </section>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Main Section
  |--------------------------------------------------------------------------
  */

  return (
    <section
      id="featured-books"
      className="
        relative
        w-full
        overflow-hidden
        bg-[#EEF2F7]
        py-12
        sm:py-14
        lg:py-16
      "
    >

      {/* Decorative Background */}

      <div
        className="
          pointer-events-none
          absolute
          -left-32
          top-20
          h-64
          w-64
          rounded-full
          bg-[#D4A017]/10
          blur-3xl
        "
        aria-hidden="true"
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-32
          bottom-10
          h-72
          w-72
          rounded-full
          bg-[#4A1F0E]/10
          blur-3xl
        "
        aria-hidden="true"
      />

      <div
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-7xl
          px-4
          sm:px-6
          lg:px-8
        "
      >

        {/* =====================================================
            SECTION HEADER
        ===================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-9 max-w-2xl text-center sm:mb-11"
        >

          <div className="mb-3 flex items-center justify-center gap-3">
            <span className="h-px w-7 bg-[#D4A017]" />

            <span
              className="
                text-[11px]
                font-bold
                uppercase
                tracking-[0.25em]
                text-[#D4A017]
                sm:text-xs
              "
            >
              Featured Books
            </span>

            <span className="h-px w-7 bg-[#D4A017]" />
          </div>

          <h2
            className="
              text-3xl
              font-bold
              leading-tight
              tracking-tight
              text-[#4A1F0E]
              sm:text-4xl
              md:text-5xl
            "
          >
            Stories that inspire.
            <span className="block text-[#D4A017]">
              Words that transform.
            </span>
          </h2>

          <div className="mx-auto mt-4 h-1 w-12 rounded-full bg-[#D4A017]" />

          <p
            className="
              mx-auto
              mt-4
              max-w-xl
              text-sm
              leading-6
              text-gray-600
              sm:text-base
            "
          >
            Explore selected works by David Emuria on purpose,
            identity, healing, leadership, faith and transformation.
          </p>

        </motion.div>

        {/* =====================================================
            BOOK GRID
        ===================================================== */}

        <div
          className="
            grid
            grid-cols-1
            gap-6
            sm:grid-cols-2
            lg:grid-cols-3
            lg:gap-7
          "
        >

          {featuredBooks.map((book, index) => {
            const bookHref = `/book/${book.slug || book.id}`;

            return (
              <motion.article
                key={book.id}
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.15,
                }}
                transition={{
                  duration: 0.55,
                  delay: index * 0.08,
                }}
                className="
                  group
                  flex
                  min-w-0
                  flex-col
                  overflow-hidden
                  rounded-2xl
                  border
                  border-black/5
                  bg-white
                  shadow-sm
                  transition-all
                  duration-500
                  hover:-translate-y-1
                  hover:shadow-xl
                "
              >

                {/* =================================================
                    BOOK COVER
                ================================================= */}

                <Link
                  to={bookHref}
                  aria-label={`View ${book.title}`}
                  className="
                    block
                    px-4
                    pt-4
                    focus:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-[#D4A017]
                    focus-visible:ring-offset-2
                  "
                >

                  <div
                    className="
                      mx-auto
                      w-full
                      max-w-[220px]
                      overflow-visible
                    "
                  >
                    <Book3D
                      coverImage={book.coverImage}
                      title={book.title}
                      size="medium"
                    />
                  </div>

                </Link>

                {/* =================================================
                    BOOK INFORMATION
                ================================================= */}

                <div
                  className="
                    flex
                    flex-1
                    flex-col
                    px-5
                    pb-5
                    pt-3
                    sm:px-6
                    sm:pb-6
                  "
                >

                  {/* Rating */}

                  <div className="flex items-center gap-1">

                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <Star
                        key={starIndex}
                        aria-hidden="true"
                        className={`
                          h-3.5
                          w-3.5
                          ${
                            starIndex <
                            Math.round(book.rating || 0)
                              ? "fill-[#D4A017] text-[#D4A017]"
                              : "text-gray-300"
                          }
                        `}
                      />
                    ))}

                    <span className="ml-1 text-[11px] text-gray-500">
                      {Number(book.rating || 0).toFixed(1)}
                    </span>

                  </div>

                  {/* Title */}

                  <Link
                    to={bookHref}
                    className="
                      mt-2.5
                      line-clamp-2
                      text-lg
                      font-bold
                      leading-snug
                      text-[#2E1208]
                      transition-colors
                      duration-300
                      hover:text-[#C17B4F]
                      focus:outline-none
                      focus-visible:underline
                    "
                  >
                    {book.title}
                  </Link>

                  {/* Author */}

                  <p className="mt-1 text-sm font-medium text-[#C17B4F]">
                    {book.author}
                  </p>

                  {/* Description */}

                  {book.description && (
                    <p
                      className="
                        mt-2.5
                        line-clamp-2
                        text-sm
                        leading-5
                        text-gray-600
                      "
                    >
                      {book.description}
                    </p>
                  )}

                  {/* =================================================
                      PRICE + ACTION
                  ================================================= */}

                  <div
                    className="
                      mt-auto
                      flex
                      items-center
                      justify-between
                      gap-3
                      border-t
                      border-gray-100
                      pt-4
                      mt-4
                    "
                  >

                    <LocalizedPrice
                      priceCents={book.priceCents}
                      className="
                        text-sm
                        font-bold
                        text-[#4A1F0E]
                        sm:text-base
                      "
                    />

                    <Link
                      to={bookHref}
                      className="
                        inline-flex
                        shrink-0
                        items-center
                        gap-1.5
                        rounded-full
                        bg-[#4A1F0E]
                        px-4
                        py-2
                        text-xs
                        font-semibold
                        text-white
                        shadow-sm
                        transition-all
                        duration-300
                        hover:-translate-y-0.5
                        hover:bg-[#D4A017]
                        hover:shadow-md
                        focus:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-[#D4A017]
                        focus-visible:ring-offset-2
                        sm:px-4
                        sm:text-sm
                      "
                    >
                      <BookOpen
                        className="h-3.5 w-3.5"
                        aria-hidden="true"
                      />

                      View
                    </Link>

                  </div>

                </div>

              </motion.article>
            );
          })}

        </div>

        {/* =====================================================
            VIEW ALL
        ===================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.6,
          }}
          className="mt-9 flex justify-center sm:mt-11"
        >

          <Link
            to="/books"
            className="
              group
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-[#D4A017]
              px-6
              py-3
              text-sm
              font-bold
              text-white
              shadow-md
              transition-all
              duration-300
              hover:-translate-y-1
              hover:bg-[#B58900]
              hover:shadow-xl
              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#4A1F0E]
              focus-visible:ring-offset-2
              sm:px-7
              sm:text-base
            "
          >
            Explore all books

            <ArrowRight
              className="
                h-4
                w-4
                transition-transform
                duration-300
                group-hover:translate-x-1
              "
              aria-hidden="true"
            />
          </Link>

        </motion.div>

      </div>
    </section>
  );
};

export default FeaturedBooks;