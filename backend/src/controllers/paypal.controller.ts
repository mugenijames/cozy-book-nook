// backend/src/controllers/paypal.controller.ts

import { Request, Response } from "express";
import axios from "axios";

import { prisma } from "../lib/prisma";

/* ============================================================
   PAYPAL CONFIGURATION
============================================================ */

const PAYPAL_CLIENT_ID =
  process.env.PAYPAL_CLIENT_ID;

const PAYPAL_SECRET =
  process.env.PAYPAL_SECRET;

const PAYPAL_ENV =
  process.env.PAYPAL_ENV || "sandbox";

/* ============================================================
   PAYPAL BASE URL
============================================================ */

const PAYPAL_BASE_URL =
  PAYPAL_ENV === "sandbox"
    ? "https://api-m.sandbox.paypal.com"
    : "https://api-m.paypal.com";

/* ============================================================
   SUPPORTED CURRENCIES
============================================================ */

type SupportedCurrency =
  | "USD"
  | "EUR"
  | "GBP"
  | "KES";

/**
 * Fallback exchange rates.
 *
 * These represent:
 *
 * 1 KES = X selected currency
 *
 * IMPORTANT:
 * These rates are used by the backend rather than trusting
 * the frontend.
 *
 * They can later be replaced with a live FX service.
 */
const FX_RATES: Record<
  SupportedCurrency,
  number
> = {
  KES: 1,
  USD: 0.0077,
  EUR: 0.0071,
  GBP: 0.0061,
};

/* ============================================================
   PAYPAL INTERFACES
============================================================ */

interface PayPalTokenResponse {
  access_token: string;
  expires_in: number;
}

interface PayPalOrderResponse {
  id: string;

  status: string;

  links: Array<{
    rel: string;
    href: string;
    method: string;
  }>;
}

interface PayPalCaptureResponse {
  id: string;

  status: string;

  purchase_units: Array<{
    reference_id?: string;

    payments?: {
      captures?: Array<{
        id: string;

        status: string;

        amount: {
          currency_code: string;
          value: string;
        };
      }>;
    };
  }>;
}

/* ============================================================
   GET PAYPAL ACCESS TOKEN
============================================================ */

const getPayPalToken =
  async (): Promise<string> => {
    if (
      !PAYPAL_CLIENT_ID ||
      !PAYPAL_SECRET
    ) {
      throw new Error(
        "PayPal credentials are not configured"
      );
    }

    const auth = Buffer.from(
      `${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`
    ).toString("base64");

    try {
      const response =
        await axios.post<PayPalTokenResponse>(
          `${PAYPAL_BASE_URL}/v1/oauth2/token`,
          "grant_type=client_credentials",
          {
            headers: {
              Authorization:
                `Basic ${auth}`,

              "Content-Type":
                "application/x-www-form-urlencoded",
            },
          }
        );

      return response.data.access_token;
    } catch (error: any) {
      console.error(
        "❌ PayPal authentication error:",
        error.response?.data ||
          error.message
      );

      throw new Error(
        "PayPal authentication failed"
      );
    }
  };

/* ============================================================
   VALIDATE CURRENCY
============================================================ */

const isSupportedCurrency = (
  currency: string
): currency is SupportedCurrency => {
  return [
    "KES",
    "USD",
    "EUR",
    "GBP",
  ].includes(currency);
};

/* ============================================================
   CONVERT KES TO SELECTED CURRENCY
============================================================ */

const convertFromKes = (
  kesAmount: number,
  currency: SupportedCurrency
): number => {
  const rate =
    FX_RATES[currency];

  return Number(
    (kesAmount * rate).toFixed(2)
  );
};

/* ============================================================
   CREATE PAYPAL ORDER
============================================================ */

