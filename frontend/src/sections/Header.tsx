import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ChevronDown,
  Menu,
  X,
  Calendar,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function Header() {
  /* =========================================================
     STATE
  ========================================================= */

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [programsOpen, setProgramsOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  const location = useLocation();

  /* =========================================================
     MOBILE MENU
  ========================================================= */

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setProgramsOpen(false);
  };

  /* =========================================================
     HOMEPAGE SECTION NAVIGATION
  ========================================================= */

  const handleSectionClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string
  ) => {
    e.preventDefault();

    closeMobileMenu();

    /*
     * If already on the homepage,
     * smoothly scroll to the section.
     */
    if (location.pathname === "/") {
      const section = document.getElementById(sectionId);

      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }

      return;
    }

    /*
     * If the visitor is on another page,
     * navigate back to the homepage section.
     */
    window.location.href = `/#${sectionId}`;
  };

  /* =========================================================
     BOOK DAVID
  ========================================================= */

  const openBookingModal = () => {
    closeMobileMenu();
    setBookingOpen(true);
  };

  return (
    <>
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header
        className="
          sticky
          top-0
          z-50
          w-full
          border-b
          border-[#E8DDD4]/70
          bg-white/95
          backdrop-blur-md
          shadow-sm
        "
      >
        <div className="container-custom">
          {/* =================================================
              MAIN HEADER ROW
          ================================================= */}

          <div
            className="
              flex
              min-h-[64px]
              items-center
              justify-between
              gap-3
              sm:min-h-[70px]
            "
          >
            {/* =================================================
                LOGO / BRAND
            ================================================= */}

            <Link
              to="/"
              onClick={closeMobileMenu}
              className="
                group
                flex
                min-w-0
                shrink
                items-center
                gap-2.5
                sm:gap-3
              "
              aria-label="David Emuria - Home"
            >
              {/* Logo */}
              <div
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-full
                  bg-[#4A1F0E]
                  shadow-sm
                  transition-transform
                  duration-300
                  group-hover:scale-105
                  sm:h-11
                  sm:w-11
                "
              >
                <img
                  src="/logo.png"
                  alt="David Emuria logo"
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>

              {/* Brand Text */}
              <div className="min-w-0 leading-tight">
                <p
                  className="
                    truncate
                    font-heading
                    text-sm
                    font-bold
                    text-[#4A1F0E]
                    sm:text-base
                    lg:text-lg
                  "
                >
                  David Emuria
                </p>

                <p
                  className="
                    truncate
                    text-[8px]
                    font-medium
                    uppercase
                    tracking-[0.12em]
                    text-[#C17B4F]
                    sm:text-[10px]
                    sm:tracking-[0.15em]
                  "
                >
                  Author & Speaker
                </p>
              </div>
            </Link>

            {/* =================================================
                DESKTOP NAVIGATION
            ================================================= */}

            <nav
              className="
                hidden
                md:flex
                items-center
                gap-4
                lg:gap-6
                font-medium
                text-[#4A1F0E]
              "
              aria-label="Main navigation"
            >
              {/* About */}

              <a
                href="/#about"
                onClick={(e) => handleSectionClick(e, "about")}
                className="
                  whitespace-nowrap
                  py-2
                  text-sm
                  transition-colors
                  duration-300
                  hover:text-[#C17B4F]
                  lg:text-base
                "
              >
                About
              </a>

              {/* Books */}

              <a
                href="/#books"
                onClick={(e) => handleSectionClick(e, "books")}
                className="
                  whitespace-nowrap
                  py-2
                  text-sm
                  transition-colors
                  duration-300
                  hover:text-[#C17B4F]
                  lg:text-base
                "
              >
                Books
              </a>

              {/* Shop */}

              <Link
                to="/books"
                className="
                  whitespace-nowrap
                  py-2
                  text-sm
                  transition-colors
                  duration-300
                  hover:text-[#C17B4F]
                  lg:text-base
                "
              >
                Shop
              </Link>

              {/* =================================================
                  PROGRAMS DROPDOWN - DESKTOP
              ================================================= */}

              <DropdownMenu>
                <DropdownMenuTrigger
                  className="
                    flex
                    items-center
                    gap-1
                    whitespace-nowrap
                    py-2
                    text-sm
                    outline-none
                    transition-colors
                    duration-300
                    hover:text-[#C17B4F]
                    lg:text-base
                  "
                >
                  Programs

                  <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="center"
                  sideOffset={8}
                  className="
                    min-w-[15rem]
                    overflow-hidden
                    rounded-xl
                    border-[#E8DDD4]
                    bg-white
                    p-1
                    text-[#2E1208]
                    shadow-xl
                  "
                >
                  <DropdownMenuLabel
                    className="
                      px-3
                      py-2
                      text-xs
                      font-normal
                      text-gray-500
                    "
                  >
                    David Emuria's Programs
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>
                    <Link
                      to="/programs/school-ministry"
                      className="
                        cursor-pointer
                        rounded-lg
                        px-3
                        py-2.5
                      "
                    >
                      School Ministry
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link
                      to="/programs/church-outreaches"
                      className="
                        cursor-pointer
                        rounded-lg
                        px-3
                        py-2.5
                      "
                    >
                      Church Outreaches
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link
                      to="/programs/leadership-training"
                      className="
                        cursor-pointer
                        rounded-lg
                        px-3
                        py-2.5
                      "
                    >
                      Leadership Training
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link
                      to="/programs/philanthropy"
                      className="
                        cursor-pointer
                        rounded-lg
                        px-3
                        py-2.5
                      "
                    >
                      Philanthropy
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Testimonials */}

              <a
                href="/#testimonials"
                onClick={(e) =>
                  handleSectionClick(e, "testimonials")
                }
                className="
                  whitespace-nowrap
                  py-2
                  text-sm
                  transition-colors
                  duration-300
                  hover:text-[#C17B4F]
                  lg:text-base
                "
              >
                Testimonials
              </a>
            </nav>

            {/* =================================================
                DESKTOP BOOK DAVID
            ================================================= */}

            <button
              type="button"
              onClick={openBookingModal}
              className="
                hidden
                shrink-0
                items-center
                justify-center
                gap-2
                rounded-full
                bg-[#4A1F0E]
                px-4
                py-2.5
                text-sm
                font-semibold
                text-white
                shadow-md
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:bg-[#C17B4F]
                hover:shadow-lg
                active:scale-95
                md:inline-flex
                lg:px-5
              "
            >
              <Calendar className="h-4 w-4" />
              <span>Book David</span>
            </button>

            {/* =================================================
                MOBILE MENU BUTTON
            ================================================= */}

            <button
              type="button"
              onClick={toggleMobileMenu}
              className="
                flex
                shrink-0
                items-center
                justify-center
                rounded-lg
                p-2
                text-[#4A1F0E]
                transition
                hover:bg-[#F5EFE9]
                hover:text-[#C17B4F]
                md:hidden
              "
              aria-label={
                mobileMenuOpen
                  ? "Close navigation menu"
                  : "Open navigation menu"
              }
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
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
                py-3
                md:hidden
              "
              aria-label="Mobile navigation"
            >
              <div className="flex flex-col gap-0.5 font-medium text-[#4A1F0E]">
                {/* About */}

                <a
                  href="/#about"
                  onClick={(e) =>
                    handleSectionClick(e, "about")
                  }
                  className="
                    rounded-lg
                    px-3
                    py-2.5
                    text-sm
                    transition
                    hover:bg-[#F5EFE9]
                    hover:text-[#C17B4F]
                  "
                >
                  About
                </a>

                {/* Books */}

                <a
                  href="/#books"
                  onClick={(e) =>
                    handleSectionClick(e, "books")
                  }
                  className="
                    rounded-lg
                    px-3
                    py-2.5
                    text-sm
                    transition
                    hover:bg-[#F5EFE9]
                    hover:text-[#C17B4F]
                  "
                >
                  Books
                </a>

                {/* Shop */}

                <Link
                  to="/books"
                  onClick={closeMobileMenu}
                  className="
                    rounded-lg
                    px-3
                    py-2.5
                    text-sm
                    transition
                    hover:bg-[#F5EFE9]
                    hover:text-[#C17B4F]
                  "
                >
                  Shop
                </Link>

                {/* =================================================
                    MOBILE PROGRAMS
                ================================================= */}

                <div className="rounded-lg">
                  <button
                    type="button"
                    onClick={() =>
                      setProgramsOpen((prev) => !prev)
                    }
                    className="
                      flex
                      w-full
                      items-center
                      justify-between
                      rounded-lg
                      px-3
                      py-2.5
                      text-left
                      text-sm
                      transition-all
                      duration-300
                      hover:bg-[#F5EFE9]
                      hover:text-[#C17B4F]
                    "
                    aria-expanded={programsOpen}
                  >
                    <span>Programs</span>

                    <ChevronDown
                      className={`
                        h-4
                        w-4
                        transition-transform
                        duration-300
                        ${
                          programsOpen
                            ? "rotate-180 text-[#C17B4F]"
                            : ""
                        }
                      `}
                    />
                  </button>

                  {/* Submenu */}

                  <div
                    className={`
                      overflow-hidden
                      transition-all
                      duration-300
                      ease-in-out
                      ${
                        programsOpen
                          ? "max-h-96 opacity-100"
                          : "max-h-0 opacity-0"
                      }
                    `}
                  >
                    <div
                      className="
                        ml-3
                        mt-1
                        space-y-0.5
                        border-l-2
                        border-[#D4A017]/40
                        pl-3
                      "
                    >
                      <Link
                        to="/programs/school-ministry"
                        onClick={closeMobileMenu}
                        className="
                          block
                          rounded-lg
                          px-3
                          py-2.5
                          text-sm
                          text-[#5C4436]
                          transition
                          hover:bg-[#F5EFE9]
                          hover:text-[#C17B4F]
                        "
                      >
                        School Ministry
                      </Link>

                      <Link
                        to="/programs/church-outreaches"
                        onClick={closeMobileMenu}
                        className="
                          block
                          rounded-lg
                          px-3
                          py-2.5
                          text-sm
                          text-[#5C4436]
                          transition
                          hover:bg-[#F5EFE9]
                          hover:text-[#C17B4F]
                        "
                      >
                        Church Outreaches
                      </Link>

                      <Link
                        to="/programs/leadership-training"
                        onClick={closeMobileMenu}
                        className="
                          block
                          rounded-lg
                          px-3
                          py-2.5
                          text-sm
                          text-[#5C4436]
                          transition
                          hover:bg-[#F5EFE9]
                          hover:text-[#C17B4F]
                        "
                      >
                        Leadership Training
                      </Link>

                      <Link
                        to="/programs/philanthropy"
                        onClick={closeMobileMenu}
                        className="
                          block
                          rounded-lg
                          px-3
                          py-2.5
                          text-sm
                          text-[#5C4436]
                          transition
                          hover:bg-[#F5EFE9]
                          hover:text-[#C17B4F]
                        "
                      >
                        Philanthropy
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Testimonials */}

                <a
                  href="/#testimonials"
                  onClick={(e) =>
                    handleSectionClick(e, "testimonials")
                  }
                  className="
                    rounded-lg
                    px-3
                    py-2.5
                    text-sm
                    transition
                    hover:bg-[#F5EFE9]
                    hover:text-[#C17B4F]
                  "
                >
                  Testimonials
                </a>

                {/* =================================================
                    MOBILE BOOK DAVID
                ================================================= */}

                <button
                  type="button"
                  onClick={openBookingModal}
                  className="
                    mt-2
                    flex
                    w-full
                    items-center
                    justify-center
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
                    hover:bg-[#C17B4F]
                    active:scale-[0.98]
                  "
                >
                  <Calendar className="h-4 w-4" />
                  Book David
                </button>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* =========================================================
          BOOK DAVID MODAL
      ========================================================= */}

      <Dialog
        open={bookingOpen}
        onOpenChange={setBookingOpen}
      >
        <DialogContent
          className="
            w-[calc(100%-2rem)]
            max-w-lg
            overflow-hidden
            rounded-2xl
            border-[#E8DDD4]
            bg-white
            p-0
          "
        >
          {/* Modal Header */}

          <div className="bg-[#4A1F0E] px-6 py-6 text-white sm:px-8">
            <DialogHeader>
              <DialogTitle
                className="
                  font-heading
                  text-2xl
                  font-bold
                  sm:text-3xl
                "
              >
                Book David Emuria
              </DialogTitle>

              <DialogDescription
                className="
                  mt-2
                  text-sm
                  leading-6
                  text-white/80
                "
              >
                Invite David to speak, teach, train, or
                participate in your next event or program.
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Modal Content */}

          <div className="space-y-5 px-6 py-6 sm:px-8">
            <div>
              <h3 className="font-semibold text-[#4A1F0E]">
                Speaking & Engagements
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                David is available for conferences, church
                programs, leadership trainings, school
                engagements, community events, and other
                transformative gatherings.
              </p>
            </div>

            {/* Engagement Types */}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                "Speaking Engagement",
                "Leadership Training",
                "School / Youth Program",
                "Church Outreach",
              ].map((item) => (
                <div
                  key={item}
                  className="
                    rounded-xl
                    border
                    border-[#E8DDD4]
                    bg-[#FAF7F3]
                    px-4
                    py-3
                    text-sm
                    font-medium
                    text-[#4A1F0E]
                  "
                >
                  {item}
                </div>
              ))}
            </div>

            {/* Booking CTA */}

            <a
              href="mailto:info@emuriadavid.com?subject=Booking%20David%20Emuria"
              className="
                flex
                w-full
                items-center
                justify-center
                rounded-full
                bg-[#D4A017]
                px-6
                py-3.5
                text-sm
                font-bold
                text-[#2E1208]
                shadow-md
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:bg-[#B58900]
                hover:shadow-lg
              "
            >
              Send Booking Inquiry
            </a>

            <p className="text-center text-xs leading-5 text-gray-500">
              Please include your event date, location,
              type of engagement, and any other relevant
              details.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}