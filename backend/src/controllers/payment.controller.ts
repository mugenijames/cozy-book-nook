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

// Log configuration status (without exposing secrets)
console.log(`💳 M-Pesa Configuration: Environment = ${MPESA_ENV}`);
console.log(`💳 M-Pesa Shortcode: ${MPESA_SHORTCODE ? '✓ Set' : '✗ Missing'}`);
console.log(`💳 M-Pesa Passkey: ${MPESA_PASSKEY ? '✓ Set' : '✗ Missing'}`);

interface MpesaTokenResponse {
  access_token: string;
  expires_in: number;
}

interface MpesaStkPushResponse {
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
}

interface MpesaCallbackRequest {
  Body: {
    stkCallback: {
      CheckoutRequestID: string;
      ResultCode: number;
      ResultDesc: string;
      CallbackMetadata?: {
        Item: Array<{
          Name: string;
          Value: string | number;
        }>;
      };
    };
  };
}

const getMpesaAuthToken = async (): Promise<string> => {
  if (!MPESA_CONSUMER_KEY || !MPESA_CONSUMER_SECRET) {
    throw new Error('M-Pesa credentials not configured');
  }

  const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString('base64');
  const url = MPESA_ENV === 'sandbox'
    ? 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
    : 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';

  try {
    const response = await axios.get<MpesaTokenResponse>(url, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    console.log('✅ M-Pesa auth token obtained');
    return response.data.access_token;
  } catch (error: any) {
    console.error('❌ Failed to get M-Pesa token:', error.response?.data || error.message);
    throw new Error('M-Pesa authentication failed');
  }
};

// Format phone number to international format
const formatPhoneNumber = (phone: string): string => {
  let formatted = phone.toString().trim();

  // Remove any leading + or 0
  if (formatted.startsWith('+')) {
    formatted = formatted.substring(1);
  }
  if (formatted.startsWith('0')) {
    formatted = '254' + formatted.substring(1);
  }

  // Ensure it starts with 254
  if (!formatted.startsWith('254')) {
    formatted = '254' + formatted;
  }

  return formatted;
};

export const initiateMpesaPayment = async (req: Request, res: Response) => {
  try {
    const { phoneNumber, amount, bookId, email } = req.body;

    // Validate required fields
    const missingFields = [];
    if (!phoneNumber) missingFields.push('phoneNumber');
    if (!amount) missingFields.push('amount');
    if (!bookId) missingFields.push('bookId');
    if (!email) missingFields.push('email');

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Validate amount
    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Get book details
    const book = await prisma.book.findUnique({
      where: { id: bookId as string },
    });

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Check if book has PDF
    if (!book.pdfUrl) {
      return res.status(400).json({ error: 'This book is not available for purchase yet' });
    }

    const formattedPhone = formatPhoneNumber(phoneNumber);
    const token = await getMpesaAuthToken();
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = Buffer.from(`${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`).toString('base64');

    console.log(`📱 Initiating M-Pesa payment for: ${formattedPhone}, Amount: KES ${numericAmount}`);

    const response = await axios.post<MpesaStkPushResponse>(
      MPESA_ENV === 'sandbox'
        ? 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest'
        : 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        BusinessShortCode: MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: Math.round(numericAmount),
        PartyA: formattedPhone,
        PartyB: MPESA_SHORTCODE,
        PhoneNumber: formattedPhone,
        CallBackURL: `${process.env.API_PUBLIC_URL}/api/payments/mpesa/callback`,
        AccountReference: `BOOK-${book.slug || bookId.slice(0, 8)}`,
        TransactionDesc: `Book: ${book.title.substring(0, 35)}`,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Save pending payment
    await prisma.pendingPayment.create({
      data: {
        checkoutRequestID: response.data.CheckoutRequestID,

        book: {
          connect: {
            id: book.id,
          },
        },

        bookTitle: book.title,
        email: email as string,
        phoneNumber: formattedPhone,

        baseAmountCents: book.priceCents ?? Math.round(numericAmount * 100),
        amount: numericAmount,
        currency: "KES",

        status: "pending",
      },
    });

    console.log(`✅ M-Pesa STK Push initiated: ${response.data.CheckoutRequestID}`);

    res.json({
      success: true,
      checkoutRequestID: response.data.CheckoutRequestID,
      message: "Payment initiated. Check your phone for M-Pesa prompt.",
    });
  } catch (error: any) {
    console.error("M-Pesa STK Push error:", error.response?.data || error.message);

    // Provide user-friendly error message
    let errorMessage = "Failed to initiate M-Pesa payment";
    if (error.response?.data?.errorMessage) {
      errorMessage = error.response.data.errorMessage;
    } else if (error.response?.data?.ResponseDescription) {
      errorMessage = error.response.data.ResponseDescription;
    }

    res.status(500).json({
      error: errorMessage,
      details: MPESA_ENV === 'sandbox' ? error.response?.data : undefined
    });
  }
};

export const mpesaCallback = async (req: Request, res: Response) => {
  try {
    const callbackData = req.body as MpesaCallbackRequest;
    const { stkCallback } = callbackData.Body;

    const checkoutRequestID = stkCallback.CheckoutRequestID;
    const resultCode = stkCallback.ResultCode;
    const resultDesc = stkCallback.ResultDesc;

    console.log(`📞 M-Pesa callback received for: ${checkoutRequestID}, Result: ${resultCode}`);

    const pendingPayment = await prisma.pendingPayment.findUnique({
      where: { checkoutRequestID },
    });

    if (!pendingPayment) {
      console.log(`⚠️ Payment not found: ${checkoutRequestID}`);
      return res.status(404).json({ error: "Payment not found" });
    }

    if (resultCode === 0) {
      let mpesaReceiptNumber = "";
      let amount = pendingPayment.amount;

      if (stkCallback.CallbackMetadata?.Item) {
        for (const item of stkCallback.CallbackMetadata.Item) {
          if (item.Name === "MpesaReceiptNumber") {
            mpesaReceiptNumber = String(item.Value);
          }
          if (item.Name === "Amount") {
            amount = Number(item.Value);
          }
        }
      }

      // Create order record
      await prisma.order.create({
        data: {
          book: {
            connect: {
              id: pendingPayment.bookId,
            },
          },

          bookTitle: pendingPayment.bookTitle,

          paymentMethod: "mpesa",
          transactionCode: mpesaReceiptNumber || checkoutRequestID,

          email: pendingPayment.email,

          baseAmountCents: pendingPayment.baseAmountCents,
          amountCents: Math.round(amount * 100),
          currency: pendingPayment.currency || "KES",

          status: "approved",
          paymentStatus: "PAID",
        },
      });

      // Update pending payment
      await prisma.pendingPayment.update({
        where: { id: pendingPayment.id },
        data: {
          status: 'completed',
          mpesaReceiptNumber,
        },
      });

      console.log(`✅ Payment successful: ${checkoutRequestID}, Receipt: ${mpesaReceiptNumber}`);
    } else {
      await prisma.pendingPayment.update({
        where: { id: pendingPayment.id },
        data: {
          status: 'failed',
          errorMessage: resultDesc,
        },
      });

      console.log(`❌ Payment failed: ${checkoutRequestID} - ${resultDesc}`);
    }

    // Always respond with success to M-Pesa
    res.json({ ResultCode: 0, ResultDesc: "Success" });
  } catch (error) {
    console.error("M-Pesa callback error:", error);
    res.json({ ResultCode: 1, ResultDesc: "Failed" });
  }
};

export const checkPaymentStatus = async (req: Request, res: Response) => {
  try {
    const { checkoutRequestID } = req.params;

    if (!checkoutRequestID) {
      return res.status(400).json({ error: "Checkout Request ID is required" });
    }

    const payment = await prisma.pendingPayment.findUnique({
      where: { checkoutRequestID: checkoutRequestID as string },
    });

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    // Also get the order if completed
    const order = payment.status === 'completed'
      ? await prisma.order.findFirst({
        where: { transactionCode: payment.mpesaReceiptNumber || undefined },
      })
      : null;

    res.json({
      status: payment.status,
      checkoutRequestID: payment.checkoutRequestID,
      receiptNumber: payment.mpesaReceiptNumber,
      downloadUrl: order ? `/api/books/${payment.bookId}/download` : null,
    });
  } catch (error) {
    console.error("Error checking payment status:", error);
    res.status(500).json({ error: "Failed to check payment status" });
  }
};

// Helper endpoint to get payment status by email
export const getUserPayments = async (req: Request, res: Response) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const payments = await prisma.order.findMany({
      where: { email: email as string },
      include: { book: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json(payments);
  } catch (error) {
    console.error("Error fetching user payments:", error);
    res.status(500).json({ error: "Failed to fetch payments" });
  }
};