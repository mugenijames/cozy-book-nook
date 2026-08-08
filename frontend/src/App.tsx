// frontend/src/App.tsx

import { Routes, Route, Navigate } from "react-router-dom";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import "./App.css";

// Layouts
import Layout from "@/components/Layout";
import DashboardLayout from "@/components/admin/DashboardLayout";

// Public pages
import Home from "./pages/Home";
import BookDetail from "./pages/BookDetail";
import BooksCatalogPage from "./pages/Books";
import ProgramActivityPage from "./pages/ProgramActivity";
import LoginPage from "./pages/admin/Login";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";

// Admin pages
import DashboardHome from "@/features/admin/dashboard/DashboardHome";
import BookListPage from "@/features/admin/books/BookListPage";
import BookFormPage from "@/features/admin/books/BookFormPage";

// Route protection
import ProtectedRoute from "@/components/admin/ProtectedRoute";

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

        {/* ================================
            PUBLIC WEBSITE
        ================================= */}

        <Route element={<Layout />}>

          {/* Homepage */}
          <Route
            path="/"
            element={<Home />}
          />

          {/* Full Books Catalog */}
          <Route
            path="/books"
            element={<BooksCatalogPage />}
          />

          {/* Individual Book */}
          <Route
            path="/book/:slug"
            element={<BookDetail />}
          />

          {/* Programs */}
          <Route
            path="/programs/:slug"
            element={<ProgramActivityPage />}
          />

          {/* Legal */}
          <Route
            path="/privacy"
            element={<Privacy />}
          />

          <Route
            path="/terms"
            element={<Terms />}
          />

        </Route>


        {/* ================================
            ADMIN LOGIN
        ================================= */}

        <Route
          path="/admin/login"
          element={<LoginPage />}
        />


        {/* ================================
            PROTECTED ADMIN
        ================================= */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >

          {/* /admin */}
          <Route
            index
            element={<DashboardHome />}
          />

          {/* /admin/books */}
          <Route
            path="books"
            element={<BookListPage />}
          />

          {/* /admin/books/new */}
          <Route
            path="books/new"
            element={<BookFormPage />}
          />

          {/* /admin/books/:id/edit */}
          <Route
            path="books/:id/edit"
            element={<BookFormPage />}
          />

        </Route>


        {/* ================================
            CATCH ALL
        ================================= */}

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;