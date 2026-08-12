// backend/src/controllers/book.controller.ts

import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

function getSingleParam(
  value: string | string[] | undefined
): string {
  if (!value) {
    throw new Error("Missing required parameter");
  }

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
      where: {
        slug: candidate,
      },
    });

    if (!existing || existing.id === excludeId) {
      break;
    }

    counter++;
    candidate = `${baseSlug}-${counter}`;
  }

  return candidate;
}

/* -------------------------------------------------------------------------- */
/* PUBLIC BOOK RESPONSE                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Public response.
 *
 * IMPORTANT:
 * pdfUrl is NEVER returned here.
 */
function sanitizePublicBook(book: any) {
  return {
    id: book.id,
    slug: book.slug,
    title: book.title,
    author: book.author,

    description: book.description,
    genre: book.genre,

    coverImage: book.coverImage,

    publishedYear: book.publishedYear,
    pages: book.pages,
    rating: book.rating,
    priceCents: book.priceCents,

    createdAt: book.createdAt,
    updatedAt: book.updatedAt,

    pdfPreviewImage: book.pdfPreviewImage,

    hasDigitalEdition: Boolean(book.pdfUrl),

    aiSummary: book.aiSummary,
    shortSummary: book.shortSummary,
    keyThemes: book.keyThemes,
    keywords: book.keywords,
    readingTime: book.readingTime,
    targetAudience: book.targetAudience,
  };
}

/* -------------------------------------------------------------------------- */
/* ADMIN BOOK RESPONSE                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Admin response.
 *
 * This response includes pdfUrl because the admin dashboard
 * needs to know which PDF is attached to the book.
 *
 * IMPORTANT:
 * This endpoint MUST be protected by your admin middleware.
 */
function sanitizeAdminBook(book: any) {
  return {
    id: book.id,
    slug: book.slug,
    title: book.title,
    author: book.author,

    description: book.description,
    genre: book.genre,

    coverImage: book.coverImage,

    publishedYear: book.publishedYear,
    pages: book.pages,
    rating: book.rating,
    priceCents: book.priceCents,

    pdfUrl: book.pdfUrl,
    pdfPreviewImage: book.pdfPreviewImage,

    hasDigitalEdition: Boolean(book.pdfUrl),

    aiSummary: book.aiSummary,
    shortSummary: book.shortSummary,
    keyThemes: book.keyThemes,
    keywords: book.keywords,
    readingTime: book.readingTime,
    targetAudience: book.targetAudience,

    createdAt: book.createdAt,
    updatedAt: book.updatedAt,
  };
}

/* -------------------------------------------------------------------------- */
/* GET ALL PUBLIC BOOKS                                                       */
/* -------------------------------------------------------------------------- */

const getBooks = async (
  req: Request,
  res: Response
) => {
  try {
    const books = await prisma.book.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    const publicBooks = books.map(
      sanitizePublicBook
    );

    return res.json(publicBooks);
  } catch (error: any) {
    console.error(
      "❌ Error fetching books:",
      error
    );

    return res.status(500).json({
      error: "Failed to fetch books",
      details: error?.message,
    });
  }
};

/* -------------------------------------------------------------------------- */
/* GET ONE PUBLIC BOOK                                                        */
/* -------------------------------------------------------------------------- */

const getBook = async (
  req: Request,
  res: Response
) => {
  try {
    const idOrSlug = getSingleParam(
      req.params.idOrSlug
    );

    const uuidPattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    const isUUID =
      uuidPattern.test(idOrSlug);

    const book = isUUID
      ? await prisma.book.findUnique({
          where: {
            id: idOrSlug,
          },
        })
      : await prisma.book.findUnique({
          where: {
            slug: idOrSlug,
          },
        });

    if (!book) {
      return res.status(404).json({
        error: "Book not found",
      });
    }

    return res.json(
      sanitizePublicBook(book)
    );
  } catch (error: any) {
    console.error(
      "❌ Error fetching book:",
      error
    );

    return res.status(500).json({
      error: "Failed to fetch book",
      details: error?.message,
    });
  }
};

/* -------------------------------------------------------------------------- */
/* GET ONE ADMIN BOOK                                                         */
/* -------------------------------------------------------------------------- */

/**
 * ADMIN ONLY
 *
 * This endpoint returns pdfUrl.
 *
 * Example:
 *
 * GET /api/admin/books/:id
 */
