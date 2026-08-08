// src/pages/Home.tsx

import Hero from "../sections/Hero";
import About from "../sections/About";
import FeaturedBooks from "../sections/FeaturedBooks";
import Program from "../sections/Programs";
import Speaking from "../sections/Speaking";
import LogoSplash from "../components/LogoSplash";

export default function Home() {
  return (
    <>
      {/* Loading / splash screen - shown on first load */}
      <LogoSplash />

      {/* Main homepage content */}
      <div className="min-h-screen bg-[#EEF2F7] text-[#2E1208] font-body antialiased">
        <main>
          <Hero />
          <About />
          <FeaturedBooks />
          <Program />
          <Speaking />
        </main>
      </div>
    </>
  );
}