import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="pt-40 pb-24 overflow-hidden">
      <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center px-6">

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-5xl font-bold leading-tight text-[#4A1F0E]">
            Raising Resilient Individuals.
            <span className="block text-[#D4A017]">
              Healing Leaders. Transforming Communities.
            </span>
          </h1>

          <p className="mt-6 text-lg text-gray-700">
            Author • Speaker • Consultant • Social Transformation Advocate
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#books"
              className="px-8 py-3 bg-[#D4A017] text-white rounded-md shadow-lg hover:bg-[#b88a14] transition-colors"
            >
              Explore Books
            </a>
            <a
              href="#speaking"
              className="px-8 py-3 border border-[#4A1F0E] text-[#4A1F0E] rounded-md hover:bg-[#4A1F0E] hover:text-white transition-all"
            >
              Book to Speak
            </a>
          </div>
        </motion.div>

        {/* Dynamic Image Container */}
        <div className="relative flex justify-center">
          {/* Decorative Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#D4A017]/10 rounded-full blur-3xl" />

          <motion.img
            src="./images/emuria1.jpg"
            alt="David Emuria"
            className="w-full max-w-sm rounded-2xl shadow-2xl relative z-10"
            
            // 1. Initial State (Hidden and slightly right)
            initial={{ opacity: 0, x: 100 }}
            
            // 2. Combined Animation State
            animate={{ 
              opacity: 1, 
              x: 0,
              y: [0, -20, 0] // This handles the floating
            }}
            
            // 3. Transition logic for each property
            transition={{
              opacity: { duration: 0.8 },
              x: { duration: 0.8, ease: "easeOut" },
              y: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
          />
        </div>

      </div>
    </section>
  );
};

export default Hero;