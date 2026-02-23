import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="py-24 bg-gradient-hero">
      <div className="container grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-display font-bold">
            From Mission Field
            <span className="block text-primary">to a Missional Endeavor</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl">
            A journey of faith, leadership, and purpose — inspiring the global
            church to live missionally.
          </p>

          <div className="flex gap-4">
            <Button size="lg">Get the Book</Button>
            <Button size="lg" variant="outline">
              Invite to Speak
            </Button>
          </div>
        </div>

        <div className="flex justify-center">
          <img
            src="https://images.unsplash.com/photo-1544947950-fa07a98d237f"
            alt="Book cover"
            className="w-72 rounded-lg shadow-book"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