export const createPayPalOrder =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const {
        bookId,
        email,
        currency,
      } = req.body;

      /* ======================================================
         VALIDATION
      ====================================================== */

      if (!bookId) {
        return res.status(400).json({
          error:
            "Book ID is required",
        });
      }

      if (!email) {
        return res.status(400).json({
          error:
            "Email address is required",
        });
      }

      const requestedCurrency =
        String(
          currency || "USD"
        ).toUpperCase();

      if (
        !isSupportedCurrency(
          requestedCurrency
        )
      ) {
        return res.status(400).json({
          error:
            "Unsupported payment currency",
        });
      }

      /* ======================================================
         FIND BOOK
      ====================================================== */

      const book =
        await prisma.book.findUnique(
          {
            where: {
              id: String(bookId),
            },
          }
        );

      if (!book) {
        return res.status(404).json({
          error:
            "Book not found",
        });
      }

      /* ======================================================
         VERIFY BOOK PRICE
      ====================================================== */

      if (
        book.priceCents === null ||
        book.priceCents <= 0
      ) {
        return res.status(400).json({
          error:
            "This book does not have a valid price",
        });
      }

      /* ======================================================
         IMPORTANT SECURITY RULE
      ====================================================== */

      /**
       * NEVER trust an amount coming from the frontend.
       *
       * The real price comes directly from Prisma.
       */

      const kesAmount =
        book.priceCents / 100;

      const paypalAmount =
        convertFromKes(
          kesAmount,
          requestedCurrency
        );

      if (
        paypalAmount <= 0
      ) {
        return res.status(400).json({
          error:
            "Invalid payment amount",
        });
      }

      console.log("");
      console.log(
        "💳 PAYPAL ORDER"
      );
      console.log(
        "Book:",
        book.title
      );
      console.log(
        "KES price:",
        kesAmount
      );
      console.log(
        "Currency:",
        requestedCurrency
      );
      console.log(
        "PayPal amount:",
        paypalAmount
      );
      console.log(
        "Customer:",
        email
      );

      /* ======================================================
         GET PAYPAL TOKEN
      ====================================================== */

      const token =
        await getPayPalToken();

      /* ======================================================
         CREATE PAYPAL ORDER
      ====================================================== */

      const response =
        await axios.post<PayPalOrderResponse>(
          `${PAYPAL_BASE_URL}/v2/checkout/orders`,
          {
            intent:
              "CAPTURE",

            purchase_units: [
              {
                reference_id:
                  book.id,

                description:
                  book.title,

                custom_id:
                  book.id,

                amount: {
                  currency_code:
                    requestedCurrency,

                  value:
                    paypalAmount.toFixed(
                      2
                    ),
                },
              },
            ],

            application_context: {
              brand_name:
                "Cozy Book Nook",

              landing_page:
                "LOGIN",

              user_action:
                "PAY_NOW",

              return_url:
                `${process.env.FRONTEND_URL}/book/${
                  book.slug ||
                  book.id
                }?paypal=success`,

              cancel_url:
                `${process.env.FRONTEND_URL}/book/${
                  book.slug ||
                  book.id
                }?paypal=cancel`,
            },
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,

              "Content-Type":
                "application/json",

              Prefer:
                "return=representation",
            },
          }
        );

      /* ======================================================
         SAVE PENDING PAYMENT
      ====================================================== */

      await prisma.pendingPayment.create(
        {
          data: {
            paypalOrderId:
              response.data.id,

            bookId:
              book.id,

            bookTitle:
              book.title,

            email:
              String(email).trim(),

            amount:
              paypalAmount,

            currency:
              requestedCurrency,

            baseAmountCents:
              book.priceCents,

            status:
              "pending",
          },
        }
      );

      /* ======================================================
         FIND APPROVAL URL
      ====================================================== */

      const approvalUrl =
        response.data.links.find(
          (link) =>
            link.rel ===
            "approve"
        )?.href;

      if (!approvalUrl) {
        throw new Error(
          "PayPal approval URL was not returned"
        );
      }

      console.log(
        `✅ PayPal order created: ${response.data.id}`
      );

      /* ======================================================
         RESPONSE
      ====================================================== */

      return res.json({
        success: true,

        orderId:
          response.data.id,

        approvalUrl,

        currency:
          requestedCurrency,

        amount:
          paypalAmount,

        baseCurrency:
          "KES",

        baseAmount:
          kesAmount,
      });
    } catch (error: any) {
      console.error(
        "❌ PayPal create order error:",
        error.response?.data ||
          error.message
      );

      return res.status(500).json({
        error:
          "Failed to create PayPal order",

        details:
          PAYPAL_ENV ===
          "sandbox"
            ? error.response?.data
            : undefined,
      });
    }
  };

/* ============================================================
   CAPTURE PAYPAL ORDER
============================================================ */

