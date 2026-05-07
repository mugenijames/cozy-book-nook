// Create a dedicated BookCover component
// src/components/BookCover.tsx
interface BookCoverProps {
  src: string | null;
  alt: string;
  className?: string;
  size?: "small" | "medium" | "large";
}

export function BookCover({ src, alt, className = "", size = "medium" }: BookCoverProps) {
  const sizeClasses = {
    small: "max-h-48",
    medium: "max-h-64",
    large: "max-h-[500px]"
  };

  if (!src) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <BookOpen className="h-12 w-12 text-gray-400" />
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center overflow-hidden bg-gray-50 rounded-lg ${className}`}>
      <img
        src={src}
        alt={alt}
        className={`w-full h-auto object-contain ${sizeClasses[size]}`}
        loading="lazy"
      />
    </div>
  );
}