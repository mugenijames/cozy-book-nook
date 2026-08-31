
// frontend/src/pages/Blogs.tsx

import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Newspaper,
  Sparkles,
} from "lucide-react";

// ============================================================
// TEMPORARY BLOG DATA
// ============================================================
// This will later be replaced with data from the admin panel/API.

const blogs = [
  {
    id: "1",
    slug: "discovering-your-purpose",
    title: "Discovering Your Purpose and Calling",
    excerpt:
      "Understanding your purpose is an important part of living a meaningful and impactful life. Discover practical principles that can help you identify your gifts, direction, and calling.",
    category: "Purpose & Growth",
    date: "August 28, 2026",
    readTime: "6 min read",
    featured: true,
  },
  {
    id: "2",
    slug: "principles-of-christian-leadership",
    title: "5 Principles of Effective Christian Leadership",
    excerpt:
      "Christian leadership is more than holding a position. Explore five biblical principles that can help leaders serve people with humility, wisdom, courage, and integrity.",
    category: "Leadership",
    date: "August 20, 2026",
    readTime: "8 min read",
    featured: false,
  },
  {
    id: "3",
    slug: "growing-through-life-seasons",
    title: "Growing Through Different Seasons of Life",
    excerpt:
      "Every season brings its own opportunities, challenges, and lessons. Learn how to embrace your current season and continue growing through it.",
    category: "Personal Growth",
    date: "August 12, 2026",
    readTime: "5 min read",
    featured: false,
  },
  {
    id: "4",
    slug: "faith-and-everyday-life",
    title: "Living Out Your Faith in Everyday Life",
    excerpt:
      "Faith should influence more than what happens inside a church. Discover practical ways to live out your values, beliefs, and convictions every day.",
    category: "Faith",
    date: "August 5, 2026",
    readTime: "7 min read",
    featured: false,
  },
  {
    id: "5",
    slug: "becoming-a-better-communicator",
    title: "Becoming a Better Communicator",
    excerpt:
      "Good communication can transform relationships, leadership, ministry, and professional life. Here are practical principles for communicating with clarity and purpose.",
    category: "Communication",
    date: "July 28, 2026",
    readTime: "6 min read",
    featured: false,
  },
  {
    id: "6",
    slug: "the-power-of-serving-others",
    title: "The Power of Serving Others",
    excerpt:
      "True impact is often found in serving others. Explore why servant leadership matters and how small acts of service can create lasting change.",
    category: "Leadership",
    date: "July 20, 2026",
    readTime: "5 min read",
    featured: false,
  },
];

