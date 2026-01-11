import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getBookById } from "@/api/books";

const BookDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data: book, isLoading, error } = useQuery({
    queryKey: ["book", id],
    queryFn: () => getBookById(id!),
  });

  if (isLoading) return <p>Loading book...</p>;
  if (error) return <p>Error loading book.</p>;
  if (!book) return <p>Book not found.</p>;

  return (
    <div className="p-4 border rounded shadow">
      <h2 className="font-bold text-2xl mb-2">{book.title}</h2>
      <p className="text-sm mb-2">by {book.author}</p>
      <p className="mb-2">{book.description}</p>
      <p className="font-semibold mb-2">${book.price}</p>
      <Link to="/" className="text-blue-500 hover:underline">
        Back to list
      </Link>
    </div>
  );
};

export default BookDetail;
