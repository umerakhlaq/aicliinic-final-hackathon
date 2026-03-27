import { useState } from "react";
import { useRunSymptomCheckerMutation, useGetDiagnosisLogsQuery } from "@/features/ai/aiApi";
import { useGetPatientsQuery } from "@/features/patients/patientApi";
import { SymptomCheckerCard } from "@/components/ai/AIResponseCard";
import StatusBadge from "@/components/shared/StatusBadge";
import { Brain, Plus, X, Loader2, AlertTriangle, ChevronRight, ClipboardList, Stethoscope } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const GENDER_OPTIONS = ["male", "female", "other"];

export default function SymptomCheckerPage() {
  const [form, setForm] = useState({
    patientId: "",
    age: "",
    gender: "",
    medicalHistory: "",
    doctorNotes: "",
  });
  const [symptomInput, setSymptomInput] = useState("");
  const [symptoms, setSymptoms] = useState([]);
  const [aiResult, setAiResult] = useState(null);
  const [activeTab, setActiveTab] = useState("checker"); // checker | logs

  const { data: patientsData } = useGetPatientsQuery({ limit: 100 });
  const { data: logsData, isLoading: logsLoading } = useGetDiagnosisLogsQuery(
    { page: 1, limit: 20 },
    { skip: activeTab !== "logs" }
  );
  const [runCheck, { isLoading }] = useRunSymptomCheckerMutation();

  const patients = patientsData?.data?.patients || [];

  const addSymptom = () => {
    const s = symptomInput.trim();
    if (s && !symptoms.includes(s)) {
      setSymptoms((prev) => [...prev, s]);
      setSymptomInput("");
    }
  };

  const removeSymptom = (s) => setSymptoms((prev) => prev.filter((x) => x !== s));

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSymptom();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (symptoms.length === 0) return;

    const payload = {
      patientId: form.patientId,
      symptoms,
      age: parseInt(form.age),
      gender: form.gender,
      medicalHistory: form.medicalHistory || undefined,
      doctorNotes: form.doctorNotes || undefined,
    };

    const res = await runCheck(payload).unwrap().catch(() => null);
    if (res?.data) {
      setAiResult(res.data);
    }
  };

  const logs = logsData?.data?.logs || [];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-linear-to-br from-teal-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center border border-teal-500/30 shadow-inner">
            <Brain className="w-7 h-7 text-teal-600" />
          </div>
          <div>
            <h1 className="text-3xl font-black font-heading tracking-tight text-foreground">AI Symptom Checker</h1>
            <p className="text-[15px] font-medium text-muted-foreground mt-1 text-balance">Get advanced preliminary clinical analysis powered by AI.</p>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-2 bg-muted/50 p-1.5 rounded-xl border border-border/50 shrink-0">
          {[
            { id: "checker", label: "Diagnostic AI", icon: Stethoscope },
            { id: "logs", label: "Patient Logs", icon: ClipboardList },
          ].map((tab) => {
             const Icon = tab.icon;
             return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                  activeTab === tab.id
                    ? "bg-background text-teal-600 shadow-sm border border-border/50"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {activeTab === "checker" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form */}
          <div className="lg:col-span-5">
            <Card className="rounded-3xl border-border/50 bg-background/60 backdrop-blur-xl shadow-sm overflow-hidden h-full">
              <div className="h-1.5 w-full bg-linear-to-r from-teal-500 to-emerald-500" />
              <CardHeader className="pb-4 bg-muted/20 border-b border-border/50">
                 <CardTitle className="text-lg font-black tracking-tight">Clinical Input</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Patient */}
                  <div className="space-y-2">
                    <Label className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest">Select Patient Profile</Label>
                    <select
                      required
                      value={form.patientId}
                      onChange={(e) => setForm((f) => ({ ...f, patientId: e.target.value }))}
                      className="w-full h-12 px-3 rounded-xl border border-border/50 bg-background text-sm shadow-xs focus-visible:outline-none focus:ring-2 focus:ring-teal-500/50"
                    >
                      <option value="">Choose patient...</option>
                      {patients.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.name} — {p.age}y, {p.gender}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Age + Gender */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest">Current Age</Label>
                      <Input
                        type="number" required min="0" max="150"
                        value={form.age}
                        onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))}
                        placeholder="35"
                        className="h-12 rounded-xl border-border/50 bg-background shadow-xs focus-visible:ring-teal-500/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest">Biological Gender</Label>
                      <select
                        required
                        value={form.gender}
                        onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
                        className="w-full h-12 px-3 rounded-xl border border-border/50 bg-background text-sm shadow-xs focus-visible:outline-none focus:ring-2 focus:ring-teal-500/50"
                      >
                        <option value="">Select...</option>
                        {GENDER_OPTIONS.map((g) => (
                          <option key={g} value={g} className="capitalize">{g}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Symptoms */}
                  <div className="space-y-2 pt-2">
                    <Label className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest flex justify-between">
                      <span>Reported Symptoms <span className="text-rose-500">*</span></span>
                      {symptoms.length > 0 && <span className="font-black text-teal-600">{symptoms.length} Added</span>}
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        value={symptomInput}
                        onChange={(e) => setSymptomInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type symptom and press Enter..."
                        className="h-12 rounded-xl border-border/50 bg-background shadow-xs focus-visible:ring-teal-500/50"
                      />
                      <Button
                        type="button"
                        onClick={addSymptom}
                        className="h-12 w-12 rounded-xl bg-teal-600 hover:bg-teal-700 text-white shrink-0"
                      >
                        <Plus className="w-5 h-5" />
                      </Button>
                    </div>
                    
                    {symptoms.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-3 p-4 bg-muted/30 rounded-xl border border-border/50 mt-2">
                        {symptoms.map((s) => (
                          <span key={s} className="flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 bg-background border border-border shadow-xs text-foreground text-[13px] font-bold rounded-lg group">
                            {s}
                            <button type="button" onClick={() => removeSymptom(s)} className="text-muted-foreground hover:text-rose-500 hover:bg-rose-50 rounded-md p-1 transition-colors">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Medical History */}
                  <div className="space-y-2">
                    <Label className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest">Medical History</Label>
                    <textarea
                      value={form.medicalHistory}
                      onChange={(e) => setForm((f) => ({ ...f, medicalHistory: e.target.value }))}
                      rows={2}
                      placeholder="Past surgeries, chronic conditions... (Optional)"
                      className="w-full border border-border/50 bg-background rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 resize-none shadow-xs"
                    />
                  </div>

                  {/* Doctor Notes */}
                  <div className="space-y-2">
                    <Label className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest">Physician Notes</Label>
                    <textarea
                      value={form.doctorNotes}
                      onChange={(e) => setForm((f) => ({ ...f, doctorNotes: e.target.value }))}
                      rows={2}
                      placeholder="Additional clinical observations... (Optional)"
                      className="w-full border border-border/50 bg-background rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 resize-none shadow-xs"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading || symptoms.length === 0}
                    className="w-full h-14 rounded-xl font-bold text-base bg-linear-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 shadow-lg shadow-teal-500/20 text-white border-0 transition-transform hover:scale-[1.02] disabled:hover:scale-100"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Processing via Engine...
                      </>
                    ) : (
                      <>
                        <Brain className="w-5 h-5 mr-2" />
                        Run AI Diagnostic Analysis
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Result */}
          <div className="lg:col-span-7">
            {!aiResult && !isLoading && (
              <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-8 bg-muted/10 rounded-3xl border-2 border-dashed border-border/60">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6 border-8 border-background">
                  <Brain className="w-10 h-10 text-muted-foreground opacity-50" />
                </div>
                <h3 className="text-xl font-black text-foreground mb-2">Awaiting Clinical Data</h3>
                <p className="text-muted-foreground text-sm max-w-sm text-balance">Input patient symptoms and clinical context on the left to generate an AI-powered list of potential differential diagnoses.</p>
              </div>
            )}

            {isLoading && (
              <div className="h-full min-h-[500px] flex flex-col items-center justify-center p-8 bg-background/40 backdrop-blur-xl rounded-3xl border border-border/50 shadow-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/5 to-emerald-500/5 animate-pulse" />
                <div className="relative flex flex-col items-center">
                  <div className="mb-6 relative">
                    <div className="h-20 w-20 rounded-full border-4 border-muted flex items-center justify-center">
                       <Brain className="w-8 h-8 text-teal-600 animate-pulse" />
                    </div>
                    <svg className="absolute inset-0 h-20 w-20 animate-spin text-teal-500" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="150" strokeDashoffset="50" strokeLinecap="round" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-black text-foreground">Analyzing Clinical Profile</h3>
                  <p className="text-muted-foreground font-bold tracking-widest uppercase text-xs mt-2 opacity-60">Cross-referencing medical database</p>
                </div>
              </div>
            )}

            {aiResult && !isLoading && (
              <div className="animate-in fade-in zoom-in-95 duration-500 h-full">
                {aiResult.aiFailed ? (
                  <Card className="rounded-3xl border-amber-500/30 bg-amber-500/5 shadow-sm text-amber-950 dark:text-amber-100">
                     <CardContent className="p-8 flex flex-col items-center text-center">
                      <AlertTriangle className="w-12 h-12 text-amber-500 mb-4" />
                      <h3 className="text-xl font-black">AI Engine Offline</h3>
                      <p className="text-amber-700/70 dark:text-amber-300 max-w-sm mt-2 text-sm">The primary reasoning engine could not be reached. The diagnosis attempt has been logged. Please use clinical judgement.</p>
                     </CardContent>
                  </Card>
                ) : (
                  <SymptomCheckerCard response={aiResult.aiResponse} />
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "logs" && (
        <Card className="rounded-3xl border-border/50 bg-background/60 backdrop-blur-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border/50 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-500/20 rounded-lg flex items-center justify-center border border-teal-500/30">
                <ClipboardList className="w-5 h-5 text-teal-600" />
              </div>
              <h2 className="text-xl font-black tracking-tight">Recent Diagnosis History</h2>
            </div>
            {logs.length > 0 && (
               <div className="text-xs font-bold text-muted-foreground tracking-widest uppercase bg-background px-3 py-1.5 rounded-full border border-border/50">
                 {logs.length} Records Found
               </div>
            )}
          </div>
          
          <CardContent className="p-0">
            {logsLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
              </div>
            ) : logs.length === 0 ? (
              <div className="py-20 flex flex-col items-center">
                 <ClipboardList className="w-12 h-12 text-muted mb-4" />
                 <p className="font-black text-foreground text-lg">No Records Found</p>
                 <p className="text-muted-foreground text-sm">Diagnosis logs will appear here after analysis.</p>
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {logs.map((log) => (
                  <div key={log._id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors group cursor-pointer">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-linear-to-br from-teal-500/20 to-emerald-500/20 flex items-center justify-center shrink-0 border border-teal-500/20">
                         <span className="font-black text-teal-700 dark:text-teal-400">{(log.patientId?.name || "U").charAt(0)}</span>
                      </div>
                      <div>
                        <div className="text-base font-bold text-foreground group-hover:text-teal-600 transition-colors">{log.patientId?.name || "Unknown Patient"}</div>
                        <div className="text-sm font-medium text-muted-foreground mt-1 flex flex-wrap gap-2 items-center">
                          <span className="flex items-center gap-1.5 bg-background border border-border/50 px-2 py-0.5 rounded-md text-foreground">
                            {format(new Date(log.createdAt), "dd MMM yyyy")}
                          </span>
                          <span className="opacity-50">•</span>
                          <span className="truncate max-w-[200px] sm:max-w-[400px]">
                            {log.symptoms?.join(", ") || "Symptom check"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 self-end sm:self-center">
                      {log.riskLevel && <StatusBadge status={log.riskLevel} />}
                      {log.aiFailed && (
                        <span className="text-[10px] font-bold tracking-widest uppercase text-amber-600 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-md">Failed</span>
                      )}
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-50 group-hover:opacity-100 group-hover:bg-teal-50 group-hover:text-teal-600 transition-all">
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
