import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

interface Book {
  id: number;
  title: string;
  slug: string;
}

const API_URL = import.meta.env.VITE_API_URL || "https://cozy-book-nook.vercel.app/api/books";

const Books = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get(`${API_URL}/books`);
        setBooks(res.data);
      } catch (err: any) {
        setError("Failed to load books");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return (
      <section className="py-24 text-center">
        <p>Loading books...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-24 text-center">
        <p className="text-red-500">{error}</p>
      </section>
    );
  }

  return (
    <section className="py-24">
      <div className="container mx-auto">
        <h2 className="text-3xl font-heading text-center mb-12">
          Books & Publications
        </h2>

        <div className="grid md:grid-cols-4 gap-8">
          {books.map((book) => (
            <div key={book.id} className="bg-white p-6 shadow rounded">
              <h3 className="font-semibold mb-4">
                {book.title}
              </h3>

              <Link
                to={`/book/${book.slug}`}
                className="text-[#D4A017]"
              >
                View Details →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Books;