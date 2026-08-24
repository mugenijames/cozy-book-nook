// frontend/src/pages/DearDadSupport.tsx

import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  HeartHandshake,
  HandHeart,
  Building2,
  Gift,
  Globe2,
  Heart,
  Mail,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function DearDadSupportPage() {
  return (
    <main className="min-h-screen bg-white pt-24">
      {/* ============================================================
          HERO
      ============================================================ */}

      <section className="relative overflow-hidden bg-[#F7F7F5] py-20 sm:py-24 lg:py-32">
        {/* Decorative background */}
        <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-[#D4A017]/15 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-[#4A1F0E]/10 blur-3xl" />

        <div className="container relative z-10 mx-auto px-5 sm:px-6 lg:px-8">
          {/* Breadcrumb */}

          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              to="/dear-dad"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#8B4513] transition-colors hover:text-[#4A1F0E]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dear Dad Initiative
            </Link>
          </motion.div>

          <div className="mx-auto mt-12 max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D4A017] text-white shadow-xl">
                <HeartHandshake className="h-8 w-8" />
              </div>

              <p className="mt-7 text-sm font-bold uppercase tracking-[0.25em] text-[#D4A017]">
                Support the Dear Dad Initiative
              </p>

              <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-[#2E1208] sm:text-5xl lg:text-6xl">
                Help us build a generation
                <span className="block text-[#8B4513]">
                  that knows it is loved.
                </span>
              </h1>

              <div className="mx-auto mt-7 h-1 w-20 rounded-full bg-[#D4A017]" />

              <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-gray-600 sm:text-xl">
                The Dear Dad Initiative exists to encourage fathers,
                strengthen families and help children experience the love,
                presence and guidance they need. You can help us extend this
                impact through giving, sponsorship or partnership.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================================
          THREE WAYS TO PARTICIPATE
      ============================================================ */}

      <section className="py-20 sm:py-24 lg:py-28">
        <div className="container mx-auto px-5 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-3xl text-center"
          >
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#D4A017]">
              Get involved
            </p>

            <h2 className="mt-3 text-3xl font-bold text-[#2E1208] sm:text-4xl lg:text-5xl">
              Three ways to make a difference
            </h2>

            <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-[#D4A017]" />

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
              Whether you want to make a financial contribution, support a
              specific need or build a long-term relationship with the
              initiative, there is a place for you.
            </p>
          </motion.div>

          <div className="mt-14 grid gap-7 lg:grid-cols-3">
            {/* ======================================================
                DONATE
            ====================================================== */}

            <motion.article
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6 }}
              whileHover={{ y: -8 }}
              className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[#D4A017]/30 bg-white shadow-lg transition-shadow duration-500 hover:shadow-2xl"
            >
              <div className="bg-[#D4A017] p-8 text-white">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
                  <Gift className="h-7 w-7" />
                </div>

                <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-white/80">
                  Give
                </p>

                <h3 className="mt-2 text-3xl font-bold">
                  Donate
                </h3>
              </div>

              <div className="flex flex-1 flex-col p-8">
                <p className="text-base leading-7 text-gray-600">
                  Make a financial contribution that helps us reach more
                  fathers, children and families through the Dear Dad
                  Initiative.
                </p>

                <ul className="mt-7 space-y-3">
                  {[
                    "Support outreach activities",
                    "Help provide program resources",
                    "Support families and children",
                    "Help us expand our reach",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#D4A017]" />

                      <span className="text-sm leading-6 text-gray-600">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/dear-dad/get-involved?type=donate"
                  className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-[#D4A017] px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#B88900] hover:shadow-xl"
                >
                  Donate
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.article>

            {/* ======================================================
                SPONSOR
            ====================================================== */}

            <motion.article
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ y: -8 }}
              className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[#4A1F0E]/15 bg-white shadow-lg transition-shadow duration-500 hover:shadow-2xl"
            >
              <div className="bg-[#4A1F0E] p-8 text-white">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                  <HandHeart className="h-7 w-7 text-[#D4A017]" />
                </div>

                <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-white/60">
                  Support a need
                </p>

                <h3 className="mt-2 text-3xl font-bold">
                  Sponsor
                </h3>
              </div>

              <div className="flex flex-1 flex-col p-8">
                <p className="text-base leading-7 text-gray-600">
                  Sponsor a specific activity, child, event, school program
                  or identified need within the Dear Dad Initiative.
                </p>

                <ul className="mt-7 space-y-3">
                  {[
                    "Sponsor a specific activity",
                    "Support a child or family need",
                    "Fund an outreach event",
                    "Provide program materials",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#D4A017]" />

                      <span className="text-sm leading-6 text-gray-600">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/dear-dad/get-involved?type=sponsor"
                  className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-[#4A1F0E] px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#2E1208] hover:shadow-xl"
                >
                  Become a Sponsor
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.article>

            {/* ======================================================
                PARTNER
            ====================================================== */}

            <motion.article
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -8 }}
              className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[#8B4513]/20 bg-white shadow-lg transition-shadow duration-500 hover:shadow-2xl"
            >
              <div className="bg-[#8B4513] p-8 text-white">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                  <Globe2 className="h-7 w-7 text-[#D4A017]" />
                </div>

                <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-white/70">
                  Work together
                </p>

                <h3 className="mt-2 text-3xl font-bold">
                  Partner
                </h3>
              </div>

              <div className="flex flex-1 flex-col p-8">
                <p className="text-base leading-7 text-gray-600">
                  Partner with us to create sustainable impact through your
                  organization, church, school, business or personal network.
                </p>

                <ul className="mt-7 space-y-3">
                  {[
                    "Church and ministry partnerships",
                    "Schools and educational partnerships",
                    "Business and organizational partnerships",
                    "Individuals and community partners",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#D4A017]" />

                      <span className="text-sm leading-6 text-gray-600">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/dear-dad/get-involved?type=partner"
                  className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-[#8B4513] px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#4A1F0E] hover:shadow-xl"
                >
                  Become a Partner
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.article>
          </div>
        </div>
      </section>

      {/* ============================================================
          WHY YOUR SUPPORT MATTERS
      ============================================================ */}

      <section className="bg-[#2E1208] py-20 text-white sm:py-24 lg:py-28">
        <div className="container mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            {/* Left */}

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#D4A017]">
                Why it matters
              </p>

              <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                Your support can help change a family's story.
              </h2>

              <div className="mt-6 h-1 w-16 rounded-full bg-[#D4A017]" />

              <p className="mt-7 text-lg leading-8 text-white/70">
                Every father encouraged, every child reached and every
                family strengthened represents an opportunity to create
                lasting change.
              </p>

              <p className="mt-5 text-lg leading-8 text-white/70">
                We believe that meaningful transformation happens when
                people choose to stand together and invest in something
                bigger than themselves.
              </p>
            </motion.div>

            {/* Right */}

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="grid gap-5 sm:grid-cols-2"
            >
              {[
                {
                  icon: Users,
                  title: "Stronger Families",
                  text: "Encouraging healthy relationships between fathers, children and families.",
                },
                {
                  icon: Heart,
                  title: "Loved Children",
                  text: "Helping children experience affirmation, presence and positive guidance.",
                },
                {
                  icon: Building2,
                  title: "Stronger Communities",
                  text: "Working with communities to promote responsible fatherhood.",
                },
                {
                  icon: Globe2,
                  title: "Lasting Impact",
                  text: "Building partnerships that can extend the initiative's reach.",
                },
              ].map((item, index) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.08,
                    }}
                    className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D4A017] text-white">
                      <Icon className="h-5 w-5" />
                    </div>

                    <h3 className="mt-5 text-lg font-bold">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-white/60">
                      {item.text}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================================
          HOW TO PARTICIPATE
      ============================================================ */}

      <section className="py-20 sm:py-24 lg:py-28">
        <div className="container mx-auto px-5 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-3xl text-center"
          >
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#D4A017]">
              Simple steps
            </p>

            <h2 className="mt-3 text-3xl font-bold text-[#2E1208] sm:text-4xl">
              How you can get involved
            </h2>

            <p className="mt-5 leading-7 text-gray-600">
              Choose the way you would like to participate and our team can
              help you take the next step.
            </p>
          </motion.div>

          <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
            {[
              {
                number: "01",
                title: "Choose",
                text: "Decide whether you would like to donate, sponsor or partner.",
              },
              {
                number: "02",
                title: "Connect",
                text: "Tell us how you would like to support the Dear Dad Initiative.",
              },
              {
                number: "03",
                title: "Make an impact",
                text: "Together, we identify the best way to turn your support into meaningful action.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.number}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm"
              >
                <span className="text-4xl font-bold text-[#D4A017]">
                  {item.number}
                </span>

                <h3 className="mt-5 text-xl font-bold text-[#2E1208]">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          CONTACT / CTA
      ============================================================ */}

      <section className="bg-[#F7F7F5] py-20 sm:py-24">
        <div className="container mx-auto px-5 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-[#4A1F0E] shadow-2xl"
          >
            <div className="relative px-7 py-12 text-center sm:px-12 sm:py-16 lg:px-20">
              {/* Decorative circles */}

              <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#D4A017]/10 blur-2xl" />

              <div className="pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-white/5 blur-2xl" />

              <div className="relative z-10">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D4A017] text-white shadow-lg">
                  <HeartHandshake className="h-7 w-7" />
                </div>

                <p className="mt-6 text-sm font-bold uppercase tracking-[0.25em] text-[#D4A017]">
                  Let's make a difference together
                </p>

                <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                  Ready to support the Dear Dad Initiative?
                </h2>

                <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
                  Whether you want to donate, sponsor a specific need or
                  establish a partnership, we'd love to hear from you.
                </p>

                <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Link
                    to="/dear-dad/get-involved?type=donate"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#D4A017] px-7 py-3.5 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#B88900] hover:shadow-xl sm:w-auto"
                  >
                    <Gift className="h-4 w-4" />
                    Donate
                  </Link>

                  <Link
                    to="/dear-dad/get-involved?type=sponsor"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20 sm:w-auto"
                  >
                    <HandHeart className="h-4 w-4" />
                    Sponsor
                  </Link>

                  <Link
                    to="/dear-dad/get-involved?type=partner"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#D4A017]/50 px-7 py-3.5 text-sm font-bold text-[#D4A017] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#D4A017]/10 sm:w-auto"
                  >
                    <Globe2 className="h-4 w-4" />
                    Partner
                  </Link>
                </div>

                <div className="mx-auto mt-8 flex max-w-md items-center justify-center gap-2 text-sm text-white/50">
                  <Mail className="h-4 w-4" />
                  <span>
                    We welcome individuals, churches, schools,
                    organizations and businesses.
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================
          FINAL NAVIGATION
      ============================================================ */}

      <section className="border-t border-gray-200 py-10">
        <div className="container mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-5 sm:flex-row">
            <Link
              to="/dear-dad"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#8B4513] transition-colors hover:text-[#4A1F0E]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dear Dad Initiative
            </Link>

            <Link
              to="/dear-dad/get-involved"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#4A1F0E] transition-colors hover:text-[#8B4513]"
            >
              Contact us about getting involved
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}