import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

export default function BooksList() {
  const { data: books, isLoading } = useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      const res = await axios.get(`${API}/books`);
      return res.data;
    },
  });

  if (isLoading) return <p>Loading books...</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {books.map((book: any) => (
        <div
          key={book.id}
          className="bg-white rounded-xl shadow-sm hover:shadow-md transition"
        >
          <div className="p-5">
            <h3 className="text-lg font-semibold">{book.title}</h3>
            <p className="text-sm text-muted-foreground">{book.author}</p>
            <p className="mt-2 text-sm line-clamp-3">
              {book.description}
            </p>

            <div className="flex justify-between items-center mt-4">
              <span className="font-bold text-primary">
                KES {book.price}
              </span>
              <Link
                to={`/book/${book.id}`}
                className="text-sm text-primary hover:underline"
              >
                View →
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
