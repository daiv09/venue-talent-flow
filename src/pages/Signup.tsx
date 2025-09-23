import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "react-router-dom";
import img from "@/assets/login-hero.png";

type UserRole = "vendor" | "company" | "organiser";

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Autofill the role if navigating with state
  const initialRole =
    (location.state as { role?: UserRole } | undefined)?.role ?? null;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<UserRole | null>(initialRole); // <--- change here
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!role) {
      toast({ title: "Please select a role", variant: "destructive" });
      return;
    }
    if (password.length < 5) {
      toast({
        title: "Password too short",
        description: "Use at least 8 characters",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // 1. Sign up user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role, fullName } },
    });

    if (error) {
      setIsLoading(false);
      toast({
        title: "Signup failed",
        description: error.message.includes("User already registered")
          ? "This email is already in use. Try logging in."
          : error.message,
        variant: "destructive",
      });
      return;
    }

    // 2. If signup was successful, create a vendor row if needed
    if (data.user) {
      // Always create a 'profiles' row for every user
      await supabase.from("profiles").insert({
        id: data.user.id,
        full_name: fullName,
        email: email,
        role: role,
      });

      // Insert into the correct table based on role
      if (role === "vendor") {
        await supabase.from("vendors").insert({
          id: data.user.id,
          full_name: fullName,
          email: email,
        });
      } else if (role === "company") {
        await supabase.from("companies").insert({
          id: data.user.id,
      company_name: fullName,        // If you have a separate field, use that
      company_type: null,            // Or pre-fill if you have type info
      headquarters: null   
        });
      } else if (role === "organiser") {
        await supabase.from("organisers").insert({
          id: data.user.id,
          organization_name: fullName, // Or use a separate org name field from your form
          organization_type: null, // Fill these if you collect in the form
          location: null,
        });
      }
    }

    setIsLoading(false);
    toast({
      title: "Signup successful",
      description:
        "Check your email to confirm your account before logging in.",
    });

    navigate("/"); // Go back to login page after signup
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-stretch bg-gradient-to-br from-blue-50 to-purple-100 px-0 md:px-8 py-12">
      {/* Left Side Signup Box */}
      <div className="flex-1 flex items-center justify-center md:rounded-l-3xl">
        <Card className="w-full max-w-md bg-white/80 shadow-xl border-0 backdrop-blur">
          <CardHeader>
            <CardTitle>Create an account</CardTitle>
            <CardDescription>
              Sign up as vendor, company, or organiser
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <RadioGroup
                  value={role ?? undefined}
                  onValueChange={(v) => setRole(v as UserRole)}
                  className="grid grid-cols-3 gap-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="vendor" id="vendor" />
                    <Label htmlFor="vendor" className="cursor-pointer">
                      Vendor
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="company" id="company" />
                    <Label htmlFor="company" className="cursor-pointer">
                      Company
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="organiser" id="organiser" />
                    <Label htmlFor="organiser" className="cursor-pointer">
                      Organiser
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create account"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      {/* Right Side Illustration/Image */}
      <div className="flex-1 flex items-center justify-center md:rounded-r-3xl">
        <img
          src={img}
          alt="Signup illustration"
          className="
        w-[700px] h-auto max-w-full
        drop-shadow-2xl
        transition-transform duration-300 ease-in-out
        hover:scale-110
        animate-float
        cursor-pointer
      "
          style={{ minHeight: 500 }}
        />
        {/* You can swap for Lottie or any <SVG> here */}
      </div>
    </div>
  );
};

export default Signup;
