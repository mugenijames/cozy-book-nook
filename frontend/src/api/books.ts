// src/api/books.ts
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const getBooks = async () => {
  const res = await fetch(`${API_URL}/books`);
  if (!res.ok) throw new Error("Failed to fetch books");
  return res.json();
};

export const getBookById = async (id: string | number) => {
  const res = await fetch(`${API_URL}/books/${id}`);
  if (!res.ok) throw new Error("Failed to fetch book");
  return res.json();
};

export const createBook = async (book: {
  title: string;
  author: string;
  description: string;
  price: number;
}) => {
  const res = await fetch(`${API_URL}/books`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book),
  });
  if (!res.ok) throw new Error("Failed to create book");
  return res.json();
};

export const updateBook = async (id: string | number, data: any) => {
  const res = await fetch(`${API_URL}/books/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update book");
  return res.json();
};

export const deleteBook = async (id: string | number) => {
  const res = await fetch(`${API_URL}/books/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete book");
  return res.json();
};
