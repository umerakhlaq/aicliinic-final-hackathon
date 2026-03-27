import { Link, useNavigate, NavLink } from "react-router-dom";
import { LogOut, User, Menu, X, Stethoscope, Crown, LayoutDashboard } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import { ROUTES } from "@/utils/constants";
import { toast } from "sonner";

const Header = () => {
  const { isAuthenticated, user, logout, isLoggingOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      toast.success("Logged out successfully");
      setMobileOpen(false);
      navigate(ROUTES.LOGIN);
    } catch {
      toast.error("Logout failed");
    }
  };

  const navLinks = [
    { label: "Overview", path: ROUTES.HOME },
    {label:"About",path:ROUTES.ABOUT},
    { label: "Features", path: ROUTES.FEATURES },
    { label: "Pricing", path: ROUTES.PRICING },
    { label: "Contact", path: ROUTES.CONTACT },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 font-sans ${
        scrolled
          ? "border-b border-border/40 bg-background/80 backdrop-blur-xl shadow-xs"
          : "bg-background/40 backdrop-blur-md"
      }`}
    >
      <div className="container mx-auto px-4 h-20 flex items-center justify-between max-w-7xl">
        {/* Logo */}
        <Link
          to={ROUTES.HOME}
          className="flex items-center gap-3 group"
          onClick={() => setMobileOpen(false)}
        >
          <div className="h-10 w-10 rounded-2xl bg-linear-to-br from-teal-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-500/30 group-hover:shadow-teal-500/50 transition-all group-hover:scale-105">
            <Stethoscope className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-xl font-black text-foreground tracking-tight font-heading">NexusCare AI</span>
            <span className="text-[10px] text-teal-600 dark:text-teal-400 font-bold tracking-[0.2em] uppercase mt-0.5">Health Platform</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 bg-muted/30 p-1.5 rounded-full border border-border/50 backdrop-blur-md">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  isActive
                    ? "text-teal-700 dark:text-teal-300 bg-teal-500/10 shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-muted/40 border border-border/50 hover:bg-muted/60 transition-colors cursor-pointer">
                <div className="h-8 w-8 rounded-full bg-linear-to-br from-teal-500 to-emerald-500 flex items-center justify-center shrink-0 shadow-sm">
                  {user?.avatar?.url ? (
                    <img src={user.avatar.url} alt={user.name} className="h-8 w-8 rounded-full object-cover border border-white/20" />
                  ) : (
                    <User className="h-4 w-4 text-white" />
                  )}
                </div>
                <div className="hidden lg:flex flex-col pr-2">
                  <p className="text-sm font-bold leading-none text-foreground">{user?.name}</p>
                  <p className="text-[11px] font-medium text-muted-foreground capitalize mt-1 flex items-center gap-1">
                    {user?.role}
                    {user?.subscriptionPlan === "pro" && (
                      <span className="inline-flex items-center gap-0.5 text-amber-500 font-bold px-1.5 bg-amber-500/10 rounded-sm">
                        <Crown className="w-2.5 h-2.5" /> Pro
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <Button size="sm" asChild className="gap-2 h-10 px-5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-400 hover:bg-teal-500/20 border-0">
                <Link to={ROUTES.DASHBOARD}>
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="font-semibold">Portal</span>
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="h-10 w-10 rounded-full text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild className="h-10 px-6 rounded-full font-semibold hover:bg-muted/80">
                <Link to={ROUTES.LOGIN}>Sign In</Link>
              </Button>
              <Button size="sm" asChild className="h-10 px-6 rounded-full font-bold bg-linear-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 border-0 shadow-lg shadow-teal-500/20 transition-all hover:scale-105">
                <Link to={ROUTES.REGISTER}>Access Platform</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 rounded-full hover:bg-muted/80 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6 text-foreground" /> : <Menu className="h-6 w-6 text-foreground" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-2xl absolute w-full shadow-2xl">
          <div className="container mx-auto px-6 py-6 space-y-2 max-w-7xl">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="flex items-center px-4 py-4 rounded-2xl text-base font-bold text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <div className="h-px bg-border/40 my-4" />

            {isAuthenticated ? (
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-4 px-4 py-4 rounded-2xl bg-muted/40 border border-border/50">
                  <div className="h-12 w-12 rounded-full bg-linear-to-br from-teal-500 to-emerald-500 flex items-center justify-center shrink-0 shadow-sm">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-base font-bold">{user?.name}</p>
                    <p className="text-sm font-medium text-muted-foreground capitalize flex items-center gap-2 mt-1">
                      {user?.role}
                      {user?.subscriptionPlan === "pro" && (
                        <span className="text-amber-500 font-bold flex items-center gap-1 bg-amber-500/10 px-2 rounded-full">
                          <Crown className="w-3.5 h-3.5" /> PRO
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button className="w-full gap-2 h-12 rounded-xl bg-linear-to-r from-teal-600 to-emerald-600 font-bold border-0 shadow-md shadow-teal-500/20" asChild>
                    <Link to={ROUTES.DASHBOARD} onClick={() => setMobileOpen(false)}>
                      <LayoutDashboard className="h-4 w-4" /> Portal
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full gap-2 h-12 rounded-xl text-rose-500 font-bold hover:bg-rose-500/10 hover:text-rose-600 border-rose-500/20"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                  >
                    <LogOut className="h-4 w-4" />
                    {isLoggingOut ? "..." : "Logout"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                <Button variant="outline" className="w-full h-12 rounded-xl font-bold border-2" asChild>
                  <Link to={ROUTES.LOGIN} onClick={() => setMobileOpen(false)}>Sign In</Link>
                </Button>
                <Button className="w-full h-12 rounded-xl bg-linear-to-r from-teal-600 to-emerald-600 font-bold border-0 shadow-md shadow-teal-500/20" asChild>
                  <Link to={ROUTES.REGISTER} onClick={() => setMobileOpen(false)}>Access Platform</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
