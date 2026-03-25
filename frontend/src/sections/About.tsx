// frontend/src/sections/About.tsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Import your actual images from src/assets
import churchImg from "@/assets/church.jpeg";
import schoolImg from "@/assets/school.jpeg";
import leaderTrainingImg from "@/assets/leader-training.jpeg";
import communityImg2 from "@/assets/community2.jpeg";
import communityImg from "@/assets/community.jpeg";
import ariseTurkanaImg from "@/assets/ARISE-TURKANA.png";
import logo from "@/assets/logo.png";

const images = [
  {
    src: churchImg,
    alt: "David Emuria at church event",
    caption: "Mentoring the next generation of believers during a joyful youth fellowship service"
  },
  {
    src: schoolImg,
    alt: "David Emuria with students",
    caption: "Inspiring young minds"
  },
  {
    src: leaderTrainingImg,
    alt: "David Emuria leadership training",
    caption: "Leadership development programs"
  },
  {
    src: communityImg2,
    alt: "David Emuria community outreach",
    caption: "Community transformation"
  },
  {
    src: communityImg,
    alt: "David Emuria church ministry",
    caption: "Building strong church communities"
  },
  {
    src: ariseTurkanaImg,
    alt: "David Emuria philanthropy",
    caption: "Arise Turkana initiative"
  },
  {
    src: logo,
    alt: "David Emuria",
    caption: "Author & Speaker"
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
          <div className="order-1 md:order-1">
            <div className="relative rounded-2xl shadow-xl overflow-hidden border-4 border-[#C17B4F]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentIndex}
                  src={images[currentIndex].src}
                  alt={images[currentIndex].alt}
                  className="w-full h-96 object-cover"
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                />
              </AnimatePresence>
              
              <motion.div 
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-white text-sm text-center">
                  {images[currentIndex].caption}
                </p>
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