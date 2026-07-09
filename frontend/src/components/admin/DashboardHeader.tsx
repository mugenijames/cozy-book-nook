import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  isMobile: boolean;
}

export default function DashboardHeader({ sidebarOpen, setSidebarOpen, isMobile }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 md:px-6 py-3">
        <div className="flex items-center gap-3">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <div>
            <h1 className="text-lg md:text-xl font-semibold text-gray-900">Dashboard</h1>
            <p className="text-xs md:text-sm text-gray-500 hidden sm:block">
              Welcome back to your bookstore management
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-green-700">System Active</span>
          </div>
        </div>
      </div>
    </header>
  );
}
