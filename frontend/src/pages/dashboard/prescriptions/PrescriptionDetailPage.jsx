import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Brain, FileText, User, Stethoscope, Calendar, Clock, Pill, Activity, Syringe, CalendarClock, ClipboardList, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import EmptyState from "@/components/shared/EmptyState";
import { useGetPrescriptionQuery } from "@/features/prescriptions/prescriptionApi";
import { generatePrescriptionPDF } from "@/utils/generatePrescriptionPDF";
import { ROUTES } from "@/utils/constants";
import { format } from "date-fns";

const PrescriptionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useGetPrescriptionQuery(id);
  const prescription = data?.data?.prescription;

  const handleDownloadPDF = () => {
    generatePrescriptionPDF(prescription, prescription.patientId, prescription.doctorId);
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center py-32">
       <Loader2 className="w-10 h-10 animate-spin text-teal-600 mb-4" />
       <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest animate-pulse">Loading Prescription Details...</p>
    </div>
  );

  if (!prescription) return (
     <div className="py-20">
       <EmptyState title="Prescription Not Found" description="The requested prescription record could not be located." icon={FileText} />
     </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate(ROUTES.PRESCRIPTIONS)} className="h-10 w-10 rounded-xl hover:bg-muted border-border/50 shadow-xs shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex flex-col">
            <h1 className="text-3xl font-black font-heading tracking-tight text-foreground flex items-center gap-2">
               Prescription Overview
            </h1>
            <p className="text-sm font-medium text-muted-foreground mt-0.5 font-mono bg-muted/50 px-2 py-0.5 rounded-md inline-block max-w-max">ID: {prescription._id}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleDownloadPDF} className="h-11 px-5 rounded-xl font-bold border-border/50 hover:bg-muted bg-background/50 backdrop-blur-sm shadow-xs transition-colors">
            <Download className="h-4 w-4 mr-2 text-teal-600" />
            Download PDF
          </Button>
          <Button onClick={() => navigate(`${ROUTES.AI_PRESCRIPTION_EXPLAIN}?id=${id}`)} className="h-11 px-5 rounded-xl font-bold bg-linear-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white shadow-lg shadow-violet-500/25 transition-all hover:scale-[1.02]">
            <Brain className="h-4 w-4 mr-2" />
            AI Explain
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - Metadata */}
        <div className="md:col-span-1 space-y-8">
           {/* Date & Follow-up */}
           <Card className="rounded-3xl border-border/50 bg-background/60 backdrop-blur-xl shadow-sm overflow-hidden relative">
              <div className="absolute top-0 right-0 p-3 opacity-5 pointer-events-none">
                <Calendar className="w-24 h-24" />
              </div>
              <CardContent className="p-6 relative z-10 space-y-5">
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 mb-1.5"><CalendarClock className="w-3.5 h-3.5 text-teal-500" /> Issued Date</p>
                    <p className="text-[15px] font-bold text-foreground">{format(new Date(prescription.createdAt), "EEEE, MMMM do, yyyy")}</p>
                 </div>
                 {prescription.followUpDate && (
                   <div className="pt-4 border-t border-border/50">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 mb-1.5"><Clock className="w-3.5 h-3.5 text-amber-500" /> Next Follow-up</p>
                      <p className="text-[15px] font-bold text-amber-700 dark:text-amber-400">{format(new Date(prescription.followUpDate), "EEEE, MMMM do, yyyy")}</p>
                   </div>
                 )}
              </CardContent>
           </Card>

           {/* Patient & Doctor */}
           <Card className="rounded-3xl border-border/50 bg-background/60 backdrop-blur-xl shadow-sm overflow-hidden">
             <CardContent className="p-6 space-y-6">
               <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    <User className="w-3.5 h-3.5 text-blue-500" /> Patient Info
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                        <span className="text-blue-700 font-bold">{prescription.patientId?.name?.charAt(0) || "P"}</span>
                     </div>
                     <div>
                       <p className="font-bold text-foreground">{prescription.patientId?.name || "Unknown"}</p>
                       <p className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-md inline-block mt-1">{prescription.patientId?.age || "?"} yrs • {prescription.patientId?.gender || "?"}</p>
                     </div>
                  </div>
               </div>

               <div className="w-full h-[1px] bg-border/50" />

               <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    <Stethoscope className="w-3.5 h-3.5 text-emerald-500" /> Prescribed By
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                        <Stethoscope className="w-5 h-5 text-emerald-600" />
                     </div>
                     <div>
                       <p className="font-bold text-foreground">{prescription.doctorId?.name || "Unknown Doctor"}</p>
                       <p className="text-xs font-black uppercase tracking-widest text-emerald-600/80 dark:text-emerald-400 mt-1">{prescription.doctorId?.specialization || "General"}</p>
                     </div>
                  </div>
               </div>
             </CardContent>
           </Card>
        </div>

        {/* Right Column - Clinical Details */}
        <div className="md:col-span-2 space-y-8">
           
           {/* Diagnosis */}
           <Card className="rounded-3xl border-border/50 bg-background/60 backdrop-blur-xl shadow-sm overflow-hidden">
             <div className="h-1.5 w-full bg-linear-to-r from-violet-500 to-fuchsia-500" />
             <CardHeader className="border-b border-border/50 bg-muted/20 pb-5">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                    <Activity className="w-4 h-4 text-violet-600" />
                 </div>
                 <CardTitle className="text-lg font-black text-foreground tracking-tight">Clinical Diagnosis</CardTitle>
               </div>
             </CardHeader>
             <CardContent className="p-6">
                <p className="text-[15px] font-medium leading-relaxed text-foreground bg-violet-500/5 border border-violet-500/10 p-4 rounded-2xl">
                  {prescription.diagnosis || "No primary diagnosis recorded."}
                </p>
             </CardContent>
           </Card>

           {/* Medications */}
           <Card className="rounded-3xl border-border/50 bg-background/60 backdrop-blur-xl shadow-sm overflow-hidden">
             <div className="h-1.5 w-full bg-linear-to-r from-teal-500 to-emerald-500" />
             <CardHeader className="border-b border-border/50 bg-muted/20 pb-5 flex flex-row items-center justify-between">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
                    <Pill className="w-4 h-4 text-teal-600" />
                 </div>
                 <CardTitle className="text-lg font-black text-foreground tracking-tight">Prescribed Medications</CardTitle>
               </div>
               <div className="px-3 py-1 bg-teal-500/10 text-teal-700 dark:text-teal-400 text-xs font-bold uppercase tracking-widest rounded-lg border border-teal-500/20">
                  {prescription.medicines?.length || 0} items
               </div>
             </CardHeader>
             <CardContent className="p-0">
               <div className="divide-y divide-border/50">
                 {prescription.medicines?.length > 0 ? prescription.medicines.map((med, i) => (
                   <div key={i} className="p-5 sm:p-6 hover:bg-muted/30 transition-colors group relative">
                      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                         <Syringe className="w-16 h-16 text-teal-500" />
                      </div>
                      
                      <div className="flex items-start justify-between mb-4 relative z-10">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-700 font-bold text-xs">
                             {i + 1}
                          </div>
                          <p className="font-black text-[17px] text-foreground">{med.name}</p>
                        </div>
                        <span className="text-xs font-black bg-teal-500/10 text-teal-700 px-3 py-1.5 rounded-full border border-teal-500/20 whitespace-nowrap">
                          {med.dosage}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-2 ml-10 relative z-10">
                        <div className="space-y-1">
                           <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Frequency</span>
                           <p className="text-sm font-bold text-foreground bg-background rounded-lg border border-border/50 px-3 py-1.5 max-w-max">{med.frequency}</p>
                        </div>
                        <div className="space-y-1">
                           <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Duration</span>
                           <p className="text-sm font-bold text-foreground bg-background rounded-lg border border-border/50 px-3 py-1.5 max-w-max">{med.duration}</p>
                        </div>
                        {med.instructions && (
                          <div className="col-span-2 space-y-1 pt-2">
                             <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                                <FileText className="w-3 h-3" /> Special Instructions
                             </span>
                             <p className="text-sm font-medium text-amber-700 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-2">
                               {med.instructions}
                             </p>
                          </div>
                        )}
                      </div>
                   </div>
                 )) : (
                   <div className="p-8 text-center">
                     <p className="text-sm font-medium text-muted-foreground">No medications prescribed.</p>
                   </div>
                 )}
               </div>
             </CardContent>
           </Card>

           {/* Notes */}
           {prescription.notes && (
             <Card className="rounded-3xl border-border/50 bg-background/60 backdrop-blur-xl shadow-sm overflow-hidden">
               <CardHeader className="border-b border-border/50 bg-muted/20 pb-5">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-xl bg-slate-500/10 border border-slate-500/20 flex items-center justify-center">
                      <ClipboardList className="w-4 h-4 text-slate-600" />
                   </div>
                   <CardTitle className="text-lg font-black text-foreground tracking-tight">Physician Notes</CardTitle>
                 </div>
               </CardHeader>
               <CardContent className="p-6">
                  <p className="text-[15px] font-medium leading-relaxed text-foreground bg-muted/30 p-4 rounded-2xl border border-border/50">
                    {prescription.notes}
                  </p>
               </CardContent>
             </Card>
           )}
        </div>
      </div>
    </div>
  );
};

export default PrescriptionDetailPage;
