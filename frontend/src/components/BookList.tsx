import { useEffect, useState } from "react";
import { getBooks } from "@/services/api"; // using your @ alias

interface Book {
  id: string;
  title: string;
  author: string;
  // ... other fields
}

export default function BookList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchBooks = async () => {
      try {
        const data = await getBooks();
        if (mounted) {
          setBooks(data);
          setLoading(false);
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.message || "Failed to load books");
          setLoading(false);
        }
      }
    };

    fetchBooks();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <div>Loading books...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Cozy Book Nook</h2>
      {books.length === 0 ? (
        <p>No books found.</p>
      ) : (
        <ul>
          {books.map((book) => (
            <li key={book.id}>
              <strong>{book.title}</strong> — {book.author}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}