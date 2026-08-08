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

  if (isLoading) {
    return (
      <section
        id="featured-books"
        className="relative overflow-hidden bg-[#EEF2F7] py-16 sm:py-20"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <div className="mx-auto h-4 w-32 animate-pulse rounded bg-gray-200" />

            <div className="mx-auto mt-5 h-10 w-72 animate-pulse rounded bg-gray-200" />

            <div className="mx-auto mt-5 h-4 max-w-xl animate-pulse rounded bg-gray-200" />
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-3xl bg-white p-6 shadow-sm"
              >
                <div className="mx-auto h-[280px] w-[190px] animate-pulse rounded bg-gray-200" />

                <div className="mt-6 space-y-4">
                  <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                  <div className="h-6 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section
        id="featured-books"
        className="bg-[#EEF2F7] py-16 sm:py-20"
      >
        <div className="mx-auto max-w-md px-5 text-center">
          <BookOpen className="mx-auto h-10 w-10 text-[#D4A017]" />

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
      </section>
    );
  }

  if (featuredBooks.length === 0) {
    return (
      <section
        id="featured-books"
        className="bg-[#EEF2F7] py-16 sm:py-20"
      >
        <div className="mx-auto max-w-xl px-5 text-center">
          <BookOpen className="mx-auto h-10 w-10 text-[#D4A017]" />

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

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-10 max-w-3xl text-center sm:mb-12"
        >
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#D4A017]" />

            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#D4A017]">
              Featured Books
            </span>

            <span className="h-px w-8 bg-[#D4A017]" />
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

          <div className="mx-auto mt-5 h-1 w-14 rounded-full bg-[#D4A017]" />

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
            Explore selected works by David Emuria on purpose,
            identity, healing, leadership, faith and transformation.
          </p>
        </motion.div>

        {/* Books */}
        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">

          {featuredBooks.map((book, index) => (
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
              className="
                group
                overflow-hidden
                rounded-3xl
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

              {/* Book */}
              <Link
                to={`/book/${book.slug || book.id}`}
                className="block px-4 pt-3"
                aria-label={`View ${book.title}`}
              >
                <Book3D
                  coverImage={book.coverImage}
                  title={book.title}
                  size="medium"
                />
              </Link>

              {/* Details */}
              <div className="px-5 pb-5 sm:px-6 sm:pb-6">

                {/* Rating */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <Star
                      key={starIndex}
                      className={`h-3.5 w-3.5 ${
                        starIndex <
                        Math.round(book.rating || 0)
                          ? "fill-[#D4A017] text-[#D4A017]"
                          : "text-gray-300"
                      }`}
                    />
                  ))}

                  <span className="ml-1 text-xs text-gray-500">
                    {Number(book.rating || 0).toFixed(1)}
                  </span>
                </div>

                {/* Title */}
                <Link
                  to={`/book/${book.slug || book.id}`}
                  className="
                    mt-3
                    block
                    text-lg
                    font-bold
                    leading-snug
                    text-[#2E1208]
                    transition
                    hover:text-[#C17B4F]
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
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-600">
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
                  <LocalizedPrice
                    priceCents={book.priceCents}
                    className="text-base font-bold text-[#4A1F0E]"
                  />

                  <Link
                    to={`/book/${book.slug}`}
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
                      transition-all
                      hover:bg-[#D4A017]
                    "
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    View
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* View all */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 flex justify-center sm:mt-12"
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
              hover:-translate-y-1
              hover:bg-[#B58900]
              hover:shadow-xl
            "
          >
            Explore all books

            <ArrowRight
              className="
                h-4
                w-4
                transition-transform
                group-hover:translate-x-1
              "
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedBooks;