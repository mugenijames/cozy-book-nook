import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Menu, X, CalendarDays } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import BookingModal from "@/components/BookingModal";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const openBookingModal = () => {
    closeMobileMenu();
    setBookingOpen(true);
  };

  return (
    <>
      <header className="relative z-50 border-b border-[#E8DDD4] bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex min-h-[76px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* =====================================================
              LOGO
          ===================================================== */}

          <Link
            to="/"
            onClick={closeMobileMenu}
            className="group flex items-center gap-3"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#E8DDD4] bg-[#F9F6EF]">
              <img
                src="/logo.png"
                alt="David Emuria"
                className="h-full w-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>

            <div className="leading-tight">
              <p className="font-heading text-base font-bold text-[#2E1208] transition group-hover:text-[#C17B4F]">
                David Emuria
              </p>

              <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#C17B4F]">
                Author & Speaker
              </p>
            </div>
          </Link>

          {/* =====================================================
              DESKTOP NAVIGATION
          ===================================================== */}

          <nav className="hidden items-center gap-5 font-medium text-[#4A1F0E] md:flex lg:gap-7">

            <a
              href="/#about"
              className="transition hover:text-[#C17B4F]"
            >
              About
            </a>

            {/* Books now clickable */}
            <Link
              to="/books"
              className="transition hover:text-[#C17B4F]"
            >
              Books
            </Link>

            <Link
              to="/books"
              className="transition hover:text-[#C17B4F]"
            >
              Shop
            </Link>

            {/* =================================================
                PROGRAMS
            ================================================= */}

            <DropdownMenu>
              <DropdownMenuTrigger
                className="
                  flex
                  items-center
                  gap-1
                  outline-none
                  transition
                  hover:text-[#C17B4F]
                "
              >
                Programs

                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                sideOffset={8}
                className="
                  z-[80]
                  min-w-[14rem]
                  rounded-xl
                  border
                  border-[#E8DDD4]
                  bg-white
                  p-2
                  text-[#2E1208]
                  shadow-xl
                "
              >
                <DropdownMenuLabel className="px-3 py-2 text-xs font-normal text-gray-500">
                  David Emuria's Programs
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="bg-[#E8DDD4]" />

                <DropdownMenuItem asChild>
                  <Link
                    to="/programs/school-ministry"
                    className="cursor-pointer rounded-lg px-3 py-2.5 focus:bg-[#F9F6EF]"
                  >
                    School Ministry
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link
                    to="/programs/church-outreaches"
                    className="cursor-pointer rounded-lg px-3 py-2.5 focus:bg-[#F9F6EF]"
                  >
                    Church Outreaches
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link
                    to="/programs/leadership-training"
                    className="cursor-pointer rounded-lg px-3 py-2.5 focus:bg-[#F9F6EF]"
                  >
                    Leadership Training
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link
                    to="/programs/philanthropy"
                    className="cursor-pointer rounded-lg px-3 py-2.5 focus:bg-[#F9F6EF]"
                  >
                    Philanthropy
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Testimonials */}
            <a
              href="/#testimonials"
              className="transition hover:text-[#C17B4F]"
            >
              Testimonials
            </a>

            {/* =================================================
                BOOK DAVID
            ================================================= */}

            <button
              type="button"
              onClick={() => setBookingOpen(true)}
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-[#4A1F0E]
                px-5
                py-2.5
                text-sm
                font-semibold
                text-white
                shadow-md
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:bg-[#2E1208]
                hover:shadow-lg
                active:scale-95
              "
            >
              <CalendarDays className="h-4 w-4" />
              Book David
            </button>
          </nav>

          {/* =====================================================
              MOBILE MENU BUTTON
          ===================================================== */}

          <button
            type="button"
            onClick={toggleMobileMenu}
            className="
              rounded-lg
              p-2
              text-[#4A1F0E]
              transition
              hover:bg-[#F9F6EF]
              hover:text-[#C17B4F]
              md:hidden
            "
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

        {/* =====================================================
            MOBILE NAVIGATION
        ===================================================== */}

        {mobileMenuOpen && (
          <nav
            className="
              border-t
              border-[#E8DDD4]
              bg-white
              px-4
              pb-5
              pt-4
              shadow-lg
              md:hidden
            "
          >
            <div className="space-y-1 font-medium text-[#4A1F0E]">

              <a
                href="/#about"
                onClick={closeMobileMenu}
                className="block rounded-xl px-3 py-3 transition hover:bg-[#F9F6EF] hover:text-[#C17B4F]"
              >
                About
              </a>

              {/* Books fixed */}
              <Link
                to="/books"
                onClick={closeMobileMenu}
                className="block rounded-xl px-3 py-3 transition hover:bg-[#F9F6EF] hover:text-[#C17B4F]"
              >
                Books
              </Link>

              <Link
                to="/books"
                onClick={closeMobileMenu}
                className="block rounded-xl px-3 py-3 transition hover:bg-[#F9F6EF] hover:text-[#C17B4F]"
              >
                Shop
              </Link>

              {/* Mobile Programs */}
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between rounded-xl px-3 py-3 transition hover:bg-[#F9F6EF] hover:text-[#C17B4F]">
                  <span>Programs</span>

                  <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                </summary>

                <div className="ml-3 mt-1 space-y-1 border-l-2 border-[#E8DDD4] pl-3">

                  <Link
                    to="/programs/school-ministry"
                    onClick={closeMobileMenu}
                    className="block rounded-lg px-3 py-2.5 text-sm transition hover:bg-[#F9F6EF] hover:text-[#C17B4F]"
                  >
                    School Ministry
                  </Link>

                  <Link
                    to="/programs/church-outreaches"
                    onClick={closeMobileMenu}
                    className="block rounded-lg px-3 py-2.5 text-sm transition hover:bg-[#F9F6EF] hover:text-[#C17B4F]"
                  >
                    Church Outreaches
                  </Link>

                  <Link
                    to="/programs/leadership-training"
                    onClick={closeMobileMenu}
                    className="block rounded-lg px-3 py-2.5 text-sm transition hover:bg-[#F9F6EF] hover:text-[#C17B4F]"
                  >
                    Leadership Training
                  </Link>

                  <Link
                    to="/programs/philanthropy"
                    onClick={closeMobileMenu}
                    className="block rounded-lg px-3 py-2.5 text-sm transition hover:bg-[#F9F6EF] hover:text-[#C17B4F]"
                  >
                    Philanthropy
                  </Link>
                </div>
              </details>

              {/* Testimonials */}
              <a
                href="/#testimonials"
                onClick={closeMobileMenu}
                className="block rounded-xl px-3 py-3 transition hover:bg-[#F9F6EF] hover:text-[#C17B4F]"
              >
                Testimonials
              </a>

              {/* Book David */}
              <button
                type="button"
                onClick={openBookingModal}
                className="
                  mt-3
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  bg-[#4A1F0E]
                  px-5
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  shadow-md
                  transition-all
                  hover:bg-[#2E1208]
                  active:scale-[0.98]
                "
              >
                <CalendarDays className="h-4 w-4" />
                Book David
              </button>
            </div>
          </nav>
        )}
      </header>

      {/* =========================================================
          REUSABLE BOOKING MODAL
      ========================================================= */}

      <BookingModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
      />
    </>
  );
}