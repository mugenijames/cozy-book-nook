// frontend/src/components/Layout.tsx

import { Outlet } from "react-router-dom";
import Header from "@/sections/Header";
import Footer from "@/sections/Footer";

export default function Layout() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Space reserved for fixed navbar */}
      <main className="pt-[76px]">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}