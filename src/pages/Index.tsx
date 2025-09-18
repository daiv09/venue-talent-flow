import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import JobsShowcase from "@/components/JobsShowcase";
import CTASection from "@/components/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <FeaturesSection />
        <JobsShowcase />
        <CTASection />
      </main>
      
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-6">
            <h3 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-2">
              HotelHirePro
            </h3>
            <p className="text-muted-foreground">
              Streamlining hospitality hiring for a better industry
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            © 2024 HotelHirePro. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
