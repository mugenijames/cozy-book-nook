import { motion } from "framer-motion";

interface Book3DProps {
  coverImage?: string | null;
  title: string;
  size?: "small" | "medium" | "large";
}

const Book3D = ({
  coverImage,
  title,
  size = "medium",
}: Book3DProps) => {
  const sizeClasses = {
    small: {
      wrapper: "h-[220px] sm:h-[260px]",
      book: "h-[200px] w-[130px] sm:h-[235px] sm:w-[155px]",
      spine: "w-[10px] sm:w-[12px]",
      shadow: "w-[125px] sm:w-[150px]",
    },

    medium: {
      wrapper: "h-[300px] sm:h-[350px]",
      book: "h-[275px] w-[180px] sm:h-[315px] sm:w-[205px]",
      spine: "w-[12px] sm:w-[14px]",
      shadow: "w-[175px] sm:w-[200px]",
    },

    large: {
      wrapper: "h-[390px] sm:h-[450px]",
      book: "h-[360px] w-[235px] sm:h-[410px] sm:w-[270px]",
      spine: "w-[14px] sm:w-[16px]",
      shadow: "w-[225px] sm:w-[260px]",
    },
  };

  const currentSize = sizeClasses[size];

  return (
    <div
      className={`
        relative
        flex
        w-full
        items-center
        justify-center
        overflow-hidden
        ${currentSize.wrapper}
      `}
      aria-label={title}
    >
      {/* Floor shadow */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0.8 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.5 }}
        className={`
          absolute
          bottom-5
          left-1/2
          h-4
          -translate-x-1/2
          rounded-[50%]
          bg-black/20
          blur-md
          ${currentSize.shadow}
        `}
      />

      {/* Book */}
      <motion.div
        initial={{
          opacity: 0,
          y: 15,
          rotateY: -8,
        }}
        animate={{
          opacity: 1,
          y: 0,
          rotateY: -3,
        }}
        whileHover={{
          y: -6,
          rotateY: -8,
          rotateX: 2,
          scale: 1.02,
        }}
        transition={{
          duration: 0.45,
          ease: "easeOut",
        }}
        style={{
          transformStyle: "preserve-3d",
          perspective: "1000px",
        }}
        className={`
          group
          relative
          z-10
          overflow-visible
          ${currentSize.book}
        `}
      >
        {/* Front cover */}
        <div
          className="
            absolute
            inset-0
            overflow-hidden
            rounded-r-[4px]
            rounded-l-[2px]
            bg-[#F4EFE8]
            shadow-2xl
          "
          style={{
            transform: "translateZ(8px)",
            transformStyle: "preserve-3d",
          }}
        >
          {coverImage ? (
            <img
              src={coverImage}
              alt={title}
              className="
                h-full
                w-full
                object-cover
                object-center
                transition-transform
                duration-500
                group-hover:scale-[1.025]
              "
              loading="lazy"
            />
          ) : (
            /* Fallback when no cover image exists */
            <div
              className="
                flex
                h-full
                w-full
                flex-col
                items-center
                justify-center
                bg-gradient-to-br
                from-[#4A1F0E]
                via-[#6B3218]
                to-[#2E1208]
                p-5
                text-center
                text-white
              "
            >
              <div
                className="
                  mb-4
                  h-px
                  w-10
                  bg-[#D4A017]
                "
              />

              <span
                className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-[#D4A017]
                "
              >
                David Emuria
              </span>

              <h3
                className="
                  mt-3
                  text-sm
                  font-bold
                  leading-tight
                  sm:text-base
                "
              >
                {title}
              </h3>

              <div
                className="
                  mt-4
                  h-px
                  w-10
                  bg-[#D4A017]
                "
              />
            </div>
          )}

          {/* Subtle glass/highlight effect */}
          <div
            className="
              pointer-events-none
              absolute
              inset-0
              bg-gradient-to-r
              from-white/10
              via-transparent
              to-black/10
              opacity-60
            "
          />

          {/* Cover edge highlight */}
          <div
            className="
              pointer-events-none
              absolute
              inset-y-0
              left-0
              w-[2px]
              bg-white/30
            "
          />
        </div>

        {/* Spine */}
        <div
          className={`
            absolute
            left-0
            top-0
            h-full
            overflow-hidden
            rounded-l-[2px]
            bg-gradient-to-r
            from-[#251008]
            via-[#5A2B16]
            to-[#3A190C]
            shadow-inner
            ${currentSize.spine}
          `}
          style={{
            transform: "rotateY(-90deg) translateZ(8px)",
            transformOrigin: "right center",
          }}
        >
          <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-white/10" />
        </div>

        {/* Pages / right edge */}
        <div
          className="
            absolute
            right-0
            top-[3px]
            h-[calc(100%-6px)]
            w-[7px]
            rounded-r-[2px]
            bg-gradient-to-r
            from-[#D6C9B8]
            via-[#F5F0E8]
            to-[#BFAF9D]
            shadow-inner
          "
          style={{
            transform: "translateZ(3px)",
          }}
        >
          <div
            className="
              absolute
              inset-y-2
              right-[2px]
              w-px
              bg-[#A99A87]/40
            "
          />
        </div>

        {/* Bottom pages */}
        <div
          className="
            absolute
            bottom-0
            left-[4px]
            right-[5px]
            h-[6px]
            rounded-b-[3px]
            bg-gradient-to-b
            from-[#CFC2B1]
            to-[#F3EEE5]
          "
          style={{
            transform: "translateZ(4px)",
          }}
        />

        {/* Book thickness / back edge */}
        <div
          className="
            absolute
            inset-0
            rounded-r-[5px]
            bg-[#35160B]
          "
          style={{
            transform: "translateZ(-5px)",
          }}
        />
      </motion.div>
    </div>
  );
};

export default Book3D;