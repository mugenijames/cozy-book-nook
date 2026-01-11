import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Books = () => {
  const books = [
    {
      id: "1",
      title: "Atomic Habits",
      author: "James Clear",
      image: "https://covers.openlibrary.org/b/id/10523337-L.jpg",
    },
    {
      id: "2",
      title: "The Alchemist",
      author: "Paulo Coelho",
      image: "https://covers.openlibrary.org/b/id/10958358-L.jpg",
    },
  ];

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Books</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {books.map((book) => (
          <Card key={book.id} className="hover:shadow-lg transition">
            <CardHeader className="p-0">
              <img
                src={book.image}
                alt={book.title}
                className="h-60 w-full object-cover rounded-t-lg"
              />
            </CardHeader>

            <CardContent>
              <CardTitle className="text-lg">{book.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{book.author}</p>
            </CardContent>

            <CardFooter>
              <Link to={`/books/${book.id}`} className="w-full">
                <Button className="w-full">View Details</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Books;
