// frontend/src/pages/ProgramHighlight.tsx

import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  HeartHandshake,
  Handshake,
  Gift,
  Users,
  Sparkles,
} from "lucide-react";

import {
  getProgramBySlug,
  PROGRAM_ICON_MAP,
} from "@/data/programActivities";

export default function ProgramHighlight() {
  const { slug, highlightSlug } = useParams<{
    slug: string;
    highlightSlug: string;
  }>();

  const program = getProgramBySlug(slug);

  const highlight = program?.highlights.find(
    (item) => item.slug === highlightSlug
  );

  // ============================================================
  // CLEANUP / SCROLL
  // ============================================================

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [slug, highlightSlug]);

  // ============================================================
  // NOT FOUND
  // ============================================================

  if (!program || !highlight) {
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
            It may have been moved or is currently unavailable.
          </p>

          <Link
            to="/"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#4A1F0E] px-6 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#2E1208]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back Home
          </Link>
        </div>
      </main>
    );
  }

  // ============================================================
  // ICON
  // ============================================================

  const ProgramIcon =
    PROGRAM_ICON_MAP[program.icon] ?? Sparkles;

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <main className="min-h-screen bg-white pt-24">

      {/* ========================================================
          HERO
      ========================================================= */}

      <section className="relative overflow-hidden bg-[#F7F7F5] py-16 sm:py-20 lg:py-28">

        {/* Decorative elements */}

        <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-[#D4A017]/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-[#4A1F0E]/10 blur-3xl" />

        <div className="container relative z-10 mx-auto px-5 sm:px-6 lg:px-8">

          {/* Breadcrumb */}

          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10 flex flex-wrap items-center gap-2 text-sm text-gray-500"
          >

            <Link
              to="/"
              className="transition-colors hover:text-[#8B4513]"
            >
              Home
            </Link>

            <span>/</span>

            <Link
              to={`/programs/${program.slug}`}
              className="transition-colors hover:text-[#8B4513]"
            >
              {program.title}
            </Link>

            <span>/</span>

            <span className="font-medium text-[#2E1208]">
              {highlight.title}
            </span>

          </motion.nav>

          {/* Hero grid */}

          <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr] lg:gap-20">

            {/* Content */}

            <motion.div
              initial={{ opacity: 0, x: -35 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >

              <div className="mb-5 flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D4A017] text-white shadow-lg">
                  <ProgramIcon className="h-6 w-6" />
                </div>

                <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#8B4513]">
                  {program.category}
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

                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

              </div>

            </motion.div>

          </div>
        </div>
      </section>

      {/* ========================================================
          MAIN CONTENT
      ========================================================= */}

      <section className="py-20 sm:py-24 lg:py-28">

        <div className="container mx-auto px-5 sm:px-6 lg:px-8">

          <div className="grid gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">

            {/* Main explanation */}

            <motion.article
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7 }}
            >

              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#D4A017]">
                About this initiative
              </p>

              <h2 className="mt-3 text-3xl font-bold text-[#2E1208] sm:text-4xl">
                Creating meaningful impact through action.
              </h2>

              <div className="mt-6 h-1 w-16 rounded-full bg-[#D4A017]" />

              <p className="mt-7 text-lg leading-8 text-gray-600">
                {highlight.description}
              </p>

              <p className="mt-6 text-lg leading-8 text-gray-600">
                Through this initiative, we seek to create opportunities,
                strengthen relationships and equip people to make a lasting
                difference in their communities.
              </p>

            </motion.article>

            {/* Impact card */}

            <motion.aside
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="rounded-3xl bg-[#F7F7F5] p-7 sm:p-9"
            >

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D4A017] text-white shadow-lg">
                <HeartHandshake className="h-7 w-7" />
              </div>

              <h3 className="mt-6 text-2xl font-bold text-[#2E1208]">
                Our focus
              </h3>

              <p className="mt-4 leading-7 text-gray-600">
                We believe meaningful transformation happens when people
                work together with a shared purpose.
              </p>

              <div className="mt-7 space-y-4">

                {[
                  "Building meaningful relationships",
                  "Equipping and empowering people",
                  "Creating sustainable impact",
                  "Serving communities with purpose",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3"
                  >

                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#D4A017]" />

                    <span className="text-sm leading-6 text-gray-600">
                      {item}
                    </span>

                  </div>
                ))}

              </div>

            </motion.aside>

          </div>
        </div>
      </section>

      {/* ========================================================
          IMPACT SECTION
      ========================================================= */}

      <section className="bg-[#2E1208] py-20 text-white sm:py-24">

        <div className="container mx-auto px-5 sm:px-6 lg:px-8">

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-3xl text-center"
          >

            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#D4A017]">
              Why it matters
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Together, we can make a difference.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-7 text-white/70">
              Every contribution, partnership and act of support can help
              create opportunities and bring meaningful change to the
              people and communities we serve.
            </p>

          </motion.div>

          <div className="mx-auto mt-12 grid max-w-5xl gap-5 sm:grid-cols-3">

            {[
              {
                icon: Users,
                title: "People",
                text: "Empowering people to discover and develop their potential.",
              },
              {
                icon: HeartHandshake,
                title: "Community",
                text: "Strengthening communities through purposeful action.",
              },
              {
                icon: Sparkles,
                title: "Impact",
                text: "Creating lasting transformation that extends beyond today.",
              },
            ].map((item, index) => {

              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                  }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm"
                >

                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#D4A017] text-white">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-5 text-lg font-bold">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-white/65">
                    {item.text}
                  </p>

                </motion.div>
              );
            })}

          </div>

        </div>
      </section>

      {/* ========================================================
          DONATION / SPONSOR / PARTNER CTA
      ========================================================= */}

      <section className="bg-[#F7F7F5] py-20 sm:py-24 lg:py-28">

        <div className="container mx-auto px-5 sm:px-6 lg:px-8">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-[#4A1F0E] px-7 py-12 text-center shadow-2xl sm:px-12 sm:py-16"
          >

            {/* Decorative circles */}

            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#D4A017]/20 blur-2xl" />

            <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-black/20 blur-2xl" />

            <div className="relative z-10">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D4A017] text-white shadow-lg">
                <Handshake className="h-8 w-8" />
              </div>

              <p className="mt-6 text-sm font-bold uppercase tracking-[0.25em] text-[#D4A017]">
                Get involved
              </p>

              <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                Be part of the impact.
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
                You can help us extend the reach of this initiative.
                Whether you would like to donate, sponsor the work, or
                partner with us, your support can make a meaningful
                difference.
              </p>

              {/* CTA buttons */}

              <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">

                <a
                  href="#contact"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#D4A017] px-7 py-3.5 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#B88900] hover:shadow-xl sm:w-auto sm:text-base"
                >
                  <Gift className="h-4 w-4" />
                  Donate / Sponsor / Partner
                  <ArrowRight className="h-4 w-4" />
                </a>

                <Link
                  to={`/programs/${program.slug}`}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/25 bg-white/5 px-7 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 sm:w-auto sm:text-base"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to {program.title}
                </Link>

              </div>

            </div>

          </motion.div>

        </div>
      </section>

    </main>
  );
}