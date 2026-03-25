"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCheckoutSession = exports.checkoutStatus = void 0;
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
    const bookId = Number(req.body?.bookId ?? req.body?.id);
    if (!Number.isInteger(bookId) || bookId < 1) {
        return res.status(400).json({ error: "Valid bookId is required." });
    }
    const currency = (process.env.STRIPE_CURRENCY || "usd").toLowerCase();
    const book = await prisma_1.prisma.book.findUnique({ where: { id: bookId } });
    if (!book) {
        return res.status(404).json({ error: "Book not found." });
    }
    const price = book.priceCents;
    if (price == null || price < 1) {
        return res
            .status(400)
            .json({ error: "This book does not have an online price set." });
    }
    const slugSegment = book.slug || String(book.id);
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
                bookId: String(book.id),
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
