// backend/src/controllers/order.controller.ts
import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

// Create a new order with AUTOMATIC APPROVAL
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { 
      bookId, 
      bookTitle, 
      paymentMethod, 
      transactionCode, 
      email, 
      amountCents 
    } = req.body;

    // Validation
    if (!bookId || !paymentMethod || !transactionCode || !email) {
      return res.status(400).json({ 
        success: false, 
        error: "Missing required fields: bookId, paymentMethod, transactionCode, email" 
      });
    }

    // Check if book exists
    const book = await prisma.book.findUnique({
      where: { id: String(bookId) }
    });

    if (!book) {
      return res.status(404).json({ 
        success: false, 
        error: "Book not found" 
      });
    }

    // Create order with automatic approval
    const order = await prisma.order.create({
      data: {
        bookId: String(bookId),
        bookTitle: String(bookTitle || book.title),
        paymentMethod: String(paymentMethod),
        transactionCode: String(transactionCode).trim().toUpperCase(),
        email: String(email).toLowerCase().trim(),
        amountCents: Number(amountCents) || 0,
        status: "approved",                    // ← AUTOMATIC APPROVAL
      },
    });

    console.log(`✅ Order automatically approved: ${order.id} | Book: ${bookTitle} | Email: ${email}`);

    res.status(201).json({ 
      success: true, 
      message: "Payment successful! You now have access to the book.",
      orderId: order.id,
      status: "approved"
    });

  } catch (error: any) {
    console.error("Error creating order:", error);

    // Handle duplicate transaction code
    if (error.code === 'P2002') {
      return res.status(409).json({ 
        success: false, 
        error: "This transaction has already been processed." 
      });
    }

    res.status(500).json({ 
      success: false, 
      error: "Failed to process your order. Please try again or contact support." 
    });
  }
};

// Get all orders (for admin)
export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { book: true },
    });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders." });
  }
};

// Manual status update (admin override)
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const order = await prisma.order.update({
      where: { id: String(id) },
      data: { status },
    });

    console.log(`Order ${id} manually updated to ${status}`);
    res.json(order);
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ error: "Failed to update order status." });
  }
};

// Check if user has access to a book
export const checkOrderStatus = async (req: Request, res: Response) => {
  try {
    const { bookId, email } = req.query;

    if (!bookId || !email) {
      return res.status(400).json({ error: "bookId and email are required." });
    }

    const order = await prisma.order.findFirst({
      where: {
        bookId: String(bookId),
        email: String(email).toLowerCase().trim(),
        status: "approved",
      },
    });

    res.json({ 
      approved: Boolean(order),
      orderId: order?.id 
    });
  } catch (error) {
    console.error("Error checking order:", error);
    res.status(500).json({ error: "Failed to check order status." });
  }
};