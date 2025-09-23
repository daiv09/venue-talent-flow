import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
import {
  UserCheck,
  Lock,
  Building2,
  Users,
  Crown,
  Loader2,
} from "lucide-react";
import img from "@/assets/login-hero.png";

type UserRole = "vendor" | "company" | "organiser";

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const initialRole =
    (location.state as { role?: UserRole } | undefined)?.role ?? null;
  const [role, setRole] = useState<UserRole | null>(initialRole);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);

    if (error || !data.session) {
      toast({
        title: "Login failed",
        description: error?.message ?? "Unknown error",
        variant: "destructive",
      });
      return;
    }

    const userRole = (data.user?.user_metadata as { role?: UserRole })?.role;

    if (!userRole) {
      toast({
        title: "Missing Role",
        description:
          "Please contact support. No role assigned to your account.",
        variant: "destructive",
      });
      return;
    }

    if (role && userRole !== role) {
      await supabase.auth.signOut();
      toast({
        title: "Role mismatch",
        description: `This account is registered as "${userRole}".`,
        variant: "destructive",
      });
      return;
    }

    toast({ title: `Welcome back, ${userRole}!` });

    switch (userRole) {
      case "vendor":
        navigate("/vendor");
        break;
      case "company":
        navigate("/company");
        break;
      case "organiser":
        navigate("/organiser");
        break;
      default:
        navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-stretch bg-gradient-to-br from-blue-50 to-purple-100 px-0 md:px-8 py-12">
      {/* Left Side Animation/Image */}
      <div className="flex-1 flex items-center justify-center md:rounded-l-3xl">
        {/* Replace below with your real illustration, SVG, or animation */}
        <img
          src={img}
          alt="Login illustration"
          className="
    w-[500px] md:w-[700px] max-w-full
    drop-shadow-2xl animate-float
    transition-transform duration-300
    hover:scale-110
    cursor-pointer
  "
          style={{ minHeight: 500 }}
        />

        {/* Example: <Lottie animationData={animationJSON} loop={true} /> if using lottie-react */}
      </div>

      {/* Right Side Login Box */}
      <div className="flex-1 flex items-center justify-center">
        <Card className="w-full max-w-md bg-white/80 shadow-xl border-0 backdrop-blur">
          <CardHeader>
            <div className="flex flex-col items-center gap-2 mb-4">
              <UserCheck className="w-10 h-10 text-indigo-500" />
              <CardTitle className="text-2xl font-bold text-indigo-700">
                Log in
              </CardTitle>
              <CardDescription className="text-muted-foreground text-center">
                Access your account
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="font-bold flex items-center gap-2"
                >
                  <Users className="w-4 h-4 text-indigo-400" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="ring-1 ring-indigo-100 font-medium"
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="font-bold flex items-center gap-2"
                >
                  <Lock className="w-4 h-4 text-indigo-400" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="********"
                  className="ring-1 ring-indigo-100 font-medium"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-bold">
                  Role{" "}
                  <span className="font-normal text-muted-foreground">
                    (optional)
                  </span>
                </Label>
                <RadioGroup
                  value={role ?? undefined}
                  onValueChange={(v) => setRole(v as UserRole)}
                  className="grid grid-cols-3 gap-2 mt-1"
                >
                  <div className="flex items-center space-x-2 bg-blue-50/60 px-2 py-1 rounded-lg">
                    <RadioGroupItem value="vendor" id="vendor" />
                    <Label
                      htmlFor="vendor"
                      className="cursor-pointer flex items-center gap-1"
                    >
                      <Users className="w-4 h-4 text-indigo-400" />{" "}
                      <span>Vendor</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 bg-purple-50/60 px-2 py-1 rounded-lg">
                    <RadioGroupItem value="company" id="company" />
                    <Label
                      htmlFor="company"
                      className="cursor-pointer flex items-center gap-1"
                    >
                      <Building2 className="w-4 h-4 text-purple-400" />{" "}
                      <span>Company</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 bg-yellow-50/60 px-2 py-1 rounded-lg">
                    <RadioGroupItem value="organiser" id="organiser" />
                    <Label
                      htmlFor="organiser"
                      className="cursor-pointer flex items-center gap-1"
                    >
                      <Crown className="w-4 h-4 text-yellow-400" />{" "}
                      <span>Organiser</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg text-lg transition-all duration-150"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" /> Signing in...
                  </span>
                ) : (
                  "Sign in"
                )}
              </Button>
              <div className="text-center pt-2">
                <span className="text-muted-foreground text-sm">
                  Forgot password?{" "}
                  <a href="/reset" className="underline text-indigo-600">
                    Reset
                  </a>
                </span>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
