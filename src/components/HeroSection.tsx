import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden gradient-hero py-16 md:py-24">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-20 w-96 h-96 bg-amber/10 rounded-full blur-3xl" />
      </div>

      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              <span>New arrivals every week</span>
            </div>
            
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Discover Your Next
              <span className="text-primary block">Favorite Read</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              Explore thousands of books from bestselling authors to hidden gems. 
              Your perfect story is waiting to be found.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-2">
              <Button size="lg" className="group">
                Browse Collection
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="outline" size="lg">
                View Bestsellers
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-6">
              <div>
                <p className="font-display text-2xl font-bold text-foreground">50K+</p>
                <p className="text-sm text-muted-foreground">Books Available</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-foreground">12K+</p>
                <p className="text-sm text-muted-foreground">Happy Readers</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-foreground">4.9</p>
                <p className="text-sm text-muted-foreground">Average Rating</p>
              </div>
            </div>
          </div>

          {/* Featured Books Visual */}
          <div className="relative hidden lg:block">
            <div className="relative flex justify-center items-end gap-4 perspective-1000">
              {/* Book stack visual */}
              <div className="relative group">
                <div className="absolute inset-0 bg-primary/20 rounded-lg blur-2xl transform translate-y-8" />
                <img 
                  src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop" 
                  alt="Featured book"
                  className="relative w-48 h-72 object-cover rounded-lg shadow-book transition-all duration-300 group-hover:shadow-book-hover group-hover:-translate-y-2"
                />
              </div>
              <div className="relative group -ml-8">
                <img 
                  src="https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=450&fit=crop" 
                  alt="Featured book"
                  className="w-44 h-64 object-cover rounded-lg shadow-book transition-all duration-300 group-hover:shadow-book-hover group-hover:-translate-y-2"
                />
              </div>
              <div className="relative group -ml-8">
                <img 
                  src="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=450&fit=crop" 
                  alt="Featured book"
                  className="w-40 h-56 object-cover rounded-lg shadow-book transition-all duration-300 group-hover:shadow-book-hover group-hover:-translate-y-2"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
