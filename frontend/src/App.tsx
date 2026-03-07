// src/App.tsx
import { Routes, Route, Navigate, Link } from "react-router-dom";

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

// Shadcn UI component (used in the 404 block)
import { Button } from "@/components/ui/button";

function App() {
  return (
    <Routes>
      {/* ==================== Public routes ==================== */}
      <Route path="/" element={<Home />} />
      <Route path="/book/:slug" element={<BookDetail />} />

      {/* ==================== Protected Admin routes ==================== */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          {/* Dashboard – shown at exactly /admin */}
          <Route index path="/admin" element={<AdminDashboard />} />

          {/* Books section – nested under /admin/books */}
          <Route path="/admin/books">
            <Route index element={<BookListPage />} />
            <Route path="new" element={<BookFormPage />} />
            <Route path=":id/edit" element={<BookFormPage />} />
          </Route>

          {/* Optional: 404 page inside admin layout */}
          <Route path="*" element={
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="text-center space-y-6">
                <h1 className="text-6xl font-bold text-primary">404</h1>
                <p className="text-xl text-muted-foreground">
                  Page not found in admin area
                </p>
                <Button asChild size="lg">
                  <Link to="/admin">
                    Back to Dashboard
                  </Link>
                </Button>
              </div>
            </div>
          } />
        </Route>
      </Route>

      {/* ==================== Catch-all for public routes ==================== */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;