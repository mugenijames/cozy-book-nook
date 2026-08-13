// frontend/src/pages/Books.tsx

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  ChevronDown,
  Search,
  SlidersHorizontal,
  Star,
  X,
  Loader2,
} from "lucide-react";

import { getBooks } from "@/services/api";
import Book3D from "@/components/Book3D";
import LocalizedPrice from "@/components/LocalizedPrice";

type SortOption =
  | "featured"
  | "title-asc"
  | "title-desc"
  | "price-low"
  | "price-high"
  | "rating"
  | "newest";

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

  /* =========================================================
     FILTER STATE
  ========================================================= */

  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [sortBy, setSortBy] =
    useState<SortOption>("featured");

  const [showFilters, setShowFilters] = useState(false);

  /* =========================================================
     GENRES
  ========================================================= */

  const genres = useMemo(() => {
    const uniqueGenres = new Set<string>();

    books.forEach((book) => {
      if (book.genre) {
        uniqueGenres.add(book.genre);
      }
    });

    return Array.from(uniqueGenres).sort((a, b) =>
      a.localeCompare(b)
    );
  }, [books]);

  /* =========================================================
     FILTER + SORT
  ========================================================= */

  const filteredBooks = useMemo(() => {
    const normalizedSearch = search
      .trim()
      .toLowerCase();

    let result = books.filter((book) => {
      /* Search */

      const matchesSearch =
        !normalizedSearch ||
        book.title?.toLowerCase().includes(normalizedSearch) ||
        book.author?.toLowerCase().includes(normalizedSearch) ||
        book.description
          ?.toLowerCase()
          .includes(normalizedSearch);

      /* Genre */

      const matchesGenre =
        genre === "all" ||
        book.genre?.toLowerCase() === genre.toLowerCase();

      /* Rating */

      const rating = Number(book.rating || 0);

      const matchesRating =
        ratingFilter === "all" ||
        rating >= Number(ratingFilter);

      return (
        matchesSearch &&
        matchesGenre &&
        matchesRating
      );
    });

    /* Sorting */

    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case "title-asc":
          return a.title.localeCompare(b.title);

        case "title-desc":
          return b.title.localeCompare(a.title);

        case "price-low": {
          const priceA =
            a.priceCents == null
              ? Number.MAX_SAFE_INTEGER
              : Number(a.priceCents);

          const priceB =
            b.priceCents == null
              ? Number.MAX_SAFE_INTEGER
              : Number(b.priceCents);

          return priceA - priceB;
        }

        case "price-high": {
          const priceA =
            a.priceCents == null
              ? 0
              : Number(a.priceCents);

          const priceB =
            b.priceCents == null
              ? 0
              : Number(b.priceCents);

          return priceB - priceA;
        }

        case "rating":
          return (
            Number(b.rating || 0) -
            Number(a.rating || 0)
          );

        case "newest":
          return (
            Number(b.publishedYear || 0) -
            Number(a.publishedYear || 0)
          );

        case "featured":
        default:
          return 0;
      }
    });

    return result;
  }, [
    books,
    search,
    genre,
    ratingFilter,
    sortBy,
  ]);

  /* =========================================================
     CLEAR FILTERS
  ========================================================= */

  const clearFilters = () => {
    setSearch("");
    setGenre("all");
    setRatingFilter("all");
    setSortBy("featured");
  };

  const hasActiveFilters =
    search.trim() !== "" ||
    genre !== "all" ||
    ratingFilter !== "all" ||
    sortBy !== "featured";

  /* =========================================================
     RENDER
  ========================================================= */

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
      <div
        className="
          mx-auto
          w-full
          max-w-7xl
          px-4
          sm:px-6
          lg:px-8
        "
      >
        {/* =====================================================
            HEADER
        ===================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
          className="
            mx-auto
            mb-10
            max-w-3xl
            text-center
            sm:mb-12
          "
        >
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
            Explore David Emuria's collection of books
            on purpose, healing, identity, leadership,
            faith and personal transformation.
          </p>
        </motion.div>

        {/* =====================================================
            SEARCH + FILTER CONTROLS
        ===================================================== */}

        {!isLoading &&
          !isError &&
          books.length > 0 && (
            <motion.div
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
              }}
              className="
                mb-10
                rounded-2xl
                border
                border-black/5
                bg-white
                p-4
                shadow-sm
                sm:p-5
              "
            >
              {/* Search */}

              <div className="flex flex-col gap-4 lg:flex-row">
                <div className="relative flex-1">
                  <Search
                    className="
                      pointer-events-none
                      absolute
                      left-4
                      top-1/2
                      h-5
                      w-5
                      -translate-y-1/2
                      text-gray-400
                    "
                  />

                  <input
                    type="search"
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder="Search books by title, author or topic..."
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-[#E8DDD4]
                      bg-[#FAF8F5]
                      pl-12
                      pr-10
                      text-sm
                      text-[#2E1208]
                      outline-none
                      transition
                      placeholder:text-gray-400
                      focus:border-[#C17B4F]
                      focus:ring-2
                      focus:ring-[#C17B4F]/20
                    "
                  />

                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      className="
                        absolute
                        right-3
                        top-1/2
                        -translate-y-1/2
                        rounded-full
                        p-1
                        text-gray-400
                        transition
                        hover:bg-gray-200
                        hover:text-gray-700
                      "
                      aria-label="Clear search"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Mobile filter button */}

                <button
                  type="button"
                  onClick={() =>
                    setShowFilters((value) => !value)
                  }
                  className="
                    inline-flex
                    h-12
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-[#E8DDD4]
                    bg-[#FAF8F5]
                    px-5
                    text-sm
                    font-semibold
                    text-[#4A1F0E]
                    transition
                    hover:border-[#C17B4F]
                    hover:bg-[#F5EDE5]
                    lg:hidden
                  "
                >
                  <SlidersHorizontal className="h-4 w-4" />

                  Filters

                  <ChevronDown
                    className={`
                      h-4
                      w-4
                      transition-transform
                      ${
                        showFilters
                          ? "rotate-180"
                          : ""
                      }
                    `}
                  />
                </button>
              </div>

              {/* Filters */}

              <div
                className={`
                  mt-4
                  grid
                  gap-4
                  ${
                    showFilters
                      ? "grid"
                      : "hidden lg:grid"
                  }
                  sm:grid-cols-2
                  lg:grid-cols-3
                `}
              >
                {/* Genre */}

                <div>
                  <label
                    htmlFor="genre"
                    className="
                      mb-1.5
                      block
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wide
                      text-gray-500
                    "
                  >
                    Genre
                  </label>

                  <select
                    id="genre"
                    value={genre}
                    onChange={(event) =>
                      setGenre(event.target.value)
                    }
                    className="
                      h-11
                      w-full
                      rounded-xl
                      border
                      border-[#E8DDD4]
                      bg-white
                      px-3
                      text-sm
                      text-[#2E1208]
                      outline-none
                      focus:border-[#C17B4F]
                      focus:ring-2
                      focus:ring-[#C17B4F]/20
                    "
                  >
                    <option value="all">
                      All genres
                    </option>

                    {genres.map((item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Rating */}

                <div>
                  <label
                    htmlFor="rating"
                    className="
                      mb-1.5
                      block
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wide
                      text-gray-500
                    "
                  >
                    Rating
                  </label>

                  <select
                    id="rating"
                    value={ratingFilter}
                    onChange={(event) =>
                      setRatingFilter(
                        event.target.value
                      )
                    }
                    className="
                      h-11
                      w-full
                      rounded-xl
                      border
                      border-[#E8DDD4]
                      bg-white
                      px-3
                      text-sm
                      text-[#2E1208]
                      outline-none
                      focus:border-[#C17B4F]
                      focus:ring-2
                      focus:ring-[#C17B4F]/20
                    "
                  >
                    <option value="all">
                      Any rating
                    </option>

                    <option value="4">
                      4.0+ stars
                    </option>

                    <option value="3">
                      3.0+ stars
                    </option>

                    <option value="2">
                      2.0+ stars
                    </option>
                  </select>
                </div>

                {/* Sort */}

                <div>
                  <label
                    htmlFor="sort"
                    className="
                      mb-1.5
                      block
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wide
                      text-gray-500
                    "
                  >
                    Sort by
                  </label>

                  <select
                    id="sort"
                    value={sortBy}
                    onChange={(event) =>
                      setSortBy(
                        event.target.value as SortOption
                      )
                    }
                    className="
                      h-11
                      w-full
                      rounded-xl
                      border
                      border-[#E8DDD4]
                      bg-white
                      px-3
                      text-sm
                      text-[#2E1208]
                      outline-none
                      focus:border-[#C17B4F]
                      focus:ring-2
                      focus:ring-[#C17B4F]/20
                    "
                  >
                    <option value="featured">
                      Featured
                    </option>

                    <option value="title-asc">
                      Title: A–Z
                    </option>

                    <option value="title-desc">
                      Title: Z–A
                    </option>

                    <option value="price-low">
                      Price: Low to High
                    </option>

                    <option value="price-high">
                      Price: High to Low
                    </option>

                    <option value="rating">
                      Highest Rated
                    </option>

                    <option value="newest">
                      Newest
                    </option>
                  </select>
                </div>
              </div>

              {/* Results summary */}

              <div
                className="
                  mt-4
                  flex
                  flex-wrap
                  items-center
                  justify-between
                  gap-3
                  border-t
                  border-gray-100
                  pt-4
                "
              >
                <p className="text-xs text-gray-500 sm:text-sm">
                  Showing{" "}
                  <span className="font-semibold text-[#4A1F0E]">
                    {filteredBooks.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-[#4A1F0E]">
                    {books.length}
                  </span>{" "}
                  books
                </p>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      text-xs
                      font-semibold
                      text-[#C17B4F]
                      transition
                      hover:text-[#A55E36]
                      sm:text-sm
                    "
                  >
                    <X className="h-3.5 w-3.5" />
                    Clear filters
                  </button>
                )}
              </div>
            </motion.div>
          )}

        {/* =====================================================
            LOADING
        ===================================================== */}

        {isLoading && (
          <div
            className="
              flex
              min-h-[300px]
              items-center
              justify-center
            "
          >
            <div className="flex items-center gap-3 text-[#4A1F0E]">
              <Loader2 className="h-6 w-6 animate-spin" />

              <span className="font-medium">
                Loading books...
              </span>
            </div>
          </div>
        )}

        {/* =====================================================
            ERROR
        ===================================================== */}

        {isError && !isLoading && (
          <div
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
            <BookOpen
              className="
                mx-auto
                h-10
                w-10
                text-[#D4A017]
              "
            />

            <h2
              className="
                mt-4
                text-xl
                font-bold
                text-[#4A1F0E]
              "
            >
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

        {/* =====================================================
            EMPTY DATABASE
        ===================================================== */}

        {!isLoading &&
          !isError &&
          books.length === 0 && (
            <div
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
              <BookOpen
                className="
                  mx-auto
                  h-10
                  w-10
                  text-[#D4A017]
                "
              />

              <h2
                className="
                  mt-5
                  text-2xl
                  font-bold
                  text-[#4A1F0E]
                "
              >
                Books coming soon
              </h2>

              <p className="mt-3 text-gray-600">
                New titles will appear here once
                they're added.
              </p>
            </div>
          )}

        {/* =====================================================
            NO FILTER RESULTS
        ===================================================== */}

        {!isLoading &&
          !isError &&
          books.length > 0 &&
          filteredBooks.length === 0 && (
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
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
              <Search
                className="
                  mx-auto
                  h-10
                  w-10
                  text-[#D4A017]
                "
              />

              <h2
                className="
                  mt-5
                  text-2xl
                  font-bold
                  text-[#4A1F0E]
                "
              >
                No books found
              </h2>

              <p className="mt-3 text-gray-600">
                We couldn't find books matching your
                search or filters.
              </p>

              <button
                type="button"
                onClick={clearFilters}
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
                <X className="h-4 w-4" />
                Clear filters
              </button>
            </motion.div>
          )}

        {/* =====================================================
            CATALOG
        ===================================================== */}

        {!isLoading &&
          !isError &&
          filteredBooks.length > 0 && (
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
                {filteredBooks.map(
                  (book, index) => {
                    const bookHref = `/book/${
                      book.slug || book.id
                    }`;

                    const rating = Number(
                      book.rating || 0
                    );

                    return (
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
                          delay: Math.min(
                            index * 0.05,
                            0.3
                          ),
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
                        {/* Book */}

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
                            coverImage={
                              book.coverImage
                            }
                            title={book.title}
                            size="small"
                          />
                        </Link>

                        {/* Information */}

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
                              <div className="flex">
                                {Array.from({
                                  length: 5,
                                }).map(
                                  (_, starIndex) => (
                                    <Star
                                      key={
                                        starIndex
                                      }
                                      className={`
                                        h-3.5
                                        w-3.5
                                        ${
                                          starIndex <
                                          Math.round(
                                            rating
                                          )
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

                          {/* Bottom */}

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
                              <LocalizedPrice
                                priceCents={
                                  book.priceCents
                                }
                                className="
                                  min-w-0
                                  text-xs
                                  font-bold
                                  text-[#4A1F0E]
                                  sm:text-sm
                                "
                              />

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
                  }
                )}
              </div>

              {/* =================================================
                  FOOTER
              ================================================= */}

              <div
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
                  Showing{" "}
                  <span className="font-semibold text-[#4A1F0E]">
                    {filteredBooks.length}
                  </span>{" "}
                  {filteredBooks.length === 1
                    ? "book"
                    : "books"}
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
              </div>
            </>
          )}
      </div>
    </main>
  );
};

export default Books;