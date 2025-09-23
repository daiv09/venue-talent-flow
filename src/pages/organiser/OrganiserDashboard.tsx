import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Users2,
  CalendarDays,
  Plus,
  MapPin,
  ClipboardList,
} from "lucide-react"; // example icon set

type Position = { title: string; quantity: number };

const OrganiserDashboard = () => {
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [positions, setPositions] = useState<Position[]>([
    { title: "", quantity: 1 },
  ]);

  const addPosition = () =>
    setPositions((p) => [...p, { title: "", quantity: 1 }]);
  const removePosition = (idx: number) =>
    setPositions((p) => p.filter((_, i) => i !== idx));
  const updatePosition = (idx: number, patch: Partial<Position>) =>
    setPositions((p) =>
      p.map((pos, i) => (i === idx ? { ...pos, ...patch } : pos))
    );

  const { toast } = useToast();
  const [myEvents, setMyEvents] = useState<
    Array<{ id: string; name: string; event_date: string; location: string }>
  >([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("events")
        .select("id,name,event_date,location")
        .order("event_date", { ascending: true });
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
      .insert({
        organiser_id: organiserId ?? null,
        name: eventName,
        event_date: eventDate,
        location,
        notes,
      })
      .select("id")
      .single();
    if (eventError || !inserted) {
      toast({
        title: "Failed to create event",
        description: eventError?.message,
        variant: "destructive",
      });
      return;
    }
    const rows = positions
      .filter((p) => p.title.trim())
      .map((p) => ({
        event_id: inserted.id,
        title: p.title.trim(),
        quantity: p.quantity,
      }));
    if (rows.length) {
      const { error: posError } = await supabase
        .from("event_positions")
        .insert(rows);
      if (posError) {
        toast({
          title: "Event created, but positions failed",
          description: posError.message,
          variant: "destructive",
        });
      }
    }
    toast({ title: "Event created" });
    setEventName("");
    setEventDate("");
    setLocation("");
    setNotes("");
    setPositions([{ title: "", quantity: 1 }]);
    const { data } = await supabase
      .from("events")
      .select("id,name,event_date,location")
      .order("event_date", { ascending: true });
    setMyEvents(data ?? []);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center gap-3 pb-2">
          <CalendarDays className="w-8 h-8 text-indigo-400" />
          <h1 className="text-4xl font-extrabold text-indigo-700 tracking-tight">
            Organiser Dashboard
          </h1>
        </div>

        {/* Create Event Card */}
        <Card className="bg-white/60 shadow-md border-0">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ClipboardList className="text-teal-400 w-6 h-6" />
              <CardTitle className="text-teal-600">Create an Event</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={onCreateEvent} className="space-y-6">
              {/* Grid with some visual separation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="eventName" className="font-bold">
                    Event name
                  </Label>
                  <Input
                    id="eventName"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    required
                    className="ring-1 ring-indigo-100"
                    placeholder="e.g., Gala Night"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eventDate" className="font-bold">
                    Date
                  </Label>
                  <Input
                    id="eventDate"
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    required
                    className="ring-1 ring-indigo-100"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="font-bold">
                  Location
                </Label>
                <div className="flex items-center gap-2">
                  <MapPin className="text-rose-400 w-5 h-5" />
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="font-bold">
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special requirements"
                  className="min-h-[80px]"
                />
              </div>

              <Separator className="mt-6" />
              <div className="space-y-3 pt-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Users2 className="text-indigo-400 w-5 h-5" /> Positions to
                    Hire
                  </h2>
                  <Button
                    type="button"
                    onClick={addPosition}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Add Position
                  </Button>
                </div>
                {positions.map((pos, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end bg-gray-50 rounded-lg p-4"
                  >
                    <div className="md:col-span-7 space-y-2">
                      <Label htmlFor={`title-${idx}`}>Title</Label>
                      <Input
                        id={`title-${idx}`}
                        value={pos.title}
                        onChange={(e) =>
                          updatePosition(idx, { title: e.target.value })
                        }
                        placeholder="e.g., Waiter"
                        required
                      />
                    </div>
                    <div className="md:col-span-3 space-y-2">
                      <Label htmlFor={`qty-${idx}`}>Quantity</Label>
                      <Input
                        id={`qty-${idx}`}
                        type="number"
                        min={1}
                        value={pos.quantity}
                        onChange={(e) =>
                          updatePosition(idx, {
                            quantity: Number(e.target.value) || 1,
                          })
                        }
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Button
                        type="button"
                        variant="destructive"
                        className="w-full"
                        onClick={() => removePosition(idx)}
                        disabled={positions.length === 1}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex justify-end">
                <Button
                  type="submit"
                  className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg transition-all duration-150"
                >
                  Create Event
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Display User Events */}
        <Card className="bg-white/60 shadow-md border-0">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CalendarDays className="text-indigo-400 w-6 h-6" />
              <CardTitle className="text-indigo-600">Your Events</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {myEvents.length === 0 ? (
              <p className="text-muted-foreground italic">No events yet.</p>
            ) : (
              <div className="space-y-4">
                {myEvents.map((e) => (
                  <div
                    key={e.id}
                    className="flex items-center justify-between border border-indigo-100 shadow rounded-lg bg-gradient-to-r from-indigo-50/80 to-white p-4 hover:ring-2 hover:ring-indigo-200 transition-all"
                  >
                    <div>
                      <div className="font-semibold text-lg text-indigo-900">
                        {e.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(e.event_date).toLocaleDateString()} &mdash;{" "}
                        {e.location}
                      </div>
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
