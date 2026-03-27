import { useState } from "react";
import { useGetDiagnosisLogsQuery } from "@/features/ai/aiApi";
import { Brain, ClipboardList, Loader2, ChevronRight, ShieldAlert, FileText, AlertTriangle, ArrowLeft } from "lucide-react";
import StatusBadge from "@/components/shared/StatusBadge";
import EmptyState from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

const TYPE_LABELS = {
  symptom_check: { label: "Symptom Check", icon: Brain, color: "bg-teal-500/10 text-teal-700 border-teal-500/20" },
  prescription_explain: { label: "Rx Explain", icon: FileText, color: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20" },
  risk_flag: { label: "Risk Flag", icon: ShieldAlert, color: "bg-rose-500/10 text-rose-700 border-rose-500/20" },
};

function LogCard({ log, onClick }) {
  const typeInfo = TYPE_LABELS[log.type] || TYPE_LABELS.symptom_check;
  const TypeIcon = typeInfo.icon;

  return (
    <div
      onClick={onClick}
      className="group flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl border border-border/60 bg-background/50 backdrop-blur-sm hover:bg-muted/50 hover:shadow-xs cursor-pointer transition-all"
    >
      <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 border ${typeInfo.color}`}>
        <TypeIcon className="h-6 w-6" />
      </div>
      
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2">
          <p className="text-base font-bold text-foreground truncate group-hover:text-teal-600 transition-colors">
            {log.patientId?.name || "Unknown Patient"}
          </p>
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest bg-muted px-2 py-0.5 rounded-full shrink-0">
            {format(new Date(log.createdAt), "dd MMM")}
          </span>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-[10px] uppercase tracking-widest font-black px-2 py-0.5 rounded-md border ${typeInfo.color}`}>
            {typeInfo.label}
          </span>
          {log.riskLevel && <StatusBadge status={log.riskLevel} />}
          {log.aiFailed && (
            <span className="text-[10px] uppercase tracking-widest font-black px-2 py-0.5 rounded-md border bg-amber-500/10 text-amber-700 border-amber-500/20 flex items-center gap-1">
              <AlertTriangle className="w-2.5 h-2.5" /> Failed
            </span>
          )}
        </div>
        
        <p className="text-[13px] text-muted-foreground line-clamp-1 mt-1 font-medium">
          {log.finalDiagnosis ? (
            <><span className="text-foreground">Dx:</span> {log.finalDiagnosis}</>
          ) : log.symptoms?.length > 0 ? (
            <><span className="text-foreground">Symptoms:</span> {log.symptoms.join(", ")}</>
          ) : (
            "No details provided"
          )}
        </p>
      </div>
      
      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full opacity-50 group-hover:opacity-100 group-hover:bg-teal-50 group-hover:text-teal-600 transition-all shrink-0 self-end sm:self-center">
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
}

function LogDetail({ log, onBack }) {
  const typeInfo = TYPE_LABELS[log.type] || TYPE_LABELS.symptom_check;
  const TypeIcon = typeInfo.icon;
  const ai = log.aiResponse;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={onBack} className="h-10 w-10 rounded-xl hover:bg-muted">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex flex-col">
           <h2 className="text-2xl font-black text-foreground">Diagnosis Details</h2>
           <p className="text-sm font-medium text-muted-foreground">Log from {format(new Date(log.createdAt), "MMMM do, yyyy • h:mm a")}</p>
        </div>
      </div>

      <Card className="rounded-3xl border-border/50 bg-background/60 backdrop-blur-xl shadow-sm overflow-hidden">
        <div className={`h-1.5 w-full bg-linear-to-r ${log.type === 'risk_flag' ? 'from-rose-500 to-orange-500' : 'from-teal-500 to-emerald-500'}`} />
        <CardHeader className="pb-4 border-b border-border/50 bg-muted/20 flex flex-row items-center justify-between">
           <div className="flex items-center gap-3">
             <div className={`h-10 w-10 rounded-lg flex items-center justify-center border ${typeInfo.color}`}>
                <TypeIcon className="h-5 w-5" />
             </div>
             <div>
               <CardTitle className="text-lg font-black">{typeInfo.label}</CardTitle>
               <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-0.5">Session Type</p>
             </div>
           </div>
           {log.riskLevel && <StatusBadge status={log.riskLevel} />}
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Meta Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Patient", value: log.patientId?.name || "Unknown" },
              { label: "Doctor", value: log.doctorId?.name || "Unknown" },
              { label: "Age/Gender", value: log.patientId ? `${log.patientId.age}y / ${log.patientId.gender}` : "—" },
              { label: "AI Status", value: log.aiFailed ? <span className="text-rose-600 font-bold flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5"/> Failed</span> : <span className="text-emerald-600 font-bold">Success</span> },
            ].map(({ label, value }) => (
              <div key={label} className="bg-muted/30 p-3.5 rounded-xl border border-border/50">
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">{label}</p>
                <div className="text-sm font-semibold truncate">{value}</div>
              </div>
            ))}
          </div>

          {/* User Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {log.symptoms?.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-500" /> Reported Symptoms
                </h3>
                <div className="flex flex-wrap gap-2">
                  {log.symptoms.map((s, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-lg bg-background border border-border shadow-xs text-[13px] font-bold">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {(log.finalDiagnosis || log.doctorNotes) && (
              <div className="space-y-3">
                 <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-500" /> Physician Assessment
                </h3>
                <div className="bg-background border border-border/50 rounded-xl p-4 shadow-xs space-y-3">
                  {log.finalDiagnosis && (
                    <div>
                      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Final Diagnosis</p>
                      <p className="text-sm font-semibold text-foreground">{log.finalDiagnosis}</p>
                    </div>
                  )}
                  {log.doctorNotes && (
                    <div>
                      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Notes</p>
                      <p className="text-sm text-foreground">{log.doctorNotes}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* AI Response Box */}
          {ai && !log.aiFailed && (
            <div className="pt-6 border-t border-border/50">
               <h3 className="text-xs font-black uppercase tracking-widest text-teal-600 flex items-center gap-2 mb-4">
                  <Brain className="w-4 h-4" /> AI Engine Output
                </h3>
              
              <div className="rounded-2xl border border-teal-500/20 bg-linear-to-b from-teal-500/5 to-transparent p-6 space-y-6">
                {ai.possibleConditions?.length > 0 && (
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Differential Diagnoses</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {ai.possibleConditions.map((c, i) => (
                        <div key={i} className="bg-background rounded-xl p-3 border border-border/50 shadow-xs flex justify-between items-center gap-3">
                          <span className="font-bold text-sm text-foreground truncate">{c.name}</span>
                          {c.likelihood && (
                             <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md bg-muted text-muted-foreground shrink-0">{c.likelihood}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {ai.recommendedTests?.length > 0 && (
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Recommended Actions</h4>
                    <div className="flex flex-wrap gap-2">
                      {ai.recommendedTests.map((t, i) => (
                        <span key={i} className="px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400 border border-teal-500/20 text-[13px] font-bold">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {ai.redFlags?.length > 0 && (
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-rose-500 mb-3 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" /> Critical Red Flags
                    </h4>
                    <div className="space-y-2">
                      {ai.redFlags.map((f, i) => (
                        <div key={i} className="bg-rose-500/5 border border-rose-500/20 rounded-xl p-3 text-rose-900 dark:text-rose-200 text-sm font-medium">
                          {f}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {ai.urgency && (
                   <div className="flex items-center gap-3 bg-background border border-border p-3 rounded-xl inline-flex shadow-xs">
                     <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Urgency Level</span>
                     <span className="font-black text-sm capitalize">{ai.urgency}</span>
                   </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function DiagnosisLogsPage() {
  const [page, setPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState(null);

  const { data, isLoading } = useGetDiagnosisLogsQuery({ page, limit: 15 });
  const logs = data?.data?.logs ?? [];
  const pagination = data?.data?.pagination ?? {};

  if (selectedLog) {
    return <LogDetail log={selectedLog} onBack={() => setSelectedLog(null)} />;
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-linear-to-br from-teal-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center border border-teal-500/30 shadow-inner">
            <ClipboardList className="w-7 h-7 text-teal-600" />
          </div>
          <div>
            <h1 className="text-3xl font-black font-heading tracking-tight text-foreground">Diagnosis Logs</h1>
            <p className="text-[15px] font-medium text-muted-foreground mt-1 text-balance">Historical records of all AI-assisted diagnostic sessions.</p>
          </div>
        </div>
      </div>

      <Card className="rounded-3xl border-border/50 bg-background/60 backdrop-blur-xl shadow-sm overflow-hidden">
        <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
           {/* Legend */}
           <div className="flex flex-wrap gap-2">
              {Object.values(TYPE_LABELS).map(({ label, color, icon: Icon }) => (
                <span key={label} className={`inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border ${color}`}>
                  <Icon className="w-3.5 h-3.5 opacity-70" />{label}
                </span>
              ))}
            </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {/* List */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <Loader2 className="w-8 h-8 animate-spin text-teal-600 mb-4" />
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Loading Logs...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="py-20">
               <EmptyState
                title="No AI records found"
                description="Run a Symptom Check or Risk Scan to populate this log."
                icon={Brain}
              />
            </div>
          ) : (
            <div className="space-y-3">
              {logs.map((log) => (
                <LogCard key={log._id} log={log} onClick={() => setSelectedLog(log)} />
              ))}
            </div>
          )}
        </CardContent>
        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <CardFooter className="border-t border-border/50 bg-muted/10 p-4 flex items-center justify-between">
            <p className="text-[13px] font-bold text-muted-foreground">
              Page <span className="text-foreground">{pagination.page}</span> of {pagination.totalPages} <span className="opacity-50">({pagination.total} total)</span>
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="rounded-xl font-bold" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</Button>
              <Button variant="outline" size="sm" className="rounded-xl font-bold" disabled={page >= pagination.totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
