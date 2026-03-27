import { Link } from "react-router-dom";
import { ROUTES } from "@/utils/constants";
import { Stethoscope, Heart, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Platform",
      links: [
        { label: "Overview", href: ROUTES.HOME },
        { label: "Features", href: ROUTES.FEATURES },
        { label: "Pricing", href: ROUTES.PRICING },
        { label: "AI Diagnosis", href: ROUTES.FEATURES },
      ],
    },
    {
      title: "Solutions",
      links: [
        { label: "For Private Practices", href: ROUTES.LOGIN },
        { label: "For Network Clinics", href: ROUTES.LOGIN },
        { label: "For Medical Staff", href: ROUTES.LOGIN },
        { label: "Patient Portal", href: ROUTES.LOGIN },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: ROUTES.ABOUT },
        { label: "Contact", href: ROUTES.CONTACT },
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
      ],
    },
  ];

  return (
    <footer className="border-t border-border/40 bg-zinc-50 dark:bg-zinc-950 font-sans">
      <div className="container mx-auto px-4 pt-20 pb-10 max-w-7xl">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2 space-y-6">
            <Link to={ROUTES.HOME} className="flex items-center gap-3 w-fit group">
              <div className="h-12 w-12 rounded-2xl bg-linear-to-br from-teal-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-2xl font-black text-foreground tracking-tight font-heading">NexusCare AI</span>
                <span className="text-[11px] text-teal-600 dark:text-teal-400 font-bold tracking-[0.2em] uppercase mt-1">Intelligent Care</span>
              </div>
            </Link>

            <p className="text-[15px] text-muted-foreground leading-relaxed max-w-sm font-medium">
              Transforming modern healthcare facilities with unified records, dynamic scheduling, and actionable AI intelligence.
            </p>

            <div className="space-y-4 pt-2">
              <a href="mailto:hello@nexuscare.ai" className="flex items-center gap-3 text-sm font-medium text-muted-foreground hover:text-teal-600 transition-colors group w-fit">
                <div className="h-9 w-9 rounded-xl bg-teal-500/10 flex items-center justify-center group-hover:bg-teal-500/20 transition-colors">
                  <Mail className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                </div>
                hello@nexuscare.ai
              </a>
              <a href="tel:+18005550000" className="flex items-center gap-3 text-sm font-medium text-muted-foreground hover:text-teal-600 transition-colors group w-fit">
                <div className="h-9 w-9 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                  <Phone className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                +1 (800) 555-0000
              </a>
              <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground w-fit">
                <div className="h-9 w-9 rounded-xl bg-border/40 flex items-center justify-center">
                  <MapPin className="h-4 w-4" />
                </div>
                San Francisco, CA
              </div>
            </div>
          </div>

          {/* Link Columns */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-6">
              <h4 className="text-sm font-black text-foreground uppercase tracking-wider">{section.title}</h4>
              <ul className="space-y-3.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-[15px] font-medium text-muted-foreground hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="my-12 h-px bg-border/60" />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm font-medium text-muted-foreground">
          <p className="flex items-center gap-1.5">
            &copy; {currentYear} NexusCare AI Platform. Built with
            <Heart className="h-4 w-4 text-rose-500 fill-rose-500" />
            for a healthier future.
          </p>
          <div className="flex items-center gap-8">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-foreground transition-colors">System Status</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
