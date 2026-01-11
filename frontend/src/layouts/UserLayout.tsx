import { Outlet } from "react-router-dom";

export default function UserLayout() {
  return (
    <div className="min-h-screen bg-muted">
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">
          EmuriaBookStore 📚
          </h1>
          <nav className="flex gap-6 text-sm font-medium">
            <a href="/" className="hover:text-primary">Home</a>
            <a href="/contact" className="hover:text-primary">Contact</a>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <Outlet />
      </main>

      <footer className="border-t bg-white py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} EmuriaBookStore. All rights reserved.
      </footer>
    </div>
  );
}
