import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ROUTES } from "@/utils/constants";
import {
  CheckCircle2,
  ShieldAlert,
  Database,
  Lock,
  Zap,
  Users,
  BrainCircuit,
  HeartPulse,
  ArrowRight,
  Activity
} from "lucide-react";

const AboutPage = () => {
  const technologies = [
    { name: "Predictive Analytics", desc: "Machine learning insights" },
    { name: "Gemini AI", desc: "Next-gen diagnostic intelligence" },
    { name: "Cloud Infrastructure", desc: "High-availability servers" },
    { name: "Enterprise Security", desc: "HIPAA-compliant data handling" },
    { name: "Modern Architecture", desc: "Scalable microservices" },
    { name: "Real-time Sync", desc: "Instant data propagation" },
  ];

  const features = [
    {
      icon: Lock,
      title: "Bank-Grade Security",
      desc: "End-to-end encryption, strict role-based access, and continuous monitoring.",
    },
    {
      icon: Users,
      title: "Role-Based Ecosystem",
      desc: "Tailored portals for doctors, receptionists, administrators, and patients.",
    },
    {
      icon: Database,
      title: "Unified Records",
      desc: "A single source of truth for patient history, prescriptions, and lab results.",
    },
    {
      icon: Zap,
      title: "Frictionless UI",
      desc: "Lightning-fast performance designed to save practitioners valuable time.",
    },
    {
      icon: BrainCircuit,
      title: "AI Co-Pilot",
      desc: "Smart diagnostic suggestions and risk flagging powered by advanced AI.",
    },
    {
      icon: ShieldAlert,
      title: "Risk Management",
      desc: "Proactive identification of potential chronic conditions and medication conflicts.",
    },
  ];

  const values = [
    {
      title: "Patient-First Care",
      desc: "Every feature we build is designed to ultimately improve the patient experience.",
    },
    {
      title: "Clinical Accuracy",
      desc: "We prioritize precision and reliability in our AI tools and data management.",
    },
    {
      title: "Intuitive Design",
      desc: "Complex medical software shouldn't require a master's degree to operate.",
    },
    {
      title: "Continuous Innovation",
      desc: "We constantly evolve our platform to meet the demands of modern healthcare.",
    },
  ];

  return (
    <div className="w-full font-sans">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-950 via-teal-900 to-background px-4 py-20 md:py-32">
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
            <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-teal-500/20 blur-[100px]" />
            <div className="absolute -right-40 -bottom-40 h-96 w-96 rounded-full bg-emerald-500/20 blur-[100px]" />
          </div>

          <div className="space-y-8 text-center text-white">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-1.5 text-sm font-medium text-teal-300 backdrop-blur-md">
              <Activity className="h-4 w-4" />
              Our Mission
            </div>
            <h1 className="text-4xl md:text-6xl font-black font-heading tracking-tight">Revolutionizing <br/> Clinical Management</h1>
            <p className="text-xl text-teal-100/80 max-w-2xl mx-auto font-medium">
              NexusCare AI is a comprehensive, intelligently engineered platform built to liberate healthcare professionals from administrative friction.
            </p>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="px-4 py-20 md:py-32 bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-black font-heading tracking-tight">Platform Capabilities</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-medium">
              Everything your medical facility needs in one seamless interface.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="group relative overflow-hidden rounded-3xl border border-border/50 bg-background/60 backdrop-blur-md p-8 transition-all hover:border-teal-500/50 hover:shadow-xl hover:shadow-teal-500/10 hover:-translate-y-1"
              >
                <div className="space-y-5">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-500/10 group-hover:bg-teal-500/20 transition-colors shadow-inner">
                    <Icon className="h-7 w-7 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div className="space-y-2.5">
                    <h3 className="font-bold text-xl font-heading tracking-tight">{title}</h3>
                    <p className="text-[15px] text-muted-foreground leading-relaxed font-medium">
                      {desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="px-4 py-20 md:py-32">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-black font-heading tracking-tight">The Innovation Engine</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-medium">
              Powered by advanced computational models and resilient infrastructure.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {technologies.map(({ name, desc }) => (
              <div
                key={name}
                className="rounded-2xl border border-border/50 bg-muted/10 p-5 flex items-start gap-4 hover:border-teal-500/40 hover:bg-teal-500/5 transition-colors group"
              >
                <CheckCircle2 className="h-6 w-6 text-emerald-500 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <div className="min-w-0 space-y-1">
                  <p className="font-bold text-base tracking-tight">{name}</p>
                  <p className="text-sm text-muted-foreground font-medium">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="px-4 py-20 md:py-32 bg-teal-950 text-teal-50 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_center,rgba(20,184,166,0.15),transparent_70%)] pointer-events-none" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-black font-heading tracking-tight text-white">Our Clinical Values</h2>
            <p className="text-teal-200/80 text-lg max-w-2xl mx-auto font-medium">
              The foundational principles guiding our continuous development.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {values.map(({ title, desc }) => (
              <div key={title} className="space-y-4 bg-teal-900/40 border border-teal-800 p-8 rounded-3xl backdrop-blur-sm">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/20 text-teal-300">
                  <HeartPulse className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold text-white font-heading">{title}</h3>
                <p className="text-teal-100/70 leading-relaxed text-[15px] font-medium">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Statistics */}
      <section className="px-4 py-20 md:py-32 bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-border/50">
            <div className="space-y-2">
              <p className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-teal-500 to-emerald-500 font-heading">99%</p>
              <p className="text-muted-foreground font-bold tracking-wider uppercase text-sm">Satisfaction</p>
            </div>
            <div className="space-y-2">
              <p className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-teal-500 to-emerald-500 font-heading">24/7</p>
              <p className="text-muted-foreground font-bold tracking-wider uppercase text-sm">Reliability</p>
            </div>
            <div className="space-y-2">
              <p className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-teal-500 to-emerald-500 font-heading">10x</p>
              <p className="text-muted-foreground font-bold tracking-wider uppercase text-sm">Efficiency</p>
            </div>
            <div className="space-y-2">
              <p className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-teal-500 to-emerald-500 font-heading">AI</p>
              <p className="text-muted-foreground font-bold tracking-wider uppercase text-sm">Native</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 md:py-32 mb-10">
        <div className="container mx-auto max-w-4xl">
          <div className="rounded-[2.5rem] bg-gradient-to-r from-teal-600 to-emerald-600 p-10 md:p-16 text-center space-y-8 shadow-2xl shadow-teal-500/20 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px]" />
            <div className="relative z-10 space-y-4">
              <h2 className="text-4xl md:text-5xl font-black font-heading tracking-tight">Ready to Modernize?</h2>
              <p className="text-teal-50 text-xl font-medium max-w-lg mx-auto">
                Step into the future of clinic management with NexusCare AI today.
              </p>
            </div>
            <Button size="lg" className="h-14 px-8 text-lg font-bold bg-white text-teal-900 hover:bg-teal-50 rounded-2xl shadow-xl transition-transform hover:scale-105" asChild>
              <Link to={ROUTES.REGISTER}>
                Transform Your Clinic <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;