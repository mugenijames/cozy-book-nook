// frontend/src/components/HardcopyOrderModal.tsx

import { FormEvent, useEffect, useState } from "react";
import {
  X,
  ShoppingBag,
  User,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Loader2,
  Package,
} from "lucide-react";

import type { Book } from "@/services/api";

export type HardcopyOrderData = {
  bookId: string;
  bookTitle: string;

  customerName: string;
  email: string;
  phoneNumber: string;

  quantity: number;

  deliveryMethod: string;
  deliveryAddress: string;
  deliveryTown: string;
  deliveryNotes: string;

  paymentMethod: string;

  amountCents: number;
};

interface HardcopyOrderModalProps {
  isOpen: boolean;
  book: Book | null;

  onClose: () => void;

  onSubmit: (
    data: HardcopyOrderData
  ) => Promise<void> | void;
}

const HardcopyOrderModal = ({
  isOpen,
  book,
  onClose,
  onSubmit,
}: HardcopyOrderModalProps) => {
  const [customerName, setCustomerName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phoneNumber, setPhoneNumber] =
    useState("");

  const [quantity, setQuantity] =
    useState(1);

  const [deliveryMethod, setDeliveryMethod] =
    useState("DELIVERY");

  const [deliveryAddress, setDeliveryAddress] =
    useState("");

  const [deliveryTown, setDeliveryTown] =
    useState("");

  const [deliveryNotes, setDeliveryNotes] =
    useState("");

  const [paymentMethod, setPaymentMethod] =
    useState("MPESA");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  /* =========================================================
     RESET WHEN MODAL OPENS
  ========================================================= */

  useEffect(() => {
    if (!isOpen) return;

    setError("");
    setIsSubmitting(false);
  }, [isOpen]);

  /* =========================================================
     CLOSE ON ESCAPE
  ========================================================= */

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSubmitting) {
        onClose();
      }
    };

    window.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [isOpen, isSubmitting, onClose]);

  /* =========================================================
     TOTAL
  ========================================================= */

  const unitPrice =
    Number(book?.priceCents || 0);

  const totalAmount =
    unitPrice * quantity;

  const formatPrice = (
    cents: number
  ) => {
    return new Intl.NumberFormat(
      "en-KE",
      {
        style: "currency",
        currency: "KES",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }
    ).format(cents / 100);
  };

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!book) {
      setError(
        "No book has been selected."
      );

      return;
    }

    setError("");

    if (!customerName.trim()) {
      setError(
        "Please enter your full name."
      );

      return;
    }

    if (!email.trim()) {
      setError(
        "Please enter your email address."
      );

      return;
    }

    if (!phoneNumber.trim()) {
      setError(
        "Please enter your phone number."
      );

      return;
    }

    if (
      deliveryMethod === "DELIVERY" &&
      !deliveryTown.trim()
    ) {
      setError(
        "Please enter your town or delivery location."
      );

      return;
    }

    if (
      deliveryMethod === "DELIVERY" &&
      !deliveryAddress.trim()
    ) {
      setError(
        "Please enter your delivery address."
      );

      return;
    }

    if (quantity < 1) {
      setError(
        "Quantity must be at least 1."
      );

      return;
    }

    try {
      setIsSubmitting(true);

      await onSubmit({
        bookId: book.id,

        bookTitle: book.title,

        customerName:
          customerName.trim(),

        email:
          email.trim(),

        phoneNumber:
          phoneNumber.trim(),

        quantity,

        deliveryMethod,

        deliveryAddress:
          deliveryAddress.trim(),

        deliveryTown:
          deliveryTown.trim(),

        deliveryNotes:
          deliveryNotes.trim(),

        paymentMethod,

        amountCents:
          totalAmount,
      });

      /*
       * Parent component is responsible for
       * closing the modal after successful
       * submission.
       */
    } catch (submitError) {
      console.error(
        "Hardcopy order error:",
        submitError
      );

      setError(
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong while placing your order."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /* =========================================================
     DO NOT RENDER
  ========================================================= */

  if (!isOpen || !book) {
    return null;
  }

  /* =========================================================
     RENDER
  ========================================================= */

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
        p-4
        backdrop-blur-sm
      "
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !isSubmitting
        ) {
          onClose();
        }
      }}
    >
      <div
        className="
          relative
          flex
          max-h-[92vh]
          w-full
          max-w-2xl
          flex-col
          overflow-hidden
          rounded-3xl
          bg-[#F9F6EF]
          shadow-2xl
        "
        role="dialog"
        aria-modal="true"
        aria-labelledby="hardcopy-order-title"
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="
            flex
            items-start
            justify-between
            border-b
            border-[#E8DDD4]
            bg-white
            px-5
            py-5
            sm:px-7
          "
        >
          <div className="flex items-start gap-3">
            <div
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-[#4A1F0E]
                text-white
              "
            >
              <ShoppingBag className="h-5 w-5" />
            </div>

            <div>
              <h2
                id="hardcopy-order-title"
                className="
                  text-xl
                  font-bold
                  text-[#3A180C]
                  sm:text-2xl
                "
              >
                Order Hard Copy
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Complete the details below to
                order your physical copy.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="
              rounded-full
              p-2
              text-gray-400
              transition
              hover:bg-gray-100
              hover:text-gray-700
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* =================================================
            CONTENT
        ================================================= */}

        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto"
        >
          <div className="space-y-6 p-5 sm:p-7">

            {/* =================================================
                BOOK SUMMARY
            ================================================= */}

            <div
              className="
                flex
                gap-4
                rounded-2xl
                border
                border-[#E8DDD4]
                bg-white
                p-4
              "
            >
              <div
                className="
                  h-24
                  w-16
                  shrink-0
                  overflow-hidden
                  rounded-lg
                  bg-[#4A1F0E]
                  shadow-sm
                "
              >
                {book.coverImage ? (
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="
                      h-full
                      w-full
                      object-cover
                    "
                  />
                ) : (
                  <div
                    className="
                      flex
                      h-full
                      items-center
                      justify-center
                    "
                  >
                    <Package className="h-6 w-6 text-[#D4A017]" />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p
                  className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-[#C17B4F]
                  "
                >
                  Hard Copy
                </p>

                <h3
                  className="
                    mt-1
                    line-clamp-2
                    text-base
                    font-bold
                    text-[#3A180C]
                  "
                >
                  {book.title}
                </h3>

                {book.author && (
                  <p className="mt-1 text-xs text-gray-500">
                    by {book.author}
                  </p>
                )}

                <p
                  className="
                    mt-2
                    text-sm
                    font-bold
                    text-[#4A1F0E]
                  "
                >
                  {formatPrice(unitPrice)}{" "}
                  <span className="font-normal text-gray-400">
                    per copy
                  </span>
                </p>
              </div>
            </div>

            {/* =================================================
                CUSTOMER DETAILS
            ================================================= */}

            <section>
              <div className="mb-4">
                <h3 className="text-sm font-bold text-[#3A180C]">
                  Customer Information
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Tell us how we can contact you.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">

                {/* Name */}

                <div className="sm:col-span-2">
                  <label
                    htmlFor="customerName"
                    className="
                      mb-1.5
                      block
                      text-xs
                      font-semibold
                      text-gray-600
                    "
                  >
                    Full Name
                  </label>

                  <div className="relative">
                    <User
                      className="
                        pointer-events-none
                        absolute
                        left-3.5
                        top-1/2
                        h-4
                        w-4
                        -translate-y-1/2
                        text-gray-400
                      "
                    />

                    <input
                      id="customerName"
                      type="text"
                      value={customerName}
                      onChange={(event) =>
                        setCustomerName(
                          event.target.value
                        )
                      }
                      placeholder="Your full name"
                      autoComplete="name"
                      className="
                        h-11
                        w-full
                        rounded-xl
                        border
                        border-[#E8DDD4]
                        bg-white
                        pl-10
                        pr-3
                        text-sm
                        text-[#2E1208]
                        outline-none
                        transition
                        focus:border-[#C17B4F]
                        focus:ring-2
                        focus:ring-[#C17B4F]/20
                      "
                      required
                    />
                  </div>
                </div>

                {/* Email */}

                <div>
                  <label
                    htmlFor="email"
                    className="
                      mb-1.5
                      block
                      text-xs
                      font-semibold
                      text-gray-600
                    "
                  >
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail
                      className="
                        pointer-events-none
                        absolute
                        left-3.5
                        top-1/2
                        h-4
                        w-4
                        -translate-y-1/2
                        text-gray-400
                      "
                    />

                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) =>
                        setEmail(
                          event.target.value
                        )
                      }
                      placeholder="you@example.com"
                      autoComplete="email"
                      className="
                        h-11
                        w-full
                        rounded-xl
                        border
                        border-[#E8DDD4]
                        bg-white
                        pl-10
                        pr-3
                        text-sm
                        text-[#2E1208]
                        outline-none
                        transition
                        focus:border-[#C17B4F]
                        focus:ring-2
                        focus:ring-[#C17B4F]/20
                      "
                      required
                    />
                  </div>
                </div>

                {/* Phone */}

                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="
                      mb-1.5
                      block
                      text-xs
                      font-semibold
                      text-gray-600
                    "
                  >
                    Phone Number
                  </label>

                  <div className="relative">
                    <Phone
                      className="
                        pointer-events-none
                        absolute
                        left-3.5
                        top-1/2
                        h-4
                        w-4
                        -translate-y-1/2
                        text-gray-400
                      "
                    />

                    <input
                      id="phoneNumber"
                      type="tel"
                      value={phoneNumber}
                      onChange={(event) =>
                        setPhoneNumber(
                          event.target.value
                        )
                      }
                      placeholder="07XX XXX XXX"
                      autoComplete="tel"
                      className="
                        h-11
                        w-full
                        rounded-xl
                        border
                        border-[#E8DDD4]
                        bg-white
                        pl-10
                        pr-3
                        text-sm
                        text-[#2E1208]
                        outline-none
                        transition
                        focus:border-[#C17B4F]
                        focus:ring-2
                        focus:ring-[#C17B4F]/20
                      "
                      required
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* =================================================
                QUANTITY
            ================================================= */}

            <section>
              <label
                htmlFor="quantity"
                className="
                  mb-1.5
                  block
                  text-xs
                  font-semibold
                  text-gray-600
                "
              >
                Quantity
              </label>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={quantity <= 1}
                  onClick={() =>
                    setQuantity(
                      (value) =>
                        Math.max(
                          1,
                          value - 1
                        )
                    )
                  }
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-[#E8DDD4]
                    bg-white
                    text-lg
                    font-bold
                    text-[#4A1F0E]
                    transition
                    hover:border-[#C17B4F]
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                  aria-label="Decrease quantity"
                >
                  −
                </button>

                <input
                  id="quantity"
                  type="number"
                  min={1}
                  max={100}
                  value={quantity}
                  onChange={(event) => {
                    const value =
                      Number(
                        event.target.value
                      );

                    setQuantity(
                      Number.isFinite(value) &&
                        value > 0
                        ? Math.min(
                            value,
                            100
                          )
                        : 1
                    );
                  }}
                  className="
                    h-11
                    w-20
                    rounded-xl
                    border
                    border-[#E8DDD4]
                    bg-white
                    text-center
                    text-sm
                    font-bold
                    text-[#2E1208]
                    outline-none
                    focus:border-[#C17B4F]
                    focus:ring-2
                    focus:ring-[#C17B4F]/20
                  "
                />

                <button
                  type="button"
                  disabled={quantity >= 100}
                  onClick={() =>
                    setQuantity(
                      (value) =>
                        Math.min(
                          100,
                          value + 1
                        )
                    )
                  }
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-[#E8DDD4]
                    bg-white
                    text-lg
                    font-bold
                    text-[#4A1F0E]
                    transition
                    hover:border-[#C17B4F]
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                  aria-label="Increase quantity"
                >
                  +
                </button>

                <span className="text-xs text-gray-500">
                  {quantity === 1
                    ? "1 copy"
                    : `${quantity} copies`}
                </span>
              </div>
            </section>

            {/* =================================================
                DELIVERY
            ================================================= */}

            <section>
              <div className="mb-4">
                <h3 className="text-sm font-bold text-[#3A180C]">
                  Delivery
                </h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">

                {/* Delivery Method */}

                <div className="sm:col-span-2">
                  <label
                    htmlFor="deliveryMethod"
                    className="
                      mb-1.5
                      block
                      text-xs
                      font-semibold
                      text-gray-600
                    "
                  >
                    Delivery Method
                  </label>

                  <select
                    id="deliveryMethod"
                    value={deliveryMethod}
                    onChange={(event) =>
                      setDeliveryMethod(
                        event.target.value
                      )
                    }
                    className="
                      h-11
                      w-full
                      rounded-xl
                      border
                      border-[#E8DDD4]
                      bg-white
                      px-3
                      text-sm
                      text-[#2E1208]
                      outline-none
                      focus:border-[#C17B4F]
                      focus:ring-2
                      focus:ring-[#C17B4F]/20
                    "
                  >
                    <option value="DELIVERY">
                      Deliver to me
                    </option>

                    <option value="PICKUP">
                      Pick up
                    </option>
                  </select>
                </div>

                {/* Town */}

                {deliveryMethod ===
                  "DELIVERY" && (
                  <div>
                    <label
                      htmlFor="deliveryTown"
                      className="
                        mb-1.5
                        block
                        text-xs
                        font-semibold
                        text-gray-600
                      "
                    >
                      Town / Area
                    </label>

                    <div className="relative">
                      <MapPin
                        className="
                          pointer-events-none
                          absolute
                          left-3.5
                          top-1/2
                          h-4
                          w-4
                          -translate-y-1/2
                          text-gray-400
                        "
                      />

                      <input
                        id="deliveryTown"
                        type="text"
                        value={deliveryTown}
                        onChange={(event) =>
                          setDeliveryTown(
                            event.target.value
                          )
                        }
                        placeholder="e.g. Nairobi"
                        className="
                          h-11
                          w-full
                          rounded-xl
                          border
                          border-[#E8DDD4]
                          bg-white
                          pl-10
                          pr-3
                          text-sm
                          text-[#2E1208]
                          outline-none
                          focus:border-[#C17B4F]
                          focus:ring-2
                          focus:ring-[#C17B4F]/20
                        "
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Address */}

                {deliveryMethod ===
                  "DELIVERY" && (
                  <div>
                    <label
                      htmlFor="deliveryAddress"
                      className="
                        mb-1.5
                        block
                        text-xs
                        font-semibold
                        text-gray-600
                      "
                    >
                      Delivery Address
                    </label>

                    <input
                      id="deliveryAddress"
                      type="text"
                      value={deliveryAddress}
                      onChange={(event) =>
                        setDeliveryAddress(
                          event.target.value
                        )
                      }
                      placeholder="Street, building, estate..."
                      className="
                        h-11
                        w-full
                        rounded-xl
                        border
                        border-[#E8DDD4]
                        bg-white
                        px-3
                        text-sm
                        text-[#2E1208]
                        outline-none
                        focus:border-[#C17B4F]
                        focus:ring-2
                        focus:ring-[#C17B4F]/20
                      "
                      required
                    />
                  </div>
                )}
              </div>
            </section>

            {/* =================================================
                PAYMENT
            ================================================= */}

            <section>
              <label
                htmlFor="paymentMethod"
                className="
                  mb-1.5
                  block
                  text-xs
                  font-semibold
                  text-gray-600
                "
              >
                Preferred Payment Method
              </label>

              <select
                id="paymentMethod"
                value={paymentMethod}
                onChange={(event) =>
                  setPaymentMethod(
                    event.target.value
                  )
                }
                className="
                  h-11
                  w-full
                  rounded-xl
                  border
                  border-[#E8DDD4]
                  bg-white
                  px-3
                  text-sm
                  text-[#2E1208]
                  outline-none
                  focus:border-[#C17B4F]
                  focus:ring-2
                  focus:ring-[#C17B4F]/20
                "
              >
                <option value="MPESA">
                  M-Pesa
                </option>

                <option value="PAYPAL">
                  PayPal
                </option>

                <option value="CASH">
                  Cash on Delivery / Pickup
                </option>
              </select>
            </section>

            {/* =================================================
                NOTES
            ================================================= */}

            <section>
              <label
                htmlFor="deliveryNotes"
                className="
                  mb-1.5
                  block
                  text-xs
                  font-semibold
                  text-gray-600
                "
              >
                Additional Notes
              </label>

              <div className="relative">
                <MessageSquare
                  className="
                    pointer-events-none
                    absolute
                    left-3.5
                    top-3.5
                    h-4
                    w-4
                    text-gray-400
                  "
                />

                <textarea
                  id="deliveryNotes"
                  value={deliveryNotes}
                  onChange={(event) =>
                    setDeliveryNotes(
                      event.target.value
                    )
                  }
                  placeholder="Any special instructions?"
                  rows={3}
                  className="
                    w-full
                    resize-none
                    rounded-xl
                    border
                    border-[#E8DDD4]
                    bg-white
                    py-3
                    pl-10
                    pr-3
                    text-sm
                    text-[#2E1208]
                    outline-none
                    focus:border-[#C17B4F]
                    focus:ring-2
                    focus:ring-[#C17B4F]/20
                  "
                />
              </div>
            </section>

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
              <div
                className="
                  rounded-xl
                  border
                  border-red-200
                  bg-red-50
                  px-4
                  py-3
                  text-sm
                  text-red-700
                "
                role="alert"
              >
                {error}
              </div>
            )}

            {/* =================================================
                ORDER TOTAL
            ================================================= */}

            <div
              className="
                rounded-2xl
                bg-[#4A1F0E]
                p-5
                text-white
              "
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/60">
                    Order Total
                  </p>

                  <p className="mt-1 text-sm text-white/80">
                    {quantity} ×{" "}
                    {formatPrice(unitPrice)}
                  </p>
                </div>

                <p className="text-xl font-bold">
                  {formatPrice(totalAmount)}
                </p>
              </div>
            </div>
          </div>

          {/* =================================================
              FOOTER
          ================================================= */}

          <div
            className="
              flex
              flex-col-reverse
              gap-3
              border-t
              border-[#E8DDD4]
              bg-white
              px-5
              py-4
              sm:flex-row
              sm:justify-end
              sm:px-7
            "
          >
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="
                h-11
                rounded-xl
                border
                border-[#E8DDD4]
                bg-white
                px-5
                text-sm
                font-semibold
                text-[#4A1F0E]
                transition
                hover:bg-[#F9F6EF]
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
                h-11
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#4A1F0E]
                px-6
                text-sm
                font-bold
                text-white
                shadow-sm
                transition
                hover:bg-[#D4A017]
                hover:text-[#3A180C]
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Placing Order...
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" />
                  Place Hard Copy Order
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HardcopyOrderModal;