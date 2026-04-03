// src/pages/admin/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, BookOpen, Heart } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simulate validation
    if (email === "admin@example.com" && password === "admin123") {
      const dummyToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBleGFtcGxlLmNvbSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTY5OTk5OTk5OSwiZXhwIjo5OTk5OTk5OTk5fQ.dummy_signature";
      
      login(dummyToken);
      toast.success("Welcome back, Admin!");
      navigate("/admin");
    } else {
      toast.error("Invalid credentials. Use admin@example.com / admin123");
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#F9F6EF] via-[#F5EDE3] to-[#E8E0D5]">
      {/* Header with Logo */}
      <div className="flex justify-center pt-12 pb-8">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-[#C17B4F] to-[#A55E36] p-3 rounded-2xl shadow-lg">
            <BookOpen className="h-10 w-10 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#2E1208]">Cozy Book Nook</h1>
            <p className="text-sm text-[#5C4436]">Admin Portal</p>
          </div>
        </div>
      </div>

      {/* Login Card */}
      <div className="flex-1 flex items-center justify-center px-4 pb-12">
        <Card className="w-full max-w-md shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="space-y-2 text-center pb-6">
            <div className="mx-auto w-12 h-12 bg-[#C17B4F]/10 rounded-full flex items-center justify-center mb-2">
              <BookOpen className="h-6 w-6 text-[#C17B4F]" />
            </div>
            <CardTitle className="text-2xl font-bold text-[#2E1208]">Admin Login</CardTitle>
            <CardDescription className="text-[#5C4436]">
              Enter your credentials to access the admin panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#2E1208] font-medium">Email Address</Label>
                <Input 
                  id="email"
                  type="email" 
                  placeholder="admin@example.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  disabled={loading}
                  className="border-[#D4C5B5] focus:border-[#C17B4F] focus:ring-[#C17B4F]/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#2E1208] font-medium">Password</Label>
                <Input 
                  id="password"
                  type="password" 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  disabled={loading}
                  className="border-[#D4C5B5] focus:border-[#C17B4F] focus:ring-[#C17B4F]/20"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-[#C17B4F] to-[#A55E36] hover:from-[#A55E36] hover:to-[#8B4513] text-white shadow-md transition-all duration-300" 
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 pt-2 pb-6">
            <div className="text-xs text-center text-[#8B7355]">
              Secure access only | Admin credentials required
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#D4C5B5] bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-[#C17B4F]" />
              <span className="text-sm text-[#5C4436]">Cozy Book Nook Admin Portal</span>
            </div>
            <div className="flex gap-6 text-sm text-[#5C4436]">
              <a href="/" className="hover:text-[#C17B4F] transition-colors">Home</a>
              <a href="/books" className="hover:text-[#C17B4F] transition-colors">Bookstore</a>
              <a href="/contact" className="hover:text-[#C17B4F] transition-colors">Contact</a>
              <a href="/privacy" className="hover:text-[#C17B4F] transition-colors">Privacy</a>
            </div>
            <div className="flex items-center gap-1 text-xs text-[#8B7355]">
              <span>&copy; {new Date().getFullYear()} David Emuria</span>
              <Heart className="h-3 w-3 mx-1 text-[#C17B4F]" />
              <span>All rights reserved</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}