export const capturePayPalOrder =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const {
        orderId,
      } = req.params;

      if (!orderId) {
        return res.status(400).json({
          error:
            "PayPal order ID is required",
        });
      }

      console.log(
        `💳 Capturing PayPal order: ${orderId}`
      );

      /* ======================================================
         FIND PENDING PAYMENT FIRST
      ====================================================== */

      const pendingPayment =
        await prisma.pendingPayment.findUnique(
          {
            where: {
              paypalOrderId:
                String(orderId),
            },
          }
        );

      if (!pendingPayment) {
        return res.status(404).json({
          error:
            "Pending PayPal payment not found",
        });
      }

      /* ======================================================
         PREVENT DUPLICATE CAPTURE / APPROVAL
      ====================================================== */

      if (
        pendingPayment.status ===
        "completed"
      ) {
        const existingOrder =
          await prisma.order.findFirst(
            {
              where: {
                transactionCode:
                  pendingPayment.paypalCaptureId ||
                  undefined,
              },
            }
          );

        return res.json({
          success: true,

          alreadyCompleted:
            true,

          order:
            existingOrder,

          message:
            "Payment was already approved",
        });
      }

      /* ======================================================
         GET PAYPAL TOKEN
      ====================================================== */

      const token =
        await getPayPalToken();

      /* ======================================================
         CAPTURE PAYMENT
      ====================================================== */

      const response =
        await axios.post<PayPalCaptureResponse>(
          `${PAYPAL_BASE_URL}/v2/checkout/orders/${encodeURIComponent(
            String(orderId)
          )}/capture`,
          {},
          {
            headers: {
              Authorization:
                `Bearer ${token}`,

              "Content-Type":
                "application/json",

              Prefer:
                "return=representation",
            },
          }
        );

      const capture =
        response.data
          .purchase_units?.[0]
          ?.payments
          ?.captures?.[0];

      /* ======================================================
         VERIFY CAPTURE
      ====================================================== */

      if (
        response.data.status !==
          "COMPLETED" ||
        !capture ||
        capture.status !==
          "COMPLETED"
      ) {
        await prisma.pendingPayment.update(
          {
            where: {
              id:
                pendingPayment.id,
            },

            data: {
              status:
                "failed",

              errorMessage:
                `PayPal capture was not completed. Order status: ${response.data.status}`,
            },
          }
        );

        return res.status(400).json({
          success: false,

          error:
            "PayPal payment was not completed",

          paypalStatus:
            response.data.status,
        });
      }

      /* ======================================================
         VERIFY AMOUNT
      ====================================================== */

      const capturedAmount =
        Number(
          capture.amount.value
        );

      const expectedAmount =
        Number(
          pendingPayment.amount
        );

      const capturedCurrency =
        capture.amount
          .currency_code;

      const expectedCurrency =
        pendingPayment.currency;

      /**
       * Never approve a payment where the amount or
       * currency does not match our pending payment.
       */

      if (
        Math.abs(
          capturedAmount -
            expectedAmount
        ) > 0.01
      ) {
        console.error(
          "🚨 PAYPAL AMOUNT MISMATCH"
        );

        console.error(
          "Expected:",
          expectedAmount
        );

        console.error(
          "Received:",
          capturedAmount
        );

        await prisma.pendingPayment.update(
          {
            where: {
              id:
                pendingPayment.id,
            },

            data: {
              status:
                "failed",

              errorMessage:
                `Amount mismatch. Expected ${expectedAmount} ${expectedCurrency}, received ${capturedAmount} ${capturedCurrency}`,
            },
          }
        );

        return res.status(400).json({
          success: false,

          error:
            "Payment amount verification failed",
        });
      }

      if (
        capturedCurrency !==
        expectedCurrency
      ) {
        console.error(
          "🚨 PAYPAL CURRENCY MISMATCH"
        );

        await prisma.pendingPayment.update(
          {
            where: {
              id:
                pendingPayment.id,
            },

            data: {
              status:
                "failed",

              errorMessage:
                `Currency mismatch. Expected ${expectedCurrency}, received ${capturedCurrency}`,
            },
          }
        );

        return res.status(400).json({
          success: false,

          error:
            "Payment currency verification failed",
        });
      }

      /* ======================================================
         TRANSACTION CODE
      ====================================================== */

      const transactionCode =
        capture.id;

      /* ======================================================
         CREATE APPROVED ORDER
      ====================================================== */

      const order =
        await prisma.order.create(
          {
            data: {
              bookId:
                pendingPayment.bookId,

              bookTitle:
                pendingPayment.bookTitle,

              orderType:
                "DIGITAL",

              email:
                pendingPayment.email,

              paymentMethod:
                "paypal",

              transactionCode,

              amountCents:
                Math.round(
                  capturedAmount *
                    100
                ),

              currency:
                capturedCurrency,

              baseAmountCents:
                pendingPayment.baseAmountCents,

              status:
                "APPROVED",

              paymentStatus:
                "PAID",
            },
          }
        );

      /* ======================================================
         UPDATE PENDING PAYMENT
      ====================================================== */

      await prisma.pendingPayment.update(
        {
          where: {
            id:
              pendingPayment.id,
          },

          data: {
            status:
              "completed",

            paypalCaptureId:
              transactionCode,
          },
        }
      );

      /* ======================================================
         SUCCESS LOG
      ====================================================== */

      console.log("");
      console.log(
        "========================================"
      );

      console.log(
        "✅ PAYPAL PAYMENT APPROVED"
      );

      console.log(
        "========================================"
      );

      console.log(
        "PayPal Order:",
        orderId
      );

      console.log(
        "Capture:",
        transactionCode
      );

      console.log(
        "Book:",
        pendingPayment.bookTitle
      );

      console.log(
        "Customer:",
        pendingPayment.email
      );

      console.log(
        "Amount:",
        capturedAmount,
        capturedCurrency
      );

      console.log(
        "Status: APPROVED"
      );

      console.log(
        "========================================"
      );

      console.log("");

      /* ======================================================
         RESPONSE
      ====================================================== */

      return res.json({
        success: true,

        approved: true,

        orderId:
          order.id,

        paypalOrderId:
          orderId,

        transactionCode,

        amount:
          capturedAmount,

        currency:
          capturedCurrency,

        status:
          "APPROVED",

        paymentStatus:
          "PAID",

        bookId:
          pendingPayment.bookId,

        email:
          pendingPayment.email,
      });
    } catch (error: any) {
      console.error(
        "❌ PayPal capture error:",
        error.response?.data ||
          error.message
      );

      return res.status(500).json({
        success: false,

        error:
          "Failed to capture PayPal payment",

        details:
          PAYPAL_ENV ===
          "sandbox"
            ? error.response?.data
            : undefined,
      });
    }
  };