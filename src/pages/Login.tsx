import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";

type UserRole = "vendor" | "company" | "organiser";

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setIsLoading(false);
    if (error || !data.session) {
      toast({ title: "Login failed", description: error?.message ?? "Unknown error", variant: "destructive" });
      return;
    }

    const userRole = (data.user?.user_metadata as { role?: UserRole } | undefined)?.role ?? null;
    if (role && userRole && role !== userRole) {
      await supabase.auth.signOut();
      toast({ title: "Role mismatch", description: `Account is registered as ${userRole}.`, variant: "destructive" });
      return;
    }

    toast({ title: "Welcome back!" });
    const path = userRole === "vendor" ? "/vendor" : userRole === "company" ? "/company" : userRole === "organiser" ? "/organiser" : "/";
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Log in</CardTitle>
          <CardDescription>Access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Role (optional)</Label>
              <RadioGroup value={role ?? undefined} onValueChange={(v) => setRole(v as UserRole)} className="grid grid-cols-3 gap-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="vendor" id="vendor" />
                  <Label htmlFor="vendor" className="cursor-pointer">Vendor</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="company" id="company" />
                  <Label htmlFor="company" className="cursor-pointer">Company</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="organiser" id="organiser" />
                  <Label htmlFor="organiser" className="cursor-pointer">Organiser</Label>
                </div>
              </RadioGroup>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;



