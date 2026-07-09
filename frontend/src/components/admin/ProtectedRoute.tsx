// src/components/admin/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAdmin, token, isLoading, logout } = useAuth();

  // Check token expiry on mount
  useEffect(() => {
    const checkTokenExpiry = () => {
      const tokenExpiry = localStorage.getItem('token_expiry');
      if (tokenExpiry && Date.now() > parseInt(tokenExpiry)) {
        logout();
      }
    };
    
    checkTokenExpiry();
    const interval = setInterval(checkTokenExpiry, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [logout]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    );
  }

  if (!isAdmin || !token) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}