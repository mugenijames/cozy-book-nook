// frontend/src/components/InquiryModal.tsx

import {
  FormEvent,
  useState,
} from "react";

import {
  X,
  FileText,
  User,
  Mail,
  Phone,
  MessageSquare,
  Loader2,
  CheckCircle2,
} from "lucide-react";

import {
  submitBookInquiry,
} from "@/services/api";

// ============================================================
// TYPES
// ============================================================

interface Book {
  id: string;
  title: string;
  author?: string;
}

interface InquiryModalProps {
  book: Book;
  onClose: () => void;
}

// ============================================================
// COMPONENT
// ============================================================

export default function InquiryModal({
  book,
  onClose,
}: InquiryModalProps) {
  const [customerName, setCustomerName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phoneNumber, setPhoneNumber] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const [orderNumber, setOrderNumber] =
    useState<string | null>(null);

  const [error, setError] =
    useState("");

  // ==========================================================
  // SUBMIT
  // ==========================================================

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    // --------------------------------------------------------
    // VALIDATION
    // --------------------------------------------------------

    if (!customerName.trim()) {
      setError(
        "Please enter your name."
      );

      return;
    }

    if (!email.trim()) {
      setError(
        "Please enter your email address."
      );

      return;
    }

    if (!message.trim()) {
      setError(
        "Please enter your inquiry."
      );

      return;
    }

    // Basic email validation
    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailPattern.test(
        email.trim()
      )
    ) {
      setError(
        "Please enter a valid email address."
      );

      return;
    }

    try {
      setIsSubmitting(true);

      setError("");

      // ------------------------------------------------------
      // SUBMIT THROUGH CENTRAL API SERVICE
      // ------------------------------------------------------

      console.log(
        "📨 Sending inquiry for book:",
        {
          bookId: book.id,
          bookTitle: book.title,
          customerName,
          email,
        }
      );

      const data =
        await submitBookInquiry({
          orderType: "INQUIRY",

          customerName:
            customerName.trim(),

          email:
            email
              .trim()
              .toLowerCase(),

          phoneNumber:
            phoneNumber.trim() ||
            null,

          notes:
            message.trim(),

          deliveryNotes:
            message.trim(),

          items: [
            {
              bookId:
                book.id,

              quantity: 1,
            },
          ],
        });

      // ------------------------------------------------------
      // SUCCESS
      // ------------------------------------------------------

      console.log(
        "✅ Inquiry submitted successfully:",
        data
      );

      const createdOrder =
        data?.order;

      const reference =
        createdOrder?.id ||
        createdOrder?.orderNumber ||
        data?.id ||
        data?.orderNumber ||
        null;

      setOrderNumber(
        reference
      );

      setSuccess(true);

      // ------------------------------------------------------
      // EMAIL STATUS
      // ------------------------------------------------------

      console.log(
        "📧 Inquiry email notification status:",
        data?.emailNotifications
      );
    } catch (err) {
      console.error(
        "❌ Inquiry submission error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while submitting your inquiry. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div
      className="
        fixed
        inset-0
        z-[110]
        flex
        items-center
        justify-center
        bg-black/60
        p-4
        backdrop-blur-sm
      "
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          if (!isSubmitting) {
            onClose();
          }
        }
      }}
    >
      <div
        className="
          relative
          max-h-[92vh]
          w-full
          max-w-xl
          overflow-y-auto
          rounded-2xl
          bg-white
          shadow-2xl
          dark:bg-slate-900
        "
      >
        {/* ==================================================
            HEADER
        ================================================== */}

        <div
          className="
            sticky
            top-0
            z-10
            flex
            items-center
            justify-between
            border-b
            border-slate-200
            bg-white
            px-5
            py-4
            dark:border-slate-700
            dark:bg-slate-900
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-[#C17B4F]/10
                text-[#C17B4F]
              "
            >
              {success ? (
                <CheckCircle2
                  size={22}
                />
              ) : (
                <FileText
                  size={22}
                />
              )}
            </div>

            <div>
              <h2
                className="
                  text-lg
                  font-bold
                  text-[#2E1208]
                  dark:text-white
                "
              >
                {success
                  ? "Inquiry Sent"
                  : "Book Inquiry"}
              </h2>

              {!success && (
                <p
                  className="
                    text-sm
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  Ask us about this book.
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="
              rounded-lg
              p-2
              text-slate-500
              transition
              hover:bg-slate-100
              hover:text-slate-800
              disabled:cursor-not-allowed
              disabled:opacity-50
              dark:hover:bg-slate-800
              dark:hover:text-white
            "
            aria-label="Close inquiry"
          >
            <X size={22} />
          </button>
        </div>

        {/* ==================================================
            SUCCESS
        ================================================== */}

        {success ? (
          <div
            className="
              px-6
              py-10
              text-center
            "
          >
            <div
              className="
                mx-auto
                mb-5
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-full
                bg-green-100
                text-green-600
                dark:bg-green-900/30
                dark:text-green-400
              "
            >
              <CheckCircle2
                size={34}
              />
            </div>

            <h3
              className="
                text-2xl
                font-bold
                text-[#2E1208]
                dark:text-white
              "
            >
              Thank you!
            </h3>

            <p
              className="
                mx-auto
                mt-3
                max-w-md
                leading-6
                text-slate-600
                dark:text-slate-300
              "
            >
              Your inquiry about{" "}
              <strong>
                {book.title}
              </strong>{" "}
              has been received. We will
              contact you using the details
              you provided.
            </p>

            <p
              className="
                mx-auto
                mt-3
                max-w-md
                text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              A confirmation has also been
              sent to your email address.
            </p>

            {orderNumber && (
              <div
                className="
                  mx-auto
                  mt-5
                  max-w-md
                  rounded-xl
                  bg-slate-100
                  p-4
                  dark:bg-slate-800
                "
              >
                <p
                  className="
                    text-xs
                    font-medium
                    uppercase
                    tracking-wide
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  Reference
                </p>

                <p
                  className="
                    mt-1
                    break-all
                    font-mono
                    text-sm
                    font-semibold
                    text-slate-900
                    dark:text-white
                  "
                >
                  {orderNumber}
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={onClose}
              className="
                mt-7
                rounded-xl
                bg-[#2E1208]
                px-6
                py-3
                font-semibold
                text-white
                transition
                hover:bg-[#4A2112]
              "
            >
              Done
            </button>
          </div>
        ) : (
          /* ==================================================
             FORM
          ================================================== */

          <form
            onSubmit={handleSubmit}
            noValidate
          >
            <div
              className="
                space-y-6
                p-5
                sm:p-6
              "
            >
              {/* ==================================================
                  BOOK
              ================================================== */}

              <div
                className="
                  rounded-xl
                  border
                  border-[#C9B8A8]
                  bg-[#EEF2F7]
                  p-4
                "
              >
                <p
                  className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-[#C17B4F]
                  "
                >
                  Inquiry about
                </p>

                <h3
                  className="
                    mt-1
                    font-bold
                    text-[#2E1208]
                  "
                >
                  {book.title}
                </h3>

                {book.author && (
                  <p
                    className="
                      mt-1
                      text-sm
                      text-gray-600
                    "
                  >
                    by {book.author}
                  </p>
                )}
              </div>

              {/* ==================================================
                  CUSTOMER INFORMATION
              ================================================== */}

              <section>
                <h3
                  className="
                    mb-4
                    text-base
                    font-semibold
                    text-slate-900
                    dark:text-white
                  "
                >
                  Your Information
                </h3>

                <div className="space-y-4">
                  {/* NAME */}

                  <div>
                    <label
                      htmlFor="inquiry-name"
                      className="
                        mb-1.5
                        block
                        text-sm
                        font-medium
                        text-slate-700
                        dark:text-slate-300
                      "
                    >
                      Full Name *
                    </label>

                    <div className="relative">
                      <User
                        size={18}
                        className="
                          absolute
                          left-3
                          top-1/2
                          -translate-y-1/2
                          text-slate-400
                        "
                      />

                      <input
                        id="inquiry-name"
                        type="text"
                        value={
                          customerName
                        }
                        onChange={(event) =>
                          setCustomerName(
                            event.target.value
                          )
                        }
                        placeholder="Your full name"
                        required
                        autoComplete="name"
                        disabled={
                          isSubmitting
                        }
                        className="
                          w-full
                          rounded-xl
                          border
                          border-slate-300
                          bg-white
                          py-3
                          pl-10
                          pr-3
                          text-sm
                          outline-none
                          focus:border-[#C17B4F]
                          focus:ring-2
                          focus:ring-[#C17B4F]/20
                          disabled:cursor-not-allowed
                          disabled:opacity-60
                          dark:border-slate-600
                          dark:bg-slate-800
                          dark:text-white
                        "
                      />
                    </div>
                  </div>

                  {/* EMAIL */}

                  <div>
                    <label
                      htmlFor="inquiry-email"
                      className="
                        mb-1.5
                        block
                        text-sm
                        font-medium
                        text-slate-700
                        dark:text-slate-300
                      "
                    >
                      Email Address *
                    </label>

                    <div className="relative">
                      <Mail
                        size={18}
                        className="
                          absolute
                          left-3
                          top-1/2
                          -translate-y-1/2
                          text-slate-400
                        "
                      />

                      <input
                        id="inquiry-email"
                        type="email"
                        value={email}
                        onChange={(event) =>
                          setEmail(
                            event.target.value
                          )
                        }
                        placeholder="you@example.com"
                        required
                        autoComplete="email"
                        inputMode="email"
                        disabled={
                          isSubmitting
                        }
                        className="
                          w-full
                          rounded-xl
                          border
                          border-slate-300
                          bg-white
                          py-3
                          pl-10
                          pr-3
                          text-sm
                          outline-none
                          focus:border-[#C17B4F]
                          focus:ring-2
                          focus:ring-[#C17B4F]/20
                          disabled:cursor-not-allowed
                          disabled:opacity-60
                          dark:border-slate-600
                          dark:bg-slate-800
                          dark:text-white
                        "
                      />
                    </div>
                  </div>

                  {/* PHONE */}

                  <div>
                    <label
                      htmlFor="inquiry-phone"
                      className="
                        mb-1.5
                        block
                        text-sm
                        font-medium
                        text-slate-700
                        dark:text-slate-300
                      "
                    >
                      Phone Number
                    </label>

                    <div className="relative">
                      <Phone
                        size={18}
                        className="
                          absolute
                          left-3
                          top-1/2
                          -translate-y-1/2
                          text-slate-400
                        "
                      />

                      <input
                        id="inquiry-phone"
                        type="tel"
                        value={
                          phoneNumber
                        }
                        onChange={(event) =>
                          setPhoneNumber(
                            event.target.value
                          )
                        }
                        placeholder="e.g. 0712 345 678"
                        autoComplete="tel"
                        inputMode="tel"
                        disabled={
                          isSubmitting
                        }
                        className="
                          w-full
                          rounded-xl
                          border
                          border-slate-300
                          bg-white
                          py-3
                          pl-10
                          pr-3
                          text-sm
                          outline-none
                          focus:border-[#C17B4F]
                          focus:ring-2
                          focus:ring-[#C17B4F]/20
                          disabled:cursor-not-allowed
                          disabled:opacity-60
                          dark:border-slate-600
                          dark:bg-slate-800
                          dark:text-white
                        "
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* ==================================================
                  MESSAGE
              ================================================== */}

              <section>
                <label
                  htmlFor="inquiry-message"
                  className="
                    mb-1.5
                    block
                    text-sm
                    font-medium
                    text-slate-700
                    dark:text-slate-300
                  "
                >
                  Your Inquiry *
                </label>

                <div className="relative">
                  <MessageSquare
                    size={18}
                    className="
                      absolute
                      left-3
                      top-3
                      text-slate-400
                    "
                  />

                  <textarea
                    id="inquiry-message"
                    value={message}
                    onChange={(event) =>
                      setMessage(
                        event.target.value
                      )
                    }
                    rows={5}
                    required
                    disabled={
                      isSubmitting
                    }
                    placeholder="What would you like to know about this book?"
                    className="
                      w-full
                      resize-none
                      rounded-xl
                      border
                      border-slate-300
                      bg-white
                      py-3
                      pl-10
                      pr-3
                      text-sm
                      outline-none
                      focus:border-[#C17B4F]
                      focus:ring-2
                      focus:ring-[#C17B4F]/20
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                      dark:border-slate-600
                      dark:bg-slate-800
                      dark:text-white
                    "
                  />
                </div>
              </section>

              {/* ==================================================
                  ERROR
              ================================================== */}

              {error && (
                <div
                  role="alert"
                  className="
                    rounded-xl
                    border
                    border-red-200
                    bg-red-50
                    px-4
                    py-3
                    text-sm
                    text-red-700
                    dark:border-red-900/50
                    dark:bg-red-900/20
                    dark:text-red-300
                  "
                >
                  {error}
                </div>
              )}
            </div>

            {/* ==================================================
                FOOTER
            ================================================== */}

            <div
              className="
                flex
                flex-col-reverse
                gap-3
                border-t
                border-slate-200
                bg-white
                p-4
                sm:flex-row
                sm:justify-end
                dark:border-slate-700
                dark:bg-slate-900
              "
            >
              <button
                type="button"
                onClick={onClose}
                disabled={
                  isSubmitting
                }
                className="
                  rounded-xl
                  border
                  border-slate-300
                  px-5
                  py-3
                  font-semibold
                  text-slate-700
                  transition
                  hover:bg-slate-50
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  dark:border-slate-600
                  dark:text-slate-200
                  dark:hover:bg-slate-800
                "
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={
                  isSubmitting
                }
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-[#C17B4F]
                  px-6
                  py-3
                  font-semibold
                  text-white
                  transition
                  hover:bg-[#A55E36]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {isSubmitting ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />

                    Sending...
                  </>
                ) : (
                  <>
                    <FileText
                      size={18}
                    />

                    Send Inquiry
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}