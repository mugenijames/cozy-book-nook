// frontend/src/components/HardcopyOrderModal.tsx

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  X,
  ShoppingBag,
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  MessageSquare,
  Minus,
  Plus,
  Loader2,
  CheckCircle2,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

interface Book {
  id: string;
  title: string;
  author?: string;
  coverImage?: string | null;
  priceCents?: number | null;
}

interface HardcopyOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book;
}

interface OrderFormData {
  customerName: string;
  email: string;
  phoneNumber: string;
  quantity: number;

  deliveryMethod: "PICKUP" | "DELIVERY";

  deliveryTown: string;
  deliveryAddress: string;
  deliveryNotes: string;
}

/* =========================================================
   API CONFIGURATION
========================================================= */

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

/* =========================================================
   FORMAT PRICE
========================================================= */

const formatPrice = (
  priceCents?: number | null
) => {
  if (priceCents == null) {
    return "Price on inquiry";
  }

  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(priceCents / 100);
};

/* =========================================================
   INITIAL FORM
========================================================= */

const initialForm: OrderFormData = {
  customerName: "",
  email: "",
  phoneNumber: "",
  quantity: 1,

  deliveryMethod: "PICKUP",

  deliveryTown: "",
  deliveryAddress: "",
  deliveryNotes: "",
};

/* =========================================================
   COMPONENT
========================================================= */

