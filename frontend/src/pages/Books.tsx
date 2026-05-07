import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BookOpen, ExternalLink, ChevronRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getBooks } from "@/services/api";
import { resolveBookCoverUrl } from "@/lib/resolveBookCover";
import { formatPrice } from "@/lib/formatPrice";
import { bookPurchaseHref, bookPurchaseLabel } from "@/config/purchase";

interface Book {
  id: string;
  title: string;
  author: string;
  slug?: string;
  description?: string;
  coverImage?: string;
  priceCents?: number;
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await getBooks();
        setBooks(data);
      } catch (error) {
        console.error("Failed to load books:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const handleViewDetails = (book: Book) => {
    setSelectedBook(book);
    setOpen(true);
  };

  const getPriceDisplay = (priceCents?: number) => {
    if (!priceCents || priceCents === 0) return "Free Download";
    return `${formatPrice(priceCents)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C17B4F]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F6EF] to-[#E8E0D5] py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Back to Home */}
        <div className="mb-6">
          <Link to="/">
            <Button variant="ghost" className="gap-2 text-[#2E1208] hover:text-[#C17B4F]">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#2E1208] mb-4">
            Books to Read & Own
          </h1>
          <p className="text-lg text-[#5C4436] max-w-2xl mx-auto">
            Explore the collection — open any book for the full description, then order or inquire when you're ready.
          </p>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {books.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
            >
              {/* Book Cover - Fully Visible */}
              <div className="bg-gray-100 p-4 flex items-center justify-center">
                {book.coverImage ? (
                  <img
                    src={resolveBookCoverUrl(book.coverImage) || ""}
                    alt={book.title}
                    className="w-full max-h-80 object-contain rounded-lg"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-64 flex items-center justify-center bg-[#F9F6EF] rounded-lg">
                    <BookOpen className="h-16 w-16 text-[#C17B4F]" />
                  </div>
                )}
              </div>

              {/* Book Info */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-[#2E1208] mb-1 line-clamp-2">
                  {book.title}
                </h3>
                <p className="text-sm text-[#5C4436] mb-3">by {book.author}</p>
                <p className="text-[#C17B4F] font-semibold mb-4">
                  {getPriceDisplay(book.priceCents)}
                </p>
                <Button
                  onClick={() => handleViewDetails(book)}
                  className="w-full bg-[#C17B4F] hover:bg-[#A55E36] text-white gap-2"
                >
                  View Details
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {books.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No books available at the moment.</p>
          </div>
        )}
      </div>

      {/* Book Details Modal (matching your original design flow) */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          {selectedBook && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl text-[#2E1208]">
                  {selectedBook.title}
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col md:flex-row gap-6 py-4">
                {/* Cover */}
                <div className="md:w-1/3 flex justify-center">
                  {selectedBook.coverImage ? (
                    <img
                      src={resolveBookCoverUrl(selectedBook.coverImage) || ""}
                      alt={selectedBook.title}
                      className="w-full max-h-64 object-contain rounded-lg shadow"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                      <BookOpen className="h-12 w-12 text-[#C17B4F]" />
                    </div>
                  )}
                </div>
                {/* Details */}
                <div className="md:w-2/3 space-y-4">
                  <p className="text-[#5C4436]">
                    <strong>Author:</strong> {selectedBook.author}
                  </p>
                  {selectedBook.pdfUrl && (
                    <div>
                      <strong className="text-[#2E1208]">Preview:</strong>
                      <iframe
                        src={`${selectedBook.pdfUrl}#toolbar=0&navpanes=0`}
                        className="w-full h-48 mt-2 rounded border"
                        title="PDF preview"
                      />
                    </div>
                  )}
                  <p className="text-lg font-semibold text-[#C17B4F]">
                    {getPriceDisplay(selectedBook.priceCents)}
                  </p>
                  <div className="flex gap-3 pt-2">
                    <Button
                      asChild
                      className="bg-[#C17B4F] hover:bg-[#A55E36] text-white"
                    >
                      <a
                        href={bookPurchaseHref(selectedBook.slug)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="gap-2"
                      >
                        {bookPurchaseLabel()}
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button asChild variant="outline">
                      <Link to={`/book/${selectedBook.slug || selectedBook.id}`}>
                        Full Details
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}