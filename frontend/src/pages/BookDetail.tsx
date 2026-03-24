// src/pages/BookDetail.tsx
import { useParams, Navigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Star, Calendar, User, BookOpen, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Book {
  id: number;
  title: string;
  author: string;
  slug: string;
  description?: string;
  coverImage?: string;
  genre?: string;
  publishedYear?: number;
  pages?: number;
  rating?: number;
  price?: number;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const BookDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  
  const [loading, setLoading] = useState(true);
  const [book, setBook] = useState<Book | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      fetchBookDetails();
    }
  }, [slug]);

  const fetchBookDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try fetching by ID or slug
      // First try to get all books and find by slug
      const response = await axios.get(`${API_URL}/books`);
      const books = response.data;
      
      // Find book by slug or ID
      const foundBook = books.find((b: any) => 
        b.slug === slug || b.id === parseInt(slug || "") || b.id === slug
      );
      
      if (foundBook) {
        setBook(foundBook);
      } else {
        // If not found, try direct endpoint
        try {
          const directResponse = await axios.get(`${API_URL}/books/${slug}`);
          setBook(directResponse.data);
        } catch (err) {
          setError("Book not found");
        }
      }
    } catch (err: any) {
      console.error("Failed to fetch book:", err);
      setError("Book not found");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F6EF] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#C17B4F]" />
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-[#F9F6EF] flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#2E1208] mb-4">
            {error || "Book not found"}
          </h1>
          <p className="text-gray-600 mb-6">
            The book you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/">
            <Button className="bg-[#C17B4F] hover:bg-[#A55E36] text-white">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F6EF] py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link to="/" className="inline-block mb-6">
          <Button variant="ghost" className="gap-2 text-[#2E1208] hover:text-[#C17B4F]">
            <ArrowLeft className="h-4 w-4" />
            Back to Books
          </Button>
        </Link>

        {/* Book Details */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
            {/* Book Cover */}
            <div className="flex items-center justify-center">
              {book.coverImage ? (
                <img 
                  src={
                    book.coverImage.startsWith("http")
                      ? book.coverImage
                      : `http://localhost:5000${book.coverImage}`
                  }
                  alt={book.title} 
                  className="rounded-2xl shadow-xl w-full max-w-md h-auto object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/400x600?text=Book+Cover";
                  }}
                />
              ) : (
                <div className="w-full max-w-md aspect-[2/3] bg-gradient-to-br from-[#F9F6EF] to-[#E8E0D5] rounded-2xl flex items-center justify-center">
                  <BookOpen className="h-20 w-20 text-[#C17B4F]" />
                </div>
              )}
            </div>

            {/* Book Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-[#2E1208] mb-2">
                  {book.title}
                </h1>
                <p className="text-xl text-gray-600 flex items-center gap-2">
                  <User className="h-5 w-5 text-[#C17B4F]" />
                  by {book.author}
                </p>
              </div>

              {/* Metadata */}
              <div className="flex flex-wrap gap-3">
                {book.rating && book.rating > 0 && (
                  <div className="flex items-center gap-1 px-3 py-1.5 bg-yellow-50 rounded-full">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-gray-700">{book.rating.toFixed(1)}</span>
                    <span className="text-gray-500 text-sm">/ 5.0</span>
                  </div>
                )}
                {book.publishedYear && (
                  <div className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-full">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700">{book.publishedYear}</span>
                  </div>
                )}
                {book.pages && (
                  <div className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-full">
                    <BookOpen className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700">{book.pages} pages</span>
                  </div>
                )}
                {book.genre && (
                  <div className="px-3 py-1.5 bg-[#C17B4F]/10 text-[#C17B4F] rounded-full text-sm font-medium">
                    {book.genre}
                  </div>
                )}
              </div>

              {/* Description */}
              {book.description && (
                <div>
                  <h2 className="text-xl font-semibold text-[#2E1208] mb-3">
                    About this book
                  </h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {book.description}
                  </p>
                </div>
              )}

              {/* Purchase Button */}
              <div className="pt-4">
                <Button className="bg-[#C17B4F] hover:bg-[#A55E36] text-white px-8 py-6 text-lg rounded-full shadow-md hover:shadow-lg transition-all duration-300">
                  Purchase Book →
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;