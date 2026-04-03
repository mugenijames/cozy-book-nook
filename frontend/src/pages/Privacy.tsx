// src/pages/Privacy.tsx
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F6EF] to-[#E8E0D5] py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <Link to="/">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg">
          <h1 className="text-3xl md:text-4xl font-bold text-[#2E1208] mb-4">Privacy Policy</h1>
          <p className="text-gray-500 text-sm mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="prose prose-lg max-w-none text-gray-600">
            <h2>1. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.</p>
            
            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to process transactions, communicate with you, and improve our services.</p>
            
            <h2>3. Information Sharing</h2>
            <p>We do not sell, trade, or rent your personal information to third parties.</p>
            
            <h2>4. Data Security</h2>
            <p>We implement appropriate technical and organizational measures to protect your personal information.</p>
            
            <h2>5. Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal information at any time.</p>
            
            <h2>6. Contact Us</h2>
            <p>If you have questions about this Privacy Policy, please contact us at davidemuria9780@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}