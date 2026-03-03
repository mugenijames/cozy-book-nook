// src/types/book.ts

export interface Book {
  id: number;
  title: string;
  description: string;
  image?: string;
  price: number;
  createdAt: string;
}

export interface BookInput {
  title: string;
  description: string;
  image?: string;
  price: number;
}


export type BookFormData = BookInput;          
export type BookListItem = Pick<Book, "id" | "title" | "image" | "price">;