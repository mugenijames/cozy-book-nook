import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic2,
  Users,
  HeartHandshake,
  X,
  Send,
  Loader2,
  CheckCircle2,
  CalendarDays,
  MapPin,
  UserRound,
  Mail,
  Phone,
  MessageSquare,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type SpeakingRequest = {
  name: string;
  email: string;
  phone?: string;
  program?: string;
  preferredDate?: string;
  location?: string;
  message?: string;
};

const SPEAKING_TOPICS = [
  {
    icon: HeartHandshake,
    title: "Healing & Emotional Wellness",
    description:
      "Conversations that encourage healing, resilience, emotional growth, and healthy relationships.",
  },
  {
    icon: Users,
    title: "Leadership & Personal Development",
    description:
      "Practical insights that equip individuals and leaders to grow, lead effectively, and create impact.",
  },
  {
    icon: Mic2,
    title: "Purpose, Identity & Calling",
    description:
      "Helping people understand who they are, discover their purpose, and confidently pursue their calling.",
  },
];

export default function Speaking() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<SpeakingRequest>({
    name: "",
    email: "",
    phone: "",
    program: "",
    preferredDate: "",
    location: "",
    message: "",
  });

  /**
   * Allows Hero.tsx or any other component to open
   * the speaking dialog without duplicating the form.
   */
  useEffect(() => {
    const handleOpenSpeakingDialog = () => {
      setSubmitted(false);
      setOpen(true);
    };

    window.addEventListener(
      "open-speaking-dialog",
      handleOpenSpeakingDialog
    );

    return () => {
      window.removeEventListener(
        "open-speaking-dialog",
        handleOpenSpeakingDialog
      );
    };
  }, []);

  const updateField = (
    field: keyof SpeakingRequest,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      program: "",
      preferredDate: "",
      location: "",
      message: "",
    });

    setSubmitted(false);
  };

  const closeDialog = () => {
    if (loading) return;

    setOpen(false);

    setTimeout(() => {
      resetForm();
    }, 300);
  };

  const submitRequest = async () => {
    if (!form.name.trim()) {
      alert("Please enter your name.");
      return;
    }

    if (!form.email.trim()) {
      alert("Please enter your email address.");
      return;
    }

    if (!form.program?.trim()) {
      alert("Please tell us what you are inviting David to speak about.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Failed to submit speaking request");
      }

      setSubmitted(true);
    } catch (error) {
      console.error("Speaking request error:", error);

      alert(
        "We couldn't send your request right now. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* =========================================================
          SPEAKING SECTION
      ========================================================== */}

      <section
        id="speaking"
        className="
          relative
          overflow-hidden
          bg-[#F7F4EF]
          py-16
          sm:py-20
          lg:py-24
        "
      >
        {/* Decorative background */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className="
              absolute
              -right-32
              -top-32
              h-72
              w-72
              rounded-full
              bg-[#C08A43]/10
              blur-3xl
            "
          />

          <div
            className="
              absolute
              -bottom-32
              -left-32
              h-72
              w-72
              rounded-full
              bg-[#4A1F0E]/5
              blur-3xl
            "
          />
        </div>

        <div
          className="
            relative
            z-10
            mx-auto
            max-w-7xl
            px-4
            sm:px-6
            lg:px-8
          "
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-3xl text-center"
          >
            <span
              className="
                text-sm
                font-semibold
                uppercase
                tracking-[4px]
                text-[#C08A43]
              "
            >
              Speaking & Engagements
            </span>

            <h2
              className="
                mt-4
                text-3xl
                font-bold
                leading-tight
                text-[#3B2314]
                sm:text-4xl
                lg:text-5xl
              "
            >
              Conversations That
              <span className="block text-[#C08A43]">
                Create Transformation.
              </span>
            </h2>

            <p
              className="
                mx-auto
                mt-5
                max-w-2xl
                text-sm
                leading-7
                text-gray-600
                sm:text-base
                sm:leading-8
              "
            >
              Invite David Emuria to inspire, equip, and challenge
              your audience through meaningful conversations around
              healing, leadership, identity, purpose, and
              transformation.
            </p>
          </motion.div>

          {/* Speaking topics */}
          <div
            className="
              mx-auto
              mt-12
              grid
              max-w-6xl
              gap-5
              md:grid-cols-3
            "
          >
            {SPEAKING_TOPICS.map((topic, index) => {
              const Icon = topic.icon;

              return (
                <motion.div
                  key={topic.title}
                  initial={{
                    opacity: 0,
                    y: 30,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.12,
                  }}
                  className="
                    rounded-2xl
                    border
                    border-[#E6DED5]
                    bg-white
                    p-6
                    shadow-sm
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:shadow-xl
                  "
                >
                  <div
                    className="
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-xl
                      bg-[#4A1F0E]
                      text-[#D4A017]
                    "
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3
                    className="
                      mt-5
                      text-lg
                      font-bold
                      text-[#3B2314]
                    "
                  >
                    {topic.title}
                  </h3>

                  <p
                    className="
                      mt-3
                      text-sm
                      leading-6
                      text-gray-600
                    "
                  >
                    {topic.description}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* CTA */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{ once: true }}
            transition={{
              duration: 0.7,
              delay: 0.2,
            }}
            className="mt-12 flex justify-center"
          >
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setOpen(true);
              }}
              className="
                group
                inline-flex
                min-h-[52px]
                w-full
                max-w-xs
                items-center
                justify-center
                gap-2
                rounded-full
                bg-[#4A1F0E]
                px-7
                py-3
                text-sm
                font-semibold
                text-white
                shadow-lg
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-[#321509]
                hover:shadow-xl
                active:scale-[0.98]
                sm:w-auto
                sm:max-w-none
              "
            >
              <Mic2 className="h-4 w-4" />

              <span>Invite David to Speak</span>

              <span
                className="
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              >
                →
              </span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* =========================================================
          SPEAKING BOOKING DIALOG
      ========================================================== */}

      <Dialog
        open={open}
        onOpenChange={(value) => {
          if (!value) {
            closeDialog();
          } else {
            setOpen(true);
          }
        }}
      >
        <DialogContent
          className="
            max-h-[92vh]
            w-[calc(100%-1.5rem)]
            max-w-2xl
            overflow-y-auto
            rounded-2xl
            border-0
            bg-[#FAF8F5]
            p-0
            shadow-2xl
            sm:w-[calc(100%-3rem)]
          "
        >
          {/* Top accent */}
          <div className="h-1.5 w-full bg-[#C08A43]" />

          <div className="p-5 sm:p-7 lg:p-8">
            <DialogHeader className="text-left">
              <div
                className="
                  mb-4
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#4A1F0E]
                  text-[#D4A017]
                "
              >
                <Mic2 className="h-5 w-5" />
              </div>

              <DialogTitle
                className="
                  text-2xl
                  font-bold
                  text-[#3B2314]
                  sm:text-3xl
                "
              >
                Book David to Speak
              </DialogTitle>

              <DialogDescription
                className="
                  mt-2
                  max-w-xl
                  text-sm
                  leading-6
                  text-gray-600
                "
              >
                Tell us a little about your event and the kind of
                conversation you would like David to bring to your
                audience.
              </DialogDescription>
            </DialogHeader>

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{
                    opacity: 0,
                    scale: 0.96,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.96,
                  }}
                  className="
                    py-10
                    text-center
                  "
                >
                  <div
                    className="
                      mx-auto
                      flex
                      h-16
                      w-16
                      items-center
                      justify-center
                      rounded-full
                      bg-[#E9F5EA]
                      text-green-700
                    "
                  >
                    <CheckCircle2 className="h-8 w-8" />
                  </div>

                  <h3
                    className="
                      mt-5
                      text-2xl
                      font-bold
                      text-[#3B2314]
                    "
                  >
                    Request Received
                  </h3>

                  <p
                    className="
                      mx-auto
                      mt-3
                      max-w-md
                      text-sm
                      leading-6
                      text-gray-600
                    "
                  >
                    Thank you for reaching out. Your speaking
                    request has been submitted successfully.
                  </p>

                  <button
                    type="button"
                    onClick={closeDialog}
                    className="
                      mt-7
                      rounded-full
                      bg-[#4A1F0E]
                      px-7
                      py-3
                      text-sm
                      font-semibold
                      text-white
                      transition
                      hover:bg-[#321509]
                    "
                  >
                    Done
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -10,
                  }}
                  className="mt-7"
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    {/* Name */}
                    <div className="sm:col-span-1">
                      <label
                        htmlFor="speaker-name"
                        className="mb-2 block text-sm font-semibold text-[#3B2314]"
                      >
                        Your Name *
                      </label>

                      <div className="relative">
                        <UserRound
                          className="
                            absolute
                            left-3
                            top-1/2
                            h-4
                            w-4
                            -translate-y-1/2
                            text-gray-400
                          "
                        />

                        <input
                          id="speaker-name"
                          type="text"
                          value={form.name}
                          onChange={(e) =>
                            updateField("name", e.target.value)
                          }
                          placeholder="Your full name"
                          className="
                            h-11
                            w-full
                            rounded-xl
                            border
                            border-[#DED6CE]
                            bg-white
                            pl-10
                            pr-4
                            text-sm
                            text-[#3B2314]
                            outline-none
                            transition
                            placeholder:text-gray-400
                            focus:border-[#C08A43]
                            focus:ring-2
                            focus:ring-[#C08A43]/20
                          "
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label
                        htmlFor="speaker-email"
                        className="mb-2 block text-sm font-semibold text-[#3B2314]"
                      >
                        Email Address *
                      </label>

                      <div className="relative">
                        <Mail
                          className="
                            absolute
                            left-3
                            top-1/2
                            h-4
                            w-4
                            -translate-y-1/2
                            text-gray-400
                          "
                        />

                        <input
                          id="speaker-email"
                          type="email"
                          value={form.email}
                          onChange={(e) =>
                            updateField("email", e.target.value)
                          }
                          placeholder="you@example.com"
                          className="
                            h-11
                            w-full
                            rounded-xl
                            border
                            border-[#DED6CE]
                            bg-white
                            pl-10
                            pr-4
                            text-sm
                            text-[#3B2314]
                            outline-none
                            transition
                            placeholder:text-gray-400
                            focus:border-[#C08A43]
                            focus:ring-2
                            focus:ring-[#C08A43]/20
                          "
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label
                        htmlFor="speaker-phone"
                        className="mb-2 block text-sm font-semibold text-[#3B2314]"
                      >
                        Phone Number
                      </label>

                      <div className="relative">
                        <Phone
                          className="
                            absolute
                            left-3
                            top-1/2
                            h-4
                            w-4
                            -translate-y-1/2
                            text-gray-400
                          "
                        />

                        <input
                          id="speaker-phone"
                          type="tel"
                          value={form.phone}
                          onChange={(e) =>
                            updateField("phone", e.target.value)
                          }
                          placeholder="+254..."
                          className="
                            h-11
                            w-full
                            rounded-xl
                            border
                            border-[#DED6CE]
                            bg-white
                            pl-10
                            pr-4
                            text-sm
                            text-[#3B2314]
                            outline-none
                            transition
                            placeholder:text-gray-400
                            focus:border-[#C08A43]
                            focus:ring-2
                            focus:ring-[#C08A43]/20
                          "
                        />
                      </div>
                    </div>

                    {/* Program */}
                    <div>
                      <label
                        htmlFor="speaker-program"
                        className="mb-2 block text-sm font-semibold text-[#3B2314]"
                      >
                        Event / Program *
                      </label>

                      <div className="relative">
                        <Mic2
                          className="
                            absolute
                            left-3
                            top-1/2
                            h-4
                            w-4
                            -translate-y-1/2
                            text-gray-400
                          "
                        />

                        <input
                          id="speaker-program"
                          type="text"
                          value={form.program}
                          onChange={(e) =>
                            updateField("program", e.target.value)
                          }
                          placeholder="e.g. Leadership Conference"
                          className="
                            h-11
                            w-full
                            rounded-xl
                            border
                            border-[#DED6CE]
                            bg-white
                            pl-10
                            pr-4
                            text-sm
                            text-[#3B2314]
                            outline-none
                            transition
                            placeholder:text-gray-400
                            focus:border-[#C08A43]
                            focus:ring-2
                            focus:ring-[#C08A43]/20
                          "
                        />
                      </div>
                    </div>

                    {/* Date */}
                    <div>
                      <label
                        htmlFor="speaker-date"
                        className="mb-2 block text-sm font-semibold text-[#3B2314]"
                      >
                        Preferred Date
                      </label>

                      <div className="relative">
                        <CalendarDays
                          className="
                            absolute
                            left-3
                            top-1/2
                            h-4
                            w-4
                            -translate-y-1/2
                            text-gray-400
                          "
                        />

                        <input
                          id="speaker-date"
                          type="date"
                          value={form.preferredDate}
                          onChange={(e) =>
                            updateField(
                              "preferredDate",
                              e.target.value
                            )
                          }
                          className="
                            h-11
                            w-full
                            rounded-xl
                            border
                            border-[#DED6CE]
                            bg-white
                            pl-10
                            pr-4
                            text-sm
                            text-[#3B2314]
                            outline-none
                            transition
                            focus:border-[#C08A43]
                            focus:ring-2
                            focus:ring-[#C08A43]/20
                          "
                        />
                      </div>
                    </div>

                    {/* Location */}
                    <div>
                      <label
                        htmlFor="speaker-location"
                        className="mb-2 block text-sm font-semibold text-[#3B2314]"
                      >
                        Event Location
                      </label>

                      <div className="relative">
                        <MapPin
                          className="
                            absolute
                            left-3
                            top-1/2
                            h-4
                            w-4
                            -translate-y-1/2
                            text-gray-400
                          "
                        />

                        <input
                          id="speaker-location"
                          type="text"
                          value={form.location}
                          onChange={(e) =>
                            updateField("location", e.target.value)
                          }
                          placeholder="City / Venue"
                          className="
                            h-11
                            w-full
                            rounded-xl
                            border
                            border-[#DED6CE]
                            bg-white
                            pl-10
                            pr-4
                            text-sm
                            text-[#3B2314]
                            outline-none
                            transition
                            placeholder:text-gray-400
                            focus:border-[#C08A43]
                            focus:ring-2
                            focus:ring-[#C08A43]/20
                          "
                        />
                      </div>
                    </div>

                    {/* Message */}
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="speaker-message"
                        className="mb-2 block text-sm font-semibold text-[#3B2314]"
                      >
                        Tell Us More
                      </label>

                      <div className="relative">
                        <MessageSquare
                          className="
                            absolute
                            left-3
                            top-3
                            h-4
                            w-4
                            text-gray-400
                          "
                        />

                        <textarea
                          id="speaker-message"
                          rows={4}
                          value={form.message}
                          onChange={(e) =>
                            updateField("message", e.target.value)
                          }
                          placeholder="Tell us about your event, audience and what you would like David to speak about..."
                          className="
                            w-full
                            resize-none
                            rounded-xl
                            border
                            border-[#DED6CE]
                            bg-white
                            py-3
                            pl-10
                            pr-4
                            text-sm
                            leading-6
                            text-[#3B2314]
                            outline-none
                            transition
                            placeholder:text-gray-400
                            focus:border-[#C08A43]
                            focus:ring-2
                            focus:ring-[#C08A43]/20
                          "
                        />
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div
                    className="
                      mt-7
                      flex
                      flex-col-reverse
                      gap-3
                      border-t
                      border-[#E6DED5]
                      pt-6
                      sm:flex-row
                      sm:justify-end
                    "
                  >
                    <button
                      type="button"
                      onClick={closeDialog}
                      disabled={loading}
                      className="
                        inline-flex
                        min-h-[46px]
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-[#D8CEC5]
                        px-6
                        text-sm
                        font-semibold
                        text-[#4A1F0E]
                        transition
                        hover:bg-white
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={submitRequest}
                      disabled={loading}
                      className="
                        inline-flex
                        min-h-[46px]
                        items-center
                        justify-center
                        gap-2
                        rounded-full
                        bg-[#4A1F0E]
                        px-7
                        text-sm
                        font-semibold
                        text-white
                        shadow-md
                        transition-all
                        hover:-translate-y-0.5
                        hover:bg-[#321509]
                        hover:shadow-lg
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                      "
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Send Booking Request
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}