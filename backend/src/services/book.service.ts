import { prisma } from "../lib/prisma"

export const getBooks = () => prisma.book.findMany()

export const getBookById = (id: string) =>
  prisma.book.findUnique({ where: { id } })

export const createBook = (data: any) =>
  prisma.book.create({ data })

export const updateBook = (id: string, data: any) =>
  prisma.book.update({
    where: { id },
    data
  })

export const deleteBook = (id: string) =>
  prisma.book.delete({ where: { id } })