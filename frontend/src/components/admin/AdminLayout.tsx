// src/components/admin/AdminLayout.tsx
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader'; // ← we’ll create this next

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-muted/40 dark:bg-background">
      {/* Top header bar – fixed or sticky */}
      <AdminHeader />

      {/* Main content area */}
      <div className="flex flex-1">
        {/* Sidebar – hidden on mobile, shown on md+ */}
        <aside className="hidden md:block w-64 shrink-0 border-r bg-background">
          <AdminSidebar />
        </aside>

        {/* Mobile drawer can be added later if needed */}

        {/* Scrollable main content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}