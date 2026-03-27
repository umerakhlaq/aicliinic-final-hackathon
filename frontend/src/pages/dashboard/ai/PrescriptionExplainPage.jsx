import { useState } from "react";
import { useExplainPrescriptionMutation } from "@/features/ai/aiApi";
import { useGetPrescriptionsQuery } from "@/features/prescriptions/prescriptionApi";
import { PrescriptionExplanationCard } from "@/components/ai/AIResponseCard";
import { BookOpen, Loader2, AlertTriangle, Languages, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function PrescriptionExplainPage() {
  const [prescriptionId, setPrescriptionId] = useState("");
  const [language, setLanguage] = useState("english");
  const [result, setResult] = useState(null);

  const { data: rxData } = useGetPrescriptionsQuery({ limit: 100 });
  const [explain, { isLoading }] = useExplainPrescriptionMutation();

  const prescriptions = rxData?.data?.prescriptions || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prescriptionId) return;

    const res = await explain({ prescriptionId, language }).unwrap().catch(() => null);
    if (res?.data) setResult(res.data);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-linear-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl flex items-center justify-center border border-emerald-500/30 shadow-inner">
            <BookOpen className="w-7 h-7 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-3xl font-black font-heading tracking-tight text-foreground">Prescription Explainer</h1>
            <p className="text-[15px] font-medium text-muted-foreground mt-1 text-balance">Generate patient-friendly, localized explanations of complex medical terms.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form */}
        <div className="lg:col-span-5">
          <Card className="rounded-3xl border-border/50 bg-background/60 backdrop-blur-xl shadow-sm overflow-hidden h-full">
            <div className="h-1.5 w-full bg-linear-to-r from-emerald-500 to-teal-500" />
            <CardHeader className="pb-4 bg-muted/20 border-b border-border/50">
               <CardTitle className="text-lg font-black tracking-tight flex items-center gap-2">
                 <Sparkles className="h-5 w-5 text-emerald-600" /> Configuration
               </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Prescription select */}
                <div className="space-y-2">
                  <Label className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest">Select Prescription Record</Label>
                  <select
                    required
                    value={prescriptionId}
                    onChange={(e) => setPrescriptionId(e.target.value)}
                    className="w-full h-12 px-3 rounded-xl border border-border/50 bg-background text-sm shadow-xs focus-visible:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  >
                    <option value="">Choose a recent prescription...</option>
                    {prescriptions.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.patientId?.name || "Patient"} — {p.diagnosis} ({format(new Date(p.createdAt), "dd MMM yyyy")})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Selected prescription preview - styled elegantly */}
                {prescriptionId && (() => {
                  const rx = prescriptions.find((p) => p._id === prescriptionId);
                  if (!rx) return null;
                  return (
                    <div className="p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/20 text-sm relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-3 opacity-10">
                        <BookOpen className="w-16 h-16" />
                      </div>
                      <p className="font-black text-emerald-950 dark:text-emerald-50 text-base relative z-10">{rx.diagnosis}</p>
                      <p className="text-emerald-700/80 dark:text-emerald-300 font-bold text-xs mt-1 relative z-10 flex items-center gap-1.5 flex-wrap">
                        <span className="bg-emerald-500/20 px-2 py-0.5 rounded-md">{rx.medicines?.length || 0} meds</span> 
                        <span>• By Dr. {rx.doctorId?.name || "—"}</span>
                      </p>
                    </div>
                  );
                })()}

                {/* Language */}
                <div className="space-y-2 pt-2 border-t border-border/50">
                  <Label className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest flex items-center gap-1.5 mt-4">
                    <Languages className="w-3.5 h-3.5" /> Output Language
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    {["english", "urdu"].map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => setLanguage(lang)}
                        className={`py-3 rounded-xl text-[13px] font-black tracking-wide border-2 transition-all capitalize hover:scale-[1.02] ${
                          language === lang
                            ? "bg-emerald-600/10 text-emerald-700 border-emerald-600 dark:text-emerald-400"
                            : "bg-background text-muted-foreground border-border/50 hover:border-emerald-500/30 hover:bg-emerald-500/5"
                        }`}
                      >
                        {lang === "urdu" ? "اردو (Urdu)" : "English"}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !prescriptionId}
                  className="w-full h-14 rounded-xl font-bold text-base bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-500/20 text-white border-0 transition-transform hover:scale-[1.02] disabled:hover:scale-100 mt-4"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Translating Clinical Data...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate Plain-Text Explanation
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Result Area */}
        <div className="lg:col-span-7">
          {!result && !isLoading && (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-8 bg-muted/10 rounded-3xl border-2 border-dashed border-border/60">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6 border-8 border-background">
                <BookOpen className="w-10 h-10 text-muted-foreground opacity-50" />
              </div>
              <h3 className="text-xl font-black text-foreground mb-2">Ready to Explain</h3>
              <p className="text-muted-foreground text-sm max-w-sm text-balance">Select a prescription and preferred language to let AI generate a friendly, easy-to-understand breakdown for the patient.</p>
            </div>
          )}

          {isLoading && (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center p-8 bg-background/40 backdrop-blur-xl rounded-3xl border border-border/50 shadow-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 animate-pulse" />
              <div className="relative flex flex-col items-center">
                <div className="mb-6 relative">
                  <div className="h-20 w-20 rounded-full border-4 border-muted flex items-center justify-center">
                     <Languages className="w-8 h-8 text-emerald-600 animate-pulse" />
                  </div>
                  <svg className="absolute inset-0 h-20 w-20 animate-spin text-emerald-500" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="150" strokeDashoffset="50" strokeLinecap="round" />
                  </svg>
                </div>
                <h3 className="text-xl font-black text-foreground">Translating Medical Jargon</h3>
                <p className="text-muted-foreground font-bold tracking-widest uppercase text-xs mt-2 opacity-60">Preparing {language} narrative...</p>
              </div>
            </div>
          )}

          {result && !isLoading && (
            <div className="animate-in fade-in fill-mode-both zoom-in-95 duration-500 h-full">
              {result.aiFailed ? (
                 <Card className="rounded-3xl border-amber-500/30 bg-amber-500/5 shadow-sm text-amber-950 dark:text-amber-100">
                    <CardContent className="p-8 flex flex-col items-center text-center">
                     <AlertTriangle className="w-12 h-12 text-amber-500 mb-4" />
                     <h3 className="text-xl font-black">AI Translation Offline</h3>
                     <p className="text-amber-700/70 dark:text-amber-300 max-w-sm mt-2 text-sm">The explainer model is currently unavailable. Please check your connection or try again later.</p>
                    </CardContent>
                 </Card>
              ) : (
                <PrescriptionExplanationCard explanation={result.explanation} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
