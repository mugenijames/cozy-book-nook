// frontend/src/sections/Testimonials.tsx

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Quote,
  Star,
  ArrowRight,
  MessageCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { TESTIMONIALS } from "@/data/testimonials";

const INITIAL_TESTIMONIALS = 3;

const Testimonials = () => {
  const [showAll, setShowAll] = useState(false);

  const visibleTestimonials = showAll
    ? TESTIMONIALS
    : TESTIMONIALS.slice(0, INITIAL_TESTIMONIALS);

  const hasMoreTestimonials =
    TESTIMONIALS.length > INITIAL_TESTIMONIALS;

  return (
    <section
      id="testimonials"
      className="
        relative
        overflow-hidden
        bg-white
        py-20
        sm:py-24
        lg:py-28
      "
    >
      {/* =====================================================
          DECORATIVE BACKGROUND
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -left-32
          top-20
          h-72
          w-72
          rounded-full
          bg-[#C17B4F]/10
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-32
          bottom-10
          h-80
          w-80
          rounded-full
          bg-[#D4A017]/10
          blur-3xl
        "
      />

      {/* =====================================================
          MAIN CONTAINER
      ===================================================== */}

      <div className="container relative z-10 mx-auto px-5 sm:px-6 lg:px-8">

        {/* ===================================================
            SECTION HEADER
        =================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="
            mx-auto
            mb-14
            max-w-3xl
            text-center
            lg:mb-20
          "
        >
          {/* Eyebrow */}

          <div
            className="
              mb-4
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-[#E8DDD4]
              bg-[#FBF9F7]
              px-4
              py-2
            "
          >
            <MessageCircle className="h-4 w-4 text-[#C17B4F]" />

            <span
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.2em]
                text-[#8B4513]
              "
            >
              Testimonials
            </span>
          </div>

          {/* Heading */}

          <h2
            className="
              font-heading
              text-4xl
              font-bold
              leading-tight
              tracking-tight
              text-[#2E1208]
              sm:text-5xl
              lg:text-6xl
            "
          >
            Words from people
            <span className="block text-[#C17B4F]">
              touched by the work.
            </span>
          </h2>

          {/* Description */}

          <p
            className="
              mx-auto
              mt-6
              max-w-2xl
              text-base
              leading-7
              text-gray-600
              sm:text-lg
              sm:leading-8
            "
          >
            Discover what people have to say about David's message,
            mentorship, leadership programs and transformational work.
          </p>

          {/* Accent */}

          <div className="mx-auto mt-7 h-1 w-20 rounded-full bg-[#D4A017]" />
        </motion.div>

        {/* ===================================================
            TESTIMONIAL CARDS
        =================================================== */}

        <motion.div
          layout
          className="
            grid
            gap-6
            sm:grid-cols-2
            lg:grid-cols-3
            lg:gap-8
          "
        >
          <AnimatePresence mode="popLayout">
            {visibleTestimonials.map((testimonial, index) => (
              <motion.article
                key={testimonial.id}
                layout
                initial={{
                  opacity: 0,
                  y: 30,
                  scale: 0.97,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: 20,
                  scale: 0.97,
                }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.05,
                }}
                className="
                  group
                  relative
                  flex
                  h-full
                  flex-col
                  overflow-hidden
                  rounded-3xl
                  border
                  border-[#E8DDD4]
                  bg-white
                  p-6
                  shadow-sm
                  transition-all
                  duration-500
                  hover:-translate-y-2
                  hover:border-[#C17B4F]/30
                  hover:shadow-2xl
                  sm:p-7
                "
              >
                {/* Top accent */}

                <div
                  className="
                    absolute
                    left-0
                    top-0
                    h-1
                    w-full
                    bg-gradient-to-r
                    from-[#4A1F0E]
                    via-[#C17B4F]
                    to-[#D4A017]
                    opacity-70
                    transition-opacity
                    duration-300
                    group-hover:opacity-100
                  "
                />

                {/* =================================================
                    TOP ROW
                ================================================= */}

                <div className="mb-6 flex items-start justify-between">

                  {/* Quote icon */}

                  <div
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-2xl
                      bg-[#4A1F0E]
                      text-white
                      shadow-md
                      transition-transform
                      duration-500
                      group-hover:scale-110
                    "
                  >
                    <Quote className="h-5 w-5" />
                  </div>

                  {/* Rating */}

                  <div
                    className="
                      flex
                      items-center
                      gap-0.5
                      rounded-full
                      border
                      border-[#E8DDD4]
                      bg-[#FBF9F7]
                      px-3
                      py-1.5
                    "
                    aria-label={`${testimonial.rating} out of 5 stars`}
                  >
                    {Array.from({ length: 5 }).map(
                      (_, starIndex) => (
                        <Star
                          key={starIndex}
                          className="
                            h-3.5
                            w-3.5
                            fill-[#D4A017]
                            text-[#D4A017]
                          "
                        />
                      )
                    )}
                  </div>
                </div>

                {/* =================================================
                    TESTIMONIAL
                ================================================= */}

                <blockquote
                  className="
                    flex-1
                    text-[15px]
                    leading-7
                    text-gray-600
                    sm:text-base
                  "
                >
                  “{testimonial.quote}”
                </blockquote>

                {/* =================================================
                    DIVIDER
                ================================================= */}

                <div className="my-6 h-px bg-[#E8DDD4]" />

                {/* =================================================
                    PERSON
                ================================================= */}

                <div className="flex items-center gap-4">

                  {/* Photo */}

                  <div
                    className="
                      h-12
                      w-12
                      shrink-0
                      overflow-hidden
                      rounded-full
                      border-2
                      border-white
                      bg-[#F3ECE6]
                      shadow-md
                      ring-1
                      ring-[#E8DDD4]
                    "
                  >
                    <img
                      src={testimonial.image}
                      alt={`${testimonial.name} portrait`}
                      loading="lazy"
                      decoding="async"
                      className="
                        h-full
                        w-full
                        object-cover
                        transition-transform
                        duration-500
                        group-hover:scale-110
                      "
                    />
                  </div>

                  {/* Details */}

                  <div className="min-w-0">

                    <h3
                      className="
                        truncate
                        text-sm
                        font-bold
                        text-[#2E1208]
                      "
                    >
                      {testimonial.name}
                    </h3>

                    <p
                      className="
                        mt-0.5
                        truncate
                        text-xs
                        font-medium
                        text-[#C17B4F]
                      "
                    >
                      {testimonial.role}
                    </p>

                    {testimonial.organization && (
                      <p
                        className="
                          mt-0.5
                          truncate
                          text-xs
                          text-gray-500
                        "
                      >
                        {testimonial.organization}
                      </p>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* ===================================================
            VIEW MORE / SHOW LESS
        =================================================== */}

        {hasMoreTestimonials && (
          <motion.div
            layout
            className="mt-10 flex justify-center"
          >
            <button
              type="button"
              onClick={() => setShowAll((prev) => !prev)}
              aria-expanded={showAll}
              className="
                group
                inline-flex
                items-center
                gap-2
                rounded-full
                border-2
                border-[#4A1F0E]
                bg-white
                px-7
                py-3.5
                text-sm
                font-semibold
                text-[#4A1F0E]
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-[#4A1F0E]
                hover:text-white
                hover:shadow-lg
                focus:outline-none
                focus:ring-2
                focus:ring-[#C17B4F]
                focus:ring-offset-2
                sm:text-base
              "
            >
              {showAll ? (
                <>
                  Show Less

                  <ChevronUp
                    className="
                      h-4
                      w-4
                      transition-transform
                      duration-300
                      group-hover:-translate-y-0.5
                    "
                  />
                </>
              ) : (
                <>
                  View More Testimonials

                  <ChevronDown
                    className="
                      h-4
                      w-4
                      transition-transform
                      duration-300
                      group-hover:translate-y-0.5
                    "
                  />
                </>
              )}
            </button>
          </motion.div>
        )}

        {/* ===================================================
            BOTTOM CTA
        =================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.7,
          }}
          className="
            mx-auto
            mt-16
            max-w-4xl
            rounded-3xl
            border
            border-[#E8DDD4]
            bg-[#FBF9F7]
            p-7
            text-center
            sm:p-9
            lg:mt-20
          "
        >
          <p
            className="
              text-lg
              font-semibold
              text-[#2E1208]
              sm:text-xl
            "
          >
            Ready to start a conversation?
          </p>

          <p
            className="
              mx-auto
              mt-2
              max-w-xl
              text-sm
              leading-6
              text-gray-600
              sm:text-base
            "
          >
            Whether you're looking for a speaker, mentor or
            transformational partner, let's connect.
          </p>

          <motion.a
            href="#speaking"
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2 }}
            className="
              mt-6
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-[#4A1F0E]
              px-6
              py-3
              text-sm
              font-semibold
              text-white
              shadow-lg
              transition-all
              duration-300
              hover:bg-[#2E1208]
              hover:shadow-xl
            "
          >
            Work With David

            <ArrowRight className="h-4 w-4" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;