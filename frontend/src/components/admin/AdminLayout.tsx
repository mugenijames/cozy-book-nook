// src/components/admin/AdminLayout.tsx
import { Outlet } from 'react-router-dom';

// We commented out the missing components to prevent the "ReferenceError"
// import AdminSidebar from './AdminSidebar';
// import AdminHeader from './AdminHeader'; 

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      {/* Header - Commented out until file is ready */}
      {/* <AdminHeader /> */}

      <div className="flex flex-1">
        {/* Sidebar - Commented out until file is ready */}
        {/* <aside className="hidden md:block w-64 border-r bg-background">
          <AdminSidebar />
        </aside> */}

        {/* Main Content Area */}
        <main className="flex-1 p-8">
          <div className="mx-auto max-w-7xl">
            {/* The Outlet is where your Dashboard will appear */}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}