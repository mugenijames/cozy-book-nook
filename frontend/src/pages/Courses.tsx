// frontend/src/pages/Courses.tsx

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Clock,
  GraduationCap,
  Search,
  Star,
  Users,
  Loader2,
  Filter,
} from "lucide-react";

import { getApiBase } from "@/services/api";

/* ============================================================
   TYPES
============================================================ */

type Course = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  thumbnailUrl?: string | null;
  category?: string | null;
  level?: string | null;
  duration?: string | null;
  estimatedHours?: number | null;
  priceCents?: number | null;
  currency?: string;
  isFree: boolean;
  featured: boolean;
  unlockPercent?: number;
  instructorName?: string | null;
  instructorTitle?: string | null;
  instructorImage?: string | null;
};

/* ============================================================
   API
============================================================ */

async function fetchCourses(): Promise<Course[]> {
  const res = await fetch(`${getApiBase()}/api/courses`);
  if (!res.ok) throw new Error("Failed to load courses");
  const data = await res.json();
  return data.courses ?? data ?? [];
}

/* ============================================================
   HELPERS
============================================================ */

function formatPrice(cents?: number | null, currency = "KES") {
  if (cents == null || cents === 0) return "Free";
  return `${currency} ${(cents / 100).toLocaleString()}`;
}

/* ============================================================
   PAGE
============================================================ */

export default function Courses() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [level, setLevel] = useState("all");

  const {
    data: courses = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: fetchCourses,
  });

  const categories = useMemo(() => {
    const set = new Set<string>();
    courses.forEach((c) => {
      if (c.category) set.add(c.category);
    });
    return Array.from(set).sort();
  }, [courses]);

  const levels = useMemo(() => {
    const set = new Set<string>();
    courses.forEach((c) => {
      if (c.level) set.add(c.level);
    });
    return Array.from(set).sort();
  }, [courses]);

  const filtered = useMemo(() => {
    return courses.filter((course) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        course.title.toLowerCase().includes(q) ||
        course.subtitle?.toLowerCase().includes(q) ||
        course.description?.toLowerCase().includes(q) ||
        course.instructorName?.toLowerCase().includes(q);

      const matchesCategory =
        category === "all" || course.category === category;

      const matchesLevel = level === "all" || course.level === level;

      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [courses, search, category, level]);

  const featured = filtered.filter((c) => c.featured);
  const regular = filtered.filter((c) => !c.featured);

  return (
    <main className="min-h-screen bg-[#F7F7F5] pt-24">

      {/* ======================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden bg-[#2E1208] py-16 text-white sm:py-20 lg:py-24">
        <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[#D4A017]/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-[#D4A017]/10 blur-3xl" />

        <div className="container relative z-10 mx-auto px-5 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-[#D4A017]">
              <GraduationCap className="h-4 w-4" />
              Learning Hub
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Courses that equip you for life
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
              Practical, faith-rooted courses designed to help you grow in
              knowledge, character, leadership and purpose.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ======================================================
          FILTERS
      ====================================================== */}

      <section className="border-b border-[#E8DDD4] bg-white">
        <div className="container mx-auto px-5 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            {/* Search */}
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search courses..."
                className="w-full rounded-full border border-gray-200 bg-[#F7F7F5] py-2.5 pl-10 pr-4 text-sm text-[#2E1208] outline-none transition focus:border-[#D4A017] focus:ring-2 focus:ring-[#D4A017]/20"
              />
            </div>

            {/* Category + Level */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Filter className="h-4 w-4" />
                Filter
              </div>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-[#2E1208] outline-none focus:border-[#D4A017]"
              >
                <option value="all">All categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-[#2E1208] outline-none focus:border-[#D4A017]"
              >
                <option value="all">All levels</option>
                {levels.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          CONTENT
      ====================================================== */}

      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-5 sm:px-6 lg:px-8">

          {/* Loading */}
          {isLoading && (
            <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-[#D4A017]" />
              <p className="text-sm text-gray-500">Loading courses...</p>
            </div>
          )}

          {/* Error */}
          {isError && (
            <div className="mx-auto max-w-md rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
              <p className="font-semibold text-red-700">
                Unable to load courses
              </p>
              <p className="mt-2 text-sm text-red-600">
                Please check your connection and try again.
              </p>
              <button
                onClick={() => refetch()}
                className="mt-5 rounded-full bg-[#4A1F0E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2E1208]"
              >
                Retry
              </button>
            </div>
          )}

          {/* Empty */}
          {!isLoading && !isError && filtered.length === 0 && (
            <div className="mx-auto max-w-md py-20 text-center">
              <BookOpen className="mx-auto h-12 w-12 text-gray-300" />
              <h2 className="mt-4 text-xl font-bold text-[#2E1208]">
                No courses found
              </h2>
              <p className="mt-2 text-gray-500">
                Try adjusting your search or filters.
              </p>
            </div>
          )}

          {/* Featured */}
          {!isLoading && !isError && featured.length > 0 && (
            <div className="mb-14">
              <div className="mb-7 flex items-center gap-2">
                <Star className="h-5 w-5 text-[#D4A017]" />
                <h2 className="text-xl font-bold text-[#2E1208]">
                  Featured courses
                </h2>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {featured.map((course, index) => (
                  <CourseCard key={course.id} course={course} index={index} featured />
                ))}
              </div>
            </div>
          )}

          {/* All / regular */}
          {!isLoading && !isError && regular.length > 0 && (
            <div>
              <div className="mb-7 flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-[#2E1208]">
                    {featured.length > 0 ? "All courses" : "Available courses"}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Showing {filtered.length}{" "}
                    {filtered.length === 1 ? "course" : "courses"}
                  </p>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {regular.map((course, index) => (
                  <CourseCard key={course.id} course={course} index={index} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

/* ============================================================
   COURSE CARD
============================================================ */

function CourseCard({
  course,
  index,
  featured = false,
}: {
  course: Course;
  index: number;
  featured?: boolean;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
    >
      <Link
        to={`/courses/${course.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#E8DDD4] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      >
        {/* Thumbnail */}
        <div className="relative aspect-[16/10] overflow-hidden bg-[#F0EBE3]">
          {course.thumbnailUrl ? (
            <img
              src={course.thumbnailUrl}
              alt={course.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <GraduationCap className="h-12 w-12 text-[#D4A017]/40" />
            </div>
          )}

          {featured && (
            <span className="absolute left-3 top-3 rounded-full bg-[#D4A017] px-3 py-1 text-xs font-bold text-white shadow">
              Featured
            </span>
          )}

          {course.isFree && (
            <span className="absolute right-3 top-3 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white shadow">
              Free
            </span>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col p-5">
          <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8B4513]">
            {course.category && <span>{course.category}</span>}
            {course.level && (
              <>
                <span className="text-gray-300">•</span>
                <span>{course.level}</span>
              </>
            )}
          </div>

          <h3 className="text-lg font-bold leading-snug text-[#2E1208] transition group-hover:text-[#8B4513]">
            {course.title}
          </h3>

          {course.subtitle && (
            <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-gray-500">
              {course.subtitle}
            </p>
          )}

          {/* Meta */}
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-gray-500">
            {course.duration && (
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {course.duration}
              </span>
            )}
            {course.instructorName && (
              <span className="inline-flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {course.instructorName}
              </span>
            )}
          </div>

          {/* Footer */}
          <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
            <span className="text-base font-bold text-[#4A1F0E]">
              {formatPrice(course.priceCents, course.currency)}
            </span>

            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#D4A017] transition group-hover:gap-2.5">
              View course
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}