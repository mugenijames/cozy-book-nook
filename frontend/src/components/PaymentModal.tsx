// src/components/PaymentModal.tsx
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Smartphone, CreditCard, Building2 } from "lucide-react";
import { toast } from "sonner";
import { createCheckoutSession, approveManualPayment, markBookAsPurchased } from "@/services/api";

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

export function PaymentModal({ book, onClose, onPaymentSubmitted }: PaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("mpesa");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [transactionCode, setTransactionCode] = useState("");

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
      // Call your backend M-Pesa STK Push endpoint
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/payments/mpesa/stkpush`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber,
          amount: book.priceCents / 100,
          bookId: book.id,
          email,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'M-Pesa payment failed');
      }

      toast.success("Check your phone for M-Pesa prompt");
      onPaymentSubmitted();
      
      // Poll for payment status
      pollPaymentStatus(data.checkoutRequestID);
      
    } catch (error: any) {
      toast.error(error.message || "Failed to initiate M-Pesa payment");
    } finally {
      setLoading(false);
    }
  };

  const pollPaymentStatus = async (checkoutRequestID: string) => {
    const maxAttempts = 30; // 30 seconds
    let attempts = 0;
    
    const interval = setInterval(async () => {
      attempts++;
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/payments/mpesa/status/${checkoutRequestID}`);
        const data = await response.json();
        
        if (data.status === 'completed') {
          clearInterval(interval);
          markBookAsPurchased(book.id);
          toast.success("Payment successful! Your book is now available for download.");
          onClose();
        } else if (data.status === 'failed' || attempts >= maxAttempts) {
          clearInterval(interval);
          toast.error(data.error || "Payment failed or timed out");
        }
      } catch (error) {
        console.error('Error polling payment status:', error);
      }
    }, 1000);
  };

  const handlePayPalPayment = async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      // Create PayPal order
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/payments/paypal/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookId: book.id,
          amount: book.priceCents / 100,
          email,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'PayPal payment failed');
      }

      // Redirect to PayPal
      window.location.href = data.approvalUrl;
      
    } catch (error: any) {
      toast.error(error.message || "Failed to initiate PayPal payment");
      setLoading(false);
    }
  };

  const handleBankTransfer = async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    if (!transactionCode) {
      toast.error("Please enter the transaction code");
      return;
    }

    setLoading(true);
    try {
      await approveManualPayment({
        bookId: book.id,
        email,
        transactionCode,
        paymentMethod: "bank_transfer",
        amountCents: book.priceCents,
      });
      
      markBookAsPurchased(book.id);
      toast.success("Payment approved! You can now download the book.");
      onPaymentSubmitted();
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to submit payment");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (paymentMethod === "mpesa") {
      handleMpesaPayment();
    } else if (paymentMethod === "paypal") {
      handlePayPalPayment();
    } else {
      handleBankTransfer();
    }
  };

  const price = (book.priceCents / 100).toLocaleString(undefined, {
    style: 'currency',
    currency: 'KES',
  });

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Your Purchase</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="text-center">
            <p className="font-semibold">{book.title}</p>
            <p className="text-2xl font-bold text-[#C17B4F]">{price}</p>
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
              We'll send your download link to this email
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
            <div className="grid grid-cols-3 gap-3">
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
              
              <Button
                type="button"
                variant={paymentMethod === "bank" ? "default" : "outline"}
                onClick={() => setPaymentMethod("bank")}
                className="flex flex-col items-center py-4 h-auto"
              >
                <Building2 className="h-6 w-6 mb-2" />
                <span className="text-sm">Bank</span>
              </Button>
            </div>
          </div>

          {paymentMethod === "bank" && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="font-semibold mb-2">Bank Transfer Details:</p>
                <p className="text-sm">Bank: Equity Bank</p>
                <p className="text-sm">Account Name: Cozy Book Nook</p>
                <p className="text-sm">Account Number: 1234567890</p>
                <p className="text-sm">Branch: Nairobi</p>
                <p className="text-sm mt-2">Swift Code: EQBLKENA</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="transaction">Transaction Reference</Label>
                <Input
                  id="transaction"
                  placeholder="Enter M-Pesa or bank transaction code"
                  value={transactionCode}
                  onChange={(e) => setTransactionCode(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  After making the payment, enter the transaction reference above
                </p>
              </div>
            </div>
          )}

          {paymentMethod === "paypal" && (
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm">
                You'll be redirected to PayPal to complete your payment securely.
                You can pay with PayPal balance, credit card, or debit card.
              </p>
            </div>
          )}

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-[#C17B4F] hover:bg-[#A55E36]"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading 
              ? "Processing..." 
              : paymentMethod === "mpesa" 
                ? `Pay ${price} with M-Pesa`
                : paymentMethod === "paypal"
                ? `Pay ${price} with PayPal`
                : `Confirm Bank Transfer`
            }
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}