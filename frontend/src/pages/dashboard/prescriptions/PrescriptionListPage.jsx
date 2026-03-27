import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, FileText, Eye, Download, User, Stethoscope, Pill, CalendarClock, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import EmptyState from "@/components/shared/EmptyState";
import useAuth from "@/hooks/useAuth";
import { useGetPrescriptionsQuery } from "@/features/prescriptions/prescriptionApi";
import { generatePrescriptionPDF } from "@/utils/generatePrescriptionPDF";
import { ROUTES } from "@/utils/constants";
import { format } from "date-fns";

const PrescriptionCard = ({ rx, isPatient }) => {
  return (
    <div className="group relative bg-background/50 hover:bg-background/80 backdrop-blur-sm border border-border/60 hover:border-teal-500/30 rounded-3xl p-5 shadow-xs transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/5 flex flex-col h-full">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-600 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
          <FileText className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0 pt-0.5">
          <p className="font-black text-[17px] text-foreground tracking-tight truncate pr-8">{rx.patientId?.name || "Unknown Patient"}</p>
          <div className="flex items-center gap-1.5 mt-0.5 text-muted-foreground text-sm font-medium">
            <Stethoscope className="w-3.5 h-3.5" />
            <span className="truncate">{rx.doctorId?.name || "Unknown Doctor"}</span>
          </div>
        </div>
      </div>

      <div className="bg-muted/30 border border-border/50 rounded-2xl p-4 mb-5 space-y-3 flex-1">
         <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Diagnosis</span>
            <p className="text-sm font-bold text-foreground line-clamp-2 leading-snug">{rx.diagnosis || "No diagnosis provided"}</p>
         </div>
         
         <div className="flex items-center gap-4 pt-1">
            <div className="flex items-center gap-1.5">
               <Pill className="w-4 h-4 text-emerald-500" />
               <span className="text-xs font-bold">{rx.medicines?.length || 0} Meds</span>
            </div>
            <div className="flex items-center gap-1.5 opacity-70">
               <CalendarClock className="w-4 h-4 text-teal-500" />
               <span className="text-xs font-medium">{format(new Date(rx.createdAt), "MMM d, yyyy")}</span>
            </div>
         </div>
      </div>

      <div className="mt-auto flex items-center gap-2 pt-4 border-t border-border/50">
         <Button asChild size="sm" className="flex-1 h-10 rounded-xl bg-teal-500/10 text-teal-700 hover:bg-teal-500/20 hover:text-teal-800 border border-teal-500/20 font-bold shadow-none">
           <Link to={`${ROUTES.PRESCRIPTIONS}/${rx._id}`}>
             <Eye className="w-4 h-4 mr-2" /> View Details
           </Link>
         </Button>
         {isPatient && (
            <Button
              size="icon"
              variant="outline"
              className="h-10 w-10 shrink-0 rounded-xl border-border/50 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10"
              onClick={() => generatePrescriptionPDF(rx, rx.patientId, rx.doctorId)}
              title="Download PDF"
            >
              <Download className="h-4 w-4" />
            </Button>
         )}
      </div>
    </div>
  );
};

const PrescriptionListPage = () => {
  const [page, setPage] = useState(1);
  const { isDoctor, isPatient } = useAuth();

  const { data, isLoading } = useGetPrescriptionsQuery({ page, limit: 12 });
  const prescriptions = data?.data?.prescriptions || [];
  const pagination = data?.data?.pagination || {};

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
         <div className="flex items-center gap-4">
           <div className="w-14 h-14 bg-linear-to-br from-teal-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center border border-teal-500/30 shadow-inner">
             <FileText className="w-7 h-7 text-teal-600" />
           </div>
           <div>
             <h1 className="text-3xl font-black font-heading tracking-tight text-foreground">Prescriptions</h1>
             <p className="text-[15px] font-medium text-muted-foreground mt-1 text-balance">Manage and review medical prescriptions.</p>
           </div>
         </div>
         {isDoctor && (
          <Button asChild size="lg" className="rounded-xl h-12 bg-linear-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold shadow-lg shadow-teal-500/25 transition-all hover:scale-[1.02]">
            <Link to={ROUTES.PRESCRIPTIONS + "/create"}>
              <Plus className="h-5 w-5 mr-2" />
              Write Prescription
            </Link>
          </Button>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32">
           <Loader2 className="w-10 h-10 animate-spin text-teal-600 mb-4" />
           <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest animate-pulse">Loading Records...</p>
        </div>
      ) : prescriptions.length === 0 ? (
        <div className="py-20">
           <EmptyState 
             title="No prescriptions found" 
             description="There are currently no prescriptions in your records." 
             icon={FileText} 
           />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
           {prescriptions.map((rx) => (
             <PrescriptionCard key={rx._id} rx={rx} isPatient={isPatient} />
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
    </div>
  );
};

export default PrescriptionListPage;
