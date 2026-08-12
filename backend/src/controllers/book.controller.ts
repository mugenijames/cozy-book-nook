// backend/src/controllers/book.controller.ts

import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { generateBookSummary } from "../services/ai.service";

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
/* GET ALL BOOKS                                                              */
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

    return res.json(books);
  } catch (error: any) {
    console.error("❌ Error fetching books:", error);

    return res.status(500).json({
      error: "Failed to fetch books",
      details: error?.message,
    });
  }
};

/* -------------------------------------------------------------------------- */
/* GET ONE BOOK                                                               */
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

    const isUUID = uuidPattern.test(idOrSlug);

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

    return res.json(book);
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
        error: "Title and author are required",
      });
    }

    const slug = req.body.slug
      ? String(req.body.slug)
      : await generateUniqueSlug(
          String(title)
        );

    let resolvedPrice: number | null = null;

    if (
      priceCents !== undefined &&
      priceCents !== null &&
      priceCents !== ""
    ) {
      const n = Number(priceCents);

      resolvedPrice =
        Number.isInteger(n) && n >= 0
          ? n
          : null;
    }

    const newBook = await prisma.book.create({
      data: {
        title: String(title),

        author: String(author),

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
          rating === null
            ? 0
            : Number(rating),

        priceCents: resolvedPrice,

        /*
         * IMPORTANT:
         * Save PDF URL when creating the book.
         */
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

    console.log("✅ Book created:", {
      id: newBook.id,
      title: newBook.title,
      pdfUrl: newBook.pdfUrl,
    });

    /*
     * Return the book immediately.
     */
    res.status(201).json(newBook);

    /*
     * Generate AI analysis in the background.
     */
    if (pdfUrl) {
      void generateBookSummary(
        String(pdfUrl)
      )
        .then(async (aiResult) => {
          await prisma.book.update({
            where: {
              id: newBook.id,
            },

            data: {
              aiSummary: aiResult.summary,

              shortSummary:
                aiResult.shortSummary,

              keyThemes:
                aiResult.keyThemes,

              keywords:
                aiResult.keywords,

              readingTime:
                aiResult.readingTime,

              targetAudience:
                aiResult.targetAudience,

              summary:
                aiResult.summary,
            },
          });

          console.log(
            `✅ AI analysis saved for "${newBook.title}"`
          );
        })
        .catch((error) => {
          console.error(
            `❌ AI analysis failed for "${newBook.title}":`,
            error
          );
        });
    }
  } catch (error: any) {
    console.error(
      "❌ Error creating book:",
      error
    );

    if (!res.headersSent) {
      return res.status(500).json({
        error: "Failed to create book",
        details: error?.message,
        code: error?.code,
      });
    }
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
    console.log("📚 UPDATE BOOK");
    console.log(
      "========================================"
    );

    console.log("Book ID:", id);

    console.log(
      "Request body:",
      JSON.stringify(req.body, null, 2)
    );

    /*
     * First make sure the book exists.
     */
    const existingBook =
      await prisma.book.findUnique({
        where: {
          id,
        },
      });

    if (!existingBook) {
      console.error(
        "❌ Book does not exist:",
        id
      );

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

    /* ------------------------------ TITLE ------------------------------ */

    if (title !== undefined) {
      updateData.title = String(title);
    }

    /* ------------------------------ AUTHOR ----------------------------- */

    if (author !== undefined) {
      updateData.author = String(author);
    }

    /* ---------------------------- DESCRIPTION -------------------------- */

    if (description !== undefined) {
      updateData.description =
        description === null ||
        description === ""
          ? null
          : String(description);
    }

    /* ----------------------------- COVER ------------------------------- */

    if (coverImage !== undefined) {
      updateData.coverImage =
        coverImage === null ||
        coverImage === ""
          ? null
          : String(coverImage);
    }

    /* ------------------------------ GENRE ------------------------------- */

    if (genre !== undefined) {
      updateData.genre =
        genre === null ||
        genre === ""
          ? null
          : String(genre);
    }

    /* ------------------------- PUBLISHED YEAR --------------------------- */

    if (publishedYear !== undefined) {
      updateData.publishedYear =
        publishedYear === null ||
        publishedYear === ""
          ? null
          : Number(publishedYear);
    }

    /* ------------------------------ PAGES ------------------------------- */

    if (pages !== undefined) {
      updateData.pages =
        pages === null ||
        pages === ""
          ? null
          : Number(pages);
    }

    /* ----------------------------- RATING ------------------------------- */

    if (rating !== undefined) {
      const parsedRating = Number(
        rating
      );

      if (Number.isFinite(parsedRating)) {
        updateData.rating = parsedRating;
      }
    }

    /* ------------------------------ SLUG -------------------------------- */

    if (
      slug !== undefined &&
      slug !== null &&
      String(slug).trim() !== ""
    ) {
      updateData.slug = String(slug);
    }

    /* ---------------------------- PRICE -------------------------------- */

    if (priceCents !== undefined) {
      if (
        priceCents === null ||
        priceCents === ""
      ) {
        updateData.priceCents = null;
      } else {
        const n = Number(priceCents);

        if (
          Number.isInteger(n) &&
          n >= 0
        ) {
          updateData.priceCents = n;
        } else {
          updateData.priceCents = null;
        }
      }
    }

    /* -------------------------------------------------------------------- */
    /* PDF URL                                                              */
    /* -------------------------------------------------------------------- */

    if (pdfUrl !== undefined) {
      updateData.pdfUrl =
        pdfUrl === null ||
        pdfUrl === ""
          ? null
          : String(pdfUrl);

      console.log(
        "📕 PDF URL received:"
      );

      console.log(
        updateData.pdfUrl
      );
    }

    /* -------------------------------------------------------------------- */
    /* PDF PREVIEW IMAGE                                                    */
    /* -------------------------------------------------------------------- */

    if (pdfPreviewImage !== undefined) {
      updateData.pdfPreviewImage =
        pdfPreviewImage === null ||
        pdfPreviewImage === ""
          ? null
          : String(pdfPreviewImage);

      console.log(
        "🖼️ PDF preview image:",
        updateData.pdfPreviewImage
      );
    }

    console.log(
      "📦 FINAL PRISMA UPDATE DATA:"
    );

    console.log(
      JSON.stringify(
        updateData,
        null,
        2
      )
    );

    /* -------------------------------------------------------------------- */
    /* UPDATE DATABASE                                                       */
    /* -------------------------------------------------------------------- */

    const updatedBook =
      await prisma.book.update({
        where: {
          id,
        },

        data: updateData,
      });

    console.log(
      "========================================"
    );

    console.log(
      "✅ BOOK UPDATED SUCCESSFULLY"
    );

    console.log({
      id: updatedBook.id,
      title: updatedBook.title,
      pdfUrl: updatedBook.pdfUrl,
      pdfPreviewImage:
        updatedBook.pdfPreviewImage,
    });

    console.log(
      "========================================"
    );

    console.log("");

    return res.json(updatedBook);

  } catch (error: any) {
    console.error("");
    console.error(
      "========================================"
    );

    console.error(
      "❌ ERROR UPDATING BOOK"
    );

    console.error(
      "========================================"
    );

    console.error(
      "Message:",
      error?.message
    );

    console.error(
      "Code:",
      error?.code
    );

    console.error(
      "Meta:",
      error?.meta
    );

    console.error(
      "Stack:",
      error?.stack
    );

    console.error(
      "========================================"
    );

    console.error("");

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

    await prisma.book.delete({
      where: {
        id,
      },
    });

    return res.json({
      message:
        "Book deleted successfully",
    });
  } catch (error: any) {
    console.error(
      "❌ Error deleting book:",
      error
    );

    return res.status(500).json({
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
  createBook,
  updateBook,
  deleteBook,
};