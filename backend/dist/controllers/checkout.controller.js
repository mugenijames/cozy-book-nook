"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.approveManualPayment = exports.getDownloadUrl = exports.getUserPurchases = exports.checkPurchaseStatus = exports.handleStripeWebhook = exports.createCheckoutSession = exports.checkoutStatus = void 0;
const stripe_1 = __importDefault(require("stripe"));
const prisma_1 = require("../lib/prisma");
function getStripe() {
    const key = process.env.STRIPE_SECRET_KEY?.trim();
    if (!key)
        return null;
    return new stripe_1.default(key);
}
function publicApiBase() {
    const base = process.env.API_PUBLIC_URL?.replace(/\/+$/, "") ||
        `http://localhost:${process.env.PORT || 5000}`;
    return base;
}
function frontendBase() {
    return (process.env.FRONTEND_URL?.replace(/\/+$/, "") || "http://localhost:8080");
}
const checkoutStatus = (_req, res) => {
    res.json({ enabled: Boolean(process.env.STRIPE_SECRET_KEY?.trim()) });
};
exports.checkoutStatus = checkoutStatus;
const createCheckoutSession = async (req, res) => {
    const stripe = getStripe();
    if (!stripe) {
        return res
            .status(503)
            .json({ error: "Online card payments are not configured on the server." });
    }
    const bookIdOrSlug = String(req.body?.bookId ?? req.body?.id ?? "").trim();
    if (!bookIdOrSlug) {
        return res.status(400).json({ error: "Valid bookId is required." });
    }
    const currency = (process.env.STRIPE_CURRENCY || "usd").toLowerCase();
    const book = await prisma_1.prisma.book.findFirst({
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
    let coverUrl;
    if (book.coverImage) {
        if (book.coverImage.startsWith("http")) {
            coverUrl = book.coverImage;
        }
        else {
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
                            images: coverUrl && coverUrl.startsWith("https") ? [coverUrl] : undefined,
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
    }
    catch (e) {
        console.error("Stripe checkout error:", e);
        return res.status(500).json({
            error: e?.message || "Could not start checkout. Try again later.",
        });
    }
};
exports.createCheckoutSession = createCheckoutSession;
const handleStripeWebhook = async (req, res) => {
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
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    }
    catch (err) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return res.status(400).json({ error: `Webhook Error: ${err.message}` });
    }
    console.log(`📦 Stripe Webhook: ${event.type}`);
    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                console.log(`✅ Checkout completed: ${session.id}`);
                const bookId = session.metadata?.bookId;
                const bookTitle = session.metadata?.bookTitle;
                const customerEmail = session.customer_details?.email;
                if (!bookId || !bookTitle) {
                    console.error('Missing bookId or bookTitle in session metadata');
                    break;
                }
                const transactionCode = `STRIPE_${session.id}_${Date.now()}`;
                await prisma_1.prisma.order.create({
                    data: {
                        bookId: bookId,
                        bookTitle: bookTitle,
                        paymentMethod: 'stripe',
                        transactionCode: transactionCode,
                        email: customerEmail || 'guest@example.com',
                        amountCents: session.amount_total || 0,
                        status: 'approved',
                    },
                });
                console.log(`✅ Order created for book ${bookId}`);
                break;
            }
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }
        res.json({ received: true });
    }
    catch (error) {
        console.error('Error processing webhook:', error);
        res.status(500).json({ error: 'Webhook processing failed' });
    }
};
exports.handleStripeWebhook = handleStripeWebhook;
const checkPurchaseStatus = async (req, res) => {
    try {
        const { bookId } = req.params;
        const { email } = req.query;
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }
        const order = await prisma_1.prisma.order.findFirst({
            where: {
                bookId: bookId,
                email: email,
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
    }
    catch (error) {
        console.error('Error checking purchase status:', error);
        res.status(500).json({ error: 'Failed to check purchase status' });
    }
};
exports.checkPurchaseStatus = checkPurchaseStatus;
const getUserPurchases = async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }
        const orders = await prisma_1.prisma.order.findMany({
            where: {
                email: email,
                status: 'approved',
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        const purchasesWithBooks = await Promise.all(orders.map(async (order) => {
            const book = await prisma_1.prisma.book.findUnique({
                where: { id: order.bookId },
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
        }));
        res.json(purchasesWithBooks);
    }
    catch (error) {
        console.error('Error fetching user purchases:', error);
        res.status(500).json({ error: 'Failed to fetch purchases' });
    }
};
exports.getUserPurchases = getUserPurchases;
const getDownloadUrl = async (req, res) => {
    try {
        const { bookId } = req.params;
        const { email } = req.query;
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }
        const order = await prisma_1.prisma.order.findFirst({
            where: {
                bookId: bookId,
                email: email,
                status: 'approved',
            },
        });
        if (!order) {
            return res.status(403).json({ error: 'You need to purchase this book first' });
        }
        const book = await prisma_1.prisma.book.findUnique({
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
    }
    catch (error) {
        console.error('Error getting download URL:', error);
        res.status(500).json({ error: 'Failed to get download URL' });
    }
};
exports.getDownloadUrl = getDownloadUrl;
const approveManualPayment = async (req, res) => {
    try {
        const { bookId, email, transactionCode, paymentMethod, amountCents } = req.body;
        if (!bookId || !email || !transactionCode) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const book = await prisma_1.prisma.book.findUnique({
            where: { id: bookId },
        });
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        const existingOrder = await prisma_1.prisma.order.findUnique({
            where: { transactionCode },
        });
        if (existingOrder) {
            return res.status(400).json({ error: 'Transaction code already used' });
        }
        const order = await prisma_1.prisma.order.create({
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
    }
    catch (error) {
        console.error('Error approving manual payment:', error);
        res.status(500).json({ error: 'Failed to approve payment' });
    }
};
exports.approveManualPayment = approveManualPayment;
