import { Check, Info, Sparkles, Building2, Stethoscope, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function PricingPage() {
  const plans = [
    {
      name: "Starter",
      description: "Perfect for independent practitioners starting out.",
      price: "Free",
      icon: Stethoscope,
      features: [
        "Up to 50 patient records",
        "Basic appointment scheduling",
        "Standard symptom checker",
        "Community support",
      ],
      notIncluded: [
        "AI Prescription Explainer",
        "AI Risk Flagging",
        "Advanced Analytics",
      ],
      cta: "Get Started",
      link: "/register",
      popular: false,
    },
    {
      name: "Pro",
      description: "Advanced AI tools for growing clinics.",
      price: "$49",
      period: "/month",
      icon: Sparkles,
      features: [
        "Unlimited patient records",
        "Priority appointment scheduling",
        "Advanced AI Symptom Checker",
        "AI Prescription Explainer",
        "AI Risk Flagging & Analytics",
        "24/7 Priority Support",
      ],
      notIncluded: [],
      cta: "Start Free Trial",
      link: "/register?plan=pro",
      popular: true,
    },
    {
      name: "Enterprise",
      description: "Custom solutions for large hospitals.",
      price: "Custom",
      icon: Building2,
      features: [
        "Everything in Pro",
        "Custom AI model training",
        "White-labeling options",
        "Dedicated Account Manager",
        "On-premise deployment available",
        "HIPAA Compliance Audits",
      ],
      notIncluded: [],
      cta: "Contact Sales",
      link: "/contact",
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col pt-16">
      <div className="absolute top-0 inset-x-0 h-96 bg-linear-to-b from-teal-500/10 to-transparent pointer-events-none" />
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-teal-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/5 blur-[100px] pointer-events-none" />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-20 w-full relative z-10 flex flex-col items-center">
        {/* Header */}
        <div className="text-center max-w-3xl mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-700 dark:text-teal-300 text-sm font-bold tracking-wide mb-2 uppercase tracking-widest">
            <Sparkles className="w-4 h-4" /> Transparent Pricing
          </div>
          <h1 className="text-5xl md:text-6xl font-black font-heading tracking-tight text-foreground text-balance">
            Simple pricing for <span className="text-transparent bg-clip-text bg-linear-to-r from-teal-600 to-emerald-600">modern clinics.</span>
          </h1>
          <p className="text-xl text-muted-foreground font-medium text-balance mt-4">
            Transform your practice with AI-powered insights. Choose the plan that scales with your healthcare facility.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl items-center relative z-20">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative flex flex-col rounded-3xl p-8 transition-all duration-300 h-full ${
                plan.popular 
                  ? "bg-background/80 backdrop-blur-xl border-2 border-teal-500 shadow-2xl shadow-teal-500/20 md:-translate-y-4 z-10 scale-[1.02]" 
                  : "bg-background/50 backdrop-blur-sm border border-border shadow-lg hover:border-teal-500/50 hover:shadow-xl"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-linear-to-r from-teal-500 to-emerald-500 text-white text-xs font-black uppercase tracking-widest rounded-full shadow-lg">
                  Most Popular
                </div>
              )}

              <div className="mb-6 flex-none">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-teal-500/20 ${plan.popular ? 'bg-teal-500/20 text-teal-600 dark:text-teal-300' : 'bg-muted/50 text-foreground'}`}>
                  <plan.icon className="w-7 h-7" />
                </div>
                <h3 className="text-3xl font-black text-foreground mb-2">{plan.name}</h3>
                <p className="text-[15px] font-medium text-muted-foreground h-12 leading-snug">{plan.description}</p>
              </div>

              <div className="mb-8 flex items-end gap-1 flex-none">
                <span className="text-5xl font-black tracking-tight">{plan.price}</span>
                {plan.period && <span className="text-muted-foreground font-bold mb-1">{plan.period}</span>}
              </div>

              <div className="space-y-4 flex-1 mb-8">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
                    <span className="text-[15px] font-bold text-foreground">{feature}</span>
                  </div>
                ))}
                {plan.notIncluded.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3 opacity-50">
                    <div className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
                      <div className="w-2.5 h-[2px] bg-muted-foreground rounded-full" />
                    </div>
                    <span className="text-[15px] font-medium text-muted-foreground line-through">{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                asChild
                size="lg"
                className={`w-full rounded-xl font-bold h-12 flex-none ${
                  plan.popular
                    ? "bg-linear-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white shadow-lg shadow-teal-500/25"
                    : "bg-muted/50 text-foreground hover:bg-muted"
                }`}
              >
                <Link to={plan.link}>
                  {plan.cta} <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          ))}
        </div>

        {/* FAQ Teaser */}
        <div className="mt-24 text-center">
           <p className="flex justify-center items-center gap-2 text-muted-foreground font-medium text-lg">
             <Info className="w-6 h-6 text-teal-500" /> Need a custom plan or have questions? <Link to="/contact" className="text-teal-600 dark:text-teal-400 font-bold hover:underline">Contact our sales team</Link>
           </p>
        </div>
      </main>
    </div>
  );
}
