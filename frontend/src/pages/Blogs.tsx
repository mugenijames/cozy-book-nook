
// frontend/src/pages/Blogs.tsx

import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Newspaper,
} from "lucide-react";

const blogs = [
  {
    id: "1",
    slug: "discovering-your-purpose",
    title: "Discovering Your Purpose: Living a Life That Matters",
    excerpt:
      "Purpose gives direction to our lives. Discover practical principles for understanding your purpose and using your gifts to make a meaningful impact.",
    category: "Purpose & Growth",
    date: "August 28, 2026",
    readTime: "5 min read",
  },
  {
    id: "2",
    slug: "principles-of-christian-leadership",
    title: "Principles of Christian Leadership",
    excerpt:
      "Christian leadership is more than a position. It is about serving others, leading with integrity, and reflecting Christ through our decisions and actions.",
    category: "Leadership",
    date: "August 22, 2026",
    readTime: "7 min read",
  },
  {
    id: "3",
    slug: "growing-through-challenges",
    title: "Growing Through Life's Challenges",
    excerpt:
      "Challenges can become opportunities for growth. Learn how difficult seasons can strengthen your character, faith, resilience, and perspective.",
    category: "Personal Growth",
    date: "August 15, 2026",
    readTime: "6 min read",
  },
  {
    id: "4",
    slug: "faith-and-personal-development",
    title: "Faith and Personal Development",
    excerpt:
      "Personal development becomes more meaningful when it is built on strong values, faith, discipline, and a desire to become a better version of yourself.",
    category: "Faith",
    date: "August 8, 2026",
    readTime: "5 min read",
  },
  {
    id: "5",
    slug: "becoming-an-effective-communicator",
    title: "Becoming an Effective Communicator",
    excerpt:
      "Communication is one of the most important skills in leadership and relationships. Explore simple principles that can help you communicate with clarity and confidence.",
    category: "Communication",
    date: "August 1, 2026",
    readTime: "6 min read",
  },
  {
    id: "6",
    slug: "serving-with-purpose",
    title: "Serving With Purpose",
    excerpt:
      "True impact begins when we choose to use our abilities to serve others. Explore the connection between service, leadership, purpose, and lasting influence.",
    category: "Leadership",
    date: "July 25, 2026",
    readTime: "4 min read",
  },
];

export default function Blogs() {
  return (
    <main className="min-h-screen bg-[#F8F6F2]">

      {/* ======================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden bg-[#4A1F0E]">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(193,123,79,0.30),transparent_45%)]" />

        <div className="absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-[#C17B4F]/10 blur-3xl" />

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
              Explore insights, reflections, leadership lessons,
              faith-based encouragement, and practical ideas for
              personal growth and meaningful living.
            </p>

          </div>

        </div>
      </section>

      {/* ======================================================
          BLOG INTRODUCTION
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">

        <div className="mx-auto max-w-2xl text-center">

          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#C17B4F]">
            From David's Journal
          </p>

          <h2 className="mt-3 font-heading text-3xl font-bold text-[#2E1208] sm:text-4xl">
            Latest Articles
          </h2>

          <p className="mt-4 leading-7 text-[#6B5548]">
            Thoughtful articles designed to encourage you, challenge
            you, and help you grow in faith, leadership, purpose,
            and everyday life.
          </p>

        </div>

        {/* ====================================================
            BLOG GRID
        ==================================================== */}

        <div className="mt-12 grid gap-7 md:grid-cols-2 lg:grid-cols-3">

          {blogs.map((blog) => (

            <article
              key={blog.id}
              className="
                group
                flex
                h-full
                flex-col
                overflow-hidden
                rounded-3xl
                border
                border-[#E8DDD4]
                bg-white
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-xl
              "
            >

              {/* ==================================================
                  BLOG IMAGE PLACEHOLDER
              ================================================== */}

              <div className="relative flex h-52 items-center justify-center overflow-hidden bg-[#4A1F0E]">

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(193,123,79,0.35),transparent_65%)]" />

                <Newspaper
                  className="
                    relative
                    h-16
                    w-16
                    text-white/80
                    transition-transform
                    duration-500
                    group-hover:scale-110
                  "
                />

                <span className="
                  absolute
                  left-4
                  top-4
                  rounded-full
                  bg-[#D4A017]
                  px-3
                  py-1
                  text-xs
                  font-bold
                  text-white
                ">
                  {blog.category}
                </span>

              </div>

              {/* ==================================================
                  BLOG CONTENT
              ================================================== */}

              <div className="flex flex-1 flex-col p-6">

                <div className="flex items-center gap-4 text-xs text-[#7A6659]">

                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {blog.date}
                  </span>

                  <span className="flex items-center gap-1.5">
                    <Clock3 className="h-3.5 w-3.5" />
                    {blog.readTime}
                  </span>

                </div>

                <h3 className="
                  mt-4
                  font-heading
                  text-xl
                  font-bold
                  leading-snug
                  text-[#2E1208]
                  transition-colors
                  duration-300
                  group-hover:text-[#C17B4F]
                ">
                  {blog.title}
                </h3>

                <p className="
                  mt-3
                  flex-1
                  text-sm
                  leading-7
                  text-[#6B5548]
                ">
                  {blog.excerpt}
                </p>

                <Link
                  to={`/blogs/${blog.slug}`}
                  className="
                    mt-6
                    inline-flex
                    items-center
                    gap-2
                    text-sm
                    font-bold
                    text-[#8B4513]
                    transition-all
                    duration-300
                    hover:text-[#C17B4F]
                  "
                >
                  Read Article

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
            Keep Growing. Keep Learning.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-[#6B5548]">
            More articles, teachings, leadership insights, and
            inspirational content will be added regularly.
          </p>

          <div className="mt-7">

            <Link
              to="/courses"
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-full
                bg-[#4A1F0E]
                px-6
                py-3
                font-semibold
                text-white
                shadow-md
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:bg-[#2E1208]
                hover:shadow-xl
              "
            >
              Explore Courses

              <ArrowRight className="h-4 w-4" />

            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}

