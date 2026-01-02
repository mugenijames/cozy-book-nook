import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Heart, ShoppingCart, Star, Truck, Shield, RotateCcw, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getBookById, getReviewsByBookId } from "@/data/books";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const book = getBookById(id || "");
  const reviews = getReviewsByBookId(id || "");
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();

  if (!book) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-3xl font-bold text-foreground mb-4">Book Not Found</h1>
            <p className="text-muted-foreground mb-6">The book you're looking for doesn't exist.</p>
            <Button asChild>
              <Link to="/">Return Home</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
    : book.rating;

  const handleAddToCart = () => {
    toast({
      title: "Added to Cart",
      description: `${quantity}x "${book.title}" has been added to your cart.`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="container py-4">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Browse
          </Link>
        </div>

        {/* Book Details */}
        <section className="container pb-12">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Section */}
            <div className="relative">
              <div className="sticky top-24">
                <div className="relative aspect-[3/4] max-w-md mx-auto lg:mx-0 rounded-xl overflow-hidden shadow-book-hover bg-muted">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                  {book.badge && (
                    <span className="absolute top-4 left-4 px-4 py-1.5 text-sm font-medium rounded-full bg-primary text-primary-foreground">
                      {book.badge}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="space-y-6">
              {/* Genre Tags */}
              <div className="flex flex-wrap gap-2">
                {book.genre.map((g) => (
                  <Badge key={g} variant="secondary" className="bg-muted text-muted-foreground">
                    {g}
                  </Badge>
                ))}
              </div>

              {/* Title & Author */}
              <div>
                <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                  {book.title}
                </h1>
                <p className="mt-2 text-lg text-muted-foreground">
                  by <span className="text-foreground font-medium">{book.author}</span>
                </p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.round(averageRating)
                          ? "fill-amber text-amber"
                          : "fill-muted text-muted"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-medium text-foreground">{averageRating.toFixed(1)}</span>
                <span className="text-muted-foreground">({reviews.length} reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="font-display text-3xl font-bold text-foreground">
                  ${book.price.toFixed(2)}
                </span>
                {book.originalPrice && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">
                      ${book.originalPrice.toFixed(2)}
                    </span>
                    <Badge variant="destructive" className="bg-primary/10 text-primary border-0">
                      Save ${(book.originalPrice - book.price).toFixed(2)}
                    </Badge>
                  </>
                )}
              </div>

              <Separator />

              {/* Description */}
              <div>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">About this book</h2>
                <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {book.description}
                </div>
              </div>

              <Separator />

              {/* Book Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Publisher</span>
                  <p className="font-medium text-foreground">{book.publisher}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Publication Date</span>
                  <p className="font-medium text-foreground">{book.publishDate}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Pages</span>
                  <p className="font-medium text-foreground">{book.pages}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Language</span>
                  <p className="font-medium text-foreground">{book.language}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">ISBN</span>
                  <p className="font-medium text-foreground">{book.isbn}</p>
                </div>
              </div>

              <Separator />

              {/* Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 text-lg font-medium hover:bg-muted transition-colors"
                    >
                      −
                    </button>
                    <span className="px-4 py-2 text-lg font-medium min-w-[3rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 text-lg font-medium hover:bg-muted transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <Button size="lg" className="flex-1 gap-2" onClick={handleAddToCart}>
                    <ShoppingCart className="h-5 w-5" />
                    Add to Cart
                  </Button>
                  <Button size="lg" variant="outline" className="gap-2">
                    <Heart className="h-5 w-5" />
                  </Button>
                </div>

                {/* Trust Badges */}
                <div className="flex flex-wrap gap-4 pt-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Truck className="h-4 w-4" />
                    Free shipping over $35
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    Secure checkout
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <RotateCcw className="h-4 w-4" />
                    30-day returns
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="bg-muted/50 py-12 md:py-16">
          <div className="container">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8">
              Customer Reviews
            </h2>

            {reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-card rounded-xl p-6 shadow-card">
                    <div className="flex items-start gap-4">
                      <img
                        src={review.avatar}
                        alt={review.userName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div>
                            <h4 className="font-semibold text-foreground">{review.userName}</h4>
                            <p className="text-sm text-muted-foreground">{review.date}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? "fill-amber text-amber"
                                    : "fill-muted text-muted"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <h5 className="font-semibold text-foreground mt-3">{review.title}</h5>
                        <p className="text-muted-foreground mt-2 leading-relaxed">{review.content}</p>
                        <button className="flex items-center gap-2 mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors">
                          <ThumbsUp className="h-4 w-4" />
                          Helpful ({review.helpful})
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-card rounded-xl p-8 text-center">
                <p className="text-muted-foreground">No reviews yet. Be the first to review this book!</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BookDetail;
