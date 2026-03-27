import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Calendar, Clock, MapPin, User, Stethoscope, FileText, CheckCircle2, XCircle, MoreVertical, Edit2, Loader2, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import StatusBadge from "@/components/shared/StatusBadge";
import EmptyState from "@/components/shared/EmptyState";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import useAuth from "@/hooks/useAuth";
import { useGetAppointmentsQuery, useUpdateAppointmentStatusMutation, useCancelAppointmentMutation } from "@/features/appointments/appointmentApi";
import { ROUTES } from "@/utils/constants";
import { toast } from "sonner";
import { format } from "date-fns";

const AppointmentCard = ({ apt, onStatusChange, onCancel, isAdmin, isDoctor, isReceptionist, isPatient }) => {
  return (
    <div className="group relative bg-background/50 hover:bg-background/80 backdrop-blur-sm border border-border/60 hover:border-teal-500/30 rounded-3xl p-5 shadow-xs transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/5">
       <div className="absolute top-0 right-0 p-5 z-10">
         <StatusBadge status={apt.status} />
       </div>

       <div className="flex flex-col h-full">
         <div className="flex items-start gap-4 mb-5">
           <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-600 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
             <Calendar className="w-6 h-6" />
           </div>
           <div className="flex-1 min-w-0 pt-0.5">
             <p className="font-black text-[17px] text-foreground tracking-tight truncate pr-20">{apt.patientId?.name || "Unknown Patient"}</p>
             <div className="flex items-center gap-1.5 mt-0.5 text-muted-foreground text-sm font-medium">
               <Stethoscope className="w-3.5 h-3.5" />
               <span className="truncate">{apt.doctorId?.name || "Unknown Doctor"}</span>
               <span className="opacity-50">•</span>
               <span className="text-[11px] font-bold uppercase tracking-widest">{apt.doctorId?.specialization || "General"}</span>
             </div>
           </div>
         </div>

         <div className="bg-muted/30 border border-border/50 rounded-2xl p-4 mb-5 space-y-2.5">
            <div className="flex items-center gap-2.5 text-sm font-medium text-foreground">
              <Clock className="w-4 h-4 text-teal-500" />
              <span>{format(new Date(apt.date), "MMM d, yyyy")}</span>
              <span className="opacity-50">•</span>
              <span className="text-teal-600 dark:text-teal-400 font-bold">{apt.timeSlot}</span>
            </div>
            {apt.reason && (
              <div className="flex items-start gap-2.5 text-sm font-medium text-muted-foreground pt-1">
                <FileText className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="line-clamp-2 leading-snug">{apt.reason}</span>
              </div>
            )}
         </div>

         <div className="mt-auto pt-4 border-t border-border/50 flex flex-wrap gap-2 items-center justify-end">
            {(isAdmin || isDoctor) && apt.status === "pending" && (
              <Button size="sm" className="h-9 px-4 rounded-xl bg-teal-500/10 text-teal-700 hover:bg-teal-500/20 hover:text-teal-800 border border-teal-500/20 font-bold shadow-none" onClick={() => onStatusChange(apt._id, "confirmed")}>
                <CheckCircle2 className="w-4 h-4 mr-1.5" /> Confirm
              </Button>
            )}
            {(isAdmin || isDoctor) && apt.status === "confirmed" && (
              <Button size="sm" className="h-9 px-4 rounded-xl bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 hover:text-emerald-800 border border-emerald-500/20 font-bold shadow-none" onClick={() => onStatusChange(apt._id, "completed")}>
                 <CheckCircle2 className="w-4 h-4 mr-1.5" /> Mark Completed
              </Button>
            )}
            {((isAdmin || isReceptionist || (isPatient && apt.status === "pending")) && apt.status !== "cancelled" && apt.status !== "completed") && (
              <Button size="sm" variant="ghost" className="h-9 px-4 rounded-xl text-rose-600 hover:bg-rose-500/10 hover:text-rose-700 font-bold shadow-none" onClick={() => onCancel(apt._id)}>
                 Cancel
              </Button>
            )}
         </div>
       </div>
    </div>
  );
};

