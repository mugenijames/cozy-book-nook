// App.tsx - COMPLETE FIX
import { Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./App.css";

// Import Layout
import Layout from "@/components/Layout";
import DashboardLayout from "@/components/admin/DashboardLayout";

// Public pages
import Home from "./pages/Home";
import BookDetail from "./pages/BookDetail";
import BooksCatalogPage from "./pages/Books";
import ProgramActivityPage from "./pages/ProgramActivity";
import LoginPage from "./pages/admin/Login";

// Admin pages
import DashboardHome from "@/features/admin/dashboard/DashboardHome";
import BookListPage from "@/features/admin/books/BookListPage";
import BookFormPage from "@/features/admin/books/BookFormPage";

// Route protection
import ProtectedRoute from "@/components/admin/ProtectedRoute";

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
        {/* Public routes with Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<BooksCatalogPage />} />
          <Route path="/book/:slug" element={<BookDetail />} />
          <Route path="/programs/:slug" element={<ProgramActivityPage />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
        </Route>

        {/* Admin Login - no layout */}
        <Route path="/admin/login" element={<LoginPage />} />

        {/* Protected Admin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* IMPORTANT: Use index for the dashboard, NOT a separate path */}
          <Route index element={<DashboardHome />} />
          <Route path="books" element={<BookListPage />} />
          <Route path="books/new" element={<BookFormPage />} />
          <Route path="books/:id/edit" element={<BookFormPage />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;