const getAdminBook = async (
  req: Request,
  res: Response
) => {
  try {
    const id = getSingleParam(
      req.params.id
    );

    console.log(
      "🔐 Admin fetching book:",
      id
    );

    const book =
      await prisma.book.findUnique({
        where: {
          id,
        },
      });

    if (!book) {
      return res.status(404).json({
        error: "Book not found",
      });
    }

    console.log(
      "📕 Admin book PDF:",
      Boolean(book.pdfUrl)
    );

    console.log(
      "🖼️ Admin book cover:",
      Boolean(book.coverImage)
    );

    return res.json(
      sanitizeAdminBook(book)
    );
  } catch (error: any) {
    console.error(
      "❌ Error fetching admin book:",
      error
    );

    return res.status(500).json({
      error: "Failed to fetch admin book",
      details: error?.message,
    });
  }
};

/* -------------------------------------------------------------------------- */
/* CREATE BOOK                                                                */
/* -------------------------------------------------------------------------- */

const createBook = async (
  req: Request,
  res: Response
) => {
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
        error:
          "Title and author are required",
      });
    }

    const slug = req.body.slug
      ? String(req.body.slug).trim()
      : await generateUniqueSlug(
          String(title)
        );

    let resolvedPrice:
      | number
      | null = null;

    if (
      priceCents !== undefined &&
      priceCents !== null &&
      priceCents !== ""
    ) {
      const n = Number(priceCents);

      if (
        Number.isInteger(n) &&
        n >= 0
      ) {
        resolvedPrice = n;
      }
    }

    const newBook =
      await prisma.book.create({
        data: {
          title: String(title).trim(),

          author: String(author).trim(),

          slug,

          description:
            description === null ||
            description === ""
              ? null
              : String(description),

          coverImage:
            coverImage === null ||
            coverImage === ""
              ? null
              : String(coverImage),

          genre:
            genre === null ||
            genre === ""
              ? null
              : String(genre),

          publishedYear:
            publishedYear === null ||
            publishedYear === ""
              ? null
              : Number(publishedYear),

          pages:
            pages === null ||
            pages === ""
              ? null
              : Number(pages),

          rating:
            rating === undefined ||
            rating === null ||
            rating === ""
              ? 0
              : Number(rating),

          priceCents:
            resolvedPrice,

          pdfUrl:
            pdfUrl === null ||
            pdfUrl === ""
              ? null
              : String(pdfUrl),

          pdfPreviewImage:
            pdfPreviewImage === null ||
            pdfPreviewImage === ""
              ? null
              : String(pdfPreviewImage),
        },
      });

    console.log(
      "✅ Book created:",
      {
        id: newBook.id,
        title: newBook.title,
        hasCover: Boolean(
          newBook.coverImage
        ),
        hasPdf: Boolean(
          newBook.pdfUrl
        ),
        hasPreview: Boolean(
          newBook.pdfPreviewImage
        ),
      }
    );

    /*
     * Return the admin version because this
     * endpoint is used by the admin dashboard.
     */
    return res.status(201).json(
      sanitizeAdminBook(newBook)
    );
  } catch (error: any) {
    console.error(
      "❌ Error creating book:",
      error
    );

    return res.status(500).json({
      error: "Failed to create book",
      details: error?.message,
      code: error?.code,
    });
  }
};

/* -------------------------------------------------------------------------- */
/* UPDATE BOOK                                                                */
/* -------------------------------------------------------------------------- */

