import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Books = () => {
  const books = [
    {
      id: "1",
      title: "Atomic Habits",
      author: "James Clear",
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
      price: 24.99,
    },
    {
      id: "2",
      title: "The Alchemist",
      author: "Paulo Coelho",
      image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop",
      price: 19.99,
    },
    {
      id: "3",
      title: "Deep Work",
      author: "Cal Newport",
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
      price: 22.99,
    },
    {
      id: "4",
      title: "Thinking Fast and Slow",
      author: "Daniel Kahneman",
      image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&h=600&fit=crop",
      price: 29.99,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container py-10">
        <h1 className="text-3xl font-display font-bold mb-6">All Books</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <Card key={book.id} className="hover:shadow-lg transition overflow-hidden">
              <CardHeader className="p-0">
                <img
                  src={book.image}
                  alt={book.title}
                  className="h-60 w-full object-cover"
                />
              </CardHeader>

              <CardContent className="pt-4">
                <CardTitle className="text-lg">{book.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{book.author}</p>
                <p className="text-lg font-bold mt-2">${book.price.toFixed(2)}</p>
              </CardContent>

              <CardFooter>
                <Link to={`/book/${book.id}`} className="w-full">
                  <Button className="w-full">View Details</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Books;
