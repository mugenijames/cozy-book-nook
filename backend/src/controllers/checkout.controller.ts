// backend/src/controllers/checkout.controller.ts
import { Request, Response } from "express";
import Stripe from "stripe";
import { prisma } from "../lib/prisma";

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) return null;
  return new Stripe(key);
}

function publicApiBase(): string {
  const base =
    process.env.API_PUBLIC_URL?.replace(/\/+$/, "") ||
    `http://localhost:${process.env.PORT || 5000}`;
  return base;
}

function frontendBase(): string {
  return (
    process.env.FRONTEND_URL?.replace(/\/+$/, "") || "http://localhost:8080"
  );
}

export const checkoutStatus = (_req: Request, res: Response) => {
  res.json({ enabled: Boolean(process.env.STRIPE_SECRET_KEY?.trim()) });
};

export const createCheckoutSession = async (req: Request, res: Response) => {
  const stripe = getStripe();
  if (!stripe) {
    return res
      .status(503)
      .json({ error: "Online card payments are not configured on the server." });
  }

  // Accept either a UUID id or a slug
  const bookIdOrSlug = String(req.body?.bookId ?? req.body?.id ?? "").trim();
  if (!bookIdOrSlug) {
    return res.status(400).json({ error: "Valid bookId is required." });
  }

  const currency = (process.env.STRIPE_CURRENCY || "usd").toLowerCase();

  // Look up by UUID or slug
  const book = await prisma.book.findFirst({
    where: {
      OR: [
        { id: bookIdOrSlug },
        { slug: bookIdOrSlug }
      ]
    }
  });

  if (!book) {
    return res.status(404).json({ error: "Book not found." });
  }

  const price = book.priceCents;
  if (price == null || price < 1) {
    return res
      .status(400)
      .json({ error: "This book does not have an online price set." });
  }

  const slugSegment = book.slug || book.id;
  const successUrl = `${frontendBase()}/book/${encodeURIComponent(slugSegment)}?checkout=success`;
  const cancelUrl = `${frontendBase()}/book/${encodeURIComponent(slugSegment)}?checkout=cancel`;

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

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency,
            unit_amount: price,
            product_data: {
              name: book.title,
              description: book.description
                ? book.description.slice(0, 450)
                : undefined,
              images:
                coverUrl && coverUrl.startsWith("https") ? [coverUrl] : undefined,
            },
          },
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        bookId: book.id,
        bookTitle: book.title,
      },
    });

    if (!session.url) {
      return res.status(500).json({ error: "Stripe did not return a checkout URL." });
    }

    return res.json({ url: session.url });
  } catch (e: any) {
    console.error("Stripe checkout error:", e);
    return res.status(500).json({
      error: e?.message || "Could not start checkout. Try again later.",
    });
  }
};

// Webhook handler for Stripe events
export const handleStripeWebhook = async (req: Request, res: Response) => {
  const stripe = getStripe();
  if (!stripe) {
    return res.status(503).json({ error: "Stripe not configured" });
  }

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set');
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig!, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  console.log(`📦 Stripe Webhook: ${event.type}`);

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        console.log(`✅ Checkout completed: ${session.id}`);
        
        const bookId = session.metadata?.bookId;
        const bookTitle = session.metadata?.bookTitle;
        const customerEmail = session.customer_details?.email;
        const customerName = session.customer_details?.name;
        
        if (!bookId || !bookTitle) {
          console.error('Missing bookId or bookTitle in session metadata');
          break;
        }

        // Generate a unique transaction code
        const transactionCode = `STRIPE_${session.id}_${Date.now()}`;
        
        // Create the order record
        const order = await prisma.order.create({
          data: {
            bookId: bookId,
            bookTitle: bookTitle,
            paymentMethod: 'stripe',
            transactionCode: transactionCode,
            email: customerEmail || 'guest@example.com',
            amountCents: session.amount_total || 0,
            status: 'approved', // Auto-approve since Stripe payment is confirmed
          },
        });

        console.log(`✅ Order created: ${order.id} for book ${bookId}`);
        
        // Optional: Send email confirmation to customer
        if (customerEmail) {
          console.log(`📧 Should send confirmation email to: ${customerEmail}`);
          // You can implement email sending here
        }
        
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(`⏰ Checkout expired: ${session.id}`);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`❌ Payment failed: ${paymentIntent.id}`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};

