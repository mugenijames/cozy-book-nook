// frontend/src/components/CoursePaymentModal.tsx

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
  ShieldCheck,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { getApiBase, submitCoursePayment } from "@/services/api";

interface CoursePaymentModalProps {
  course: {
    id: string;
    title: string;
    priceCents: number;
    currency?: string;
  };
  enrollmentId: string;
  learnerEmail: string;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

type PaymentMethod = "mpesa" | "paypal";

export function CoursePaymentModal({
  course,
  enrollmentId,
  learnerEmail,
  onClose,
  onPaymentSuccess,
}: CoursePaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("mpesa");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  const kesAmount = course.priceCents / 100;

  const displayAmount = useMemo(() => {
    return kesAmount.toLocaleString("en-KE", {
      style: "currency",
      currency: course.currency || "KES",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }, [kesAmount, course.currency]);

  const handleMpesaPayment = async () => {
    if (!phoneNumber.trim()) {
      toast.error("Please enter your M-Pesa phone number.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${getApiBase()}/api/payments/mpesa/stkpush`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: phoneNumber.trim(),
          amount: Math.round(kesAmount),
          courseId: course.id,
          enrollmentId,
          email: learnerEmail,
          currency: "KES",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to initiate M-Pesa payment.");
      }

      if (!data.checkoutRequestID) {
        throw new Error("M-Pesa did not return a checkout request ID.");
      }

      toast.success("STK push sent! Check your phone to enter your M-Pesa PIN.");
      await pollMpesaPaymentStatus(data.checkoutRequestID);
    } catch (error: any) {
      console.error("M-Pesa payment error:", error);
      toast.error(error?.message || "Failed to initiate M-Pesa payment.");
      setLoading(false);
    }
  };

  const pollMpesaPaymentStatus = async (checkoutRequestID: string) => {
    const maxAttempts = 60;
    let attempts = 0;

    while (attempts < maxAttempts) {
      attempts++;

      try {
        const response = await fetch(
          `${getApiBase()}/api/payments/mpesa/status/${encodeURIComponent(
            checkoutRequestID
          )}`
        );
        const data = await response.json();

        if (data.status === "completed") {
          setPaymentConfirmed(true);
          toast.success("Course payment confirmed successfully!");
          onPaymentSuccess();

          setTimeout(() => {
            onClose();
          }, 1200);

          return;
        }

        if (data.status === "failed") {
          toast.error(data.error || "M-Pesa payment was not completed.");
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error("Payment status check failed:", error);
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    toast.error("Payment confirmation timed out. Please check your M-Pesa messages.");
    setLoading(false);
  };

  const handlePayPalPayment = async () => {
    setLoading(true);
    try {
      // Record PayPal intent or redirect to PayPal order flow
      await submitCoursePayment(enrollmentId, {
        amountCents: course.priceCents,
        method: "PAYPAL",
      });

      toast.success("PayPal transaction initiated.");
      onPaymentSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error?.message || "Failed to initiate PayPal payment.");
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (loading) return;
    if (paymentMethod === "mpesa") {
      await handleMpesaPayment();
    } else {
      await handlePayPalPayment();
    }
  };

  return (
    <Dialog
      open={true}
      onOpenChange={(open) => {
        if (!open && !loading) onClose();
      }}
    >
      <DialogContent className="sm:max-w-lg rounded-2xl p-6 shadow-2xl">
        <DialogHeader className="space-y-1 pb-2 border-b border-gray-100">
          <DialogTitle className="text-xl font-bold text-[#2E1208] flex items-center justify-between">
            <span>Course Enrollment Payment</span>
            <span className="flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <ShieldCheck className="h-3.5 w-3.5" /> SSL Encrypted
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pt-3">
          {/* COURSE & PRICE CARD */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#FBF8F4] to-[#F3EBE0] p-4 border border-[#C9B8A8]/40 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">
                  Enrolling In
                </p>
                <p className="font-heading font-bold text-[#2E1208] text-base mt-0.5 line-clamp-1">
                  {course.title}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{learnerEmail}</p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">
                  Total Due
                </p>
                <p className="text-2xl font-black text-[#C17B4F] mt-0.5">
                  {displayAmount}
                </p>
              </div>
            </div>
          </div>

          {/* PAYMENT METHOD SELECTOR */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-gray-600">
              Select Payment Method
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={loading}
                onClick={() => setPaymentMethod("mpesa")}
                className={`flex flex-col items-center justify-center p-3.5 rounded-xl border-2 transition-all ${
                  paymentMethod === "mpesa"
                    ? "border-emerald-600 bg-emerald-50/50 text-emerald-900 shadow-sm"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
              >
                <Smartphone
                  className={`h-5 w-5 mb-1.5 ${
                    paymentMethod === "mpesa" ? "text-emerald-600" : "text-gray-500"
                  }`}
                />
                <span className="text-sm font-bold">M-Pesa STK Push</span>
                <span className="text-[11px] text-gray-500 mt-0.5">
                  Instant Access
                </span>
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() => setPaymentMethod("paypal")}
                className={`flex flex-col items-center justify-center p-3.5 rounded-xl border-2 transition-all ${
                  paymentMethod === "paypal"
                    ? "border-blue-600 bg-blue-50/50 text-blue-900 shadow-sm"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
              >
                <CreditCard
                  className={`h-5 w-5 mb-1.5 ${
                    paymentMethod === "paypal" ? "text-blue-600" : "text-gray-500"
                  }`}
                />
                <span className="text-sm font-bold">PayPal / Card</span>
                <span className="text-[11px] text-gray-500 mt-0.5">
                  International
                </span>
              </button>
            </div>
          </div>

          {/* M-PESA PHONE INPUT */}
          {paymentMethod === "mpesa" && (
            <div className="space-y-1.5 animate-in fade-in-50 duration-200">
              <Label htmlFor="phone" className="text-xs font-semibold text-gray-700">
                M-Pesa Phone Number <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="phone"
                  type="tel"
                  placeholder="254712345678"
                  value={phoneNumber}
                  disabled={loading}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="h-10 rounded-xl pl-9"
                />
                <Smartphone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              </div>
              <p className="text-[11px] text-gray-500">
                Enter Safaricom number (e.g. 254712345678 or 0712345678).
              </p>
            </div>
          )}

          {/* PAYMENT CONFIRMATION BANNER */}
          {paymentConfirmed && (
            <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-800 animate-in fade-in">
              <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
              <div>
                <p className="font-semibold">Payment confirmed!</p>
                <p className="text-xs text-green-700">
                  Unlocking course lessons...
                </p>
              </div>
            </div>
          )}

          {/* ACTION BUTTON */}
          <Button
            onClick={handleSubmit}
            disabled={loading || paymentConfirmed}
            className={`w-full h-12 rounded-xl font-bold text-white shadow-md transition-all ${
              paymentMethod === "mpesa"
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-[#C17B4F] hover:bg-[#A55E36]"
            }`}
          >
            {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            {loading
              ? "Waiting for payment confirmation..."
              : `Pay ${displayAmount} & Start Learning`}
          </Button>

          {/* FOOTER NOTICE */}
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-500 pt-1">
            <Lock className="h-3 w-3 text-gray-400" />
            <span>
              {paymentMethod === "mpesa"
                ? "Automatic verification via Safaricom STK Push."
                : "Secure encrypted transaction through PayPal."}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}