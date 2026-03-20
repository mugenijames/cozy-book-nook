// src/sections/Books.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { BookOpen, Star, ArrowRight } from "lucide-react";

interface Book {
  id: number;
  title: string;
  author: string;
  slug: string;
  coverImage?: string;
  rating?: number;
  description?: string;
}

// Only the base API URL
const API_URL = import.meta.env.VITE_API_URL || "https://cozy-book-nook.vercel.app/api";

const Books = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get(`${API_URL}/books`);
        // Show only first 4 books on homepage
        setBooks(res.data.slice(0, 4));
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
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2E1208] mb-4">
              Featured Books
            </h2>
            <div className="w-24 h-1 bg-[#C17B4F] mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[2/3] bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-[#C17B4F] hover:text-[#A55E36] underline"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  if (books.length === 0) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#2E1208] mb-2">
            Coming Soon
          </h2>
          <p className="text-gray-600">
            New books and publications will be available soon.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="books" className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2E1208] mb-4">
            Featured Books
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover powerful stories of healing, identity, and purpose
          </p>
          <div className="w-24 h-1 bg-[#C17B4F] mx-auto mt-4"></div>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {books.map((book) => (
            <Link
              key={book.id}
              to={`/book/${book.slug}`}
              className="group"
            >
              <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                {/* Book Cover */}
                <div className="aspect-[2/3] overflow-hidden bg-gradient-to-br from-[#F9F6EF] to-[#E8E0D5]">
                  {book.coverImage ? (
                    <img
                      src={
                        book.coverImage.startsWith("http")
                          ? book.coverImage
                          : `${API_URL.replace('/api', '')}${book.coverImage}`
                      }
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/300x450?text=Book+Cover";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="h-12 w-12 text-[#C17B4F]" />
                    </div>
                  )}
                </div>

                {/* Book Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-[#2E1208] line-clamp-1 group-hover:text-[#C17B4F] transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                    {book.author || "Author"}
                  </p>
                  {book.rating && book.rating > 0 && (
                    <div className="flex items-center gap-1 mt-2">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-600">
                        {book.rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Books Button */}
        <div className="text-center mt-12">
          <Link to="/books">
            <button className="bg-[#C17B4F] hover:bg-[#A55E36] text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 shadow-md hover:shadow-lg inline-flex items-center gap-2">
              View All Books
              <ArrowRight className="h-5 w-5" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Books;