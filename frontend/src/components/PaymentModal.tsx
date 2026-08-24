// frontend/src/components/PaymentModal.tsx

import { useMemo, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Loader2,
  Smartphone,
  CreditCard,
  CheckCircle2,
} from "lucide-react";

import { toast } from "sonner";

import { markBookAsPurchased } from "@/services/api";

/* ============================================================
   TYPES
============================================================ */

interface PaymentModalProps {
  book: {
    id: string;
    title: string;

    /**
     * Book price is stored in KES cents.
     *
     * Example:
     * 15000 = KES 150.00
     */
    priceCents: number;

    slug?: string | null;
  };

  onClose: () => void;

  onPaymentSubmitted: (
    buyerEmail: string
  ) => void;
}

type PaymentMethod =
  | "mpesa"
  | "paypal";

type Currency =
  | "KES"
  | "USD"
  | "EUR"
  | "GBP";

/* ============================================================
   API BASE URL
============================================================ */

const API_BASE_URL =
  String(
    import.meta.env.VITE_API_BASE_URL ||
      "http://localhost:5000"
  ).replace(/\/$/, "");

/* ============================================================
   FALLBACK FX RATES
============================================================ */

/**
 * These are fallback display rates.
 *
 * IMPORTANT:
 * The backend should ultimately calculate the actual
 * PayPal amount using its own trusted FX rate.
 *
 * M-Pesa always uses KES.
 */
const FX_RATES: Record<
  Currency,
  number
> = {
  KES: 1,
  USD: 0.0077,
  EUR: 0.0071,
  GBP: 0.0061,
};

/* ============================================================
   CURRENCY INFORMATION
============================================================ */

const CURRENCY_INFO: Record<
  Currency,
  {
    label: string;
    symbol: string;
  }
> = {
  KES: {
    label: "Kenyan Shilling",
    symbol: "KES",
  },

  USD: {
    label: "US Dollar",
    symbol: "$",
  },

  EUR: {
    label: "Euro",
    symbol: "€",
  },

  GBP: {
    label: "British Pound",
    symbol: "£",
  },
};

/* ============================================================
   COMPONENT
============================================================ */

