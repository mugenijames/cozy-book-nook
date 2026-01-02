import { Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookCardProps {
  title: string;
  author: string;
  price: number;
  originalPrice?: number;
  rating: number;
  image: string;
  badge?: string;
}

const BookCard = ({ title, author, price, originalPrice, rating, image, badge }: BookCardProps) => {
  return (
    <div className="group relative bg-card rounded-xl overflow-hidden shadow-card transition-all duration-300 hover:shadow-book-hover hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Badge */}
        {badge && (
          <span className="absolute top-3 left-3 px-3 py-1 text-xs font-medium rounded-full bg-primary text-primary-foreground">
            {badge}
          </span>
        )}
        
        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
          <Button size="icon" variant="secondary" className="h-9 w-9 rounded-full bg-background/90 backdrop-blur hover:bg-background">
            <Heart className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="secondary" className="h-9 w-9 rounded-full bg-background/90 backdrop-blur hover:bg-background">
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        {/* Rating */}
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-amber text-amber" />
          <span className="text-sm font-medium text-foreground">{rating}</span>
        </div>

        {/* Title & Author */}
        <div>
          <h3 className="font-display font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground">{author}</p>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 pt-1">
          <span className="font-display text-lg font-bold text-foreground">
            ${price.toFixed(2)}
          </span>
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;
