// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";

// Public pages
import Home from "./pages/Home";
import BookDetail from "./pages/BookDetail";

// Admin layout & pages
import AdminLayout from "@/components/admin/AdminLayout";
import AdminDashboard from "@/components/admin/AdminDashboard";
import BookListPage from "@/components/admin/BookListPage";
import BookFormPage from "@/components/admin/BookFormPage";

// Route protection
import AdminRoute from "@/components/admin/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* ==================== Public routes ==================== */}
      <Route path="/" element={<Home />} />
      <Route path="/book/:slug" element={<BookDetail />} />

      {/* ==================== Protected Admin routes ==================== */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          {/* Dashboard – shown when going to /admin */}
          <Route index path="/admin" element={<AdminDashboard />} />

          {/* Books section */}
          <Route path="/admin/books">
            <Route index element={<BookListPage />} />
            <Route path="new" element={<BookFormPage />} />
            <Route path=":id/edit" element={<BookFormPage />} />
          </Route>

          {/* Optional: 404 inside admin layout */}
          <Route path="*" element={
            <div className="flex min-h-screen items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold">404</h1>
                <p className="mt-4 text-muted-foreground">Page not found in admin area</p>
                <Button asChild className="mt-6">
                  <Link to="/admin">Back to Dashboard</Link>
                </Button>
              </div>
            </div>
          } />
        </Route>
      </Route>

      {/* ==================== Catch-all for public 404 ==================== */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;