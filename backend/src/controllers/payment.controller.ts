// backend/src/controllers/payment.controller.ts
import { Request, Response } from "express";
import axios from "axios";
import { prisma } from "../lib/prisma";

// M-Pesa Configuration
const MPESA_CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY;
const MPESA_CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET;
const MPESA_PASSKEY = process.env.MPESA_PASSKEY;
const MPESA_SHORTCODE = process.env.MPESA_SHORTCODE;
const MPESA_ENV = process.env.MPESA_ENV || "sandbox";

const getMpesaAuthToken = async () => {
  const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString('base64');
  
  const response = await axios.get(
    MPESA_ENV === 'sandbox' 
      ? 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
      : 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
    {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    }
  );
  
  return response.data.access_token;
};

export const initiateMpesaPayment = async (req: Request, res: Response) => {
  try {
    const { phoneNumber, amount, bookId, email } = req.body;
    
    if (!phoneNumber || !amount || !bookId || !email) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    const book = await prisma.book.findUnique({
      where: { id: bookId },
    });
    
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    
    const token = await getMpesaAuthToken();
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = Buffer.from(`${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`).toString('base64');
    
    const response = await axios.post(
      MPESA_ENV === 'sandbox'
        ? 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest'
        : 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        BusinessShortCode: MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: Math.round(amount),
        PartyA: phoneNumber,
        PartyB: MPESA_SHORTCODE,
        PhoneNumber: phoneNumber,
        CallBackURL: `${process.env.API_PUBLIC_URL}/api/payments/mpesa/callback`,
        AccountReference: `BOOK-${bookId}`,
        TransactionDesc: `Purchase: ${book.title}`,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    // Store pending payment
    await prisma.pendingPayment.create({
      data: {
        checkoutRequestID: response.data.CheckoutRequestID,
        bookId,
        bookTitle: book.title,
        email,
        phoneNumber,
        amount,
        status: 'pending',
      },
    });
    
    res.json({
      checkoutRequestID: response.data.CheckoutRequestID,
      message: "Payment initiated. Check your phone for M-Pesa prompt.",
    });
  } catch (error: any) {
    console.error("M-Pesa STK Push error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to initiate M-Pesa payment" });
  }
};

export const mpesaCallback = async (req: Request, res: Response) => {
  try {
    const { Body } = req.body;
    const { stkCallback } = Body;
    
    const checkoutRequestID = stkCallback.CheckoutRequestID;
    const resultCode = stkCallback.ResultCode;
    
    const pendingPayment = await prisma.pendingPayment.findUnique({
      where: { checkoutRequestID },
    });
    
    if (!pendingPayment) {
      return res.status(404).json({ error: "Payment not found" });
    }
    
    if (resultCode === 0) {
      // Payment successful - auto approve
      const { CallbackMetadata } = stkCallback;
      let mpesaReceiptNumber = "";
      if (CallbackMetadata && CallbackMetadata.Item) {
        const receiptItem = CallbackMetadata.Item.find((item: any) => item.Name === "MpesaReceiptNumber");
        if (receiptItem) mpesaReceiptNumber = receiptItem.Value;
      }
      
      // Create order with auto-approval
      await prisma.order.create({
        data: {
          bookId: pendingPayment.bookId,
          bookTitle: pendingPayment.bookTitle,
          paymentMethod: 'mpesa',
          transactionCode: mpesaReceiptNumber || checkoutRequestID,
          email: pendingPayment.email,
          amountCents: Math.round(pendingPayment.amount * 100),
          status: 'approved', // Auto-approved
        },
      });
      
      await prisma.pendingPayment.update({
        where: { id: pendingPayment.id },
        data: {
          status: 'completed',
          mpesaReceiptNumber,
        },
      });
      
      console.log(`✅ M-Pesa payment successful and auto-approved: ${checkoutRequestID}`);
    } else {
      // Payment failed
      await prisma.pendingPayment.update({
        where: { id: pendingPayment.id },
        data: {
          status: 'failed',
          errorMessage: stkCallback.ResultDesc,
        },
      });
      
      console.log(`❌ M-Pesa payment failed: ${stkCallback.ResultDesc}`);
    }
    
    res.json({ ResultCode: 0, ResultDesc: "Success" });
  } catch (error) {
    console.error("M-Pesa callback error:", error);
    res.json({ ResultCode: 1, ResultDesc: "Failed" });
  }
};

export const checkPaymentStatus = async (req: Request, res: Response) => {
  try {
    const { checkoutRequestID } = req.params;
    
    const payment = await prisma.pendingPayment.findUnique({
      where: { checkoutRequestID },
    });
    
    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }
    
    res.json({
      status: payment.status,
      checkoutRequestID: payment.checkoutRequestID,
    });
  } catch (error) {
    console.error("Error checking payment status:", error);
    res.status(500).json({ error: "Failed to check payment status" });
  }
};