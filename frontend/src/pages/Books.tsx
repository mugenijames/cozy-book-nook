// frontend/src/pages/Books.tsx

import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Loader2,
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
        overflow-x-hidden
        bg-[#EEF2F7]
        py-14
        sm:py-16
        lg:py-20
      "
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-10 max-w-3xl text-center sm:mb-14"
        >
          <span
            className="
              text-xs
              font-bold
              uppercase
              tracking-[0.25em]
              text-[#D4A017]
            "
          >
            THE LIBRARY
          </span>

          <h1
            className="
              mt-3
              text-3xl
              font-bold
              tracking-tight
              text-[#4A1F0E]
              sm:text-4xl
              md:text-5xl
            "
          >
            Books to read & own
          </h1>

          <div className="mx-auto mt-5 h-1 w-14 rounded-full bg-[#D4A017]" />

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

        {/* Loading */}
        {isLoading && (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="flex items-center gap-3 text-[#4A1F0E]">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="font-medium">
                Loading books...
              </span>
            </div>
          </div>
        )}

        {/* Error */}
        {isError && !isLoading && (
          <div className="mx-auto max-w-md rounded-3xl bg-white p-8 text-center shadow-sm">
            <BookOpen className="mx-auto h-10 w-10 text-[#D4A017]" />

            <h2 className="mt-4 text-xl font-bold text-[#4A1F0E]">
              Couldn't load books
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Check your connection or try again in a moment.
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="
                mt-5
                rounded-full
                bg-[#4A1F0E]
                px-5
                py-2.5
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-[#2E1208]
              "
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty */}
        {!isLoading &&
          !isError &&
          books.length === 0 && (
            <div className="mx-auto max-w-xl rounded-3xl bg-white p-10 text-center shadow-sm">
              <BookOpen className="mx-auto h-10 w-10 text-[#D4A017]" />

              <h2 className="mt-5 text-2xl font-bold text-[#4A1F0E]">
                Books coming soon
              </h2>

              <p className="mt-3 text-gray-600">
                New titles will appear here once they're added.
              </p>
            </div>
          )}

        {/* Catalogue */}
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
                  xl:gap-7
                "
              >
                {books.map((book, index) => (
                  <motion.article
                    key={book.id}
                    initial={{
                      opacity: 0,
                      y: 25,
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
                    className="
                      group
                      overflow-hidden
                      rounded-2xl
                      border
                      border-black/5
                      bg-white
                      shadow-sm
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:shadow-xl
                    "
                  >
                    {/* Book */}
                    <Link
                      to={`/book/${book.slug || book.id}`}
                      className="block px-2 pt-2 sm:px-3 sm:pt-3"
                      aria-label={`View ${book.title}`}
                    >
                      <Book3D
                        coverImage={book.coverImage}
                        title={book.title}
                        size="small"
                      />
                    </Link>

                    {/* Information */}
                    <div className="p-3 sm:p-4">

                      <Link
                        to={`/book/${book.slug || book.id}`}
                        className="
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

                      <p className="mt-1 line-clamp-1 text-xs text-[#C17B4F] sm:text-sm">
                        {book.author}
                      </p>

                      {book.rating != null &&
                        Number(book.rating) > 0 && (
                          <div className="mt-2 flex items-center gap-1">
                            <span className="text-[#D4A017]">
                              ★
                            </span>

                            <span className="text-xs text-gray-500">
                              {Number(book.rating).toFixed(1)}
                            </span>
                          </div>
                        )}

                      <div className="mt-3 flex items-center justify-between gap-2 border-t border-gray-100 pt-3">
                        <LocalizedPrice
                          priceCents={book.priceCents}
                          className="text-xs font-bold text-[#4A1F0E] sm:text-sm"
                        />

                        <Link
                          to={`/book/${book.slug || book.id}`}
                          className="
                            inline-flex
                            shrink-0
                            items-center
                            gap-1
                            rounded-full
                            bg-[#4A1F0E]
                            px-3
                            py-1.5
                            text-[11px]
                            font-semibold
                            text-white
                            transition
                            hover:bg-[#D4A017]
                            sm:px-3.5
                            sm:text-xs
                          "
                        >
                          <BookOpen className="h-3 w-3" />
                          View
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>

              {/* Bottom message */}
              <div className="mt-12 text-center">
                <p className="text-xs text-gray-500 sm:text-sm">
                  Showing {books.length}{" "}
                  {books.length === 1 ? "title" : "titles"}
                </p>
              </div>
            </>
          )}
      </div>
    </main>
  );
};

export default Books;