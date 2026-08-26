"use strict";
// backend/src/controllers/book.controller.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBook = exports.updateBook = exports.createBook = exports.getAdminBook = exports.getAdminBooks = exports.getBook = exports.getBooks = void 0;
const prisma_1 = require("../lib/prisma");
/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */
function getSingleParam(value) {
    if (!value) {
        throw new Error("Missing required parameter");
    }
    return Array.isArray(value) ? value[0] : value;
}
function slugify(title) {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}
async function generateUniqueSlug(title, excludeId) {
    const baseSlug = slugify(title) || "book";
    let candidate = baseSlug;
    let counter = 1;
    while (true) {
        const existing = await prisma_1.prisma.book.findUnique({
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
/* PUBLIC RESPONSE                                                            */
/* -------------------------------------------------------------------------- */
/**
 * Public customers must NEVER receive pdfUrl.
 *
 * They can receive:
 * - book information
 * - cover
 * - preview image
 * - AI summary
 * - whether a digital edition exists
 */
function sanitizePublicBook(book) {
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
        pdfSummary: book.pdfSummary,
        keyThemes: book.keyThemes,
        keywords: book.keywords,
        readingTime: book.readingTime,
        targetAudience: book.targetAudience,
    };
}
/* -------------------------------------------------------------------------- */
/* GET ALL PUBLIC BOOKS                                                       */
/* -------------------------------------------------------------------------- */
const getBooks = async (req, res) => {
    try {
        console.log(">>> GET /api/books");
        const books = await prisma_1.prisma.book.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
        return res.json(books.map(sanitizePublicBook));
    }
    catch (error) {
        console.error("❌ Error fetching books:", error);
        return res.status(500).json({
            error: "Failed to fetch books",
            details: error?.message || "Unknown error",
        });
    }
};
exports.getBooks = getBooks;
/* -------------------------------------------------------------------------- */
/* GET ONE PUBLIC BOOK                                                        */
/* -------------------------------------------------------------------------- */
const getBook = async (req, res) => {
    try {
        const idOrSlug = getSingleParam(req.params.idOrSlug);
        console.log(">>> GET /api/books/:idOrSlug", idOrSlug);
        const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        const isUUID = uuidPattern.test(idOrSlug);
        const book = isUUID
            ? await prisma_1.prisma.book.findUnique({
                where: {
                    id: idOrSlug,
                },
            })
            : await prisma_1.prisma.book.findUnique({
                where: {
                    slug: idOrSlug,
                },
            });
        if (!book) {
            return res.status(404).json({
                error: "Book not found",
            });
        }
        return res.json(sanitizePublicBook(book));
    }
    catch (error) {
        console.error("❌ Error fetching book:", error);
        return res.status(500).json({
            error: "Failed to fetch book",
            details: error?.message || "Unknown error",
        });
    }
};
exports.getBook = getBook;
/* -------------------------------------------------------------------------- */
/* ADMIN GET ALL BOOKS                                                        */
/* -------------------------------------------------------------------------- */
/**
 * IMPORTANT:
 *
 * This endpoint is protected by isAdmin in admin.book.routes.ts.
 *
 * Unlike the public endpoint, the admin needs pdfUrl.
 */
const getAdminBooks = async (req, res) => {
    try {
        console.log(">>> GET /api/admin/books");
        const books = await prisma_1.prisma.book.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
        return res.json(books);
    }
    catch (error) {
        console.error("❌ Error fetching admin books:", error);
        return res.status(500).json({
            error: "Failed to fetch books",
            details: error?.message || "Unknown error",
        });
    }
};
exports.getAdminBooks = getAdminBooks;
/* -------------------------------------------------------------------------- */
/* ADMIN GET ONE BOOK                                                         */
/* -------------------------------------------------------------------------- */
/**
 * This endpoint fixes:
 *
 * GET /api/admin/books/:id
 *
 * The admin edit page needs the complete book record,
 * including pdfUrl.
 */
const getAdminBook = async (req, res) => {
    try {
        const id = getSingleParam(req.params.id);
        console.log(">>> GET /api/admin/books/:id", id);
        const book = await prisma_1.prisma.book.findUnique({
            where: {
                id,
            },
        });
        if (!book) {
            console.log("❌ Admin book not found:", id);
            return res.status(404).json({
                error: "Book not found",
                id,
            });
        }
        console.log("✅ Admin book found:", {
            id: book.id,
            title: book.title,
            hasPdf: Boolean(book.pdfUrl),
            hasPreview: Boolean(book.pdfPreviewImage),
        });
        /*
         * Admin is authenticated.
         *
         * Return the complete record including pdfUrl.
         */
        return res.json(book);
    }
    catch (error) {
        console.error("❌ Error fetching admin book:", error);
        return res.status(500).json({
            error: "Failed to fetch book",
            details: error?.message || "Unknown error",
        });
    }
};
exports.getAdminBook = getAdminBook;
/* -------------------------------------------------------------------------- */
/* CREATE BOOK                                                                */
/* -------------------------------------------------------------------------- */
const createBook = async (req, res) => {
    try {
        const { title, description, coverImage, author, genre, publishedYear, pages, rating, priceCents, pdfUrl, pdfPreviewImage, } = req.body;
        console.log(">>> POST /api/admin/books");
        if (!title || !author) {
            return res.status(400).json({
                error: "Title and author are required",
            });
        }
        const slug = req.body.slug &&
            String(req.body.slug).trim() !== ""
            ? String(req.body.slug).trim()
            : await generateUniqueSlug(String(title));
        /* ---------------------------------------------------------------------- */
        /* PRICE                                                                  */
        /* ---------------------------------------------------------------------- */
        let resolvedPrice = null;
        if (priceCents !== undefined &&
            priceCents !== null &&
            priceCents !== "") {
            const n = Number(priceCents);
            if (Number.isInteger(n) &&
                n >= 0) {
                resolvedPrice = n;
            }
        }
        /* ---------------------------------------------------------------------- */
        /* CREATE                                                                 */
        /* ---------------------------------------------------------------------- */
        const newBook = await prisma_1.prisma.book.create({
            data: {
                title: String(title).trim(),
                author: String(author).trim(),
                slug,
                description: description === null ||
                    description === ""
                    ? null
                    : String(description),
                coverImage: coverImage === null ||
                    coverImage === ""
                    ? null
                    : String(coverImage),
                genre: genre === null ||
                    genre === ""
                    ? null
                    : String(genre),
                publishedYear: publishedYear === null ||
                    publishedYear === ""
                    ? null
                    : Number(publishedYear),
                pages: pages === null ||
                    pages === ""
                    ? null
                    : Number(pages),
                rating: rating === undefined ||
                    rating === null ||
                    rating === ""
                    ? 0
                    : Number(rating),
                priceCents: resolvedPrice,
                pdfUrl: pdfUrl === null ||
                    pdfUrl === ""
                    ? null
                    : String(pdfUrl),
                pdfPreviewImage: pdfPreviewImage === null ||
                    pdfPreviewImage === ""
                    ? null
                    : String(pdfPreviewImage),
            },
        });
        console.log("✅ Book created:", {
            id: newBook.id,
            title: newBook.title,
            hasPdf: Boolean(newBook.pdfUrl),
            hasPreview: Boolean(newBook.pdfPreviewImage),
        });
        return res.status(201).json(sanitizePublicBook(newBook));
    }
    catch (error) {
        console.error("❌ Error creating book:", error);
        return res.status(500).json({
            error: "Failed to create book",
            details: error?.message || "Unknown error",
            code: error?.code,
        });
    }
};
exports.createBook = createBook;
/* -------------------------------------------------------------------------- */
/* UPDATE BOOK                                                                */
/* -------------------------------------------------------------------------- */
const updateBook = async (req, res) => {
    try {
        const id = getSingleParam(req.params.id);
        console.log("");
        console.log("========================================");
        console.log("📚 UPDATE BOOK");
        console.log("========================================");
        console.log("Book ID:", id);
        const existingBook = await prisma_1.prisma.book.findUnique({
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
        const { title, description, coverImage, author, genre, publishedYear, pages, rating, slug, priceCents, pdfUrl, pdfPreviewImage, } = req.body;
        const updateData = {};
        /* ---------------------------------------------------------------------- */
        /* TITLE                                                                  */
        /* ---------------------------------------------------------------------- */
        if (title !== undefined) {
            updateData.title =
                String(title).trim();
        }
        /* ---------------------------------------------------------------------- */
        /* AUTHOR                                                                 */
        /* ---------------------------------------------------------------------- */
        if (author !== undefined) {
            updateData.author =
                String(author).trim();
        }
        /* ---------------------------------------------------------------------- */
        /* DESCRIPTION                                                            */
        /* ---------------------------------------------------------------------- */
        if (description !== undefined) {
            updateData.description =
                description === null ||
                    description === ""
                    ? null
                    : String(description);
        }
        /* ---------------------------------------------------------------------- */
        /* COVER                                                                  */
        /* ---------------------------------------------------------------------- */
        if (coverImage !== undefined) {
            updateData.coverImage =
                coverImage === null ||
                    coverImage === ""
                    ? null
                    : String(coverImage);
        }
        /* ---------------------------------------------------------------------- */
        /* GENRE                                                                  */
        /* ---------------------------------------------------------------------- */
        if (genre !== undefined) {
            updateData.genre =
                genre === null ||
                    genre === ""
                    ? null
                    : String(genre);
        }
        /* ---------------------------------------------------------------------- */
        /* PUBLISHED YEAR                                                         */
        /* ---------------------------------------------------------------------- */
        if (publishedYear !== undefined) {
            updateData.publishedYear =
                publishedYear === null ||
                    publishedYear === ""
                    ? null
                    : Number(publishedYear);
        }
        /* ---------------------------------------------------------------------- */
        /* PAGES                                                                  */
        /* ---------------------------------------------------------------------- */
        if (pages !== undefined) {
            updateData.pages =
                pages === null ||
                    pages === ""
                    ? null
                    : Number(pages);
        }
        /* ---------------------------------------------------------------------- */
        /* RATING                                                                 */
        /* ---------------------------------------------------------------------- */
        if (rating !== undefined) {
            const parsedRating = Number(rating);
            if (Number.isFinite(parsedRating)) {
                updateData.rating =
                    parsedRating;
            }
        }
        /* ---------------------------------------------------------------------- */
        /* SLUG                                                                   */
        /* ---------------------------------------------------------------------- */
        if (slug !== undefined &&
            slug !== null &&
            String(slug).trim() !== "") {
            updateData.slug =
                String(slug).trim();
        }
        /* ---------------------------------------------------------------------- */
        /* PRICE                                                                  */
        /* ---------------------------------------------------------------------- */
        if (priceCents !== undefined) {
            if (priceCents === null ||
                priceCents === "") {
                updateData.priceCents =
                    null;
            }
            else {
                const n = Number(priceCents);
                updateData.priceCents =
                    Number.isInteger(n) &&
                        n >= 0
                        ? n
                        : null;
            }
        }
        /* ---------------------------------------------------------------------- */
        /* PDF URL                                                                */
        /* ---------------------------------------------------------------------- */
        if (pdfUrl !== undefined) {
            updateData.pdfUrl =
                pdfUrl === null ||
                    pdfUrl === ""
                    ? null
                    : String(pdfUrl);
            console.log("📕 PDF URL updated:", Boolean(updateData.pdfUrl));
        }
        /* ---------------------------------------------------------------------- */
        /* PDF PREVIEW IMAGE                                                      */
        /* ---------------------------------------------------------------------- */
        if (pdfPreviewImage !==
            undefined) {
            updateData.pdfPreviewImage =
                pdfPreviewImage === null ||
                    pdfPreviewImage === ""
                    ? null
                    : String(pdfPreviewImage);
            console.log("🖼️ PDF preview updated:", Boolean(updateData.pdfPreviewImage));
        }
        /* ---------------------------------------------------------------------- */
        /* DATABASE UPDATE                                                        */
        /* ---------------------------------------------------------------------- */
        const updatedBook = await prisma_1.prisma.book.update({
            where: {
                id,
            },
            data: updateData,
        });
        console.log("✅ BOOK UPDATED SUCCESSFULLY");
        console.log({
            id: updatedBook.id,
            title: updatedBook.title,
            hasPdf: Boolean(updatedBook.pdfUrl),
            hasPreview: Boolean(updatedBook.pdfPreviewImage),
        });
        /*
         * Return public-safe response.
         *
         * The admin edit page should reload using
         * GET /api/admin/books/:id.
         */
        return res.json(sanitizePublicBook(updatedBook));
    }
    catch (error) {
        console.error("❌ ERROR UPDATING BOOK:", error);
        return res.status(500).json({
            error: error?.message ||
                "Failed to update book",
            code: error?.code ||
                "UNKNOWN_ERROR",
            details: error?.meta ||
                null,
        });
    }
};
exports.updateBook = updateBook;
/* -------------------------------------------------------------------------- */
/* DELETE BOOK                                                                */
/* -------------------------------------------------------------------------- */
const deleteBook = async (req, res) => {
    try {
        const id = getSingleParam(req.params.id);
        console.log(">>> DELETE /api/admin/books/:id", id);
        const existingBook = await prisma_1.prisma.book.findUnique({
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
        await prisma_1.prisma.book.delete({
            where: {
                id,
            },
        });
        console.log("🗑️ Book deleted:", id);
        return res.json({
            success: true,
            message: "Book deleted successfully",
            id,
        });
    }
    catch (error) {
        console.error("❌ Error deleting book:", error);
        return res.status(500).json({
            error: "Failed to delete book",
            details: error?.message ||
                "Unknown error",
        });
    }
};
exports.deleteBook = deleteBook;
//# sourceMappingURL=book.controller.js.map