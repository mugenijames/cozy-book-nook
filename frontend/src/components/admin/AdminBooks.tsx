import { useQuery } from "@tanstack/react-query";
import { getBooks } from "@/services/api";
import { Link } from "react-router-dom";

export default function AdminBooks() {
  const { data: books, isLoading, error } = useQuery(["books"], () => getBooks());

  if (isLoading) return <p>Loading books...</p>;
  if (error) return <p>Error loading books</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Books Management</h2>
      <table className="w-full table-auto border-collapse border">
        <thead>
          <tr>
            <th className="border px-2 py-1">Title</th>
            <th className="border px-2 py-1">Author</th>
            <th className="border px-2 py-1">Price</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {books?.map((book: any) => (
            <tr key={book.id}>
              <td className="border px-2 py-1">{book.title}</td>
              <td className="border px-2 py-1">{book.author}</td>
              <td className="border px-2 py-1">{book.price}</td>
              <td className="border px-2 py-1">
                <Link to={`/admin/books/${book.id}`} className="text-blue-500 hover:underline">
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
