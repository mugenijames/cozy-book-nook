import Header from "../sections/Header";
import Hero from "../sections/Hero";
import About from "../sections/About";
import Books from "../sections/Books";
import Program from "../sections/Program";
import Speaking from "../sections/Speaking";
import Footer from "../sections/Footer";
import LogoSplash from "../components/LogoSplash";

const Home = () => {
  return (
    <div className="bg-[#F9F6EF] text-[#2E1208] font-body">
      <LogoSplash />
      <Header />
      <Hero />
      <About />
      <Books />
      <Program />
      <Speaking />
      <Footer />
    </div>
  );
};

export default Home;