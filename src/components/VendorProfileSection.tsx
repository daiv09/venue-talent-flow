import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type VendorProfile = {
  id: string;
  name: string;
  contact: string | null;
  business_type: string | null;
  bio: string | null;
  verified: boolean;
};

const VendorProfileSection = () => {
  const { toast } = useToast();
  const [profile, setProfile] = useState<VendorProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  const loadProfile = async () => {
    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    const vendorId = userData.user?.id;
    if (!vendorId) return;

    const { data, error } = await supabase
      .from("vendor_profiles")
      .select("*")
      .eq("id", vendorId)
      .single();

    if (error && error.code !== "PGRST116") {
      toast({
        title: "Failed to load profile",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setProfile(data ?? null);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: userData } = await supabase.auth.getUser();
    const vendorId = userData.user?.id;
    if (!vendorId) return;

    const upsertData = {
      id: vendorId,
      name: profile?.name ?? "",
      contact: profile?.contact ?? "",
      business_type: profile?.business_type ?? "",
      bio: profile?.bio ?? "",
    };

    const { error } = await supabase.from("vendor_profiles").upsert(upsertData);
    if (error) {
      toast({
        title: "Save failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "Profile saved" });
      setEditing(false);
      loadProfile();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Profile</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : !profile && !editing ? (
          <>
            <p className="text-muted-foreground">
              No profile yet. Please create one.
            </p>
            <Button onClick={() => setEditing(true)}>Create Profile</Button>
          </>
        ) : editing ? (
          <form onSubmit={saveProfile} className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Contact</Label>
              <Input
                value={profile.contact ?? ""}
                onChange={(e) =>
                  setProfile({ ...profile, contact: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Business Type</Label>
              <Input
                value={profile.business_type ?? ""}
                onChange={(e) =>
                  setProfile({ ...profile, business_type: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea
                value={profile.bio ?? ""}
                onChange={(e) =>
                  setProfile({ ...profile, bio: e.target.value })
                }
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit">Save</Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-2">
            <p>
              <strong>Name:</strong> {profile.name}
            </p>
            <p>
              <strong>Contact:</strong> {profile.contact || "—"}
            </p>
            <p>
              <strong>Business:</strong> {profile.business_type || "—"}
            </p>
            <p>
              <strong>Bio:</strong> {profile.bio || "—"}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {profile.verified ? (
                <span className="text-green-600">Verified ✅</span>
              ) : (
                <span className="text-yellow-600">Pending Verification</span>
              )}
            </p>
            <Button onClick={() => setEditing(true)}>Edit Profile</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VendorProfileSection;
