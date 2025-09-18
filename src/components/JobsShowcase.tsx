import JobCard from "./JobCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const JobsShowcase = () => {
  const sampleJobs = [
    {
      id: "1",
      title: "Hotel Front Desk Manager",
      company: "Grand Plaza Hotel",
      location: "New York, NY",
      salary: "$45,000 - $60,000",
      type: "Full-time",
      posted: "2 days ago",
      applicants: 24,
      description: "Lead our front desk operations and provide exceptional guest experiences. Looking for someone with hospitality management experience and excellent communication skills.",
      tags: ["Management", "Customer Service", "Hotel Operations", "Leadership"],
      urgent: true
    },
    {
      id: "2", 
      title: "Event Catering Staff",
      company: "Elite Events Co.",
      location: "Los Angeles, CA",
      salary: "$18 - $25/hour",
      type: "Contract",
      posted: "1 day ago",
      applicants: 47,
      description: "Join our team for high-end corporate and wedding events. Flexible schedules available with opportunities for growth in the events industry.",
      tags: ["Catering", "Events", "Flexible Schedule", "Tips"],
    },
    {
      id: "3",
      title: "Restaurant Server", 
      company: "Coastal Bistro",
      location: "Miami, FL",
      salary: "$15/hour + Tips",
      type: "Part-time",
      posted: "3 hours ago", 
      applicants: 15,
      description: "Experienced server needed for busy waterfront restaurant. Weekend and evening shifts available. Great tips and team environment.",
      tags: ["Restaurant", "Tips", "Weekends", "Beachfront"],
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Latest Hospitality Opportunities
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover your next career opportunity in hotels, restaurants, events, and more
          </p>
        </div>

        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
          {sampleJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" size="lg" className="group">
            View All Jobs
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default JobsShowcase;