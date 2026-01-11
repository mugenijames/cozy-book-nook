const FeaturedBooks = () => {
  const books = [
    { title: "The Great Adventure", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=300&fit=crop" },
    { title: "Mystery of the Night", image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=200&h=300&fit=crop" },
    { title: "Secrets of the Mind", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&h=300&fit=crop" },
    { title: "Journey Through Time", image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=200&h=300&fit=crop" },
    { title: "Hidden Gems", image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=200&h=300&fit=crop" },
  ];

  return (
    <section className="py-16 md:py-20">
      <div className="container">
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-8 text-foreground">
          Featured Books
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {books.map((book, i) => (
            <div key={i} className="group relative">
              <img
                src={book.image}
                alt={book.title}
                className="w-full h-64 object-cover rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
              />
              <p className="mt-2 text-sm font-medium text-foreground text-center">
                {book.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedBooks;
