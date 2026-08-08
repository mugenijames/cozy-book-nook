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
import { resolveBookCoverUrl } from "@/lib/resolveBookCover";

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

  // Display only the first 3 books on the homepage.
  // The complete collection remains available on /books.
  const featuredBooks = books.slice(0, FEATURED_BOOKS_COUNT);

  /*
  |--------------------------------------------------------------------------
  | LOADING STATE
  |--------------------------------------------------------------------------
  */

  if (isLoading) {
    return (
      <section
        id="featured-books"
        className="relative overflow-hidden bg-[#EEF2F7] py-14 sm:py-16 lg:py-20"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">

          {/* Loading heading */}
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <div className="mx-auto h-4 w-32 animate-pulse rounded-full bg-gray-200" />

            <div className="mx-auto mt-5 h-10 w-72 animate-pulse rounded-lg bg-gray-200 sm:w-96" />

            <div className="mx-auto mt-5 h-4 max-w-xl animate-pulse rounded-full bg-gray-200" />
          </div>

          {/* Loading cards */}
          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl bg-white shadow-sm"
              >
                <div className="aspect-[4/5] animate-pulse bg-gray-200" />

                <div className="space-y-3 p-5">
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
  |--------------------------------------------------------------------------
  | ERROR STATE
  |--------------------------------------------------------------------------
  */

  if (isError) {
    return (
      <section
        id="featured-books"
        className="relative overflow-hidden bg-[#EEF2F7] py-14 sm:py-16 lg:py-20"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">

          <div className="mx-auto max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">

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
                active:scale-95
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
  |--------------------------------------------------------------------------
  | EMPTY STATE
  |--------------------------------------------------------------------------
  */

  if (featuredBooks.length === 0) {
    return (
      <section
        id="featured-books"
        className="relative overflow-hidden bg-[#EEF2F7] py-14 sm:py-16 lg:py-20"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">

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
  |--------------------------------------------------------------------------
  | MAIN SECTION
  |--------------------------------------------------------------------------
  */

  return (
    <section
      id="featured-books"
      className="
        relative
        overflow-hidden
        bg-[#EEF2F7]
        py-14
        sm:py-16
        lg:py-20
      "
    >

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

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">

        {/* =====================================================
            SECTION HEADER
        ===================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-10 max-w-3xl text-center sm:mb-12 lg:mb-14"
        >

          {/* Eyebrow */}

          <div className="mb-4 flex items-center justify-center gap-3">

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
            "
          >
            Stories that inspire.
            <span className="block text-[#D4A017]">
              Words that transform.
            </span>
          </h2>

          {/* Accent */}

          <div className="mx-auto mt-5 h-1 w-14 rounded-full bg-[#D4A017]" />

          {/* Description */}

          <p
            className="
              mx-auto
              mt-5
              max-w-2xl
              text-sm
              leading-6
              text-gray-600
              sm:text-base
              sm:leading-7
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

        <div
          className="
            mx-auto
            grid
            max-w-5xl
            gap-6
            sm:grid-cols-2
            lg:grid-cols-3
            lg:gap-7
          "
        >

          {featuredBooks.map((book, index) => {

            const coverSrc = resolveBookCoverUrl(book.coverImage);

            return (
              <motion.article
                key={book.id}
                initial={{
                  opacity: 0,
                  y: 35,
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
                  duration: 0.6,
                  delay: index * 0.1,
                }}
                whileHover={{
                  y: -6,
                }}
                className="
                  group
                  mx-auto
                  w-full
                  max-w-[310px]
                  overflow-hidden
                  rounded-2xl
                  border
                  border-black/5
                  bg-white
                  shadow-sm
                  transition-shadow
                  duration-500
                  hover:shadow-xl
                "
              >

                {/* =================================================
                    BOOK COVER
                ================================================= */}

                <Link
                  to={`/book/${book.slug}`}
                  className="
                    relative
                    block
                    overflow-hidden
                    bg-gray-100
                  "
                >

                  {coverSrc ? (
                    <img
                      src={coverSrc}
                      alt={`${book.title} by ${book.author}`}
                      className="
                        aspect-[4/5]
                        w-full
                        object-cover
                        object-top
                        transition-transform
                        duration-700
                        ease-out
                        group-hover:scale-[1.04]
                      "
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                  ) : (
                    <div
                      className="
                        flex
                        aspect-[4/5]
                        w-full
                        items-center
                        justify-center
                        bg-[#4A1F0E]
                      "
                    >
                      <BookOpen className="h-14 w-14 text-white/70" />
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
                      bottom-4
                      left-1/2
                      -translate-x-1/2
                      translate-y-3
                      whitespace-nowrap
                      rounded-full
                      bg-white
                      px-4
                      py-2
                      text-xs
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

                <div className="p-5 sm:p-6">

                  {/* Rating */}

                  <div className="flex items-center gap-1">

                    {Array.from({
                      length: 5,
                    }).map((_, starIndex) => (

                      <Star
                        key={starIndex}
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

                    <span className="ml-1.5 text-xs text-gray-500">
                      {Number(book.rating || 0).toFixed(1)}
                    </span>

                  </div>

                  {/* Title */}

                  <Link
                    to={`/book/${book.slug}`}
                    className="
                      mt-3
                      block
                      text-lg
                      font-bold
                      leading-snug
                      text-[#4A1F0E]
                      transition-colors
                      hover:text-[#D4A017]
                    "
                  >
                    {book.title}
                  </Link>

                  {/* Author */}

                  <p className="mt-1 text-sm font-medium text-[#D4A017]">
                    {book.author}
                  </p>

                  {/* Description */}

                  {book.description && (
                    <p
                      className="
                        mt-3
                        line-clamp-2
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
                      mt-5
                      flex
                      items-center
                      justify-between
                      gap-3
                      border-t
                      border-gray-100
                      pt-4
                    "
                  >

                    {/* Price */}

                    <div>

                      {book.priceCents !== null &&
                      book.priceCents !== undefined &&
                      Number(book.priceCents) > 0 ? (
                        <>
                          <span className="block text-[11px] text-gray-500">
                            Available for
                          </span>

                          <span className="text-base font-bold text-[#4A1F0E]">
                            KES{" "}
                            {(Number(book.priceCents) / 100).toLocaleString(
                              "en-KE"
                            )}
                          </span>
                        </>
                      ) : (
                        <span className="text-xs font-medium text-gray-500">
                          Price on request
                        </span>
                      )}

                    </div>

                    {/* View button */}

                    <Link
                      to={`/book/${book.slug}`}
                      className="
                        inline-flex
                        shrink-0
                        items-center
                        gap-1.5
                        rounded-full
                        bg-[#4A1F0E]
                        px-3.5
                        py-2
                        text-xs
                        font-semibold
                        text-white
                        transition-all
                        duration-300
                        hover:bg-[#D4A017]
                        hover:shadow-md
                        active:scale-95
                      "
                    >
                      <BookOpen className="h-3.5 w-3.5" />
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
          className="
            mt-10
            flex
            flex-col
            items-center
            justify-center
            gap-2
            sm:mt-12
          "
        >

          <Link
            to="/books"
            className="
              group
              inline-flex
              items-center
              gap-2.5
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
              active:scale-95
              sm:px-7
              sm:py-3.5
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