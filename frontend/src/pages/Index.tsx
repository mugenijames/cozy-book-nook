import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AboutAuthor from "@/components/AboutAuthor";
import BookSection from "@/components/BookSection";
import SpeakingSection from "@/components/SpeakingSection";
import Testimonials from "@/components/Testimonials";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <AboutAuthor />
        <BookSection />
        <SpeakingSection />
        <Testimonials />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
