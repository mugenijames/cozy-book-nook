import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic2,
  Users,
  HeartHandshake,
  Loader2,
  Send,
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

/* =========================================================
   TYPES
========================================================= */

type SpeakingRequest = {
  name: string;
  email: string;
  phone?: string;
  program?: string;
  preferredDate?: string;
  location?: string;
  message?: string;
};

/* =========================================================
   API CONFIGURATION
========================================================= */

const getApiBaseUrl = (): string => {
  const configured =
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_URL;

  /*
   * DEVELOPMENT
   */
  if (import.meta.env.DEV) {
    const base =
      configured || "http://localhost:5000";

    return base.endsWith("/api")
      ? base
      : `${base}/api`;
  }

  /*
   * PRODUCTION
   */
  const base =
    configured ||
    "https://cozy-book-nook-1.onrender.com";

  return base.endsWith("/api")
    ? base
    : `${base}/api`;
};

const API_BASE_URL = getApiBaseUrl();

console.log(
  "📡 Speaking API Base URL:",
  API_BASE_URL
);

/* =========================================================
   SPEAKING TOPICS
========================================================= */

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

/* =========================================================
   COMPONENT
========================================================= */

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

  /* =========================================================
     OPEN EVENT LISTENER
  ========================================================= */

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

  /* =========================================================
     UPDATE FIELD
  ========================================================= */

  const updateField = (
    field: keyof SpeakingRequest,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /* =========================================================
     RESET FORM
  ========================================================= */

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

  /* =========================================================
     CLOSE DIALOG
  ========================================================= */

  const closeDialog = () => {
    if (loading) return;

    setOpen(false);

    setTimeout(() => {
      resetForm();
    }, 300);
  };

  /* =========================================================
     SUBMIT SPEAKING REQUEST
  ========================================================= */

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
      alert(
        "Please tell us what you are inviting David to speak about."
      );
      return;
    }

    setLoading(true);

    try {
      /*
       * IMPORTANT:
       *
       * Do NOT use:
       *
       * fetch("/api/invite")
       *
       * because that sends the request to the Vite
       * frontend server on port 8080.
       *
       * Our backend is running on port 5000.
       */

      const endpoint =
        `${API_BASE_URL}/invite`;

      console.log(
        "📨 Submitting speaking request:",
        {
          endpoint,
          form,
        }
      );

      const response = await fetch(
        endpoint,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: form.name.trim(),
            email: form.email.trim().toLowerCase(),
            phone: form.phone?.trim() || "",
            program: form.program?.trim() || "",
            date: form.preferredDate || "",
            location: form.location?.trim() || "",
            message: form.message?.trim() || "",
          }),
        }
      );

      const contentType =
        response.headers.get(
          "content-type"
        );

      let data: any = null;

      if (
        contentType?.includes(
          "application/json"
        )
      ) {
        data = await response.json();
      } else {
        const text =
          await response.text();

        data = {
          error:
            text ||
            "The server returned an unexpected response.",
        };
      }

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(
            `Speaking API endpoint not found: ${endpoint}`
          );
        }

        throw new Error(
          data?.error ||
            data?.message ||
            "Failed to submit speaking request."
        );
      }

      console.log(
        "✅ Speaking request submitted:",
        data
      );

      setSubmitted(true);
    } catch (error) {
      console.error(
        "❌ Speaking request error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "We couldn't send your request right now. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <>
      {/* =====================================================
          SPEAKING SECTION
      ====================================================== */}

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
          <motion.div
            initial={{
              opacity: 0,
              y: 25,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.7,
            }}
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
              Invite David Emuria to inspire,
              equip, and challenge your audience
              through meaningful conversations
              around healing, leadership,
              identity, purpose, and
              transformation.
            </p>
          </motion.div>

          {/* =================================================
              TOPICS
          ================================================== */}

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
            {SPEAKING_TOPICS.map(
              (topic, index) => {
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
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      duration: 0.6,
                      delay:
                        index * 0.12,
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
              }
            )}
          </div>

          {/* =================================================
              CTA
          ================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
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

              <span>
                Invite David to Speak
              </span>

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

      {/* =====================================================
          SPEAKING DIALOG
      ====================================================== */}

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
                Tell us a little about your event
                and the kind of conversation you
                would like David to bring to your
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
                  className="py-10 text-center"
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
                    Thank you for reaching out.
                    Your speaking request has been
                    submitted successfully.
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

                    {/* NAME */}

                    <div>
                      <label
                        htmlFor="speaker-name"
                        className="
                          mb-2
                          block
                          text-sm
                          font-semibold
                          text-[#3B2314]
                        "
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
                            updateField(
                              "name",
                              e.target.value
                            )
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

                    {/* EMAIL */}

                    <div>
                      <label
                        htmlFor="speaker-email"
                        className="
                          mb-2
                          block
                          text-sm
                          font-semibold
                          text-[#3B2314]
                        "
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
                            updateField(
                              "email",
                              e.target.value
                            )
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

                    {/* PHONE */}

                    <div>
                      <label
                        htmlFor="speaker-phone"
                        className="
                          mb-2
                          block
                          text-sm
                          font-semibold
                          text-[#3B2314]
                        "
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
                            updateField(
                              "phone",
                              e.target.value
                            )
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

                    {/* PROGRAM */}

                    <div>
                      <label
                        htmlFor="speaker-program"
                        className="
                          mb-2
                          block
                          text-sm
                          font-semibold
                          text-[#3B2314]
                        "
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
                            updateField(
                              "program",
                              e.target.value
                            )
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

                    {/* DATE */}

                    <div>
                      <label
                        htmlFor="speaker-date"
                        className="
                          mb-2
                          block
                          text-sm
                          font-semibold
                          text-[#3B2314]
                        "
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
                          value={
                            form.preferredDate
                          }
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

                    {/* LOCATION */}

                    <div>
                      <label
                        htmlFor="speaker-location"
                        className="
                          mb-2
                          block
                          text-sm
                          font-semibold
                          text-[#3B2314]
                        "
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
                            updateField(
                              "location",
                              e.target.value
                            )
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

                    {/* MESSAGE */}

                    <div className="sm:col-span-2">

                      <label
                        htmlFor="speaker-message"
                        className="
                          mb-2
                          block
                          text-sm
                          font-semibold
                          text-[#3B2314]
                        "
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
                            updateField(
                              "message",
                              e.target.value
                            )
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

                  {/* FOOTER */}

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