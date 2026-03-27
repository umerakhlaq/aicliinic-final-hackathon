import { Link } from "react-router-dom";
import { User, Users, Calendar, FileText, TrendingUp, Clock, CheckCircle, AlertCircle, Activity, ChevronRight, Brain } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import { ROUTES, ROLES } from "@/utils/constants";
import { useGetAppointmentsQuery } from "@/features/appointments/appointmentApi";
import { useGetPatientsQuery } from "@/features/patients/patientApi";

const StatCard = ({ title, value, icon: Icon, description }) => (
  <Card className="rounded-2xl border-border/50 shadow-sm overflow-hidden bg-background/60 backdrop-blur-xl hover:shadow-md transition-shadow relative group">
    <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-teal-500/10 transition-colors" />
    <CardContent className="p-6 relative z-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold tracking-tight text-muted-foreground uppercase">{title}</p>
          <p className="text-4xl font-black mt-2 tracking-tight text-foreground">{value ?? "—"}</p>
          {description && <p className="text-xs font-medium text-muted-foreground mt-2">{description}</p>}
        </div>
        <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br from-teal-500/10 to-emerald-500/10 border border-teal-500/20 flex flex-shrink-0 items-center justify-center group-hover:scale-110 transition-transform`}>
          <Icon className="h-7 w-7 text-teal-600 dark:text-teal-400" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const DashboardPage = () => {
  const { user, role, isAdmin, isDoctor, isReceptionist, isPatient } = useAuth();

  const { data: appointmentsData } = useGetAppointmentsQuery({ limit: 5 });
  const { data: patientsData } = useGetPatientsQuery({ limit: 1 }, { skip: isPatient });

  const appointments = appointmentsData?.data?.appointments || [];
  const totalPatients = patientsData?.data?.pagination?.total || 0;
  const totalAppointments = appointmentsData?.data?.pagination?.total || 0;

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="space-y-8 pb-10">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black font-heading tracking-tight text-foreground">
            Welcome back, <span className="text-teal-600 dark:text-teal-400">{user?.name?.split(" ")[0]}!</span>
          </h1>
          <p className="text-[15px] font-medium text-muted-foreground mt-1.5 flex items-center gap-2">
            <Calendar className="h-4 w-4" /> {today}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {(isAdmin || isReceptionist) && (
          <StatCard title="Total Patients" value={totalPatients} icon={Users} description="Registered patients in system" />
        )}
        <StatCard title="Appointments" value={totalAppointments} icon={Calendar} description="All scheduled appointments" />
        {isAdmin && (
          <>
            <StatCard title="Pending Review" value={appointments.filter(a => a.status === "pending").length} icon={Clock} description="Awaiting staff confirmation" />
            <StatCard title="Completed Today" value={appointments.filter(a => a.status === "completed").length} icon={CheckCircle} description="Successful consultations" />
          </>
        )}
        {isDoctor && (
          <>
            <StatCard title="My Appointments" value={totalAppointments} icon={Activity} description="Assigned to your schedule" />
            <StatCard title="Pending" value={appointments.filter(a => a.status === "pending").length} icon={Clock} description="Needs confirmation" />
          </>
        )}
        {isPatient && (
          <StatCard title="My Appointments" value={totalAppointments} icon={Calendar} description="Your upcoming visits" />
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <Card className="rounded-2xl border-border/50 shadow-sm bg-background/60 backdrop-blur-xl h-full">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-black tracking-tight flex items-center gap-2">
                <Activity className="h-5 w-5 text-teal-600" /> Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {(isAdmin || isReceptionist) && (
                <>
                  <Button asChild className="w-full justify-start h-12 rounded-xl font-bold bg-linear-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 shadow-lg shadow-teal-500/20 text-white border-0">
                    <Link to={ROUTES.PATIENTS + "/add"}>
                      <Users className="h-4 w-4 mr-3" /> Register New Patient
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start h-12 rounded-xl font-bold border-2 hover:bg-muted/50">
                    <Link to={ROUTES.APPOINTMENTS + "/book"}>
                      <Calendar className="h-4 w-4 mr-3 text-muted-foreground" /> Book Appointment
                    </Link>
                  </Button>
                </>
              )}
              {isDoctor && (
                <>
                  <Button asChild className="w-full justify-start h-12 rounded-xl font-bold bg-linear-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 shadow-lg shadow-teal-500/20 text-white border-0">
                    <Link to={ROUTES.PRESCRIPTIONS + "/create"}>
                      <FileText className="h-4 w-4 mr-3" /> Write E-Prescription
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start h-12 rounded-xl font-bold border-2 hover:bg-teal-50/50 hover:text-teal-700 hover:border-teal-200">
                    <Link to={ROUTES.AI_SYMPTOM_CHECKER}>
                      <Brain className="h-4 w-4 mr-3 text-teal-600" /> AI Symptom Checker
                    </Link>
                  </Button>
                </>
              )}
              {isAdmin && (
                <Button asChild variant="outline" className="w-full justify-start h-12 rounded-xl font-bold border-2 hover:bg-muted/50">
                  <Link to={ROUTES.ANALYTICS}>
                    <TrendingUp className="h-4 w-4 mr-3 text-muted-foreground" /> View Platform Analytics
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Appointments */}
        <div className="lg:col-span-2">
          {appointments.length > 0 ? (
            <Card className="rounded-2xl border-border/50 shadow-sm bg-background/60 backdrop-blur-xl h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/50">
                <CardTitle className="text-lg font-black tracking-tight flex items-center gap-2">
                  <Clock className="h-5 w-5 text-teal-600" /> Recent Appointments
                </CardTitle>
                <Button asChild variant="ghost" size="sm" className="h-8 rounded-lg text-teal-600 font-bold hover:bg-teal-50 hover:text-teal-700">
                  <Link to={ROUTES.APPOINTMENTS}>
                    View All <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border/50">
                  {appointments.slice(0, 5).map((apt) => (
                    <div key={apt._id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground">
                          {apt.patientId?.name ? apt.patientId.name.charAt(0) : "?"}
                        </div>
                        <div>
                          <p className="text-[15px] font-bold text-foreground leading-none">{apt.patientId?.name || "Unknown Patient"}</p>
                          <p className="text-xs font-medium text-muted-foreground mt-1.5 flex items-center gap-1.5">
                            <User className="h-3 w-3" /> Dr. {apt.doctorId?.name || "Unassigned"} • <Clock className="h-3 w-3 ml-1" /> {apt.timeSlot}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[13px] font-bold text-foreground">
                          {new Date(apt.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </p>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest mt-1.5 ${
                          apt.status === "completed" ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" :
                          apt.status === "confirmed" ? "bg-blue-500/10 text-blue-600 border border-blue-500/20" :
                          apt.status === "cancelled" ? "bg-rose-500/10 text-rose-600 border border-rose-500/20" :
                          "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                        }`}>
                          {apt.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="rounded-2xl border-dashed border-border shadow-sm bg-transparent h-full flex items-center justify-center p-8">
              <div className="text-center space-y-3">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto">
                  <Calendar className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-[15px] font-bold text-muted-foreground">No recent appointments found</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
