// frontend/src/sections/FeaturedBooks.tsx

import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Loader2,
  Star,
} from "lucide-react";

import { getBooks } from "@/services/api";

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

  /*
   * For now we use the first three books returned by the API.
   * Later, we can add a "featured" field to Prisma and allow
   * you to choose exactly which books appear here.
   */
  const featuredBooks = books.slice(0, FEATURED_BOOKS_COUNT);

  /*
   * ---------------------------------------------------------
   * LOADING STATE
   * ---------------------------------------------------------
   */

  if (isLoading) {
    return (
      <section
        id="featured-books"
        className="relative overflow-hidden bg-[#F7F7F5] py-20 sm:py-24 lg:py-32"
      >
        <div className="container mx-auto px-5 sm:px-6 lg:px-8">

          <div className="mx-auto mb-14 max-w-3xl text-center">
            <div className="mx-auto h-4 w-32 animate-pulse rounded-full bg-gray-200" />

            <div className="mx-auto mt-5 h-10 w-72 animate-pulse rounded-lg bg-gray-200 sm:w-96" />

            <div className="mx-auto mt-5 h-4 max-w-xl animate-pulse rounded-full bg-gray-200" />
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-3xl bg-white shadow-sm"
              >
                <div className="aspect-[3/4] animate-pulse bg-gray-200" />

                <div className="space-y-4 p-7">
                  <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />

                  <div className="h-6 animate-pulse rounded bg-gray-200" />

                  <div className="h-4 animate-pulse rounded bg-gray-200" />

                  <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
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
        id="featured-books"
        className="bg-[#F7F7F5] py-20 sm:py-24"
      >
        <div className="container mx-auto px-5 sm:px-6 lg:px-8">

          <div className="mx-auto max-w-md rounded-3xl bg-white p-8 text-center shadow-sm">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#4A1F0E]/10">
              <BookOpen className="h-6 w-6 text-[#4A1F0E]" />
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
                transition
                hover:bg-[#2E1208]
              "
            >
              Try Again
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

  if (featuredBooks.length === 0) {
    return (
      <section
        id="featured-books"
        className="bg-[#F7F7F5] py-20 sm:py-24"
      >
        <div className="container mx-auto px-5 sm:px-6 lg:px-8">

          <div className="mx-auto max-w-xl text-center">

            <BookOpen className="mx-auto h-10 w-10 text-[#D4A017]" />

            <h2 className="mt-5 text-2xl font-bold text-[#4A1F0E]">
              Books coming soon
            </h2>

            <p className="mt-3 text-gray-600">
              New titles will be featured here as they become available.
            </p>

          </div>

        </div>
      </section>
    );
  }

  /*
   * ---------------------------------------------------------
   * MAIN SECTION
   * ---------------------------------------------------------
   */

  return (
    <section className="py-16 sm:py-19 lg:py-23">

      {/* Decorative background */}
      <div
        className="
          pointer-events-none
          absolute
          -left-40
          top-20
          h-80
          w-80
          rounded-full
          bg-[#D4A017]/10
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-40
          bottom-10
          h-96
          w-96
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

          <div className="mb-5 flex items-center justify-center gap-3">

            <span className="h-px w-8 bg-[#D4A017]" />

            <span
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.25em]
                text-[#D4A017]
                sm:text-sm
              "
            >
              Featured Books
            </span>

            <span className="h-px w-8 bg-[#D4A017]" />

          </div>

          {/* Heading */}

          <h2
            className="
              text-3xl
              font-bold
              leading-tight
              tracking-tight
              text-[#4A1F0E]
              sm:text-4xl
              md:text-5xl
              lg:text-6xl
            "
          >
            Stories that inspire.
            <span className="block text-[#D4A017]">
              Words that transform.
            </span>
          </h2>

          {/* Accent */}

          <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-[#D4A017]" />

          {/* Description */}

          <p
            className="
              mx-auto
              mt-6
              max-w-2xl
              text-base
              leading-7
              text-gray-600
              sm:text-lg
            "
          >
            Explore a selection of David Emuria's books exploring
            purpose, identity, relationships, leadership, healing,
            faith, and personal transformation.
          </p>

        </motion.div>

        {/* =====================================================
            BOOK CARDS
        ===================================================== */}

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">

          {featuredBooks.map((book, index) => (

            <motion.article
              key={book.id}
              initial={{
                opacity: 0,
                y: 40,
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
                duration: 0.65,
                delay: index * 0.12,
              }}
              whileHover={{
                y: -8,
              }}
              className="
                group
                overflow-hidden
                rounded-3xl
                border
                border-black/5
                bg-white
                shadow-sm
                transition-shadow
                duration-500
                hover:shadow-2xl
              "
            >

              {/* =================================================
                  BOOK COVER
              ================================================= */}

              <Link
                to={`/books/${book.slug}`}
                className="
                  relative
                  block
                  overflow-hidden
                  bg-gray-100
                "
              >

                {book.coverImage ? (
                  <img
                    src={book.coverImage}
                    alt={`${book.title} by ${book.author}`}
                    className="
                      aspect-[3/4]
                      w-full
                      object-cover
                      transition-transform
                      duration-700
                      ease-out
                      group-hover:scale-[1.04]
                    "
                    loading="lazy"
                  />
                ) : (
                  <div
                    className="
                      flex
                      aspect-[3/4]
                      w-full
                      items-center
                      justify-center
                      bg-[#4A1F0E]
                    "
                  >
                    <BookOpen className="h-16 w-16 text-white/70" />
                  </div>
                )}

                {/* Hover overlay */}

                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-black/60
                    via-transparent
                    to-transparent
                    opacity-0
                    transition-opacity
                    duration-500
                    group-hover:opacity-100
                  "
                />

                {/* View book */}

                <div
                  className="
                    absolute
                    bottom-5
                    left-1/2
                    -translate-x-1/2
                    translate-y-4
                    rounded-full
                    bg-white
                    px-5
                    py-2.5
                    text-sm
                    font-semibold
                    text-[#4A1F0E]
                    opacity-0
                    shadow-xl
                    transition-all
                    duration-500
                    group-hover:translate-y-0
                    group-hover:opacity-100
                  "
                >
                  View Book
                </div>

              </Link>

              {/* =================================================
                  BOOK INFORMATION
              ================================================= */}

              <div className="p-6 sm:p-7">

                {/* Rating */}

                <div className="flex items-center gap-1">

                  {Array.from({
                    length: 5,
                  }).map((_, starIndex) => (

                    <Star
                      key={starIndex}
                      className={`h-4 w-4 ${starIndex < Math.round(book.rating || 0)
                          ? "fill-[#D4A017] text-[#D4A017]"
                          : "text-gray-300"
                        }`}
                    />

                  ))}

                  <span className="ml-2 text-xs text-gray-500">
                    {Number(book.rating || 0).toFixed(1)}
                  </span>

                </div>

                {/* Title */}

                <Link
                  to="/books"
                  className="inline-flex items-center justify-center gap-2 rounded-full
             bg-[#D4A017] px-6 py-3 text-sm sm:text-base
             font-semibold text-white shadow-md
             transition-all duration-300
             hover:-translate-y-1 hover:shadow-xl
             active:scale-95"
                >
                  View All Books
                  <ArrowRight className="h-4 w-4" />
                </Link>

                {/* Author */}

                <p className="mt-2 text-sm font-medium text-[#D4A017]">
                  {book.author}
                </p>

                {/* Description */}

                {book.description && (
                  <p
                    className="
                      mt-4
                      line-clamp-3
                      text-sm
                      leading-6
                      text-gray-600
                    "
                  >
                    {book.description}
                  </p>
                )}

                {/* Bottom */}

                <div
                  className="
                    mt-6
                    flex
                    items-center
                    justify-between
                    gap-4
                    border-t
                    border-gray-100
                    pt-5
                  "
                >

                  {/* Price */}

                  <div>

                    {book.priceCents !== null &&
                      book.priceCents !== undefined ? (
                      <>
                        <span className="block text-xs text-gray-500">
                          Available for
                        </span>

                        <span className="text-lg font-bold text-[#4A1F0E]">
                          KES{" "}
                          {(book.priceCents / 100).toLocaleString(
                            "en-KE"
                          )}
                        </span>
                      </>
                    ) : (
                      <span className="text-sm font-medium text-gray-500">
                        Price on request
                      </span>
                    )}

                  </div>

                  {/* Read button */}

                  <Link
                    to={`/books/${book.slug}`}
                    className="
                      inline-flex
                      shrink-0
                      items-center
                      gap-2
                      rounded-full
                      bg-[#4A1F0E]
                      px-4
                      py-2.5
                      text-sm
                      font-semibold
                      text-white
                      transition-all
                      duration-300
                      hover:bg-[#D4A017]
                      hover:shadow-md
                    "
                  >
                    <BookOpen className="h-4 w-4" />

                    View

                  </Link>

                </div>

              </div>

            </motion.article>

          ))}

        </div>

        {/* =====================================================
            VIEW ALL
        ===================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.7,
          }}
          className="mt-14 flex flex-col items-center justify-center gap-3 sm:mt-16"
        >

          <Link
            to="/books"
            className="
              group
              inline-flex
              items-center
              gap-3
              rounded-full
              bg-[#D4A017]
              px-7
              py-3.5
              text-sm
              font-bold
              text-white
              shadow-lg
              transition-all
              duration-300
              hover:-translate-y-1
              hover:bg-[#B58900]
              hover:shadow-xl
              sm:px-8
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
            />

          </Link>

          <p className="text-xs text-gray-500">
            Discover the complete collection
          </p>

        </motion.div>

      </div>
    </section>
  );
};

export default FeaturedBooks;