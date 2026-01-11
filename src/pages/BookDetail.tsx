import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const BookDetail = () => {
  const { id } = useParams<{ id: string }>();

  // Sample book data
  const book = {
    id,
    title: "Atomic Habits",
    author: "James Clear",
    description: "An Easy & Proven Way to Build Good Habits & Break Bad Ones. This breakthrough book from James Clear is the most comprehensive guide ever written for using science to build good habits.",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=900&fit=crop",
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container py-10">
        <Link to="/books" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Books
        </Link>

        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <img
              src={book.image}
              alt={book.title}
              className="w-full max-w-md rounded-lg shadow-xl"
            />
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-display font-bold text-foreground">{book.title}</h1>
              <p className="text-xl text-muted-foreground mt-2">by {book.author}</p>
            </div>

            <p className="text-lg text-foreground/80 leading-relaxed">{book.description}</p>

            <div className="text-3xl font-bold text-primary">${book.price.toFixed(2)}</div>

            <div className="flex gap-4">
              <Button size="lg" className="flex-1">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              <Button size="lg" variant="outline">
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookDetail;
