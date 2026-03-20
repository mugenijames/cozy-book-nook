// src/components/BookCardSkeleton.tsx
import { Card, CardContent } from "@/components/ui/card";

export function BookCardSkeleton() {
  return (
    <Card className="overflow-hidden h-full">
      <div className="aspect-[2/3] bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
      <CardContent className="p-4">
        <div className="h-5 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3 mb-3" />
        <div className="flex gap-4">
          <div className="h-3 bg-gray-200 rounded animate-pulse w-12" />
          <div className="h-3 bg-gray-200 rounded animate-pulse w-16" />
        </div>
      </CardContent>
    </Card>
  );
}