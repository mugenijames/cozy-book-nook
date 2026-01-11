const reviews = [
  { name: "Olivia P.", text: "Love the curated books — found my next favorite!", avatar: "https://i.pravatar.cc/100?u=olivia" },
  { name: "Mark L.", text: "The site’s look and feel is top tier!", avatar: "https://i.pravatar.cc/100?u=mark" },
  { name: "Sophie R.", text: "Browser experience is smooth and lovely!", avatar: "https://i.pravatar.cc/100?u=sophie" },
];

const Testimonials = () => (
  <section className="py-16 bg-muted/50">
    <h2 className="text-3xl font-display text-center mb-12">What Our Readers Say</h2>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
      {reviews.map((r) => (
        <div key={r.name} className="bg-paper-white p-6 rounded-2xl shadow-card text-center">
          <img
            src={r.avatar}
            alt={r.name}
            className="w-16 h-16 rounded-full mx-auto mb-4"
          />
          <p className="text-muted-foreground text-sm mb-3">“{r.text}”</p>
          <p className="font-semibold text-foreground">{r.name}</p>
        </div>
      ))}
    </div>
  </section>
);

export default Testimonials;
