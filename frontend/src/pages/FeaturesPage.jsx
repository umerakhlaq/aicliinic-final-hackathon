import { Sparkles, BrainCircuit, ActivitySquare, ShieldAlert, ArrowRight, Stethoscope, Clock, ShieldCheck, PieChart, Users, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function FeaturesPage() {
  const features = [
    {
      title: "AI Differential Diagnosis",
      description: "Our core AI engine analyzes patient history and symptoms to provide probabilistic models of potential conditions, acting as an intelligent second opinion for physicians.",
      icon: BrainCircuit,
      color: "teal",
    },
    {
      title: "Automated Risk Triage",
      description: "Proactively scan entire patient directories in the background. The system flags hidden chronic conditions and potentially critical life-threatening risks before they escalate.",
      icon: ShieldAlert,
      color: "rose",
    },
    {
      title: "Smart Prescription Explainer",
      description: "Demystify complex medical terminology for your patients. Our AI translates professional prescriptions into easy-to-understand lifestyle guides and medication schedules.",
      icon: Sparkles,
      color: "emerald",
    },
    {
      title: "Intelligent Scheduling",
      description: "Optimize your clinic's throughput with ML-driven scheduling that accounts for appointment type durations and reduces no-show rates through smart reminders.",
      icon: Clock,
      color: "amber",
    },
    {
      title: "Unified Patient Records",
      description: "A centralized, structured view of the entire patient lifecycle. Track consultations, lab results, and AI-computed metrics through an intuitive interface.",
      icon: Users,
      color: "blue",
    },
    {
      title: "HIPAA-Compliant Security",
      description: "Bank-grade encryption combined with granular Role-Based Access Control (RBAC). Ensure patient confidentiality is preserved across your entire staff.",
      icon: ShieldCheck,
      color: "indigo",
    },
  ];

  const colorMap = {
    teal: "text-teal-600 bg-teal-500/10 border-teal-500/20",
    emerald: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
    rose: "text-rose-600 bg-rose-500/10 border-rose-500/20",
    amber: "text-amber-600 bg-amber-500/10 border-amber-500/20",
    blue: "text-blue-600 bg-blue-500/10 border-blue-500/20",
    indigo: "text-indigo-600 bg-indigo-500/10 border-indigo-500/20",
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col pt-16">
      {/* Background Ambience */}
      <div className="absolute top-0 inset-x-0 h-96 bg-linear-to-b from-teal-500/10 to-transparent pointer-events-none" />
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-teal-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/5 blur-[100px] pointer-events-none" />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-20 w-full relative z-10 flex flex-col items-center">
        {/* Header */}
        <div className="text-center max-w-3xl mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-700 dark:text-teal-300 text-sm font-bold tracking-wide mb-2 uppercase tracking-widest">
            <Sparkles className="w-4 h-4" /> Next-Generation SaaS
          </div>
          <h1 className="text-5xl md:text-6xl font-black font-heading tracking-tight text-foreground text-balance">
            Powerful tools for <span className="text-transparent bg-clip-text bg-linear-to-r from-teal-600 to-emerald-600">modern medicine.</span>
          </h1>
          <p className="text-xl text-muted-foreground font-medium text-balance mt-4">
            Discover how NexusCare AI streamlines clinical workflows, enhances diagnostic accuracy, and improves patient outcomes.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          {features.map((feature, i) => (
             <Card key={i} className="group bg-background/60 backdrop-blur-xl border-border/50 hover:border-teal-500/30 hover:shadow-xl hover:shadow-teal-500/5 transition-all duration-300 rounded-3xl overflow-hidden">
                <CardContent className="p-8 pb-10 flex flex-col h-full">
                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border shadow-inner transition-transform group-hover:scale-110 ${colorMap[feature.color]}`}>
                      <feature.icon className="w-7 h-7" />
                   </div>
                   <h3 className="text-2xl font-black text-foreground mb-4 tracking-tight group-hover:text-teal-600 transition-colors">{feature.title}</h3>
                   <p className="text-[15px] font-medium leading-relaxed text-muted-foreground flex-1">
                     {feature.description}
                   </p>
                </CardContent>
             </Card>
          ))}
        </div>

        {/* Deep Dive Section */}
        <div className="mt-32 w-full max-w-5xl">
          <div className="bg-linear-to-br from-teal-900 to-emerald-900 rounded-[3rem] p-12 md:p-16 text-center md:text-left flex flex-col md:flex-row items-center gap-12 relative overflow-hidden shadow-2xl">
             <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
               <ActivitySquare className="w-64 h-64 text-white" />
             </div>
             
             <div className="flex-1 space-y-6 relative z-10">
               <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-widest">
                 <ShieldAlert className="w-4 h-4" /> Seamless Integration
               </div>
               <h2 className="text-4xl font-black text-white tracking-tight">Ready to upgrade your practice?</h2>
               <p className="text-lg text-teal-100 font-medium max-w-lg leading-relaxed">
                 Stop relying on fragmented tools. Unify your clinic's operations with an intelligent ecosystem designed by doctors, for doctors.
               </p>
               <div className="pt-4 flex flex-col sm:flex-row gap-4 items-center justify-center md:justify-start">
                  <Button size="lg" className="h-14 px-8 rounded-2xl bg-white text-teal-900 hover:bg-teal-50 font-black text-lg transition-transform hover:scale-105" asChild>
                    <Link to="/register">Create an Account</Link>
                  </Button>
                  <Button variant="outline" size="lg" className="h-14 px-8 rounded-2xl border-white/20 bg-white/10 text-white hover:bg-white/20 font-bold backdrop-blur-sm" asChild>
                    <Link to="/pricing">View Pricing <ArrowRight className="w-5 h-5 ml-2" /></Link>
                  </Button>
               </div>
             </div>
             
             <div className="hidden md:flex relative z-10 pointer-events-none">
                <div className="relative">
                   <div className="absolute inset-0 bg-teal-500/30 blur-3xl rounded-full" />
                   <div className="w-64 h-64 bg-linear-to-br from-white/10 to-transparent border border-white/20 rounded-[2.5rem] flex items-center justify-center shadow-2xl backdrop-blur-md transform rotate-3">
                     <BrainCircuit className="w-32 h-32 text-white/80 drop-shadow-lg" />
                   </div>
                </div>
             </div>
          </div>
        </div>

      </main>
    </div>
  );
}
