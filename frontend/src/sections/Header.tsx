// frontend/src/sections/Header.tsx
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
<<<<<<< HEAD
=======
import { PROGRAM_ACTIVITIES } from "@/data/programActivities";
>>>>>>> a83ff207309767fe69172197d4e44479557e8f0c

export default function Header() {
  return (
<<<<<<< HEAD
    <header className="sticky top-0 z-50 w-full bg-[#FDF8F3] border-b border-[#E8DDD4] shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section - Clickable to Home */}
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src="/logo.png" 
              alt="David Emuria" 
              className="h-12 w-12 rounded-full object-cover border-2 border-[#D4A017] shadow-md group-hover:shadow-lg transition-all"
            />
            <div>
              <span className="font-heading text-xl font-bold text-[#2E1208] group-hover:text-[#D4A017] transition-colors">
                David Emuria
              </span>
              <p className="text-xs text-[#8B4513] hidden sm:block">Author & Speaker</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex flex-wrap items-center justify-end gap-x-6 gap-y-2 font-medium text-[#4A1F0E] md:gap-8">
            <a href="/#about" className="hover:text-[#D4A017] transition">
              About
            </a>
            <a href="/#books" className="hover:text-[#D4A017] transition">
              Books
            </a>
            <Link to="/books" className="hover:text-[#D4A017] transition">
              Shop
            </Link>
            
            {/* Programs Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 hover:text-[#D4A017] transition">
                Programs
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="min-w-[14rem] border-[#E8DDD4] bg-[#FDF8F3] text-[#2E1208]"
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

            <a href="/#speaking" className="hover:text-[#D4A017] transition">
              Speaking
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
=======
    <header className="fixed w-full bg-white shadow-sm z-50">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <Link to="/" className="text-xl font-bold text-[#4A1F0E]">
          David Emuria
        </Link>

        <nav className="flex flex-wrap items-center justify-end gap-x-6 gap-y-2 font-medium text-[#4A1F0E] md:gap-8">
          <a href="/#about" className="hover:text-[#8B4513] transition">
            About
          </a>
          <a href="/#books" className="hover:text-[#8B4513] transition">
            Books
          </a>
          <Link to="/books" className="hover:text-[#8B4513] transition">
            Shop
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-1 outline-none hover:text-[#8B4513] transition data-[state=open]:text-[#8B4513]">
              Programs
              <ChevronDown className="h-4 w-4 opacity-80" aria-hidden />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="min-w-[14rem] border-[#E8DDD4] bg-[#FDF8F3] text-[#2E1208]"
            >
              <DropdownMenuLabel className="font-normal text-xs text-muted-foreground">
                Choose a program
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a href="/#program">Programs overview</a>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {PROGRAM_ACTIVITIES.map((p) => (
                <DropdownMenuItem key={p.slug} asChild>
                  <Link to={`/programs/${p.slug}`}>{p.title}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <a href="/#speaking" className="hover:text-[#8B4513] transition">
            Speaking
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
>>>>>>> a83ff207309767fe69172197d4e44479557e8f0c
