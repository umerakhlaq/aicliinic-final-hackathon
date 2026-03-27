import StatusBadge from "@/components/shared/StatusBadge";
import { AlertTriangle, CheckCircle, Info, Lightbulb, Stethoscope, FlaskConical, Clock, ShieldAlert, Sparkles, ActivitySquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Reusable section component with premium look
const Section = ({ icon: Icon, title, children, className = "", color = "teal" }) => {
  const colorMap = {
    teal: "text-teal-600 border-teal-500/20 bg-teal-500/5",
    emerald: "text-emerald-600 border-emerald-500/20 bg-emerald-500/5",
    rose: "text-rose-600 border-rose-500/20 bg-rose-500/5",
    amber: "text-amber-600 border-amber-500/20 bg-amber-500/5",
  };
  
  const iconColorMap = {
    teal: "text-teal-600",
    emerald: "text-emerald-600",
    rose: "text-rose-600",
    amber: "text-amber-600",
  }

  return (
    <div className={`rounded-2xl border border-border/50 bg-background/50 shadow-xs backdrop-blur-sm p-5 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <div className={`p-1.5 rounded-lg border flex items-center justify-center shrink-0 ${colorMap[color]}`}>
           <Icon className={`w-4 h-4 ${iconColorMap[color]}`} />
        </div>
        <h4 className="font-bold text-sm tracking-tight text-foreground uppercase tracking-widest text-[11px]">{title}</h4>
      </div>
      {children}
    </div>
  );
};

const ProbabilityDot = ({ level }) => {
  const color = level === "high" ? "bg-rose-500 shadow-rose-500/40" : level === "medium" ? "bg-amber-500 shadow-amber-500/40" : "bg-emerald-500 shadow-emerald-500/40";
  return <span className={`inline-block w-2.5 h-2.5 rounded-full shadow-lg ${color} mr-3 shrink-0`} />;
};

/**
 * AIResponseCard renders the AI response for symptom checker
 */
export const SymptomCheckerCard = ({ response }) => {
  if (!response) return null;
  if (response.parseError) {
    return (
      <Card className="bg-background rounded-3xl border border-border/50 p-6 shadow-sm">
        <p className="text-sm text-muted-foreground whitespace-pre-wrap font-mono">{response.raw}</p>
      </Card>
    );
  }

  const urgencyColors = {
    routine: "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400",
    soon: "bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400",
    urgent: "bg-orange-500/10 border-orange-500/20 text-orange-700 dark:text-orange-400",
    emergency: "bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-400 animate-pulse",
  };

  return (
    <Card className="bg-background/80 backdrop-blur-xl rounded-3xl border border-border/50 shadow-lg overflow-hidden flex flex-col h-full">
      <div className="h-2 w-full bg-linear-to-r from-teal-500 via-emerald-500 to-teal-400" />
      {/* Header */}
      <div className="bg-muted/10 px-6 py-5 flex items-center justify-between border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-teal-600" />
          </div>
          <h3 className="font-black text-lg text-foreground tracking-tight">AI Differential Diagnosis</h3>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest">Risk Assessment</span>
          <StatusBadge status={response.riskLevel} />
        </div>
      </div>

      <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
        {/* Urgency Banner */}
        {response.urgency && (
          <div className={`md:col-span-2 rounded-xl border px-4 py-3.5 flex items-center gap-3 text-sm font-black uppercase tracking-widest ${urgencyColors[response.urgency] || urgencyColors.routine}`}>
            <Clock className="w-5 h-5 shrink-0" />
            <span>Recommended Urgency:</span> <span className="ml-auto">{response.urgency}</span>
          </div>
        )}

        {/* Possible Conditions */}
        {response.possibleConditions?.length > 0 && (
          <Section icon={Stethoscope} title="Potential Conditions" className="md:col-span-2" color="teal">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {response.possibleConditions.map((c, i) => (
                <div key={i} className="flex items-start p-4 bg-background border border-border/50 rounded-xl shadow-xs transition-colors hover:border-teal-500/30">
                  <ProbabilityDot level={c.probability} />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                      <span className="font-black text-foreground text-[15px] truncate">{c.name}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-muted text-muted-foreground uppercase tracking-widest shrink-0">{c.probability}</span>
                    </div>
                    {c.description && <p className="text-[13px] text-muted-foreground leading-snug line-clamp-2" title={c.description}>{c.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Recommended Tests */}
        {response.recommendedTests?.length > 0 && (
          <Section icon={FlaskConical} title="Recommended Clinical Tests" color="teal">
            <div className="flex flex-wrap gap-2">
              {response.recommendedTests.map((t, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 text-[13px] font-bold text-teal-700 dark:text-teal-300 bg-teal-500/10 border border-teal-500/20 px-3 py-1.5 rounded-lg">
                  <span className="w-1.5 h-1.5 bg-teal-500 rounded-full shrink-0" />
                  {t}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* General Advice */}
        {response.generalAdvice && (
          <Section icon={Lightbulb} title="Clinical Guidance" color="amber">
            <p className="text-[14px] text-muted-foreground leading-relaxed font-medium">{response.generalAdvice}</p>
          </Section>
        )}
      </CardContent>

      {/* Disclaimer */}
      {response.disclaimer && (
        <div className="mx-6 mb-6 mt-auto flex items-start gap-3 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700/80 dark:text-amber-300 font-medium leading-relaxed">{response.disclaimer}</p>
        </div>
      )}
    </Card>
  );
};

/**
 * Prescription Explanation Card
 */
export const PrescriptionExplanationCard = ({ explanation }) => {
  if (!explanation) return null;
  if (explanation.parseError) {
    return (
      <Card className="bg-background rounded-3xl border border-border/50 p-6 shadow-sm">
        <p className="text-sm text-muted-foreground whitespace-pre-wrap font-mono">{explanation.raw}</p>
      </Card>
    );
  }

  return (
    <Card className="bg-background/80 backdrop-blur-xl rounded-3xl border border-border/50 shadow-lg overflow-hidden flex flex-col h-full">
      <div className="h-2 w-full bg-linear-to-r from-emerald-500 via-teal-500 to-emerald-400" />
      <div className="bg-muted/10 px-6 py-5 flex items-center justify-between border-b border-border/50">
         <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="font-black text-lg text-foreground tracking-tight">Patient Prescription Guide</h3>
        </div>
      </div>

      <CardContent className="p-6 space-y-5 flex-1 overflow-y-auto">
        {/* Summary */}
        {explanation.summary && (
          <div className="p-5 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5"><Sparkles className="w-20 h-20" /></div>
            <p className="text-[15px] font-medium text-emerald-900 dark:text-emerald-100 leading-relaxed relative z-10">{explanation.summary}</p>
          </div>
        )}

        {/* Medicine Explanations */}
        {explanation.medicineExplanations?.length > 0 && (
          <Section icon={FlaskConical} title="Medication Details" color="emerald">
            <div className="space-y-3">
              {explanation.medicineExplanations.map((m, i) => (
                <div key={i} className="p-4 bg-background border border-border/50 rounded-xl shadow-xs">
                  <div className="font-black text-[15px] text-foreground mb-2 flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-emerald-500" />
                     {m.name}
                  </div>
                  <div className="text-[14px] text-muted-foreground mb-2"><span className="font-bold text-foreground">Purpose:</span> {m.purpose}</div>
                  {m.importantTips && (
                    <div className="text-[13px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2 mt-2">
                      <Sparkles className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
                      {m.importantTips}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Lifestyle Recommendations */}
          {explanation.lifestyleRecommendations?.length > 0 && (
            <Section icon={Lightbulb} title="Lifestyle Adjustments" color="amber">
              <ul className="space-y-2.5">
                {explanation.lifestyleRecommendations.map((r, i) => (
                  <li key={i} className="flex items-start gap-3 text-[14px] font-medium text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    {r}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* Preventive Advice */}
          {explanation.preventiveAdvice?.length > 0 && (
            <Section icon={ShieldAlert} title="Preventive Care" color="teal">
              <ul className="space-y-2.5">
                {explanation.preventiveAdvice.map((a, i) => (
                  <li key={i} className="flex items-start gap-3 text-[14px] font-medium text-muted-foreground">
                    <ShieldAlert className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                    {a}
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </div>

        {/* When to see doctor */}
        {explanation.whenToSeeDoctor && (
          <div className="flex items-start gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl shadow-xs">
            <ActivitySquare className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest text-rose-700/80 dark:text-rose-300 mb-1">Seek Medical Attention If:</p>
              <p className="text-[14px] font-bold text-rose-900 dark:text-rose-200">{explanation.whenToSeeDoctor}</p>
            </div>
          </div>
        )}
      </CardContent>

      {explanation.disclaimer && (
        <div className="mx-6 mb-6 mt-auto flex items-start gap-3 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
          <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700/80 dark:text-amber-300 font-medium leading-relaxed">{explanation.disclaimer}</p>
        </div>
      )}
    </Card>
  );
};

/**
 * Risk Analysis Card
 */
export const RiskAnalysisCard = ({ riskAnalysis }) => {
  if (!riskAnalysis) return null;
  if (riskAnalysis.parseError) {
    return (
      <Card className="bg-background rounded-3xl border border-border/50 p-6 shadow-sm">
        <p className="text-sm text-muted-foreground whitespace-pre-wrap font-mono">{riskAnalysis.raw}</p>
      </Card>
    );
  }

  return (
    <Card className="bg-background/80 backdrop-blur-xl rounded-3xl border border-border/50 shadow-lg overflow-hidden flex flex-col h-full">
      <div className="h-2 w-full bg-linear-to-r from-rose-500 via-orange-500 to-rose-400" />
      <div className="bg-muted/10 px-6 py-5 flex items-center justify-between border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
             <ActivitySquare className="w-5 h-5 text-rose-600" />
          </div>
          <h3 className="font-black text-lg text-foreground tracking-tight">Risk Assessment Report</h3>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest">Calculated Risk</span>
          <StatusBadge status={riskAnalysis.overallRisk} />
        </div>
      </div>

      <CardContent className="p-6 space-y-5 flex-1 overflow-y-auto">
        {/* Summary */}
        {riskAnalysis.summary && (
          <div className="p-5 bg-background border border-border/50 rounded-2xl shadow-xs">
            <p className="text-[15px] text-foreground font-medium leading-relaxed">{riskAnalysis.summary}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Red Flags */}
          {riskAnalysis.redFlags?.length > 0 && (
            <Section icon={AlertTriangle} title="Critical Red Flags" color="rose">
              <ul className="space-y-2.5">
                {riskAnalysis.redFlags.map((f, i) => (
                  <li key={i} className="flex items-start gap-3 p-3 bg-background rounded-lg border border-border/50 text-[14px] font-bold text-rose-900 dark:text-rose-200">
                    <ActivitySquare className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* Chronic Risks */}
          {riskAnalysis.chronicRisks?.length > 0 && (
            <Section icon={Info} title="Chronic Health Risks" color="amber">
              <ul className="space-y-2.5">
                {riskAnalysis.chronicRisks.map((r, i) => (
                  <li key={i} className="flex items-start gap-3 p-3 bg-background rounded-lg border border-border/50 text-[14px] font-bold text-amber-900 dark:text-amber-200">
                    <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    {r}
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </div>

        {/* Recommendations */}
        {riskAnalysis.recommendations?.length > 0 && (
          <Section icon={CheckCircle} title="Clinical Action Plan" color="emerald">
            <ul className="space-y-2.5">
              {riskAnalysis.recommendations.map((r, i) => (
                <li key={i} className="flex items-start gap-3 bg-emerald-500/5 px-4 py-3 rounded-lg border border-emerald-500/20 text-[14px] font-medium text-emerald-900 dark:text-emerald-100">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  {r}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Follow-up */}
        {riskAnalysis.followUpSuggested && (
          <div className="flex items-center justify-between p-4 bg-teal-500/10 border border-teal-500/20 rounded-xl shadow-xs text-teal-900 dark:text-teal-100">
            <div className="flex items-center gap-3">
               <Clock className="w-5 h-5 text-teal-600" />
               <span className="font-bold text-[15px]">Follow-up Priority Protocol Suggested</span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-teal-500/20 rounded-md">Action Required</span>
          </div>
        )}
      </CardContent>

      {riskAnalysis.disclaimer && (
        <div className="mx-6 mb-6 mt-auto flex items-start gap-3 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700/80 dark:text-amber-300 font-medium leading-relaxed">{riskAnalysis.disclaimer}</p>
        </div>
      )}
    </Card>
  );
};
