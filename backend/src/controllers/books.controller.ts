import { Request, Response } from "express";
import prisma from "../config/prisma";

export const getBooks = async (_req: Request, res: Response) => {
  const books = await prisma.book.findMany();
  res.json(books);
};

export const getBook = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const book = await prisma.book.findUnique({ where: { id } });

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  res.json(book);
};

export const createBook = async (req: Request, res: Response) => {
  const { title, author, description, price } = req.body;

  const book = await prisma.book.create({
    data: { title, author, description, price },
  });

  res.status(201).json(book);
};

export const updateBook = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const book = await prisma.book.update({
    where: { id },
    data: req.body,
  });

  res.json(book);
};

export const deleteBook = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  await prisma.book.delete({ where: { id } });

  res.json({ message: "Book deleted" });
};
