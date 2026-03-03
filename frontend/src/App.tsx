// src/App.tsx (or src/router.tsx)
import { Routes, Route, Navigate } from "react-router-dom";

// Public pages
import Home from "./pages/Home";
import BookDetail from "./pages/BookDetail";

import AdminLayout from "@/components/admin/AdminLayout";
import AdminDashboard from "@/components/admin/AdminDashboard";
import BookListPage from "@/components/admin/BookListPage";
import BookFormPage from "@/components/admin/BookFormPage";

import { AdminRoute } from "@/components/admin/ProtectedRoutes"; 

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/book/:slug" element={<BookDetail />} />

      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />

          <Route path="/admin/books" element={<BookListPage />} />
          <Route path="/admin/books/new" element={<BookFormPage />} />
          <Route path="/admin/books/:id/edit" element={<BookFormPage />} />

        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;