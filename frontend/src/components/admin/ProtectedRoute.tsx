import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

const ProtectedRoute = () => {
  const { isAdmin, token, isLoading } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAdmin || !token) {
    console.log("Access denied - redirecting to login");
    // Fix: Redirect to /admin/login instead of /login
    return <Navigate to="/admin/login" replace />;
  }

  // User is authenticated, render the protected content
  return <Outlet />;
};

export default ProtectedRoute;