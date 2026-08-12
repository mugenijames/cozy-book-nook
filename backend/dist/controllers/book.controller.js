"use strict";
// backend/src/controllers/book.controller.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBook = exports.updateBook = exports.createBook = exports.getBook = exports.getBooks = void 0;
const prisma_1 = require("../lib/prisma");
const ai_service_1 = require("../services/ai.service");
function getSingleParam(value) {
    if (!value)
        throw new Error("Missing required parameter");
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
            where: { slug: candidate },
        });
        if (!existing || existing.id === excludeId)
            break;
        counter++;
        candidate = `${baseSlug}-${counter}`;
    }
    return candidate;
}
/* -------------------------------------------------------------------------- */
/*                                   GET ALL                                  */
/* -------------------------------------------------------------------------- */
const getBooks = async (req, res) => {
    try {
        const books = await prisma_1.prisma.book.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
        res.json(books);
    }
    catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({
            error: "Failed to fetch books",
        });
    }
};
exports.getBooks = getBooks;
/* -------------------------------------------------------------------------- */
/*                                  GET ONE                                   */
/* -------------------------------------------------------------------------- */
const getBook = async (req, res) => {
    try {
        const idOrSlug = getSingleParam(req.params.idOrSlug);
        const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        const isUUID = uuidPattern.test(idOrSlug);
        const book = isUUID
            ? await prisma_1.prisma.book.findUnique({
                where: { id: idOrSlug },
            })
            : await prisma_1.prisma.book.findUnique({
                where: { slug: idOrSlug },
            });
        if (!book) {
            return res.status(404).json({
                error: "Book not found",
            });
        }
        res.json(book);
    }
    catch (error) {
        console.error("Error fetching book:", error);
        res.status(500).json({
            error: "Failed to fetch book",
        });
    }
};
exports.getBook = getBook;
/* -------------------------------------------------------------------------- */
/*                                 CREATE BOOK                                */
/* -------------------------------------------------------------------------- */
const createBook = async (req, res) => {
    try {
        const { title, description, coverImage, author, genre, publishedYear, pages, rating, priceCents, pdfUrl, pdfPreviewImage, } = req.body;
        if (!title || !author) {
            return res.status(400).json({
                error: "Title and author are required",
            });
        }
        const slug = req.body.slug
            ? String(req.body.slug)
            : await generateUniqueSlug(String(title));
        let resolvedPrice = null;
        if (priceCents !== undefined &&
            priceCents !== null &&
            priceCents !== "") {
            const n = Number(priceCents);
            resolvedPrice =
                Number.isInteger(n) && n >= 0
                    ? n
                    : null;
        }
        const newBook = await prisma_1.prisma.book.create({
            data: {
                title: String(title),
                author: String(author),
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
                    rating === null
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
        // Return the book immediately.
        res.status(201).json(newBook);
        // Generate AI analysis in the background.
        if (pdfUrl) {
            void (0, ai_service_1.generateBookSummary)(String(pdfUrl))
                .then(async (aiResult) => {
                await prisma_1.prisma.book.update({
                    where: {
                        id: newBook.id,
                    },
                    data: {
                        aiSummary: aiResult.summary,
                        shortSummary: aiResult.shortSummary,
                        keyThemes: aiResult.keyThemes,
                        keywords: aiResult.keywords,
                        readingTime: aiResult.readingTime,
                        targetAudience: aiResult.targetAudience,
                        summary: aiResult.summary,
                    },
                });
                console.log(`✅ AI analysis saved for "${newBook.title}"`);
            })
                .catch((error) => {
                console.error(`❌ AI analysis failed for "${newBook.title}":`, error);
            });
        }
    }
    catch (error) {
        console.error("Error creating book:", error);
        if (!res.headersSent) {
            res.status(500).json({
                error: "Failed to create book",
            });
        }
    }
};
exports.createBook = createBook;
/* -------------------------------------------------------------------------- */
/*                                 UPDATE BOOK                                */
/* -------------------------------------------------------------------------- */
const updateBook = async (req, res) => {
    try {
        const id = getSingleParam(req.params.id);
        const { title, description, coverImage, author, genre, publishedYear, pages, rating, slug, priceCents, pdfUrl, pdfPreviewImage, } = req.body;
        const updateData = {};
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
            }
            else {
                const n = Number(priceCents);
                updateData.priceCents =
                    Number.isInteger(n) && n >= 0
                        ? n
                        : null;
            }
        }
        if (slug !== undefined) {
            updateData.slug = String(slug);
        }
        else if (title !== undefined) {
            updateData.slug = await generateUniqueSlug(String(title), id);
        }
        const updatedBook = await prisma_1.prisma.book.update({
            where: {
                id,
            },
            data: updateData,
        });
        res.json(updatedBook);
    }
    catch (error) {
        console.error("Error updating book:", error);
        res.status(500).json({
            error: "Failed to update book",
        });
    }
};
exports.updateBook = updateBook;
/* -------------------------------------------------------------------------- */
/*                                 DELETE BOOK                                */
/* -------------------------------------------------------------------------- */
const deleteBook = async (req, res) => {
    try {
        const id = getSingleParam(req.params.id);
        await prisma_1.prisma.book.delete({
            where: {
                id,
            },
        });
        res.json({
            message: "Book deleted successfully",
        });
    }
    catch (error) {
        console.error("Error deleting book:", error);
        res.status(500).json({
            error: "Failed to delete book",
        });
    }
};
exports.deleteBook = deleteBook;
