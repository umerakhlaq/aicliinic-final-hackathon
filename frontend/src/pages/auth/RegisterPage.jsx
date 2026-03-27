import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, UserPlus, ArrowRight, AlertCircle, Check, X, Stethoscope } from "lucide-react";
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

const PasswordRequirement = ({ met, text }) => (
  <div className="flex items-center gap-2 text-[11px] font-medium">
    {met ? (
      <Check className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
    ) : (
      <X className="h-3.5 w-3.5 text-rose-400 flex-shrink-0" />
    )}
    <span className={met ? "text-muted-foreground" : "text-muted-foreground/80"}>
      {text}
    </span>
  </div>
);

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const { register, isRegistering } = useAuth();
  const navigate = useNavigate();

  // Password validation checks
  const passwordChecks = {
    minLength: formData.password.length >= 8,
    hasUpper: /[A-Z]/.test(formData.password),
    hasLower: /[a-z]/.test(formData.password),
    hasNumber: /\d/.test(formData.password),
    hasSpecial: /[@$!%*?&#]/.test(formData.password),
  };

  const isPasswordValid = Object.values(passwordChecks).every((check) => check);
  const passwordsMatch = formData.password && formData.password === formData.confirmPassword;

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!isPasswordValid) {
      newErrors.password = "Password does not meet requirements";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (!passwordsMatch) {
      newErrors.confirmPassword = "Passwords do not match";
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
      const { confirmPassword, ...registerData } = formData;
      await register(registerData).unwrap();
      toast.success("Account created successfully!");
      navigate(ROUTES.HOME, { replace: true });
    } catch (err) {
      const message =
        err?.data?.message || "Registration failed. Please try again.";
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

      <Card className="w-full max-w-lg shadow-2xl shadow-black/40 border-border/50 bg-background/80 backdrop-blur-xl z-10 rounded-3xl overflow-hidden">
        {/* Header */}
        <CardHeader className="space-y-3 text-center bg-gradient-to-b from-teal-500/10 to-transparent pb-6 pt-8">
          <CardTitle className="text-2xl font-black font-heading tracking-tight text-foreground">Clinic Registration</CardTitle>
          <CardDescription className="text-base text-muted-foreground font-medium">
            Setup your administrator account to onboard your facility
          </CardDescription>
        </CardHeader>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5 pt-2">
            <div className="grid md:grid-cols-2 gap-5">
              {/* Name Field */}
              <div className="space-y-3">
                <Label htmlFor="name" className="text-sm font-bold text-foreground">
                  Administrator Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="name"
                  className={`h-11 rounded-xl transition-colors bg-muted/50 focus-visible:bg-background ${
                    errors.name
                      ? "border-rose-500 focus-visible:ring-rose-500"
                      : "focus-visible:ring-teal-500"
                  }`}
                />
                {errors.name && (
                  <p className="text-[11px] font-medium text-rose-500 flex items-center gap-1.5 mt-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-3">
                <Label htmlFor="email" className="text-sm font-bold text-foreground">
                  Work Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@clinic.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  className={`h-11 rounded-xl transition-colors bg-muted/50 focus-visible:bg-background ${
                    errors.email
                      ? "border-rose-500 focus-visible:ring-rose-500"
                      : "focus-visible:ring-teal-500"
                  }`}
                />
                {errors.email && (
                  <p className="text-[11px] font-medium text-rose-500 flex items-center gap-1.5 mt-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-3">
              <Label htmlFor="password" className="text-sm font-bold text-foreground">
                Secure Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  className={`h-11 pr-10 rounded-xl transition-colors bg-muted/50 focus-visible:bg-background ${
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
              
              {/* Password Requirements */}
              {formData.password && (
                <div className="rounded-xl border border-border/50 bg-muted/30 p-4 space-y-2.5 mt-2">
                  <p className="text-[11px] font-bold text-foreground tracking-wide uppercase">Password strength requirements:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <PasswordRequirement met={passwordChecks.minLength} text="8+ chars" />
                    <PasswordRequirement met={passwordChecks.hasUpper} text="Uppercase" />
                    <PasswordRequirement met={passwordChecks.hasLower} text="Lowercase" />
                    <PasswordRequirement met={passwordChecks.hasNumber} text="Number" />
                    <PasswordRequirement met={passwordChecks.hasSpecial} text="Symbol (@$!%*?&#)" />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-3">
              <Label htmlFor="confirmPassword" className="text-sm font-bold text-foreground">
                Confirm Secure Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  className={`h-11 pr-10 rounded-xl transition-colors bg-muted/50 focus-visible:bg-background ${
                    errors.confirmPassword
                      ? "border-rose-500 focus-visible:ring-rose-500"
                      : passwordsMatch && formData.confirmPassword
                      ? "border-emerald-500 focus-visible:ring-emerald-500"
                      : "focus-visible:ring-teal-500"
                  }`}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors hover:text-foreground"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-[11px] font-medium text-rose-500 flex items-center gap-1.5 mt-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.confirmPassword}
                </p>
              )}
              {passwordsMatch && formData.confirmPassword && (
                <p className="text-[11px] font-bold text-emerald-600 flex items-center gap-1.5 mt-1">
                  <Check className="h-3.5 w-3.5" />
                  Passwords successfully match
                </p>
              )}
            </div>
          </CardContent>

          {/* Footer */}
          <CardFooter className="flex flex-col space-y-6 pt-4 pb-8 px-6">
            <Button
              type="submit"
              className="w-full h-14 rounded-xl text-base font-bold gap-2 bg-linear-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 border-0 shadow-xl shadow-teal-500/20 transition-all hover:scale-[1.02]"
              disabled={isRegistering}
            >
              {isRegistering ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Initializing Account...
                </>
              ) : (
                <>
                  Register Clinic
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
                  Already Onboarded?
                </span>
              </div>
            </div>

            <p className="text-sm font-medium text-muted-foreground text-center">
              Have an account established?{" "}
              <Link
                to={ROUTES.LOGIN}
                className="font-bold text-teal-600 dark:text-teal-400 hover:text-teal-500 transition-colors"
              >
                Sign in to Portal
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default RegisterPage;