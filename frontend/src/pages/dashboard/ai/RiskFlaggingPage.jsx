import { useState } from "react";
import { useRunRiskFlaggingMutation } from "@/features/ai/aiApi";
import { useGetPatientsQuery } from "@/features/patients/patientApi";
import { RiskAnalysisCard } from "@/components/ai/AIResponseCard";
import { ProLock } from "@/components/shared/ProBadge";
import { useSelector } from "react-redux";
import { ShieldAlert, Loader2, AlertTriangle, Search, ActivitySquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function RiskFlaggingPage() {
  const user = useSelector((s) => s.auth.user);
  const isPro = user?.subscriptionPlan === "pro";

  const [patientId, setPatientId] = useState("");
  const [search, setSearch] = useState("");
  const [result, setResult] = useState(null);

  const { data: patientsData } = useGetPatientsQuery({ limit: 100 }, { skip: !isPro });
  const [runRisk, { isLoading }] = useRunRiskFlaggingMutation();

  if (!isPro) {
    return (
      <div className="max-w-2xl mx-auto mt-10">
        <ProLock
          feature="AI Risk Flagging"
          description="Analyze patient health history for risk patterns, red flags, and chronic condition monitoring with AI-powered insights."
        />
      </div>
    );
  }

  const patients = (patientsData?.data?.patients || []).filter(
    (p) => !search || p.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedPatient = patients.find((p) => p._id === patientId) ||
    (patientsData?.data?.patients || []).find((p) => p._id === patientId);

  const handleAnalyze = async () => {
    if (!patientId) return;
    try {
      const res = await runRisk({ patientId }).unwrap();
      setResult(res?.data ?? res);
    } catch (err) {
      setResult({ aiFailed: true, error: err?.data?.message || "Request failed" });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-linear-to-br from-rose-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center border border-rose-500/30 shadow-inner relative">
            <ShieldAlert className="w-7 h-7 text-rose-600" />
            <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-500 animate-pulse border-2 border-background" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black font-heading tracking-tight text-foreground">Risk Flagging</h1>
              <span className="px-3 py-1 bg-linear-to-r from-amber-500 to-orange-600 text-white text-[11px] font-black tracking-widest uppercase rounded-full shadow-sm">
                Pro
              </span>
            </div>
            <p className="text-[15px] font-medium text-muted-foreground mt-1 text-balance">Scan patient history for anomalies, critical risks, and early warning signs.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Patient Selection */}
        <div className="lg:col-span-4">
           <Card className="rounded-3xl border-border/50 bg-background/60 backdrop-blur-xl shadow-sm overflow-hidden h-full flex flex-col">
            <div className="h-1.5 w-full bg-linear-to-r from-rose-500 to-orange-500" />
            <CardHeader className="pb-4 bg-muted/20 border-b border-border/50 shrink-0">
               <CardTitle className="text-lg font-black tracking-tight flex items-center gap-2">
                 <Search className="h-5 w-5 text-rose-600" /> Select Patient
               </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1 flex flex-col min-h-0">
              {/* Search */}
              <div className="p-4 border-b border-border/50 shrink-0 bg-background">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name..."
                    className="pl-9 h-11 rounded-xl border-border/50 bg-muted/50 focus-visible:ring-rose-500/50"
                  />
                </div>
              </div>

              {/* Patient list */}
              <div className="flex-1 overflow-y-auto p-2 space-y-1 min-h-[300px] max-h-[400px]">
                {patients.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                    <Search className="w-8 h-8 opacity-20 mb-2" />
                    <p className="text-sm font-medium">No patients found</p>
                  </div>
                ) : (
                  patients.map((p) => (
                    <button
                      key={p._id}
                      type="button"
                      onClick={() => { setPatientId(p._id); setResult(null); }}
                      className={`w-full p-3 rounded-xl text-left transition-all border ${
                        patientId === p._id 
                          ? "bg-rose-500/10 border-rose-500/30 shadow-xs" 
                          : "bg-transparent border-transparent hover:bg-muted"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="font-bold text-sm text-foreground truncate pl-1">{p.name}</div>
                        {patientId === p._id && <div className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 pl-1 font-medium flex gap-1.5 items-center flex-wrap">
                        {p.age}y <span className="opacity-40">•</span> {p.gender}
                        {p.bloodGroup && <><span className="opacity-40">•</span> <span className="text-rose-600 font-bold">{p.bloodGroup}</span></>}
                      </div>
                    </button>
                  ))
                )}
              </div>
              
              <div className="p-4 border-t border-border/50 bg-background shrink-0 space-y-4">
                 {/* Selected patient summary */}
                {selectedPatient ? (
                  <div className="p-3 bg-linear-to-br from-rose-500/10 to-transparent rounded-xl border border-rose-500/20">
                    <p className="font-black text-rose-950 dark:text-rose-100 text-sm">Target: {selectedPatient.name}</p>
                    <p className="text-[11px] font-bold tracking-wide text-rose-700/80 dark:text-rose-300 mt-1 uppercase">
                      Age {selectedPatient.age} 
                      {selectedPatient.allergies?.length > 0 && ` | Allergies: ${selectedPatient.allergies.join(", ")}`}
                      {selectedPatient.chronicConditions?.length > 0 && ` | ${selectedPatient.chronicConditions.join(", ")}`}
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-muted/50 rounded-xl border border-dashed border-border text-center">
                    <p className="text-xs text-muted-foreground font-medium">Select a patient above to analyze.</p>
                  </div>
                )}
                
                <Button
                  onClick={handleAnalyze}
                  disabled={isLoading || !patientId}
                  className="w-full h-12 rounded-xl font-bold bg-linear-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 shadow-lg shadow-rose-500/20 text-white border-0 transition-all hover:scale-[1.02] disabled:hover:scale-100"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Scanning History...
                    </>
                  ) : (
                    <>
                      <ActivitySquare className="w-5 h-5 mr-2" />
                      Run Risk Scan
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Result Area */}
        <div className="lg:col-span-8">
          {!result && !isLoading && (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-8 bg-muted/10 rounded-3xl border-2 border-dashed border-border/60">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6 border-8 border-background relative">
                <ShieldAlert className="w-10 h-10 text-muted-foreground opacity-50" />
              </div>
              <h3 className="text-xl font-black text-foreground mb-2">Awaiting Target Selection</h3>
              <p className="text-muted-foreground text-sm max-w-sm text-balance">Select a patient from the directory to continuously monitor their entire medical history for potential hidden risks.</p>
            </div>
          )}

          {isLoading && (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center p-8 bg-background/40 backdrop-blur-xl rounded-3xl border border-border/50 shadow-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-rose-500/5 to-transparent animate-pulse" />
              <div className="relative flex flex-col items-center">
                <div className="mb-6 relative">
                  <div className="h-20 w-20 rounded-full border-4 border-muted flex items-center justify-center">
                     <ActivitySquare className="w-8 h-8 text-rose-600 animate-pulse" />
                  </div>
                  <svg className="absolute inset-0 h-20 w-20 animate-spin text-rose-500" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="150" strokeDashoffset="50" strokeLinecap="round" />
                  </svg>
                </div>
                <h3 className="text-xl font-black text-foreground">Scanning Medical History</h3>
                <p className="text-muted-foreground font-bold tracking-widest uppercase text-xs mt-2 opacity-60">Triaging risk factors...</p>
              </div>
            </div>
          )}

          {result && !isLoading && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full">
              {result.aiFailed ? (
                 <Card className="rounded-3xl border-amber-500/30 bg-amber-500/5 shadow-sm text-amber-950 dark:text-amber-100">
                    <CardContent className="p-8 flex flex-col items-center text-center">
                     <AlertTriangle className="w-12 h-12 text-amber-500 mb-4" />
                     <h3 className="text-xl font-black">AI Scanner Offline</h3>
                     <p className="text-amber-700/70 dark:text-amber-300 max-w-sm mt-2 text-sm">The background risk evaluation engine is temporarily down. Please evaluate the patient manually.</p>
                    </CardContent>
                 </Card>
              ) : (
                <RiskAnalysisCard riskAnalysis={result.riskAnalysis} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
