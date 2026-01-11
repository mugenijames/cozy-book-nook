import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface AddBookProps {
  onAdded?: () => void;
}

const AddBook = ({ onAdded }: AddBookProps) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">("");

  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: async (newBook: { title: string; author: string; description: string; price: number }) => {
      await axios.post(`${import.meta.env.VITE_API_URL}/books`, newBook);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["books"]);
      onAdded?.();
      setTitle("");
      setAuthor("");
      setDescription("");
      setPrice("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !author || !description || !price) return;
    addMutation.mutate({ title, author, description, price: Number(price) });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 p-4 border rounded shadow">
      <h2 className="font-bold text-xl mb-2">Add New Book</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="block mb-2 w-full border rounded px-2 py-1"
      />
      <input
        type="text"
        placeholder="Author"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        className="block mb-2 w-full border rounded px-2 py-1"
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="block mb-2 w-full border rounded px-2 py-1"
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : "")}
        className="block mb-2 w-full border rounded px-2 py-1"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
      >
        Add Book
      </button>
    </form>
  );
};

export default AddBook;
