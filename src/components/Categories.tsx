const Categories = () => {
  const categories = [
    { name: "Fiction", image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=200&h=200&fit=crop" },
    { name: "Non-Fiction", image: "https://images.unsplash.com/photo-1581091870620-8be5c07f8da4?w=200&h=200&fit=crop" },
    { name: "Children's", image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=200&h=200&fit=crop" },
    { name: "Audiobooks", image: "https://images.unsplash.com/photo-1588776814546-380f2d4e5f61?w=200&h=200&fit=crop" },
    { name: "Science", image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=200&h=200&fit=crop" },
  ];

  return (
    <section className="py-16 md:py-20 bg-muted/50">
      <div className="container">
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-8 text-foreground">
          Browse by Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {categories.map((cat, i) => (
            <div key={i} className="group text-center cursor-pointer">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-40 object-cover rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
              />
              <p className="mt-2 font-medium text-foreground">{cat.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
