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
import { PROGRAM_ACTIVITIES } from "@/data/programActivities";

const Header = () => {
  return (
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
