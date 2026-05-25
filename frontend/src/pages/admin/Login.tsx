// src/pages/admin/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff } from "lucide-react";
import Footer from "@/sections/Footer";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#F9F6EF] via-[#F5EDE3] to-[#E8E0D5]">
      {/* Logo centered at top */}
      <div className="flex justify-center pt-12 pb-6">
        <div className="bg-gradient-to-br from-[#C17B4F] to-[#A55E36] p-3 rounded-2xl shadow-lg">
          <img 
            src="/logo.png" 
            alt="David Emuria Logo" 
            className="h-16 w-16 object-cover rounded-xl"
          />
        </div>
      </div>

      {/* Brand name centered below logo */}
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold text-[#2E1208]">DAVID EMURIA</h1>
      </div>

      {/* Login Card */}
      <div className="flex-1 flex items-center justify-center px-4 pb-12">
        <Card className="w-full max-w-md shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="space-y-2 text-center pb-6">
            <CardTitle className="text-2xl font-bold text-[#2E1208]">Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#2E1208] font-medium">Email Address / Username</Label>
                <Input 
                  id="email"
                  type="email" 
                  placeholder="admin@example.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  disabled={loading}
                  className="border-[#D4C5B5] focus:border-[#C17B4F] focus:ring-[#C17B4F]/20 h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#2E1208] font-medium">Password</Label>
                <div className="relative">
                  <Input 
                    id="password"
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    disabled={loading}
                    className="border-[#D4C5B5] focus:border-[#C17B4F] focus:ring-[#C17B4F]/20 h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#8B7355] hover:text-[#C17B4F] transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-[#C17B4F] to-[#A55E36] hover:from-[#A55E36] hover:to-[#8B4513] text-white shadow-md transition-all duration-300 h-11" 
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

      {/* Shared Footer */}
      <Footer />
    </div>
  );
}