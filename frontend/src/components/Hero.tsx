// frontend/src/sections/Hero.tsx
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2E1208] via-[#3D1F0F] to-[#2E1208] text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/pattern.png')] bg-repeat"></div>
      </div>
      
      <div className="container mx-auto px-4 py-32 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold mb-6">
            Welcome to the World of
            <span className="text-[#D4A017] block">David Emuria</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Author, Speaker, and Philanthropist dedicated to healing hearts and transforming lives through powerful stories and practical wisdom.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-[#D4A017] hover:bg-[#B87C2E] text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all">
              Explore Books
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg rounded-full">
              Invite to Speak
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}