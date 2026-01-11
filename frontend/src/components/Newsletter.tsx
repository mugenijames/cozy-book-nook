import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Sparkles } from "lucide-react";

const Newsletter = () => {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-r from-amber-100 via-amber-200 to-amber-100 text-foreground">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 text-amber-800 text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            <span>Join 12,000+ book lovers</span>
          </div>

          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Never Miss a New Release
          </h2>
          <p className="text-foreground/80 mb-8 text-lg">
            Get personalized book recommendations, exclusive discounts, and updates on your favorite authors.
          </p>

          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Enter your email"
                className="pl-10 h-12 bg-background border border-border focus:border-primary transition-all"
              />
            </div>
            <Button variant="primary" size="lg" className="shrink-0">
              Subscribe
            </Button>
          </form>

          <p className="text-xs text-foreground/60 mt-4">
            No spam, ever. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
