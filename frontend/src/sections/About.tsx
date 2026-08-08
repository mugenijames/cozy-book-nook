// frontend/src/sections/About.tsx

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import davidImg from "@/assets/david.png";

const About = () => {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-[#F7F7F5] py-20 sm:py-24 lg:py-32"
    >
      {/* Decorative background */}
      <div className="pointer-events-none absolute left-0 top-0 h-72 w-72 rounded-full bg-[#D4A017]/10 blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-[#4A1F0E]/10 blur-3xl" />

      <div className="container relative z-10 mx-auto px-5 sm:px-6 lg:px-8">

        {/* Section intro */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="mb-14 max-w-3xl lg:mb-20"
        >
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-[#D4A017]">
            About David Emuria
          </p>

          <h2 className="text-4xl font-bold leading-tight tracking-tight text-[#4A1F0E] sm:text-5xl lg:text-6xl">
            A voice for purpose.
            <span className="block text-[#D4A017]">
              A catalyst for transformation.
            </span>
          </h2>

          <div className="mt-6 h-1 w-20 rounded-full bg-[#D4A017]" />
        </motion.div>

        {/* Main content */}
        <div className="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">

          {/* Portrait */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
            className="relative mx-auto w-full max-w-[430px]"
          >
            {/* Decorative border */}
            <div className="absolute -bottom-4 -left-4 h-full w-full rounded-[2rem] border border-[#D4A017]/40" />

            <div className="relative overflow-hidden rounded-[2rem] bg-[#4A1F0E] shadow-2xl">
              <img
                src={davidImg}
                alt="David Emuria"
                className="
                  block
                  h-auto
                  w-full
                  object-contain
                  transition-transform
                  duration-700
                  hover:scale-[1.02]
                "
              />
            </div>

            {/* Identity card */}
            <div className="absolute -bottom-7 left-5 right-5 rounded-2xl border border-white/60 bg-white/95 p-4 shadow-xl backdrop-blur-md sm:left-8 sm:right-8">
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-semibold uppercase tracking-wider text-[#4A1F0E] sm:text-sm">
                <span>Author</span>
                <span className="text-[#D4A017]">•</span>
                <span>Speaker</span>
                <span className="text-[#D4A017]">•</span>
                <span>Consultant</span>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
            className="pt-8 lg:pt-0"
          >
            <p className="text-lg leading-8 text-gray-700 sm:text-xl">
              David Emuria is an author, speaker, consultant, and social
              transformation advocate committed to helping people discover
              purpose, develop resilience, and live with intention.
            </p>

            <p className="mt-6 text-base leading-7 text-gray-600 sm:text-lg">
              Through his books, conversations, and speaking engagements,
              David explores the realities that shape people's lives —
              identity, healing, relationships, leadership, faith, purpose,
              and personal growth.
            </p>

            <p className="mt-6 text-base leading-7 text-gray-600 sm:text-lg">
              His work is rooted in the conviction that transformation
              begins within the individual. When people understand who they
              are, recognize their potential, and embrace responsibility
              for their lives, they become better equipped to influence
              their families, communities, and the world around them.
            </p>

            {/* Philosophy */}
            <div className="mt-8 border-l-4 border-[#D4A017] pl-5 sm:mt-10">
              <p className="text-lg font-semibold leading-7 text-[#4A1F0E] sm:text-xl">
                "Every life carries potential. The journey is to discover it,
                develop it, and use it to make a difference."
              </p>
            </div>

            {/* CTA */}
            <motion.a
              href="#books"
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
              className="
                mt-9
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-[#4A1F0E]
                px-7
                py-3.5
                text-sm
                font-semibold
                text-white
                shadow-lg
                transition-all
                duration-300
                hover:bg-[#2E1208]
                hover:shadow-xl
                sm:text-base
              "
            >
              <a href="/books" className="focus:outline-none">
                Discover His Story
              </a>
              <ArrowRight className="h-4 w-4" />
            </motion.a>
          </motion.div>
        </div>

        {/* Bottom statement */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-20 border-t border-gray-200 pt-8 lg:mt-28"
        >
          <div className="grid gap-6 sm:grid-cols-3 sm:gap-10">

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4A017]">
                His Work
              </p>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Writing, speaking and practical conversations that inspire
                personal growth.
              </p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4A017]">
                His Focus
              </p>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Purpose, identity, leadership, healing and meaningful living.
              </p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4A017]">
                His Mission
              </p>
              <p className="mt-2 text-sm leading-6 text-gray-600">
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