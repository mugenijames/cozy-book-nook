// src/components/PaymentModal.tsx
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Smartphone, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { createCheckoutSession, markBookAsPurchased } from "@/services/api";

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

type PaymentMethod = "mpesa" | "paypal";

export function PaymentModal({ book, onClose, onPaymentSubmitted }: PaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("mpesa");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

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
      
      // Poll for payment status
      pollPaymentStatus(data.checkoutRequestID);
      
    } catch (error: any) {
      toast.error(error.message || "Failed to initiate M-Pesa payment");
      setLoading(false);
    }
  };

  const pollPaymentStatus = async (checkoutRequestID: string) => {
    const maxAttempts = 60; // 60 seconds
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
          onPaymentSubmitted();
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

  const handlePayPalPayment = async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    try {
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

      // Store email for later
      localStorage.setItem("checkout_email", email);
      
      // Redirect to PayPal
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
              : `Pay ${price} with ${paymentMethod === "mpesa" ? "M-Pesa" : "PayPal"}`
            }
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Payment is instant and automatically verified. You'll be able to download immediately after payment.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}