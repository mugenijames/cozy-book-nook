// src/components/admin/AdminLayout.tsx
import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import DashboardSidebar from "./DashboardSidebar";
import Footer from "@/sections/Footer";

export default function AdminLayout() {
  const { isAdmin, token, isLoading } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!token || !isAdmin) {
        navigate("/admin/login");
      }
    }
  }, [isLoading, token, isAdmin, navigate]);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F9F6EF]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4A017] mx-auto mb-4" />
          <p className="text-[#5C4436]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!token || !isAdmin) return null;

  return (
    <div className="flex min-h-screen bg-[#F9F6EF]">
      {/* Mobile overlay backdrop */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — sticky in flow on desktop, fixed on mobile */}
      <DashboardSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isMobile={isMobile}
      />

      {/* Main area — naturally takes remaining width */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-[#E8DDD4] px-6 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-1.5 rounded hover:bg-[#F9F6EF] text-[#2E1208] text-xl"
              >
                ☰
              </button>
            )}
            <span className="font-heading font-semibold text-[#2E1208]">
              David Emuria — Admin
            </span>
          </div>
          <a
            href="/"
            className="text-sm text-[#C17B4F] hover:text-[#A55E36] font-medium transition-colors"
          >
            ← View public site
          </a>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>

        {/* Footer — full width naturally since sidebar is in flow */}
        <Footer />
      </div>
    </div>
  );
}