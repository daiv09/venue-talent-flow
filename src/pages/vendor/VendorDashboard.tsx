import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

const VendorDashboard = () => {
  const [events, setEvents] = useState<Array<{ id: string; name: string; event_date: string; location: string }>>([]);
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("events").select("id,name,event_date,location").order("event_date", { ascending: true });
      setEvents(data ?? []);
    };
    load();
  }, []);
  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
        <Card>
          <CardHeader>
            <CardTitle>Your profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Manage your vendor profile and availability. More features coming soon.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Available events</CardTitle>
          </CardHeader>
          <CardContent>
            {events.length === 0 ? (
              <p className="text-muted-foreground">No events available.</p>
            ) : (
              <div className="space-y-2">
                {events.map((e) => (
                  <div key={e.id} className="flex items-center justify-between border border-border rounded-md p-3">
                    <div>
                      <div className="font-medium">{e.name}</div>
                      <div className="text-sm text-muted-foreground">{new Date(e.event_date).toDateString()} • {e.location}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VendorDashboard;


