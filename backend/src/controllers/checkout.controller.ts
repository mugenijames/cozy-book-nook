// backend/src/controllers/checkout.controller.ts

import { Request, Response } from "express";
import Stripe from "stripe";
import { prisma } from "../lib/prisma";

/* =========================================================
   STRIPE CONFIGURATION
========================================================= */

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY?.trim();

  if (!key) {
    return null;
  }

  return new Stripe(key);
}

/* =========================================================
   URL HELPERS
========================================================= */

function publicApiBase(): string {
  const base =
    process.env.API_PUBLIC_URL?.replace(/\/+$/, "") ||
    `http://localhost:${process.env.PORT || 5000}`;

  return base;
}

function frontendBase(): string {
  return (
    process.env.FRONTEND_URL?.replace(/\/+$/, "") ||
    "http://localhost:8080"
  );
}

/* =========================================================
   CHECK STRIPE STATUS
========================================================= */

export const checkoutStatus = (_req: Request, res: Response) => {
  res.json({
    enabled: Boolean(process.env.STRIPE_SECRET_KEY?.trim()),
  });
};

/* =========================================================
   CREATE STRIPE CHECKOUT SESSION
========================================================= */

export const createCheckoutSession = async (
  req: Request,
  res: Response
) => {
  try {
    const stripe = getStripe();

    if (!stripe) {
      return res.status(503).json({
        error: "Online card payments are not configured on the server.",
      });
    }

    const bookIdOrSlug = String(
      req.body?.bookId ?? req.body?.id ?? ""
    ).trim();

    if (!bookIdOrSlug) {
      return res.status(400).json({
        error: "Valid bookId is required.",
      });
    }

    /* =====================================================
       STRIPE CURRENCY

       Stripe uses lowercase currency codes.
       Example:
       KES -> kes
       USD -> usd
       EUR -> eur
       GBP -> gbp
    ===================================================== */

    const currency = (
      process.env.STRIPE_CURRENCY || "usd"
    ).toLowerCase();

    const book = await prisma.book.findFirst({
      where: {
        OR: [
          { id: bookIdOrSlug },
          { slug: bookIdOrSlug },
        ],
      },
    });

    if (!book) {
      return res.status(404).json({
        error: "Book not found.",
      });
    }

    const basePriceCents = book.priceCents;

    if (basePriceCents == null || basePriceCents < 1) {
      return res.status(400).json({
        error: "This book does not have an online price set.",
      });
    }

    const slugSegment = book.slug || book.id;

    const successUrl =
      `${frontendBase()}/book/${encodeURIComponent(
        slugSegment
      )}?checkout=success`;

    const cancelUrl =
      `${frontendBase()}/book/${encodeURIComponent(
        slugSegment
      )}?checkout=cancel`;

    /* =====================================================
       BOOK COVER
    ===================================================== */

    let coverUrl: string | undefined;

    if (book.coverImage) {
      if (book.coverImage.startsWith("http")) {
        coverUrl = book.coverImage;
      } else {
        const path = book.coverImage.startsWith("/")
          ? book.coverImage
          : `/${book.coverImage}`;

        coverUrl = `${publicApiBase()}${path}`;
      }
    }

    /* =====================================================
       CREATE STRIPE CHECKOUT
    ===================================================== */

    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      line_items: [
        {
          quantity: 1,

          price_data: {
            currency,

            /*
             * IMPORTANT:
             *
             * Stripe expects the amount in the smallest
             * unit of the selected currency.
             *
             * Currently the Book price is stored in KES cents.
             *
             * Therefore this controller should only use
             * STRIPE_CURRENCY that matches the stored price
             * unless you add proper FX conversion.
             */

            unit_amount: basePriceCents,

            product_data: {
              name: book.title,

              description: book.description
                ? book.description.slice(0, 450)
                : undefined,

              images:
                coverUrl && coverUrl.startsWith("https")
                  ? [coverUrl]
                  : undefined,
            },
          },
        },
      ],

      success_url: successUrl,
      cancel_url: cancelUrl,

      metadata: {
        bookId: book.id,
        bookTitle: book.title,

        /*
         * Store the original KES price so we can
         * keep a record of the book's base price.
         */
        baseAmountCents: String(basePriceCents),

        currency,
      },
    });

    if (!session.url) {
      return res.status(500).json({
        error: "Stripe did not return a checkout URL.",
      });
    }

    return res.json({
      url: session.url,
      sessionId: session.id,
      currency,
    });
  } catch (error: any) {
    console.error("Stripe checkout error:", error);

    return res.status(500).json({
      error:
        error?.message ||
        "Could not start checkout. Try again later.",
    });
  }
};

/* =========================================================
   STRIPE WEBHOOK
========================================================= */

