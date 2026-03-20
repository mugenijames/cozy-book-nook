// src/components/BookCard.tsx
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Star, BookOpen, Calendar } from "lucide-react";

interface BookCardProps {
  id: string;
  title: string;
  author: string;
  coverImage?: string;
  rating?: number;
  publishedYear?: number;
  slug?: string;
}

export default function BookCard({ 
  id, 
  title, 
  author, 
  coverImage, 
  rating, 
  publishedYear,
  slug 
}: BookCardProps) {
  return (
    <Link to={`/book/${slug || id}`}>
      <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden h-full">
        <div className="aspect-[2/3] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          {coverImage ? (
            <img
              src={coverImage.startsWith('http') ? coverImage : `http://localhost:5000${coverImage}`}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/300x450?text=No+Cover";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="h-12 w-12 text-gray-400" />
            </div>
          )}
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{author}</p>
          
          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
            {rating && rating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span>{rating.toFixed(1)}</span>
              </div>
            )}
            {publishedYear && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{publishedYear}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}