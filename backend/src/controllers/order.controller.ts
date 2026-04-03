// backend/src/controllers/order.controller.ts
import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        book: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const idValue = Array.isArray(id) ? id[0] : id;
    
    if (!idValue) {
      return res.status(400).json({ error: 'Order ID is required' });
    }
    
    const order = await prisma.order.findUnique({
      where: { id: idValue },
      include: {
        book: true,
      },
    });
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
};

export const getOrdersByEmail = async (req: Request, res: Response) => {
  try {
    const emailValue = req.query.email;
    const email = Array.isArray(emailValue) ? emailValue[0] : (emailValue as string);
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    const orders = await prisma.order.findMany({
      where: {
        email: email,
      },
      include: {
        book: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders by email:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const idValue = Array.isArray(id) ? id[0] : id;
    
    if (!idValue) {
      return res.status(400).json({ error: 'Order ID is required' });
    }
    
    const order = await prisma.order.update({
      where: { id: idValue },
      data: { status },
    });
    
    res.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
};