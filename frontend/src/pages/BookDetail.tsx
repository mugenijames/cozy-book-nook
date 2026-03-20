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

interface Review {
  id: number;
  title: string;
  content: string;
  rating?: number;
  author?: string;
  createdAt?: string;
}

const API_URL = import.meta.env.VITE_API_URL || "https://cozy-book-nook.vercel.app/api";

const BookDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  
  const [loading, setLoading] = useState(true);
  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      fetchBookDetails();
      fetchBookReviews();
    }
  }, [slug]);

  const fetchBookDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      // Try to fetch by ID or slug
      const response = await axios.get(`${API_URL}/books/${slug}`);
      setBook(response.data);
    } catch (err: any) {
      console.error("Failed to fetch book:", err);
      setError("Book not found");
    } finally {
      setLoading(false);
    }
  };

  const fetchBookReviews = async () => {
    try {
      // If you have a reviews endpoint
      const response = await axios.get(`${API_URL}/books/${slug}/reviews`);
      setReviews(response.data);
    } catch (err) {
      // Reviews are optional, don't set error if they don't exist
      console.log("No reviews available");
      setReviews([]);
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
          <h1 className="text-2xl font-bold text-[#2E1208] mb-4">
            {error || "Book not found"}
          </h1>
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
            Back to Home
          </Button>
        </Link>

        {/* Book Details */}
        <div className="grid md:grid-cols-2 gap-12 mb-16 bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Book Cover */}
          <div className="bg-gradient-to-br from-[#F9F6EF] to-[#E8E0D5] p-8 flex items-center justify-center">
            {book.coverImage ? (
              <img 
                src={
                  book.coverImage.startsWith("http")
                    ? book.coverImage
                    : `${API_URL.replace('/api', '')}${book.coverImage}`
                }
                alt={book.title} 
                className="rounded-2xl shadow-xl w-full max-w-md h-auto object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/400x600?text=Book+Cover";
                }}
              />
            ) : (
              <div className="w-full max-w-md aspect-[2/3] bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center">
                <BookOpen className="h-20 w-20 text-gray-400" />
              </div>
            )}
          </div>

          {/* Book Info */}
          <div className="p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-bold text-[#2E1208] mb-2">
              {book.title}
            </h1>
            <p className="text-xl text-gray-600 mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-[#C17B4F]" />
              by {book.author}
            </p>

            {/* Metadata */}
            <div className="flex flex-wrap gap-3 mb-6">
              {book.rating && book.rating > 0 && (
                <div className="flex items-center gap-1 px-3 py-1 bg-yellow-50 rounded-full">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{book.rating.toFixed(1)}</span>
                  <span className="text-gray-500">/ 5.0</span>
                </div>
              )}
              {book.publishedYear && (
                <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">{book.publishedYear}</span>
                </div>
              )}
              {book.pages && (
                <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full">
                  <BookOpen className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">{book.pages} pages</span>
                </div>
              )}
              {book.genre && (
                <div className="px-3 py-1 bg-[#C17B4F]/10 text-[#C17B4F] rounded-full text-sm">
                  {book.genre}
                </div>
              )}
            </div>

            {/* Price */}
            {book.price && (
              <div className="text-3xl font-bold text-[#C17B4F] mb-6">
                ${book.price.toFixed(2)}
              </div>
            )}

            {/* Description */}
            {book.description && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-[#2E1208] mb-3">
                  About this book
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {book.description}
                </p>
              </div>
            )}

            {/* Purchase Button (Optional) */}
            <Button className="bg-[#C17B4F] hover:bg-[#A55E36] text-white px-8 py-6 text-lg rounded-full shadow-md hover:shadow-lg transition-all duration-300">
              Purchase Book →
            </Button>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="border-t border-gray-200 pt-12">
          <h2 className="text-2xl font-bold text-[#2E1208] mb-8">
            Customer Reviews
          </h2>
          {reviews && reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-lg text-[#2E1208]">
                      {review.title}
                    </h3>
                    {review.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-gray-600">{review.rating}</span>
                      </div>
                    )}
                  </div>
                  {review.author && (
                    <p className="text-sm text-gray-500 mb-2">by {review.author}</p>
                  )}
                  <p className="text-gray-700 leading-relaxed">
                    {review.content}
                  </p>
                  {review.createdAt && (
                    <p className="text-xs text-gray-400 mt-3">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-xl text-center border border-gray-100">
              <p className="text-gray-500 mb-4">No reviews yet for this title.</p>
              <Button variant="outline" className="text-[#C17B4F] border-[#C17B4F] hover:bg-[#C17B4F] hover:text-white">
                Be the first to review
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetail;