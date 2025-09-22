import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Position = { title: string; quantity: number };

const OrganiserDashboard = () => {
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [positions, setPositions] = useState<Position[]>([{ title: "", quantity: 1 }]);

  const addPosition = () => setPositions((p) => [...p, { title: "", quantity: 1 }]);
  const removePosition = (idx: number) => setPositions((p) => p.filter((_, i) => i !== idx));
  const updatePosition = (idx: number, patch: Partial<Position>) =>
    setPositions((p) => p.map((pos, i) => (i === idx ? { ...pos, ...patch } : pos)));

  const { toast } = useToast();
  const [myEvents, setMyEvents] = useState<Array<{ id: string; name: string; event_date: string; location: string }>>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("events").select("id,name,event_date,location").order("event_date", { ascending: true });
      setMyEvents(data ?? []);
    };
    load();
  }, []);

  const onCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: user } = await supabase.auth.getUser();
    const organiserId = user.user?.id;
    const { error: eventError, data: inserted } = await supabase
      .from("events")
      .insert({ organiser_id: organiserId ?? null, name: eventName, event_date: eventDate, location, notes })
      .select("id")
      .single();
    if (eventError || !inserted) {
      toast({ title: "Failed to create event", description: eventError?.message, variant: "destructive" });
      return;
    }
    const rows = positions.filter((p) => p.title.trim()).map((p) => ({ event_id: inserted.id, title: p.title.trim(), quantity: p.quantity }));
    if (rows.length) {
      const { error: posError } = await supabase.from("event_positions").insert(rows);
      if (posError) {
        toast({ title: "Event created, but positions failed", description: posError.message, variant: "destructive" });
      }
    }
    toast({ title: "Event created" });
    setEventName("");
    setEventDate("");
    setLocation("");
    setNotes("");
    setPositions([{ title: "", quantity: 1 }]);
    const { data } = await supabase.from("events").select("id,name,event_date,location").order("event_date", { ascending: true });
    setMyEvents(data ?? []);
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Organiser Dashboard</h1>
        <Card>
          <CardHeader>
            <CardTitle>Create an event</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onCreateEvent} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="eventName">Event name</Label>
                  <Input id="eventName" value={eventName} onChange={(e) => setEventName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eventDate">Date</Label>
                  <Input id="eventDate" type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any special requirements" />
              </div>

              <Separator />
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Positions to hire</h2>
                  <Button type="button" onClick={addPosition} variant="secondary">Add position</Button>
                </div>
                {positions.map((pos, idx) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                    <div className="md:col-span-7 space-y-2">
                      <Label htmlFor={`title-${idx}`}>Title</Label>
                      <Input id={`title-${idx}`} value={pos.title} onChange={(e) => updatePosition(idx, { title: e.target.value })} placeholder="e.g., Waiter" required />
                    </div>
                    <div className="md:col-span-3 space-y-2">
                      <Label htmlFor={`qty-${idx}`}>Quantity</Label>
                      <Input id={`qty-${idx}`} type="number" min={1} value={pos.quantity} onChange={(e) => updatePosition(idx, { quantity: Number(e.target.value) || 1 })} />
                    </div>
                    <div className="md:col-span-2">
                      <Button type="button" variant="destructive" className="w-full" onClick={() => removePosition(idx)} disabled={positions.length === 1}>Remove</Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <Button type="submit" className="w-full md:w-auto">Create event</Button>
              </div>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Your events</CardTitle>
          </CardHeader>
          <CardContent>
            {myEvents.length === 0 ? (
              <p className="text-muted-foreground">No events yet.</p>
            ) : (
              <div className="space-y-2">
                {myEvents.map((e) => (
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

export default OrganiserDashboard;


