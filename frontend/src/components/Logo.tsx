// src/components/Logo.tsx
import { BookOpen } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function Logo({ size = "md", showText = true }: LogoProps) {
  const dimensions = {
    sm: { icon: 16, text: "text-sm", gap: 1.5, padding: "p-1.5" },
    md: { icon: 20, text: "text-base", gap: 2, padding: "p-2" },
    lg: { icon: 28, text: "text-2xl", gap: 3, padding: "p-2.5" },
  };

  const { icon, text, gap, padding } = dimensions[size];

  return (
    <div className={`flex items-center gap-${gap}`}>
      <div className={`bg-gradient-to-br from-[#C17B4F] to-[#A55E36] ${padding} rounded-xl shadow-md`}>
        <BookOpen className={`h-${icon} w-${icon} text-white`} />
      </div>
      {showText && (
        <div>
          <h1 className={`font-bold text-[#2E1208] ${text}`}>Cozy Book Nook</h1>
          <p className="text-xs text-[#5C4436]">Admin Dashboard</p>
        </div>
      )}
    </div>
  );
}