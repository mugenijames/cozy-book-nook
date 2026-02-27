import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="relative pt-40 pb-32 overflow-hidden bg-gradient-to-b from-white to-[#f8f4f1]">

      {/* Subtle Parallax Background Accent */}
      <div
        className="absolute inset-0 bg-fixed bg-center bg-cover opacity-5"
        style={{
          backgroundImage: "url('/hero-texture.jpg')",
        }}
      />

      <div className="container mx-auto grid md:grid-cols-2 gap-16 items-center px-6 relative z-10">

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h1 className="text-4xl md:text-6xl font-bold leading-tight text-[#4A1F0E] tracking-tight">
            Raising Resilient Individuals.
            <span className="block text-[#D4A017] mt-3">
              Healing Leaders. Transforming Communities.
            </span>
          </h1>

          <p className="mt-8 text-lg text-gray-600 max-w-xl leading-relaxed">
            Author • Speaker • Consultant • Social Transformation Advocate
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-wrap gap-6">

            <a
              href="#books"
              className="relative px-10 py-4 bg-[#D4A017] text-white rounded-full shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
            >
              Explore Books
            </a>

            <a
              href="#speaking"
              className="px-10 py-4 border-2 border-[#4A1F0E] text-[#4A1F0E] rounded-full transition-all duration-500 hover:bg-[#4A1F0E] hover:text-white hover:-translate-y-1"
            >
              Book to Speak
            </a>

          </div>
        </motion.div>

        {/* Image Section */}
        <div className="relative flex justify-center">

          {/* Premium Golden Glow */}
          <div className="absolute w-96 h-96 bg-[#D4A017]/20 rounded-full blur-3xl animate-pulse" />

          <motion.img
            src="/images/emuria1.jpg"
            alt="David Emuria"
            className="w-full max-w-md rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.25)] relative z-10"

            initial={{ opacity: 0, x: 100 }}
            animate={{
              opacity: 1,
              x: 0,
              y: [0, -15, 0]
            }}

            transition={{
              opacity: { duration: 1 },
              x: { duration: 1, ease: "easeOut" },
              y: {
                duration: 5,
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