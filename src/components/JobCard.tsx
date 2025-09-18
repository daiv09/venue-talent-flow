import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  DollarSign, 
  Clock, 
  Users, 
  Calendar,
  Bookmark,
  ExternalLink
} from "lucide-react";

interface JobCardProps {
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    salary: string;
    type: string;
    posted: string;
    applicants: number;
    description: string;
    tags: string[];
    urgent?: boolean;
  };
}

const JobCard = ({ job }: JobCardProps) => {
  return (
    <Card className="bg-card shadow-card hover:shadow-elevated transition-smooth border border-border">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <CardTitle className="text-xl font-semibold text-foreground mb-1 hover:text-primary transition-smooth">
              {job.title}
            </CardTitle>
            <p className="text-muted-foreground font-medium">{job.company}</p>
          </div>
          <div className="flex items-center gap-2">
            {job.urgent && (
              <Badge variant="destructive" className="animate-pulse">
                Urgent
              </Badge>
            )}
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
              <Bookmark className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {job.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {job.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{job.tags.length - 3} more
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-muted-foreground mb-4 line-clamp-2">
          {job.description}
        </p>

        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <DollarSign className="h-4 w-4" />
            <span>{job.salary}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{job.type}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{job.applicants} applied</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Posted {job.posted}</span>
          </div>
          <Button variant="default" size="sm" className="group">
            Apply Now
            <ExternalLink className="ml-2 h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;