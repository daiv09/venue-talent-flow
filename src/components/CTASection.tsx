import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Users, ArrowRight, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useState } from "react";

const CTASection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialRole =
    (location.state as { role?: UserRole } | undefined)?.role ?? null;

  const [role, setRole] = useState<UserRole | null>(initialRole);
  return (
    <section className="py-24 bg-gradient-hero relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/95 to-primary-light/90" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
            Ready to Transform Your Hiring?
          </h2>
          <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
            Join thousands of companies and professionals already using
            HotelHirePro to streamline their hospitality recruitment process.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* For Companies */}
          <Card className="bg-primary-foreground/10 border-primary-foreground/20 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 bg-primary-foreground/20 px-4 py-2 rounded-full mb-4">
                  <Building2 className="h-5 w-5 text-primary-foreground" />
                  <span className="font-semibold text-primary-foreground">
                    For Companies
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-primary-foreground mb-2">
                  Start Hiring Today
                </h3>
                <p className="text-primary-foreground/80">
                  Post your first job and connect with qualified candidates
                  instantly
                </p>
              </div>

              <div className="space-y-3 mb-6">
                {[
                  "Post unlimited job listings",
                  "Access to 25K+ professionals",
                  "Advanced filtering & analytics",
                  "Bulk recruitment tools",
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 text-primary-foreground/90"
                  >
                    <CheckCircle className="h-5 w-5 text-success-foreground flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                variant="secondary"
                size="lg"
                className="w-full group"
                onClick={() =>
                  navigate("/signup", { state: { role: "company" } })
                }
              >
                Create Company Account
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>

          {/* For Job Seekers */}
          <Card className="bg-primary-foreground/10 border-primary-foreground/20 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 bg-primary-foreground/20 px-4 py-2 rounded-full mb-4">
                  <Users className="h-5 w-5 text-primary-foreground" />
                  <span className="font-semibold text-primary-foreground">
                    For Job Seekers
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-primary-foreground mb-2">
                  Find Your Next Role
                </h3>
                <p className="text-primary-foreground/80">
                  Browse thousands of hospitality opportunities and get hired
                  faster
                </p>
              </div>

              <div className="space-y-3 mb-6">
                {[
                  "Browse 10K+ active job listings",
                  "Create a standout profile",
                  "Direct messaging with employers",
                  "Application tracking & alerts",
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 text-primary-foreground/90"
                  >
                    <CheckCircle className="h-5 w-5 text-success-foreground flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                variant="secondary"
                size="lg"
                className="w-full group"
                onClick={() =>
                  navigate("/signup", { state: { role: "vendor" } })
                }
              >
                Create Professional Profile
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <p className="text-primary-foreground/80 mb-4">
            Already have an account?
          </p>
          <Button
            variant="outline"
            size="lg"
            className="bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20"
            onClick={() => navigate("/login", { state: { role: "organiser" } })}
          >
            Sign In to Your Account
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
