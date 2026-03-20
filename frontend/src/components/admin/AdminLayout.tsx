// src/components/admin/AdminLayout.tsx
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "@/components/ui/button";

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login"); // Make sure this matches your login route
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r shadow-sm p-6 flex flex-col">
        <h2 className="font-bold text-xl mb-8 px-2 text-slate-900">Admin Panel</h2>
        <nav className="space-y-2 flex-1">
          <Link to="/admin" className="block px-2 py-2 text-slate-600 hover:bg-slate-100 rounded">Dashboard</Link>
          <Link to="/admin/books" className="block px-2 py-2 text-slate-600 hover:bg-slate-100 rounded">Manage Books</Link>
          <Link to="/admin/books/new" className="block px-2 py-2 text-slate-600 hover:bg-slate-100 rounded">Add New Book</Link>
        </nav>
        
        <Button variant="outline" onClick={handleLogout} className="w-full">
          Sign Out
        </Button>
      </aside>
      
      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="mx-auto max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}