import Header from "@/components/Header";
import HeroSection from "@/components/home/HeroSection";
import FeaturedBooks from "@/components/FeaturedBooks";
import Categories from "@/components/Categories";
import StaffPicks from "@/components/StaffPicks";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero / Banner */}
        <HeroSection />

        {/* Featured Books */}
        <FeaturedBooks />

        {/* Categories */}
        <Categories />

        {/* Staff Picks */}
        <StaffPicks />

        {/* Newsletter */}
        <Newsletter />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
