import { Request, Response } from "express";
import { prisma } from '../lib/prisma';

export const getBooks = async (req: Request, res: Response) => {
  try {
    const books = await prisma.book.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json(books);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books" });
  }
};

export const getBook = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const book = await prisma.book.findUnique({
      where: { id },
    });

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json(book);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch book" });
  }
};

export const createBook = async (req: Request, res: Response) => {
  try {
    const { title, description, image, price } = req.body;

    const newBook = await prisma.book.create({
      data: {
        title,
        description,
        image,
        price: Number(price),
      },
    });

    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ error: "Failed to create book" });
  }
};

export const updateBook = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { title, description, image, price } = req.body;

    const updatedBook = await prisma.book.update({
      where: { id },
      data: {
        title,
        description,
        image,
        price: Number(price),
      },
    });

    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ error: "Failed to update book" });
  }
};

export const deleteBook = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    await prisma.book.delete({
      where: { id },
    });

    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete book" });
  }
};