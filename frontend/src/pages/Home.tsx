// src/pages/Home.tsx
import Header from "../sections/Header";
import Hero from "../sections/Hero";
import About from "../sections/About";
import Books from "../sections/Books";
import Program from "../sections/Program";
import Speaking from "../sections/Speaking";
import Footer from "../sections/Footer";
import LogoSplash from "../components/LogoSplash";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F9F6EF] text-[#2E1208] font-body antialiased">
      {/* Loading / splash screen - shown on first load */}
      <LogoSplash />

      {/* Main document structure */}
      <div className="flex flex-col min-h-screen">
        {/* Header – fixed or sticky depending on your design */}
        <Header />

        {/* Main content */}
        <main className="flex-grow">
          <Hero />
          <About />
          <Books />
          <Program />
          <Speaking />
        </main>

        {/* Footer – always at the bottom */}
        <Footer />
      </div>
    </div>
  );
}