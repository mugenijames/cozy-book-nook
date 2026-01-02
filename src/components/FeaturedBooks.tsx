import BookCard from "./BookCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const books = [
  {
    title: "The Midnight Library",
    author: "Matt Haig",
    price: 14.99,
    originalPrice: 18.99,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
    badge: "Bestseller",
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    price: 16.99,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop",
  },
  {
    title: "The Silent Patient",
    author: "Alex Michaelides",
    price: 12.99,
    originalPrice: 15.99,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
    badge: "Sale",
  },
  {
    title: "Where the Crawdads Sing",
    author: "Delia Owens",
    price: 15.99,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=600&fit=crop",
  },
  {
    title: "Project Hail Mary",
    author: "Andy Weir",
    price: 17.99,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1519682577862-22b62b24e493?w=400&h=600&fit=crop",
    badge: "New",
  },
  {
    title: "The House in the Pines",
    author: "Ana Reyes",
    price: 13.99,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400&h=600&fit=crop",
  },
];

const FeaturedBooks = () => {
  return (
    <section className="py-16 md:py-20">
      <div className="container">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Featured Books
            </h2>
            <p className="mt-2 text-muted-foreground">
              Handpicked selections from our curators
            </p>
          </div>
          <Button variant="ghost" className="group self-start sm:self-auto">
            View All
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {books.map((book, index) => (
            <div key={index} className="animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
              <BookCard {...book} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedBooks;
