import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, LogIn, ArrowRight, AlertCircle, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useAuth from "@/hooks/useAuth";
import { ROUTES } from "@/utils/constants";
import { toast } from "sonner";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const { login, isLoggingIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || ROUTES.DASHBOARD;

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await login(formData).unwrap();
      toast.success("Logged in successfully!");
      navigate(from, { replace: true });
    } catch (err) {
      const message =
        err?.data?.message || "Login failed. Please try again.";
      toast.error(message);

      if (err?.data?.errors?.length) {
        const apiErrors = {};
        err.data.errors.forEach((e) => {
          apiErrors[e.field] = e.message;
        });
        setErrors(apiErrors);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-gradient-to-br from-teal-950 via-teal-900 to-background font-sans relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-teal-500/20 blur-[120px]" />
        <div className="absolute -right-40 -bottom-40 h-[500px] w-[500px] rounded-full bg-emerald-500/20 blur-[120px]" />
      </div>

      <Link to={ROUTES.HOME} className="flex items-center gap-3 mb-8 group z-10 hover:scale-105 transition-transform">
        <div className="h-12 w-12 rounded-2xl bg-linear-to-br from-teal-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-500/30">
          <Stethoscope className="h-6 w-6 text-white" />
        </div>
        <div className="flex flex-col leading-none text-white">
          <span className="text-2xl font-black tracking-tight font-heading">NexusCare AI</span>
          <span className="text-[11px] text-teal-300 font-bold tracking-[0.2em] uppercase mt-1">Health Platform</span>
        </div>
      </Link>

      <Card className="w-full max-w-md shadow-2xl shadow-black/40 border-border/50 bg-background/80 backdrop-blur-xl z-10 rounded-3xl overflow-hidden">
        {/* Header */}
        <CardHeader className="space-y-3 text-center bg-gradient-to-b from-teal-500/10 to-transparent pb-6 pt-8">
          <CardTitle className="text-2xl font-black font-heading tracking-tight text-foreground">Secure Portal Login</CardTitle>
          <CardDescription className="text-base text-muted-foreground font-medium">
            Enter your credentials to access your dashboard
          </CardDescription>
        </CardHeader>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pt-2">
            {/* Email Field */}
            <div className="space-y-3">
              <Label htmlFor="email" className="text-sm font-bold text-foreground">
                Work Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="doctor@clinic.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                className={`h-12 rounded-xl transition-colors bg-muted/50 focus-visible:bg-background ${
                  errors.email
                    ? "border-rose-500 focus-visible:ring-rose-500"
                    : "focus-visible:ring-teal-500"
                }`}
              />
              {errors.email && (
                <p className="text-xs font-medium text-rose-500 flex items-center gap-1.5 mt-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-bold text-foreground">
                  Password
                </Label>
                <Link
                  to="#"
                  className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  className={`h-12 pr-12 rounded-xl transition-colors bg-muted/50 focus-visible:bg-background ${
                    errors.password
                      ? "border-rose-500 focus-visible:ring-rose-500"
                      : "focus-visible:ring-teal-500"
                  }`}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs font-medium text-rose-500 flex items-center gap-1.5 mt-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.password}
                </p>
              )}
            </div>
          </CardContent>

          {/* Footer */}
          <CardFooter className="flex flex-col space-y-6 pt-2 pb-8 px-6">
            <Button
              type="submit"
              className="w-full h-14 rounded-xl text-base font-bold gap-2 bg-linear-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 border-0 shadow-xl shadow-teal-500/20 transition-all hover:scale-[1.02]"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Authenticating...
                </>
              ) : (
                <>
                  Access Portal
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </Button>

            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/60" />
              </div>
              <div className="relative flex justify-center text-[10px] font-bold tracking-widest uppercase">
                <span className="bg-background px-3 text-muted-foreground">
                  New to NexusCare AI?
                </span>
              </div>
            </div>

            <p className="text-sm font-medium text-muted-foreground text-center">
              Don't have an administrator account?{" "}
              <Link
                to={ROUTES.REGISTER}
                className="font-bold text-teal-600 dark:text-teal-400 hover:text-teal-500 transition-colors"
              >
                Register clinic
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;