// src/pages/Home.tsx
import Hero from "../sections/Hero";
import About from "../sections/About";
import Books from "../sections/Books";
import Program from "../sections/Program";
import Speaking from "../sections/Speaking";
import LogoSplash from "../components/LogoSplash";

export default function Home() {
  return (
    <>
      {/* Loading / splash screen - shown on first load */}
      <LogoSplash />

      {/* Main content - Header and Footer are now provided by PublicLayout */}
      <div className="min-h-screen bg-[#F9F6EF] text-[#2E1208] font-body antialiased">
        <main>
          <Hero />
          <About />
          <Books />
          <Program />
          <Speaking />
        </main>
      </div>
    </>
  );
}