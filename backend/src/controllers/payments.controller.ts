import { Request, Response } from "express";

export const createPayment = async (_req: Request, res: Response) => {
  res.json({
    message: "Payment endpoint working",
  });
};
