// frontend/src/App.tsx

import { Navigate, Route, Routes } from "react-router-dom";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import "./App.css";

// ============================================================
// LAYOUTS
// ============================================================

import Layout from "@/components/Layout";
import DashboardLayout from "@/components/admin/DashboardLayout";

// ============================================================
// PUBLIC PAGES
// ============================================================

import Home from "@/pages/Home";
import BooksCatalogPage from "@/pages/Books";
import BookDetail from "@/pages/BookDetail";

import ProgramActivityPage from "@/pages/ProgramActivity";
import ProgramHighlightPage from "@/pages/ProgramHighlight";

// ============================================================
// DEAR DAD INITIATIVE
// ============================================================

import DearDadInitiative from "@/pages/DearDadInitiative";
import DearDadSupportPage from "@/pages/DearDadSupport";
import DearDadGetInvolved from "@/pages/DearDadGetInvolved";

// ============================================================
// LEGAL
// ============================================================

import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";

// ============================================================
// AUTHENTICATION
// ============================================================

import LoginPage from "@/pages/admin/Login";

// ============================================================
// ADMIN
// ============================================================

import DashboardHome from "@/features/admin/dashboard/DashboardHome";
import BookListPage from "@/features/admin/books/BookListPage";
import BookFormPage from "@/features/admin/books/BookFormPage";

// ============================================================
// ROUTE PROTECTION
// ============================================================

import ProtectedRoute from "@/components/admin/ProtectedRoute";

// ============================================================
// REACT QUERY
// ============================================================

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

// ============================================================
// APP
// ============================================================

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>

        {/* ======================================================
            PUBLIC WEBSITE
        ======================================================= */}

        <Route element={<Layout />}>

          {/* ====================================================
              HOME
          ==================================================== */}

          <Route
            path="/"
            element={<Home />}
          />

          {/* ====================================================
              BOOKS
          ==================================================== */}

          <Route
            path="/books"
            element={<BooksCatalogPage />}
          />

          <Route
            path="/book/:slug"
            element={<BookDetail />}
          />

          {/* ====================================================
              PROGRAMS
          ==================================================== */}

          {/* Main program page */}
          <Route
            path="/programs/:slug"
            element={<ProgramActivityPage />}
          />

          {/* Individual program area / highlight */}
          <Route
            path="/programs/:slug/:highlightSlug"
            element={<ProgramHighlightPage />}
          />

          {/* ====================================================
              DEAR DAD INITIATIVE
          ==================================================== */}

          {/* Main Dear Dad Initiative page */}
          <Route
            path="/dear-dad"
            element={<DearDadInitiative />}
          />

          {/* Donation / Sponsorship / Support page */}
          <Route
            path="/dear-dad/support"
            element={<DearDadSupportPage />}
          />

          {/* Partnership / Get Involved page */}
          <Route
            path="/dear-dad/get-involved"
            element={<DearDadGetInvolved />}
          />

          {/* ====================================================
              LEGAL
          ==================================================== */}

          <Route
            path="/privacy"
            element={<Privacy />}
          />

          <Route
            path="/terms"
            element={<Terms />}
          />

        </Route>

        {/* ======================================================
            ADMIN LOGIN
        ======================================================= */}

        <Route
          path="/admin/login"
          element={<LoginPage />}
        />

        {/* ======================================================
            PROTECTED ADMIN AREA
        ======================================================= */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >

          {/* Dashboard */}
          <Route
            index
            element={<DashboardHome />}
          />

          {/* Books */}
          <Route
            path="books"
            element={<BookListPage />}
          />

          {/* Add book */}
          <Route
            path="books/new"
            element={<BookFormPage />}
          />

          {/* Edit book */}
          <Route
            path="books/:id/edit"
            element={<BookFormPage />}
          />

        </Route>

        {/* ======================================================
            404 / UNKNOWN ROUTES
        ======================================================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

      {/* ========================================================
          REACT QUERY DEVTOOLS
          Development only
      ========================================================= */}

      {import.meta.env.DEV && (
        <ReactQueryDevtools
          initialIsOpen={false}
        />
      )}

    </QueryClientProvider>
  );
}

export default App;