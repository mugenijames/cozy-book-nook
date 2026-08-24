import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Heart,
  HeartHandshake,
  Handshake,
  Users,
  ShieldCheck,
  Sparkles,
  Target,
  Gift,
} from "lucide-react";

export default function DearDadInitiative() {
  return (
    <main className="min-h-screen bg-white">

      {/* ============================================================
          HERO
      ============================================================ */}

      <section className="relative overflow-hidden bg-[#2E1208] pt-28 text-white sm:pt-32 lg:pt-36">

        {/* Decorative elements */}

        <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#D4A017]/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#8B4513]/20 blur-3xl" />

        <div className="container relative z-10 mx-auto px-5 sm:px-6 lg:px-8">

          {/* Breadcrumb */}

          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10 flex flex-wrap items-center gap-2 text-sm text-white/60"
          >
            <Link
              to="/"
              className="transition-colors hover:text-[#D4A017]"
            >
              Home
            </Link>

            <span>/</span>

            <Link
              to="/#program"
              className="transition-colors hover:text-[#D4A017]"
            >
              Programs
            </Link>

            <span>/</span>

            <span className="text-white">
              Dear Dad Initiative
            </span>
          </motion.nav>

          <div className="grid items-center gap-14 pb-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 lg:pb-28">

            {/* Hero content */}

            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >

              <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-[#D4A017]/30 bg-white/5 px-4 py-2 backdrop-blur-sm">
                <Heart className="h-4 w-4 text-[#D4A017]" />

                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4A017]">
                  Dear Dad Initiative
                </span>
              </div>

              <h1 className="max-w-4xl text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
                Building fathers.
                <span className="block text-[#D4A017]">
                  Strengthening families.
                </span>
                <span className="block">
                  Shaping generations.
                </span>
              </h1>

              <div className="mt-8 h-1 w-24 rounded-full bg-[#D4A017]" />

              <p className="mt-8 max-w-2xl text-lg leading-8 text-white/70 sm:text-xl">
                The Dear Dad Initiative is committed to encouraging
                responsible fatherhood, strengthening families, mentoring
                young people and creating communities where fathers are
                present, intentional and equipped to lead.
              </p>

              {/* CTA */}

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">

                <Link
                  to="/dear-dad/get-involved"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#D4A017] px-7 py-4 text-sm font-bold text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-[#B88900] hover:shadow-2xl sm:text-base"
                >
                  Donate / Sponsor / Partner
                  <ArrowRight className="h-5 w-5" />
                </Link>

                <a
                  href="#about"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-4 text-sm font-bold text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 sm:text-base"
                >
                  Learn About the Initiative
                  <ArrowDown className="h-4 w-4" />
                </a>

              </div>

            </motion.div>

            {/* Hero visual */}

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9 }}
              className="relative"
            >

              <div className="absolute -bottom-5 -left-5 h-full w-full rounded-[2rem] border border-[#D4A017]/30" />

              <div className="relative overflow-hidden rounded-[2rem] bg-[#4A1F0E] shadow-2xl">

                <img
                  src="/images/dear-dad-initiative.jpg"
                  alt="Dear Dad Initiative"
                  className="aspect-[4/5] w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#2E1208] via-transparent to-transparent" />

                <div className="absolute bottom-7 left-7 right-7">

                  <div className="rounded-2xl border border-white/10 bg-black/30 p-5 backdrop-blur-md">

                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4A017]">
                      Our vision
                    </p>

                    <p className="mt-2 text-lg font-semibold leading-7 text-white">
                      Every child deserves the opportunity to experience
                      intentional guidance, love and positive fatherhood.
                    </p>

                  </div>

                </div>

              </div>

            </motion.div>

          </div>
        </div>
      </section>

      {/* ============================================================
          ABOUT
      ============================================================ */}

      <section
        id="about"
        className="scroll-mt-24 py-20 sm:py-24 lg:py-32"
      >

        <div className="container mx-auto px-5 sm:px-6 lg:px-8">

          <div className="grid gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">

            {/* Main text */}

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7 }}
            >

              <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#D4A017]">
                Why Dear Dad?
              </p>

              <h2 className="mt-3 text-4xl font-bold leading-tight text-[#2E1208] sm:text-5xl">
                A father’s presence can change a generation.
              </h2>

              <div className="mt-7 h-1 w-20 rounded-full bg-[#D4A017]" />

              <p className="mt-7 text-lg leading-8 text-gray-600">
                Fatherhood is more than providing for a family. It is about
                presence, responsibility, guidance, affirmation, discipline,
                love and intentionally investing in the lives of the next
                generation.
              </p>

              <p className="mt-6 text-lg leading-8 text-gray-600">
                The Dear Dad Initiative seeks to create spaces where fathers,
                father figures, mentors and communities can come together to
                strengthen families and help young people discover their
                identity, potential and purpose.
              </p>

              <p className="mt-6 text-lg leading-8 text-gray-600">
                We believe that when fathers are equipped and encouraged to
                lead intentionally, families become stronger and communities
                become healthier.
              </p>

            </motion.div>

            {/* Side card */}

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="rounded-[2rem] bg-[#F7F7F5] p-8 sm:p-10"
            >

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D4A017] text-white shadow-lg">
                <Target className="h-7 w-7" />
              </div>

              <h3 className="mt-6 text-2xl font-bold text-[#2E1208]">
                Our mission
              </h3>

              <p className="mt-4 leading-7 text-gray-600">
                To inspire, equip and connect fathers and father figures to
                intentionally invest in their families and the next
                generation.
              </p>

              <div className="mt-8 space-y-4">

                {[
                  "Promote intentional fatherhood",
                  "Mentor boys and young men",
                  "Strengthen families",
                  "Build supportive communities",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3"
                  >
                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#D4A017]" />

                    <span className="text-sm leading-6 text-gray-600">
                      {item}
                    </span>
                  </div>
                ))}

              </div>

            </motion.div>

          </div>
        </div>
      </section>

      {/* ============================================================
          WHAT WE DO
      ============================================================ */}

      <section className="bg-[#F7F7F5] py-20 sm:py-24 lg:py-32">

        <div className="container mx-auto px-5 sm:px-6 lg:px-8">

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-3xl text-center"
          >

            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#D4A017]">
              What we do
            </p>

            <h2 className="mt-3 text-4xl font-bold text-[#2E1208] sm:text-5xl">
              Turning fatherhood into intentional action.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-600">
              Through mentorship, conversations, community initiatives and
              practical support, we seek to create meaningful impact.
            </p>

          </motion.div>

          <div className="mx-auto mt-14 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4">

            {[
              {
                icon: Users,
                title: "Fatherhood Mentorship",
                description:
                  "Equipping fathers and father figures with practical tools for intentional parenting and leadership.",
              },
              {
                icon: Sparkles,
                title: "Boys & Young Men",
                description:
                  "Creating mentorship opportunities that help boys grow into responsible, confident and purposeful men.",
              },
              {
                icon: HeartHandshake,
                title: "Family Strengthening",
                description:
                  "Promoting conversations and activities that encourage healthier relationships and stronger families.",
              },
              {
                icon: Handshake,
                title: "Community Outreach",
                description:
                  "Taking fatherhood conversations and practical support into communities where they are needed most.",
              },
            ].map((item, index) => {

              const Icon = item.icon;

              return (
                <motion.article
                  key={item.title}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                  }}
                  whileHover={{ y: -7 }}
                  className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm transition-shadow duration-300 hover:shadow-xl"
                >

                  <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-[#D4A017]/10 text-[#8B4513]">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="mt-6 text-xl font-bold text-[#2E1208]">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-gray-600">
                    {item.description}
                  </p>

                </motion.article>
              );
            })}

          </div>
        </div>
      </section>

      {/* ============================================================
          VALUES
      ============================================================ */}

      <section className="bg-[#2E1208] py-20 text-white sm:py-24 lg:py-32">

        <div className="container mx-auto px-5 sm:px-6 lg:px-8">

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-3xl text-center"
          >

            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#D4A017]">
              What we believe
            </p>

            <h2 className="mt-4 text-4xl font-bold sm:text-5xl">
              Fatherhood is more than a title.
            </h2>

          </motion.div>

          <div className="mx-auto mt-14 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-5">

            {[
              "Presence",
              "Responsibility",
              "Guidance",
              "Love",
              "Legacy",
            ].map((value, index) => (
              <motion.div
                key={value}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.08,
                }}
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-8 text-center backdrop-blur-sm"
              >
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#D4A017] text-sm font-bold">
                  {index + 1}
                </div>

                <h3 className="mt-5 text-lg font-bold">
                  {value}
                </h3>
              </motion.div>
            ))}

          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mx-auto mt-14 max-w-3xl text-center text-xl font-medium leading-8 text-white/70"
          >
            "The investment we make in fathers today can shape the families,
            communities and generations of tomorrow."
          </motion.p>

        </div>
      </section>

      {/* ============================================================
          GET INVOLVED CTA
      ============================================================ */}

      <section className="bg-[#F7F7F5] py-20 sm:py-24 lg:py-32">

        <div className="container mx-auto px-5 sm:px-6 lg:px-8">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-[#4A1F0E] px-7 py-14 text-center shadow-2xl sm:px-12 sm:py-20"
          >

            {/* Decorations */}

            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#D4A017]/20 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-black/20 blur-3xl" />

            <div className="relative z-10">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D4A017] text-white shadow-xl">
                <Gift className="h-8 w-8" />
              </div>

              <p className="mt-7 text-sm font-bold uppercase tracking-[0.25em] text-[#D4A017]">
                Get involved
              </p>

              <h2 className="mt-4 text-4xl font-bold text-white sm:text-5xl">
                Don't just believe in the next generation.
              </h2>

              <h3 className="mt-3 text-3xl font-bold text-[#D4A017] sm:text-4xl">
                Invest in it.
              </h3>

              <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
                Your support can help us reach more fathers, mentor more
                young people and strengthen more families.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">

                {/* WORKING CTA */}

                <Link
                  to="/dear-dad/get-involved"
                  className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#D4A017] px-8 py-4 text-base font-bold text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-[#B88900] hover:shadow-2xl sm:w-auto"
                >
                  Donate / Sponsor / Partner

                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                <Link
                  to="/#program"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-base font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 sm:w-auto"
                >
                  <ArrowLeft className="h-4 w-4" />

                  Explore Other Programs
                </Link>

              </div>

            </div>
          </motion.div>

        </div>
      </section>

    </main>
  );
}