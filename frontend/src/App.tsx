import { Routes, Route, Navigate, Link } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./App.css";

// Import Layout
import Layout from "@/components/Layout";  // ← ADD THIS

// Public pages
import Home from "./pages/Home";
import BookDetail from "./pages/BookDetail";
import BooksCatalogPage from "./pages/Books";
import ProgramActivityPage from "./pages/ProgramActivity";
import LoginPage from "./pages/admin/Login";

// Admin layout & pages
import AdminLayout from "@/components/admin/AdminLayout";
import AdminDashboard from "@/features/admin/dashboard/AdminDashboard";
import BookListPage from "@/features/admin/books/BookListPage";
import BookFormPage from "@/features/admin/books/BookFormPage";

// Route protection
import AdminRoute from "@/components/admin/ProtectedRoute";

// Shadcn UI component
import { Button } from "@/components/ui/button";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        {/* ==================== Public routes with Layout (Header + Footer) ==================== */}
        <Route element={<Layout />}>  {/* ← ADD THIS WRAPPER */}
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<BooksCatalogPage />} />
          <Route path="/book/:slug" element={<BookDetail />} />
          <Route path="/programs/:slug" element={<ProgramActivityPage />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
        </Route>  {/* ← CLOSE THE WRAPPER */}

        {/* Admin Login - no header/footer */}
        <Route path="/admin/login" element={<LoginPage />} />

        {/* Protected Admin routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
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

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;