import { Request, Response } from "express"
import * as bookService from "../services/book.service"

export const getAllBooks = async (req: Request, res: Response) => {
  const books = await bookService.getBooks()
  res.json(books)
}

export const getBook = async (req: Request, res: Response) => {
  const book = await bookService.getBookById(Number(req.params.id))
  res.json(book)
}

export const createBook = async (req: Request, res: Response) => {
  const book = await bookService.createBook(req.body)
  res.status(201).json(book)
}

export const updateBook = async (req: Request, res: Response) => {
  const book = await bookService.updateBook(
    Number(req.params.id),
    req.body
  )
  res.json(book)
}

export const deleteBook = async (req: Request, res: Response) => {
  await bookService.deleteBook(Number(req.params.id))
  res.json({ message: "Book deleted" })
}