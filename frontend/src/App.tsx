import { Routes, Route, Navigate, Link } from "react-router-dom";

// Public pages
import Home from "./pages/Home";
import BookDetail from "./pages/BookDetail";
import LoginPage from "./pages/admin/Login"; // Ensure this path is correct

// Admin layout & pages
import AdminLayout from "@/components/admin/AdminLayout";
import AdminDashboard from "@/features/admin/dashboard/AdminDashboard";
import BookListPage from "@/features/admin/books/BookListPage";
import BookFormPage from "@/features/admin/books/BookFormPage";

// Route protection
import AdminRoute from "@/components/admin/ProtectedRoute";

// Shadcn UI component
import { Button } from "@/components/ui/button";

function App() {
  return (
    <Routes>
      {/* ==================== Public routes ==================== */}
      <Route path="/" element={<Home />} />
      <Route path="/book/:slug" element={<BookDetail />} />

      {/* Move Login OUTSIDE the protected routes so it's accessible */}
      <Route path="/admin/login" element={<LoginPage />} />

      {/* ==================== Protected Admin routes ==================== */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          {/* Dashboard – shown at /admin */}
          <Route index element={<AdminDashboard />} />

          {/* Books section – nested under /admin/books */}
          <Route path="books">
            <Route index element={<BookListPage />} />
            <Route path="new" element={<BookFormPage />} />
            <Route path=":id/edit" element={<BookFormPage />} />
          </Route>

          <Route path="*" element={
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="text-center space-y-6">
                <h1 className="text-6xl font-bold text-primary">404</h1>
                <p className="text-xl text-muted-foreground">Page not found in admin area</p>
                <Button asChild size="lg">
                  <Link to="/admin">Back to Dashboard</Link>
                </Button>
              </div>
            </div>
          } />
        </Route>
      </Route>

      {/* Catch-all for public routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;