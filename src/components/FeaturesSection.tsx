import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  Building2, 
  Search, 
  MessageSquare, 
  BarChart3, 
  Shield,
  Clock,
  Filter,
  Bell
} from "lucide-react";

const FeaturesSection = () => {
  const organizerFeatures = [
    {
      icon: Users,
      title: "Bulk Recruitment",
      description: "Post multiple positions and manage hundreds of applications efficiently with our advanced bulk tools."
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard", 
      description: "Track hiring metrics, application rates, and recruitment performance with detailed insights."
    },
    {
      icon: MessageSquare,
      title: "Direct Messaging",
      description: "Communicate directly with candidates through our integrated messaging system."
    }
  ];

  const vendorFeatures = [
    {
      icon: Search,
      title: "Smart Job Search",
      description: "Find relevant hospitality opportunities with our advanced search and filtering system."
    },
    {
      icon: Bell,
      title: "Application Tracking",
      description: "Keep track of all your applications and get real-time updates on your status."
    },
    {
      icon: Shield,
      title: "Profile Management",
      description: "Create a comprehensive profile showcasing your experience and skills to employers."
    }
  ];

  const sharedFeatures = [
    {
      icon: Clock,
      title: "Real-time Updates",
      description: "Get instant notifications about new opportunities, application status changes, and messages."
    },
    {
      icon: Filter,
      title: "Advanced Filters",
      description: "Use location, salary, experience level, and job type filters to find exactly what you need."
    },
    {
      icon: Shield,
      title: "Secure & Trusted",
      description: "Role-based access control and secure data handling ensure your information stays protected."
    }
  ];

  return (
    <section id="features" className="py-24 bg-gradient-accent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Powerful tools designed specifically for the hospitality industry's unique hiring needs.
          </p>
        </div>

        {/* For Organizers */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
              <Building2 className="h-5 w-5 text-primary" />
              <span className="font-semibold text-primary">For Organizers & Companies</span>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {organizerFeatures.map((feature, index) => (
              <Card key={index} className="bg-card shadow-card hover:shadow-elevated transition-smooth">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* For Vendors */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-success/10 px-4 py-2 rounded-full mb-4">
              <Users className="h-5 w-5 text-success" />
              <span className="font-semibold text-success">For Job Seekers & Vendors</span>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {vendorFeatures.map((feature, index) => (
              <Card key={index} className="bg-card shadow-card hover:shadow-elevated transition-smooth">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto bg-success/10 p-3 rounded-full w-fit mb-4">
                    <feature.icon className="h-8 w-8 text-success" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Shared Features */}
        <div>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-warning/10 px-4 py-2 rounded-full mb-4">
              <Shield className="h-5 w-5 text-warning" />
              <span className="font-semibold text-warning">For Everyone</span>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {sharedFeatures.map((feature, index) => (
              <Card key={index} className="bg-card shadow-card hover:shadow-elevated transition-smooth">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto bg-warning/10 p-3 rounded-full w-fit mb-4">
                    <feature.icon className="h-8 w-8 text-warning" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;