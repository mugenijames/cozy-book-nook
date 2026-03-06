import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

// Helper to safely extract single string param
function getSingleParam(value: string | string[] | undefined): string {
  if (!value) throw new Error("Missing required parameter");
  if (Array.isArray(value)) {
    // In normal routes this should never happen — but handle it gracefully
    return value[0];
  }
  return value;
}

export const getBooks = async (req: Request, res: Response) => {
  try {
    const books = await prisma.book.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ error: "Failed to fetch books" });
  }
};

export const getBook = async (req: Request, res: Response) => {
  try {
    const id = getSingleParam(req.params.id);

    const book = await prisma.book.findUnique({ where: { id } });
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json(book);
  } catch (error) {
    console.error("Error fetching book:", error);
    res.status(500).json({ error: "Failed to fetch book" });
  }
};

export const createBook = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      coverImage,
      author,
      publishedYear,
      pages,
      rating,
    } = req.body;

    // Basic runtime check — in production use Zod/Joi schema validation
    if (!title || !author) {
      return res.status(400).json({ error: "Title and author are required" });
    }

    const newBook = await prisma.book.create({
      data: {
        title: String(title),
        description: description ? String(description) : null,
        coverImage: coverImage ? String(coverImage) : null,
        author: String(author),
        publishedYear: publishedYear ? Number(publishedYear) : null,
        pages: pages ? Number(pages) : null,
        rating: rating ? Number(rating) : 0,
      },
    });

    res.status(201).json(newBook);
  } catch (error) {
    console.error("Error creating book:", error);
    res.status(500).json({ error: "Failed to create book" });
  }
};

export const updateBook = async (req: Request, res: Response) => {
  try {
    const id = getSingleParam(req.params.id);

    const {
      title,
      description,
      coverImage,
      author,
      publishedYear,
      pages,
      rating,
    } = req.body;

    const updatedBook = await prisma.book.update({
      where: { id },
      data: {
        title: title !== undefined ? String(title) : undefined,
        description: description !== undefined ? String(description) : undefined,
        coverImage: coverImage !== undefined ? String(coverImage) : undefined,
        author: author !== undefined ? String(author) : undefined,
        publishedYear: publishedYear !== undefined ? Number(publishedYear) : undefined,
        pages: pages !== undefined ? Number(pages) : undefined,
        rating: rating !== undefined ? Number(rating) : undefined,
      },
    });

    res.json(updatedBook);
  } catch (error) {
    console.error("Error updating book:", error);
    res.status(500).json({ error: "Failed to update book" });
  }
};

export const deleteBook = async (req: Request, res: Response) => {
  try {
    const id = getSingleParam(req.params.id);

    await prisma.book.delete({ where: { id } });

    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ error: "Failed to delete book" });
  }
};