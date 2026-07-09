// src/components/admin/DashboardSidebar.tsx
import { NavLink, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  BookOpen, 
  LogOut,
  Menu,
  X
} from "lucide-react";
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
];

export default function DashboardSidebar({ sidebarOpen, setSidebarOpen, isMobile }: SidebarProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/admin/login");
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-gray-900 text-white transition-all duration-300 z-50 ${
        sidebarOpen ? 'w-64' : 'w-16'
      } ${isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          {sidebarOpen && <span className="font-bold text-lg">Admin Panel</span>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-gray-700 rounded"
          >
            {sidebarOpen ? <span>←</span> : <span>→</span>}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => isMobile && setSidebarOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2 mb-2 rounded transition-colors
                ${isActive ? 'bg-orange-600 text-white' : 'text-gray-300 hover:bg-gray-800'}
                ${!sidebarOpen && 'justify-center'}
              `}
            >
              <item.icon size={20} />
              {sidebarOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
          
          {/* Logout button */}
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 px-3 py-2 mt-4 rounded transition-colors w-full text-gray-300 hover:bg-red-600/20 hover:text-red-300 ${
              !sidebarOpen && 'justify-center'
            }`}
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </nav>
      </div>

      {/* Main content push */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        {/* This div will be filled by the main content from DashboardLayout */}
      </div>
    </>
  );
}