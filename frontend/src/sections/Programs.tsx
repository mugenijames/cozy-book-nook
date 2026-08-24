// frontend/src/sections/Program.tsx

import { motion } from "framer-motion";
import {
  ArrowRight,
  Church,
  GraduationCap,
  HeartHandshake,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

import { PROGRAM_ACTIVITIES } from "@/data/programActivities";

// ============================================================
// ICON MAP
// ============================================================

const iconMap: Record<string, LucideIcon> = {
  GraduationCap,
  Church,
  Users,
  HeartHandshake,
};

// ============================================================
// PROGRAM SECTION
// ============================================================

const Program = () => {
  return (
    <section
      id="program"
      className="relative overflow-hidden bg-white py-20 sm:py-24 lg:py-32"
    >
      {/* ======================================================
          BACKGROUND DECORATIONS
      ====================================================== */}

      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#D4A017]/10 blur-3xl" />

      <div className="pointer-events-none absolute -right-32 bottom-20 h-80 w-80 rounded-full bg-[#4A1F0E]/10 blur-3xl" />

      <div className="container relative z-10 mx-auto px-5 sm:px-6 lg:px-8">

        {/* ====================================================
            SECTION HEADING
        ==================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-14 max-w-3xl text-center lg:mb-20"
        >
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-[#D4A017]">
            Programs & Impact
          </p>

          <h2 className="text-4xl font-bold tracking-tight text-[#2E1208] sm:text-5xl lg:text-6xl">
            Transforming lives
            <span className="block text-[#8B4513]">
              through intentional action.
            </span>
          </h2>

          <div className="mx-auto mt-6 h-1 w-20 rounded-full bg-[#D4A017]" />

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
            Through speaking, mentorship, leadership development and
            community initiatives, these programs are designed to inspire
            people, develop potential and create meaningful transformation.
          </p>
        </motion.div>

        {/* ====================================================
            PROGRAM CARDS
        ==================================================== */}

        <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-4">
          {PROGRAM_ACTIVITIES.map((program, index) => {
            // Safely get the icon.
            // If the icon name is missing or incorrect,
            // Users will be used as a fallback.
            const Icon = iconMap[program.icon] ?? Users;

            return (
              <motion.article
                key={program.slug}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                }}
                whileHover={{ y: -8 }}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-shadow duration-500 hover:shadow-2xl"
              >
                {/* ==================================================
                    PROGRAM IMAGE
                ================================================== */}

                <Link
                  to={`/programs/${program.slug}`}
                  className="relative block aspect-[4/3] overflow-hidden"
                >
                  <img
                    src={program.featuredImage.src}
                    alt={program.featuredImage.alt}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Image overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  {/* Category */}
                  <div className="absolute left-4 top-4">
                    <span className="rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#4A1F0E] shadow-md backdrop-blur-sm">
                      {program.category}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="absolute bottom-4 left-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#D4A017] text-white shadow-lg">
                    <Icon
                      className="h-5 w-5"
                      strokeWidth={2}
                    />
                  </div>
                </Link>

                {/* ==================================================
                    CARD CONTENT
                ================================================== */}

                <div className="flex flex-1 flex-col p-6">

                  <h3 className="text-xl font-bold text-[#2E1208]">
                    {program.title}
                  </h3>

                  <p className="mt-3 flex-1 text-sm leading-6 text-gray-600">
                    {program.description}
                  </p>

                  {/* =================================================
                      EXPLORE PROGRAM LINK
                  ================================================= */}

                  <Link
                    to={`/programs/${program.slug}`}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#8B4513] transition-all duration-300 group-hover:gap-3 hover:text-[#4A1F0E]"
                  >
                    Explore program

                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* ====================================================
            BOTTOM STATEMENT
        ==================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto mt-16 max-w-4xl border-t border-gray-200 pt-10 text-center lg:mt-20"
        >
          <p className="text-lg font-medium leading-8 text-[#4A1F0E] sm:text-xl">
            "Transformation begins when people are equipped to understand
            their potential and use it to make a difference."
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Program;