const AboutAuthor = () => {
  return (
    <section className="py-20">
      <div className="container grid md:grid-cols-2 gap-12 items-center">
        <img
          src="https://images.unsplash.com/photo-1527980965255-d3b416303d12"
          className="rounded-lg shadow-card"
        />

        <div>
          <h2 className="text-3xl font-display font-bold mb-4">
            Meet the Author
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Raised in rural Kenya and now serving globally, this journey reflects
            a life committed to missional leadership, discipleship, and church
            transformation.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutAuthor;
