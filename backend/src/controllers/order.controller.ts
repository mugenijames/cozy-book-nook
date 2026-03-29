// backend/src/controllers/order.controller.ts
import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

// Create a new pending order
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { bookId, bookTitle, paymentMethod, transactionCode, email, amountCents } = req.body;

    if (!bookId || !paymentMethod || !transactionCode || !email) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const order = await prisma.order.create({
      data: {
        bookId: String(bookId),
        bookTitle: String(bookTitle),
        paymentMethod: String(paymentMethod),
        transactionCode: String(transactionCode),
        email: String(email),
        amountCents: Number(amountCents),
        status: "pending",
      },
    });

    console.log(`✅ New order created: ${order.id} for ${bookTitle}`);
    res.status(201).json({ success: true, orderId: order.id });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order." });
  }
};

// Get all orders (admin)
export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders." });
  }
};

// Approve or reject an order (admin)
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Status must be approved or rejected." });
    }

    const order = await prisma.order.update({
      where: { id: String(id) },
      data: { status },
    });

    console.log(`✅ Order ${id} marked as ${status}`);
    res.json(order);
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ error: "Failed to update order." });
  }
};

// Check if an order is approved for a given book + email
export const checkOrderStatus = async (req: Request, res: Response) => {
  try {
    const { bookId, email } = req.query;

    if (!bookId || !email) {
      return res.status(400).json({ error: "bookId and email are required." });
    }

    const order = await prisma.order.findFirst({
      where: {
        bookId: String(bookId),
        email: String(email),
        status: "approved",
      },
    });

    res.json({ approved: Boolean(order) });
  } catch (error) {
    console.error("Error checking order:", error);
    res.status(500).json({ error: "Failed to check order." });
  }
};