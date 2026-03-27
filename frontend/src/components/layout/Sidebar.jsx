import { NavLink, useNavigate, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Brain,
  BarChart3,
  CreditCard,
  LogOut,
  X,
  Stethoscope,
  User,
  ClipboardList,
  UserCog,
  CalendarDays,
  Settings2,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import { ROLES, ROUTES } from "@/utils/constants";
import { toast } from "sonner";

const navConfig = {
  [ROLES.ADMIN]: [
    { label: "Dashboard", path: ROUTES.DASHBOARD, icon: LayoutDashboard },
    { label: "Patients", path: ROUTES.PATIENTS, icon: Users },
    { label: "Appointments", path: ROUTES.APPOINTMENTS, icon: Calendar },
    { label: "Prescriptions", path: ROUTES.PRESCRIPTIONS, icon: FileText },
    { label: "Staff", path: ROUTES.STAFF, icon: UserCog },
    { label: "Analytics", path: ROUTES.ANALYTICS, icon: BarChart3 },
    { label: "System", path: ROUTES.SYSTEM, icon: Settings2 },
  ],
  [ROLES.DOCTOR]: [
    { label: "Dashboard", path: ROUTES.DASHBOARD, icon: LayoutDashboard },
    { label: "My Appointments", path: ROUTES.APPOINTMENTS, icon: Calendar },
    { label: "Patients", path: ROUTES.PATIENTS, icon: Users },
    { label: "Prescriptions", path: ROUTES.PRESCRIPTIONS, icon: FileText },
    { label: "Symptom Checker", path: ROUTES.AI_SYMPTOM_CHECKER, icon: Brain },
    { label: "AI Explain Rx", path: ROUTES.AI_PRESCRIPTION_EXPLAIN, icon: Stethoscope },
    { label: "AI Risk Flagging", path: ROUTES.AI_RISK_FLAGGING, icon: ShieldAlert },
    { label: "Diagnosis History", path: ROUTES.AI_DIAGNOSIS_LOGS, icon: ClipboardList },
    { label: "My Analytics", path: ROUTES.ANALYTICS, icon: BarChart3 },
  ],
  [ROLES.RECEPTIONIST]: [
    { label: "Dashboard", path: ROUTES.DASHBOARD, icon: LayoutDashboard },
    { label: "Patients", path: ROUTES.PATIENTS, icon: Users },
    { label: "Appointments", path: ROUTES.APPOINTMENTS, icon: Calendar },
    { label: "Daily Schedule", path: ROUTES.SCHEDULE, icon: CalendarDays },
  ],
  [ROLES.PATIENT]: [
    { label: "Dashboard", path: ROUTES.DASHBOARD, icon: LayoutDashboard },
    { label: "My Appointments", path: ROUTES.APPOINTMENTS, icon: Calendar },
    { label: "My Prescriptions", path: ROUTES.PRESCRIPTIONS, icon: FileText },
    { label: "Symptom Checker", path: ROUTES.AI_SYMPTOM_CHECKER, icon: Brain },
    { label: "AI Explain Rx", path: ROUTES.AI_PRESCRIPTION_EXPLAIN, icon: Stethoscope },
  ],
};

const Sidebar = ({ onClose }) => {
  const { user, role, logout, isLoggingOut } = useAuth();
  const navigate = useNavigate();

  const links = navConfig[role] || [];

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <div className="flex h-full flex-col bg-background/80 backdrop-blur-2xl border-r border-border/50 shadow-xl shadow-black/5 w-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-border/50">
        <Link to={ROUTES.HOME} className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-linear-to-br from-teal-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-500/30">
            <Stethoscope className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-[17px] font-black tracking-tight font-heading text-foreground uppercase">NexusCare <span className="text-teal-600">AI</span></p>
            <p className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">{role} PORTAL</p>
          </div>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* User Info */}
      <div className="px-6 py-5 bg-muted/10 border-b border-border/50">
        <div className="flex items-center gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-linear-to-br from-teal-500 to-emerald-500 flex items-center justify-center flex-shrink-0 shadow-sm border-2 border-background">
            {user?.avatar?.url ? (
              <img
                src={user.avatar.url}
                alt={user.name}
                className="h-full w-full rounded-xl object-cover"
              />
            ) : (
              <User className="h-5 w-5 text-white" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold truncate text-foreground leading-none">{user?.name || "Dr. User"}</p>
            <p className="text-xs font-medium text-muted-foreground truncate mt-1">{user?.email || "user@nexuscare.ai"}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-1.5">
        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase px-2 mb-3">Main Menu</p>
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === ROUTES.DASHBOARD || link.path === ROUTES.APPOINTMENTS}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-bold transition-all ${
                  isActive
                    ? "bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-500/20 shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60 border border-transparent"
                }`
              }
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {link.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-4 py-4 border-t border-border/50 bg-muted/5">
        <Button
          variant="outline"
          className="w-full h-11 justify-start gap-3 rounded-xl text-rose-600 font-bold border-rose-500/20 hover:bg-rose-500/10 hover:text-rose-600 hover:border-rose-500/30 transition-all"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <LogOut className="h-4 w-4" />
          {isLoggingOut ? "Closing Session..." : "Secure Logout"}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
