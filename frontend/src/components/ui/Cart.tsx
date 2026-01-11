import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

const Cart = () => {
  return (
    <div className="container py-16 text-center">
      <ShoppingCart className="mx-auto h-14 w-14 text-muted-foreground mb-4" />

      <h1 className="text-3xl font-bold mb-2">Your Cart</h1>
      <p className="text-muted-foreground mb-6">
        Your cart is currently empty.
      </p>

      <Link to="/books">
        <Button size="lg">Browse Books</Button>
      </Link>
    </div>
  );
};

export default Cart;
