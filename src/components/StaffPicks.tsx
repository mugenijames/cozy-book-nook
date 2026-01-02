import { Quote, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const staffPicks = [
  {
    title: "Klara and the Sun",
    author: "Kazuo Ishiguro",
    staffName: "Sarah",
    staffRole: "Fiction Curator",
    quote: "A haunting meditation on love and what it means to be human. Ishiguro at his finest.",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop",
    rating: 4.9,
  },
  {
    title: "The Anthropocene Reviewed",
    author: "John Green",
    staffName: "Marcus",
    staffRole: "Non-Fiction Lead",
    quote: "Beautiful essays that find wonder in the mundane. Made me see the world differently.",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=600&fit=crop",
    rating: 4.8,
  },
];

const StaffPicks = () => {
  return (
    <section className="py-16 md:py-20">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-forest/10 text-forest text-sm font-medium mb-4">
            Curated for You
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Staff Picks
          </h2>
          <p className="mt-2 text-muted-foreground max-w-lg mx-auto">
            Personal recommendations from our passionate team of book lovers
          </p>
        </div>

        {/* Staff Picks Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {staffPicks.map((pick, index) => (
            <div
              key={index}
              className="group relative flex gap-6 p-6 bg-card rounded-2xl border border-border/50 transition-all duration-300 hover:border-primary/30 hover:shadow-book"
            >
              {/* Book Cover */}
              <div className="relative shrink-0">
                <div className="absolute inset-0 bg-primary/10 rounded-lg blur-xl transform translate-y-4" />
                <img
                  src={pick.image}
                  alt={pick.title}
                  className="relative w-32 h-48 object-cover rounded-lg shadow-book transition-transform duration-300 group-hover:-translate-y-1"
                />
              </div>

              {/* Content */}
              <div className="flex flex-col justify-between py-2">
                <div>
                  {/* Quote */}
                  <Quote className="h-8 w-8 text-primary/20 mb-2" />
                  <p className="text-foreground italic leading-relaxed mb-4">
                    "{pick.quote}"
                  </p>

                  {/* Book Info */}
                  <h3 className="font-display text-xl font-semibold text-foreground">
                    {pick.title}
                  </h3>
                  <p className="text-muted-foreground">by {pick.author}</p>
                  
                  <div className="flex items-center gap-1 mt-2">
                    <Star className="h-4 w-4 fill-amber text-amber" />
                    <span className="text-sm font-medium">{pick.rating}</span>
                  </div>
                </div>

                {/* Staff Info */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                  <div>
                    <p className="font-medium text-foreground">{pick.staffName}</p>
                    <p className="text-sm text-muted-foreground">{pick.staffRole}</p>
                  </div>
                  <Button size="sm">View Book</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StaffPicks;
