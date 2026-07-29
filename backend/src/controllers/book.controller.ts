// backend/src/controllers/book.controller.ts

import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

function getSingleParam(value: string | string[] | undefined): string {
  if (!value) throw new Error("Missing required parameter");
  return Array.isArray(value) ? value[0] : value;
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function generateUniqueSlug(
  title: string,
  excludeId?: string
): Promise<string> {
  const baseSlug = slugify(title) || "book";
  let candidate = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.book.findUnique({
      where: { slug: candidate },
    });

    if (!existing || existing.id === excludeId) break;

    counter++;
    candidate = `${baseSlug}-${counter}`;
  }

  return candidate;
}

/* -------------------------------------------------------------------------- */
/*                                   GET ALL                                  */
/* -------------------------------------------------------------------------- */

const getBooks = async (req: Request, res: Response) => {
  try {
    const books = await prisma.book.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({
      error: "Failed to fetch books",
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                                  GET ONE                                   */
/* -------------------------------------------------------------------------- */

const getBook = async (req: Request, res: Response) => {
  try {
    const idOrSlug = getSingleParam(req.params.idOrSlug);

    const uuidPattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    const isUUID = uuidPattern.test(idOrSlug);

    const book = isUUID
      ? await prisma.book.findUnique({
          where: { id: idOrSlug },
        })
      : await prisma.book.findUnique({
          where: { slug: idOrSlug },
        });

    if (!book) {
      return res.status(404).json({
        error: "Book not found",
      });
    }

    res.json(book);
  } catch (error) {
    console.error("Error fetching book:", error);

    res.status(500).json({
      error: "Failed to fetch book",
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                                 CREATE BOOK                                */
/* -------------------------------------------------------------------------- */

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
      pdfUrl,
      pdfPreviewImage,
    } = req.body;

    if (!title || !author) {
      return res.status(400).json({
        error: "Title and author are required",
      });
    }

    const slug = req.body.slug
      ? String(req.body.slug)
      : await generateUniqueSlug(String(title));

    let resolvedPrice: number | null = null;

    if (
      priceCents !== undefined &&
      priceCents !== null &&
      priceCents !== ""
    ) {
      const n = Number(priceCents);

      resolvedPrice =
        Number.isInteger(n) && n >= 0 ? n : null;
    }

    const newBook = await prisma.book.create({
      data: {
        title: String(title),

        author: String(author),

        slug,

        description:
          description === null || description === ""
            ? null
            : String(description),

        coverImage:
          coverImage === null || coverImage === ""
            ? null
            : String(coverImage),

        genre:
          genre === null || genre === ""
            ? null
            : String(genre),

        publishedYear:
          publishedYear === null || publishedYear === ""
            ? null
            : Number(publishedYear),

        pages:
          pages === null || pages === ""
            ? null
            : Number(pages),

        rating:
          rating === undefined || rating === null
            ? 0
            : Number(rating),

        priceCents: resolvedPrice,

        pdfUrl:
          pdfUrl === null || pdfUrl === ""
            ? null
            : String(pdfUrl),

        pdfPreviewImage:
          pdfPreviewImage === null || pdfPreviewImage === ""
            ? null
            : String(pdfPreviewImage),
      },
    });

    res.status(201).json(newBook);
  } catch (error) {
    console.error("Error creating book:", error);

    res.status(500).json({
      error: "Failed to create book",
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                                 UPDATE BOOK                                */
/* -------------------------------------------------------------------------- */

const updateBook = async (req: Request, res: Response) => {
  try {
    const id = getSingleParam(req.params.id);

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
      pdfUrl,
      pdfPreviewImage,
    } = req.body;

    const updateData: any = {};

    if (title !== undefined)
      updateData.title = String(title);

    if (author !== undefined)
      updateData.author = String(author);

    if (description !== undefined) {
      updateData.description =
        description === null || description === ""
          ? null
          : String(description);
    }

    if (coverImage !== undefined) {
      updateData.coverImage =
        coverImage === null || coverImage === ""
          ? null
          : String(coverImage);
    }

    if (genre !== undefined) {
      updateData.genre =
        genre === null || genre === ""
          ? null
          : String(genre);
    }

    if (publishedYear !== undefined) {
      updateData.publishedYear =
        publishedYear === null || publishedYear === ""
          ? null
          : Number(publishedYear);
    }

    if (pages !== undefined) {
      updateData.pages =
        pages === null || pages === ""
          ? null
          : Number(pages);
    }

    if (rating !== undefined) {
      updateData.rating = Number(rating);
    }

    if (pdfUrl !== undefined) {
      updateData.pdfUrl =
        pdfUrl === null || pdfUrl === ""
          ? null
          : String(pdfUrl);
    }

    if (pdfPreviewImage !== undefined) {
      updateData.pdfPreviewImage =
        pdfPreviewImage === null || pdfPreviewImage === ""
          ? null
          : String(pdfPreviewImage);
    }

    if (priceCents !== undefined) {
      if (priceCents === null || priceCents === "") {
        updateData.priceCents = null;
      } else {
        const n = Number(priceCents);

        updateData.priceCents =
          Number.isInteger(n) && n >= 0
            ? n
            : null;
      }
    }

    if (slug !== undefined) {
      updateData.slug = String(slug);
    } else if (title !== undefined) {
      updateData.slug = await generateUniqueSlug(
        String(title),
        id
      );
    }

    const updatedBook = await prisma.book.update({
      where: {
        id,
      },
      data: updateData,
    });

    res.json(updatedBook);
  } catch (error) {
    console.error("Error updating book:", error);

    res.status(500).json({
      error: "Failed to update book",
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                                 DELETE BOOK                                */
/* -------------------------------------------------------------------------- */

const deleteBook = async (req: Request, res: Response) => {
  try {
    const id = getSingleParam(req.params.id);

    await prisma.book.delete({
      where: {
        id,
      },
    });

    res.json({
      message: "Book deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting book:", error);

    res.status(500).json({
      error: "Failed to delete book",
    });
  }
};

export {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
};