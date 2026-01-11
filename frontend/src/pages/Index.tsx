import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturedBooks from "@/components/FeaturedBooks";
import Categories from "@/components/Categories";
import StaffPicks from "@/components/StaffPicks";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturedBooks />
        <Categories />
        <StaffPicks />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
