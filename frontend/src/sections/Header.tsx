import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#F9F6EF] border-b border-[#E8DDD4] shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section - Clickable to Home */}
          <Link to="/" className="flex items-center gap-3 group">
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

          {/* Navigation */}
          <nav className="flex flex-wrap items-center justify-end gap-x-6 gap-y-2 font-medium text-[#4A1F0E] md:gap-8">
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
        </div>
      </div>
    </header>
  );
}