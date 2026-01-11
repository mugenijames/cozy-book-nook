import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

const Cart = () => {
  // Sample cart data
  const cartItems = [
    {
      id: "1",
      title: "Atomic Habits",
      author: "James Clear",
      price: 24.99,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=300&fit=crop",
    },
  ];

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container py-10">
        <h1 className="text-3xl font-display font-bold mb-6 flex items-center gap-3">
          <ShoppingCart className="h-8 w-8" />
          Your Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">Your cart is empty</p>
            <Button asChild>
              <Link to="/books">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 bg-card rounded-lg border">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-24 h-32 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-display font-semibold text-lg">{item.title}</h3>
                    <p className="text-muted-foreground">{item.author}</p>
                    <p className="font-bold mt-2">${item.price.toFixed(2)}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="text-destructive">
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="bg-card p-6 rounded-lg border h-fit">
              <h2 className="font-display font-semibold text-xl mb-4">Order Summary</h2>
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-4 text-muted-foreground">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-4 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <Button className="w-full mt-6" size="lg">
                Checkout
              </Button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
