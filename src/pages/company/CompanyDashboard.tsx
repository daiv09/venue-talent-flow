import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
// import { DashboardHeader } from "@/components/DashboardHeader";
// import { EventCard } from "@/components/EventCard";
// import { EditEventDialog } from "@/components/EditEventDialog";
// import { AddEventDialog } from "@/components/AddEventDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Trash } from "lucide-react";

const DashboardHeader = ({ onAddEvent }) => (
  <div className="flex items-center justify-between mb-8">
    <h1 className="text-3xl font-bold">Company Dashboard</h1>
    <Button onClick={onAddEvent}>Add Event</Button>
  </div>
);

const AddEventDialog = ({ open, onSave, onClose }) => {
  const [form, setForm] = useState({ name: "", event_date: "", location: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleAdd = async () => {
    if (!form.name || !form.event_date || !form.location) {
      setError("All fields are required.");
      return;
    }
    setError("");
    setLoading(true);
    await onSave(form);
    setLoading(false);
    setForm({ name: "", event_date: "", location: "" }); // Reset form
    onClose(); // Close dialog after adding
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogHeader>
        <h3 className="text-xl font-bold text-primary">Add New Event</h3>
        <p className="text-muted-foreground text-sm mt-1">
          Fill in the details below to create a new event.
        </p>
      </DialogHeader>
      <DialogContent className="bg-muted rounded-lg space-y-4">
        <div className="space-y-2">
          <Input
            name="name"
            placeholder="Event Name"
            value={form.name}
            onChange={handleChange}
            className="bg-background"
            disabled={loading}
          />
          <Input
            name="event_date"
            type="date"
            value={form.event_date}
            onChange={handleChange}
            className="bg-background"
            disabled={loading}
          />
          <Input
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            className="bg-background"
            disabled={loading}
          />
        </div>
        {error && (
          <div className="text-destructive text-sm font-medium">{error}</div>
        )}
      </DialogContent>
      <DialogFooter className="flex gap-2">
        <Button
          onClick={handleAdd}
          className="bg-primary text-white hover:bg-primary/90"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Event"}
        </Button>
        <Button
          variant="outline"
          onClick={onClose}
          className="border-muted-foreground text-muted-foreground"
          disabled={loading}
        >
          Cancel
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

// components/EventCard.tsx
const EventCard = ({ event, onEdit, onDelete }) => (
  <Card className="flex items-center justify-between border p-4 mb-2 shadow-lg">
    <CardContent className="flex-1">
      <div className="font-semibold text-lg">{event.name}</div>
      <div className="text-sm text-muted-foreground mt-1">
        {new Date(event.event_date).toLocaleDateString()} • {event.location}
      </div>
    </CardContent>
    <div className="flex space-x-2">
      <Button size="sm" variant="outline" onClick={() => onEdit(event)}>
        <Pencil size={16} />
      </Button>
      <Button
        size="sm"
        variant="destructive"
        onClick={() => onDelete(event.id)}
      >
        <Trash size={16} />
      </Button>
    </div>
  </Card>
);

// components/EditEventDialog.tsx
const EditEventDialog = ({ open, event, onSave, onClose }) => {
  const [form, setForm] = useState(
    event ?? { name: "", event_date: "", location: "" }
  );
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(event ?? { name: "", event_date: "", location: "" });
    setError("");
  }, [event]);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSave = () => {
    if (!form.name || !form.event_date || !form.location) {
      setError("All fields are required.");
      return;
    }
    setError("");
    onSave(form);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogHeader>
        <h3 className="text-xl font-bold text-primary">Edit Event</h3>
        <p className="text-muted-foreground text-sm mt-1">
          Update the event details below.
        </p>
      </DialogHeader>
      <DialogContent className="bg-muted rounded-lg space-y-4">
        <div className="space-y-2">
          <Input
            name="name"
            placeholder="Event Name"
            value={form.name}
            onChange={handleChange}
            className="bg-background"
          />
          <Input
            name="event_date"
            type="date"
            value={form.event_date?.slice(0, 10)}
            onChange={handleChange}
            className="bg-background"
          />
          <Input
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            className="bg-background"
          />
        </div>
        {error && (
          <div className="text-destructive text-sm font-medium">{error}</div>
        )}
      </DialogContent>
      <DialogFooter className="flex gap-2">
        <Button
          onClick={handleSave}
          className="bg-primary text-white hover:bg-primary/90"
        >
          Save Changes
        </Button>
        <Button
          variant="outline"
          onClick={onClose}
          className="border-muted-foreground text-muted-foreground"
        >
          Cancel
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

// pages/CompanyDashboard.tsx

const CompanyDashboard = () => {
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [adding, setAdding] = useState(false);

  const loadEvents = async () => {
    const { data } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: true });
    setEvents(data ?? []);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleSaveEdit = async (event) => {
    await supabase.from("events").update(event).eq("id", event.id);
    setEditingEvent(null);
    loadEvents();
  };

  const handleDelete = async (id) => {
    await supabase.from("events").delete().eq("id", id);
    loadEvents();
  };

  const handleAdd = async (event) => {
    await supabase.from("events").insert([event]);
    setAdding(false);
    loadEvents();
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <DashboardHeader onAddEvent={() => setAdding(true)} />

        {/* Upcoming Events */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
          {events.length === 0 ? (
            <p className="text-muted-foreground">No events yet.</p>
          ) : (
            events.map((e) => (
              <EventCard
                key={e.id}
                event={e}
                onEdit={setEditingEvent}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>

        {/* Modals */}
        <EditEventDialog
          open={!!editingEvent}
          event={editingEvent}
          onSave={handleSaveEdit}
          onClose={() => setEditingEvent(null)}
        />
        <AddEventDialog
          open={adding}
          onSave={handleAdd}
          onClose={() => setAdding(false)}
        />
      </div>
    </div>
  );
};

export default CompanyDashboard;
