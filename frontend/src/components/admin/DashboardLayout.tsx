// src/components/admin/DashboardLayout.tsx
import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import DashboardSidebar from "./DashboardSidebar";

export default function DashboardLayout() {
  const { isAdmin, token, isLoading } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  console.log("DashboardLayout rendering", { isLoading, isAdmin, token: !!token });

  try {
    // Handle authentication
    useEffect(() => {
      if (!isLoading) {
        if (!token || !isAdmin) {
          console.log("Not authenticated, redirecting to login");
          navigate("/admin/login");
        }
      }
    }, [isLoading, token, isAdmin, navigate]);

    // Handle responsive
    useEffect(() => {
      const handleResize = () => {
        const mobile = window.innerWidth < 768;
        setIsMobile(mobile);
        setSidebarOpen(!mobile);
      };

      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Show loading state
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      );
    }

    // Don't render if not authenticated
    if (!token || !isAdmin) {
      return null;
    }

    return (
      <div className="flex h-screen overflow-hidden">
        <DashboardSidebar 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen}
          isMobile={isMobile}
        />
        <div className="flex-1 overflow-auto bg-gray-50">
          <div className="p-6">
            <Outlet />
          </div>
        </div>
      </div>
    );
  } catch (err) {
    console.error("DashboardLayout error:", err);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <h2>Error loading dashboard</h2>
          <pre>{String(err)}</pre>
        </div>
      </div>
    );
  }
}