export default function HardcopyOrderModal({
  isOpen,
  onClose,
  book,
}: HardcopyOrderModalProps) {
  const [form, setForm] =
    useState<OrderFormData>(initialForm);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const [orderNumber, setOrderNumber] =
    useState<string | null>(null);

  const [error, setError] =
    useState("");

  /* =======================================================
     PRICE
  ======================================================= */

  const unitPriceCents =
    book.priceCents ?? null;

  const totalCents =
    unitPriceCents != null
      ? unitPriceCents * form.quantity
      : null;

  /* =======================================================
     RESET WHEN CLOSED
  ======================================================= */

  useEffect(() => {
    if (!isOpen) {
      setForm(initialForm);
      setError("");
      setSuccess(false);
      setOrderNumber(null);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  /* =======================================================
     UPDATE FIELD
  ======================================================= */

  const updateField = <
    K extends keyof OrderFormData
  >(
    field: K,
    value: OrderFormData[K]
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  /* =======================================================
     QUANTITY
  ======================================================= */

  const decreaseQuantity = () => {
    setForm((previous) => ({
      ...previous,
      quantity: Math.max(
        1,
        previous.quantity - 1
      ),
    }));
  };

  const increaseQuantity = () => {
    setForm((previous) => ({
      ...previous,
      quantity:
        previous.quantity + 1,
    }));
  };

  /* =======================================================
     VALIDATE
  ======================================================= */

  const validateForm = () => {
    if (!form.customerName.trim()) {
      return "Please enter your full name.";
    }

    if (!form.email.trim()) {
      return "Please enter your email address.";
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email.trim()
      )
    ) {
      return "Please enter a valid email address.";
    }

    if (!form.phoneNumber.trim()) {
      return "Please enter your phone number.";
    }

    if (
      !Number.isInteger(form.quantity) ||
      form.quantity < 1
    ) {
      return "Quantity must be at least 1.";
    }

    if (
      form.deliveryMethod ===
        "DELIVERY" &&
      !form.deliveryTown.trim()
    ) {
      return "Please enter your delivery town.";
    }

    if (
      form.deliveryMethod ===
        "DELIVERY" &&
      !form.deliveryAddress.trim()
    ) {
      return "Please enter your delivery address.";
    }

    return null;
  };

  /* =======================================================
     SUBMIT ORDER
  ======================================================= */

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    const validationError =
      validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsSubmitting(true);

      /*
       * This matches the Prisma structure:
       *
       * Order
       * ├── orderType
       * ├── customerName
       * ├── email
       * ├── phoneNumber
       * ├── deliveryMethod
       * ├── deliveryTown
       * ├── deliveryAddress
       * ├── deliveryNotes
       * └── items[]
       *
       * OrderItem
       * ├── bookId
       * └── quantity
       */

      const payload = {
        orderType: "HARDCOPY",

        customerName:
          form.customerName.trim(),

        email:
          form.email
            .trim()
            .toLowerCase(),

        phoneNumber:
          form.phoneNumber.trim(),

        deliveryMethod:
          form.deliveryMethod,

        deliveryTown:
          form.deliveryMethod ===
          "DELIVERY"
            ? form.deliveryTown.trim()
            : null,

        deliveryAddress:
          form.deliveryMethod ===
          "DELIVERY"
            ? form.deliveryAddress.trim()
            : null,

        deliveryNotes:
          form.deliveryNotes.trim() ||
          null,

        items: [
          {
            bookId: book.id,
            quantity: form.quantity,
          },
        ],
      };

      const endpoint =
        `${API_BASE_URL}/orders`;

      console.log(
        "Submitting hardcopy order:",
        {
          endpoint,
          payload,
        }
      );

      /* -----------------------------------------------------
         REQUEST
      ----------------------------------------------------- */

      const response =
        await fetch(endpoint, {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
            Accept:
              "application/json",
          },

          body: JSON.stringify(
            payload
          ),
        });

      /* -----------------------------------------------------
         RESPONSE
      ----------------------------------------------------- */

      const contentType =
        response.headers.get(
          "content-type"
        ) || "";

      let data: any;

      if (
        contentType.includes(
          "application/json"
        )
      ) {
        data =
          await response.json();
      } else {
        const text =
          await response.text();

        data = {
          error:
            text ||
            "The server returned an unexpected response.",
        };
      }

      /* -----------------------------------------------------
         SERVER ERROR
      ----------------------------------------------------- */

      if (!response.ok) {
        throw new Error(
          data?.error ||
            data?.message ||
            `Unable to place order. Server returned ${response.status}.`
        );
      }

      /* -----------------------------------------------------
         SUCCESS
      ----------------------------------------------------- */

      const createdOrder =
        data?.order ?? data;

      const reference =
        createdOrder?.id ||
        createdOrder?.orderNumber ||
        data?.orderId ||
        data?.id ||
        null;

      setOrderNumber(reference);

      setSuccess(true);
    } catch (err) {
      console.error(
        "Hardcopy order error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while placing your order."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /* =======================================================
     CLOSE
  ======================================================= */

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }

    onClose();
  };

  /* =======================================================
     DO NOT RENDER
  ======================================================= */

  if (!isOpen) {
    return null;
  }

  /* =======================================================
     RENDER
  ======================================================= */

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
          event.target ===
          event.currentTarget
        ) {
          handleClose();
        }
      }}
    >
      <div
        className="
          relative
          max-h-[92vh]
          w-full
          max-w-2xl
          overflow-y-auto
          rounded-2xl
          bg-white
          shadow-2xl
          dark:bg-slate-900
        "
      >
        {/* =================================================
            HEADER
        ================================================= */}

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
                bg-amber-100
                text-amber-700
                dark:bg-amber-900/30
                dark:text-amber-400
              "
            >
              {success ? (
                <CheckCircle2 size={22} />
              ) : (
                <ShoppingBag size={22} />
              )}
            </div>

            <div>
              <h2
                className="
                  text-lg
                  font-bold
                  text-slate-900
                  dark:text-white
                "
              >
                {success
                  ? "Order Received"
                  : "Order Hardcopy Book"}
              </h2>

              {!success && (
                <p
                  className="
                    text-sm
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  Fill in your details to
                  place your order.
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
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
            aria-label="Close"
          >
            <X size={22} />
          </button>
        </div>

        {/* =================================================
            SUCCESS
        ================================================= */}

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
              <CheckCircle2 size={34} />
            </div>

            <h3
              className="
                text-2xl
                font-bold
                text-slate-900
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
                leading-7
                text-slate-600
                dark:text-slate-300
              "
            >
              Your hardcopy order has
              been received successfully.
              We will contact you using
              the details you provided to
              confirm availability,
              payment and delivery
              arrangements.
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
                  Order Reference
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
                bg-slate-900
                px-6
                py-3
                font-semibold
                text-white
                transition
                hover:bg-slate-800
                dark:bg-white
                dark:text-slate-900
              "
            >
              Done
            </button>
          </div>
        ) : (
          /* =================================================
             FORM
          ================================================= */

          <form onSubmit={handleSubmit}>
            <div
              className="
                space-y-6
                p-5
                sm:p-6
              "
            >
              {/* =================================================
                  BOOK SUMMARY
              ================================================= */}

              <div
                className="
                  flex
                  gap-4
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  p-4
                  dark:border-slate-700
                  dark:bg-slate-800/60
                "
              >
                <div
                  className="
                    h-20
                    w-14
                    shrink-0
                    overflow-hidden
                    rounded-lg
                    bg-slate-200
                    dark:bg-slate-700
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
                      onError={(event) => {
                        event.currentTarget.onerror =
                          null;

                        event.currentTarget.style.display =
                          "none";
                      }}
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
                      <Package
                        size={22}
                        className="text-slate-400"
                      />
                    </div>
                  )}
                </div>

                <div
                  className="
                    min-w-0
                    flex-1
                  "
                >
                  <h3
                    className="
                      font-semibold
                      text-slate-900
                      dark:text-white
                    "
                  >
                    {book.title}
                  </h3>

                  {book.author && (
                    <p
                      className="
                        mt-1
                        text-sm
                        text-slate-500
                        dark:text-slate-400
                      "
                    >
                      by {book.author}
                    </p>
                  )}

                  <p
                    className="
                      mt-2
                      font-semibold
                      text-amber-700
                      dark:text-amber-400
                    "
                  >
                    {formatPrice(
                      book.priceCents
                    )}{" "}
                    per copy
                  </p>
                </div>
              </div>

              {/* =================================================
                  CUSTOMER INFORMATION
              ================================================= */}

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

                <div
                  className="
                    grid
                    gap-4
                    sm:grid-cols-2
                  "
                >
                  {/* Name */}

                  <div>
                    <label
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
                        type="text"
                        value={
                          form.customerName
                        }
                        onChange={(event) =>
                          updateField(
                            "customerName",
                            event.target.value
                          )
                        }
                        placeholder="Your full name"
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
                          transition
                          focus:border-amber-500
                          focus:ring-2
                          focus:ring-amber-500/20
                          dark:border-slate-600
                          dark:bg-slate-800
                          dark:text-white
                        "
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}

                  <div>
                    <label
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
                        type="email"
                        value={
                          form.email
                        }
                        onChange={(event) =>
                          updateField(
                            "email",
                            event.target.value
                          )
                        }
                        placeholder="you@example.com"
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
                          transition
                          focus:border-amber-500
                          focus:ring-2
                          focus:ring-amber-500/20
                          dark:border-slate-600
                          dark:bg-slate-800
                          dark:text-white
                        "
                        required
                      />
                    </div>
                  </div>

                  {/* Phone */}

                  <div className="sm:col-span-2">
                    <label
                      className="
                        mb-1.5
                        block
                        text-sm
                        font-medium
                        text-slate-700
                        dark:text-slate-300
                      "
                    >
                      Phone Number *
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
                        type="tel"
                        value={
                          form.phoneNumber
                        }
                        onChange={(event) =>
                          updateField(
                            "phoneNumber",
                            event.target.value
                          )
                        }
                        placeholder="e.g. 0712 345 678"
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
                          transition
                          focus:border-amber-500
                          focus:ring-2
                          focus:ring-amber-500/20
                          dark:border-slate-600
                          dark:bg-slate-800
                          dark:text-white
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
                <h3
                  className="
                    mb-4
                    text-base
                    font-semibold
                    text-slate-900
                    dark:text-white
                  "
                >
                  Order Details
                </h3>

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    rounded-xl
                    border
                    border-slate-200
                    p-4
                    dark:border-slate-700
                  "
                >
                  <div>
                    <p
                      className="
                        font-medium
                        text-slate-900
                        dark:text-white
                      "
                    >
                      Quantity
                    </p>

                    <p
                      className="
                        mt-1
                        text-sm
                        text-slate-500
                        dark:text-slate-400
                      "
                    >
                      Number of copies
                    </p>
                  </div>

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >
                    <button
                      type="button"
                      onClick={
                        decreaseQuantity
                      }
                      disabled={
                        form.quantity <= 1
                      }
                      className="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-lg
                        border
                        border-slate-300
                        text-slate-700
                        transition
                        hover:bg-slate-100
                        disabled:cursor-not-allowed
                        disabled:opacity-40
                        dark:border-slate-600
                        dark:text-white
                        dark:hover:bg-slate-800
                      "
                    >
                      <Minus size={16} />
                    </button>

                    <span
                      className="
                        min-w-8
                        text-center
                        font-semibold
                        text-slate-900
                        dark:text-white
                      "
                    >
                      {form.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={
                        increaseQuantity
                      }
                      className="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-lg
                        border
                        border-slate-300
                        text-slate-700
                        transition
                        hover:bg-slate-100
                        dark:border-slate-600
                        dark:text-white
                        dark:hover:bg-slate-800
                      "
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </section>

              {/* =================================================
                  DELIVERY
              ================================================= */}

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
                  Delivery / Collection
                </h3>

                <div className="space-y-4">
                  <div>
                    <label
                      className="
                        mb-1.5
                        block
                        text-sm
                        font-medium
                        text-slate-700
                        dark:text-slate-300
                      "
                    >
                      Preferred Method *
                    </label>

                    <select
                      value={
                        form.deliveryMethod
                      }
                      onChange={(event) =>
                        updateField(
                          "deliveryMethod",
                          event.target
                            .value as
                            | "PICKUP"
                            | "DELIVERY"
                        )
                      }
                      className="
                        w-full
                        rounded-xl
                        border
                        border-slate-300
                        bg-white
                        px-3
                        py-3
                        text-sm
                        outline-none
                        transition
                        focus:border-amber-500
                        focus:ring-2
                        focus:ring-amber-500/20
                        dark:border-slate-600
                        dark:bg-slate-800
                        dark:text-white
                      "
                    >
                      <option value="PICKUP">
                        Pickup / Collection
                      </option>

                      <option value="DELIVERY">
                        Delivery
                      </option>
                    </select>
                  </div>

                  {form.deliveryMethod ===
                    "DELIVERY" && (
                    <div
                      className="
                        grid
                        gap-4
                        sm:grid-cols-2
                      "
                    >
                      <div>
                        <label
                          className="
                            mb-1.5
                            block
                            text-sm
                            font-medium
                            text-slate-700
                            dark:text-slate-300
                          "
                        >
                          Town / City *
                        </label>

                        <div className="relative">
                          <MapPin
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
                            type="text"
                            value={
                              form.deliveryTown
                            }
                            onChange={(event) =>
                              updateField(
                                "deliveryTown",
                                event.target
                                  .value
                              )
                            }
                            placeholder="e.g. Nairobi"
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
                              transition
                              focus:border-amber-500
                              focus:ring-2
                              focus:ring-amber-500/20
                              dark:border-slate-600
                              dark:bg-slate-800
                              dark:text-white
                            "
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          className="
                            mb-1.5
                            block
                            text-sm
                            font-medium
                            text-slate-700
                            dark:text-slate-300
                          "
                        >
                          Delivery Address *
                        </label>

                        <input
                          type="text"
                          value={
                            form.deliveryAddress
                          }
                          onChange={(event) =>
                            updateField(
                              "deliveryAddress",
                              event.target
                                .value
                            )
                          }
                          placeholder="Estate, building, street..."
                          className="
                            w-full
                            rounded-xl
                            border
                            border-slate-300
                            bg-white
                            px-3
                            py-3
                            text-sm
                            outline-none
                            transition
                            focus:border-amber-500
                            focus:ring-2
                            focus:ring-amber-500/20
                            dark:border-slate-600
                            dark:bg-slate-800
                            dark:text-white
                          "
                          required
                        />
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* =================================================
                  NOTES
              ================================================= */}

              <section>
                <label
                  className="
                    mb-1.5
                    block
                    text-sm
                    font-medium
                    text-slate-700
                    dark:text-slate-300
                  "
                >
                  Additional Notes
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
                    value={
                      form.deliveryNotes
                    }
                    onChange={(event) =>
                      updateField(
                        "deliveryNotes",
                        event.target.value
                      )
                    }
                    rows={3}
                    placeholder="Any additional information or special instructions..."
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
                      transition
                      focus:border-amber-500
                      focus:ring-2
                      focus:ring-amber-500/20
                      dark:border-slate-600
                      dark:bg-slate-800
                      dark:text-white
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
                    dark:border-red-900/50
                    dark:bg-red-900/20
                    dark:text-red-300
                  "
                >
                  {error}
                </div>
              )}

              {/* =================================================
                  ORDER SUMMARY
              ================================================= */}

              <div
                className="
                  rounded-xl
                  bg-slate-900
                  p-4
                  text-white
                  dark:bg-slate-800
                "
              >
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-4
                  "
                >
                  <div>
                    <p
                      className="
                        text-sm
                        text-slate-300
                      "
                    >
                      Order total
                    </p>

                    <p
                      className="
                        mt-1
                        text-xs
                        text-slate-400
                      "
                    >
                      {form.quantity}{" "}
                      {form.quantity === 1
                        ? "copy"
                        : "copies"}{" "}
                      ×{" "}
                      {formatPrice(
                        book.priceCents
                      )}
                    </p>
                  </div>

                  <p
                    className="
                      text-xl
                      font-bold
                    "
                  >
                    {totalCents == null
                      ? "To be confirmed"
                      : formatPrice(
                          totalCents
                        )}
                  </p>
                </div>

                <p
                  className="
                    mt-3
                    text-xs
                    text-slate-400
                  "
                >
                  Delivery charges, if
                  applicable, will be
                  confirmed before final
                  payment.
                </p>
              </div>
            </div>

            {/* =================================================
                FOOTER
            ================================================= */}

            <div
              className="
                sticky
                bottom-0
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
                onClick={handleClose}
                disabled={isSubmitting}
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
                disabled={isSubmitting}
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-amber-600
                  px-6
                  py-3
                  font-semibold
                  text-white
                  transition
                  hover:bg-amber-700
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
                    Placing Order...
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} />
                    Place Hardcopy Order
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