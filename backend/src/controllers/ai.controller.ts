import { Request, Response } from "express";
import { askAI } from "../services/ai.service";

export const aiAssistant = async (req: Request, res: Response) => {
  const { question } = req.body;
  const answer = await askAI(question);
  res.json({ answer });
};
