// frontend/src/sections/Hero.tsx

import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, BookOpen, Mic2, Users, Heart } from "lucide-react";

// Author image
import davidImg from "@/assets/david.png";

const Hero = () => {
  return (
    <section
      id="home"
      className="
        relative
        min-h-screen
        overflow-hidden
        flex
        items-center
        bg-gradient-to-br
        from-[#F8F4EF]
        via-white
        to-[#F3E7DC]
        py-20
        sm:py-24
        lg:py-28
      "
    >
      {/* =====================================================
          BACKGROUND DECORATIONS
      ====================================================== */}

      {/* Large soft glow - top right */}
      <div
        className="
          absolute
          -top-40
          -right-40
          w-72
          h-72
          sm:w-96
          sm:h-96
          lg:w-[500px]
          lg:h-[500px]
          rounded-full
          bg-[#D4A017]/10
          blur-3xl
          pointer-events-none
        "
      />

      {/* Large soft glow - bottom left */}
      <div
        className="
          absolute
          -bottom-40
          -left-40
          w-72
          h-72
          sm:w-96
          sm:h-96
          lg:w-[500px]
          lg:h-[500px]
          rounded-full
          bg-[#6B4226]/10
          blur-3xl
          pointer-events-none
        "
      />

      {/* Subtle logo watermark */}
      <div
        className="
          absolute
          inset-0
          pointer-events-none
          opacity-[0.025]
          bg-no-repeat
          bg-center
          bg-contain
        "
        style={{
          backgroundImage: "url('/logo.png')",
        }}
      />

      {/* Decorative line */}
      <div
        className="
          absolute
          top-0
          left-0
          w-full
          h-[2px]
          bg-gradient-to-r
          from-transparent
          via-[#D4A017]/50
          to-transparent
        "
      />

      {/* =====================================================
          MAIN CONTAINER
      ====================================================== */}

      <div className="container mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        <div
          className="
            max-w-7xl
            mx-auto
            grid
            grid-cols-1
            lg:grid-cols-2
            gap-12
            lg:gap-16
            xl:gap-24
            items-center
          "
        >

          {/* =================================================
              LEFT SIDE — TEXT
          ================================================= */}

          <motion.div
            className="order-2 lg:order-1 text-center lg:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
          >

            {/* Identity Badge */}
            <motion.div
              className="
                inline-flex
                items-center
                gap-2
                px-4
                py-2
                rounded-full
                border
                border-[#8B4513]/20
                bg-[#8B4513]/5
                text-[#6B4226]
                text-xs
                sm:text-sm
                font-semibold
                tracking-wide
                mb-6
              "
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.1,
              }}
            >
              <span
                className="
                  w-2
                  h-2
                  rounded-full
                  bg-[#D4A017]
                  animate-pulse
                "
              />

              AUTHOR • SPEAKER • CONSULTANT
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              className="
                text-4xl
                sm:text-5xl
                md:text-6xl
                lg:text-6xl
                xl:text-7xl
                font-bold
                leading-[1.05]
                tracking-tight
                text-[#3B1F12]
              "
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.2,
              }}
            >
              Raising Resilient
              
              <span
                className="
                  block
                  mt-2
                  text-[#B8860B]
                "
              >
                Individuals.
              </span>
            </motion.h1>

            {/* Secondary Heading */}
            <motion.h2
              className="
                mt-5
                text-xl
                sm:text-2xl
                md:text-3xl
                font-semibold
                leading-snug
                text-[#6B4226]
              "
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.4,
              }}
            >
              Healing Leaders.
              
              <span className="block sm:inline">
                {" "}Transforming Communities.
              </span>
            </motion.h2>

            {/* Description */}
            <motion.p
              className="
                mt-5
                sm:mt-6
                max-w-2xl
                mx-auto
                lg:mx-0
                text-base
                sm:text-lg
                leading-relaxed
                text-gray-600
              "
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.6,
                delay: 0.55,
              }}
            >
              David Emuria is an author, speaker, consultant, and
              social transformation advocate passionate about helping
              people discover healing, identity, purpose, and their
              potential to create meaningful change.
            </motion.p>

            {/* =================================================
                CTA BUTTONS
            ================================================= */}

            <motion.div
              className="
                mt-7
                sm:mt-9
                flex
                flex-col
                sm:flex-row
                gap-3
                sm:gap-4
                justify-center
                lg:justify-start
              "
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.7,
              }}
            >

              {/* Primary CTA */}
              <a
                href="#books"
                className="
                  group
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  px-6
                  sm:px-8
                  py-3.5
                  bg-[#B8860B]
                  hover:bg-[#9C7209]
                  text-white
                  rounded-full
                  font-semibold
                  shadow-lg
                  hover:shadow-xl
                  hover:-translate-y-1
                  transition-all
                  duration-300
                "
              >
                <BookOpen size={18} />

                Explore Books

                <ArrowRight
                  size={18}
                  className="
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                />
              </a>

              {/* Secondary CTA */}
              <a
                href="#speaking"
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  px-6
                  sm:px-8
                  py-3.5
                  border-2
                  border-[#6B4226]
                  text-[#6B4226]
                  hover:bg-[#6B4226]
                  hover:text-white
                  rounded-full
                  font-semibold
                  hover:-translate-y-1
                  transition-all
                  duration-300
                "
              >
                <Mic2 size={18} />

                Book to Speak
              </a>
            </motion.div>

            {/* Small positioning statement */}
            <motion.p
              className="
                mt-6
                text-xs
                sm:text-sm
                text-gray-500
                tracking-wide
              "
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.6,
                delay: 0.9,
              }}
            >
              Inspiring people • Building resilience • Creating impact
            </motion.p>

            {/* =================================================
                IMPACT / SERVICE STRIP
            ================================================= */}

            <motion.div
              className="
                mt-9
                pt-7
                border-t
                border-[#6B4226]/10
                grid
                grid-cols-2
                sm:grid-cols-4
                gap-5
                text-center
                lg:text-left
              "
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 1,
              }}
            >

              {/* Books */}
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <div
                  className="
                    w-9
                    h-9
                    rounded-full
                    bg-[#B8860B]/10
                    flex
                    items-center
                    justify-center
                    text-[#B8860B]
                  "
                >
                  <BookOpen size={17} />
                </div>

                <span className="text-xs sm:text-sm font-medium text-gray-600">
                  Books
                </span>
              </div>

              {/* Speaking */}
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <div
                  className="
                    w-9
                    h-9
                    rounded-full
                    bg-[#B8860B]/10
                    flex
                    items-center
                    justify-center
                    text-[#B8860B]
                  "
                >
                  <Mic2 size={17} />
                </div>

                <span className="text-xs sm:text-sm font-medium text-gray-600">
                  Speaking
                </span>
              </div>

              {/* Mentorship */}
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <div
                  className="
                    w-9
                    h-9
                    rounded-full
                    bg-[#B8860B]/10
                    flex
                    items-center
                    justify-center
                    text-[#B8860B]
                  "
                >
                  <Users size={17} />
                </div>

                <span className="text-xs sm:text-sm font-medium text-gray-600">
                  Mentorship
                </span>
              </div>

              {/* Community */}
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <div
                  className="
                    w-9
                    h-9
                    rounded-full
                    bg-[#B8860B]/10
                    flex
                    items-center
                    justify-center
                    text-[#B8860B]
                  "
                >
                  <Heart size={17} />
                </div>

                <span className="text-xs sm:text-sm font-medium text-gray-600">
                  Community
                </span>
              </div>

            </motion.div>
          </motion.div>


          {/* =================================================
              RIGHT SIDE — AUTHOR IMAGE
          ================================================= */}

          <motion.div
            className="
              order-1
              lg:order-2
              relative
              flex
              justify-center
              items-center
            "
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.9,
              ease: "easeOut",
            }}
          >

            {/* Decorative large circle */}
            <div
              className="
                absolute
                w-[280px]
                h-[280px]
                sm:w-[380px]
                sm:h-[380px]
                md:w-[450px]
                md:h-[450px]
                lg:w-[500px]
                lg:h-[500px]
                rounded-full
                bg-[#D4A017]/10
                blur-2xl
              "
            />

            {/* Decorative outline */}
            <motion.div
              className="
                absolute
                w-[250px]
                h-[250px]
                sm:w-[350px]
                sm:h-[350px]
                md:w-[420px]
                md:h-[420px]
                lg:w-[470px]
                lg:h-[470px]
                rounded-full
                border
                border-[#D4A017]/20
              "
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 35,
                repeat: Infinity,
                ease: "linear",
              }}
            />

            {/* Image wrapper */}
            <motion.div
              className="
                relative
                z-10
                w-full
                max-w-[300px]
                sm:max-w-[360px]
                md:max-w-[420px]
                lg:max-w-[480px]
              "
              whileHover={{
                y: -8,
              }}
              transition={{
                duration: 0.3,
              }}
            >

              {/* Image shadow */}
              <div
                className="
                  absolute
                  inset-5
                  rounded-[2rem]
                  bg-[#6B4226]/20
                  blur-2xl
                "
              />

              {/* Author Image */}
              <img
                src={davidImg}
                alt="David Emuria"
                className="
                  relative
                  z-10
                  block
                  w-full
                  h-auto
                  max-h-[650px]
                  object-contain
                  mx-auto
                  drop-shadow-[0_25px_35px_rgba(0,0,0,0.20)]
                  rounded-2xl
                "
                loading="eager"
                decoding="async"
              />

            </motion.div>

            {/* Floating decorative element */}
            <motion.div
              className="
                absolute
                bottom-2
                right-2
                sm:right-6
                lg:-right-2
                w-14
                h-14
                sm:w-20
                sm:h-20
                rounded-full
                border-4
                border-[#D4A017]/40
              "
              animate={{
                y: [0, -12, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

          </motion.div>

        </div>
      </div>


      {/* =====================================================
          SCROLL INDICATOR
      ====================================================== */}

      <motion.a
        href="#about"
        className="
          absolute
          bottom-5
          left-1/2
          -translate-x-1/2
          hidden
          sm:flex
          flex-col
          items-center
          gap-1
          text-[#6B4226]/60
          hover:text-[#6B4226]
          transition-colors
          duration-300
        "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          delay: 1.4,
          duration: 0.6,
        }}
      >
        <span
          className="
            text-[10px]
            uppercase
            tracking-[0.2em]
            font-medium
          "
        >
          Discover
        </span>

        <motion.div
          animate={{
            y: [0, 5, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <ChevronDown size={20} />
        </motion.div>
      </motion.a>

    </section>
  );
};

export default Hero;