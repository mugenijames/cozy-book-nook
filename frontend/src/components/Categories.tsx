import { BookOpen, Flame, Ghost, Heart, Lightbulb, Rocket, Scroll, TreePine } from "lucide-react";

const categories = [
  { name: "Fiction", icon: BookOpen, color: "bg-primary/10 text-primary" },
  { name: "Romance", icon: Heart, color: "bg-pink-100 text-pink-600" },
  { name: "Mystery", icon: Ghost, color: "bg-slate-100 text-slate-600" },
  { name: "Sci-Fi", icon: Rocket, color: "bg-blue-100 text-blue-600" },
  { name: "Self-Help", icon: Lightbulb, color: "bg-amber/20 text-amber" },
  { name: "Fantasy", icon: Flame, color: "bg-orange-100 text-orange-600" },
  { name: "History", icon: Scroll, color: "bg-stone-100 text-stone-600" },
  { name: "Nature", icon: TreePine, color: "bg-emerald-100 text-emerald-600" },
];

const Categories = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Browse by Genre
          </h2>
          <p className="mt-2 text-muted-foreground">
            Find your next adventure in any genre
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <button
                key={index}
                className="group flex flex-col items-center gap-3 p-6 rounded-xl bg-card border border-border/50 transition-all duration-300 hover:border-primary/30 hover:shadow-card hover:-translate-y-1"
              >
                <div className={`p-3 rounded-xl ${category.color} transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className="h-6 w-6" />
                </div>
                <span className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                  {category.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;
