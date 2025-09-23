import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import VendorProfileSection from "@/components/VendorProfileSection";
import VendorDocuments from "@/components/VendorDocs";
import {
  BadgeCheck,
  FileText,
  CalendarDays,
  MapPin,
  Loader2,
} from "lucide-react";

type EventRow = {
  id: string;
  name: string;
  event_date: string;
  location: string;
};

const VendorDashboard = () => {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [myApplications, setMyApplications] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [applyingFor, setApplyingFor] = useState<string | null>(null);
  const { toast } = useToast();

  // Load data when mounted
  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      // Check auth session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData?.session) {
        toast({
          title: "Not logged in",
          description: "Please log in to view vendor dashboard.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      try {
        const { data: eventsData, error: eventsError } = await supabase
          .from("events")
          .select("id,name,event_date,location")
          .order("event_date", { ascending: true });

        if (eventsError) throw eventsError;
        setEvents(eventsData ?? []);

        // Load current vendor ID
        const vendorId = sessionData.session.user.id;
        if (!vendorId) {
          setMyApplications([]);
          setLoading(false);
          return;
        }

        // Load vendor’s applications
        const { data: apps, error: appsError } = await supabase
          .from("vendor_applications")
          .select("event_id")
          .eq("vendor_id", vendorId);

        if (appsError) throw appsError;
        setMyApplications((apps ?? []).map((a: any) => a.event_id));
      } catch (err: any) {
        toast({
          title: "Failed to load data",
          description: err?.message ?? String(err),
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, []);

  const applyForEvent = async (eventId: string) => {
    setApplyingFor(eventId);
    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError) throw userError;
      const vendorId = userData?.user?.id;
      if (!vendorId) {
        toast({
          title: "Not logged in",
          description: "Please log in to apply",
          variant: "destructive",
        });
        setApplyingFor(null);
        return;
      }

      const { error } = await supabase.from("vendor_applications").insert({
        vendor_id: vendorId,
        event_id: eventId,
      });

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Already applied",
            description: "You’ve already applied for this event.",
            variant: "destructive",
          });
          setMyApplications((prev) =>
            prev.includes(eventId) ? prev : [...prev, eventId]
          );
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Applied",
          description: "Your application was submitted.",
          variant: "default",
        });
        setMyApplications((prev) =>
          prev.includes(eventId) ? prev : [...prev, eventId]
        );
      }
    } catch (err: any) {
      toast({
        title: "Application failed",
        description: err?.message ?? String(err),
        variant: "destructive",
      });
    } finally {
      setApplyingFor(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-fuchsia-50 to-blue-100 px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center gap-3 pb-2">
          <BadgeCheck className="w-8 h-8 text-violet-400" />
          <h1 className="text-4xl font-extrabold text-violet-700 tracking-tight">
            Vendor Dashboard
          </h1>
        </div>

        {/* Profile Section */}
        <Card className="bg-white/80 border-0 shadow-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BadgeCheck className="w-6 h-6 text-green-400" />
              <CardTitle className="text-green-700">Your Profile</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <VendorProfileSection />
          </CardContent>
        </Card>

        {/* Document Verification Section */}
        <Card className="bg-white/80 border-0 shadow-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="w-6 h-6 text-cyan-400" />
              <CardTitle className="text-cyan-700">
                Document Verification
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <VendorDocuments />
          </CardContent>
        </Card>

        {/* Events Section */}
        <Card className="bg-white/80 border-0 shadow-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CalendarDays className="w-6 h-6 text-violet-400" />
              <CardTitle className="text-violet-700">
                Available Events
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center gap-2 text-gray-500">
                <Loader2 className="animate-spin" /> Loading events…
              </div>
            ) : events.length === 0 ? (
              <p className="text-muted-foreground italic">
                No events available.
              </p>
            ) : (
              <div className="space-y-4">
                {events.map((e) => {
                  const applied = myApplications.includes(e.id);
                  const isApplying = applyingFor === e.id;
                  return (
                    <div
                      key={e.id}
                      className="flex items-center justify-between border border-violet-100 hover:ring-2 hover:ring-violet-200 bg-gradient-to-r from-violet-50/50 to-white shadow rounded-lg p-4 transition-all"
                    >
                      <div>
                        <div className="font-semibold text-lg text-violet-900">
                          {e.name}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          <CalendarDays className="w-4 h-4" />
                          {new Date(e.event_date).toLocaleDateString()}
                          <span className="mx-2">•</span>
                          <MapPin className="w-4 h-4" />
                          {e.location}
                        </div>
                      </div>
                      {applied ? (
                        <Button
                          disabled
                          variant="secondary"
                          className="bg-green-50 text-green-600 border-green-200/50 cursor-default"
                        >
                          Applied
                        </Button>
                      ) : (
                        <Button
                          onClick={() => applyForEvent(e.id)}
                          disabled={isApplying}
                          className="bg-violet-600 hover:bg-violet-700 text-white shadow transition-all"
                        >
                          {isApplying ? (
                            <span className="flex items-center gap-2">
                              <Loader2 className="animate-spin w-4 h-4" />{" "}
                              Applying...
                            </span>
                          ) : (
                            "Apply"
                          )}
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VendorDashboard;
