// backend/src/controllers/paypal.controller.ts
import { Request, Response } from "express";
import axios, { AxiosResponse } from "axios";
import { prisma } from "../lib/prisma";

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
const PAYPAL_ENV = process.env.PAYPAL_ENV || "sandbox";

interface PayPalTokenResponse {
  access_token: string;
}

interface PayPalOrderResponse {
  id: string;
  links: Array<{ rel: string; href: string }>;
}

interface PayPalCaptureResponse {
  id: string;
  status: string;
}

const getPayPalToken = async (): Promise<string> => {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString('base64');
  
  const response: AxiosResponse<PayPalTokenResponse> = await axios.post(
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
    
    if (!bookId || !amount || !email) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    const book = await prisma.book.findUnique({
      where: { id: bookId },
    });
    
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    
    const token = await getPayPalToken();
    
    const response: AxiosResponse<PayPalOrderResponse> = await axios.post(
      PAYPAL_ENV === 'sandbox'
        ? 'https://api-m.sandbox.paypal.com/v2/checkout/orders'
        : 'https://api-m.paypal.com/v2/checkout/orders',
      {
        intent: "CAPTURE",
        purchase_units: [
          {
            reference_id: bookId,
            description: book.title,
            amount: {
              currency_code: "USD",
              value: amount.toFixed(2),
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
        bookId,
        bookTitle: book.title,
        email,
        amount,
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
    
    const token = await getPayPalToken();
    
    const response: AxiosResponse<PayPalCaptureResponse> = await axios.post(
      PAYPAL_ENV === 'sandbox'
        ? `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`
        : `https://api-m.paypal.com/v2/checkout/orders/${orderId}/capture`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    const pendingPayment = await prisma.pendingPayment.findUnique({
      where: { paypalOrderId: orderId },
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
      
      console.log(`✅ PayPal payment auto-approved: ${orderId}`);
    }
    
    res.json(response.data);
  } catch (error: any) {
    console.error("PayPal capture error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to capture PayPal payment" });
  }
};