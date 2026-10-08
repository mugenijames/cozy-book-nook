import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import DashboardSidebar from "./DashboardSidebar";
import { Menu, ExternalLink } from "lucide-react";

export default function DashboardLayout() {
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const token =
      localStorage.getItem("admin_token") ||
      localStorage.getItem("token") ||
      localStorage.getItem("auth_token");

    if (!token) {
      navigate("/admin/login", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white">
      <DashboardSidebar
        collapsed={collapsed}
        onToggle={() =>
          setCollapsed((value) => !value)
        }
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div
        className={[
          "min-h-screen bg-white transition-all duration-300",
          collapsed
            ? "lg:pl-[76px]"
            : "lg:pl-[260px]",
        ].join(" ")}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-[#E6E6E6] bg-white/95 backdrop-blur">
          <div className="flex h-[76px] items-center justify-between px-4 sm:px-6 lg:px-8">
            {/* Mobile menu */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E0E0E0] bg-white text-[#222222] shadow-sm transition hover:border-[#C9A227] hover:text-[#C9A227] lg:hidden"
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Desktop heading */}
            <div className="hidden lg:block">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C9A227]">
                David Emuria
              </p>

              <p className="mt-0.5 text-sm font-semibold text-[#222222]">
                Publishing Administration
              </p>
            </div>

            {/* Website */}
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-[#E0E0E0] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#333333] shadow-sm transition hover:border-[#C9A227] hover:text-[#A98216]"
            >
              <span className="hidden sm:inline">
                View Website
              </span>

              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </header>

        {/* Main content */}
        <main className="min-h-[calc(100vh-76px)] bg-white px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}