export default function Blogs() {
  const featuredBlog = blogs.find(
    (blog) => blog.featured
  );

  const regularBlogs = blogs.filter(
    (blog) => !blog.featured
  );

  return (
    <main className="min-h-screen bg-[#F8F6F2]">

      {/* ======================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden bg-[#4A1F0E]">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(193,123,79,0.30),transparent_45%)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-28">

          <div className="mx-auto max-w-3xl">

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#C17B4F]/40 bg-white/10 px-4 py-2 text-sm font-semibold text-[#F4D7C5]">
              <Newspaper className="h-4 w-4" />
              Insights • Stories • Inspiration
            </div>

            <h1 className="font-heading text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Ideas That
              <span className="block text-[#D4A017]">
                Inspire Growth
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">
              Explore articles, reflections, leadership insights,
              practical lessons, and conversations about faith,
              purpose, personal growth, and meaningful living.
            </p>

          </div>

        </div>
      </section>

      {/* ======================================================
          FEATURED ARTICLE
      ====================================================== */}

      {featuredBlog && (
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">

          <div className="mb-8 flex items-center gap-2">

            <Sparkles className="h-5 w-5 text-[#C17B4F]" />

            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#C17B4F]">
              Featured Article
            </p>

          </div>

          <article className="overflow-hidden rounded-3xl border border-[#E8DDD4] bg-white shadow-sm">

            <div className="grid lg:grid-cols-2">

              {/* Visual */}

              <div className="relative flex min-h-[300px] items-center justify-center overflow-hidden bg-[#4A1F0E] lg:min-h-[420px]">

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(193,123,79,0.35),transparent_65%)]" />

                <Newspaper className="relative h-28 w-28 text-white/90" />

                <div className="absolute left-6 top-6 rounded-full bg-[#D4A017] px-4 py-1.5 text-xs font-bold text-white">
                  Featured
                </div>

              </div>

              {/* Content */}

              <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">

                <span className="w-fit rounded-full bg-[#F8F6F2] px-3 py-1 text-xs font-bold text-[#8B4513]">
                  {featuredBlog.category}
                </span>

                <h2 className="mt-5 font-heading text-3xl font-bold leading-tight text-[#2E1208] sm:text-4xl">
                  {featuredBlog.title}
                </h2>

                <p className="mt-5 leading-8 text-[#6B5548]">
                  {featuredBlog.excerpt}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-[#7A6659]">

                  <span className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    {featuredBlog.date}
                  </span>

                  <span className="flex items-center gap-2">
                    <Clock3 className="h-4 w-4" />
                    {featuredBlog.readTime}
                  </span>

                </div>

                <Link
                  to={`/blogs/${featuredBlog.slug}`}
                  className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-[#4A1F0E] px-6 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#2E1208] hover:shadow-xl"
                >
                  Read Article

                  <ArrowRight className="h-4 w-4" />
                </Link>

              </div>

            </div>

          </article>

        </section>
      )}

      {/* ======================================================
          ALL ARTICLES
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">

        <div className="mb-8">

          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#C17B4F]">
            Latest Articles
          </p>

          <h2 className="mt-3 font-heading text-3xl font-bold text-[#2E1208] sm:text-4xl">
            From David's Journal
          </h2>

          <p className="mt-3 max-w-2xl leading-7 text-[#6B5548]">
            Practical thoughts and reflections designed to encourage,
            equip, and inspire you in your journey.
          </p>

        </div>

        <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">

          {regularBlogs.map((blog) => (

            <article
              key={blog.id}
              className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[#E8DDD4] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >

              {/* Blog visual */}

              <div className="relative flex h-48 items-center justify-center overflow-hidden bg-[#4A1F0E]">

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(193,123,79,0.30),transparent_65%)]" />

                <Newspaper className="relative h-16 w-16 text-white/90 transition-transform duration-500 group-hover:scale-110" />

              </div>

              {/* Content */}

              <div className="flex flex-1 flex-col p-6">

                <span className="w-fit rounded-full bg-[#F8F6F2] px-3 py-1 text-xs font-bold text-[#8B4513]">
                  {blog.category}
                </span>

                <h3 className="mt-4 font-heading text-xl font-bold leading-snug text-[#2E1208]">
                  {blog.title}
                </h3>

                <p className="mt-3 flex-1 text-sm leading-7 text-[#6B5548]">
                  {blog.excerpt}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-[#7A6659]">

                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {blog.date}
                  </span>

                  <span className="flex items-center gap-1.5">
                    <Clock3 className="h-3.5 w-3.5" />
                    {blog.readTime}
                  </span>

                </div>

                <Link
                  to={`/blogs/${blog.slug}`}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#8B4513] transition-colors hover:text-[#C17B4F]"
                >
                  Read Article

                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

              </div>

            </article>

          ))}

        </div>

      </section>

      {/* ======================================================
          CTA
      ====================================================== */}

      <section className="border-t border-[#E8DDD4] bg-white">

        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">

          <Newspaper className="mx-auto h-10 w-10 text-[#C17B4F]" />

          <h2 className="mt-5 font-heading text-3xl font-bold text-[#2E1208]">
            Keep Learning. Keep Growing.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-[#6B5548]">
            Return regularly for new insights, stories, practical
            lessons, and reflections designed to help you grow and
            make a meaningful impact.
          </p>

        </div>

      </section>

    </main>
  );
}

