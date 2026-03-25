"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBook = exports.updateBook = exports.createBook = exports.getBook = exports.getBooks = void 0;
const prisma_1 = require("../lib/prisma");
// Helper to safely extract single string param
function getSingleParam(value) {
    if (!value)
        throw new Error("Missing required parameter");
    if (Array.isArray(value)) {
        return value[0];
    }
    return value;
}
function parseBookId(value) {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}
function slugify(title) {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}
async function generateUniqueSlug(title) {
    const baseSlug = slugify(title) || "book";
    let candidate = baseSlug;
    let counter = 1;
    while (await prisma_1.prisma.book.findUnique({ where: { slug: candidate } })) {
        counter += 1;
        candidate = `${baseSlug}-${counter}`;
    }
    return candidate;
}
// Get all books
const getBooks = async (req, res) => {
    try {
        const books = await prisma_1.prisma.book.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
        console.log(`✅ Fetched ${books.length} books`);
        res.json(books);
    }
    catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ error: "Failed to fetch books" });
    }
};
exports.getBooks = getBooks;
// Get a single book by ID or slug
const getBook = async (req, res) => {
    try {
        const idOrSlug = getSingleParam(req.params.idOrSlug);
        const parsedId = Number(idOrSlug);
        const isNumericId = Number.isInteger(parsedId) && String(parsedId) === idOrSlug;
        console.log(`🔍 Looking for book with ID/slug: ${idOrSlug}`);
        const book = isNumericId
            ? await prisma_1.prisma.book.findFirst({
                where: {
                    OR: [{ id: parsedId }, { slug: idOrSlug }],
                },
            })
            : await prisma_1.prisma.book.findUnique({
                where: { slug: idOrSlug },
            });
        if (!book) {
            return res.status(404).json({ error: "Book not found" });
        }
        console.log(`✅ Found book: ${book.title}`);
        res.json(book);
    }
    catch (error) {
        console.error("Error fetching book:", error);
        res.status(500).json({ error: "Failed to fetch book" });
    }
};
exports.getBook = getBook;
// Create a new book
const createBook = async (req, res) => {
    try {
        const { title, description, coverImage, author, genre, publishedYear, pages, rating, priceCents, } = req.body;
        // Basic runtime check
        if (!title || !author) {
            return res.status(400).json({ error: "Title and author are required" });
        }
        const slug = req.body.slug ? String(req.body.slug) : await generateUniqueSlug(String(title));
        let resolvedPrice = null;
        if (priceCents !== undefined && priceCents !== null && priceCents !== "") {
            const n = Number(priceCents);
            resolvedPrice = Number.isInteger(n) && n >= 0 ? n : null;
        }
        const newBook = await prisma_1.prisma.book.create({
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
    }
    catch (error) {
        console.error("Error creating book:", error);
        res.status(500).json({ error: "Failed to create book" });
    }
};
exports.createBook = createBook;
// Update a book
const updateBook = async (req, res) => {
    try {
        const idOrSlug = getSingleParam(req.params.idOrSlug);
        const id = parseBookId(idOrSlug);
        if (id === null) {
            return res.status(400).json({ error: "A numeric book id is required for updates" });
        }
        const { title, description, coverImage, author, genre, publishedYear, pages, rating, slug, priceCents, } = req.body;
        // Prepare update data
        const updateData = {};
        if (title !== undefined)
            updateData.title = String(title);
        if (description !== undefined)
            updateData.description = String(description);
        if (coverImage !== undefined)
            updateData.coverImage = String(coverImage);
        if (author !== undefined)
            updateData.author = String(author);
        if (genre !== undefined)
            updateData.genre = String(genre);
        if (publishedYear !== undefined)
            updateData.publishedYear = Number(publishedYear);
        if (pages !== undefined)
            updateData.pages = Number(pages);
        if (rating !== undefined)
            updateData.rating = Number(rating);
        if (priceCents !== undefined) {
            if (priceCents === null || priceCents === "") {
                updateData.priceCents = null;
            }
            else {
                const n = Number(priceCents);
                updateData.priceCents = Number.isInteger(n) && n >= 0 ? n : null;
            }
        }
        // Handle slug update
        if (slug !== undefined) {
            updateData.slug = slug;
        }
        else if (title !== undefined && !slug) {
            // Auto-generate slug from new title if not provided
            const newSlug = slugify(String(title));
            // Check if new slug already exists (excluding current book)
            const existingBook = await prisma_1.prisma.book.findFirst({
                where: {
                    slug: newSlug,
                    NOT: { id: id }
                }
            });
            updateData.slug = existingBook ? await generateUniqueSlug(String(title)) : newSlug;
        }
        const updatedBook = await prisma_1.prisma.book.update({
            where: { id },
            data: updateData,
        });
        console.log(`✅ Updated book: ${updatedBook.title}`);
        res.json(updatedBook);
    }
    catch (error) {
        console.error("Error updating book:", error);
        res.status(500).json({ error: "Failed to update book" });
    }
};
exports.updateBook = updateBook;
// Delete a book
const deleteBook = async (req, res) => {
    try {
        const idOrSlug = getSingleParam(req.params.idOrSlug);
        const id = parseBookId(idOrSlug);
        if (id === null) {
            return res.status(400).json({ error: "A numeric book id is required for deletion" });
        }
        await prisma_1.prisma.book.delete({ where: { id } });
        console.log(`✅ Deleted book with ID: ${id}`);
        res.status(200).json({ message: "Book deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting book:", error);
        res.status(500).json({ error: "Failed to delete book" });
    }
};
exports.deleteBook = deleteBook;
