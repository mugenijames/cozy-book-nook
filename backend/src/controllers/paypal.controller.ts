// backend/src/controllers/paypal.controller.ts
import { Request, Response } from "express";
import axios from "axios";
import { prisma } from "../lib/prisma";

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
const PAYPAL_ENV = process.env.PAYPAL_ENV || "sandbox";

interface PayPalTokenResponse {
  access_token: string;
  expires_in: number;
}

interface PayPalOrderResponse {
  id: string;
  status: string;
  links: Array<{ rel: string; href: string; method: string }>;
}

interface PayPalCaptureResponse {
  id: string;
  status: string;
  purchase_units: Array<{
    payments: {
      captures: Array<{
        id: string;
        status: string;
        amount: { currency_code: string; value: string };
      }>;
    };
  }>;
}

const getPayPalToken = async (): Promise<string> => {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString('base64');
  
  const response = await axios.post<PayPalTokenResponse>(
    PAYPAL_ENV === 'sandbox'
      ? 'https://api-m.sandbox.paypal.com/v1/oauth2/token'
      : 'https://api-m.paypal.com/v1/oauth2/token',
    'grant_type=client_credentials',
    {
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  
  return response.data.access_token;
};

export const createPayPalOrder = async (req: Request, res: Response) => {
  try {
    const { bookId, amount, email } = req.body;
    
    const bookIdValue = Array.isArray(bookId) ? bookId[0] : bookId;
    const emailValue = Array.isArray(email) ? email[0] : email;
    const amountValue = typeof amount === 'number' ? amount : parseFloat(amount);
    
    if (!bookIdValue || !amountValue || !emailValue) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    const book = await prisma.book.findUnique({
      where: { id: bookIdValue },
    });
    
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    
    const token = await getPayPalToken();
    
    const response = await axios.post<PayPalOrderResponse>(
      PAYPAL_ENV === 'sandbox'
        ? 'https://api-m.sandbox.paypal.com/v2/checkout/orders'
        : 'https://api-m.paypal.com/v2/checkout/orders',
      {
        intent: "CAPTURE",
        purchase_units: [
          {
            reference_id: bookIdValue,
            description: book.title,
            amount: {
              currency_code: "USD",
              value: amountValue.toFixed(2),
            },
          },
        ],
        application_context: {
          return_url: `${process.env.FRONTEND_URL}/book/${book.slug || book.id}?paypal=success`,
          cancel_url: `${process.env.FRONTEND_URL}/book/${book.slug || book.id}?paypal=cancel`,
          user_action: "PAY_NOW",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    await prisma.pendingPayment.create({
      data: {
        paypalOrderId: response.data.id,
        bookId: book.id,
        bookTitle: book.title,
        email: emailValue,
        amount: amountValue,
        status: 'pending',
      },
    });
    
    const approvalUrl = response.data.links.find((link) => link.rel === "approve")?.href;
    
    res.json({
      orderId: response.data.id,
      approvalUrl,
    });
  } catch (error: any) {
    console.error("PayPal create order error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to create PayPal order" });
  }
};

export const capturePayPalOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    
    const orderIdValue = Array.isArray(orderId) ? orderId[0] : orderId;
    
    if (!orderIdValue) {
      return res.status(400).json({ error: "Order ID is required" });
    }
    
    const token = await getPayPalToken();
    
    const response = await axios.post<PayPalCaptureResponse>(
      PAYPAL_ENV === 'sandbox'
        ? `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderIdValue}/capture`
        : `https://api-m.paypal.com/v2/checkout/orders/${orderIdValue}/capture`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    const pendingPayment = await prisma.pendingPayment.findUnique({
      where: { paypalOrderId: orderIdValue },
    });
    
    if (pendingPayment) {
      await prisma.order.create({
        data: {
          bookId: pendingPayment.bookId,
          bookTitle: pendingPayment.bookTitle,
          paymentMethod: 'paypal',
          transactionCode: response.data.id,
          email: pendingPayment.email,
          amountCents: Math.round(pendingPayment.amount * 100),
          status: 'approved',
        },
      });
      
      await prisma.pendingPayment.update({
        where: { id: pendingPayment.id },
        data: {
          status: 'completed',
          paypalCaptureId: response.data.id,
        },
      });
      
      console.log(`✅ PayPal payment auto-approved: ${orderIdValue}`);
    }
    
    res.json({ success: true, capture: response.data });
  } catch (error: any) {
    console.error("PayPal capture error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to capture PayPal payment" });
  }
};