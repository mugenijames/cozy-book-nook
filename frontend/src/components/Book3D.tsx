import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

type Book3DProps = {
  coverImage?: string | null;
  title: string;
  size?: "small" | "medium" | "large";
};

const sizes = {
  small: {
    wrapper: "w-[145px] sm:w-[165px]",
    height: "h-[205px] sm:h-[235px]",
    spine: "w-3 sm:w-4",
  },
  medium: {
    wrapper: "w-[175px] sm:w-[195px]",
    height: "h-[250px] sm:h-[280px]",
    spine: "w-4 sm:w-5",
  },
  large: {
    wrapper: "w-[210px] sm:w-[235px]",
    height: "h-[300px] sm:h-[335px]",
    spine: "w-5 sm:w-6",
  },
};

export default function Book3D({
  coverImage,
  title,
  size = "medium",
}: Book3DProps) {
  const selectedSize = sizes[size];

  return (
    <div className="flex w-full justify-center overflow-visible py-5">
      <motion.div
        initial={{ opacity: 0, rotateY: -8, rotateZ: -1 }}
        whileInView={{ opacity: 1, rotateY: -8, rotateZ: -1 }}
        whileHover={{
          y: -10,
          rotateY: 0,
          rotateZ: 0,
          scale: 1.025,
        }}
        viewport={{ once: true }}
        transition={{
          duration: 0.6,
          ease: "easeOut",
        }}
        style={{
          transformStyle: "preserve-3d",
          perspective: "1000px",
        }}
        className={`relative ${selectedSize.wrapper} cursor-pointer`}
      >
        {/* Ground shadow */}
        <div
          className="
            absolute
            -bottom-6
            left-1/2
            h-7
            w-[80%]
            -translate-x-1/2
            rounded-[50%]
            bg-black/20
            blur-xl
          "
        />

        {/* Book */}
        <div
          className="
            relative
            overflow-visible
            rounded-r-md
            shadow-[12px_18px_30px_rgba(0,0,0,0.25)]
          "
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {/* Spine */}
          <div
            className={`
              absolute
              left-0
              top-0
              z-20
              ${selectedSize.spine}
              ${selectedSize.height}
              rounded-l-md
              bg-gradient-to-r
              from-black/45
              via-black/20
              to-transparent
              pointer-events-none
            `}
          />

          {/* Cover */}
          <div
            className={`
              relative
              ${selectedSize.height}
              overflow-hidden
              rounded-r-md
              rounded-l-sm
              bg-gray-100
            `}
          >
            {coverImage ? (
              <img
                src={coverImage}
                alt={`Cover of ${title}`}
                className="
                  h-full
                  w-full
                  object-cover
                  object-center
                  select-none
                "
                loading="lazy"
                draggable={false}
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = "/placeholder.svg";
                }}
              />
            ) : (
              <div
                className="
                  flex
                  h-full
                  w-full
                  items-center
                  justify-center
                  bg-gradient-to-br
                  from-[#4A1F0E]
                  to-[#2E1208]
                "
              >
                <BookOpen
                  className="h-12 w-12 text-white/60"
                  aria-hidden
                />
              </div>
            )}

            {/* Cover highlight */}
            <div
              className="
                pointer-events-none
                absolute
                inset-y-0
                left-0
                w-1/3
                bg-gradient-to-r
                from-white/15
                to-transparent
              "
            />

            {/* Subtle gloss */}
            <div
              className="
                pointer-events-none
                absolute
                inset-0
                bg-gradient-to-br
                from-white/10
                via-transparent
                to-black/10
              "
            />
          </div>

          {/* Page edge */}
          <div
            className="
              pointer-events-none
              absolute
              right-[-5px]
              top-[3px]
              z-[-1]
              h-[calc(100%-6px)]
              w-[7px]
              rounded-r-sm
              bg-gradient-to-r
              from-[#d8d2c7]
              via-[#f7f4ed]
              to-[#c8c0b3]
            "
          />
        </div>
      </motion.div>
    </div>
  );
}