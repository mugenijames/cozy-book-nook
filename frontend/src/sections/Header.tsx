// frontend/src/sections/Header.tsx

import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  CalendarCheck2,
  ChevronDown,
  Menu,
  X,
  BookOpen,
  UserRound,
  Quote,
  Mic2,
  GraduationCap,
  HeartHandshake,
} from "lucide-react";

import BookingModal from "@/components/BookingModal";
import { PROGRAM_ACTIVITIES } from "@/data/programActivities";

const SECTION_IDS = [
  "about",
  "program",
  "testimonials",
  "speaking",
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [programsOpen, setProgramsOpen] = useState(false);

  // Controls whether the header has reached the sticky state
  const [isSticky, setIsSticky] = useState(false);

  // Controls which homepage section is currently visible
  const [activeSection, setActiveSection] = useState("");

  const location = useLocation();

  const isHomePage = location.pathname === "/";

  /*
  |--------------------------------------------------------------------------
  | CLOSE MENUS
  |--------------------------------------------------------------------------
  */

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setProgramsOpen(false);
  };

  /*
  |--------------------------------------------------------------------------
  | BOOKING MODAL
  |--------------------------------------------------------------------------
  */

  const openBookingModal = () => {
    closeMobileMenu();
    setBookingOpen(true);
  };

  /*
  |--------------------------------------------------------------------------
  | STICKY HEADER
  |--------------------------------------------------------------------------
  |
  | The header becomes sticky after the user scrolls approximately 80px.
  |
  */

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 80);
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | ACTIVE SECTION DETECTION
  |--------------------------------------------------------------------------
  |
  | Watches the homepage sections and determines which section is currently
  | visible on the screen.
  |
  */

  useEffect(() => {
    if (!isHomePage) {
      setActiveSection("");
      return;
    }

    const sections = SECTION_IDS
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              b.intersectionRatio - a.intersectionRatio
          );

        if (visibleSections.length > 0) {
          setActiveSection(
            visibleSections[0].target.id
          );
        }
      },
      {
        root: null,
        rootMargin: "-110px 0px -45% 0px",
        threshold: [0.1, 0.25, 0.5, 0.75],
      }
    );

    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      observer.disconnect();
    };
  }, [isHomePage, location.pathname]);

  /*
  |--------------------------------------------------------------------------
  | SECTION CLICK
  |--------------------------------------------------------------------------
  */

  const handleSectionClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string
  ) => {
    closeMobileMenu();

    /*
     * If we're already on the homepage, prevent the browser from jumping
     * directly to the hash and instead perform a smooth scroll.
     */
    if (isHomePage) {
      event.preventDefault();

      const element =
        document.getElementById(sectionId);

      if (element) {
        const headerOffset = 95;

        const elementPosition =
          element.getBoundingClientRect().top +
          window.scrollY;

        const offsetPosition =
          elementPosition - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });

        /*
         * Update the URL without forcing a page reload.
         */
        window.history.replaceState(
          null,
          "",
          `#${sectionId}`
        );

        setActiveSection(sectionId);
      }
    }
  };

  /*
  |--------------------------------------------------------------------------
  | ACTIVE ROUTE
  |--------------------------------------------------------------------------
  */

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  /*
  |--------------------------------------------------------------------------
  | ACTIVE HOMEPAGE SECTION
  |--------------------------------------------------------------------------
  */

  const isSectionActive = (sectionId: string) => {
    return (
      isHomePage &&
      activeSection === sectionId
    );
  };

  /*
  |--------------------------------------------------------------------------
  | ACTIVE DEAR DAD ROUTE
  |--------------------------------------------------------------------------
  */

  const isDearDadRoute =
    location.pathname.startsWith("/dear-dad");

  /*
  |--------------------------------------------------------------------------
  | NAVIGATION LINK STYLES
  |--------------------------------------------------------------------------
  */

  const desktopLinkBase =
    "relative flex items-center gap-1.5 py-2 text-sm font-medium transition-all duration-300";

  return (
    <>
      {/* =========================================================
          HEADER
      ========================================================= */}

      <header
        className={`
          z-[100]
          w-full
          transition-all
          duration-300
          ${
            isSticky
              ? `
                fixed
                left-0
                top-0
                border-b
                border-[#E8DDD4]/80
                bg-white/95
                shadow-lg
                backdrop-blur-xl
              `
              : `
                relative
                bg-white
              `
          }
        `}
      >
        <div
          className={`
            mx-auto
            flex
            max-w-7xl
            items-center
            justify-between
            px-4
            sm:px-6
            lg:px-8
            transition-all
            duration-300
            ${
              isSticky
                ? "min-h-[68px]"
                : "min-h-[76px]"
            }
          `}
        >
          {/* =====================================================
              LOGO / BRAND
          ===================================================== */}

          <Link
            to="/"
            onClick={closeMobileMenu}
            className="group flex items-center gap-3"
            aria-label="David Emuria - Home"
          >
            {/* Logo */}

            <div
              className={`
                flex
                shrink-0
                items-center
                justify-center
                overflow-hidden
                rounded-full
                border
                bg-[#F8F6F2]
                shadow-sm
                transition-all
                duration-300
                ${
                  isSticky
                    ? "h-10 w-10"
                    : "h-11 w-11"
                }
                border-[#E8DDD4]
                group-hover:border-[#C17B4F]/60
                group-hover:shadow-md
              `}
            >
              <img
                src="/logo.png"
                alt="David Emuria logo"
                className="h-full w-full object-contain"
                onError={(event) => {
                  event.currentTarget.style.display =
                    "none";
                }}
              />
            </div>

            {/* Brand text */}

            <div className="leading-tight">
              <p
                className="
                  font-heading
                  text-base
                  font-bold
                  tracking-tight
                  text-[#2E1208]
                  transition-colors
                  duration-300
                  group-hover:text-[#C17B4F]
                  sm:text-lg
                "
              >
                David Emuria
              </p>

              <p
                className="
                  mt-0.5
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.18em]
                  text-[#C17B4F]
                  sm:text-[10px]
                "
              >
                Author & Speaker
              </p>
            </div>
          </Link>

          {/* =====================================================
              DESKTOP NAVIGATION
          ===================================================== */}

          <nav
            className="
              hidden
              items-center
              gap-5
              font-medium
              text-[#4A1F0E]
              md:flex
              lg:gap-7
            "
            aria-label="Main navigation"
          >
            {/* =================================================
                ABOUT
            ================================================= */}

            <a
              href="/#about"
              onClick={(event) =>
                handleSectionClick(event, "about")
              }
              className={`
                ${desktopLinkBase}
                hover:text-[#C17B4F]
                ${
                  isSectionActive("about")
                    ? "font-semibold text-[#C17B4F]"
                    : ""
                }
              `}
            >
              <UserRound className="h-4 w-4" />

              About

              {isSectionActive("about") && (
                <span
                  className="
                    absolute
                    bottom-0
                    left-0
                    right-0
                    h-0.5
                    rounded-full
                    bg-[#C17B4F]
                  "
                />
              )}
            </a>

            {/* =================================================
                BOOKS
            ================================================= */}

            <Link
              to="/books"
              onClick={closeMobileMenu}
              className={`
                ${desktopLinkBase}
                hover:text-[#C17B4F]
                ${
                  isActiveRoute("/books")
                    ? "font-semibold text-[#C17B4F]"
                    : ""
                }
              `}
            >
              <BookOpen className="h-4 w-4" />

              Books

              {isActiveRoute("/books") && (
                <span
                  className="
                    absolute
                    bottom-0
                    left-0
                    right-0
                    h-0.5
                    rounded-full
                    bg-[#C17B4F]
                  "
                />
              )}
            </Link>

            {/* =================================================
                PROGRAMS DROPDOWN
            ================================================= */}

            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setProgramsOpen(
                    (previous) => !previous
                  )
                }
                className={`
                  ${desktopLinkBase}
                  outline-none
                  hover:text-[#C17B4F]
                  focus-visible:text-[#C17B4F]
                  ${
                    isSectionActive("program")
                      ? "font-semibold text-[#C17B4F]"
                      : ""
                  }
                `}
                aria-expanded={programsOpen}
                aria-haspopup="menu"
              >
                <GraduationCap className="h-4 w-4" />

                Programs

                <ChevronDown
                  className={`
                    h-4
                    w-4
                    transition-transform
                    duration-300
                    ${
                      programsOpen
                        ? "rotate-180"
                        : ""
                    }
                  `}
                />

                {isSectionActive("program") && (
                  <span
                    className="
                      absolute
                      bottom-0
                      left-0
                      right-0
                      h-0.5
                      rounded-full
                      bg-[#C17B4F]
                    "
                  />
                )}
              </button>

              {programsOpen && (
                <>
                  {/* Click outside */}

                  <button
                    type="button"
                    aria-label="Close programs menu"
                    className="
                      fixed
                      inset-0
                      z-40
                      cursor-default
                    "
                    onClick={() =>
                      setProgramsOpen(false)
                    }
                  />

                  {/* Dropdown */}

                  <div
                    className="
                      absolute
                      right-0
                      top-full
                      z-50
                      mt-3
                      w-80
                      overflow-hidden
                      rounded-2xl
                      border
                      border-[#E8DDD4]
                      bg-white
                      p-2
                      shadow-2xl
                    "
                  >
                    {/* Dropdown Header */}

                    <div className="px-4 pb-3 pt-3">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#C17B4F]">
                        Programs & Impact
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Explore initiatives and areas of impact.
                      </p>
                    </div>

                    <div className="h-px bg-[#E8DDD4]" />

                    {/* All Programs */}

                    <a
                      href="/#program"
                      onClick={(event) =>
                        handleSectionClick(
                          event,
                          "program"
                        )
                      }
                      className="
                        mt-2
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        px-3
                        py-3
                        transition-colors
                        hover:bg-[#F8F6F2]
                      "
                    >
                      <div
                        className="
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-lg
                          bg-[#4A1F0E]
                          text-white
                        "
                      >
                        <GraduationCap className="h-4 w-4" />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-[#2E1208]">
                          All Programs
                        </p>

                        <p className="text-xs text-gray-500">
                          View all initiatives
                        </p>
                      </div>
                    </a>

                    {/* Individual Programs */}

                    <div className="mt-1">
                      {PROGRAM_ACTIVITIES.map(
                        (program) => (
                          <Link
                            key={program.slug}
                            to={`/programs/${program.slug}`}
                            onClick={() =>
                              setProgramsOpen(false)
                            }
                            className="
                              flex
                              items-center
                              gap-3
                              rounded-xl
                              px-3
                              py-3
                              transition-colors
                              hover:bg-[#F8F6F2]
                            "
                          >
                            <div
                              className="
                                flex
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                bg-[#C17B4F]/10
                                text-[#8B4513]
                              "
                            >
                              <GraduationCap className="h-4 w-4" />
                            </div>

                            <div className="min-w-0">
                              <p
                                className="
                                  truncate
                                  text-sm
                                  font-medium
                                  text-[#2E1208]
                                "
                              >
                                {program.title}
                              </p>

                              <p
                                className="
                                  mt-0.5
                                  line-clamp-1
                                  text-xs
                                  text-gray-500
                                "
                              >
                                {program.description}
                              </p>
                            </div>
                          </Link>
                        )
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* =================================================
                TESTIMONIALS
            ================================================= */}

            <a
              href="/#testimonials"
              onClick={(event) =>
                handleSectionClick(
                  event,
                  "testimonials"
                )
              }
              className={`
                ${desktopLinkBase}
                hover:text-[#C17B4F]
                ${
                  isSectionActive("testimonials")
                    ? "font-semibold text-[#C17B4F]"
                    : ""
                }
              `}
            >
              <Quote className="h-4 w-4" />

              Testimonials

              {isSectionActive("testimonials") && (
                <span
                  className="
                    absolute
                    bottom-0
                    left-0
                    right-0
                    h-0.5
                    rounded-full
                    bg-[#C17B4F]
                  "
                />
              )}
            </a>

            {/* =================================================
                SPEAKING
            ================================================= */}

            <a
              href="/#speaking"
              onClick={(event) =>
                handleSectionClick(
                  event,
                  "speaking"
                )
              }
              className={`
                ${desktopLinkBase}
                hover:text-[#C17B4F]
                ${
                  isSectionActive("speaking")
                    ? "font-semibold text-[#C17B4F]"
                    : ""
                }
              `}
            >
              <Mic2 className="h-4 w-4" />

              Speaking

              {isSectionActive("speaking") && (
                <span
                  className="
                    absolute
                    bottom-0
                    left-0
                    right-0
                    h-0.5
                    rounded-full
                    bg-[#C17B4F]
                  "
                />
              )}
            </a>

            {/* =================================================
                DEAR DAD / DONATE
            ================================================= */}

            <Link
              to="/dear-dad/support"
              onClick={closeMobileMenu}
              className={`
                inline-flex
                items-center
                gap-2
                rounded-full
                px-5
                py-2.5
                text-sm
                font-bold
                shadow-md
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:shadow-xl
                focus:outline-none
                focus:ring-2
                focus:ring-[#D4A017]
                focus:ring-offset-2
                ${
                  isDearDadRoute
                    ? "bg-[#B88900] text-white"
                    : "bg-[#D4A017] text-white hover:bg-[#B88900]"
                }
              `}
              aria-label="Donate or support the Dear Dad Initiative"
            >
              <HeartHandshake className="h-4 w-4" />

              Donate
            </Link>
          </nav>

          {/* =====================================================
              MOBILE MENU BUTTON
          ===================================================== */}

          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen(
                (previous) => !previous
              )
            }
            className="
              rounded-xl
              border
              border-[#E8DDD4]
              p-2.5
              text-[#4A1F0E]
              transition-all
              duration-300
              hover:border-[#C17B4F]/40
              hover:bg-[#F8F6F2]
              hover:text-[#C17B4F]
              focus:outline-none
              focus:ring-2
              focus:ring-[#C17B4F]/40
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
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* =======================================================
            MOBILE NAVIGATION
        ======================================================= */}

        {mobileMenuOpen && (
          <div
            className="
              border-t
              border-[#E8DDD4]
              bg-white
              shadow-xl
              md:hidden
            "
          >
            <nav
              className="
                mx-auto
                max-w-7xl
                px-4
                pb-6
                pt-4
                sm:px-6
              "
              aria-label="Mobile navigation"
            >
              <div className="space-y-1">

                {/* =================================================
                    ABOUT
                ================================================= */}

                <a
                  href="/#about"
                  onClick={(event) =>
                    handleSectionClick(
                      event,
                      "about"
                    )
                  }
                  className={`
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    px-4
                    py-3.5
                    text-sm
                    font-medium
                    transition-colors
                    ${
                      isSectionActive("about")
                        ? "bg-[#F8F6F2] text-[#C17B4F]"
                        : "text-[#4A1F0E] hover:bg-[#F8F6F2] hover:text-[#C17B4F]"
                    }
                  `}
                >
                  <UserRound className="h-4 w-4" />

                  About
                </a>

                {/* =================================================
                    BOOKS
                ================================================= */}

                <Link
                  to="/books"
                  onClick={closeMobileMenu}
                  className={`
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    px-4
                    py-3.5
                    text-sm
                    font-medium
                    transition-colors
                    ${
                      isActiveRoute("/books")
                        ? "bg-[#F8F6F2] text-[#C17B4F]"
                        : "text-[#4A1F0E] hover:bg-[#F8F6F2] hover:text-[#C17B4F]"
                    }
                  `}
                >
                  <BookOpen className="h-4 w-4" />

                  Books
                </Link>

                {/* =================================================
                    PROGRAMS
                ================================================= */}

                <div className="rounded-xl">
                  <button
                    type="button"
                    onClick={() =>
                      setProgramsOpen(
                        (previous) => !previous
                      )
                    }
                    className={`
                      flex
                      w-full
                      items-center
                      justify-between
                      rounded-xl
                      px-4
                      py-3.5
                      text-left
                      text-sm
                      font-medium
                      transition-colors
                      ${
                        isSectionActive("program")
                          ? "bg-[#F8F6F2] text-[#C17B4F]"
                          : "text-[#4A1F0E] hover:bg-[#F8F6F2] hover:text-[#C17B4F]"
                      }
                    `}
                  >
                    <span className="flex items-center gap-3">
                      <GraduationCap className="h-4 w-4" />

                      Programs
                    </span>

                    <ChevronDown
                      className={`
                        h-4
                        w-4
                        transition-transform
                        duration-300
                        ${
                          programsOpen
                            ? "rotate-180"
                            : ""
                        }
                      `}
                    />
                  </button>

                  {programsOpen && (
                    <div
                      className="
                        ml-4
                        mt-1
                        space-y-1
                        border-l-2
                        border-[#E8DDD4]
                        pl-3
                      "
                    >
                      {/* All Programs */}

                      <a
                        href="/#program"
                        onClick={(event) =>
                          handleSectionClick(
                            event,
                            "program"
                          )
                        }
                        className="
                          block
                          rounded-lg
                          px-3
                          py-2.5
                          text-sm
                          font-medium
                          text-[#8B4513]
                          transition-colors
                          hover:bg-[#F8F6F2]
                        "
                      >
                        All Programs
                      </a>

                      {/* Individual Programs */}

                      {PROGRAM_ACTIVITIES.map(
                        (program) => (
                          <Link
                            key={program.slug}
                            to={`/programs/${program.slug}`}
                            onClick={closeMobileMenu}
                            className="
                              block
                              rounded-lg
                              px-3
                              py-2.5
                              text-sm
                              text-[#5C4436]
                              transition-colors
                              hover:bg-[#F8F6F2]
                              hover:text-[#C17B4F]
                            "
                          >
                            {program.title}
                          </Link>
                        )
                      )}
                    </div>
                  )}
                </div>

                {/* =================================================
                    TESTIMONIALS
                ================================================= */}

                <a
                  href="/#testimonials"
                  onClick={(event) =>
                    handleSectionClick(
                      event,
                      "testimonials"
                    )
                  }
                  className={`
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    px-4
                    py-3.5
                    text-sm
                    font-medium
                    transition-colors
                    ${
                      isSectionActive(
                        "testimonials"
                      )
                        ? "bg-[#F8F6F2] text-[#C17B4F]"
                        : "text-[#4A1F0E] hover:bg-[#F8F6F2] hover:text-[#C17B4F]"
                    }
                  `}
                >
                  <Quote className="h-4 w-4" />

                  Testimonials
                </a>

                {/* =================================================
                    SPEAKING
                ================================================= */}

                <a
                  href="/#speaking"
                  onClick={(event) =>
                    handleSectionClick(
                      event,
                      "speaking"
                    )
                  }
                  className={`
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    px-4
                    py-3.5
                    text-sm
                    font-medium
                    transition-colors
                    ${
                      isSectionActive("speaking")
                        ? "bg-[#F8F6F2] text-[#C17B4F]"
                        : "text-[#4A1F0E] hover:bg-[#F8F6F2] hover:text-[#C17B4F]"
                    }
                  `}
                >
                  <Mic2 className="h-4 w-4" />

                  Speaking
                </a>

                {/* =================================================
                    DEAR DAD
                ================================================= */}

                <Link
                  to="/dear-dad"
                  onClick={closeMobileMenu}
                  className={`
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    px-4
                    py-3.5
                    text-sm
                    font-semibold
                    transition-colors
                    ${
                      isDearDadRoute
                        ? "bg-[#F8F6F2] text-[#8B4513]"
                        : "text-[#4A1F0E] hover:bg-[#F8F6F2] hover:text-[#C17B4F]"
                    }
                  `}
                >
                  <HeartHandshake className="h-4 w-4" />

                  Dear Dad Initiative
                </Link>

                {/* Divider */}

                <div className="my-4 h-px bg-[#E8DDD4]" />

                {/* =================================================
                    DONATE CTA
                ================================================= */}

                <Link
                  to="/dear-dad/support"
                  onClick={closeMobileMenu}
                  className="
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-full
                    bg-[#D4A017]
                    px-5
                    py-3.5
                    text-sm
                    font-bold
                    text-white
                    shadow-lg
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:bg-[#B88900]
                    hover:shadow-xl
                    active:scale-[0.98]
                  "
                >
                  <HeartHandshake className="h-4 w-4" />

                  Donate / Support
                </Link>

                {/* =================================================
                    BOOK DAVID TO SPEAK
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
                    border
                    border-[#4A1F0E]
                    bg-white
                    px-5
                    py-3.5
                    text-sm
                    font-semibold
                    text-[#4A1F0E]
                    transition-all
                    duration-300
                    hover:bg-[#4A1F0E]
                    hover:text-white
                    active:scale-[0.98]
                  "
                >
                  <CalendarCheck2 className="h-4 w-4" />

                  Book David to Speak
                </button>

              </div>
            </nav>
          </div>
        )}
      </header>

      {/* =========================================================
          SPACER
      ========================================================= */}

      {isSticky && (
        <div
          className="h-[68px]"
          aria-hidden="true"
        />
      )}

      {/* =========================================================
          BOOKING MODAL
      ========================================================= */}

      <BookingModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
      />
    </>
  );
}