// frontend/src/pages/ProgramActivity.tsx

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Church,
  GraduationCap,
  HeartHandshake,
  Maximize2,
  Users,
  X,
} from "lucide-react";

import {
  getProgramBySlug,
  PROGRAM_ACTIVITIES,
} from "@/data/programActivities";

const iconMap = {
  GraduationCap,
  Church,
  Users,
  HeartHandshake,
};

export default function ProgramActivityPage() {
  const { slug } = useParams<{ slug: string }>();

  const activity = getProgramBySlug(slug);

  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  if (!activity) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#2E1208]">
            Program Not Found
          </h1>

          <p className="mt-4 text-gray-600">
            The program you are looking for could not be found.
          </p>

          <Link
            to="/"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#4A1F0E] px-6 py-3 font-semibold text-white transition hover:bg-[#2E1208]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back Home
          </Link>
        </div>
      </main>
    );
  }

  const Icon = iconMap[activity.icon];

  const imageCount = activity.images.length;

  const openImage = (index: number) => {
    setSelectedImage(index);
    document.body.style.overflow = "hidden";
  };

  const closeImage = () => {
    setSelectedImage(null);
    document.body.style.overflow = "";
  };

  const nextImage = () => {
    if (selectedImage === null) return;

    setSelectedImage(
      (selectedImage + 1) % imageCount
    );
  };

  const previousImage = () => {
    if (selectedImage === null) return;

    setSelectedImage(
      (selectedImage - 1 + imageCount) % imageCount
    );
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (selectedImage === null) return;

      if (event.key === "Escape") {
        closeImage();
      }

      if (event.key === "ArrowRight") {
        nextImage();
      }

      if (event.key === "ArrowLeft") {
        previousImage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedImage]);

  return (
    <>
      <main className="min-h-screen bg-white pt-24">

        {/* =========================================
            HERO
        ========================================== */}
        <section className="relative overflow-hidden bg-[#F7F7F5] py-16 sm:py-20 lg:py-28">

          <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-[#D4A017]/10 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-[#4A1F0E]/10 blur-3xl" />

          <div className="container relative z-10 mx-auto px-5 sm:px-6 lg:px-8">

            {/* Breadcrumb */}
            <motion.nav
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-10 flex flex-wrap items-center gap-2 text-sm text-gray-500"
            >
              <Link
                to="/"
                className="transition-colors hover:text-[#8B4513]"
              >
                Home
              </Link>

              <span>/</span>

              <a
                href="/#program"
                className="transition-colors hover:text-[#8B4513]"
              >
                Programs
              </a>

              <span>/</span>

              <span className="font-medium text-[#2E1208]">
                {activity.title}
              </span>
            </motion.nav>

            <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr] lg:gap-20">

              {/* Hero content */}
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
                  {activity.title}
                </h1>

                <div className="mt-6 h-1 w-20 rounded-full bg-[#D4A017]" />

                <p className="mt-7 max-w-2xl text-lg leading-8 text-gray-600 sm:text-xl">
                  {activity.description}
                </p>
              </motion.div>

              {/* Featured image */}
              <motion.div
                initial={{ opacity: 0, x: 35 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="absolute -bottom-4 -left-4 h-full w-full rounded-3xl border border-[#D4A017]/40" />

                <div className="relative overflow-hidden rounded-3xl bg-[#4A1F0E] shadow-2xl">
                  <img
                    src={activity.featuredImage.src}
                    alt={activity.featuredImage.alt}
                    className="aspect-[4/3] w-full object-cover"
                  />
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* =========================================
            ABOUT PROGRAM
        ========================================== */}
        <section className="py-20 sm:py-24 lg:py-28">
          <div className="container mx-auto px-5 sm:px-6 lg:px-8">

            <div className="grid gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#D4A017]">
                  About the program
                </p>

                <h2 className="mt-3 text-3xl font-bold text-[#2E1208] sm:text-4xl">
                  Creating meaningful impact through action.
                </h2>

                <div className="mt-6 h-1 w-16 rounded-full bg-[#D4A017]" />

                <p className="mt-7 text-lg leading-8 text-gray-600">
                  {activity.fullDescription}
                </p>
              </motion.div>

              {/* Program details */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="rounded-3xl bg-[#F7F7F5] p-7 sm:p-9"
              >
                <h3 className="text-xl font-bold text-[#2E1208]">
                  Who we serve
                </h3>

                <p className="mt-4 leading-7 text-gray-600">
                  {activity.audience}
                </p>

                <div className="mt-8 border-t border-gray-200 pt-7">
                  <h3 className="text-xl font-bold text-[#2E1208]">
                    Areas of focus
                  </h3>

                  <div className="mt-5 space-y-3">
                    {activity.highlights.slice(0, 4).map((highlight) => (
                      <div
                        key={highlight}
                        className="flex items-start gap-3"
                      >
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#D4A017]" />

                        <span className="text-sm leading-6 text-gray-600">
                          {highlight}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* =========================================
            HIGHLIGHTS
        ========================================== */}
        <section className="bg-[#2E1208] py-20 text-white sm:py-24">
          <div className="container mx-auto px-5 sm:px-6 lg:px-8">

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mx-auto max-w-3xl text-center"
            >
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#D4A017]">
                What we do
              </p>

              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                Program highlights
              </h2>
            </motion.div>

            <div className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {activity.highlights.map((highlight, index) => (
                <motion.div
                  key={highlight}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.07,
                  }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
                >
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#D4A017]/15">
                    <CheckCircle2 className="h-5 w-5 text-[#D4A017]" />
                  </div>

                  <p className="font-medium text-white">
                    {highlight}
                  </p>
                </motion.div>
              ))}
            </div>

          </div>
        </section>

        {/* =========================================
            PHOTO GALLERY
        ========================================== */}
        <section className="py-20 sm:py-24 lg:py-28">
          <div className="container mx-auto px-5 sm:px-6 lg:px-8">

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#D4A017]">
                Moments & memories
              </p>

              <div className="mt-3 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div>
                  <h2 className="text-3xl font-bold text-[#2E1208] sm:text-4xl">
                    From the field
                  </h2>

                  <p className="mt-3 max-w-2xl text-gray-600">
                    A collection of moments from this program and the
                    people whose lives it seeks to impact.
                  </p>
                </div>

                <span className="text-sm font-medium text-gray-500">
                  {activity.images.length}{" "}
                  {activity.images.length === 1 ? "photo" : "photos"}
                </span>
              </div>
            </motion.div>

            {/* Gallery */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

              {activity.images.map((image, index) => (
                <motion.button
                  key={`${image.src}-${index}`}
                  type="button"
                  onClick={() => openImage(index)}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.06,
                  }}
                  whileHover={{ y: -5 }}
                  className="group relative overflow-hidden rounded-2xl bg-gray-100 text-left shadow-sm transition-shadow duration-500 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#D4A017] focus:ring-offset-4"
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 transition-all duration-500 group-hover:bg-black/45" />

                  {/* Zoom icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#2E1208] shadow-xl">
                      <Maximize2 className="h-5 w-5" />
                    </div>
                  </div>

                  {/* Image number */}
                  <div className="absolute bottom-4 left-4 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                    {index + 1} / {activity.images.length}
                  </div>
                </motion.button>
              ))}

            </div>
          </div>
        </section>

        {/* =========================================
            CTA
        ========================================== */}
        <section className="bg-[#F7F7F5] py-20 sm:py-24">
          <div className="container mx-auto px-5 sm:px-6 lg:px-8">

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mx-auto max-w-4xl rounded-3xl bg-[#4A1F0E] px-7 py-12 text-center shadow-2xl sm:px-12 sm:py-16"
            >
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#D4A017]">
                Get involved
              </p>

              <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
                Bring this experience to your community.
              </h2>

              <p className="mx-auto mt-5 max-w-2xl leading-7 text-white/70">
                Interested in inviting David to speak, train, mentor,
                or partner with your organization?
              </p>

              <a
                href="#contact"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#D4A017] px-7 py-3.5 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#B88900] hover:shadow-xl sm:text-base"
              >
                {activity.ctaText || "Get in Touch"}
                <ArrowRight className="h-4 w-4" />
              </a>
            </motion.div>

          </div>
        </section>

        {/* =========================================
            MORE PROGRAMS
        ========================================== */}
        <section className="py-20 sm:py-24">
          <div className="container mx-auto px-5 sm:px-6 lg:px-8">

            <div className="mb-10 flex items-end justify-between gap-5">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#D4A017]">
                  Explore more
                </p>

                <h2 className="mt-2 text-3xl font-bold text-[#2E1208]">
                  Other programs
                </h2>
              </div>

              <Link
                to="/#program"
                className="hidden items-center gap-2 text-sm font-bold text-[#8B4513] sm:flex"
              >
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {PROGRAM_ACTIVITIES.filter(
                (program) => program.slug !== activity.slug
              )
                .slice(0, 3)
                .map((program) => (
                  <Link
                    key={program.slug}
                    to={`/programs/${program.slug}`}
                    className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="aspect-[16/9] overflow-hidden">
                      <img
                        src={program.featuredImage.src}
                        alt={program.featuredImage.alt}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>

                    <div className="p-5">
                      <p className="text-xs font-bold uppercase tracking-wider text-[#D4A017]">
                        {program.category}
                      </p>

                      <h3 className="mt-2 font-bold text-[#2E1208]">
                        {program.title}
                      </h3>

                      <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#8B4513]">
                        Explore
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                ))}
            </div>

          </div>
        </section>
      </main>

      {/* =========================================
          IMAGE LIGHTBOX
      ========================================== */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 sm:p-8"
            onClick={closeImage}
          >

            {/* Close */}
            <button
              type="button"
              onClick={closeImage}
              aria-label="Close image"
              className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 sm:right-6 sm:top-6"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Counter */}
            <div className="absolute left-4 top-5 z-20 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md sm:left-6 sm:top-6">
              {selectedImage + 1} / {imageCount}
            </div>

            {/* Previous */}
            {imageCount > 1 && (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  previousImage();
                }}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 sm:left-6 sm:h-12 sm:w-12"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            )}

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative flex max-h-[90vh] max-w-[90vw] items-center justify-center"
              onClick={(event) => event.stopPropagation()}
            >
              <img
                src={activity.images[selectedImage].src}
                alt={activity.images[selectedImage].alt}
                className="max-h-[85vh] max-w-[88vw] rounded-lg object-contain shadow-2xl"
              />
            </motion.div>

            {/* Next */}
            {imageCount > 1 && (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  nextImage();
                }}
                aria-label="Next image"
                className="absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 sm:right-6 sm:h-12 sm:w-12"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            )}

            {/* Caption */}
            <div className="absolute bottom-5 left-1/2 max-w-xl -translate-x-1/2 rounded-full bg-black/50 px-5 py-2 text-center text-sm text-white backdrop-blur-md">
              {activity.images[selectedImage].alt}
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}