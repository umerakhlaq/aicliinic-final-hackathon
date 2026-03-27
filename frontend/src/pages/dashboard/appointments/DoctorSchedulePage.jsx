import { useState } from "react";
import { CalendarDays, Stethoscope, Clock, FileText, User, ChevronRight, Loader2, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import StatusBadge from "@/components/shared/StatusBadge";
import EmptyState from "@/components/shared/EmptyState";
import useAuth from "@/hooks/useAuth";
import { useGetDoctorScheduleQuery } from "@/features/appointments/appointmentApi";
import { useGetUsersQuery } from "@/features/users/userApi";
import { format } from "date-fns";

const DoctorSchedulePage = () => {
  const { user, isDoctor, isAdmin, isReceptionist } = useAuth();
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");

  const canPickDoctor = isAdmin || isReceptionist;

  // Admin/Receptionists pick a doctor; doctors see their own
  const { data: usersData } = useGetUsersQuery({ role: "doctor", limit: 100 }, { skip: !canPickDoctor });
  const doctors = usersData?.data?.users || [];

  const doctorId = isDoctor ? user?._id : selectedDoctorId;

  const { data, isLoading } = useGetDoctorScheduleQuery(
    { doctorId, date },
    { skip: !doctorId || !date }
  );

  const appointments = data?.data?.appointments || [];
  const selectedDoctor = doctors.find((d) => d._id === selectedDoctorId);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
         <div className="w-14 h-14 bg-linear-to-br from-teal-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center border border-teal-500/30 shadow-inner">
           <CalendarDays className="w-7 h-7 text-teal-600" />
         </div>
         <div>
           <h1 className="text-3xl font-black font-heading tracking-tight text-foreground">
             {isDoctor ? "My Schedule" : "Daily Schedule"}
           </h1>
           <p className="text-[15px] font-medium text-muted-foreground mt-1 text-balance">
             {isDoctor ? "Your appointments for the selected date" : "View any doctor's appointments by date"}
           </p>
         </div>
      </div>

      {/* Filters */}
      <Card className="rounded-3xl border-border/50 bg-background/60 backdrop-blur-xl shadow-sm overflow-hidden">
        <CardContent className="p-4 sm:p-6 flex flex-col md:flex-row gap-6">
          {/* Doctor picker — admin & receptionist */}
          {canPickDoctor && (
            <div className="flex-1 space-y-3">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                 <Stethoscope className="w-3.5 h-3.5" /> Select Doctor
              </Label>
              <div className="relative">
                <Stethoscope className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <select
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                  className="w-full pl-10 pr-4 h-12 rounded-xl border border-border/50 bg-muted/50 hover:bg-muted text-[15px] font-medium outline-none focus:ring-2 focus:ring-teal-500/50 transition-colors appearance-none"
                >
                  <option value="" disabled className="text-muted-foreground">Choose a physician...</option>
                  {doctors.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.name}{d.specialization ? ` — ${d.specialization}` : ""}
                    </option>
                  ))}
                </select>
                <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none rotate-90" />
              </div>
            </div>
          )}

          {/* Date picker */}
          <div className="flex-1 space-y-3">
            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
               <Calendar className="w-3.5 h-3.5" /> Select Date
            </Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-12 rounded-xl border-border/50 bg-muted/50 focus-visible:ring-teal-500/50 text-[15px] font-medium px-4"
            />
          </div>
        </CardContent>
      </Card>

      {/* Schedule Content */}
      <Card className="rounded-3xl border-border/50 bg-background/60 backdrop-blur-xl shadow-sm overflow-hidden">
         <div className="h-1.5 w-full bg-linear-to-r from-teal-500 to-emerald-500" />
         <CardHeader className="border-b border-border/50 bg-muted/20 pb-6 flex flex-row items-center justify-between">
           <div className="space-y-1">
              <CardTitle className="text-xl font-black text-foreground tracking-tight">
                {canPickDoctor && selectedDoctor ? `${selectedDoctor.name}'s Schedule` : isDoctor ? "My Schedule" : "Schedule Overview"}
              </CardTitle>
              <CardDescription className="text-sm font-bold text-teal-600 dark:text-teal-400">
                {format(new Date(date + "T00:00:00"), "EEEE, MMMM do, yyyy")}
              </CardDescription>
           </div>
           
           {appointments.length > 0 && (
             <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-teal-500/10 border border-teal-500/20 rounded-lg">
                <span className="text-teal-700 dark:text-teal-300 font-black text-lg">{appointments.length}</span>
                <span className="text-teal-600/70 dark:text-teal-400/70 text-xs font-bold uppercase tracking-widest">Sessions</span>
             </div>
           )}
         </CardHeader>
         <CardContent className="p-0">
          {/* Admin/Receptionist: no doctor selected yet */}
          {canPickDoctor && !selectedDoctorId ? (
            <div className="py-20">
              <EmptyState
                title="Select a physician"
                description="Choose a doctor above to view their daily schedule and appointments."
                icon={Stethoscope}
              />
            </div>
          ) : isLoading ? (
            <div className="flex flex-col items-center justify-center py-24">
               <Loader2 className="w-10 h-10 animate-spin text-teal-600 mb-4" />
               <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest animate-pulse">Loading Timeline...</p>
            </div>
          ) : appointments.length === 0 ? (
            <div className="py-20">
              <EmptyState
                title="No appointments scheduled"
                description="The schedule is completely clear for this date."
                icon={CalendarDays}
              />
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {appointments.sort((a,b) => a.timeSlot.localeCompare(b.timeSlot)).map((apt) => (
                <div key={apt._id} className="group p-5 hover:bg-muted/30 transition-colors flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 relative">
                   <div className="flex items-center gap-4 w-full sm:w-auto">
                     <div className="w-20 py-2 rounded-xl bg-teal-500/10 border border-teal-500/20 text-center shrink-0 group-hover:scale-105 transition-transform">
                        <p className="text-sm font-black text-teal-700 dark:text-teal-400">{apt.timeSlot.split('-')[0]}</p>
                        <p className="text-[10px] font-bold text-teal-600/70 uppercase tracking-widest mt-0.5">{apt.timeSlot.split('-')[1]}</p>
                     </div>
                     <div className="flex-1 sm:hidden">
                       <StatusBadge status={apt.status} />
                     </div>
                   </div>
                   
                   <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                     <div>
                       <div className="flex items-center gap-1.5 mb-1">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <p className="text-base font-black text-foreground truncate">{apt.patientId?.name || "Unknown Patient"}</p>
                       </div>
                       <p className="text-sm font-medium text-muted-foreground truncate pl-5.5">
                         {apt.patientId?.phone || "No phone provided"}
                       </p>
                     </div>
                     
                     <div className="sm:border-l sm:border-border/50 sm:pl-4">
                        <div className="flex items-start gap-1.5">
                          <FileText className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                          <p className="text-sm font-medium text-muted-foreground line-clamp-2">
                             {apt.reason || "General consultation"}
                          </p>
                        </div>
                     </div>
                   </div>

                   <div className="hidden sm:block whitespace-nowrap">
                     <StatusBadge status={apt.status} />
                   </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorSchedulePage;
