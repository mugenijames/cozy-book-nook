import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getAllBooks = async (req: Request, res: Response) => {
  try {
    const books = await prisma.book.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
};

export const getBookById = async (req: Request, res: Response) => {
  const paramId = req.params.id;

  // Handle the possible types safely
  if (!paramId || Array.isArray(paramId)) {
    return res.status(400).json({ error: 'Invalid or missing book ID' });
  }

  const id = paramId; // now TypeScript knows it's string

  try {
    const book = await prisma.book.findUnique({ where: { id } });
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch book' });
  }
};

export const createBook = async (req: Request, res: Response) => {
  try {
    const book = await prisma.book.create({
      data: req.body,
    });
    res.status(201).json(book);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Failed to create book' });
  }
};

export const updateBook = async (req: Request, res: Response) => {
  const paramId = req.params.id;

  if (!paramId || Array.isArray(paramId)) {
    return res.status(400).json({ error: 'Invalid or missing book ID' });
  }

  const id = paramId;

  try {
    const book = await prisma.book.update({
      where: { id },
      data: req.body,
    });
    res.json(book);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Failed to update book' });
  }
};

export const deleteBook = async (req: Request, res: Response) => {
  const paramId = req.params.id;

  if (!paramId || Array.isArray(paramId)) {
    return res.status(400).json({ error: 'Invalid or missing book ID' });
  }

  const id = paramId;

  try {
    await prisma.book.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Failed to delete book' });
  }
};