export function PaymentModal({
  book,
  onClose,
  onPaymentSubmitted,
}: PaymentModalProps) {
  /* ==========================================================
     STATE
  ========================================================== */

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    paymentMethod,
    setPaymentMethod,
  ] = useState<PaymentMethod>(
    "mpesa"
  );

  const [
    currency,
    setCurrency,
  ] = useState<Currency>("KES");

  const [
    email,
    setEmail,
  ] = useState("");

  const [
    phoneNumber,
    setPhoneNumber,
  ] = useState("");

  const [
    paymentConfirmed,
    setPaymentConfirmed,
  ] = useState(false);

  /* ==========================================================
     KES PRICE
  ========================================================== */

  const kesAmount =
    book.priceCents / 100;

  /* ==========================================================
     DISPLAY AMOUNT
  ========================================================== */

  const displayAmount =
    useMemo(() => {
      /**
       * M-Pesa must always display KES.
       */
      if (
        paymentMethod === "mpesa"
      ) {
        return kesAmount.toLocaleString(
          "en-KE",
          {
            style: "currency",
            currency: "KES",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }
        );
      }

      /**
       * PayPal can use selected currency.
       */
      const converted =
        kesAmount *
        FX_RATES[currency];

      return converted.toLocaleString(
        undefined,
        {
          style: "currency",
          currency,
          minimumFractionDigits:
            currency === "KES"
              ? 0
              : 2,
          maximumFractionDigits:
            currency === "KES"
              ? 0
              : 2,
        }
      );
    }, [
      kesAmount,
      currency,
      paymentMethod,
    ]);

  /* ==========================================================
     KES DISPLAY
  ========================================================== */

  const kesPrice =
    kesAmount.toLocaleString(
      "en-KE",
      {
        style: "currency",
        currency: "KES",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }
    );

  /* ==========================================================
     VALIDATE EMAIL
  ========================================================== */

  const isValidEmail = (
    value: string
  ) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      value.trim()
    );
  };

  /* ==========================================================
     VALIDATE INPUT
  ========================================================== */

  const validateCustomerDetails =
    () => {
      if (!email.trim()) {
        toast.error(
          "Please enter your email address."
        );

        return false;
      }

      if (!isValidEmail(email)) {
        toast.error(
          "Please enter a valid email address."
        );

        return false;
      }

      if (
        paymentMethod === "mpesa" &&
        !phoneNumber.trim()
      ) {
        toast.error(
          "Please enter your M-Pesa phone number."
        );

        return false;
      }

      return true;
    };

  /* ==========================================================
     M-PESA PAYMENT
  ========================================================== */

  const handleMpesaPayment =
    async () => {
      if (
        !validateCustomerDetails()
      ) {
        return;
      }

      setLoading(true);

      try {
        /**
         * M-Pesa ALWAYS charges KES.
         */
        const amount = Math.round(
          kesAmount
        );

        const response =
          await fetch(
            `${API_BASE_URL}/api/payments/mpesa/stkpush`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                phoneNumber:
                  phoneNumber.trim(),

                amount,

                bookId: book.id,

                email:
                  email.trim(),

                currency: "KES",
              }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error ||
              "Failed to initiate M-Pesa payment."
          );
        }

        if (
          !data.checkoutRequestID
        ) {
          throw new Error(
            "M-Pesa did not return a checkout request ID."
          );
        }

        toast.success(
          "M-Pesa payment request sent. Check your phone and enter your M-Pesa PIN."
        );

        /**
         * Start automatic payment verification.
         */
        await pollMpesaPaymentStatus(
          data.checkoutRequestID
        );
      } catch (error: any) {
        console.error(
          "M-Pesa payment error:",
          error
        );

        toast.error(
          error?.message ||
            "Failed to initiate M-Pesa payment."
        );

        setLoading(false);
      }
    };

  /* ==========================================================
     AUTOMATIC M-PESA VERIFICATION
  ========================================================== */

  const pollMpesaPaymentStatus =
    async (
      checkoutRequestID: string
    ) => {
      const maxAttempts = 60;

      let attempts = 0;

      while (
        attempts <
        maxAttempts
      ) {
        attempts++;

        try {
          const response =
            await fetch(
              `${API_BASE_URL}/api/payments/mpesa/status/${encodeURIComponent(
                checkoutRequestID
              )}`
            );

          const data =
            await response.json();

          console.log(
            "💳 M-Pesa payment status:",
            data
          );

          /* ==================================================
             PAYMENT COMPLETED
          ================================================== */

          if (
            data.status ===
            "completed"
          ) {
            setPaymentConfirmed(
              true
            );

            /**
             * Unlock book locally.
             */
            markBookAsPurchased(
              book.id
            );

            toast.success(
              "Payment confirmed successfully!"
            );

            /**
             * Tell parent component.
             */
            onPaymentSubmitted(
              email.trim()
            );

            /**
             * Small delay so customer sees
             * the confirmation message.
             */
            setTimeout(() => {
              onClose();
            }, 1200);

            return;
          }

          /* ==================================================
             PAYMENT FAILED
          ================================================== */

          if (
            data.status ===
            "failed"
          ) {
            toast.error(
              data.error ||
                "M-Pesa payment was not completed."
            );

            setLoading(false);

            return;
          }
        } catch (error) {
          console.error(
            "Payment status check failed:",
            error
          );
        }

        /**
         * Wait one second before checking again.
         */
        await new Promise(
          (resolve) =>
            setTimeout(
              resolve,
              1000
            )
        );
      }

      /* ======================================================
         TIMEOUT
      ====================================================== */

      toast.error(
        "We could not confirm the payment within the expected time. Please check your M-Pesa messages and try again if necessary."
      );

      setLoading(false);
    };

  /* ==========================================================
     PAYPAL PAYMENT
  ========================================================== */

  const handlePayPalPayment =
    async () => {
      if (
        !validateCustomerDetails()
      ) {
        return;
      }

      setLoading(true);

      try {
        /**
         * PayPal amount in selected currency.
         *
         * The backend should independently validate
         * the book price and currency.
         */
        const convertedAmount =
          Number(
            (
              kesAmount *
              FX_RATES[currency]
            ).toFixed(2)
          );

        const response =
          await fetch(
            `${API_BASE_URL}/api/payments/paypal/create-order`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                bookId: book.id,

                amount:
                  convertedAmount,

                currency,

                email:
                  email.trim(),
              }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error ||
              "Failed to create PayPal order."
          );
        }

        if (
          !data.approvalUrl
        ) {
          throw new Error(
            "PayPal approval URL was not returned."
          );
        }

        /**
         * Save customer email so the return page
         * can automatically identify the customer.
         */
        localStorage.setItem(
          "checkout_email",
          email.trim()
        );

        /**
         * Save PayPal order ID.
         */
        if (data.orderId) {
          localStorage.setItem(
            "paypal_order_id",
            data.orderId
          );
        }

        /**
         * Save book ID.
         */
        localStorage.setItem(
          "paypal_book_id",
          book.id
        );

        /**
         * Redirect customer to PayPal.
         */
        window.location.href =
          data.approvalUrl;
      } catch (error: any) {
        console.error(
          "PayPal payment error:",
          error
        );

        toast.error(
          error?.message ||
            "Failed to initiate PayPal payment."
        );

        setLoading(false);
      }
    };

  /* ==========================================================
     SUBMIT PAYMENT
  ========================================================== */

  const handleSubmit =
    async () => {
      if (loading) {
        return;
      }

      if (
        paymentMethod ===
        "mpesa"
      ) {
        await handleMpesaPayment();
      } else {
        await handlePayPalPayment();
      }
    };

  /* ==========================================================
     PAYMENT METHOD CHANGE
  ========================================================== */

  const handlePaymentMethodChange =
    (
      method: PaymentMethod
    ) => {
      setPaymentMethod(
        method
      );

      /**
       * M-Pesa always uses KES.
       */
      if (
        method === "mpesa"
      ) {
        setCurrency("KES");
      }
    };

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <Dialog
      open={true}
      onOpenChange={(
        open
      ) => {
        if (
          !open &&
          !loading
        ) {
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Complete Your Purchase
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">

          {/* ==================================================
              BOOK INFORMATION
          ================================================== */}

          <div className="rounded-lg border bg-muted/30 p-4 text-center">
            <p className="font-semibold">
              {book.title}
            </p>

            <p className="mt-1 text-3xl font-bold text-[#C17B4F]">
              {displayAmount}
            </p>

            {paymentMethod ===
              "paypal" &&
              currency !==
                "KES" && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Approximate equivalent:
                  {" "}
                  {kesPrice}
                </p>
              )}

            {paymentMethod ===
              "mpesa" && (
                <p className="mt-1 text-xs text-muted-foreground">
                  M-Pesa payment is charged
                  in Kenyan Shillings (KES).
                </p>
              )}
          </div>

          {/* ==================================================
              CURRENCY
          ================================================== */}

          <div className="space-y-2">
            <Label htmlFor="currency">
              Payment Currency
            </Label>

            <select
              id="currency"
              value={
                paymentMethod ===
                "mpesa"
                  ? "KES"
                  : currency
              }
              disabled={
                paymentMethod ===
                "mpesa"
              }
              onChange={(event) =>
                setCurrency(
                  event.target
                    .value as Currency
                )
              }
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60"
            >
              {(
                Object.keys(
                  CURRENCY_INFO
                ) as Currency[]
              ).map(
                (code) => (
                  <option
                    key={code}
                    value={code}
                  >
                    {code} —{" "}
                    {
                      CURRENCY_INFO[
                        code
                      ].label
                    }
                  </option>
                )
              )}
            </select>

            {paymentMethod ===
              "mpesa" && (
              <p className="text-xs text-muted-foreground">
                M-Pesa supports KES only.
              </p>
            )}

            {paymentMethod ===
              "paypal" && (
              <p className="text-xs text-muted-foreground">
                Choose the currency you want
                PayPal to charge.
              </p>
            )}
          </div>

          {/* ==================================================
              EMAIL
          ================================================== */}

          <div className="space-y-2">
            <Label htmlFor="email">
              Email Address
            </Label>

            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              disabled={
                loading
              }
              onChange={(
                event
              ) =>
                setEmail(
                  event.target.value
                )
              }
            />

            <p className="text-xs text-muted-foreground">
              Your email is used for your
              purchase record and digital
              book access.
            </p>
          </div>

          {/* ==================================================
              M-PESA PHONE
          ================================================== */}

          {paymentMethod ===
            "mpesa" && (
            <div className="space-y-2">
              <Label htmlFor="phone">
                M-Pesa Phone Number
              </Label>

              <Input
                id="phone"
                type="tel"
                placeholder="254712345678"
                value={
                  phoneNumber
                }
                disabled={
                  loading
                }
                onChange={(
                  event
                ) =>
                  setPhoneNumber(
                    event.target
                      .value
                  )
                }
              />

              <p className="text-xs text-muted-foreground">
                Example:
                {" "}
                254712345678
              </p>
            </div>
          )}

          {/* ==================================================
              PAYMENT METHODS
          ================================================== */}

          <div className="space-y-2">
            <Label>
              Select Payment Method
            </Label>

            <div className="grid grid-cols-2 gap-3">

              {/* M-PESA */}

              <Button
                type="button"
                variant={
                  paymentMethod ===
                  "mpesa"
                    ? "default"
                    : "outline"
                }
                disabled={
                  loading
                }
                onClick={() =>
                  handlePaymentMethodChange(
                    "mpesa"
                  )
                }
                className="flex h-auto flex-col items-center py-4"
              >
                <Smartphone className="mb-2 h-6 w-6" />

                <span className="text-sm">
                  M-Pesa
                </span>

                <span className="mt-1 text-xs opacity-70">
                  KES
                </span>
              </Button>

              {/* PAYPAL */}

              <Button
                type="button"
                variant={
                  paymentMethod ===
                  "paypal"
                    ? "default"
                    : "outline"
                }
                disabled={
                  loading
                }
                onClick={() =>
                  handlePaymentMethodChange(
                    "paypal"
                  )
                }
                className="flex h-auto flex-col items-center py-4"
              >
                <CreditCard className="mb-2 h-6 w-6" />

                <span className="text-sm">
                  PayPal
                </span>

                <span className="mt-1 text-xs opacity-70">
                  USD / EUR / GBP
                </span>
              </Button>
            </div>
          </div>

          {/* ==================================================
              PAYMENT CONFIRMED
          ================================================== */}

          {paymentConfirmed && (
            <div className="flex items-center justify-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
              <CheckCircle2 className="h-5 w-5" />

              <span>
                Payment confirmed!
              </span>
            </div>
          )}

          {/* ==================================================
              PAY BUTTON
          ================================================== */}

          <Button
            onClick={
              handleSubmit
            }
            disabled={
              loading ||
              paymentConfirmed
            }
            className="w-full bg-[#C17B4F] hover:bg-[#A55E36]"
          >
            {loading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}

            {loading
              ? paymentMethod ===
                "mpesa"
                ? "Waiting for payment confirmation..."
                : "Redirecting to PayPal..."
              : `Pay ${displayAmount} with ${
                  paymentMethod ===
                  "mpesa"
                    ? "M-Pesa"
                    : "PayPal"
                }`}
          </Button>

          {/* ==================================================
              SECURITY / AUTOMATION MESSAGE
          ================================================== */}

          <p className="text-center text-xs text-muted-foreground">
            {paymentMethod ===
            "mpesa"
              ? "Your M-Pesa payment is verified automatically. Once Safaricom confirms the payment, your book is unlocked automatically."
              : "PayPal will process the payment and return you to the bookstore. Your order is automatically approved after successful capture."}
          </p>

        </div>
      </DialogContent>
    </Dialog>
  );
}