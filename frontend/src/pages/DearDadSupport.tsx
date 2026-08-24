import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  HandHeart,
  HeartHandshake,
  Users,
} from "lucide-react";

export default function DearDadSupportPage() {
  return (
    <main className="min-h-screen bg-white pt-24">

      {/* ======================================================
          HERO
      ======================================================= */}

      <section className="relative overflow-hidden bg-[#F7F7F5] py-20 sm:py-24 lg:py-28">

        <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-[#D4A017]/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-[#4A1F0E]/10 blur-3xl" />

        <div className="container relative z-10 mx-auto px-5 sm:px-6 lg:px-8">

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-3xl text-center"
          >

            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#D4A017]">
              Dear Dad Initiative
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight text-[#2E1208] sm:text-5xl lg:text-6xl">
              Support the Initiative
            </h1>

            <div className="mx-auto mt-6 h-1 w-20 rounded-full bg-[#D4A017]" />

            <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-gray-600 sm:text-xl">
              Your support can help us reach more fathers, strengthen
              families and positively influence the next generation.
            </p>

          </motion.div>

        </div>
      </section>


      {/* ======================================================
          SUPPORT OPTIONS
      ======================================================= */}

      <section className="py-20 sm:py-24 lg:py-28">

        <div className="container mx-auto px-5 sm:px-6 lg:px-8">

          <div className="mx-auto grid max-w-6xl gap-7 md:grid-cols-3">

            {/* DONATE */}

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-3xl border border-gray-200 bg-white p-7 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-9"
            >

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D4A017]/10">
                <HandHeart className="h-7 w-7 text-[#D4A017]" />
              </div>

              <h2 className="mt-6 text-2xl font-bold text-[#2E1208]">
                Donate
              </h2>

              <p className="mt-4 leading-7 text-gray-600">
                Make a financial contribution toward the work of the
                Dear Dad Initiative and help us extend its reach.
              </p>

              <button
                type="button"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#D4A017] px-6 py-3 font-bold text-white transition hover:bg-[#B88900]"
              >
                Donate
                <ArrowRight className="h-4 w-4" />
              </button>

            </motion.div>


            {/* SPONSOR */}

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-3xl border border-gray-200 bg-white p-7 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-9"
            >

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#4A1F0E]/10">
                <Users className="h-7 w-7 text-[#4A1F0E]" />
              </div>

              <h2 className="mt-6 text-2xl font-bold text-[#2E1208]">
                Sponsor
              </h2>

              <p className="mt-4 leading-7 text-gray-600">
                Sponsor an activity, outreach, mentorship opportunity
                or specific initiative that supports the Dear Dad vision.
              </p>

              <button
                type="button"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#4A1F0E] px-6 py-3 font-bold text-white transition hover:bg-[#2E1208]"
              >
                Become a Sponsor
                <ArrowRight className="h-4 w-4" />
              </button>

            </motion.div>


            {/* PARTNER */}

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-3xl border border-gray-200 bg-white p-7 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-9"
            >

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D4A017]/10">
                <HeartHandshake className="h-7 w-7 text-[#D4A017]" />
              </div>

              <h2 className="mt-6 text-2xl font-bold text-[#2E1208]">
                Partner With Us
              </h2>

              <p className="mt-4 leading-7 text-gray-600">
                Organizations, churches, institutions and individuals
                can partner with us to expand the reach and impact of
                the initiative.
              </p>

              <button
                type="button"
                className="mt-7 inline-flex items-center gap-2 rounded-full border-2 border-[#4A1F0E] px-6 py-3 font-bold text-[#4A1F0E] transition hover:bg-[#4A1F0E] hover:text-white"
              >
                Partner With Us
                <ArrowRight className="h-4 w-4" />
              </button>

            </motion.div>

          </div>


          {/* ====================================================
              BACK
          ==================================================== */}

          <div className="mx-auto mt-14 max-w-6xl">

            <Link
              to="/programs/career-guidance-counselling/dear-dad-initiative"
              className="inline-flex items-center gap-2 font-bold text-[#8B4513] transition-all hover:gap-3 hover:text-[#4A1F0E]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dear Dad Initiative
            </Link>

          </div>

        </div>
      </section>

    </main>
  );
}