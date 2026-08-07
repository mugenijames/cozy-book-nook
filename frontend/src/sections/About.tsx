// frontend/src/sections/About.tsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Import your actual images from src/assets
import emuriaImg from "@/assets/emuria.jpeg";

const images = [
  {
    src: emuriaImg,
    alt: "David Emuria",

  }

];

export default function About() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="about" className="py-12 md:py-20 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">

          {/* Image Carousel Section */}
          <div className="order-3 md:order-1">
            <div className="">

              <motion.img
                key={currentIndex}
                src={images[currentIndex].src}
                alt={images[currentIndex].alt}
                className="w-full h-85 "

              />


              <motion.div
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4"
              >

              </motion.div>
            </div>
          </div>

          {/* Text Content */}
          <div className="order-2 md:order-2 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-[#2E1208] mb-3 md:mb-4">
              About David Emuria
            </h2>
            <div className="w-20 h-1 bg-[#C17B4F] mx-auto md:mx-0 mb-4 md:mb-6"></div>
            <p className="text-sm md:text-base text-gray-700 mb-3 md:mb-4 leading-relaxed">
              David Emuria is a passionate author, speaker, and philanthropist dedicated to transforming lives through the power of storytelling and practical wisdom.
            </p>
            <p className="text-sm md:text-base text-gray-700 mb-3 md:mb-4 leading-relaxed">
              His work focuses on healing, identity, and purpose, helping individuals and communities discover their true potential and overcome life's challenges.
            </p>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              Through his books, programs, and speaking engagements, David has touched thousands of lives across schools, churches, and community organizations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}