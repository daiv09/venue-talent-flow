import { Button } from "@/components/ui/button";
import { Building2, Users, ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-hospitality.jpg";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate(); // <-- useNavigate hook

  return (
    <section className="relative bg-gradient-hero overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary-light/80" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6">
              Streamline Your
              <span className="block text-primary-foreground">
                Hospitality Hiring
              </span>
            </h1>
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl">
              Connect top talent with leading hospitality companies. Whether
              you're hiring for events, hotels, or restaurants, HotelHirePro
              makes bulk recruitment simple and efficient.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button
                variant="secondary"
                size="xl"
                onClick={() =>
                  navigate("/login", { state: { role: "organiser" } })
                }
              >
                I'm an Organizer
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                size="xl"
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20 group"
                onClick={() => navigate("/signup")} // <-- navigate to signup
              >
                <Users className="mr-2 h-5 w-5" />
                I'm Looking for Work
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-primary-foreground">
                  10K+
                </div>
                <div className="text-primary-foreground/80">Jobs Posted</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-foreground">
                  25K+
                </div>
                <div className="text-primary-foreground/80">Professionals</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-foreground">
                  500+
                </div>
                <div className="text-primary-foreground/80">Companies</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative lg:block">
            <div className="relative rounded-2xl overflow-hidden shadow-elevated">
              <img
                src={heroImage}
                alt="Diverse hospitality team in modern hotel setting"
                className="w-full h-[400px] lg:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
