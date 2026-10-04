import { motion } from "framer-motion";
import { ArrowRight, CalendarDays } from "lucide-react";
import davidImg from "@/assets/david.png";

const Hero = () => {
  const handleExploreBooks = () => {
    const booksSection = document.getElementById("books");

    if (booksSection) {
      booksSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleBookToSpeak = () => {
    // This event allows the Speaking section to open its dialog.
    // We will connect this to your Speaking component.
    window.dispatchEvent(new CustomEvent("open-speaking-dialog"));
  };

  return (
    <section
      id="home"
      className="
        relative
        w-full
        overflow-hidden
        bg-[#EEF2F7]
        text-[#2E1208]
      "
    >
      {/* =========================================================
          BACKGROUND DECORATION
      ========================================================= */}

      {/* Very subtle logo watermark */}
      <div
        className="
          absolute
          inset-0
          pointer-events-none
          bg-no-repeat
          bg-center
          bg-contain
          opacity-[0.025]
        "
        style={{
          backgroundImage: "url('/logo.png')",
        }}
      />

      {/* Decorative blurred circle */}
      <div
        className="
          absolute
          -top-32
          -right-32
          h-72
          w-72
          rounded-full
          bg-[#C08A43]/10
          blur-3xl
          pointer-events-none
        "
      />

      <div
        className="
          absolute
          -bottom-40
          -left-40
          h-96
          w-96
          rounded-full
          bg-[#4A1F0E]/5
          blur-3xl
          pointer-events-none
        "
      />

      {/* =========================================================
          MAIN HERO CONTAINER
      ========================================================= */}

      <div
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-7xl
          px-5
          sm:px-6
          lg:px-8
        "
      >
        <div
          className="
            grid
            min-h-[calc(100vh-80px)]
            items-center
            gap-10
            py-14
            sm:py-16
            lg:grid-cols-[1.05fr_0.95fr]
            lg:gap-14
            lg:py-20
          "
        >
          {/* =====================================================
              LEFT — TEXT CONTENT
          ===================================================== */}

          <motion.div
            initial={{ opacity: 0, x: -35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
            className="
              order-2
              text-center
              lg:order-1
              lg:text-left
            "
          >
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.1,
              }}
              className="
                mb-5
                flex
                items-center
                justify-center
                gap-3
                lg:justify-start
              "
            >
              <span className="h-px w-10 bg-[#C08A43]" />

              <span
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.28em]
                  text-[#9A6A2F]
                  sm:text-sm
                "
              >
                Author • Speaker • Consultant
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.2,
                ease: "easeOut",
              }}
              className="
                mx-auto
                max-w-3xl
                text-4xl
                font-bold
                leading-[1.08]
                tracking-tight
                text-[#3B2314]
                sm:text-5xl
                md:text-6xl
                lg:mx-0
                lg:text-6xl
                xl:text-7xl
              "
            >
              Raising Resilient
              <span className="block">Individuals.</span>

              <span
                className="
                  mt-2
                  block
                  text-[#C08A43]
                "
              >
                Healing Leaders.
              </span>

              <span
                className="
                  block
                  text-[#4A1F0E]
                "
              >
                Transforming Communities.
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.45,
              }}
              className="
                mx-auto
                mt-6
                max-w-2xl
                text-base
                leading-7
                text-gray-600
                sm:text-lg
                sm:leading-8
                lg:mx-0
              "
            >
              Through books, speaking, and transformational programs, David
              Emuria inspires people to discover purpose, embrace healing,
              develop resilient leadership, and create meaningful change.
            </motion.p>

            {/* =====================================================
                CTA BUTTONS
            ===================================================== */}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.65,
              }}
              className="
                mt-8
                flex
                flex-col
                gap-3
                sm:flex-row
                sm:justify-center
                lg:justify-start
              "
            >
              {/* Explore Books */}
              <button
                type="button"
                onClick={handleExploreBooks}
                className="
                  group
                  inline-flex
                  min-h-[52px]
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  bg-[#4A1F0E]
                  px-7
                  py-3.5
                  text-sm
                  font-semibold
                  text-white
                  shadow-lg
                  shadow-[#4A1F0E]/15
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:bg-[#321508]
                  hover:shadow-xl
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#C08A43]
                  focus:ring-offset-2
                  sm:px-8
                  sm:text-base
                "
              >
                <a href="/books" className="focus:outline-none">
                  Explore Books
                </a>

                <ArrowRight
                  size={18}
                  className="
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                />
              </button>

              {/* Book to Speak */}
              <button
                type="button"
                onClick={handleBookToSpeak}
                className="
                  group
                  inline-flex
                  min-h-[52px]
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  border
                  border-[#4A1F0E]/30
                  bg-white/70
                  px-7
                  py-3.5
                  text-sm
                  font-semibold
                  text-[#4A1F0E]
                  shadow-sm
                  backdrop-blur-sm
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-[#C08A43]
                  hover:bg-white
                  hover:shadow-lg
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#C08A43]
                  focus:ring-offset-2
                  sm:px-8
                  sm:text-base
                "
              >
                <CalendarDays
                  size={18}
                  className="
                    transition-transform
                    duration-300
                    group-hover:scale-110
                  "
                />

                Book to Speak
              </button>
            </motion.div>

            {/* Credibility / Brand Statement */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.9,
              }}
              className="
                mt-8
                flex
                items-center
                justify-center
                gap-3
                text-xs
                text-gray-500
                sm:text-sm
                lg:justify-start
              "
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#C08A43]" />

              <span>
                Inspiring healing, purpose and transformational leadership.
              </span>
            </motion.div>
          </motion.div>

          {/* =====================================================
              RIGHT — AUTHOR IMAGE
          ===================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              x: 35,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              x: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.9,
              delay: 0.25,
              ease: "easeOut",
            }}
            className="
              order-1
              flex
              justify-center
              lg:order-2
            "
          >
            <div className="relative w-full max-w-[420px] sm:max-w-[460px] lg:max-w-[500px]">
              {/* Decorative background shape */}
              <div
                className="
                  absolute
                  inset-x-6
                  bottom-0
                  top-10
                  rounded-[45%_45%_8%_8%]
                  bg-[#C08A43]/15
                  blur-[1px]
                "
              />

              {/* Gold outline */}
              <div
                className="
                  absolute
                  -inset-2
                  rounded-[45%_45%_8%_8%]
                  border
                  border-[#C08A43]/20
                "
              />

              {/* Image container */}
              <div
                className="
                  relative
                  mx-auto
                  aspect-[4/5]
                  w-[82%]
                  overflow-hidden
                  rounded-[45%_45%_8%_8%]
                  bg-gradient-to-br
                  from-[#E8D8C8]
                  via-[#F5EEE7]
                  to-[#D7BFA8]
                  shadow-2xl
                  shadow-[#4A1F0E]/20
                "
              >
                <motion.img
                  src={davidImg}
                  alt="David Emuria"
                  className="
                    h-full
                    w-full
                    object-contain
                    object-bottom
                  "
                  animate={{
                    y: [0, -4, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* Soft image overlay */}
                <div
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-[#2E1208]/10
                    via-transparent
                    to-transparent
                  "
                />
              </div>

              {/* Floating author badge */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 1,
                }}
                className="
                  absolute
                  bottom-5
                  left-2
                  rounded-2xl
                  border
                  border-white/70
                  bg-white/90
                  px-4
                  py-3
                  shadow-xl
                  backdrop-blur-md
                  sm:bottom-7
                  sm:left-0
                "
              >
                <p
                  className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-[0.2em]
                    text-[#9A6A2F]
                  "
                >
                  David Emuria
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Author & Transformational Voice
                </p>
              </motion.div>

              {/* Decorative gold dot */}
              <div
                className="
                  absolute
                  right-3
                  top-8
                  h-4
                  w-4
                  rounded-full
                  bg-[#C08A43]
                  shadow-lg
                  shadow-[#C08A43]/30
                  sm:right-0
                  sm:top-10
                "
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* =========================================================
          BOTTOM TRANSITION
      ========================================================= */}

      <div
        className="
          absolute
          bottom-0
          left-0
          right-0
          h-px
          bg-gradient-to-r
          from-transparent
          via-[#C08A43]/30
          to-transparent
        "
      />
    </section>
  );
};

export default Hero;