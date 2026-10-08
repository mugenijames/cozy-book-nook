import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import {
  ReactQueryDevtools,
} from "@tanstack/react-query-devtools";

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
import Courses from "@/pages/Courses";
import ProgramActivityPage from "@/pages/ProgramActivity";
import ProgramHighlightPage from "@/pages/ProgramHighlight";

// ============================================================
// BLOG
// ============================================================

import Blogs from "@/pages/Blogs";
import BlogDetail from "@/pages/BlogDetail";

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
// ADMIN PAGES
// ============================================================

import DashboardHome from "@/features/admin/dashboard/DashboardHome";

import AdminBooks from "@/pages/admin/AdminBooks";

import AddBook from "@/components/admin/AddBook";

import BookListPage from "@/features/admin/books/BookListPage";
import BookFormPage from "@/features/admin/books/BookFormPage";

import AdminUsersPage from "@/features/admin/users/AdminUsersPage";

import AdminBlog from "@/pages/admin/AdminBlog";
import AdminOrders from "@/pages/admin/AdminOrders";
import AdminPayments from "@/pages/admin/AdminPayments";

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
// ADD BOOK ROUTE
// ============================================================
//
// After successfully adding a book, return to the Books
// Management page.
//

function AddBookRoute() {
  return (
    <AddBook
      onAdded={() => {
        window.location.href =
          "/admin/books";
      }}
    />
  );
}

// ============================================================
// APP
// ============================================================

function App() {
  return (
    <QueryClientProvider
      client={queryClient}
    >
      <Routes>

        {/* ======================================================
            PUBLIC WEBSITE
        ======================================================= */}

        <Route
          element={<Layout />}
        >

          {/* ====================================================
              HOME
          ==================================================== */}

          <Route
            path="/"
            element={<Home />}
          />

          {/* ====================================================
              PUBLIC BOOKS
          ==================================================== */}

          <Route
            path="/books"
            element={
              <BooksCatalogPage />
            }
          />

          <Route
            path="/book/:slug"
            element={
              <BookDetail />
            }
          />

          {/* ====================================================
              COURSES
          ==================================================== */}

          <Route
            path="/courses"
            element={<Courses />}
          />

          {/* ====================================================
              BLOGS
          ==================================================== */}

          <Route
            path="/blogs"
            element={<Blogs />}
          />

          <Route
            path="/blogs/:slug"
            element={<BlogDetail />}
          />

          {/* ====================================================
              PROGRAMS
          ==================================================== */}

          <Route
            path="/programs/:slug"
            element={
              <ProgramActivityPage />
            }
          />

          <Route
            path="/programs/:slug/:highlightSlug"
            element={
              <ProgramHighlightPage />
            }
          />

          {/* ====================================================
              DEAR DAD INITIATIVE
          ==================================================== */}

          <Route
            path="/dear-dad"
            element={
              <DearDadInitiative />
            }
          />

          <Route
            path="/dear-dad/support"
            element={
              <DearDadSupportPage />
            }
          />

          <Route
            path="/dear-dad/get-involved"
            element={
              <DearDadGetInvolved />
            }
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

          {/* ====================================================
              DASHBOARD
          ==================================================== */}

          <Route
            index
            element={
              <DashboardHome />
            }
          />

          {/* ====================================================
              BOOK MANAGEMENT
          ==================================================== */}

          {/* ----------------------------------------------------
              Books catalogue
          ----------------------------------------------------- */}

          <Route
            path="books"
            element={
              <AdminBooks />
            }
          />

          {/* ----------------------------------------------------
              Add new book
          ----------------------------------------------------- */}

          <Route
            path="books/new"
            element={
              <AddBookRoute />
            }
          />

          {/* ----------------------------------------------------
              Edit existing book
              
              IMPORTANT:
              This is now the ONLY edit route.

              URL:
              /admin/books/:id/edit

              Component:
              BookFormPage
          ----------------------------------------------------- */}

          <Route
            path="books/:id/edit"
            element={
              <BookFormPage />
            }
          />

          {/* ----------------------------------------------------
              Legacy book list

              Kept available so existing links do not break.
          ----------------------------------------------------- */}

          <Route
            path="books/legacy"
            element={
              <BookListPage />
            }
          />

          {/* ====================================================
              BLOG MANAGEMENT
          ==================================================== */}

          <Route
            path="blog"
            element={
              <AdminBlog />
            }
          />

          {/* ====================================================
              ORDER MANAGEMENT
          ==================================================== */}

          <Route
            path="orders"
            element={
              <AdminOrders />
            }
          />

          {/* ====================================================
              PAYMENT MANAGEMENT
          ==================================================== */}

          <Route
            path="payments"
            element={
              <AdminPayments />
            }
          />

          {/* ====================================================
              ADMINISTRATOR MANAGEMENT
          ==================================================== */}

          <Route
            path="users"
            element={
              <ProtectedRoute
                requireSuperAdmin
              >
                <AdminUsersPage />
              </ProtectedRoute>
            }
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
