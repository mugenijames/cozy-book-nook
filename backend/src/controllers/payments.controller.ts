import { Request, Response } from "express";
import prisma from "../config/prisma";

export const initiatePayment = async (req: Request, res: Response) => {
  const { orderId } = req.body;

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return res.status(404).json({ message: "Order not found" });

  // 🔥 Integrate M-Pesa Daraja API or Stripe here
  // Placeholder for production
  await prisma.order.update({
    where: { id: orderId },
    data: { paid: true },
  });

  res.json({ message: "Payment successful", orderId });
};