const AppointmentListPage = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [cancelId, setCancelId] = useState(null);
  const { isAdmin, isReceptionist, isDoctor, isPatient } = useAuth();

  const { data, isLoading } = useGetAppointmentsQuery({ page, limit: 12, status: statusFilter });
  const [updateStatus] = useUpdateAppointmentStatusMutation();
  const [cancelAppointment, { isLoading: isCancelling }] = useCancelAppointmentMutation();

  const appointments = data?.data?.appointments || [];
  const pagination = data?.data?.pagination || {};

  // Local client-side search for simplicity within current page
  const filteredAppointments = appointments.filter((apt) => {
    if (!searchFilter) return true;
    const term = searchFilter.toLowerCase();
    return apt.patientId?.name?.toLowerCase().includes(term) || apt.doctorId?.name?.toLowerCase().includes(term) || apt.reason?.toLowerCase().includes(term);
  });

  const handleStatusChange = async (id, status) => {
    try {
      await updateStatus({ id, status }).unwrap();
      toast.success(`Appointment marked as ${status}`);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update status");
    }
  };

  const handleCancel = async () => {
    try {
      await cancelAppointment(cancelId).unwrap();
      toast.success("Appointment cancelled successfully");
      setCancelId(null);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to cancel appointment");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
         <div className="flex items-center gap-4">
           <div className="w-14 h-14 bg-linear-to-br from-teal-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center border border-teal-500/30 shadow-inner">
             <Calendar className="w-7 h-7 text-teal-600" />
           </div>
           <div>
             <h1 className="text-3xl font-black font-heading tracking-tight text-foreground">Appointments</h1>
             <p className="text-[15px] font-medium text-muted-foreground mt-1 text-balance">Manage schedules, consultations, and patient visits.</p>
           </div>
         </div>
         {(isAdmin || isReceptionist || isPatient) && (
          <Button asChild size="lg" className="rounded-xl h-12 bg-linear-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold shadow-lg shadow-teal-500/25 transition-all hover:scale-[1.02]">
            <Link to={ROUTES.APPOINTMENTS + "/book"}>
              <Plus className="h-5 w-5 mr-2" />
              Book Appointment
            </Link>
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card className="rounded-3xl border-border/50 bg-background/60 backdrop-blur-xl shadow-sm overflow-hidden">
         <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by patient, doctor, or reason..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="pl-9 h-12 rounded-xl border-border/50 bg-muted/50 focus-visible:ring-teal-500/50 text-[15px] font-medium"
              />
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
              {[{label: "All", value: ""}, {label: "Pending", value: "pending"}, {label: "Confirmed", value: "confirmed"}, {label: "Completed", value: "completed"}].map((s) => (
                <button
                  key={s.label}
                  onClick={() => { setStatusFilter(s.value); setPage(1); }}
                  className={`px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all border ${
                    statusFilter === s.value
                      ? "bg-teal-500/10 text-teal-700 border-teal-500/30 shadow-xs"
                      : "bg-background border-border/50 text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
         </CardContent>
      </Card>

      {/* Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32">
           <Loader2 className="w-10 h-10 animate-spin text-teal-600 mb-4" />
           <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest animate-pulse">Loading Schedule...</p>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="py-20">
          <EmptyState 
            title="No appointments found" 
            description={searchFilter ? "Try adjusting your search or filters." : "Your schedule is currently clear."}
            icon={Calendar} 
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
           {filteredAppointments.map((apt) => (
              <AppointmentCard 
                key={apt._id} 
                apt={apt} 
                onStatusChange={handleStatusChange} 
                onCancel={setCancelId}
                isAdmin={isAdmin}
                isDoctor={isDoctor}
                isReceptionist={isReceptionist}
                isPatient={isPatient}
              />
           ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between p-4 bg-background/60 backdrop-blur-xl border border-border/50 rounded-2xl shadow-sm">
          <p className="text-[13px] font-bold text-muted-foreground">
            Page <span className="text-foreground">{pagination.page}</span> of {pagination.totalPages} <span className="opacity-50">({pagination.total} total)</span>
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-xl font-bold border-border/50" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</Button>
            <Button variant="outline" size="sm" className="rounded-xl font-bold border-border/50" disabled={page >= pagination.totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!cancelId}
        onConfirm={handleCancel}
        onCancel={() => setCancelId(null)}
        title="Cancel Appointment"
        description="Are you absolutely sure you want to cancel this appointment? This action cannot be undone."
        confirmLabel="Yes, Cancel Appointment"
        isLoading={isCancelling}
      />
    </div>
  );
};

export default AppointmentListPage;
