// src/components/PaymentModal.tsx
import { useState } from "react";
import { X, Smartphone, CreditCard, Building2, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PaymentModalProps {
  book: {
    id: string;
    title: string;
    priceCents: number;
    slug?: string | null;
  };
  onClose: () => void;
  onPaymentSubmitted: () => void;
}

type PaymentMethod = "mpesa" | "paypal" | "bank";

const TEST_DETAILS = {
  mpesa: {
    paybill: "123456",
    account: "TESTBOOKS",
    name: "David Emuria Books",
  },
  paypal: {
    email: "test@davidemuria.com",
    link: "https://paypal.me/testdavidemuria",
  },
  bank: {
    bank: "Test Bank Kenya",
    account: "1234567890",
    name: "David Emuria",
    branch: "Nairobi Branch",
  },
};

export function PaymentModal({ book, onClose, onPaymentSubmitted }: PaymentModalProps) {
  const [method, setMethod] = useState<PaymentMethod>("mpesa");
  const [txCode, setTxCode] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const price = (book.priceCents / 100).toFixed(2);

  async function handleSubmit() {
    if (!txCode.trim()) {
      toast.error("Please enter your transaction code.");
      return;
    }
    if (!email.trim()) {
      toast.error("Please enter your email so we can notify you.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId: book.id,
          bookTitle: book.title,
          paymentMethod: method,
          transactionCode: txCode.trim(),
          email: email.trim(),
          amountCents: book.priceCents,
        }),
      });
      if (!res.ok) throw new Error("Failed to submit order.");
      setSubmitted(true);
      onPaymentSubmitted();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Could not submit. Try again.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E8DDD4] p-5">
          <div>
            <h2 className="font-heading text-lg font-bold text-[#2E1208]">Complete your purchase</h2>
            <p className="text-sm text-[#5C4436]">{book.title} — ${price}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center gap-4 p-8 text-center">
            <CheckCircle className="h-14 w-14 text-green-500" />
            <h3 className="text-xl font-bold text-[#2E1208]">Payment submitted!</h3>
            <p className="text-[#5C4436]">
              We'll verify your payment and notify you at <strong>{email}</strong> once approved.
              The download button will unlock after verification.
            </p>
            <Button
              onClick={onClose}
              className="rounded-full bg-[#C17B4F] px-8 text-white hover:bg-[#A55E36]"
            >
              Close
            </Button>
          </div>
        ) : (
          <div className="p-5 space-y-5">
            {/* Method selector */}
            <div>
              <p className="mb-2 text-sm font-semibold text-[#2E1208]">Choose payment method</p>
              <div className="grid grid-cols-3 gap-2">
                {(["mpesa", "paypal", "bank"] as PaymentMethod[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMethod(m)}
                    className={`flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 text-xs font-semibold transition ${
                      method === m
                        ? "border-[#C17B4F] bg-[#C17B4F]/10 text-[#C17B4F]"
                        : "border-[#E8DDD4] text-[#5C4436] hover:border-[#C17B4F]/50"
                    }`}
                  >
                    {m === "mpesa" && <Smartphone className="h-5 w-5" />}
                    {m === "paypal" && <CreditCard className="h-5 w-5" />}
                    {m === "bank" && <Building2 className="h-5 w-5" />}
                    {m === "mpesa" ? "M-Pesa" : m === "paypal" ? "PayPal" : "Bank"}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment instructions */}
            <div className="rounded-xl bg-[#F9F6EF] p-4 text-sm text-[#2E1208] space-y-1.5">
              {method === "mpesa" && (
                <>
                  <p className="font-semibold text-[#C17B4F]">M-Pesa Instructions</p>
                  <p>1. Go to M-Pesa &rarr; Lipa na M-Pesa &rarr; Pay Bill</p>
                  <p>2. Business No: <strong>{TEST_DETAILS.mpesa.paybill}</strong></p>
                  <p>3. Account No: <strong>{TEST_DETAILS.mpesa.account}</strong></p>
                  <p>4. Amount: <strong>KES {Math.round(book.priceCents * 0.13)}</strong> (approx)</p>
                  <p>5. Enter your M-Pesa PIN and confirm</p>
                  <p className="text-xs text-[#5C4436] pt-1">You'll receive an SMS with a transaction code (e.g. ABC123XYZ)</p>
                </>
              )}
              {method === "paypal" && (
                <>
                  <p className="font-semibold text-[#C17B4F]">PayPal Instructions</p>
                  <p>1. Send <strong>${price} USD</strong> to:</p>
                  <p className="font-mono bg-white rounded px-2 py-1 text-xs">{TEST_DETAILS.paypal.email}</p>
                  <p>2. Or use the link:</p>
                  <a
                    href={TEST_DETAILS.paypal.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#C17B4F] underline text-xs break-all"
                  >
                    {TEST_DETAILS.paypal.link}
                  </a>
                  <p className="text-xs text-[#5C4436] pt-1">Copy the PayPal transaction ID from your confirmation email</p>
                </>
              )}
              {method === "bank" && (
                <>
                  <p className="font-semibold text-[#C17B4F]">Bank Transfer Instructions</p>
                  <p>Bank: <strong>{TEST_DETAILS.bank.bank}</strong></p>
                  <p>Account Name: <strong>{TEST_DETAILS.bank.name}</strong></p>
                  <p>Account No: <strong>{TEST_DETAILS.bank.account}</strong></p>
                  <p>Branch: <strong>{TEST_DETAILS.bank.branch}</strong></p>
                  <p>Amount: <strong>${price}</strong></p>
                  <p className="text-xs text-[#5C4436] pt-1">Use your name as the payment reference and save the receipt</p>
                </>
              )}
            </div>

            {/* Transaction code input */}
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-semibold text-[#2E1208]">
                  Transaction / Reference Code
                </label>
                <input
                  type="text"
                  value={txCode}
                  onChange={(e) => setTxCode(e.target.value)}
                  placeholder={
                    method === "mpesa"
                      ? "e.g. ABC123XYZ"
                      : method === "paypal"
                      ? "e.g. 1AB23456CD789"
                      : "e.g. REF-2026-001"
                  }
                  className="w-full rounded-lg border border-[#E8DDD4] px-3 py-2.5 text-sm outline-none focus:border-[#C17B4F] focus:ring-1 focus:ring-[#C17B4F]"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-[#2E1208]">
                  Your Email (for notification)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-[#E8DDD4] px-3 py-2.5 text-sm outline-none focus:border-[#C17B4F] focus:ring-1 focus:ring-[#C17B4F]"
                />
              </div>
            </div>

            <Button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full rounded-full bg-[#C17B4F] py-6 text-base font-semibold text-white hover:bg-[#A55E36] disabled:opacity-60"
            >
              {submitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</>
              ) : (
                "I have paid — submit for verification"
              )}
            </Button>
            <p className="text-center text-xs text-[#5C4436]">
              Your download will unlock once we verify your payment. Usually within a few hours.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}