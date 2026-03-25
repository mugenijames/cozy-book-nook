"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBook = exports.updateBook = exports.createBook = exports.getBookById = exports.getBooks = void 0;
const prisma_1 = require("../lib/prisma");
const getBooks = () => prisma_1.prisma.book.findMany();
exports.getBooks = getBooks;
const getBookById = (id) => prisma_1.prisma.book.findUnique({ where: { id } });
exports.getBookById = getBookById;
const createBook = (data) => prisma_1.prisma.book.create({ data });
exports.createBook = createBook;
const updateBook = (id, data) => prisma_1.prisma.book.update({
    where: { id },
    data
});
exports.updateBook = updateBook;
const deleteBook = (id) => prisma_1.prisma.book.delete({ where: { id } });
exports.deleteBook = deleteBook;