const updateBook = async (
  req: Request,
  res: Response
) => {
  try {
    const id = getSingleParam(
      req.params.id
    );

    console.log("");
    console.log(
      "========================================"
    );
    console.log(
      "📚 UPDATE BOOK"
    );
    console.log(
      "========================================"
    );

    console.log(
      "Book ID:",
      id
    );

    const existingBook =
      await prisma.book.findUnique({
        where: {
          id,
        },
      });

    if (!existingBook) {
      return res.status(404).json({
        error: "Book not found",
        id,
      });
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
      pdfUrl,
      pdfPreviewImage,
    } = req.body;

    const updateData: any = {};

    /* ------------------------------- TITLE ------------------------------- */

    if (title !== undefined) {
      updateData.title =
        String(title).trim();
    }

    /* ------------------------------- AUTHOR ------------------------------ */

    if (author !== undefined) {
      updateData.author =
        String(author).trim();
    }

    /* ----------------------------- DESCRIPTION --------------------------- */

    if (description !== undefined) {
      updateData.description =
        description === null ||
        description === ""
          ? null
          : String(description);
    }

    /* ----------------------------- COVER IMAGE --------------------------- */

    if (coverImage !== undefined) {
      updateData.coverImage =
        coverImage === null ||
        coverImage === ""
          ? null
          : String(coverImage);
    }

    /* -------------------------------- GENRE ------------------------------- */

    if (genre !== undefined) {
      updateData.genre =
        genre === null ||
        genre === ""
          ? null
          : String(genre);
    }

    /* --------------------------- PUBLISHED YEAR -------------------------- */

    if (
      publishedYear !== undefined
    ) {
      updateData.publishedYear =
        publishedYear === null ||
        publishedYear === ""
          ? null
          : Number(publishedYear);
    }

    /* -------------------------------- PAGES ------------------------------- */

    if (pages !== undefined) {
      updateData.pages =
        pages === null ||
        pages === ""
          ? null
          : Number(pages);
    }

    /* ------------------------------- RATING ------------------------------ */

    if (rating !== undefined) {
      const parsedRating =
        Number(rating);

      if (
        Number.isFinite(
          parsedRating
        )
      ) {
        updateData.rating =
          parsedRating;
      }
    }

    /* -------------------------------- SLUG -------------------------------- */

    if (
      slug !== undefined &&
      slug !== null &&
      String(slug).trim() !== ""
    ) {
      updateData.slug =
        String(slug).trim();
    }

    /* ------------------------------- PRICE ------------------------------- */

    if (
      priceCents !== undefined
    ) {
      if (
        priceCents === null ||
        priceCents === ""
      ) {
        updateData.priceCents =
          null;
      } else {
        const n =
          Number(priceCents);

        updateData.priceCents =
          Number.isInteger(n) &&
          n >= 0
            ? n
            : null;
      }
    }

    /* ------------------------------- PDF --------------------------------- */

    if (pdfUrl !== undefined) {
      updateData.pdfUrl =
        pdfUrl === null ||
        pdfUrl === ""
          ? null
          : String(pdfUrl);

      console.log(
        "📕 PDF URL received:",
        updateData.pdfUrl
      );
    }

    /* -------------------------- PDF PREVIEW ------------------------------ */

    if (
      pdfPreviewImage !==
      undefined
    ) {
      updateData.pdfPreviewImage =
        pdfPreviewImage === null ||
        pdfPreviewImage === ""
          ? null
          : String(pdfPreviewImage);

      console.log(
        "🖼️ PDF preview received:",
        Boolean(
          updateData.pdfPreviewImage
        )
      );
    }

    /* -------------------------- DATABASE UPDATE -------------------------- */

    console.log(
      "💾 Updating database with:"
    );

    console.log({
      hasCover:
        updateData.coverImage !==
        undefined
          ? Boolean(
              updateData.coverImage
            )
          : "unchanged",

      hasPdf:
        updateData.pdfUrl !==
        undefined
          ? Boolean(
              updateData.pdfUrl
            )
          : "unchanged",

      hasPreview:
        updateData.pdfPreviewImage !==
        undefined
          ? Boolean(
              updateData.pdfPreviewImage
            )
          : "unchanged",
    });

    const updatedBook =
      await prisma.book.update({
        where: {
          id,
        },
        data: updateData,
      });

    console.log(
      "✅ BOOK UPDATED SUCCESSFULLY"
    );

    console.log({
      id: updatedBook.id,
      title: updatedBook.title,
      hasCover: Boolean(
        updatedBook.coverImage
      ),
      hasPdf: Boolean(
        updatedBook.pdfUrl
      ),
      hasPreview: Boolean(
        updatedBook.pdfPreviewImage
      ),
    });

    /*
     * This is an ADMIN endpoint,
     * therefore return pdfUrl.
     */
    return res.json(
      sanitizeAdminBook(
        updatedBook
      )
    );
  } catch (error: any) {
    console.error(
      "❌ ERROR UPDATING BOOK:",
      error
    );

    return res.status(500).json({
      error:
        error?.message ||
        "Failed to update book",

      code:
        error?.code ||
        "UNKNOWN_ERROR",

      details:
        error?.meta ||
        null,
    });
  }
};

/* -------------------------------------------------------------------------- */
/* DELETE BOOK                                                                */
/* -------------------------------------------------------------------------- */

const deleteBook = async (
  req: Request,
  res: Response
) => {
  try {
    const id = getSingleParam(
      req.params.id
    );

    const existingBook =
      await prisma.book.findUnique({
        where: {
          id,
        },
      });

    if (!existingBook) {
      return res.status(404).json({
        error: "Book not found",
      });
    }

    await prisma.book.delete({
      where: {
        id,
      },
    });

    console.log(
      "🗑️ Book deleted:",
      id
    );

    return res.json({
      success: true,
      message:
        "Book deleted successfully",
      id,
    });
  } catch (error: any) {
    console.error(
      "❌ Error deleting book:",
      error
    );

    return res.status(500).json({
      success: false,
      error:
        "Failed to delete book",
      details:
        error?.message,
    });
  }
};

/* -------------------------------------------------------------------------- */
/* EXPORTS                                                                    */
/* -------------------------------------------------------------------------- */

export {
  getBooks,
  getBook,
  getAdminBook,
  createBook,
  updateBook,
  deleteBook,
};