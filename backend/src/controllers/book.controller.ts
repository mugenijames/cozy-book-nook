// backend/src/controllers/book.controller.ts
import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

// Helper to safely extract single string param
function getSingleParam(value: string | string[] | undefined): string {
  if (!value) throw new Error("Missing required parameter");
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

function parseBookId(value: string): number | null {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function generateUniqueSlug(title: string): Promise<string> {
  const baseSlug = slugify(title) || "book";
  let candidate = baseSlug;
  let counter = 1;

  while (await prisma.book.findUnique({ where: { slug: candidate } })) {
    counter += 1;
    candidate = `${baseSlug}-${counter}`;
  }

  return candidate;
}

// Get all books
const getBooks = async (req: Request, res: Response) => {
  try {
    const books = await prisma.book.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    console.log(`✅ Fetched ${books.length} books`);
    res.json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ error: "Failed to fetch books" });
  }
};

// Get a single book by ID or slug
const getBook = async (req: Request, res: Response) => {
  try {
    const idOrSlug = getSingleParam(req.params.idOrSlug);
    const parsedId = Number(idOrSlug);
    const isNumericId = Number.isInteger(parsedId) && String(parsedId) === idOrSlug;

    console.log(`🔍 Looking for book with ID/slug: ${idOrSlug}`);

    const book = isNumericId
      ? await prisma.book.findFirst({
          where: {
            OR: [{ id: parsedId }, { slug: idOrSlug }],
          },
        })
      : await prisma.book.findUnique({
          where: { slug: idOrSlug },
        });

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    console.log(`✅ Found book: ${book.title}`);
    res.json(book);
  } catch (error) {
    console.error("Error fetching book:", error);
    res.status(500).json({ error: "Failed to fetch book" });
  }
};

// Create a new book
const createBook = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      coverImage,
      author,
      genre,
      publishedYear,
      pages,
      rating,
      priceCents,
    } = req.body;

    // Basic runtime check
    if (!title || !author) {
      return res.status(400).json({ error: "Title and author are required" });
    }

    const slug = req.body.slug ? String(req.body.slug) : await generateUniqueSlug(String(title));

    let resolvedPrice: number | null = null;
    if (priceCents !== undefined && priceCents !== null && priceCents !== "") {
      const n = Number(priceCents);
      resolvedPrice = Number.isInteger(n) && n >= 0 ? n : null;
    }

    const newBook = await prisma.book.create({
      data: {
        title: String(title),
        description: description ? String(description) : null,
        coverImage: coverImage ? String(coverImage) : null,
        author: String(author),
        genre: genre ? String(genre) : null,
        publishedYear: publishedYear ? Number(publishedYear) : null,
        pages: pages ? Number(pages) : null,
        rating: rating ? Number(rating) : 0,
        slug: slug,
        priceCents: resolvedPrice,
      },
    });

    console.log(`✅ Created new book: ${newBook.title} (slug: ${newBook.slug})`);
    res.status(201).json(newBook);
  } catch (error) {
    console.error("Error creating book:", error);
    res.status(500).json({ error: "Failed to create book" });
  }
};

// Update a book
const updateBook = async (req: Request, res: Response) => {
  try {
    const idOrSlug = getSingleParam(req.params.idOrSlug);
    const id = parseBookId(idOrSlug);
    if (id === null) {
      return res.status(400).json({ error: "A numeric book id is required for updates" });
    }

    const {
      title,
      description,
      coverImage,
      author,
      genre,
      publishedYear,
      pages,
      rating,
      slug,
      priceCents,
    } = req.body;

    // Prepare update data
    const updateData: any = {};
    
    if (title !== undefined) updateData.title = String(title);
    if (description !== undefined) updateData.description = String(description);
    if (coverImage !== undefined) updateData.coverImage = String(coverImage);
    if (author !== undefined) updateData.author = String(author);
    if (genre !== undefined) updateData.genre = String(genre);
    if (publishedYear !== undefined) updateData.publishedYear = Number(publishedYear);
    if (pages !== undefined) updateData.pages = Number(pages);
    if (rating !== undefined) updateData.rating = Number(rating);

    if (priceCents !== undefined) {
      if (priceCents === null || priceCents === "") {
        updateData.priceCents = null;
      } else {
        const n = Number(priceCents);
        updateData.priceCents = Number.isInteger(n) && n >= 0 ? n : null;
      }
    }
    
    // Handle slug update
    if (slug !== undefined) {
      updateData.slug = slug;
    } else if (title !== undefined && !slug) {
      // Auto-generate slug from new title if not provided
      const newSlug = slugify(String(title));
      
      // Check if new slug already exists (excluding current book)
      const existingBook = await prisma.book.findFirst({
        where: {
          slug: newSlug,
          NOT: { id: id }
        }
      });
      
      updateData.slug = existingBook ? await generateUniqueSlug(String(title)) : newSlug;
    }

    const updatedBook = await prisma.book.update({
      where: { id },
      data: updateData,
    });

    console.log(`✅ Updated book: ${updatedBook.title}`);
    res.json(updatedBook);
  } catch (error) {
    console.error("Error updating book:", error);
    res.status(500).json({ error: "Failed to update book" });
  }
};

// Delete a book
const deleteBook = async (req: Request, res: Response) => {
  try {
    const idOrSlug = getSingleParam(req.params.idOrSlug);
    const id = parseBookId(idOrSlug);
    if (id === null) {
      return res.status(400).json({ error: "A numeric book id is required for deletion" });
    }

    await prisma.book.delete({ where: { id } });

    console.log(`✅ Deleted book with ID: ${id}`);
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ error: "Failed to delete book" });
  }
};

export { getBooks, getBook, createBook, updateBook, deleteBook };