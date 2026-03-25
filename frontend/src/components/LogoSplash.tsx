// frontend/src/components/LogoSplash.tsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LogoSplash() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#2E1208] to-[#4A2A1A]"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center"
          >
            {/* Logo Animation */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 1,
                repeat: 1,
                ease: "easeInOut",
              }}
              className="mx-auto mb-6"
            >
              <img 
                src="/logo.png" 
                alt="David Emuria" 
                className="h-32 w-32 rounded-full border-4 border-[#D4A017] shadow-2xl object-cover"
              />
            </motion.div>

            {/* Animated Text */}
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="font-heading text-3xl font-bold text-white md:text-4xl"
            >
              David Emuria
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-2 text-lg text-[#D4A017]"
            >
              Author | Speaker | Philanthropist
            </motion.p>

            {/* Loading Bar */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.5, delay: 0.8 }}
              className="mx-auto mt-8 h-1 w-48 overflow-hidden rounded-full bg-[#D4A017]/30"
            >
              <motion.div
                className="h-full w-full bg-[#D4A017]"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  duration: 1,
                  delay: 0.8,
                  repeat: 1,
                  ease: "linear",
                }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}