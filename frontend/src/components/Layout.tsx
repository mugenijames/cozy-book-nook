// frontend/src/components/Layout.tsx
import { Outlet } from "react-router-dom";
import Header from "@/sections/Header";
import Footer from "@/sections/Footer";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}