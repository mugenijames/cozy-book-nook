// frontend/src/sections/About.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Quote, ChevronDown, ChevronUp } from "lucide-react";
import davidImg from "@/assets/david.png";

const About = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <section
      id="about"
      className="relative overflow-hidden bg-white py-20 sm:py-24 lg:py-32"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute -top-32 -right-32 h-80 w-80 rounded-full bg-[#C9A227]/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 -left-32 h-96 w-96 rounded-full bg-[#172033]/5 blur-3xl" />

      <div className="container relative z-10 mx-auto px-5 sm:px-6 lg:px-8">

        {/* Section intro */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-14 max-w-3xl lg:mb-20"
        >
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-10 bg-[#C9A227]" />
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#C9A227] sm:text-sm">
              MEET DAVID EMURIA
            </p>
          </div>
          <h2 className="text-4xl font-bold leading-[1.08] tracking-tight text-[#172033] sm:text-5xl lg:text-6xl">
            A voice for purpose.
            <span className="mt-2 block text-[#C9A227]">A catalyst for transformation.</span>
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-7 text-[#667085] sm:text-lg">
            Exploring identity, purpose, resilience and meaningful living through writing, speaking and practical conversations.
          </p>
        </motion.div>

        {/* Main content */}
        <div className="grid items-center gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">

          {/* Portrait */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative mx-auto w-full max-w-[420px]"
          >
            <div className="absolute -bottom-4 -left-4 h-full w-full rounded-[2rem] border border-[#C9A227]/40" />
            <div className="absolute -right-3 -top-3 h-24 w-24 rounded-tr-[2rem] border-r border-t border-[#172033]/20" />
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] bg-[#172033] shadow-[0_25px_60px_rgba(23,32,51,0.18)]">
              <motion.img
                src={davidImg}
                alt="David Emuria"
                initial={{ scale: 1.04 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                whileHover={{ scale: 1.025 }}
                className="h-full w-full object-cover object-top transition-transform duration-700"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#172033]/45 via-transparent to-transparent" />
            </div>

            {/* Identity card */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="absolute -bottom-8 left-4 right-4 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-[0_15px_40px_rgba(23,32,51,0.12)] sm:left-8 sm:right-8"
            >
              <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs font-bold uppercase tracking-[0.15em] text-[#172033] sm:text-sm">
                <span>Author</span>
                <span className="text-[#C9A227]">•</span>
                <span>Speaker</span>
                <span className="text-[#C9A227]">•</span>
                <span>Consultant</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="pt-8 lg:pt-0"
          >
            {/* Always visible intro */}
            <p className="mt-6 text-base leading-7 text-[#667085] text-justify sm:text-lg sm:leading-8">
              David Emuria is a Kenyan author, pastor, business consultant, and missionary
              based in Kakuma, Turkana. He holds a Bachelor of Commerce in Finance from the
              Catholic University of Eastern Africa, with additional training in nonprofit
              management, social work, chaplaincy, digital marketing, video editing, and
              leadership — including a child protection certification through Compassion
              International and UNICEF Agora.
            </p>

            {/* Expandable content */}
            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div
                  key="expanded"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <p className="mt-6 text-base leading-7 text-[#667085] text-justify sm:text-lg sm:leading-8">
                    He is the Founder of The Great Army Society, a nonprofit built around spiritual
                    development, education, financial literacy, and family; Founder of the Dear Dad
                    Initiative, a community-based organization offering healing sessions, mentorship,
                    boy-child empowerment, fatherhood, and family empowerment programs; and
                    Founder of David Emuria Enterprise, offering mentorship and training to
                    individuals and organizations through his courses Fund your dream, Maximize
                    Campus, Dreamers Table and many other platforms. He also runs several small
                    businesses, including Okitim Beauty Store, a cosmetics and beauty products company.
                  </p>

                  <p className="mt-5 text-base leading-7 text-[#667085] text-justify sm:text-lg sm:leading-8">
                    As a missionary with The Winning Team International, he serves students and
                    families across the Kakuma Refugee Camp and Kalobeyei Settlement. As an
                    author, he has written more than 10 books, including Dear Dad, Maximize campus,
                    Hidden Cost of Polygamy, Lead Better Than Me, The Accused, and Adventure of
                    Entrepreneurship, drawing on his own testimony of growing up without a present
                    father and turning that pain into purpose. He is the creator of the Dreamers
                    Community, an online movement and content platform for youth aged 16–30, and
                    is developing Dare to Dream, a talk show built around motivational interviews,
                    life coaching, and audience participation.
                  </p>

                  <p className="mt-5 text-base leading-7 text-[#667085] text-justify sm:text-lg sm:leading-8">
                    David is available for speaking engagements, consulting work, and mentorship,
                    and continues to live and work out of Kakuma — the town he credits with shaping
                    everything he now builds.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Read more / Show less button */}
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#C9A227] hover:text-[#a87d1a] transition-colors"
            >
              {expanded ? (
                <><ChevronUp className="h-4 w-4" /> Show less</>
              ) : (
                <><ChevronDown className="h-4 w-4" /> Read more about David</>
              )}
            </button>

            {/* Philosophy quote */}
            <div className="relative mt-9 overflow-hidden rounded-2xl border border-[#C9A227]/20 bg-[#F5F6F8] p-6 sm:mt-10 sm:p-7">
              <Quote className="absolute right-5 top-5 h-12 w-12 text-[#C9A227]/15" />
              <div className="relative z-10 flex gap-4">
                <div className="mt-1 h-12 w-1 shrink-0 rounded-full bg-[#C9A227]" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C9A227]">
                    His Philosophy
                  </p>
                  <p className="mt-3 text-lg font-semibold leading-7 text-[#172033] text-justify sm:text-xl sm:leading-8">
                    "Every life carries potential. The journey is to discover it, develop it, and use it to make a difference."
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <motion.a
              href="#books"
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="mt-9 inline-flex items-center gap-3 rounded-full bg-[#172033] px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:bg-[#25324A] hover:shadow-xl sm:text-base"
            >
              <span>Discover His Story</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </motion.a>
          </motion.div>
        </div>

        {/* Bottom information */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-20 border-t border-gray-200 pt-10 lg:mt-28"
        >
          <div className="grid gap-8 sm:grid-cols-3 sm:gap-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C9A227]">His Work</p>
              <p className="mt-3 text-sm leading-6 text-[#667085] text-justify">
                Writing, speaking and practical conversations that inspire personal growth and meaningful change.
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C9A227]">His Focus</p>
              <p className="mt-3 text-sm leading-6 text-[#667085] text-justify">
                Purpose, identity, leadership, healing and meaningful living.
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C9A227]">His Mission</p>
              <p className="mt-3 text-sm leading-6 text-[#667085] text-justify">
                To equip people to become intentional, resilient and transformative in their spheres of influence.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;