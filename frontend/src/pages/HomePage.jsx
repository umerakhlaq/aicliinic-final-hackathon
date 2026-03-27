import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import { ROUTES } from "@/utils/constants";
import {
  Brain,
  Shield,
  CalendarDays,
  FileText,
  Users,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Stethoscope,
  Crown,
  Zap,
  Star,
  Activity,
  Lock,
  ChevronRight,
  Sparkles,
  HeartPulse,
  LineChart
} from "lucide-react";

/* ─── Data ─────────────────────────────────────── */
const features = [
  {
    icon: Brain,
    title: "AI Symptom Checker",
    desc: "Gemini-powered analysis returns risk levels, possible conditions, and recommended tests in seconds.",
    color: "teal",
    badge: "Free",
  },
  {
    icon: FileText,
    title: "Smart Prescriptions",
    desc: "Digital prescriptions with AI patient-friendly explanations in English and Urdu.",
    color: "emerald",
    badge: "Free",
  },
  {
    icon: CalendarDays,
    title: "Appointment Management",
    desc: "Conflict-free scheduling with role-based access for doctors and receptionists.",
    color: "violet",
    badge: "Free",
  },
  {
    icon: Users,
    title: "Patient Records",
    desc: "Complete medical history timeline with appointments, prescriptions, and diagnoses.",
    color: "amber",
    badge: "Free",
  },
  {
    icon: Shield,
    title: "AI Risk Flagging",
    desc: "Analyze patient history for risk patterns, red flags, and chronic condition monitoring.",
    color: "rose",
    badge: "Pro",
  },
  {
    icon: TrendingUp,
    title: "Advanced Analytics",
    desc: "Real-time clinic insights with revenue tracking, monthly charts, and diagnosis trends.",
    color: "indigo",
    badge: "Pro",
  },
];

const colorMap = {
  teal:   { bg: "bg-teal-500/10",   icon: "bg-teal-500",   text: "text-teal-600",   border: "border-teal-500/20",   glow: "shadow-teal-500/20" },
  emerald:{ bg: "bg-emerald-500/10",icon: "bg-emerald-500",text: "text-emerald-600",border: "border-emerald-500/20",glow: "shadow-emerald-500/20" },
  violet: { bg: "bg-violet-500/10", icon: "bg-violet-500", text: "text-violet-600", border: "border-violet-500/20", glow: "shadow-violet-500/20" },
  amber:  { bg: "bg-amber-500/10",  icon: "bg-amber-500",  text: "text-amber-600",  border: "border-amber-500/20",  glow: "shadow-amber-500/20" },
  rose:   { bg: "bg-rose-500/10",   icon: "bg-rose-500",   text: "text-rose-600",   border: "border-rose-500/20",   glow: "shadow-rose-500/20" },
  indigo: { bg: "bg-indigo-500/10", icon: "bg-indigo-500", text: "text-indigo-600", border: "border-indigo-500/20", glow: "shadow-indigo-500/20" },
};

const roles = [
  {
    icon: "🏥",
    title: "Admin",
    color: "teal",
    perks: ["Manage doctors & staff", "Full analytics access", "Subscription control", "System-wide oversight"],
  },
  {
    icon: "🩺",
    title: "Doctor",
    color: "emerald",
    perks: ["AI Symptom Checker", "Create prescriptions", "View own patients", "AI Risk Flagging (Pro)"],
  },
  {
    icon: "🗓️",
    title: "Receptionist",
    color: "violet",
    perks: ["Register patients", "Book appointments", "Daily schedule view", "Patient search"],
  },
  {
    icon: "👤",
    title: "Patient",
    color: "amber",
    perks: ["View own records", "My prescriptions", "AI Rx explanations", "Appointment history"],
  },
];

const stats = [
  { value: "4", label: "User Roles", icon: Users },
  { value: "3+", label: "AI Features", icon: Brain },
  { value: "EN+UR", label: "Languages", icon: Sparkles },
  { value: "99.9%", label: "Uptime SLA", icon: Activity },
];

const freePros = [
  "Patient registration & records",
  "Appointment booking & scheduling",
  "Digital prescription creation",
  "AI Symptom Checker",
  "AI Prescription Explanation",
  "Role-based access control",
];

const proExtras = [
  "AI Risk Flagging & Analysis",
  "Advanced predictive analytics",
  "Priority support",
  "Unlimited AI queries",
];

