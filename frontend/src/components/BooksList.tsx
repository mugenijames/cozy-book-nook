import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";

export interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  price: number;
}

interface BooksListProps {
  refresh?: boolean;
}

export default function BooksList({ refresh }: BooksListProps) {
  const { data: books, isLoading, error, refetch } = useQuery<Book[]>({
    queryKey: ["books", refresh],
    queryFn: async () => {
      const res = await axios.get("http://localhost:5000/api/books");
      return res.data;
    },
  });

  if (isLoading) return <p>Loading books...</p>;
  if (error) return <p>Failed to load books.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {books?.map((book) => (
        <div key={book.id} className="border p-4 rounded shadow">
          <h3 className="font-bold text-lg">{book.title}</h3>
          <p className="text-sm text-gray-600">{book.author}</p>
          <p className="mt-2">{book.description}</p>
          <p className="mt-2 font-semibold">${book.price.toFixed(2)}</p>
          <Link
            to={`/book/${book.id}`}
            className="mt-2 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            View Details
          </Link>
        </div>
      ))}
    </div>
  );
}
