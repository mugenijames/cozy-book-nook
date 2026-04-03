// src/pages/Terms.tsx
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Terms() {
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
          <h1 className="text-3xl md:text-4xl font-bold text-[#2E1208] mb-4">Terms & Conditions</h1>
          <p className="text-gray-500 text-sm mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="prose prose-lg max-w-none text-gray-600">
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing and using this website, you accept and agree to be bound by these Terms & Conditions.</p>
            
            <h2>2. Use License</h2>
            <p>Permission is granted to temporarily view the materials on this website for personal, non-commercial use only.</p>
            
            <h2>3. Product Information</h2>
            <p>We strive to display accurate product information, but we do not warrant that product descriptions are complete or error-free.</p>
            
            <h2>4. Pricing</h2>
            <p>Prices are subject to change without notice. We reserve the right to modify or discontinue products at any time.</p>
            
            <h2>5. Digital Products</h2>
            <p>Digital products are delivered immediately upon purchase and are non-refundable.</p>
            
            <h2>6. Governing Law</h2>
            <p>These terms shall be governed by and construed in accordance with the laws of Kenya.</p>
            
            <h2>7. Contact Information</h2>
            <p>For questions about these Terms, contact us at davidemuria9780@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}