import { Link } from "react-router-dom";
import {
  BookMarked,
  Clock3,
  GraduationCap,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const courses = [
  {
    id: "1",
    slug: "foundations-of-christian-leadership",
    title: "Foundations of Christian Leadership",
    description:
      "Develop biblical leadership principles, servant leadership skills, and practical wisdom for leading people with integrity.",
    level: "Beginner",
    duration: "6 Weeks",
    price: "Free",
    featured: true,
  },
  {
    id: "2",
    slug: "effective-christian-communication",
    title: "Effective Christian Communication",
    description:
      "Learn how to communicate biblical truth clearly, confidently, and effectively in ministry, leadership, and everyday life.",
    level: "Intermediate",
    duration: "4 Weeks",
    price: "KES 2,500",
    featured: false,
  },
  {
    id: "3",
    slug: "personal-growth-and-purpose",
    title: "Personal Growth & Purpose",
    description:
      "Discover practical principles for personal development, purpose, discipline, and meaningful impact.",
    level: "Beginner",
    duration: "5 Weeks",
    price: "KES 2,000",
    featured: false,
  },
];

export default function Courses() {
  return (
    <main className="min-h-screen bg-[#F8F6F2]">
      {/* ======================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden bg-[#4A1F0E]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(193,123,79,0.28),transparent_45%)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#C17B4F]/40 bg-white/10 px-4 py-2 text-sm font-semibold text-[#F4D7C5]">
              <GraduationCap className="h-4 w-4" />
              Learn • Grow • Lead
            </div>

            <h1 className="font-heading text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Courses for Growth,
              <span className="block text-[#D4A017]">
                Leadership & Purpose
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">
              Explore practical and transformative courses designed to
              equip you with knowledge, biblical principles, leadership
              skills, and tools for meaningful personal and professional
              growth.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================
          INTRODUCTION
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#C17B4F]">
              Available Courses
            </p>

            <h2 className="mt-3 font-heading text-3xl font-bold text-[#2E1208] sm:text-4xl">
              Learn at your own pace
            </h2>

            <p className="mt-4 leading-7 text-[#6B5548]">
              Whether you are developing yourself, preparing for ministry,
              or growing as a leader, these courses are designed to give
              you practical knowledge you can apply.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm font-medium text-[#8B4513]">
            <Sparkles className="h-4 w-4" />
            New courses coming soon
          </div>
        </div>

        {/* ====================================================
            COURSE GRID
        ==================================================== */}

        <div className="mt-10 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <article
              key={course.id}
              className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[#E8DDD4] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Course image area */}

              <div className="relative flex h-48 items-center justify-center overflow-hidden bg-[#4A1F0E]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(193,123,79,0.35),transparent_65%)]" />

                <BookMarked className="relative h-20 w-20 text-white/90 transition-transform duration-500 group-hover:scale-110" />

                {course.featured && (
                  <span className="absolute left-4 top-4 rounded-full bg-[#D4A017] px-3 py-1 text-xs font-bold text-white">
                    Featured
                  </span>
                )}
              </div>

              {/* Content */}

              <div className="flex flex-1 flex-col p-6">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#F8F6F2] px-3 py-1 text-xs font-semibold text-[#8B4513]">
                    {course.level}
                  </span>

                  <span className="rounded-full bg-[#F8F6F2] px-3 py-1 text-xs font-semibold text-[#8B4513]">
                    {course.price}
                  </span>
                </div>

                <h3 className="mt-4 font-heading text-xl font-bold text-[#2E1208]">
                  {course.title}
                </h3>

                <p className="mt-3 flex-1 text-sm leading-7 text-[#6B5548]">
                  {course.description}
                </p>

                <div className="mt-5 flex items-center gap-2 text-sm text-[#7A6659]">
                  <Clock3 className="h-4 w-4" />
                  {course.duration}
                </div>

                <Link
                  to={`/courses/${course.slug}`}
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#4A1F0E] px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#2E1208] hover:shadow-lg"
                >
                  View Course

                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ======================================================
          CALL TO ACTION
      ====================================================== */}

      <section className="border-t border-[#E8DDD4] bg-white">
        <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <GraduationCap className="mx-auto h-10 w-10 text-[#C17B4F]" />

          <h2 className="mt-5 font-heading text-3xl font-bold text-[#2E1208]">
            Ready to grow?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-[#6B5548]">
            Start your learning journey and develop the knowledge,
            character, and skills needed to make a lasting impact.
          </p>

          <div className="mt-7">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full bg-[#4A1F0E] px-6 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#2E1208] hover:shadow-xl"
            >
              Explore David Emuria
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}