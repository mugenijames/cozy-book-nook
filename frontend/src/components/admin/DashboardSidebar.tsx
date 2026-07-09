// src/components/admin/DashboardSidebar.tsx
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, BookOpen, LogOut, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  isMobile: boolean;
}

const menuItems = [
  { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/admin/books", icon: BookOpen, label: "Books" },
  { path: "/admin/orders", icon: ShoppingBag, label: "Orders" },
];

export default function DashboardSidebar({ sidebarOpen, setSidebarOpen, isMobile }: SidebarProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/admin/login");
  };

  if (isMobile && !sidebarOpen) return null;

  return (
    <aside
      className={`flex flex-col bg-[#2E1208] text-white shrink-0 transition-all duration-300 ${
        sidebarOpen ? "w-64" : "w-16"
      } ${isMobile ? "fixed inset-y-0 left-0 z-50 shadow-2xl" : "sticky top-0 h-screen"}`}
    >
      {/* Logo / header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-[#D4A017]/30">
        {sidebarOpen && (
          <div className="flex items-center gap-2 min-w-0">
            <img src="/logo.png" alt="Logo" className="h-8 w-8 rounded-full border border-[#D4A017] shrink-0" />
            <span className="font-heading font-bold text-sm text-[#D4A017] truncate">Admin Panel</span>
          </div>
        )}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded hover:bg-[#D4A017]/20 text-[#D4A017] transition-colors shrink-0 ml-auto"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/admin"}
            onClick={() => isMobile && setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
              ${isActive ? "bg-[#D4A017] text-[#2E1208]" : "text-gray-300 hover:bg-[#D4A017]/20 hover:text-[#D4A017]"}
              ${!sidebarOpen ? "justify-center" : ""}`
            }
            title={!sidebarOpen ? item.label : undefined}
          >
            <item.icon size={18} className="shrink-0" />
            {sidebarOpen && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-2 py-4 border-t border-[#D4A017]/30">
        <button
          onClick={handleLogout}
          title={!sidebarOpen ? "Logout" : undefined}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium w-full text-gray-300 hover:bg-red-900/40 hover:text-red-300 transition-all duration-150 ${
            !sidebarOpen ? "justify-center" : ""
          }`}
        >
          <LogOut size={18} className="shrink-0" />
          {sidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}