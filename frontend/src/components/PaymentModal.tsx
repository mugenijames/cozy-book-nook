// src/components/PaymentModal.tsx
import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Smartphone, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { markBookAsPurchased } from "@/services/api";

interface PaymentModalProps {
  book: {
    id: string;
    title: string;
    priceCents: number; // stored in KES cents
    slug?: string | null;
  };
  onClose: () => void;
  onPaymentSubmitted: (buyerEmail: string) => void;
}

type PaymentMethod = "mpesa" | "paypal";
type Currency = "KES" | "USD" | "EUR" | "GBP";

/**
 * Static fallback conversion rates (1 KES -> currency).
 * NOTE: these are approximate and should be replaced with a live
 * FX rate lookup (e.g. an endpoint your backend refreshes daily)
 * before relying on this for real charges. M-Pesa always settles
 * in KES regardless of the currency shown here, so the actual
 * STK push amount is always computed from the original KES price.
 */
const FX_RATES: Record<Currency, number> = {
  KES: 1,
  USD: 0.0077,
  EUR: 0.0071,
  GBP: 0.0061,
};

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  KES: "KES",
  USD: "USD",
  EUR: "EUR",
  GBP: "GBP",
};

export function PaymentModal({ book, onClose, onPaymentSubmitted }: PaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("mpesa");
  const [currency, setCurrency] = useState<Currency>("KES");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const displayAmount = useMemo(() => {
    const kes = book.priceCents / 100;
    const converted = kes * FX_RATES[currency];

    return converted.toLocaleString(undefined, {
      style: "currency",
      currency,
      minimumFractionDigits: currency === "KES" ? 0 : 2,
      maximumFractionDigits: currency === "KES" ? 0 : 2,
    });
  }, [book.priceCents, currency]);

  const kesPrice = (book.priceCents / 100).toLocaleString(undefined, {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
  });

  /* =========================================================
     M-PESA (always settles in KES)
  ========================================================= */

  const handleMpesaPayment = async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    if (!phoneNumber) {
      toast.error("Please enter your M-Pesa phone number");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/payments/mpesa/stkpush`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber,
          amount: book.priceCents / 100, // KES — M-Pesa doesn't support other currencies
          bookId: book.id,
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'M-Pesa payment failed');
      }

      toast.success("Check your phone for the M-Pesa prompt. Your book will unlock here automatically once payment is confirmed.");

      pollPaymentStatus(data.checkoutRequestID);

    } catch (error: any) {
      toast.error(error.message || "Failed to initiate M-Pesa payment");
      setLoading(false);
    }
  };

  /**
   * Polls the backend for payment confirmation. Once confirmed, the
   * book is unlocked immediately in this session — no email link
   * required to start the download.
   */
  const pollPaymentStatus = async (checkoutRequestID: string) => {
    const maxAttempts = 60; // ~60 seconds
    let attempts = 0;

    const interval = setInterval(async () => {
      attempts++;
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/payments/mpesa/status/${checkoutRequestID}`);
        const data = await response.json();

        if (data.status === 'completed') {
          clearInterval(interval);
          markBookAsPurchased(book.id);
          toast.success("Payment confirmed! Unlocking your download now.");
          onPaymentSubmitted(email);
          onClose();
        } else if (data.status === 'failed' || attempts >= maxAttempts) {
          clearInterval(interval);
          toast.error(data.error || "Payment failed or timed out");
          setLoading(false);
        }
      } catch (error) {
        console.error('Error polling payment status:', error);
      }
    }, 1000);
  };

  /* =========================================================
     PAYPAL (supports multiple currencies)
  ========================================================= */

  const handlePayPalPayment = async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      const kesAmount = book.priceCents / 100;
      const convertedAmount = Number((kesAmount * FX_RATES[currency]).toFixed(2));

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/payments/paypal/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookId: book.id,
          amount: convertedAmount,
          currency,
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'PayPal payment failed');
      }

      // Kept so BookDetail can auto-unlock on the ?checkout=success
      // return, since PayPal requires leaving the page.
      localStorage.setItem("checkout_email", email);

      window.location.href = data.approvalUrl;

    } catch (error: any) {
      toast.error(error.message || "Failed to initiate PayPal payment");
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (paymentMethod === "mpesa") {
      handleMpesaPayment();
    } else {
      handlePayPalPayment();
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Your Purchase</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="text-center">
            <p className="font-semibold">{book.title}</p>
            <p className="text-2xl font-bold text-[#C17B4F]">{displayAmount}</p>
            {currency !== "KES" && (
              <p className="text-xs text-muted-foreground">
                ≈ {kesPrice} — final charge amount depends on live exchange rates
              </p>
            )}
          </div>

          {/* Currency selector */}
          <div className="space-y-2">
            <Label htmlFor="currency">Pay In</Label>
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {(Object.keys(CURRENCY_SYMBOLS) as Currency[]).map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
            {paymentMethod === "mpesa" && currency !== "KES" && (
              <p className="text-xs text-muted-foreground">
                M-Pesa settles in KES only — you'll be charged {kesPrice} regardless of the currency shown above.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Used for your receipt — your download unlocks automatically on this page, no email link needed
            </p>
          </div>

          {paymentMethod === "mpesa" && (
            <div className="space-y-2">
              <Label htmlFor="phone">M-Pesa Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="254712345678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Enter your M-Pesa registered phone number (e.g., 254712345678)
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label>Select Payment Method</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant={paymentMethod === "mpesa" ? "default" : "outline"}
                onClick={() => setPaymentMethod("mpesa")}
                className="flex flex-col items-center py-4 h-auto"
              >
                <Smartphone className="h-6 w-6 mb-2" />
                <span className="text-sm">M-Pesa</span>
              </Button>

              <Button
                type="button"
                variant={paymentMethod === "paypal" ? "default" : "outline"}
                onClick={() => setPaymentMethod("paypal")}
                className="flex flex-col items-center py-4 h-auto"
              >
                <CreditCard className="h-6 w-6 mb-2" />
                <span className="text-sm">PayPal</span>
              </Button>
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-[#C17B4F] hover:bg-[#A55E36]"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading
              ? "Processing..."
              : `Pay ${displayAmount} with ${paymentMethod === "mpesa" ? "M-Pesa" : "PayPal"}`
            }
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            {paymentMethod === "mpesa"
              ? "Payment is verified automatically — your download unlocks on this page the moment it's confirmed."
              : "You'll be redirected to PayPal, then back here with your download unlocked automatically."}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}