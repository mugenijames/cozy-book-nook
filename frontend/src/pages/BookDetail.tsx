import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Book } from "./BooksList";

export default function BookDetail() {
  const { id } = useParams<{ id: string }>();

  const { data: book, isLoading, error } = useQuery<Book>({
    queryKey: ["book", id],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:5000/api/books/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  if (isLoading) return <p>Loading book...</p>;
  if (error) return <p>Book not found.</p>;

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold">{book?.title}</h2>
      <p className="text-gray-600">{book?.author}</p>
      <p className="mt-2">{book?.description}</p>
      <p className="mt-2 font-semibold">${book?.price.toFixed(2)}</p>
      <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
        Place Order
      </button>
    </div>
  );
}
