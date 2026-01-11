const StaffPicks = () => {
  const picks = [
    { title: "The Wanderer", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&h=300&fit=crop" },
    { title: "Mindful Living", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=300&fit=crop" },
    { title: "Adventure Awaits", image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=200&h=300&fit=crop" },
    { title: "Hidden Treasures", image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=200&h=300&fit=crop" },
  ];

  return (
    <section className="py-16 md:py-20">
      <div className="container">
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-8 text-foreground">
          Staff Picks
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {picks.map((book, i) => (
            <div key={i} className="group relative">
              <img
                src={book.image}
                alt={book.title}
                className="w-full h-64 object-cover rounded-lg shadow-book transition-all duration-300 group-hover:shadow-book-hover group-hover:-translate-y-2"
              />
              <p className="mt-2 text-center text-foreground font-medium">{book.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StaffPicks;
