// frontend/src/sections/Hero.tsx
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-white to-[#f8f4f1] py-12 sm:py-16 md:py-20">
      {/* Transparent Logo Background */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url('/logo.png')`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: '50% sm:45% md:40% lg:35%',
          opacity: 0.06,
        }}
      />

      {/* Subtle Parallax Background Accent */}
      <div
        className="absolute inset-0 bg-fixed bg-center bg-cover opacity-5 pointer-events-none"
        style={{
          backgroundImage: "url('/hero-texture.jpg')",
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Text Content with Enhanced Animations */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-[#4A1F0E] tracking-tight"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Raising Resilient Individuals.
              <motion.span 
                className="block text-[#D4A017] mt-2 sm:mt-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Healing Leaders. Transforming Communities.
              </motion.span>
            </motion.h1>

            <motion.p 
              className="mt-4 sm:mt-6 md:mt-8 text-base sm:text-lg md:text-xl text-gray-600 max-w-xl mx-auto leading-relaxed px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Author • Speaker • Consultant • Social Transformation Advocate
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              className="mt-6 sm:mt-8 md:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <a
                href="#books"
                className="relative px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-[#D4A017] text-white rounded-full shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 overflow-hidden group text-sm sm:text-base md:text-lg text-center"
              >
                <span className="relative z-10">Explore Books</span>
                <motion.div 
                  className="absolute inset-0 bg-[#b58900] rounded-full"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </a>

              <a
                href="#speaking"
                className="px-6 sm:px-8 md:px-10 py-3 sm:py-4 border-2 border-[#4A1F0E] text-[#4A1F0E] rounded-full transition-all duration-500 hover:bg-[#4A1F0E] hover:text-white hover:-translate-y-1 relative overflow-hidden group text-sm sm:text-base md:text-lg text-center"
              >
                <span className="relative z-10">Book to Speak</span>
                <motion.div 
                  className="absolute inset-0 bg-[#4A1F0E] rounded-full"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;