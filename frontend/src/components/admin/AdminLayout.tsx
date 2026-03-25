// src/components/admin/AdminLayout.tsx
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, BookOpen, PlusCircle, LogOut } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
    isActive
      ? "bg-[#D4A017]/15 text-[#F5E6B5] shadow-inner shadow-black/10"
      : "text-white/75 hover:bg-white/5 hover:text-white"
  );

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="flex min-h-screen bg-[#F9F6EF] text-[#2E1208]">
      <aside className="flex w-64 shrink-0 flex-col border-r border-[#1a0a04] bg-[#2E1208] shadow-xl">
        <div className="border-b border-white/10 px-5 py-6">
          <p className="font-heading text-lg font-semibold tracking-tight text-white">
            David Emuria
          </p>
          <p className="mt-1 text-xs font-medium uppercase tracking-wider text-[#D4A017]/90">
            Admin
          </p>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-4">
          <NavLink to="/admin" end className={navLinkClass}>
            <LayoutDashboard className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
            Dashboard
          </NavLink>
          <NavLink to="/admin/books" className={navLinkClass}>
            <BookOpen className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
            Manage Books
          </NavLink>
          <NavLink to="/admin/books/new" className={navLinkClass}>
            <PlusCircle className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
            Add New Book
          </NavLink>
        </nav>

        <div className="border-t border-white/10 p-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleLogout}
            className="w-full gap-2 border-[#D4A017]/40 bg-transparent text-[#F5E6B5] hover:bg-[#D4A017]/10 hover:text-white"
          >
            <LogOut className="h-4 w-4" aria-hidden />
            Sign Out
          </Button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto min-h-full max-w-7xl px-5 py-8 md:px-8 md:py-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
