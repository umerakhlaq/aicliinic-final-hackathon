import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Send, AlertCircle, CheckCircle2 } from "lucide-react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactInfo = [
    {
      icon: Mail,
      label: "Support Email",
      value: "hello@nexuscare.ai",
      href: "mailto:hello@nexuscare.ai",
    },
    {
      icon: Phone,
      label: "Sales & Support",
      value: "+1 (800) 555-0000",
      href: "tel:+18005550000",
    },
    {
      icon: MapPin,
      label: "Headquarters",
      value: "San Francisco, CA",
      href: "#",
    },
  ];

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

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
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

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Request sent successfully! Our team will contact you shortly.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      toast.error("Failed to send message. Please try again or call our support line.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full font-sans">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-950 via-teal-900 to-background px-4 py-20 md:py-32">
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
            <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-teal-500/20 blur-[100px]" />
            <div className="absolute -right-40 -bottom-40 h-96 w-96 rounded-full bg-emerald-500/20 blur-[100px]" />
          </div>

          <div className="space-y-6 text-center text-white">
            <h1 className="text-4xl md:text-6xl font-black font-heading tracking-tight">Connect With Us</h1>
            <p className="text-xl text-teal-100/80 max-w-2xl mx-auto font-medium">
              Whether you need to schedule a demo, inquire about enterprise pricing, or require technical support — we are here to assist.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="px-4 py-16 md:py-24">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Contact Info */}
            <div className="space-y-8 lg:pr-6">
              <div>
                <h2 className="text-3xl font-black font-heading tracking-tight mb-4">Let's talk.</h2>
                <p className="text-muted-foreground text-[15px] font-medium leading-relaxed mb-8">
                  Reach out to the NexusCare AI team. We typically respond to all inquiries within business hours.
                </p>
              </div>

              <div className="space-y-4">
                {contactInfo.map(({ icon: Icon, label, value, href }) => (
                  <a
                    key={label}
                    href={href}
                    className="flex items-center gap-5 p-5 rounded-2xl border border-border/50 bg-muted/10 hover:border-teal-500/30 hover:bg-teal-500/5 transition-all group"
                  >
                    <div className="h-12 w-12 rounded-xl bg-background shadow-sm border border-border/50 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:border-teal-500/30 transition-all">
                      <Icon className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5">
                        {label}
                      </p>
                      <p className="font-semibold text-[15px] group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                        {value}
                      </p>
                    </div>
                  </a>
                ))}
              </div>

              {/* Response Time */}
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 space-y-2 mt-8">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <p className="font-bold text-[15px] text-emerald-700 dark:text-emerald-400">
                    Priority Support Ready
                  </p>
                </div>
                <p className="text-[13px] font-medium text-muted-foreground">
                  Pro tier clinics receive under 1-hour SLA. Standard inquiries respond within 24h.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="rounded-[2rem] border border-border/50 bg-background/50 backdrop-blur-xl p-8 md:p-10 shadow-xl shadow-black/5">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Name Field */}
                    <div className="space-y-3">
                      <Label htmlFor="name" className="text-sm font-bold text-foreground">
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Dr. John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        className={`h-12 rounded-xl transition-colors bg-muted/30 focus-visible:bg-background ${
                          errors.name
                            ? "border-rose-500 focus-visible:ring-rose-500"
                            : "focus-visible:ring-teal-500"
                        }`}
                      />
                      {errors.name && (
                        <p className="text-xs font-medium text-rose-500 flex items-center gap-1.5 mt-1">
                          <AlertCircle className="h-3.5 w-3.5" />
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Email Field */}
                    <div className="space-y-3">
                      <Label htmlFor="email" className="text-sm font-bold text-foreground">
                        Work Email
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@clinic.com"
                        value={formData.email}
                        onChange={handleChange}
                        className={`h-12 rounded-xl transition-colors bg-muted/30 focus-visible:bg-background ${
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
                  </div>

                  {/* Subject Field */}
                  <div className="space-y-3">
                    <Label htmlFor="subject" className="text-sm font-bold text-foreground">
                      Inquiry Subject
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      placeholder="e.g. Schedule a Demo, Pricing Question"
                      value={formData.subject}
                      onChange={handleChange}
                      className={`h-12 rounded-xl transition-colors bg-muted/30 focus-visible:bg-background ${
                        errors.subject
                          ? "border-rose-500 focus-visible:ring-rose-500"
                          : "focus-visible:ring-teal-500"
                      }`}
                    />
                    {errors.subject && (
                      <p className="text-xs font-medium text-rose-500 flex items-center gap-1.5 mt-1">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {errors.subject}
                      </p>
                    )}
                  </div>

                  {/* Message Field */}
                  <div className="space-y-3">
                    <Label htmlFor="message" className="text-sm font-bold text-foreground">
                      Message Details
                    </Label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Please explicitly describe your clinic's needs and current patient volume..."
                      rows={6}
                      className={`flex w-full rounded-xl border border-input bg-muted/30 focus-visible:bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none transition-colors ${
                        errors.message
                          ? "focus-visible:ring-rose-500 border-rose-500"
                          : "focus-visible:ring-teal-500"
                      }`}
                    />
                    {errors.message && (
                      <p className="text-xs font-medium text-rose-500 flex items-center gap-1.5 mt-1">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full h-14 rounded-xl text-base font-bold gap-2 bg-linear-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 border-0 shadow-xl shadow-teal-500/20 transition-all hover:scale-[1.01]"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Transmitting...
                      </>
                    ) : (
                      <>
                        Send Inquiry
                        <Send className="h-5 w-5" />
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 py-20 md:py-28 bg-muted/20 pb-20">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-black font-heading tracking-tight">Platform FAQs</h2>
            <p className="text-muted-foreground text-lg font-medium">
              Common questions from clinical administrators.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Is patient data securely handled?",
                a: "Absolutely. We enforce end-to-end encryption, strict JWT validations, and robust RBAC to ensure HIPAA-level security standards.",
              },
              {
                q: "How does the AI diagnostic assist work?",
                a: "Our engine uses advanced ML via Gemini to cross-reference reported symptoms against vast medical databases, returning calculated risk profiles to assist the doctor.",
              },
              {
                q: "Can we integrate NexusCare with our existing systems?",
                a: "NexusCare is designed to be a complete replacement. However, enterprise clients get access to customized API bridging solutions.",
              },
              {
                q: "What is the onboarding process like?",
                a: "Standard clinics can deploy and invite staff in under 10 minutes. For enterprise migrations, we provide dedicated engineering support.",
              },
            ].map(({ q, a }) => (
              <div
                key={q}
                className="rounded-2xl border border-border/50 bg-background/60 backdrop-blur-sm p-8 space-y-3 hover:border-teal-500/30 transition-colors"
              >
                <p className="font-bold text-lg text-foreground tracking-tight">{q}</p>
                <p className="text-[15px] font-medium text-muted-foreground leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;