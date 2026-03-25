import { Link } from "react-router-dom";
import { Star, ShoppingBag, BookOpen } from "lucide-react";
import { resolveBookCoverUrl } from "@/lib/resolveBookCover";

interface BookShowcaseCardProps {
  id: string;
  title: string;
  author: string;
  coverImage?: string | null;
  rating?: number;
  priceCents?: number | null;
  slug?: string;
  description?: string;
}

export default function BookShowcaseCard({
  id,
  title,
  author,
  coverImage,
  rating,
  priceCents,
  slug,
}: BookShowcaseCardProps) {
  const coverSrc = resolveBookCoverUrl(coverImage);
  
  return (
    <Link to={`/book/${slug || id}`} className="group">
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
        {/* Book Cover - REDUCED SIZE */}
        <div className="aspect-[2/3] overflow-hidden bg-gradient-to-br from-[#F9F6EF] to-[#E8E0D5] max-h-[280px]">
          {coverSrc ? (
            <img
              src={coverSrc}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/200x300?text=No+Cover";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="h-10 w-10 text-[#C17B4F]" />
            </div>
          )}
        </div>

        {/* Book Info - Compact */}
        <div className="p-3">
          <h3 className="font-semibold text-sm line-clamp-1 text-[#2E1208] group-hover:text-[#C17B4F] transition-colors">
            {title}
          </h3>
          <p className="text-xs text-gray-600 mt-1 line-clamp-1">{author}</p>
          
          {/* Rating - Smaller */}
          {rating && rating > 0 && (
            <div className="flex items-center gap-0.5 mt-2">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-gray-600">{rating.toFixed(1)}</span>
            </div>
          )}
          
          {/* Price - Smaller */}
          {priceCents && priceCents > 0 && (
            <p className="text-sm font-semibold text-[#C17B4F] mt-2">
              ${(priceCents / 100).toFixed(2)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}