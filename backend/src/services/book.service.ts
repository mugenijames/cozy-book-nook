import { prisma } from "../lib/prisma"

export const getBooks = () => prisma.book.findMany()

export const getBookById = (id: number) =>
  prisma.book.findUnique({ where: { id } })

export const createBook = (data: any) =>
  prisma.book.create({ data })

export const updateBook = (id: number, data: any) =>
  prisma.book.update({
    where: { id },
    data
  })

export const deleteBook = (id: number) =>
  prisma.book.delete({ where: { id } })