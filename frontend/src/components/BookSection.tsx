import { Button } from "@/components/ui/button";

const BookSection = () => {
  return (
    <section className="py-20 bg-muted/40">
      <div className="container text-center max-w-3xl">
        <h2 className="text-3xl font-display font-bold mb-6">
          The Book
        </h2>
        <p className="text-muted-foreground mb-8">
          A powerful story of faith, cross-cultural mission, and leadership.
        </p>
        <Button size="lg">Order on Amazon</Button>
      </div>
    </section>
  );
};

export default BookSection;
