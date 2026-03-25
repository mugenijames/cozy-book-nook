import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  const navLinks = [
    { name: "About", href: "/#about" },
    { name: "Books", href: "/#books" },
    { name: "Shop", href: "/books" },
    { name: "Speaking", href: "/#speaking" },
  ];

  const programLinks = [
    { name: "School Ministry", href: "/programs/school-ministry" },
    { name: "Church Outreaches", href: "/programs/church-outreaches" },
    { name: "Leadership Training", href: "/programs/leadership-training" },
    { name: "Philanthropy", href: "/programs/philanthropy" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#F9F6EF] border-b border-[#E8DDD4] shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group flex-shrink-0">
            <img 
              src="/logo.png" 
              alt="David Emuria" 
              className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover border-2 border-[#C17B4F] shadow-md group-hover:shadow-lg transition-all"
            />
            <div className="hidden sm:block">
              <span className="font-heading text-lg sm:text-xl font-bold text-[#2E1208] group-hover:text-[#C17B4F] transition-colors">
                David Emuria
              </span>
              <p className="text-xs text-[#8B4513]">Author & Speaker</p>
            </div>
          </Link>

          {/* Desktop Navigation - Hidden on mobile */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 font-medium text-[#4A1F0E]">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="hover:text-[#C17B4F] transition"
              >
                {link.name}
              </a>
            ))}
            
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
                {programLinks.map((program) => (
                  <DropdownMenuItem key={program.name} asChild>
                    <Link to={program.href} className="cursor-pointer">
                      {program.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Mobile Menu Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-[#4A1F0E] hover:text-[#C17B4F]"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px] bg-[#F9F6EF] border-l border-[#E8DDD4] p-0">
              <div className="flex flex-col h-full">
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between p-4 border-b border-[#E8DDD4]">
                  <div className="flex items-center gap-2">
                    <img 
                      src="/logo.png" 
                      alt="David Emuria" 
                      className="h-10 w-10 rounded-full border-2 border-[#C17B4F]"
                    />
                    <div>
                      <span className="font-heading font-bold text-[#2E1208]">
                        David Emuria
                      </span>
                      <p className="text-xs text-[#8B4513]">Author & Speaker</p>
                    </div>
                  </div>
                  <SheetClose asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-[#4A1F0E] hover:text-[#C17B4F]"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </SheetClose>
                </div>

                {/* Mobile Menu Links */}
                <div className="flex-1 overflow-y-auto py-4">
                  <div className="space-y-1 px-4">
                    {navLinks.map((link) => (
                      <SheetClose asChild key={link.name}>
                        <a
                          href={link.href}
                          className="block py-3 text-[#4A1F0E] hover:text-[#C17B4F] hover:bg-[#F5EDE3] rounded-lg transition-colors px-3"
                          onClick={closeMenu}
                        >
                          {link.name}
                        </a>
                      </SheetClose>
                    ))}
                  </div>

                  {/* Programs Section in Mobile Menu */}
                  <div className="mt-4">
                    <h3 className="px-7 py-2 text-sm font-semibold text-[#C17B4F] uppercase tracking-wider">
                      Programs
                    </h3>
                    <div className="space-y-1 px-4">
                      {programLinks.map((program) => (
                        <SheetClose asChild key={program.name}>
                          <Link
                            to={program.href}
                            className="block py-3 text-[#4A1F0E] hover:text-[#C17B4F] hover:bg-[#F5EDE3] rounded-lg transition-colors px-3"
                            onClick={closeMenu}
                          >
                            {program.name}
                          </Link>
                        </SheetClose>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Mobile Menu Footer */}
                <div className="border-t border-[#E8DDD4] p-4 space-y-3">
                  <Button
                    asChild
                    className="w-full bg-[#C17B4F] hover:bg-[#A55E36] text-white"
                  >
                    <a href="#speaking" onClick={closeMenu}>
                      Invite to Speak
                    </a>
                  </Button>
                  <div className="flex justify-center gap-4 pt-2">
                    <a
                      href="https://facebook.com/davidemuria"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#4A1F0E] hover:text-[#C17B4F] transition"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                      </svg>
                    </a>
                    <a
                      href="https://twitter.com/davidemuria"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#4A1F0E] hover:text-[#C17B4F] transition"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
                      </svg>
                    </a>
                    <a
                      href="https://instagram.com/davidemuria"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#4A1F0E] hover:text-[#C17B4F] transition"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}