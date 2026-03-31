// src/pages/MyPurchases.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Book, Download, Calendar, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { getUserPurchases, downloadBook, Order } from "@/services/api";
import { resolveBookCoverUrl } from "@/lib/resolveBookCover";

export default function MyPurchases() {
  const [purchases, setPurchases] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const savedEmail = localStorage.getItem("checkout_email");
    if (savedEmail) {
      setEmail(savedEmail);
      fetchPurchases(savedEmail);
    }
  }, []);

  const fetchPurchases = async (userEmail: string) => {
    try {
      setLoading(true);
      const data = await getUserPurchases(userEmail);
      setPurchases(data);
    } catch (error) {
      console.error("Error fetching purchases:", error);
      toast.error("Failed to load your purchases");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (bookId: string, title: string) => {
    try {
      await downloadBook(bookId, email);
      toast.success(`Downloading ${title}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to download");
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      localStorage.setItem("checkout_email", email);
      fetchPurchases(email);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen bg-[#F9F6EF] py-12 px-6">
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="pt-6">
              <h1 className="text-2xl font-bold mb-4">My Purchases</h1>
              <p className="text-gray-600 mb-4">
                Enter the email address you used for purchases to view your library.
              </p>
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
                <Button type="submit" className="w-full bg-[#C17B4F] hover:bg-[#A55E36]">
                  View My Books
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F6EF] flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-[#C17B4F]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F6EF] py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">My Library</h1>
        <p className="text-gray-600 mb-8">Books you've purchased</p>

        {purchases.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Book className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No purchases yet</h2>
              <p className="text-gray-600 mb-4">
                You haven't purchased any books yet. Browse our collection to get started.
              </p>
              <Link to="/books">
                <Button className="bg-[#C17B4F] hover:bg-[#A55E36]">Browse Books</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {purchases.map((purchase) => (
              <Card key={purchase.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    {/* Book Cover */}
                    <div className="w-24 h-32 flex-shrink-0">
                      {purchase.book?.coverImage ? (
                        <img
                          src={resolveBookCoverUrl(purchase.book.coverImage)}
                          alt={purchase.bookTitle}
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.src = "https://via.placeholder.com/96x128?text=No+Cover";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#F9F6EF] to-[#E8E0D5] rounded-lg flex items-center justify-center">
                          <Book className="h-8 w-8 text-[#C17B4F]" />
                        </div>
                      )}
                    </div>

                    {/* Book Info */}
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-1">
                        {purchase.bookTitle}
                      </h3>
                      {purchase.book?.author && (
                        <p className="text-gray-600 flex items-center gap-2 mb-2">
                          <User className="h-4 w-4" />
                          {purchase.book.author}
                        </p>
                      )}
                      <p className="text-sm text-gray-500 flex items-center gap-2 mb-4">
                        <Calendar className="h-4 w-4" />
                        Purchased on {new Date(purchase.createdAt).toLocaleDateString()}
                      </p>

                      <div className="flex gap-3">
                        <Button
                          onClick={() => handleDownload(purchase.bookId, purchase.bookTitle)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </Button>
                        <Link to={`/book/${purchase.book?.slug || purchase.bookId}`}>
                          <Button variant="outline">View Details</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}