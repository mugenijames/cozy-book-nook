import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#F9F6EF] border-b border-[#E8DDD4] shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section - Clickable to Home */}
          <Link to="/" className="flex items-center gap-3 group" onClick={closeMobileMenu}>
            <img 
              src="/logo.png" 
              alt="David Emuria" 
              className="h-12 w-12 rounded-full object-cover border-2 border-[#C17B4F] shadow-md group-hover:shadow-lg transition-all"
            />
            <div>
              <span className="font-heading text-xl font-bold text-[#2E1208] group-hover:text-[#C17B4F] transition-colors">
                David Emuria
              </span>
              <p className="text-xs text-[#8B4513] hidden sm:block">Author & Speaker</p>
            </div>
          </Link>

          {/* Desktop Navigation - Hidden on mobile */}
          <nav className="hidden md:flex items-center justify-end gap-6 lg:gap-8 font-medium text-[#4A1F0E]">
            <a href="/#about" className="hover:text-[#C17B4F] transition">
              About
            </a>
            <a href="/#books" className="hover:text-[#C17B4F] transition">
              Books
            </a>
            <Link to="/books" className="hover:text-[#C17B4F] transition">
              Shop
            </Link>
            
            {/* Programs Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 hover:text-[#C17B4F] transition">
                Programs
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="min-w-[14rem] border-[#E8DDD4] bg-[#F9F6EF] text-[#2E1208]"
              >
                <DropdownMenuLabel className="font-normal text-xs text-muted-foreground">
                  David Emuria's Programs
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/programs/school-ministry" className="cursor-pointer">
                    School Ministry
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/programs/church-outreaches" className="cursor-pointer">
                    Church Outreaches
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/programs/leadership-training" className="cursor-pointer">
                    Leadership Training
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/programs/philanthropy" className="cursor-pointer">
                    Philanthropy
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <a href="/#speaking" className="hover:text-[#C17B4F] transition">
              Speaking
            </a>
          </nav>

          {/* Mobile Menu Toggle - Visible only on mobile */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 text-[#4A1F0E] hover:text-[#C17B4F] transition"
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu - Visible when toggled */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 border-t border-[#E8DDD4] pt-4 space-y-3 font-medium text-[#4A1F0E]">
            <a 
              href="/#about" 
              onClick={closeMobileMenu}
              className="block px-2 py-2 hover:text-[#C17B4F] hover:bg-[#F0EAE0] rounded transition"
            >
              About
            </a>
            <a 
              href="/#books"
              onClick={closeMobileMenu}
              className="block px-2 py-2 hover:text-[#C17B4F] hover:bg-[#F0EAE0] rounded transition"
            >
              Books
            </a>
            <Link 
              to="/books"
              onClick={closeMobileMenu}
              className="block px-2 py-2 hover:text-[#C17B4F] hover:bg-[#F0EAE0] rounded transition"
            >
              Shop
            </Link>

            {/* Mobile Programs Submenu */}
            <details className="px-2">
              <summary className="py-2 cursor-pointer hover:text-[#C17B4F] hover:bg-[#F0EAE0] rounded transition flex items-center gap-1">
                Programs
                <ChevronDown className="h-4 w-4" />
              </summary>
              <div className="mt-2 ml-4 space-y-2 border-l-2 border-[#E8DDD4] pl-4">
                <Link 
                  to="/programs/school-ministry"
                  onClick={closeMobileMenu}
                  className="block py-2 hover:text-[#C17B4F] transition"
                >
                  School Ministry
                </Link>
                <Link 
                  to="/programs/church-outreaches"
                  onClick={closeMobileMenu}
                  className="block py-2 hover:text-[#C17B4F] transition"
                >
                  Church Outreaches
                </Link>
                <Link 
                  to="/programs/leadership-training"
                  onClick={closeMobileMenu}
                  className="block py-2 hover:text-[#C17B4F] transition"
                >
                  Leadership Training
                </Link>
                <Link 
                  to="/programs/philanthropy"
                  onClick={closeMobileMenu}
                  className="block py-2 hover:text-[#C17B4F] transition"
                >
                  Philanthropy
                </Link>
              </div>
            </details>

            <a 
              href="/#speaking"
              onClick={closeMobileMenu}
              className="block px-2 py-2 hover:text-[#C17B4F] hover:bg-[#F0EAE0] rounded transition"
            >
              Speaking
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}