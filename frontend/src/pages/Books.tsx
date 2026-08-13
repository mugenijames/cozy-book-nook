// frontend/src/pages/Books.tsx

import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  BookOpen,
  Loader2,
  Star,
  ArrowLeft,
} from "lucide-react";

import { getBooks } from "@/services/api";
import Book3D from "@/components/Book3D";
import LocalizedPrice from "@/components/LocalizedPrice";

const Books = () => {
  const {
    data: books = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["books", "catalog"],
    queryFn: getBooks,
  });

  return (
    <main
      className="
        min-h-screen
        w-full
        max-w-full
        overflow-x-hidden
        bg-[#EEF2F7]
        py-12
        sm:py-16
        lg:py-20
      "
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* =====================================================
            PAGE HEADER
        ===================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="
            mx-auto
            mb-10
            max-w-3xl
            text-center
            sm:mb-14
          "
        >
          {/* Eyebrow */}

          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#D4A017]" />

            <span
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.25em]
                text-[#D4A017]
              "
            >
              The Library
            </span>

            <span className="h-px w-8 bg-[#D4A017]" />
          </div>

          {/* Heading */}

          <h1
            className="
              mt-4
              text-3xl
              font-bold
              leading-tight
              tracking-tight
              text-[#4A1F0E]
              sm:text-4xl
              md:text-5xl
            "
          >
            Books to read & own
          </h1>

          {/* Accent */}

          <div
            className="
              mx-auto
              mt-5
              h-1
              w-14
              rounded-full
              bg-[#D4A017]
            "
          />

          {/* Description */}

          <p
            className="
              mx-auto
              mt-5
              max-w-2xl
              text-sm
              leading-7
              text-gray-600
              sm:text-base
            "
          >
            Explore David Emuria's collection of books on
            purpose, healing, identity, leadership, faith and
            personal transformation.
          </p>
        </motion.div>

        {/* =====================================================
            LOADING STATE
        ===================================================== */}

        {isLoading && (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="
                  overflow-hidden
                  rounded-2xl
                  border
                  border-black/5
                  bg-white
                  p-3
                  shadow-sm
                  sm:p-4
                "
              >
                {/* Book skeleton */}

                <div
                  className="
                    mx-auto
                    h-[205px]
                    w-[140px]
                    animate-pulse
                    rounded-md
                    bg-gray-200
                    sm:h-[225px]
                    sm:w-[155px]
                  "
                />

                {/* Text skeleton */}

                <div className="mt-5 space-y-3">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />

                  <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200" />

                  <div className="h-3 w-2/3 animate-pulse rounded bg-gray-200" />

                  <div className="flex items-center justify-between pt-2">
                    <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />

                    <div className="h-8 w-16 animate-pulse rounded-full bg-gray-200" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* =====================================================
            ERROR STATE
        ===================================================== */}

        {isError && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="
              mx-auto
              max-w-md
              rounded-3xl
              bg-white
              p-8
              text-center
              shadow-sm
            "
          >
            <div
              className="
                mx-auto
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-full
                bg-[#D4A017]/10
              "
            >
              <BookOpen className="h-7 w-7 text-[#D4A017]" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-[#4A1F0E]">
              Couldn't load books
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
                transition
                hover:bg-[#2E1208]
                focus:outline-none
                focus:ring-2
                focus:ring-[#D4A017]
                focus:ring-offset-2
              "
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* =====================================================
            EMPTY STATE
        ===================================================== */}

        {!isLoading &&
          !isError &&
          books.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="
                mx-auto
                max-w-xl
                rounded-3xl
                bg-white
                p-10
                text-center
                shadow-sm
              "
            >
              <div
                className="
                  mx-auto
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-full
                  bg-[#D4A017]/10
                "
              >
                <BookOpen className="h-8 w-8 text-[#D4A017]" />
              </div>

              <h2 className="mt-5 text-2xl font-bold text-[#4A1F0E]">
                Books coming soon
              </h2>

              <p className="mt-3 text-gray-600">
                New titles will appear here once they're added.
              </p>

              <Link
                to="/"
                className="
                  mt-6
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  bg-[#4A1F0E]
                  px-6
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-[#D4A017]
                "
              >
                <ArrowLeft className="h-4 w-4" />
                Back Home
              </Link>
            </motion.div>
          )}

        {/* =====================================================
            BOOK CATALOG
        ===================================================== */}

        {!isLoading &&
          !isError &&
          books.length > 0 && (
            <>
              <div
                className="
                  grid
                  grid-cols-2
                  gap-4
                  sm:gap-6
                  md:grid-cols-3
                  lg:grid-cols-4
                  lg:gap-7
                  xl:gap-8
                "
              >
                {books.map((book, index) => {
                  const bookHref = `/book/${book.slug || book.id}`;

                  const rating = Number(book.rating || 0);

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
                        amount: 0.1,
                      }}
                      transition={{
                        duration: 0.5,
                        delay: Math.min(index * 0.05, 0.3),
                      }}
                      whileHover={{
                        y: -5,
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
                        transition-shadow
                        duration-300
                        hover:shadow-xl
                      "
                    >
                      {/* =================================================
                          BOOK COVER
                      ================================================= */}

                      <Link
                        to={bookHref}
                        className="
                          block
                          min-w-0
                          px-2
                          pt-2
                          sm:px-3
                          sm:pt-3
                        "
                        aria-label={`View ${book.title}`}
                      >
                        <Book3D
                          coverImage={book.coverImage}
                          title={book.title}
                          size="small"
                        />
                      </Link>

                      {/* =================================================
                          BOOK INFORMATION
                      ================================================= */}

                      <div
                        className="
                          flex
                          flex-1
                          flex-col
                          p-3
                          sm:p-4
                        "
                      >
                        {/* Rating */}

                        {rating > 0 && (
                          <div className="flex items-center gap-1">
                            <div className="flex items-center">
                              {Array.from({ length: 5 }).map(
                                (_, starIndex) => (
                                  <Star
                                    key={starIndex}
                                    className={`
                                      h-3.5
                                      w-3.5
                                      ${
                                        starIndex <
                                        Math.round(rating)
                                          ? "fill-[#D4A017] text-[#D4A017]"
                                          : "text-gray-300"
                                      }
                                    `}
                                  />
                                )
                              )}
                            </div>

                            <span className="ml-1 text-[11px] text-gray-500">
                              {rating.toFixed(1)}
                            </span>
                          </div>
                        )}

                        {/* Title */}

                        <Link
                          to={bookHref}
                          className="
                            mt-2
                            line-clamp-2
                            text-sm
                            font-bold
                            leading-snug
                            text-[#2E1208]
                            transition
                            hover:text-[#C17B4F]
                            sm:text-base
                          "
                        >
                          {book.title}
                        </Link>

                        {/* Author */}

                        <p
                          className="
                            mt-1
                            line-clamp-1
                            text-xs
                            font-medium
                            text-[#C17B4F]
                            sm:text-sm
                          "
                        >
                          {book.author}
                        </p>

                        {/* Description */}

                        {book.description && (
                          <p
                            className="
                              mt-2
                              line-clamp-2
                              text-xs
                              leading-5
                              text-gray-600
                              sm:text-sm
                            "
                          >
                            {book.description}
                          </p>
                        )}

                        {/* =================================================
                            BOTTOM ACTION AREA
                        ================================================= */}

                        <div
                          className="
                            mt-auto
                            pt-4
                          "
                        >
                          <div
                            className="
                              flex
                              items-center
                              justify-between
                              gap-2
                              border-t
                              border-gray-100
                              pt-3
                            "
                          >
                            {/* Price */}

                            <LocalizedPrice
                              priceCents={book.priceCents}
                              className="
                                min-w-0
                                text-xs
                                font-bold
                                text-[#4A1F0E]
                                sm:text-sm
                              "
                            />

                            {/* View button */}

                            <Link
                              to={bookHref}
                              className="
                                inline-flex
                                shrink-0
                                items-center
                                justify-center
                                gap-1
                                rounded-full
                                bg-[#4A1F0E]
                                px-3
                                py-2
                                text-[11px]
                                font-semibold
                                text-white
                                shadow-sm
                                transition-all
                                duration-300
                                hover:-translate-y-0.5
                                hover:bg-[#D4A017]
                                hover:shadow-md
                                focus:outline-none
                                focus:ring-2
                                focus:ring-[#D4A017]
                                focus:ring-offset-2
                                sm:px-3.5
                                sm:text-xs
                              "
                            >
                              <BookOpen className="h-3 w-3" />
                              View
                            </Link>
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </div>

              {/* =====================================================
                  CATALOG FOOTER
              ===================================================== */}

              <motion.div
                initial={{
                  opacity: 0,
                }}
                whileInView={{
                  opacity: 1,
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
                  gap-3
                  text-center
                  sm:mt-14
                "
              >
                <p className="text-xs text-gray-500 sm:text-sm">
                  Showing {books.length}{" "}
                  {books.length === 1 ? "title" : "titles"}
                </p>

                <Link
                  to="/"
                  className="
                    inline-flex
                    items-center
                    gap-2
                    text-sm
                    font-semibold
                    text-[#4A1F0E]
                    transition
                    hover:text-[#D4A017]
                  "
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Link>
              </motion.div>
            </>
          )}
      </div>
    </main>
  );
};

export default Books;