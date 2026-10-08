// frontend/src/pages/Blog.tsx

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Clock,
  Search,
  Tag,
  Loader2,
  X,
} from "lucide-react";

import { getBlogPosts } from "@/services/api"; // adjust if needed

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  content?: string | null;
  coverImage?: string | null;
  category?: string | null;
  tags?: string[] | null;
  author?: string | null;
  readingTime?: string | null;
  published: boolean;
  featured?: boolean;
  publishedAt?: string | null;
  views?: number;
  createdAt?: string;
};

const Blog = () => {
  const {
    data: posts = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["blog", "published"],
    queryFn: async () => {
      const data = await getBlogPosts();
      // Only show published posts on the public side
      return (data as BlogPost[]).filter((post) => post.published === true);
    },
  });

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set).sort();
  }, [posts]);

  const filteredPosts = useMemo(() => {
    const q = search.trim().toLowerCase();

    return posts.filter((post) => {
      const matchesSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt?.toLowerCase().includes(q) ||
        post.category?.toLowerCase().includes(q) ||
        post.author?.toLowerCase().includes(q);

      const matchesCategory =
        selectedCategory === "all" ||
        post.category?.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [posts, search, selectedCategory]);

  const featuredPosts = filteredPosts.filter((p) => p.featured);
  const regularPosts = filteredPosts.filter((p) => !p.featured);

  const formatDate = (date?: string | null) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F5F1EA]">
      {/* Hero */}
      <section className="border-b border-[#E8DDD4] bg-[#F9F6EF]">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-10 bg-[#D4A017]/80" />
              <span className="text-[11px] font-bold uppercase tracking-[0.32em] text-[#C17B4F]">
                David Emuria
              </span>
              <span className="h-px w-10 bg-[#D4A017]/80" />
            </div>

            <h1 className="mt-6 text-4xl font-bold leading-[1.15] tracking-tight text-[#3A180C] sm:text-5xl lg:text-[3.4rem]">
              Insights that inspire
              <span className="mt-1 block text-[#C17B4F]">
                purpose & transformation
              </span>
            </h1>

            <div className="mx-auto mt-7 h-[3px] w-16 rounded-full bg-[#D4A017]" />

            <p className="mx-auto mt-7 max-w-2xl text-[15px] leading-7 text-gray-600 sm:text-base">
              Articles on purpose, healing, identity, leadership, faith and
              personal growth — written to encourage and equip you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Search + Filters */}
          {!isLoading && !isError && posts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12 rounded-2xl border border-[#E8DDD4] bg-white p-5 shadow-sm sm:p-6"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400" />
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search articles by title, topic or author..."
                    className="h-12 w-full rounded-xl border border-[#E8DDD4] bg-[#FAF8F5] pl-12 pr-11 text-sm text-[#2E1208] outline-none transition placeholder:text-gray-400 focus:border-[#C17B4F] focus:bg-white focus:ring-2 focus:ring-[#C17B4F]/15"
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {categories.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedCategory("all")}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                        selectedCategory === "all"
                          ? "bg-[#4A1F0E] text-white"
                          : "bg-[#F5F1EA] text-[#4A1F0E] hover:bg-[#E8DDD4]"
                      }`}
                    >
                      All
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                          selectedCategory === cat
                            ? "bg-[#4A1F0E] text-white"
                            : "bg-[#F5F1EA] text-[#4A1F0E] hover:bg-[#E8DDD4]"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-[#F0E9E0] pt-4">
                <p className="text-sm text-gray-500">
                  Showing{" "}
                  <span className="font-semibold text-[#4A1F0E]">
                    {filteredPosts.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-[#4A1F0E]">
                    {posts.length}
                  </span>{" "}
                  articles
                </p>
              </div>
            </motion.div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="flex min-h-[320px] items-center justify-center">
              <div className="flex items-center gap-3 text-[#4A1F0E]">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="font-medium">Loading articles...</span>
              </div>
            </div>
          )}

          {/* Error */}
          {isError && !isLoading && (
            <div className="mx-auto max-w-md rounded-3xl border border-[#E8DDD4] bg-white p-10 text-center shadow-sm">
              <BookOpen className="mx-auto h-10 w-10 text-[#D4A017]" />
              <h2 className="mt-5 text-xl font-bold text-[#4A1F0E]">
                Couldn’t load articles
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Please try again in a moment.
              </p>
              <button
                onClick={() => refetch()}
                className="mt-6 rounded-full bg-[#4A1F0E] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#2E1208]"
              >
                Retry
              </button>
            </div>
          )}

          {/* Empty */}
          {!isLoading && !isError && posts.length === 0 && (
            <div className="mx-auto max-w-xl rounded-3xl border border-[#E8DDD4] bg-white p-12 text-center shadow-sm">
              <BookOpen className="mx-auto h-10 w-10 text-[#D4A017]" />
              <h2 className="mt-6 text-2xl font-bold text-[#4A1F0E]">
                No articles yet
              </h2>
              <p className="mt-3 text-gray-600">
                Published articles will appear here soon.
              </p>
            </div>
          )}

          {/* No results */}
          {!isLoading &&
            !isError &&
            posts.length > 0 &&
            filteredPosts.length === 0 && (
              <div className="mx-auto max-w-xl rounded-3xl border border-[#E8DDD4] bg-white p-12 text-center shadow-sm">
                <Search className="mx-auto h-10 w-10 text-[#D4A017]" />
                <h2 className="mt-6 text-2xl font-bold text-[#4A1F0E]">
                  No matching articles
                </h2>
                <p className="mt-3 text-gray-600">
                  Try a different search or category.
                </p>
                <button
                  onClick={() => {
                    setSearch("");
                    setSelectedCategory("all");
                  }}
                  className="mt-6 rounded-full bg-[#4A1F0E] px-6 py-3 text-sm font-semibold text-white hover:bg-[#D4A017]"
                >
                  Clear filters
                </button>
              </div>
            )}

          {/* Featured Posts */}
          {!isLoading && featuredPosts.length > 0 && (
            <div className="mb-14">
              <h2 className="mb-6 text-sm font-bold uppercase tracking-[0.18em] text-[#C17B4F]">
                Featured
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                {featuredPosts.map((post, index) => (
                  <FeaturedCard key={post.id} post={post} index={index} formatDate={formatDate} />
                ))}
              </div>
            </div>
          )}

          {/* Regular Posts Grid */}
          {!isLoading && regularPosts.length > 0 && (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {regularPosts.map((post, index) => (
                <PostCard
                  key={post.id}
                  post={post}
                  index={index}
                  formatDate={formatDate}
                />
              ))}
            </div>
          )}

          {/* Back link */}
          <div className="mt-16 flex justify-center border-t border-[#E8DDD4] pt-10">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#4A1F0E] transition hover:text-[#C17B4F]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

/* =========================================================
   FEATURED CARD
========================================================= */

function FeaturedCard({
  post,
  index,
  formatDate,
}: {
  post: BlogPost;
  index: number;
  formatDate: (d?: string | null) => string | null;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group overflow-hidden rounded-2xl border border-[#E8DDD4] bg-white shadow-sm transition hover:shadow-md"
    >
      <Link to={`/blog/${post.slug}`} className="block">
        <div className="relative aspect-[16/9] overflow-hidden bg-[#E7DED4]">
          {post.coverImage ? (
            <img
              src={post.coverImage}
              alt={post.title}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-[#4A1F0E]">
              <BookOpen className="h-12 w-12 text-[#D4A017]" />
            </div>
          )}
          {post.category && (
            <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[#4A1F0E] shadow-sm">
              {post.category}
            </span>
          )}
        </div>

        <div className="p-6">
          <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">
            {post.publishedAt && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(post.publishedAt)}
              </span>
            )}
            {post.readingTime && (
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {post.readingTime}
              </span>
            )}
          </div>

          <h3 className="text-xl font-bold leading-snug text-[#3A180C] transition group-hover:text-[#C17B4F]">
            {post.title}
          </h3>

          {post.excerpt && (
            <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-600">
              {post.excerpt}
            </p>
          )}

          <div className="mt-5 flex items-center justify-between">
            <span className="text-sm font-medium text-[#C17B4F]">
              {post.author || "David Emuria"}
            </span>
            <span className="text-sm font-semibold text-[#4A1F0E] transition group-hover:text-[#C17B4F]">
              Read article →
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

/* =========================================================
   REGULAR POST CARD
========================================================= */

function PostCard({
  post,
  index,
  formatDate,
}: {
  post: BlogPost;
  index: number;
  formatDate: (d?: string | null) => string | null;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.06, 0.3) }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-[#E8DDD4] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <Link to={`/blog/${post.slug}`} className="flex h-full flex-col">
        <div className="relative aspect-[16/10] overflow-hidden bg-[#E7DED4]">
          {post.coverImage ? (
            <img
              src={post.coverImage}
              alt={post.title}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-[#4A1F0E]">
              <BookOpen className="h-10 w-10 text-[#D4A017]" />
            </div>
          )}
          {post.category && (
            <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#4A1F0E]">
              {post.category}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="mb-2.5 flex flex-wrap items-center gap-3 text-[11px] text-gray-500">
            {post.publishedAt && (
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(post.publishedAt)}
              </span>
            )}
            {post.readingTime && (
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {post.readingTime}
              </span>
            )}
          </div>

          <h3 className="line-clamp-2 text-lg font-bold leading-snug text-[#3A180C] transition group-hover:text-[#C17B4F]">
            {post.title}
          </h3>

          {post.excerpt && (
            <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-gray-600">
              {post.excerpt}
            </p>
          )}

          <div className="mt-4 flex items-center justify-between border-t border-[#E8DDD4] pt-3">
            <span className="text-xs font-medium text-[#C17B4F]">
              {post.author || "David Emuria"}
            </span>
            <span className="text-xs font-semibold text-[#4A1F0E]">
              Read →
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

export default Blog;