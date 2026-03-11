import { useParams, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBookById, getReviewsByBookId, Book, Review } from "@/data/books"; 

const BookDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  
  const [loading, setLoading] = useState(true);
  const [book, setBook] = useState<Book | undefined>(undefined);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    if (slug) {
      const foundBook = getBookById(slug);
      setBook(foundBook);
      setReviews(foundBook ? getReviewsByBookId(slug) : []);
    }
    setLoading(false);
  }, [slug]);

  if (!loading && !book) return <Navigate to="/" replace />;

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-white py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <img 
            src={book!.image} 
            alt={book!.title} 
            className="rounded-2xl shadow-xl w-full h-[500px] object-cover" 
          />
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">{book!.title}</h1>
            <p className="text-xl text-slate-600 mb-4">by {book!.author}</p>
            <div className="text-3xl font-bold text-[#D4A017] mb-6">
              ${book!.price.toFixed(2)}
            </div>
            <p className="text-lg text-slate-700 leading-relaxed mb-6 whitespace-pre-line">
              {book!.description}
            </p>
          </div>
        </div>

        <div className="border-t pt-12">
          <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>
          {reviews.length > 0 ? (
            <div className="space-y-8">
              {reviews.map((review) => (
                <div key={review.id} className="bg-slate-50 p-6 rounded-xl">
                  <h3 className="font-bold text-lg">{review.title}</h3>
                  <p className="text-slate-700 mt-2">{review.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500">No reviews yet for this title.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetail;