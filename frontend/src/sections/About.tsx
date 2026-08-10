// frontend/src/sections/About.tsx

import { motion } from "framer-motion";
import { ArrowRight, Quote } from "lucide-react";

import davidImg from "@/assets/david.png";

const About = () => {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-white py-20 sm:py-24 lg:py-32"
    >
      {/* =========================================================
          BACKGROUND DECORATION
      ========================================================= */}

      <div
        className="
          pointer-events-none
          absolute
          -top-32
          -right-32
          h-80
          w-80
          rounded-full
          bg-[#C9A227]/10
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          bottom-0
          -left-32
          h-96
          w-96
          rounded-full
          bg-[#172033]/5
          blur-3xl
        "
      />

      {/* =========================================================
          MAIN CONTAINER
      ========================================================= */}

      <div className="container relative z-10 mx-auto px-5 sm:px-6 lg:px-8">

        {/* =======================================================
            SECTION INTRO
        ======================================================= */}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-14 max-w-3xl lg:mb-20"
        >
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-10 bg-[#C9A227]" />

            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#C9A227] sm:text-sm">
              About David Emuria
            </p>
          </div>

          <h2
            className="
              text-4xl
              font-bold
              leading-[1.08]
              tracking-tight
              text-[#172033]
              sm:text-5xl
              lg:text-6xl
            "
          >
            A voice for purpose.
            <span className="mt-2 block text-[#C9A227]">
              A catalyst for transformation.
            </span>
          </h2>

          <p className="mt-6 max-w-2xl text-base leading-7 text-[#667085] sm:text-lg">
            Exploring identity, purpose, resilience and meaningful living
            through writing, speaking and practical conversations.
          </p>
        </motion.div>

        {/* =======================================================
            MAIN CONTENT
        ======================================================= */}

        <div
          className="
            grid
            items-center
            gap-14
            lg:grid-cols-[0.85fr_1.15fr]
            lg:gap-20
          "
        >

          {/* =====================================================
              PORTRAIT
          ===================================================== */}

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative mx-auto w-full max-w-[420px]"
          >

            {/* Decorative frame */}
            <div
              className="
                absolute
                -bottom-4
                -left-4
                h-full
                w-full
                rounded-[2rem]
                border
                border-[#C9A227]/40
              "
            />

            {/* Secondary frame */}
            <div
              className="
                absolute
                -right-3
                -top-3
                h-24
                w-24
                rounded-tr-[2rem]
                border-r
                border-t
                border-[#172033]/20
              "
            />

            {/* Image container */}

            <div
              className="
                relative
                aspect-[4/5]
                w-full
                overflow-hidden
                rounded-[2rem]
                bg-[#172033]
                shadow-[0_25px_60px_rgba(23,32,51,0.18)]
              "
            >
              <motion.img
                src={davidImg}
                alt="David Emuria"
                initial={{ scale: 1.04 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                whileHover={{ scale: 1.025 }}
                className="
                  h-full
                  w-full
                  object-cover
                  object-top
                  transition-transform
                  duration-700
                "
              />

              {/* Image overlay */}

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-[#172033]/45
                  via-transparent
                  to-transparent
                "
              />
            </div>

            {/* =================================================
                IDENTITY CARD
            ================================================= */}

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="
                absolute
                -bottom-8
                left-4
                right-4
                rounded-2xl
                border
                border-gray-200
                bg-white
                px-5
                py-4
                shadow-[0_15px_40px_rgba(23,32,51,0.12)]
                sm:left-8
                sm:right-8
              "
            >
              <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs font-bold uppercase tracking-[0.15em] text-[#172033] sm:text-sm">

                <span>Author</span>

                <span className="text-[#C9A227]">•</span>

                <span>Speaker</span>

                <span className="text-[#C9A227]">•</span>

                <span>Consultant</span>

              </div>
            </motion.div>
          </motion.div>

          {/* =====================================================
              TEXT CONTENT
          ===================================================== */}

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="pt-8 lg:pt-0"
          >

            {/* Intro paragraph */}

            <p
              className="
                text-xl
                font-medium
                leading-8
                text-[#273142]
                sm:text-2xl
                sm:leading-9
              "
            >
              David Emuria is an author, speaker, consultant, and social
              transformation advocate committed to helping people discover
              purpose, develop resilience, and live with intention.
            </p>

            {/* Supporting paragraphs */}

            <p className="mt-6 text-base leading-7 text-[#667085] sm:text-lg sm:leading-8">
              Through his books, conversations, and speaking engagements,
              David explores the realities that shape people's lives —
              identity, healing, relationships, leadership, faith, purpose,
              and personal growth.
            </p>

            <p className="mt-5 text-base leading-7 text-[#667085] sm:text-lg sm:leading-8">
              His work is rooted in the conviction that transformation
              begins within the individual. When people understand who they
              are, recognize their potential, and embrace responsibility
              for their lives, they become better equipped to influence
              their families, communities, and the world around them.
            </p>

            {/* =================================================
                PHILOSOPHY QUOTE
            ================================================= */}

            <div
              className="
                relative
                mt-9
                overflow-hidden
                rounded-2xl
                border
                border-[#C9A227]/20
                bg-[#F5F6F8]
                p-6
                sm:mt-10
                sm:p-7
              "
            >

              <Quote
                className="
                  absolute
                  right-5
                  top-5
                  h-12
                  w-12
                  text-[#C9A227]/15
                "
              />

              <div className="relative z-10 flex gap-4">

                <div className="mt-1 h-12 w-1 shrink-0 rounded-full bg-[#C9A227]" />

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C9A227]">
                    His Philosophy
                  </p>

                  <p
                    className="
                      mt-3
                      text-lg
                      font-semibold
                      leading-7
                      text-[#172033]
                      sm:text-xl
                      sm:leading-8
                    "
                  >
                    "Every life carries potential. The journey is to discover
                    it, develop it, and use it to make a difference."
                  </p>
                </div>

              </div>
            </div>

            {/* =================================================
                CTA
            ================================================= */}

            <motion.a
              href="#books"
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="
                mt-9
                inline-flex
                items-center
                gap-3
                rounded-full
                bg-[#172033]
                px-7
                py-3.5
                text-sm
                font-semibold
                text-white
                shadow-lg
                transition-all
                duration-300
                hover:bg-[#25324A]
                hover:shadow-xl
                sm:text-base
              "
            >
              <span>Discover His Story</span>

              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </motion.a>

          </motion.div>
        </div>

        {/* =======================================================
            BOTTOM INFORMATION
        ======================================================= */}

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="
            mt-20
            border-t
            border-gray-200
            pt-10
            lg:mt-28
          "
        >

          <div
            className="
              grid
              gap-8
              sm:grid-cols-3
              sm:gap-10
            "
          >

            {/* Work */}

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C9A227]">
                His Work
              </p>

              <p className="mt-3 text-sm leading-6 text-[#667085]">
                Writing, speaking and practical conversations that inspire
                personal growth and meaningful change.
              </p>
            </div>

            {/* Focus */}

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C9A227]">
                His Focus
              </p>

              <p className="mt-3 text-sm leading-6 text-[#667085]">
                Purpose, identity, leadership, healing and meaningful living.
              </p>
            </div>

            {/* Mission */}

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C9A227]">
                His Mission
              </p>

              <p className="mt-3 text-sm leading-6 text-[#667085]">
                To equip people to become intentional, resilient and
                transformative in their spheres of influence.
              </p>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default About;