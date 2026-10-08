import {
  LayoutDashboard,
  BookOpen,
  FileText,
  ShoppingCart,
  CreditCard,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import type { ElementType } from "react";

type DashboardSidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
};

type SidebarItem = {
  label: string;
  href: string;
  icon: ElementType;
};

const workspaceItems: SidebarItem[] = [
  {
    label: "Overview",
    href: "/admin",
    icon: LayoutDashboard,
  },
];

const contentItems: SidebarItem[] = [
  {
    label: "Books",
    href: "/admin/books",
    icon: BookOpen,
  },
  {
    label: "Blog",
    href: "/admin/blog",
    icon: FileText,
  },
];

const commerceItems: SidebarItem[] = [
  {
    label: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    label: "Payments",
    href: "/admin/payments",
    icon: CreditCard,
  },
];

export default function DashboardSidebar({
  collapsed,
  onToggle,
  mobileOpen = false,
  onMobileClose,
}: DashboardSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const storedUser =
    localStorage.getItem("admin_user") ||
    localStorage.getItem("user");

  let user: {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
  } | null = null;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch {
    user = null;
  }

  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  const administrationItems: SidebarItem[] = isSuperAdmin
    ? [
        {
          label: "Administrators",
          href: "/admin/users",
          icon: Users,
        },
      ]
    : [];

  const handleNavigation = (href: string) => {
    navigate(href);
    onMobileClose?.();
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    localStorage.removeItem("token");
    localStorage.removeItem("auth_token");

    onMobileClose?.();
    navigate("/admin/login");
  };

  const isActive = (href: string) => {
    if (href === "/admin") {
      return location.pathname === "/admin";
    }

    return (
      location.pathname === href ||
      location.pathname.startsWith(`${href}/`)
    );
  };

  const renderSection = (
    title: string,
    items: SidebarItem[]
  ) => {
    if (!items.length) return null;

    return (
      <div className="mb-7">
        {!collapsed && (
          <div className="mb-3 px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#C9A227]">
            {title}
          </div>
        )}

        <div className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <button
                key={item.href}
                type="button"
                onClick={() => handleNavigation(item.href)}
                title={collapsed ? item.label : undefined}
                className={[
                  "group relative flex w-full items-center rounded-lg px-4 py-3 text-left transition-all duration-200",
                  collapsed
                    ? "justify-center px-3"
                    : "gap-3",
                  active
                    ? "bg-[#B88A2A] text-white shadow-sm"
                    : "text-[#D2C5BD] hover:bg-[#3A2419] hover:text-white",
                ].join(" ")}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-[#F2D27A]" />
                )}

                <Icon
                  size={19}
                  strokeWidth={active ? 2.4 : 2}
                  className={[
                    "shrink-0 transition-colors",
                    active
                      ? "text-white"
                      : "text-[#B69D8C] group-hover:text-[#D5B45C]",
                  ].join(" ")}
                />

                {!collapsed && (
                  <span className="truncate text-sm font-medium">
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onMobileClose}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-[#4A3326] bg-[#2B1A12] transition-all duration-300",
          collapsed ? "w-[76px]" : "w-[260px]",
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        {/* Brand */}
        <div
          className={[
            "flex h-[76px] shrink-0 items-center border-b border-[#4A3326]",
            collapsed
              ? "justify-center px-3"
              : "justify-between px-5",
          ].join(" ")}
        >
          {!collapsed ? (
            <button
              type="button"
              onClick={() => handleNavigation("/admin")}
              className="flex items-center gap-3"
            >
              {/* Temporary logo */}
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#C9A227] shadow-sm">
                <BookOpen
                  size={21}
                  strokeWidth={2}
                  className="text-white"
                />
              </div>

              <div className="text-left">
                <div className="text-sm font-bold tracking-[0.08em] text-white">
                  DAVID EMURIA
                </div>

                <div className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#D5B45C]">
                  Admin Portal
                </div>
              </div>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleNavigation("/admin")}
              title="David Emuria Admin"
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#C9A227]"
            >
              <BookOpen
                size={21}
                strokeWidth={2}
                className="text-white"
              />
            </button>
          )}

          <button
            type="button"
            onClick={onMobileClose}
            className="rounded-lg p-2 text-[#B69D8C] hover:bg-[#3A2419] hover:text-white lg:hidden"
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-6">
          {renderSection("Workspace", workspaceItems)}
          {renderSection("Content", contentItems)}
          {renderSection("Commerce", commerceItems)}
          {renderSection(
            "Administration",
            administrationItems
          )}
        </div>

        {/* Bottom */}
        <div className="border-t border-[#4A3326] p-3">
          {!collapsed && user && (
            <div className="mb-3 rounded-lg border border-[#4A3326] bg-[#351F15] px-3 py-3">
              <div className="truncate text-sm font-semibold text-white">
                {user.name || "Administrator"}
              </div>

              <div className="mt-0.5 truncate text-xs text-[#BBA99F]">
                {user.email || ""}
              </div>

              <div className="mt-2 inline-flex rounded-full bg-[#4A351A] px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-[#D5B45C]">
                {user.role === "SUPER_ADMIN"
                  ? "Super Admin"
                  : "Admin"}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleLogout}
            title={collapsed ? "Logout" : undefined}
            className={[
              "flex w-full items-center rounded-lg px-4 py-3 text-sm font-medium text-[#C8B8AE] transition-colors hover:bg-[#3A2419] hover:text-white",
              collapsed
                ? "justify-center px-3"
                : "gap-3",
            ].join(" ")}
          >
            <LogOut size={19} />
            {!collapsed && <span>Logout</span>}
          </button>

          <button
            type="button"
            onClick={onToggle}
            title={
              collapsed
                ? "Expand sidebar"
                : "Collapse sidebar"
            }
            className="mt-2 hidden w-full items-center justify-center rounded-lg border border-[#4A3326] py-2.5 text-[#B69D8C] transition-colors hover:bg-[#3A2419] hover:text-white lg:flex"
          >
            {collapsed ? (
              <ChevronRight size={18} />
            ) : (
              <ChevronLeft size={18} />
            )}
          </button>
        </div>
      </aside>
    </>
  );
}