// src/components/admin/AdminLayout.tsx
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  BookOpen, 
  PlusCircle, 
  LogOut, 
  Menu, 
  X,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Users,
  Settings,
  BarChart3,
  Mail,
  Sun,
  Moon,
  Sparkles
} from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("admin-theme") as "light" | "dark";
    return saved || "light";
  });

  // Check if mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Apply theme
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("admin-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
    toast.success(`${theme === "light" ? "Dark" : "Light"} mode activated`);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/admin/login");
  };

  const navItems = [
    { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/admin/books", icon: BookOpen, label: "Manage Books" },
    { path: "/admin/books/new", icon: PlusCircle, label: "Add New Book" },
    { path: "/admin/orders", icon: ShoppingBag, label: "Orders" },
    { path: "/admin/users", icon: Users, label: "Users" },
    { path: "/admin/analytics", icon: BarChart3, label: "Analytics" },
    { path: "/admin/settings", icon: Settings, label: "Settings" },
    { path: "/admin/messages", icon: Mail, label: "Messages" },
  ];

  // Theme-aware classes
  const sidebarBg = theme === "light" ? "bg-[#2E1208]" : "bg-gray-900";
  const sidebarText = theme === "light" ? "text-gray-300" : "text-gray-400";
  const sidebarHover = theme === "light" ? "hover:bg-[#C17B4F]/20" : "hover:bg-gray-800";
  const activeBg = theme === "light" ? "bg-[#C17B4F]" : "bg-[#C17B4F]/80";
  const activeText = "text-white";
  const mainBg = theme === "light" ? "bg-[#F9F6EF]" : "bg-gray-900";
  const headerBg = theme === "light" ? "bg-white" : "bg-gray-800";

  return (
    <div className="flex min-h-screen overflow-hidden">
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:relative z-50 h-full transition-all duration-300 ease-in-out flex flex-col shadow-xl",
          sidebarBg,
          sidebarOpen ? "w-64" : "w-20",
          isMobile && !sidebarOpen && "-translate-x-full",
          isMobile && sidebarOpen && "translate-x-0"
        )}
      >
        {/* Sidebar Header with Toggle */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          {sidebarOpen ? (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#C17B4F] to-[#A55E36] flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="font-heading text-lg font-bold text-white">
                Admin Panel
              </span>
            </div>
          ) : (
            <div className="mx-auto h-8 w-8 rounded-full bg-gradient-to-br from-[#C17B4F] to-[#A55E36] flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="hidden md:flex text-white hover:bg-white/10"
          >
            {sidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Close Button */}
        {isMobile && sidebarOpen && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="absolute right-2 top-2 text-white hover:bg-white/10 md:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 group",
                      sidebarText,
                      sidebarHover,
                      isActive && `${activeBg} text-white shadow-lg`
                    )
                  }
                  title={!sidebarOpen ? item.label : undefined}
                >
                  <item.icon className={cn("h-5 w-5 shrink-0", "group-hover:scale-110 transition-transform")} />
                  {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-white/10 p-4 space-y-2">
          {/* Theme Toggle */}
          <Button
            onClick={toggleTheme}
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 text-white hover:bg-white/10 transition-all",
              !sidebarOpen && "justify-center px-2"
            )}
            title={!sidebarOpen ? (theme === "light" ? "Dark Mode" : "Light Mode") : undefined}
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5 shrink-0" />
            ) : (
              <Sun className="h-5 w-5 shrink-0 text-yellow-400" />
            )}
            {sidebarOpen && <span className="text-sm">{theme === "light" ? "Dark Mode" : "Light Mode"}</span>}
          </Button>

          {/* Logout Button */}
          <Button
            onClick={handleLogout}
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 text-white hover:bg-red-600/20 hover:text-red-300 transition-all",
              !sidebarOpen && "justify-center px-2"
            )}
            title={!sidebarOpen ? "Logout" : undefined}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {sidebarOpen && <span className="text-sm">Sign Out</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={cn("flex-1 flex flex-col overflow-x-hidden transition-all duration-300", mainBg)}>
        {/* Top Header */}
        <header className={cn("sticky top-0 z-30 flex h-16 items-center justify-between border-b px-4 shadow-sm md:px-6", headerBg, "border-[#E8DDD4] dark:border-gray-700")}>
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-[#2E1208] dark:text-white">Admin Dashboard</h1>
              <p className="text-xs text-[#5C4436] dark:text-gray-400 hidden sm:block">
                Manage your bookstore efficiently
              </p>
            </div>
          </div>
          
          {/* Top Right Actions */}
          <div className="flex items-center gap-2">
            {/* Quick Stats Badge */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#C17B4F]/10 text-[#C17B4F] text-xs">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span>System Online</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}