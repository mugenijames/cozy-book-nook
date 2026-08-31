
// frontend/src/sections/Header.tsx

import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  CalendarCheck2,
  ChevronDown,
  Menu,
  X,
  BookOpen,
  BookMarked,
  UserRound,
  Quote,
  GraduationCap,
  HeartHandshake,
  Newspaper,
} from "lucide-react";

import BookingModal from "@/components/BookingModal";
import { PROGRAM_ACTIVITIES } from "@/data/programActivities";

const SECTION_IDS = ["about", "program", "testimonials"];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [programsOpen, setProgramsOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const location = useLocation();
  const isHomePage = location.pathname === "/";

  // ============================================================
  // CLOSE MENUS
  // ============================================================

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setProgramsOpen(false);
  };

  // ============================================================
  // OPEN BOOKING MODAL
  // ============================================================

  const openBookingModal = () => {
    closeMobileMenu();
    setBookingOpen(true);
  };

  // ============================================================
  // STICKY HEADER
  // ============================================================

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // ============================================================
  // CLOSE MOBILE MENU WHEN ROUTE CHANGES
  // ============================================================

  useEffect(() => {
    setMobileMenuOpen(false);
    setProgramsOpen(false);
  }, [location.pathname]);

  // ============================================================
  // ACTIVE HOMEPAGE SECTION
  // ============================================================

  useEffect(() => {
    if (!isHomePage) {
      setActiveSection("");
      return;
    }

    const sections = SECTION_IDS.map((id) =>
      document.getElementById(id)
    ).filter(Boolean) as HTMLElement[];

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
        rootMargin: "-100px 0px -45% 0px",
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

  // ============================================================
  // SECTION CLICK
  // ============================================================

  const handleSectionClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string
  ) => {
    closeMobileMenu();

    if (isHomePage) {
      event.preventDefault();

      const element = document.getElementById(sectionId);

      if (element) {
        const headerOffset = isSticky ? 88 : 96;

        const elementPosition =
          element.getBoundingClientRect().top +
          window.scrollY;

        const offsetPosition =
          elementPosition - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });

        window.history.replaceState(
          null,
          "",
          `#${sectionId}`
        );

        setActiveSection(sectionId);
      }
    }
  };

  // ============================================================
  // ACTIVE ROUTE
  // ============================================================

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  // ============================================================
  // ACTIVE SECTION
  // ============================================================

  const isSectionActive = (sectionId: string) => {
    return (
      isHomePage &&
      activeSection === sectionId
    );
  };

  // ============================================================
  // DESKTOP LINK STYLE
  // ============================================================

  const desktopLinkBase =
    "relative flex items-center gap-1.5 py-2 text-[13px] lg:text-sm font-semibold transition-all duration-300";

  return (
    <>
      {/* ======================================================
          HEADER
      ====================================================== */}

      <header
        className={`
          fixed
          left-0
          top-0
          z-[100]
          w-full
          transition-all
          duration-300
          ${
            isSticky
              ? `
                border-b
                border-[#E8DDD4]/80
                bg-white/95
                shadow-[0_8px_30px_rgba(46,18,8,0.08)]
                backdrop-blur-xl
              `
              : `
                bg-white
              `
          }
        `}
      >
        <div
          className={`
            mx-auto
            flex
            max-w-[1440px]
            items-center
            justify-between
            px-4
            sm:px-6
            lg:px-8
            xl:px-10
            transition-all
            duration-300
            ${
              isSticky
                ? "min-h-[72px]"
                : "min-h-[88px]"
            }
          `}
        >
          {/* ==================================================
              LOGO
          ================================================== */}

          <Link
            to="/"
            onClick={closeMobileMenu}
            className="
              group
              flex
              shrink-0
              items-center
              gap-3
              sm:gap-4
            "
            aria-label="David Emuria - Home"
          >
            {/* LOGO CONTAINER */}

            <div
              className={`
                relative
                flex
                shrink-0
                items-center
                justify-center
                overflow-hidden
                rounded-full
                border
                border-[#D8C9BE]
                bg-white
                shadow-[0_4px_16px_rgba(46,18,8,0.12)]
                transition-all
                duration-300
                group-hover:border-[#C17B4F]
                group-hover:shadow-[0_6px_22px_rgba(46,18,8,0.18)]
                ${
                  isSticky
                    ? "h-12 w-12 sm:h-14 sm:w-14"
                    : "h-16 w-16 sm:h-[72px] sm:w-[72px]"
                }
              `}
            >
              <img
                src="/logo.png"
                alt="David Emuria logo"
                className="
                  h-full
                  w-full
                  object-contain
                  p-1
                  transition-transform
                  duration-500
                  group-hover:scale-105
                "
                onError={(event) => {
                  event.currentTarget.style.display =
                    "none";
                }}
              />

              {/* SUBTLE LOGO GLOW */}

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  rounded-full
                  ring-1
                  ring-inset
                  ring-[#C17B4F]/10
                "
              />
            </div>

            {/* BRAND TEXT */}

            <div className="leading-tight">
              <p
                className={`
                  font-heading
                  font-bold
                  tracking-tight
                  text-[#2E1208]
                  transition-all
                  duration-300
                  group-hover:text-[#C17B4F]
                  ${
                    isSticky
                      ? "text-base sm:text-lg"
                      : "text-lg sm:text-xl"
                  }
                `}
              >
                David Emuria
              </p>

              <p
                className="
                  mt-1
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[0.2em]
                  text-[#C17B4F]
                  sm:text-[10px]
                "
              >
                Author & Speaker
              </p>
            </div>
          </Link>

          {/* ==================================================
              DESKTOP NAVIGATION
          ================================================== */}

          <nav
            className="
              hidden
              items-center
              gap-4
              text-[#4A1F0E]
              md:flex
              lg:gap-5
              xl:gap-6
            "
            aria-label="Main navigation"
          >
            {/* ABOUT */}

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
                    ? "text-[#C17B4F]"
                    : ""
                }
              `}
            >
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

            {/* BOOKS */}

            <Link
              to="/books"
              onClick={closeMobileMenu}
              className={`
                ${desktopLinkBase}
                hover:text-[#C17B4F]
                ${
                  isActiveRoute("/books")
                    ? "text-[#C17B4F]"
                    : ""
                }
              `}
            >
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

            {/* COURSES */}

            <Link
              to="/courses"
              onClick={closeMobileMenu}
              className={`
                ${desktopLinkBase}
                hover:text-[#C17B4F]
                ${
                  isActiveRoute("/courses")
                    ? "text-[#C17B4F]"
                    : ""
                }
              `}
            >
              Courses

              {isActiveRoute("/courses") && (
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

            {/* BLOGS */}

            <Link
              to="/blogs"
              onClick={closeMobileMenu}
              className={`
                ${desktopLinkBase}
                hover:text-[#C17B4F]
                ${
                  isActiveRoute("/blogs")
                    ? "text-[#C17B4F]"
                    : ""
                }
              `}
            >
              Blogs

              {isActiveRoute("/blogs") && (
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

            {/* PROGRAMS DROPDOWN */}

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
                      ? "text-[#C17B4F]"
                      : ""
                  }
                `}
                aria-expanded={programsOpen}
                aria-haspopup="menu"
              >
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
                  {/* BACKDROP */}

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

                  {/* DROPDOWN */}

                  <div
                    className="
                      absolute
                      right-0
                      top-full
                      z-50
                      mt-4
                      w-[360px]
                      overflow-hidden
                      rounded-2xl
                      border
                      border-[#E8DDD4]
                      bg-white
                      shadow-[0_20px_50px_rgba(46,18,8,0.16)]
                    "
                  >
                    {/* DROPDOWN HEADER */}

                    <div
                      className="
                        bg-[#F8F6F2]
                        px-5
                        py-4
                      "
                    >
                      <p
                        className="
                          text-[10px]
                          font-bold
                          uppercase
                          tracking-[0.2em]
                          text-[#C17B4F]
                        "
                      >
                        Our Programs
                      </p>
                    </div>

                    <div className="h-px bg-[#E8DDD4]" />

                    {/* ALL PROGRAMS */}

                    <a
                      href="/#program"
                      onClick={(event) =>
                        handleSectionClick(
                          event,
                          "program"
                        )
                      }
                      className="
                        mx-2
                        mt-2
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        px-3
                        py-3
                        transition-all
                        hover:bg-[#F8F6F2]
                      "
                    >
                      <div>
                        <p className="text-sm font-bold text-[#2E1208]">
                          All Programs
                        </p>
                      </div>
                    </a>

                    {/* PROGRAM LIST */}

                    <div className="px-2 pb-2">
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
                              transition-all
                              hover:bg-[#F8F6F2]
                            "
                          >
                            <div className="min-w-0">
                              <p
                                className="
                                  truncate
                                  text-sm
                                  font-semibold
                                  text-[#2E1208]
                                "
                              >
                                {program.title}
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

            {/* TESTIMONIALS */}

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
                  isSectionActive(
                    "testimonials"
                  )
                    ? "text-[#C17B4F]"
                    : ""
                }
              `}
            >
              Testimonials

              {isSectionActive(
                "testimonials"
              ) && (
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
                BOOK DAVID
            ================================================= */}

            <button
              type="button"
              onClick={openBookingModal}
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-[#4A1F0E]
                px-4
                py-2.5
                text-sm
                font-bold
                text-white
                shadow-md
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:bg-[#2E1208]
                hover:shadow-xl
                focus:outline-none
                focus:ring-2
                focus:ring-[#C17B4F]
                focus:ring-offset-2
                active:scale-95
                lg:px-5
              "
            >
              Book David
            </button>

            {/* =================================================
                DONATE
            ================================================= */}

            <Link
              to="/dear-dad/support"
              onClick={closeMobileMenu}
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-[#D4A017]
                px-4
                py-2.5
                text-sm
                font-bold
                text-white
                shadow-md
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:bg-[#B58900]
                hover:shadow-xl
                focus:outline-none
                focus:ring-2
                focus:ring-[#D4A017]
                focus:ring-offset-2
                active:scale-95
                lg:px-5
              "
            >
              Donate
            </Link>
          </nav>

          {/* ==================================================
              MOBILE MENU BUTTON
          ================================================== */}

          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen(
                (previous) => !previous
              )
            }
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              border
              border-[#E8DDD4]
              bg-white
              text-[#4A1F0E]
              shadow-sm
              transition-all
              duration-300
              hover:border-[#C17B4F]/50
              hover:bg-[#F8F6F2]
              hover:text-[#C17B4F]
              focus:outline-none
              focus:ring-2
              focus:ring-[#C17B4F]/30
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

        {/* ======================================================
            MOBILE NAVIGATION
        ====================================================== */}

        {mobileMenuOpen && (
          <div
            className="
              border-t
              border-[#E8DDD4]
              bg-white
              shadow-[0_15px_35px_rgba(46,18,8,0.10)]
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
                {/* ABOUT */}

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
                    font-semibold
                    transition-all
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

                {/* BOOKS */}

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
                    font-semibold
                    transition-all
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

                {/* COURSES */}

                <Link
                  to="/courses"
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
                    transition-all
                    ${
                      isActiveRoute("/courses")
                        ? "bg-[#F8F6F2] text-[#C17B4F]"
                        : "text-[#4A1F0E] hover:bg-[#F8F6F2] hover:text-[#C17B4F]"
                    }
                  `}
                >
                  <BookMarked className="h-4 w-4" />
                  Courses
                </Link>

                {/* BLOGS */}

                <Link
                  to="/blogs"
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
                    transition-all
                    ${
                      isActiveRoute("/blogs")
                        ? "bg-[#F8F6F2] text-[#C17B4F]"
                        : "text-[#4A1F0E] hover:bg-[#F8F6F2] hover:text-[#C17B4F]"
                    }
                  `}
                >
                  <Newspaper className="h-4 w-4" />
                  Blogs
                </Link>

                {/* PROGRAMS */}

                <div className="rounded-xl">
                  <button
                    type="button"
                    onClick={() =>
                      setProgramsOpen(
                        (previous) =>
                          !previous
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
                      font-semibold
                      transition-all
                      ${
                        isSectionActive(
                          "program"
                        )
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
                      {/* ALL PROGRAMS */}

                      <a
                        href="/#program"
                        onClick={(event) =>
                          handleSectionClick(
                            event,
                            "program"
                          )
                        }
                        className="
                          flex
                          items-center
                          gap-2
                          rounded-lg
                          px-3
                          py-2.5
                          text-sm
                          font-semibold
                          text-[#2E1208]
                          transition-all
                          hover:bg-[#F8F6F2]
                          hover:text-[#C17B4F]
                        "
                      >
                        <GraduationCap className="h-4 w-4 text-[#4A1F0E]" />
                        All Programs
                      </a>

                      {/* PROGRAMS */}

                      {PROGRAM_ACTIVITIES.map(
                        (program) => (
                          <Link
                            key={program.slug}
                            to={`/programs/${program.slug}`}
                            onClick={closeMobileMenu}
                            className="
                              flex
                              items-center
                              gap-2
                              rounded-lg
                              px-3
                              py-2.5
                              text-sm
                              font-medium
                              text-[#4A1F0E]
                              transition-all
                              hover:bg-[#F8F6F2]
                              hover:text-[#C17B4F]
                            "
                          >
                            <span
                              className="
                                h-1.5
                                w-1.5
                                shrink-0
                                rounded-full
                                bg-[#C17B4F]
                              "
                            />

                            <span className="truncate">
                              {program.title}
                            </span>
                          </Link>
                        )
                      )}
                    </div>
                  )}
                </div>

                {/* TESTIMONIALS */}

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
                    font-semibold
                    transition-all
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
              </div>

              {/* =================================================
                  MOBILE ACTIONS
              ================================================= */}

              <div
                className="
                  mt-6
                  space-y-3
                  border-t
                  border-[#E8DDD4]
                  pt-5
                "
              >
                {/* BOOK DAVID */}

                <button
                  type="button"
                  onClick={openBookingModal}
                  className="
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-full
                    bg-[#4A1F0E]
                    px-5
                    py-3.5
                    text-sm
                    font-bold
                    text-white
                    shadow-md
                    transition-all
                    hover:bg-[#2E1208]
                    active:scale-[0.98]
                  "
                >
                  <CalendarCheck2 className="h-4 w-4" />
                  Book David
                </button>

                {/* DONATE */}

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
                    shadow-md
                    transition-all
                    hover:bg-[#B58900]
                    active:scale-[0.98]
                  "
                >
                  <HeartHandshake className="h-4 w-4" />
                  Donate
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* ======================================================
          HEADER SPACER
      ====================================================== */}

      <div
        className={`
          ${
            isSticky
              ? "h-[72px]"
              : "h-[88px]"
          }
        `}
        aria-hidden="true"
      />

      {/* ======================================================
          BOOKING MODAL

          IMPORTANT:
          BookingModal expects `open`, NOT `isOpen`.
      ====================================================== */}

      <BookingModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
      />
    </>
  );
}