export const handleStripeWebhook = async (
  req: Request,
  res: Response
) => {
  const stripe = getStripe();

  if (!stripe) {
    return res.status(503).json({
      error: "Stripe not configured",
    });
  }

  const sig = req.headers["stripe-signature"];

  const webhookSecret =
    process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error(
      "STRIPE_WEBHOOK_SECRET is not set"
    );

    return res.status(500).json({
      error: "Webhook secret not configured",
    });
  }

  if (!sig) {
    return res.status(400).json({
      error: "Missing Stripe signature",
    });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      webhookSecret
    );
  } catch (err: any) {
    console.error(
      `Webhook signature verification failed: ${err.message}`
    );

    return res.status(400).json({
      error: `Webhook Error: ${err.message}`,
    });
  }

  console.log(
    `📦 Stripe Webhook: ${event.type}`
  );

  try {
    switch (event.type) {
      /* ===================================================
         CHECKOUT COMPLETED
      =================================================== */

      case "checkout.session.completed": {
        const session =
          event.data.object as Stripe.Checkout.Session;

        console.log(
          `✅ Checkout completed: ${session.id}`
        );

        const bookId = session.metadata?.bookId;
        const bookTitle =
          session.metadata?.bookTitle;

        const customerEmail =
          session.customer_details?.email;

        if (!bookId || !bookTitle) {
          console.error(
            "Missing bookId or bookTitle in session metadata"
          );

          break;
        }

        const bookIdValue = Array.isArray(bookId)
          ? bookId[0]
          : bookId;

        /* =================================================
           GET BOOK
        ================================================= */

        const book = await prisma.book.findUnique({
          where: {
            id: bookIdValue,
          },
        });

        if (!book) {
          console.error(
            `Book not found for Stripe payment: ${bookIdValue}`
          );

          break;
        }

        /* =================================================
           PREVENT DUPLICATE ORDERS
        ================================================= */

        const existingOrder =
          await prisma.order.findFirst({
            where: {
              transactionCode: `STRIPE_${session.id}`,
            },
          });

        if (existingOrder) {
          console.log(
            `⚠️ Stripe order already exists: ${existingOrder.id}`
          );

          break;
        }

        /* =================================================
           AMOUNTS
        ================================================= */

        const amountPaid =
          session.amount_total || 0;

        const baseAmountCents =
          Number(
            session.metadata?.baseAmountCents ||
              book.priceCents ||
              0
          );

        const paymentCurrency =
          (
            session.currency ||
            session.metadata?.currency ||
            "usd"
          ).toUpperCase();

        /* =================================================
           TRANSACTION CODE
        ================================================= */

        const transactionCode =
          `STRIPE_${session.id}`;

        /* =================================================
           CREATE ORDER

           IMPORTANT:
           Use relation connect rather than bookId
           to avoid Prisma relation type conflicts.
        ================================================= */

        const order = await prisma.order.create({
          data: {
            book: {
              connect: {
                id: bookIdValue,
              },
            },

            bookTitle,

            paymentMethod: "stripe",

            transactionCode,

            email:
              customerEmail ||
              "guest@example.com",

            baseAmountCents,

            amountCents: amountPaid,

            currency: paymentCurrency,

            status: "approved",

            paymentStatus: "PAID",
          },
        });

        console.log(
          `✅ Stripe order created: ${order.id}`
        );

        console.log(
          `💰 Base price: ${baseAmountCents} cents KES`
        );

        console.log(
          `💳 Paid: ${amountPaid} ${paymentCurrency}`
        );

        break;
      }

      default:
        console.log(
          `Unhandled event type: ${event.type}`
        );
    }

    return res.json({
      received: true,
    });
  } catch (error) {
    console.error(
      "Error processing Stripe webhook:",
      error
    );

    return res.status(500).json({
      error: "Webhook processing failed",
    });
  }
};

/* =========================================================
   CHECK PURCHASE STATUS
========================================================= */

export const checkPurchaseStatus = async (
  req: Request,
  res: Response
) => {
  try {
    const { bookId } = req.params;

    const bookIdValue = Array.isArray(bookId)
      ? bookId[0]
      : bookId;

    const emailValue = req.query.email;

    const email = Array.isArray(emailValue)
      ? emailValue[0]
      : (emailValue as string);

    if (!email) {
      return res.status(400).json({
        error: "Email is required",
      });
    }

    if (!bookIdValue) {
      return res.status(400).json({
        error: "Book ID is required",
      });
    }

    const order =
      await prisma.order.findFirst({
        where: {
          bookId: bookIdValue,
          email,
          status: "approved",
        },

        select: {
          id: true,
          transactionCode: true,
          createdAt: true,
          currency: true,
          amountCents: true,
          baseAmountCents: true,
          paymentStatus: true,
        },
      });

    return res.json({
      purchased: !!order,

      orderId: order?.id,

      purchasedAt:
        order?.createdAt,

      currency:
        order?.currency,

      amountCents:
        order?.amountCents,

      baseAmountCents:
        order?.baseAmountCents,

      paymentStatus:
        order?.paymentStatus,
    });
  } catch (error) {
    console.error(
      "Error checking purchase status:",
      error
    );

    return res.status(500).json({
      error: "Failed to check purchase status",
    });
  }
};

/* =========================================================
   GET USER PURCHASES
========================================================= */

