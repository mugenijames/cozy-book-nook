import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Index from "./pages/Index";
import BookDetail from "./pages/BookDetail";
import Checkout from "./pages/Checkout";
import Contact from "./pages/Contact";
import Subscribe from "./pages/Subscribe";
import NotFound from "./pages/NotFound";

import AdminDashboard from "./pages/AdminDashboard";
import AdminBooks from "./components/admin/AdminBooks";
import AdminOrders from "./components/admin/AdminOrders";

import { useAuth } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => {
  const { user } = useAuth(); // Admin user
  const [refresh, setRefresh] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route
              path="/"
              element={<Index refresh={refresh} />}
            />
            <Route path="/book/:id" element={<BookDetail />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/subscribe" element={<Subscribe />} />

            {/* Admin routes - only accessible if admin is logged in */}
            <Route
              path="/admin"
              element={
                user?.role === "ADMIN" ? <AdminDashboard /> : <Navigate to="/" />
              }
            />
            <Route
              path="/admin/books"
              element={
                user?.role === "ADMIN" ? <AdminBooks /> : <Navigate to="/" />
              }
            />
            <Route
              path="/admin/orders"
              element={
                user?.role === "ADMIN" ? <AdminOrders /> : <Navigate to="/" />
              }
            />

            {/* Catch all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
