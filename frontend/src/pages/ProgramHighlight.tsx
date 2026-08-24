import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

import {
  getProgramBySlug,
  PROGRAM_ICON_MAP,
} from "@/data/programActivities";

export default function ProgramHighlightPage() {
  const { slug, highlightSlug } = useParams<{
    slug: string;
    highlightSlug: string;
  }>();

  const activity = getProgramBySlug(slug);

  const highlight = activity?.highlights.find(
    (item) => item.slug === highlightSlug
  );

  // ============================================================
  // NOT FOUND
  // ============================================================

  if (!activity || !highlight) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-6 pt-24">
        <div className="max-w-lg text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F7F7F5]">
            <Sparkles className="h-7 w-7 text-[#D4A017]" />
          </div>

          <h1 className="mt-6 text-4xl font-bold text-[#2E1208]">
            Program Area Not Found
          </h1>

          <p className="mt-4 leading-7 text-gray-600">
            The program area you are looking for could not be found.
          </p>

          <Link
            to={`/programs/${slug}`}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#4A1F0E] px-6 py-3 font-semibold text-white transition hover:bg-[#2E1208]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Program
          </Link>

        </div>
      </main>
    );
  }

  const Icon =
    PROGRAM_ICON_MAP[activity.icon] ?? Sparkles;

  return (
    <main className="min-h-screen bg-white pt-24">

      {/* ======================================================
          HERO
      ======================================================= */}

      <section className="relative overflow-hidden bg-[#F7F7F5] py-16 sm:py-20 lg:py-28">

        <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-[#D4A017]/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-[#4A1F0E]/10 blur-3xl" />

        <div className="container relative z-10 mx-auto px-5 sm:px-6 lg:px-8">

          {/* Breadcrumb */}

          <nav className="mb-10 flex flex-wrap items-center gap-2 text-sm text-gray-500">

            <Link
              to="/"
              className="transition-colors hover:text-[#8B4513]"
            >
              Home
            </Link>

            <span>/</span>

            <Link
              to={`/programs/${activity.slug}`}
              className="transition-colors hover:text-[#8B4513]"
            >
              {activity.title}
            </Link>

            <span>/</span>

            <span className="font-medium text-[#2E1208]">
              {highlight.title}
            </span>

          </nav>

          <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr] lg:gap-20">

            {/* Content */}

            <motion.div
              initial={{ opacity: 0, x: -35 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >

              <div className="mb-5 flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D4A017] text-white shadow-lg">
                  <Icon className="h-6 w-6" />
                </div>

                <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#8B4513]">
                  {activity.category}
                </span>

              </div>

              <h1 className="text-4xl font-bold leading-tight tracking-tight text-[#2E1208] sm:text-5xl lg:text-6xl">
                {highlight.title}
              </h1>

              <div className="mt-6 h-1 w-20 rounded-full bg-[#D4A017]" />

              <p className="mt-7 max-w-2xl text-lg leading-8 text-gray-600 sm:text-xl">
                {highlight.description}
              </p>

            </motion.div>

            {/* Image */}

            <motion.div
              initial={{ opacity: 0, x: 35 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >

              <div className="absolute -bottom-4 -left-4 h-full w-full rounded-3xl border border-[#D4A017]/40" />

              <div className="relative overflow-hidden rounded-3xl bg-[#4A1F0E] shadow-2xl">

                <img
                  src={highlight.image}
                  alt={highlight.title}
                  className="aspect-[4/3] w-full object-cover"
                />

              </div>

            </motion.div>

          </div>
        </div>
      </section>

      {/* ======================================================
          CONTENT
      ======================================================= */}

      <section className="py-20 sm:py-24 lg:py-28">

        <div className="container mx-auto px-5 sm:px-6 lg:px-8">

          <div className="mx-auto max-w-4xl">

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >

              <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#D4A017]">
                Program Area
              </p>

              <h2 className="mt-3 text-3xl font-bold text-[#2E1208] sm:text-4xl">
                {highlight.title}
              </h2>

              <div className="mt-6 h-1 w-16 rounded-full bg-[#D4A017]" />

              <p className="mt-7 text-lg leading-8 text-gray-600">
                {highlight.description}
              </p>

            </motion.div>

            {/* Key information */}

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="mt-12 rounded-3xl bg-[#F7F7F5] p-7 sm:p-9"
            >

              <h3 className="text-xl font-bold text-[#2E1208]">
                How this area creates impact
              </h3>

              <div className="mt-6 space-y-4">

                <div className="flex gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#D4A017]" />

                  <p className="leading-7 text-gray-600">
                    Equipping people with practical knowledge,
                    skills and guidance for meaningful growth.
                  </p>
                </div>

                <div className="flex gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#D4A017]" />

                  <p className="leading-7 text-gray-600">
                    Creating opportunities for personal,
                    professional and community transformation.
                  </p>
                </div>

                <div className="flex gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#D4A017]" />

                  <p className="leading-7 text-gray-600">
                    Building people who can use their potential
                    to positively influence others.
                  </p>
                </div>

              </div>

            </motion.div>

            {/* Back */}

            <div className="mt-10">

              <Link
                to={`/programs/${activity.slug}`}
                className="inline-flex items-center gap-2 font-bold text-[#8B4513] transition hover:gap-3 hover:text-[#4A1F0E]"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to {activity.title}
              </Link>

            </div>

          </div>
        </div>
      </section>

    </main>
  );
}