// frontend/src/sections/Hero.tsx
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F9F6EF] via-[#F5EDE3] to-[#F9F6EF] text-[#2E1208] overflow-hidden">
      {/* Optional: Add a subtle background pattern - smaller size */}
      <div 
        className="absolute inset-0 opacity-5 bg-repeat"
        style={{
          backgroundImage: "url('/pattern.png')",
          backgroundSize: "200px",
        }}
      />
      
      <div className="container mx-auto px-4 py-16 md:py-24 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-heading font-bold mb-4 md:mb-6">
            Welcome to the World of
            <span className="text-[#C17B4F] block mt-2">David Emuria</span>
          </h1>
          <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto px-4">
            Author, Speaker, and Philanthropist dedicated to healing hearts and transforming lives through powerful stories and practical wisdom.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
            <Button className="bg-[#C17B4F] hover:bg-[#A55E36] text-white px-6 md:px-8 py-4 md:py-6 text-base md:text-lg rounded-full shadow-md hover:shadow-lg transition-all">
              Explore Books
              <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
            </Button>
            <Button variant="outline" className="border-[#C17B4F] text-[#C17B4F] hover:bg-[#C17B4F] hover:text-white px-6 md:px-8 py-4 md:py-6 text-base md:text-lg rounded-full">
              Invite to Speak
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}