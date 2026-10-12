// frontend/src/pages/BlogDetail.tsx

import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock3,
  Newspaper,
  Loader2,
} from "lucide-react";
import { getBlogPost } from "@/services/api";

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  content: string;
  coverImage?: string | null;
  category?: string | null;
  tags?: unknown;
  author?: string | null;
  readingTime?: string | null;
  published: boolean;
  featured?: boolean;
  publishedAt?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  views?: number;
  createdAt: string;
  updatedAt: string;
};

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();

  const {
    data: blog,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      if (!slug) throw new Error("No slug provided");
      return await getBlogPost(slug);
    },
    enabled: Boolean(slug),
  });

  const formatDate = (date?: string | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // ============================================================
  // LOADING STATE
  // ============================================================

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8F6F2]">
        <div className="flex items-center gap-3 text-[#4A1F0E]">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="font-medium">Loading article...</span>
        </div>
      </main>
    );
  }

  // ============================================================
  // BLOG NOT FOUND OR ERROR
  // ============================================================

  if (isError || !blog) {
    return (
      <main className="min-h-screen bg-[#F8F6F2]">
        <section className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
          <Newspaper className="mx-auto h-12 w-12 text-[#C17B4F]" />

          <h1 className="mt-6 text-3xl font-bold text-[#2E1208]">
            Article Not Found
          </h1>

          <p className="mt-4 leading-7 text-[#6B5548]">
            The article you are looking for may have been removed or the link may be incorrect.
          </p>

          <Link
            to="/blogs"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#4A1F0E] px-6 py-3 font-semibold text-white shadow-md transition-all hover:bg-[#2E1208]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blogs
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F6F2]">
      {/* ======================================================
          ARTICLE HERO
      ====================================================== */}

      <section className="relative overflow-hidden bg-[#4A1F0E]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(193,123,79,0.30),transparent_45%)]" />

        <div className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#F4D7C5] transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blogs
          </Link>

          <div className="mt-10">
            {blog.category && (
              <span className="inline-flex rounded-full bg-[#D4A017] px-4 py-1.5 text-xs font-bold text-white">
                {blog.category}
              </span>
            )}

            <h1 className="mt-5 max-w-4xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              {blog.title}
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-white/70">
              {blog.publishedAt && (
                <span className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  {formatDate(blog.publishedAt)}
                </span>
              )}

              {blog.readingTime && (
                <span className="flex items-center gap-2">
                  <Clock3 className="h-4 w-4" />
                  {blog.readingTime}
                </span>
              )}

              {blog.author && (
                <span className="text-[#F4D7C5]">By {blog.author}</span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          ARTICLE CONTENT
      ====================================================== */}

      <article className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
        {/* Cover image if available */}
        {blog.coverImage && (
          <div className="mb-10 overflow-hidden rounded-2xl shadow-md">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="h-auto w-full object-cover max-h-[450px]"
            />
          </div>
        )}

        {/* Excerpt / Introduction */}
        {blog.excerpt && (
          <div className="border-l-4 border-[#C17B4F] bg-white px-6 py-6 shadow-sm sm:px-8">
            <p className="text-lg font-medium leading-8 text-[#4A1F0E]">
              {blog.excerpt}
            </p>
          </div>
        )}

        {/* Main Content Body - Fully expanded with paragraph support */}
        <div className="mt-12 space-y-6 text-base leading-8 text-[#5F4A3D] whitespace-pre-line break-words">
          {blog.content}
        </div>

        {/* ====================================================
            ARTICLE FOOTER
        ==================================================== */}

        <div className="mt-14 border-t border-[#E8DDD4] pt-8">
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 rounded-full bg-[#4A1F0E] px-6 py-3 font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-[#2E1208] hover:shadow-lg"
          >
            <ArrowLeft className="h-4 w-4" />
            More Articles
          </Link>

          <Link
            to="/courses"
            className="ml-3 inline-flex items-center gap-2 rounded-full border border-[#C17B4F] bg-white px-6 py-3 font-semibold text-[#8B4513] transition-all hover:bg-[#F8F6F2]"
          >
            Explore Courses
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </article>
    </main>
  );
}