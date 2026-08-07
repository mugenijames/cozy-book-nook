import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import davidImg from "@/assets/david.png";

const images = [
  {
    src: davidImg,
    alt: "David Emuria",
  },
];

export default function About() {
  const [currentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {}, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-[#FFF9F4] py-20">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* IMAGE */}
          <div className="flex justify-center order-1">

            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="
                  relative
                  w-full
                  max-w-md
                  rounded-3xl
                  overflow-hidden
                  bg-white
                  shadow-2xl
                  p-5
                "
              >
                {/* Decorative background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#F8EFE7] via-white to-[#F4E0CF] opacity-80" />

                {/* Decorative circle */}
                <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-[#C17B4F]/20 blur-3xl" />

                <img
                  src={images[currentIndex].src}
                  alt={images[currentIndex].alt}
                  className="
                    relative
                    z-10
                    w-full
                    h-auto
                    max-h-[620px]
                    object-contain
                    transition-all
                    duration-500
                  "
                />
              </motion.div>
            </AnimatePresence>

          </div>

          {/* TEXT */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: .7 }}
            viewport={{ once: true }}
            className="order-2"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-[#2E1208]">
              About David Emuria
            </h2>

            <div className="mt-4 w-24 h-1 bg-[#C17B4F] rounded-full" />

            <p className="mt-8 text-lg leading-8 text-gray-700">
              David Emuria is a passionate author, speaker, and philanthropist
              dedicated to transforming lives through the power of storytelling
              and practical wisdom.
            </p>
            
            <p className="mt-6 text-lg leading-8 text-gray-700">
              His work focuses on healing, identity, and purpose, helping
              individuals and communities discover their true potential and
              overcome life's challenges.
            </p>

            <p className="mt-6 text-lg leading-8 text-gray-700">
              Through his books, programs, and speaking engagements, David has
              impacted thousands of lives across schools, churches, and
              community organizations, inspiring hope, leadership, and lasting
              transformation.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">

              <div className="bg-white shadow-md rounded-xl px-6 py-4">
                <h3 className="text-2xl font-bold text-[#C17B4F]">10+</h3>
                <p className="text-gray-600 text-sm">Published Works</p>
              </div>

              <div className="bg-white shadow-md rounded-xl px-6 py-4">
                <h3 className="text-2xl font-bold text-[#C17B4F]">1000+</h3>
                <p className="text-gray-600 text-sm">Readers Impacted</p>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}