// Manual payment approval endpoint (for M-Pesa, bank transfer, etc.)
export const approveManualPayment = async (req: Request, res: Response) => {
  try {
    const { bookId, email, transactionCode, paymentMethod, amountCents } = req.body;
    
    if (!bookId || !email || !transactionCode) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Get book details
    const book = await prisma.book.findUnique({
      where: { id: bookId },
    });
    
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    // Check if transaction already exists
    const existingOrder = await prisma.order.findUnique({
      where: { transactionCode },
    });
    
    if (existingOrder) {
      return res.status(400).json({ error: 'Transaction code already used' });
    }
    
    // Create order
    const order = await prisma.order.create({
      data: {
        bookId,
        bookTitle: book.title,
        paymentMethod: paymentMethod || 'manual',
        transactionCode,
        email,
        amountCents: amountCents || book.priceCents || 0,
        status: 'approved',
      },
    });
    
    console.log(`✅ Manual payment approved: ${order.id}`);
    
    res.json({ 
      success: true, 
      orderId: order.id,
      message: 'Payment approved and book unlocked'
    });
  } catch (error) {
    console.error('Error approving manual payment:', error);
    res.status(500).json({ error: 'Failed to approve payment' });
  }
};

// Check if user has purchased a book
export const checkPurchaseStatus = async (req: Request, res: Response) => {
  try {
    const { bookId } = req.params;
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    const order = await prisma.order.findFirst({
      where: {
        bookId: bookId,
        email: email as string,
        status: 'approved',
      },
      select: {
        id: true,
        transactionCode: true,
        createdAt: true,
      },
    });
    
    res.json({ 
      purchased: !!order,
      orderId: order?.id,
      purchasedAt: order?.createdAt,
    });
  } catch (error) {
    console.error('Error checking purchase status:', error);
    res.status(500).json({ error: 'Failed to check purchase status' });
  }
};

// Get all purchases for a user
export const getUserPurchases = async (req: Request, res: Response) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    const orders = await prisma.order.findMany({
      where: {
        email: email as string,
        status: 'approved',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    // Fetch full book details for each order
    const purchasesWithBooks = await Promise.all(
      orders.map(async (order) => {
        const book = await prisma.book.findUnique({
          where: { id: order.bookId },
          select: {
            id: true,
            title: true,
            author: true,
            coverImage: true,
            pdfUrl: true,
            slug: true,
            description: true,
          },
        });
        
        return {
          ...order,
          book,
        };
      })
    );
    
    res.json(purchasesWithBooks);
  } catch (error) {
    console.error('Error fetching user purchases:', error);
    res.status(500).json({ error: 'Failed to fetch purchases' });
  }
};

// Get download URL for purchased book
export const getDownloadUrl = async (req: Request, res: Response) => {
  try {
    const { bookId } = req.params;
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    // Check if user purchased the book
    const order = await prisma.order.findFirst({
      where: {
        bookId: bookId,
        email: email as string,
        status: 'approved',
      },
    });
    
    if (!order) {
      return res.status(403).json({ error: 'You need to purchase this book first' });
    }
    
    // Get the book with PDF URL
    const book = await prisma.book.findUnique({
      where: { id: bookId },
      select: { pdfUrl: true, title: true },
    });
    
    if (!book || !book.pdfUrl) {
      return res.status(404).json({ error: 'PDF not available for this book' });
    }
    
    res.json({ 
      pdfUrl: book.pdfUrl,
      title: book.title,
    });
  } catch (error) {
    console.error('Error getting download URL:', error);
    res.status(500).json({ error: 'Failed to get download URL' });
  }
};