import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Gift,
  Handshake,
  HeartHandshake,
  Loader2,
  MessageCircle,
  Send,
  Users,
} from "lucide-react";

type SupportType = "donation" | "sponsor" | "partner";

export default function DearDadGetInvolved() {
  const [supportType, setSupportType] =
    useState<SupportType>("donation");

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    message: "",
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);

    try {
      /*
       * IMPORTANT:
       * Replace this URL with your actual backend endpoint
       * once the backend route is ready.
       */

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/inquiries`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            phone: form.phone,
            organization: form.organization,
            subject: `Dear Dad Initiative - ${supportType}`,
            message: form.message,
            type: supportType,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit inquiry");
      }

      setSubmitted(true);

      setForm({
        name: "",
        email: "",
        phone: "",
        organization: "",
        message: "",
      });

    } catch (error) {
      console.error(error);

      /*
       * For now, we still show the form rather than pretending
       * that the request succeeded.
       */
      alert(
        "We could not submit your request right now. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F7F5] px-5 pt-24">

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="w-full max-w-2xl rounded-[2rem] bg-white p-8 text-center shadow-xl sm:p-12"
        >

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>

          <h1 className="mt-7 text-3xl font-bold text-[#2E1208] sm:text-4xl">
            Thank You!
          </h1>

          <p className="mx-auto mt-5 max-w-lg leading-7 text-gray-600">
            Thank you for your interest in supporting the Dear Dad
            Initiative. Our team will review your request and get back to
            you.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

            <Link
              to="/dear-dad"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#4A1F0E] px-7 py-3.5 font-bold text-white transition hover:bg-[#2E1208]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dear Dad
            </Link>

            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 px-7 py-3.5 font-bold text-[#4A1F0E] transition hover:bg-gray-50"
            >
              Send Another Request
            </button>

          </div>

        </motion.div>

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F7F5] pt-24">

      {/* ============================================================
          HEADER
      ============================================================ */}

      <section className="bg-[#2E1208] py-16 text-white sm:py-20">

        <div className="container mx-auto px-5 sm:px-6 lg:px-8">

          <Link
            to="/dear-dad"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/60 transition hover:text-[#D4A017]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dear Dad Initiative
          </Link>

          <div className="mt-10 max-w-3xl">

            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#D4A017]">
              Get involved
            </p>

            <h1 className="mt-4 text-4xl font-bold sm:text-5xl lg:text-6xl">
              Help us build stronger fathers and stronger families.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
              Whether you would like to donate, sponsor an activity or
              partner with the Dear Dad Initiative, we would love to hear
              from you.
            </p>

          </div>

        </div>
      </section>

      {/* ============================================================
          SUPPORT OPTIONS
      ============================================================ */}

      <section className="py-16 sm:py-20">

        <div className="container mx-auto px-5 sm:px-6 lg:px-8">

          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">

            {[
              {
                type: "donation" as SupportType,
                icon: Gift,
                title: "Donate",
                description:
                  "Make a contribution toward mentorship, outreach and Dear Dad activities.",
              },
              {
                type: "sponsor" as SupportType,
                icon: HeartHandshake,
                title: "Sponsor",
                description:
                  "Support a specific event, activity, mentorship program or community initiative.",
              },
              {
                type: "partner" as SupportType,
                icon: Handshake,
                title: "Partner",
                description:
                  "Partner with us through your church, organization, business or community.",
              },
            ].map((option) => {

              const Icon = option.icon;

              const active = supportType === option.type;

              return (
                <button
                  key={option.type}
                  type="button"
                  onClick={() => setSupportType(option.type)}
                  className={`group rounded-3xl border p-7 text-left transition-all duration-300 ${
                    active
                      ? "border-[#D4A017] bg-white shadow-xl ring-2 ring-[#D4A017]/20"
                      : "border-gray-200 bg-white hover:-translate-y-1 hover:shadow-lg"
                  }`}
                >

                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl transition ${
                      active
                        ? "bg-[#D4A017] text-white"
                        : "bg-[#D4A017]/10 text-[#8B4513]"
                    }`}
                  >
                    <Icon className="h-7 w-7" />
                  </div>

                  <h2 className="mt-6 text-2xl font-bold text-[#2E1208]">
                    {option.title}
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-gray-600">
                    {option.description}
                  </p>

                  <span
                    className={`mt-5 inline-flex items-center gap-2 text-sm font-bold ${
                      active
                        ? "text-[#8B4513]"
                        : "text-gray-400"
                    }`}
                  >
                    {active ? "Selected" : "Choose this option"}

                    <ArrowRight className="h-4 w-4" />
                  </span>

                </button>
              );
            })}

          </div>

          {/* ========================================================
              FORM
          ======================================================== */}

          <div className="mx-auto mt-12 grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">

            {/* Information */}

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-3xl bg-[#4A1F0E] p-8 text-white sm:p-10"
            >

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D4A017]">
                {supportType === "donation" && (
                  <Gift className="h-7 w-7" />
                )}

                {supportType === "sponsor" && (
                  <HeartHandshake className="h-7 w-7" />
                )}

                {supportType === "partner" && (
                  <Handshake className="h-7 w-7" />
                )}
              </div>

              <h2 className="mt-7 text-3xl font-bold">
                {supportType === "donation" &&
                  "I'd like to donate"}

                {supportType === "sponsor" &&
                  "I'd like to sponsor"}

                {supportType === "partner" &&
                  "I'd like to partner"}
              </h2>

              <p className="mt-5 leading-7 text-white/70">
                Thank you for considering supporting the Dear Dad
                Initiative. Complete the form and our team will contact
                you with the next steps.
              </p>

              <div className="mt-8 space-y-4">

                <div className="flex gap-3">
                  <Users className="mt-1 h-5 w-5 shrink-0 text-[#D4A017]" />

                  <span className="text-sm leading-6 text-white/70">
                    Help reach and equip more fathers.
                  </span>
                </div>

                <div className="flex gap-3">
                  <HeartHandshake className="mt-1 h-5 w-5 shrink-0 text-[#D4A017]" />

                  <span className="text-sm leading-6 text-white/70">
                    Help mentor the next generation.
                  </span>
                </div>

                <div className="flex gap-3">
                  <Handshake className="mt-1 h-5 w-5 shrink-0 text-[#D4A017]" />

                  <span className="text-sm leading-6 text-white/70">
                    Help build stronger communities.
                  </span>
                </div>

              </div>

            </motion.div>

            {/* Form */}

            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-3xl bg-white p-7 shadow-xl sm:p-10"
            >

              <div className="grid gap-6 sm:grid-cols-2">

                {/* Name */}

                <div>
                  <label
                    htmlFor="name"
                    className="text-sm font-bold text-[#2E1208]"
                  >
                    Full Name *
                  </label>

                  <input
                    id="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        name: event.target.value,
                      })
                    }
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:border-[#D4A017] focus:bg-white focus:ring-2 focus:ring-[#D4A017]/20"
                    placeholder="Your full name"
                  />
                </div>

                {/* Email */}

                <div>
                  <label
                    htmlFor="email"
                    className="text-sm font-bold text-[#2E1208]"
                  >
                    Email Address *
                  </label>

                  <input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        email: event.target.value,
                      })
                    }
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:border-[#D4A017] focus:bg-white focus:ring-2 focus:ring-[#D4A017]/20"
                    placeholder="you@example.com"
                  />
                </div>

                {/* Phone */}

                <div>
                  <label
                    htmlFor="phone"
                    className="text-sm font-bold text-[#2E1208]"
                  >
                    Phone Number
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        phone: event.target.value,
                      })
                    }
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:border-[#D4A017] focus:bg-white focus:ring-2 focus:ring-[#D4A017]/20"
                    placeholder="+254..."
                  />
                </div>

                {/* Organization */}

                <div>
                  <label
                    htmlFor="organization"
                    className="text-sm font-bold text-[#2E1208]"
                  >
                    Organization / Church
                  </label>

                  <input
                    id="organization"
                    type="text"
                    value={form.organization}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        organization: event.target.value,
                      })
                    }
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:border-[#D4A017] focus:bg-white focus:ring-2 focus:ring-[#D4A017]/20"
                    placeholder="Optional"
                  />
                </div>

              </div>

              {/* Message */}

              <div className="mt-6">

                <label
                  htmlFor="message"
                  className="text-sm font-bold text-[#2E1208]"
                >
                  Message *
                </label>

                <textarea
                  id="message"
                  required
                  rows={6}
                  value={form.message}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      message: event.target.value,
                    })
                  }
                  className="mt-2 w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:border-[#D4A017] focus:bg-white focus:ring-2 focus:ring-[#D4A017]/20"
                  placeholder={
                    supportType === "donation"
                      ? "Tell us how you would like to support the initiative..."
                      : supportType === "sponsor"
                        ? "Tell us what you would like to sponsor..."
                        : "Tell us how you would like to partner with us..."
                  }
                />

              </div>

              {/* Submit */}

              <button
                type="submit"
                disabled={loading}
                className="mt-7 inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#4A1F0E] px-7 py-4 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#2E1208] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
              >

                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Send My Request
                  </>
                )}

              </button>

              <p className="mt-4 text-center text-xs leading-5 text-gray-500">
                Your information will only be used to respond to your
                Dear Dad Initiative inquiry.
              </p>

            </motion.form>

          </div>
        </div>
      </section>

      {/* ============================================================
          CONTACT NOTE
      ============================================================ */}

      <section className="pb-20 sm:pb-24">

        <div className="container mx-auto px-5 sm:px-6 lg:px-8">

          <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-6 rounded-3xl border border-gray-200 bg-white p-7 text-center shadow-sm sm:flex-row sm:text-left">

            <div>

              <div className="flex items-center justify-center gap-3 sm:justify-start">
                <MessageCircle className="h-5 w-5 text-[#D4A017]" />

                <h3 className="font-bold text-[#2E1208]">
                  Have a question?
                </h3>
              </div>

              <p className="mt-2 text-sm text-gray-600">
                Send us a message and our team will be happy to assist.
              </p>

            </div>

            <Link
              to="/#contact"
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#4A1F0E] px-6 py-3 text-sm font-bold text-[#4A1F0E] transition hover:bg-[#4A1F0E] hover:text-white"
            >
              Contact Us
              <ArrowRight className="h-4 w-4" />
            </Link>

          </div>

        </div>
      </section>

    </main>
  );
}