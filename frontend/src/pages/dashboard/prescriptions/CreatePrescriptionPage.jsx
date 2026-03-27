import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, User, FileText, Pill, CalendarClock, Loader2, Sparkles, Search, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useGetPatientsQuery } from "@/features/patients/patientApi";
import { useCreatePrescriptionMutation } from "@/features/prescriptions/prescriptionApi";
import { ROUTES } from "@/utils/constants";
import { toast } from "sonner";

const emptyMedicine = { name: "", dosage: "", frequency: "", duration: "", instructions: "" };

const CreatePrescriptionPage = () => {
  const navigate = useNavigate();
  const [patientSearch, setPatientSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isPatientFocused, setIsPatientFocused] = useState(false);
  const [form, setForm] = useState({ diagnosis: "", notes: "", followUpDate: "" });
  const [medicines, setMedicines] = useState([{ ...emptyMedicine }]);
  const [errors, setErrors] = useState({});

  const { data: patientsData } = useGetPatientsQuery({ search: patientSearch, limit: 10 });
  const [createPrescription, { isLoading }] = useCreatePrescriptionMutation();

  const patients = patientsData?.data?.patients || [];

  const handleMedicineChange = (index, field, value) => {
    setMedicines(prev => prev.map((m, i) => i === index ? { ...m, [field]: value } : m));
  };

  const addMedicine = () => setMedicines(prev => [...prev, { ...emptyMedicine }]);
  const removeMedicine = (index) => setMedicines(prev => prev.filter((_, i) => i !== index));

  const validate = () => {
    const newErrors = {};
    if (!selectedPatient) newErrors.patient = "Please select a patient";
    if (!form.diagnosis.trim()) newErrors.diagnosis = "Clinical diagnosis is required";
    if (medicines.some(m => !m.name || !m.dosage || !m.frequency || !m.duration)) {
      newErrors.medicines = "Please complete all required fields for each medicine";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
       toast.error("Please fill in all required fields indicated in red.");
       return;
    }

    try {
      const res = await createPrescription({
        patientId: selectedPatient._id,
        diagnosis: form.diagnosis,
        notes: form.notes,
        followUpDate: form.followUpDate || undefined,
        medicines,
      }).unwrap();
      toast.success("Prescription generated successfully");
      navigate(`${ROUTES.PRESCRIPTIONS}/${res.data.prescription._id}`);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to generate prescription");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate(ROUTES.PRESCRIPTIONS)} className="h-10 w-10 rounded-xl hover:bg-muted border-border/50 shadow-xs">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex flex-col">
          <h1 className="text-3xl font-black font-heading tracking-tight text-foreground flex items-center gap-2">
             Write Prescription <Sparkles className="w-5 h-5 text-teal-500" />
          </h1>
          <p className="text-sm font-medium text-muted-foreground mt-0.5">Draft an official medical document for your patient.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Section 1: Patient Selection */}
        <Card className="rounded-3xl border-border/50 bg-background/60 backdrop-blur-xl shadow-sm overflow-hidden">
          <div className="h-1.5 w-full bg-linear-to-r from-teal-500 to-emerald-500" />
          <CardHeader className="border-b border-border/50 bg-muted/20 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
                 <User className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <CardTitle className="text-xl font-black text-foreground tracking-tight">Patient Information</CardTitle>
                <CardDescription className="text-xs font-bold uppercase tracking-widest mt-0.5">Select the recovering individual</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <div className="space-y-3 relative">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                   Select Patient <span className="text-rose-500">*</span>
                </Label>
                
                {selectedPatient ? (
                   <div className="flex items-center justify-between p-4 bg-teal-500/5 border border-teal-500/20 rounded-2xl">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-teal-500/10 rounded-full flex items-center justify-center border border-teal-500/20">
                            <span className="text-teal-700 font-bold">{selectedPatient.name.charAt(0).toUpperCase()}</span>
                         </div>
                         <div>
                            <p className="font-bold text-teal-950 dark:text-teal-50">{selectedPatient.name}</p>
                            <p className="text-xs font-medium text-teal-800/70 dark:text-teal-200/70">{selectedPatient.age} yrs • {selectedPatient.gender} • {selectedPatient.phone}</p>
                         </div>
                      </div>
                      <Button type="button" variant="ghost" size="sm" onClick={() => setSelectedPatient(null)} className="text-teal-700 hover:text-teal-800 hover:bg-teal-500/10 font-bold rounded-xl h-9">
                         Change Patient
                      </Button>
                   </div>
                ) : (
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search patient by name, phone, or ID..."
                      value={patientSearch}
                      onChange={(e) => setPatientSearch(e.target.value)}
                      onFocus={() => setIsPatientFocused(true)}
                      onBlur={() => setTimeout(() => setIsPatientFocused(false), 200)}
                      className={`pl-10 h-12 rounded-xl border-border/50 bg-muted/50 focus-visible:ring-teal-500/50 text-[15px] font-medium transition-colors ${errors.patient ? "border-rose-500/50 bg-rose-500/5 focus-visible:ring-rose-500/50" : ""}`}
                    />
                    
                    {isPatientFocused && patientSearch && (
                      <div className="absolute top-14 inset-x-0 z-50 bg-background/95 backdrop-blur-xl border border-border rounded-xl overflow-hidden shadow-2xl max-h-60 overflow-y-auto">
                        {patients.length > 0 ? patients.map(p => (
                          <button
                            key={p._id}
                            type="button"
                            className="w-full px-4 py-3 flex items-center justify-between hover:bg-teal-500/10 transition-colors border-b border-border/50 last:border-0"
                            onClick={() => { setSelectedPatient(p); setPatientSearch(""); setIsPatientFocused(false); }}
                          >
                            <span className="font-bold text-sm text-foreground truncate">{p.name}</span>
                            <span className="text-[11px] font-bold tracking-widest text-muted-foreground bg-muted px-2 py-0.5 rounded-md shrink-0">{p.phone}</span>
                          </button>
                        )) : (
                          <div className="p-4 text-center text-sm font-medium text-muted-foreground">No patients found</div>
                        )}
                      </div>
                    )}
                  </div>
                )}
                {errors.patient && !selectedPatient && <p className="text-[11px] font-bold text-rose-500 uppercase tracking-widest">{errors.patient}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Clinical Details */}
        <Card className="rounded-3xl border-border/50 bg-background/60 backdrop-blur-xl shadow-sm overflow-hidden">
          <CardHeader className="border-b border-border/50 bg-muted/20 pb-6">
             <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                 <FileText className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <CardTitle className="text-xl font-black text-foreground tracking-tight">Clinical Diagnosis</CardTitle>
                <CardDescription className="text-xs font-bold uppercase tracking-widest mt-0.5">Primary findings and scheduling</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 md:p-8 space-y-6">
             <div className="space-y-3">
               <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  Primary Diagnosis <span className="text-rose-500">*</span>
               </Label>
               <Input
                 value={form.diagnosis}
                 onChange={(e) => setForm(p => ({ ...p, diagnosis: e.target.value }))}
                 placeholder="e.g., Acute Viral Pharyngitis..."
                 className={`h-12 rounded-xl border-border/50 bg-muted/50 focus-visible:ring-violet-500/50 text-[15px] font-medium px-4 ${errors.diagnosis ? "border-rose-500/50 bg-rose-500/5 focus-visible:ring-rose-500/50" : ""}`}
               />
               {errors.diagnosis && <p className="text-[11px] font-bold text-rose-500 uppercase tracking-widest">{errors.diagnosis}</p>}
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-3">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                     Physician Notes & Advice
                  </Label>
                  <Input 
                    value={form.notes} 
                    onChange={(e) => setForm(p => ({ ...p, notes: e.target.value }))} 
                    placeholder="Rest, hydration, avoid cold drinks..." 
                    className="h-12 rounded-xl border-border/50 bg-muted/50 focus-visible:ring-violet-500/50 text-[15px] font-medium px-4"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                     Follow-up Date 
                  </Label>
                  <Input 
                    type="date" 
                    value={form.followUpDate} 
                    onChange={(e) => setForm(p => ({ ...p, followUpDate: e.target.value }))} 
                    min={new Date().toISOString().split("T")[0]} 
                    className="h-12 rounded-xl border-border/50 bg-muted/50 focus-visible:ring-violet-500/50 text-[15px] font-medium px-4"
                  />
                </div>
             </div>
          </CardContent>
        </Card>

        {/* Section 3: Medications */}
        <Card className="rounded-3xl border-border/50 bg-background/60 backdrop-blur-xl shadow-sm overflow-hidden">
          <CardHeader className="border-b border-border/50 bg-muted/20 pb-6 flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                 <Pill className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <CardTitle className="text-xl font-black text-foreground tracking-tight">Prescribed Medications</CardTitle>
                <CardDescription className="text-xs font-bold uppercase tracking-widest mt-0.5">Drugs, dosage, and regimen instructions</CardDescription>
              </div>
            </div>
            
            <Button type="button" variant="outline" size="sm" onClick={addMedicine} className="h-9 px-4 rounded-xl font-bold border-orange-500/30 text-orange-700 dark:text-orange-400 bg-orange-500/10 hover:bg-orange-500/20 shadow-none">
              <Plus className="h-4 w-4 mr-1.5" /> Add Medicine
            </Button>
          </CardHeader>
          <CardContent className="p-6 md:p-8 space-y-6">
            {errors.medicines && (
               <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                 <p className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest">{errors.medicines}</p>
               </div>
            )}
            
            <div className="space-y-6">
               {medicines.map((med, i) => (
                 <div key={i} className="p-5 sm:p-6 rounded-2xl border border-border/60 bg-muted/20 relative group transition-all hover:border-orange-500/30 hover:shadow-lg hover:shadow-orange-500/5">
                   
                   <div className="absolute -top-3 left-6 px-3 py-1 bg-background border border-border/60 rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-orange-600 transition-colors">
                      Medication {i + 1}
                   </div>

                   {medicines.length > 1 && (
                     <Button type="button" variant="ghost" size="icon" className="absolute -top-3 right-4 h-7 w-7 rounded-full border border-border/50 bg-background text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-600 z-10" onClick={() => removeMedicine(i)}>
                       <Trash2 className="h-3.5 w-3.5" />
                     </Button>
                   )}

                   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-2">
                     <div className="md:col-span-2 space-y-2">
                       <Label className="text-[11px] font-black text-muted-foreground uppercase tracking-wider">Medicine Name *</Label>
                       <Input value={med.name} onChange={(e) => handleMedicineChange(i, "name", e.target.value)} placeholder="e.g., Azithromycin" className="h-11 rounded-xl border-border/50 bg-background font-medium focus-visible:ring-orange-500/50" />
                     </div>
                     <div className="space-y-2">
                       <Label className="text-[11px] font-black text-muted-foreground uppercase tracking-wider">Dosage *</Label>
                       <Input value={med.dosage} onChange={(e) => handleMedicineChange(i, "dosage", e.target.value)} placeholder="e.g., 500mg" className="h-11 rounded-xl border-border/50 bg-background font-medium focus-visible:ring-orange-500/50" />
                     </div>
                     <div className="space-y-2">
                       <Label className="text-[11px] font-black text-muted-foreground uppercase tracking-wider">Duration *</Label>
                       <Input value={med.duration} onChange={(e) => handleMedicineChange(i, "duration", e.target.value)} placeholder="e.g., 5 Days" className="h-11 rounded-xl border-border/50 bg-background font-medium focus-visible:ring-orange-500/50" />
                     </div>
                     <div className="sm:col-span-2 md:col-span-2 space-y-2">
                       <Label className="text-[11px] font-black text-muted-foreground uppercase tracking-wider">Frequency *</Label>
                       <Input value={med.frequency} onChange={(e) => handleMedicineChange(i, "frequency", e.target.value)} placeholder="e.g., 1-0-1 (Morning/Night)" className="h-11 rounded-xl border-border/50 bg-background font-medium focus-visible:ring-orange-500/50" />
                     </div>
                     <div className="sm:col-span-2 md:col-span-2 space-y-2">
                       <Label className="text-[11px] font-black text-muted-foreground uppercase tracking-wider">Special Instructions</Label>
                       <Input value={med.instructions} onChange={(e) => handleMedicineChange(i, "instructions", e.target.value)} placeholder="e.g., Take strictly after meals" className="h-11 rounded-xl border-border/50 bg-background font-medium focus-visible:ring-orange-500/50" />
                     </div>
                   </div>
                 </div>
               ))}
            </div>
          </CardContent>
          <div className="p-6 border-t border-border/50 bg-muted/20 flex flex-col sm:flex-row items-center justify-end gap-3 px-6 md:px-8">
            <Button type="button" variant="outline" onClick={() => navigate(ROUTES.PRESCRIPTIONS)} className="w-full sm:w-auto h-12 px-8 rounded-xl font-bold border-border/50 hover:bg-muted">
               Discard
            </Button>
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto h-12 px-8 rounded-xl font-bold bg-linear-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white shadow-lg shadow-teal-500/25 transition-all hover:scale-[1.02]">
               {isLoading ? (
                 <>
                   <Loader2 className="w-5 h-5 animate-spin mr-2" />
                   Processing...
                 </>
               ) : (
                 <>
                   <CheckCircle2 className="w-5 h-5 mr-2" /> Generate Prescription
                 </>
               )}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default CreatePrescriptionPage;