export const getUserPurchases = async (
  req: Request,
  res: Response
) => {
  try {
    const emailValue = req.query.email;

    const email = Array.isArray(emailValue)
      ? emailValue[0]
      : (emailValue as string);

    if (!email) {
      return res.status(400).json({
        error: "Email is required",
      });
    }

    const orders =
      await prisma.order.findMany({
        where: {
          email,
          status: "approved",
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    const purchasesWithBooks =
      await Promise.all(
        orders.map(async (order) => {
          if (!order.bookId) {
            return {
              ...order,
              book: null,
            };
          }

          const book =
            await prisma.book.findUnique({
              where: {
                id: order.bookId,
              },

              select: {
                id: true,
                title: true,
                author: true,
                coverImage: true,
                pdfUrl: true,
                slug: true,
              },
            });

          return {
            ...order,
            book,
          };
        })
      );

    return res.json(
      purchasesWithBooks
    );
  } catch (error) {
    console.error(
      "Error fetching user purchases:",
      error
    );

    return res.status(500).json({
      error: "Failed to fetch purchases",
    });
  }
};

/* =========================================================
   GET DOWNLOAD URL
========================================================= */

export const getDownloadUrl = async (
  req: Request,
  res: Response
) => {
  try {
    const { bookId } = req.params;

    const bookIdValue = Array.isArray(bookId)
      ? bookId[0]
      : bookId;

    const emailValue = req.query.email;

    const email = Array.isArray(emailValue)
      ? emailValue[0]
      : (emailValue as string);

    if (!email) {
      return res.status(400).json({
        error: "Email is required",
      });
    }

    if (!bookIdValue) {
      return res.status(400).json({
        error: "Book ID is required",
      });
    }

    const order =
      await prisma.order.findFirst({
        where: {
          bookId: bookIdValue,
          email,
          status: "approved",
        },
      });

    if (!order) {
      return res.status(403).json({
        error:
          "You need to purchase this book first",
      });
    }

    const book =
      await prisma.book.findUnique({
        where: {
          id: bookIdValue,
        },

        select: {
          pdfUrl: true,
          title: true,
        },
      });

    if (!book || !book.pdfUrl) {
      return res.status(404).json({
        error:
          "PDF not available for this book",
      });
    }

    return res.json({
      pdfUrl: book.pdfUrl,
      title: book.title,
    });
  } catch (error) {
    console.error(
      "Error getting download URL:",
      error
    );

    return res.status(500).json({
      error: "Failed to get download URL",
    });
  }
};

/* =========================================================
   APPROVE MANUAL PAYMENT
========================================================= */

export const approveManualPayment = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      bookId,
      email,
      transactionCode,
      paymentMethod,
      amountCents,
      currency,
    } = req.body;

    const bookIdValue = Array.isArray(bookId)
      ? bookId[0]
      : bookId;

    const emailValue = Array.isArray(email)
      ? email[0]
      : email;

    const transactionCodeValue =
      Array.isArray(transactionCode)
        ? transactionCode[0]
        : transactionCode;

    if (
      !bookIdValue ||
      !emailValue ||
      !transactionCodeValue
    ) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    /* =====================================================
       FIND BOOK
    ===================================================== */

    const book =
      await prisma.book.findUnique({
        where: {
          id: bookIdValue,
        },
      });

    if (!book) {
      return res.status(404).json({
        error: "Book not found",
      });
    }

    /* =====================================================
       PREVENT DUPLICATE TRANSACTIONS
    ===================================================== */

    const existingOrder =
      await prisma.order.findUnique({
        where: {
          transactionCode:
            transactionCodeValue,
        },
      });

    if (existingOrder) {
      return res.status(400).json({
        error:
          "Transaction code already used",
      });
    }

    /* =====================================================
       AMOUNT

       Book price is stored as KES cents.
    ===================================================== */

    const finalAmountCents =
      Number(amountCents) > 0
        ? Number(amountCents)
        : book.priceCents || 0;

    const finalCurrency =
      String(currency || "KES").toUpperCase();

    /* =====================================================
       CREATE ORDER
    ===================================================== */

    const order =
      await prisma.order.create({
        data: {
          book: {
            connect: {
              id: bookIdValue,
            },
          },

          bookTitle: book.title,

          paymentMethod:
            paymentMethod || "manual",

          transactionCode:
            transactionCodeValue,

          email: emailValue,

          baseAmountCents:
            book.priceCents || 0,

          amountCents:
            finalAmountCents,

          currency:
            finalCurrency,

          status: "approved",

          paymentStatus: "PAID",
        },
      });

    console.log(
      `✅ Manual payment approved: ${order.id}`
    );

    return res.json({
      success: true,

      orderId: order.id,

      currency: finalCurrency,

      amountCents:
        finalAmountCents,

      message:
        "Payment approved and book unlocked",
    });
  } catch (error) {
    console.error(
      "Error approving manual payment:",
      error
    );

    return res.status(500).json({
      error:
        "Failed to approve payment",
    });
  }
};