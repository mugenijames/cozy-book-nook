import { FormEvent, useState } from "react";
import {
  Calendar,
  CheckCircle2,
  Loader2,
  MapPin,
  X,
} from "lucide-react";

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  eventType: string;
  date: string;
  location: string;
  message: string;
}

const initialFormData: FormData = {
  name: "",
  email: "",
  phone: "",
  eventType: "",
  date: "",
  location: "",
  message: "",
};

export default function BookingModal({
  open,
  onClose,
}: BookingModalProps) {
  const [formData, setFormData] =
    useState<FormData>(initialFormData);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [submitted, setSubmitted] =
    useState(false);

  const [error, setError] =
    useState("");

  if (!open) {
    return null;
  }

  // ============================================================
  // HANDLE INPUT
  // ============================================================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
        HTMLTextAreaElement |
        HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  // ============================================================
  // SUBMIT
  // ============================================================

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");

    // ----------------------------------------------------------
    // VALIDATION
    // ----------------------------------------------------------

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.eventType ||
      !formData.date
    ) {
      setError(
        "Please fill in all required fields."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // ========================================================
      // API CONFIGURATION
      // ========================================================

      const configuredApiUrl =
        import.meta.env.VITE_API_BASE_URL;

      const defaultLocalUrl =
        "http://localhost:5000";

      const defaultProductionUrl =
        "https://cozy-book-nook-1.onrender.com";

      const apiBaseUrl =
        configuredApiUrl ||
        (import.meta.env.DEV
          ? defaultLocalUrl
          : defaultProductionUrl);

      // Remove trailing slash
      const normalizedBaseUrl =
        String(apiBaseUrl).replace(/\/+$/, "");

      // IMPORTANT:
      // Backend route:
      // app.use("/api/invite-david", invitationRoutes)
      //
      // Therefore the final endpoint is:
      // /api/invite-david

      const endpoint =
        `${normalizedBaseUrl}/api/invite-david`;

      console.log(
        "===================================="
      );

      console.log(
        "📡 API BASE URL:",
        normalizedBaseUrl
      );

      console.log(
        "📡 SPEAKING INVITATION ENDPOINT:",
        endpoint
      );

      console.log(
        "📨 FORM DATA:",
        formData
      );

      console.log(
        "===================================="
      );

      // ========================================================
      // SEND REQUEST
      // ========================================================

      const response = await fetch(
        endpoint,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Accept:
              "application/json",
          },

          body: JSON.stringify(formData),
        }
      );

      // ========================================================
      // READ RESPONSE
      // ========================================================

      const contentType =
        response.headers.get(
          "content-type"
        ) || "";

      let data: any = {};

      if (
        contentType.includes(
          "application/json"
        )
      ) {
        data = await response.json();
      } else {
        const text =
          await response.text();

        data = {
          message: text,
        };
      }

      console.log(
        "📨 BACKEND RESPONSE:",
        data
      );

      console.log(
        "📊 HTTP STATUS:",
        response.status
      );

      // ========================================================
      // HTTP ERROR
      // ========================================================

      if (!response.ok) {
        throw new Error(
          data?.error ||
            data?.message ||
            `Request failed with status ${response.status}`
        );
      }

      // ========================================================
      // APPLICATION ERROR
      // ========================================================

      if (
        data?.success === false
      ) {
        throw new Error(
          data?.error ||
            data?.message ||
            "Failed to submit speaking invitation."
        );
      }

      // ========================================================
      // SUCCESS
      // ========================================================

      console.log(
        "✅ Speaking invitation submitted successfully."
      );

      if (
        data?.emailNotification
      ) {
        console.log(
          "📧 Email notification:",
          data.emailNotification
        );
      }

      setSubmitted(true);

      setFormData(
        initialFormData
      );
    } catch (err) {
      console.error(
        "❌ Speaking invitation error:",
        err
      );

      // --------------------------------------------------------
      // NETWORK / CORS ERROR
      // --------------------------------------------------------

      if (
        err instanceof TypeError &&
        err.message
          .toLowerCase()
          .includes("fetch")
      ) {
        setError(
          "Unable to connect to the server. Please check your internet connection and try again."
        );
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================================
  // CLOSE
  // ============================================================

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }

    setFormData(
      initialFormData
    );

    setSubmitted(false);

    setError("");

    onClose();
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        bg-black/60
        px-4
        py-6
        backdrop-blur-sm
      "
      onMouseDown={(event) => {
        if (
          event.target ===
            event.currentTarget &&
          !isSubmitting
        ) {
          handleClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="book-david-title"
    >
      <div
        className="
          relative
          max-h-[92vh]
          w-full
          max-w-2xl
          overflow-y-auto
          rounded-3xl
          bg-white
          shadow-2xl
        "
      >
        {/* =====================================================
            HEADER
        ====================================================== */}

        <div
          className="
            sticky
            top-0
            z-10
            flex
            items-start
            justify-between
            border-b
            border-gray-100
            bg-white
            px-6
            py-5
            sm:px-8
          "
        >
          <div>
            <p
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.2em]
                text-[#D4A017]
              "
            >
              Speaking Invitation
            </p>

            <h2
              id="book-david-title"
              className="
                mt-1
                font-heading
                text-2xl
                font-bold
                text-[#2E1208]
                sm:text-3xl
              "
            >
              Book David to Speak
            </h2>

            <p
              className="
                mt-2
                max-w-xl
                text-sm
                leading-6
                text-gray-600
              "
            >
              Tell us about your event and
              our team will get back to you
              shortly.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            aria-label="Close booking form"
            className="
              ml-4
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-full
              text-gray-500
              transition
              hover:bg-[#F5F1EC]
              hover:text-[#2E1208]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* =====================================================
            SUCCESS
        ====================================================== */}

        {submitted ? (
          <div
            className="
              px-6
              py-14
              text-center
              sm:px-8
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
                bg-green-50
              "
            >
              <CheckCircle2
                className="
                  h-9
                  w-9
                  text-green-600
                "
              />
            </div>

            <h3
              className="
                mt-6
                text-2xl
                font-bold
                text-[#2E1208]
              "
            >
              Invitation Received!
            </h3>

            <p
              className="
                mx-auto
                mt-3
                max-w-md
                leading-7
                text-gray-600
              "
            >
              Thank you for considering
              David for your event. Your
              speaking invitation has been
              received successfully.
            </p>

            <p
              className="
                mx-auto
                mt-3
                max-w-md
                text-sm
                leading-6
                text-gray-500
              "
            >
              A confirmation email has been
              sent to you. David's team will
              review your request and contact
              you shortly.
            </p>

            <button
              type="button"
              onClick={handleClose}
              className="
                mt-8
                rounded-full
                bg-[#4A1F0E]
                px-7
                py-3
                font-semibold
                text-white
                transition
                hover:bg-[#2E1208]
              "
            >
              Done
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="
              px-6
              py-7
              sm:px-8
            "
          >
            {/* =================================================
                ERROR
            ================================================== */}

            {error && (
              <div
                role="alert"
                className="
                  mb-6
                  rounded-xl
                  border
                  border-red-200
                  bg-red-50
                  px-4
                  py-3
                  text-sm
                  leading-6
                  text-red-700
                "
              >
                {error}
              </div>
            )}

            {/* =================================================
                FORM GRID
            ================================================== */}

            <div
              className="
                grid
                gap-5
                sm:grid-cols-2
              "
            >
              {/* NAME */}

              <div>
                <label
                  htmlFor="invite-name"
                  className="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-[#2E1208]
                  "
                >
                  Full Name{" "}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <input
                  id="invite-name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
                  autoComplete="name"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-gray-200
                    bg-white
                    px-4
                    py-3
                    text-sm
                    text-[#2E1208]
                    outline-none
                    transition
                    placeholder:text-gray-400
                    focus:border-[#C17B4F]
                    focus:ring-2
                    focus:ring-[#C17B4F]/20
                  "
                />
              </div>

              {/* EMAIL */}

              <div>
                <label
                  htmlFor="invite-email"
                  className="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-[#2E1208]
                  "
                >
                  Email Address{" "}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <input
                  id="invite-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-gray-200
                    bg-white
                    px-4
                    py-3
                    text-sm
                    text-[#2E1208]
                    outline-none
                    transition
                    placeholder:text-gray-400
                    focus:border-[#C17B4F]
                    focus:ring-2
                    focus:ring-[#C17B4F]/20
                  "
                />
              </div>

              {/* PHONE */}

              <div>
                <label
                  htmlFor="invite-phone"
                  className="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-[#2E1208]
                  "
                >
                  Phone Number
                </label>

                <input
                  id="invite-phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+254 7XX XXX XXX"
                  autoComplete="tel"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-gray-200
                    bg-white
                    px-4
                    py-3
                    text-sm
                    text-[#2E1208]
                    outline-none
                    transition
                    placeholder:text-gray-400
                    focus:border-[#C17B4F]
                    focus:ring-2
                    focus:ring-[#C17B4F]/20
                  "
                />
              </div>

              {/* EVENT TYPE */}

              <div>
                <label
                  htmlFor="invite-eventType"
                  className="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-[#2E1208]
                  "
                >
                  Event Type{" "}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <select
                  id="invite-eventType"
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  required
                  className="
                    w-full
                    rounded-xl
                    border
                    border-gray-200
                    bg-white
                    px-4
                    py-3
                    text-sm
                    text-[#2E1208]
                    outline-none
                    transition
                    focus:border-[#C17B4F]
                    focus:ring-2
                    focus:ring-[#C17B4F]/20
                  "
                >
                  <option value="">
                    Select event type
                  </option>

                  <option value="Conference">
                    Conference
                  </option>

                  <option value="Church Event">
                    Church Event
                  </option>

                  <option value="Leadership Event">
                    Leadership Event
                  </option>

                  <option value="School / University">
                    School / University
                  </option>

                  <option value="Corporate Event">
                    Corporate Event
                  </option>

                  <option value="Youth Event">
                    Youth Event
                  </option>

                  <option value="Workshop">
                    Workshop
                  </option>

                  <option value="Seminar">
                    Seminar
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>
              </div>

              {/* DATE */}

              <div>
                <label
                  htmlFor="invite-date"
                  className="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-[#2E1208]
                  "
                >
                  Event Date{" "}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <div className="relative">
                  <Calendar
                    className="
                      pointer-events-none
                      absolute
                      left-4
                      top-1/2
                      h-4
                      w-4
                      -translate-y-1/2
                      text-[#C17B4F]
                    "
                  />

                  <input
                    id="invite-date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="
                      w-full
                      rounded-xl
                      border
                      border-gray-200
                      bg-white
                      py-3
                      pl-11
                      pr-4
                      text-sm
                      text-[#2E1208]
                      outline-none
                      transition
                      focus:border-[#C17B4F]
                      focus:ring-2
                      focus:ring-[#C17B4F]/20
                    "
                  />
                </div>
              </div>

              {/* LOCATION */}

              <div>
                <label
                  htmlFor="invite-location"
                  className="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-[#2E1208]
                  "
                >
                  Event Location
                </label>

                <div className="relative">
                  <MapPin
                    className="
                      pointer-events-none
                      absolute
                      left-4
                      top-1/2
                      h-4
                      w-4
                      -translate-y-1/2
                      text-[#C17B4F]
                    "
                  />

                  <input
                    id="invite-location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="City, venue or online"
                    className="
                      w-full
                      rounded-xl
                      border
                      border-gray-200
                      bg-white
                      py-3
                      pl-11
                      pr-4
                      text-sm
                      text-[#2E1208]
                      outline-none
                      transition
                      placeholder:text-gray-400
                      focus:border-[#C17B4F]
                      focus:ring-2
                      focus:ring-[#C17B4F]/20
                    "
                  />
                </div>
              </div>
            </div>

            {/* =================================================
                MESSAGE
            ================================================== */}

            <div className="mt-5">
              <label
                htmlFor="invite-message"
                className="
                  mb-2
                  block
                  text-sm
                  font-semibold
                  text-[#2E1208]
                "
              >
                Message / Event Details
              </label>

              <textarea
                id="invite-message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                placeholder="Tell us more about your event, audience, expected number of attendees, and what you would like David to speak about..."
                className="
                  w-full
                  resize-none
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  px-4
                  py-3
                  text-sm
                  leading-6
                  text-[#2E1208]
                  outline-none
                  transition
                  placeholder:text-gray-400
                  focus:border-[#C17B4F]
                  focus:ring-2
                  focus:ring-[#C17B4F]/20
                "
              />
            </div>

            {/* =================================================
                FOOTER
            ================================================== */}

            <div
              className="
                mt-7
                flex
                flex-col-reverse
                gap-3
                sm:flex-row
                sm:justify-end
              "
            >
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="
                  rounded-full
                  border
                  border-gray-200
                  px-6
                  py-3
                  text-sm
                  font-semibold
                  text-[#4A1F0E]
                  transition
                  hover:bg-gray-50
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  bg-[#D4A017]
                  px-7
                  py-3
                  text-sm
                  font-bold
                  text-white
                  shadow-md
                  transition
                  hover:-translate-y-0.5
                  hover:bg-[#B58900]
                  hover:shadow-lg
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {isSubmitting ? (
                  <>
                    <Loader2
                      className="
                        h-4
                        w-4
                        animate-spin
                      "
                    />
                    Sending...
                  </>
                ) : (
                  "Send Speaking Invitation"
                )}
              </button>
            </div>

            <p
              className="
                mt-5
                text-center
                text-xs
                leading-5
                text-gray-500
              "
            >
              Your information will only
              be used to respond to your
              speaking request.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}