/* ─── Component ─────────────────────────────────── */
const HomePage = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="w-full overflow-x-hidden font-sans">

      {/* ── HERO ──────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center px-4 py-16 md:py-24 overflow-hidden">
        {/* Ambient premium background */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-teal-500/10 blur-[120px] animate-pulse-soft" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[100px] animate-pulse-soft" style={{animationDelay: '1s'}} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-indigo-500/5 blur-[120px]" />
          <div className="absolute top-0 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.8),transparent_80%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.05),transparent_80%)]" />
        </div>

        <div className="container mx-auto max-w-6xl w-full relative z-10 pt-10">
          <div className="flex flex-col items-center text-center gap-8">

            {/* Status pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-1.5 text-sm font-medium text-teal-700 dark:text-teal-400 backdrop-blur-md shadow-sm animate-float">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              NexusCare AI Platform
              <span className="h-px w-4 bg-teal-500/40" />
              <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" /> Powered by Gemini</span>
            </div>

            {/* Headline */}
            <div className="space-y-6 max-w-4xl">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.1] text-foreground">
                Intelligent Healthcare, <br className="hidden md:block"/>
                <span className="relative inline-block mt-2">
                  <span className="bg-linear-to-r from-teal-500 via-emerald-500 to-teal-400 bg-clip-text text-transparent">
                    Perfectly Managed.
                  </span>
                  <svg className="absolute w-full h-3 -bottom-2 left-0 text-emerald-400/30" viewBox="0 0 200 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.00032 6.54545C42.8576 -1.81816 138.858 -2.42422 198.858 6.54545" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto font-medium">
                Elevate your practice with NexusCare AI. Unite patient records, seamless scheduling, and AI-driven diagnostics in a single, intuitive platform tailored for modern clinics.
              </p>
            </div>

            {/* CTA */}
            {isAuthenticated ? (
              <div className="space-y-4 w-full max-w-sm mt-4">
                <div className="rounded-2xl border border-border/50 bg-background/60 backdrop-blur-xl px-6 py-5 shadow-lg shadow-black/5">
                  <p className="text-sm text-muted-foreground font-medium">Welcome back</p>
                  <p className="text-xl font-bold mt-1.5 flex items-center justify-center gap-2">
                    {user?.name}
                    {user?.subscriptionPlan === "pro" && (
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 font-bold border border-amber-500/20">
                        <Crown className="w-3 h-3" /> PRO
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize mt-1 tracking-wide">{user?.role} Portal</p>
                </div>
                <Button size="lg" className="w-full h-14 text-base font-semibold gap-2 bg-linear-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 border-0 shadow-xl shadow-teal-500/25 transition-all hover:scale-[1.02]" asChild>
                  <Link to={ROUTES.DASHBOARD}>
                    Access Dashboard <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mt-4">
                <Button size="lg" className="h-14 gap-2 px-8 text-base font-semibold bg-linear-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 border-0 shadow-xl shadow-teal-500/25 transition-all hover:scale-[1.02]" asChild>
                  <Link to={ROUTES.LOGIN}>
                    Get Started Free <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-14 gap-2 px-8 text-base font-semibold border-2 hover:bg-muted/50 transition-all hover:scale-[1.02]" asChild>
                  <Link to={ROUTES.REGISTER}>Book a Demo</Link>
                </Button>
              </div>
            )}

            {/* Trust line */}
            {!isAuthenticated && (
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-2 mt-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                No credit card required <span className="text-border mx-1">•</span> Setup in 2 minutes
              </p>
            )}

            {/* Stats strip - Premium Glassmorphism */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-3xl pt-10">
              {stats.map(({ value, label, icon: Icon }) => (
                <div key={label} className="relative overflow-hidden rounded-2xl border border-white/20 dark:border-white/10 bg-white/40 dark:bg-black/20 backdrop-blur-xl px-5 py-6 text-center shadow-lg shadow-black/5 hover:-translate-y-1 transition-transform duration-300">
                  <div className="absolute -right-4 -top-4 w-16 h-16 bg-teal-500/10 rounded-full blur-xl" />
                  <div className="flex justify-center mb-3">
                    <div className="w-10 h-10 rounded-full bg-teal-500/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-foreground font-heading">{value}</div>
                  <div className="text-sm font-medium text-muted-foreground mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────── */}
      <section id="features" className="px-4 py-24 md:py-32 relative">
        <div className="absolute inset-0 bg-muted/30 -z-10" />
        <div className="container mx-auto max-w-6xl w-full">
          <div className="text-center space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 text-sm font-bold text-teal-600 bg-teal-500/10 border border-teal-500/20 px-4 py-1.5 rounded-full uppercase tracking-wider">
              <HeartPulse className="w-4 h-4" />
              Core Capabilities
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight font-heading">Empower Your Health Practice</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
              Experience a suite of intelligently designed tools created to reduce administrative friction and enhance patient outcomes.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc, color, badge }) => {
              const c = colorMap[color];
              return (
                <div
                  key={title}
                  className={`group relative rounded-3xl border border-border/50 bg-background/50 backdrop-blur-sm hover:bg-background p-8 transition-all hover:shadow-xl ${c.glow} space-y-5 flex flex-col`}
                >
                  <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 rounded-bl-full opacity-50 pointer-events-none" />
                  
                  <div className="flex items-start justify-between relative z-10">
                    <div className={`h-14 w-14 rounded-2xl ${c.bg} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`h-6 w-6 ${c.text}`} />
                    </div>
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                      badge === "Pro"
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/20"
                        : "bg-background border border-border text-muted-foreground"
                    }`}>
                      {badge === "Pro" ? (
                        <span className="flex items-center gap-1"><Crown className="w-3 h-3" /> Pro</span>
                      ) : (
                        <span className="flex items-center gap-1"> Free</span>
                      )}
                    </span>
                  </div>
                  <div className="space-y-2 flex-grow relative z-10">
                    <h3 className="font-bold text-xl text-foreground tracking-tight">{title}</h3>
                    <p className="text-[15px] text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                  <div className={`mt-auto inline-flex items-center gap-1 font-semibold ${c.text} opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0`}>
                    Explore feature <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── ROLES ─────────────────────────────────── */}
      <section className="px-4 py-24 md:py-32 relative overflow-hidden">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal-500/5 rounded-full blur-[120px] -z-10" />
        
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 rounded-full uppercase tracking-wider">
              <Users className="w-4 h-4" />
              Unified Ecosystem
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight font-heading">A Workspace for Everyone</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              NexusCare AI delivers perfectly tailored interfaces and capabilities for every role in your healthcare facility.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map(({ icon, title, color, perks }) => {
              const c = colorMap[color];
              return (
                <div key={title} className={`rounded-3xl border border-border/50 bg-background/80 backdrop-blur-md p-8 space-y-6 hover:shadow-xl ${c.glow} transition-all hover:-translate-y-1`}>
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className={`h-16 w-16 rounded-2xl ${c.bg} flex items-center justify-center text-3xl shadow-inner`}>
                      {icon}
                    </div>
                    <h3 className={`text-xl font-black tracking-tight font-heading ${c.text}`}>{title}</h3>
                  </div>
                  <div className="h-px w-full bg-border/50" />
                  <ul className="space-y-3">
                    {perks.map((perk) => (
                      <li key={perk} className="flex items-start gap-3 text-[15px] font-medium text-muted-foreground">
                        <CheckCircle2 className={`h-5 w-5 mt-0.5 shrink-0 ${c.text}`} />
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className={`w-full mt-2 font-semibold ${c.text} border-border hover:${c.bg} hover:border-transparent transition-colors`} asChild>
                    <Link to={ROUTES.LOGIN}>Portal Access</Link>
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────── */}
      <section className="px-4 py-24 md:py-32 bg-teal-900 dark:bg-teal-950 text-teal-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />
        <div className="absolute right-[-10%] bottom-[-20%] w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white font-heading">Seamless Integration</h2>
            <p className="text-teal-200/80 max-w-2xl mx-auto text-lg">
              Transitioning your clinic to NexusCare AI is frictionless. Get fully operational in minutes.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Initialize Platform",
                desc: "Register your administrative account to establish your clinic's secure environment.",
                icon: Shield,
              },
              {
                step: "02",
                title: "Onboard Team",
                desc: "Invite medical staff and receptionists, assigning them explicit role-based access.",
                icon: Stethoscope,
              },
              {
                step: "03",
                title: "Transform Care",
                desc: "Begin leveraging AI diagnostics, seamless scheduling, and smart prescriptions immediately.",
                icon: Zap,
              },
            ].map(({ step, title, desc, icon: Icon }) => (
                <div key={step} className="relative rounded-3xl border border-teal-700 bg-teal-800/50 backdrop-blur-md p-8 space-y-6 hover:bg-teal-800/80 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="h-12 w-12 rounded-2xl bg-teal-400/20 flex items-center justify-center text-teal-300">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-5xl font-black text-teal-700/50 font-heading">{step}</span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-xl text-white">{title}</h3>
                    <p className="text-teal-200/70 font-medium leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────── */}
      <section id="pricing" className="px-4 py-24 md:py-32 relative">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full uppercase tracking-wider">
              <LineChart className="w-4 h-4" />
              Transparent Pricing
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight font-heading">Scale Intelligently</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Accessible core features for emerging clinics, with powerful AI capabilities for high-volume practices.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Tier */}
            <div className="rounded-3xl border border-border/60 bg-background/50 backdrop-blur-sm p-10 space-y-8 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-border text-foreground text-sm font-bold uppercase tracking-wider">
                  Foundation
                </div>
                <div>
                  <p className="text-5xl font-black tracking-tighter">$0<span className="text-lg font-bold text-muted-foreground tracking-normal block mt-1">Free Forever</span></p>
                </div>
                <p className="text-[15px] font-medium text-muted-foreground">The essential tools required to run a modern, digital-first clinic efficiently.</p>
              </div>

              <div className="h-px bg-border/50" />

              <ul className="space-y-4">
                {freePros.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[15px] font-medium text-foreground">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>

              <Button variant="outline" size="lg" className="w-full h-14 text-base font-bold border-2" asChild>
                <Link to={ROUTES.REGISTER}>Deploy Foundation</Link>
              </Button>
            </div>

            {/* Pro Tier */}
            <div className="relative rounded-3xl border-2 border-teal-500 bg-linear-to-b from-teal-500/10 to-transparent p-10 space-y-8 shadow-2xl shadow-teal-500/15">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-400 rounded-t-3xl" />
              <div className="absolute -top-4 right-8">
                <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg shadow-orange-500/30">
                  <Star className="w-3.5 h-3.5 fill-white" /> Recommended
                </span>
              </div>

              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-700 dark:text-teal-400 text-sm font-bold uppercase tracking-wider border border-teal-500/30">
                  <Crown className="w-4 h-4" /> Professional
                </div>
                <div>
                  <p className="text-5xl font-black tracking-tighter">$29<span className="text-lg font-bold text-muted-foreground tracking-normal block mt-1">per month / flat rate</span></p>
                </div>
                <p className="text-[15px] font-medium text-muted-foreground">Advanced AI analytics and risk flagging for high-volume, precision healthcare.</p>
              </div>

              <div className="h-px bg-teal-500/20" />

              <ul className="space-y-4">
                {[...freePros, ...proExtras].map((item, i) => (
                  <li key={item} className="flex items-start gap-3 text-[15px] font-medium text-foreground">
                    <CheckCircle2 className={`h-5 w-5 shrink-0 mt-0.5 ${i >= freePros.length ? "text-teal-500" : "text-emerald-500"}`} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <Button size="lg" className="w-full h-14 text-base font-bold bg-linear-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 shadow-xl shadow-teal-500/25 transition-all hover:scale-[1.02] border-0 text-white" asChild>
                <Link to={isAuthenticated ? ROUTES.SUBSCRIPTION : ROUTES.REGISTER}>
                  <Zap className="h-5 w-5 mr-2" />
                  Upgrade to Professional
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────── */}
      <section className="px-4 py-24 mb-10">
        <div className="container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-teal-950 p-10 md:p-20 text-center space-y-8 shadow-2xl">
            {/* Ambient glows inside CTA box */}
            <div className="absolute top-[-50%] left-[-10%] w-[500px] h-[500px] bg-teal-500/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-50%] right-[-10%] w-[400px] h-[400px] bg-emerald-500/20 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10 space-y-8 max-w-2xl mx-auto">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center mx-auto shadow-2xl shadow-teal-500/40 transform -rotate-6 hover:rotate-0 transition-transform duration-500">
                <Stethoscope className="w-10 h-10 text-white" />
              </div>

              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-black text-white font-heading tracking-tight">
                  Lead the Future of Care
                </h2>
                <p className="text-teal-100/80 text-lg md:text-xl font-medium leading-relaxed">
                  Join forward-thinking healthcare professionals utilizing NexusCare AI to optimize their practice and enhance patient satisfaction.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                {isAuthenticated ? (
                  <Button size="lg" className="h-14 gap-2 bg-white text-teal-950 hover:bg-teal-50 text-lg font-bold w-full sm:w-auto px-10 rounded-2xl shadow-xl transition-transform hover:scale-105" asChild>
                    <Link to={ROUTES.DASHBOARD}>
                      <Activity className="h-6 w-6" /> Access Portal
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button size="lg" className="h-14 gap-2 bg-white text-teal-950 hover:bg-teal-50 text-lg font-bold w-full sm:w-auto px-10 rounded-2xl shadow-xl transition-transform hover:scale-105" asChild>
                      <Link to={ROUTES.LOGIN}>
                        Get Started Free <ArrowRight className="h-6 w-6" />
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" className="h-14 gap-2 border-2 border-white/20 text-white hover:bg-white/10 text-lg font-bold w-full sm:w-auto px-10 rounded-2xl transition-transform hover:scale-105" asChild>
                      <Link to={ROUTES.REGISTER}>
                        <Lock className="h-5 w-5" /> Request Access
                      </Link>
                    </Button>
                  </>
                )}
              </div>
              <p className="text-teal-400/60 text-sm font-semibold tracking-wide uppercase">
                Zero Setup Fees • Cancel Anytime • Lifetime Free Tier
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;

