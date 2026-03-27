import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, User, Stethoscope, Clock, FileText, Loader2, Search, CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useGetPatientsQuery } from "@/features/patients/patientApi";
import { useCreateAppointmentMutation } from "@/features/appointments/appointmentApi";
import { useGetUsersQuery } from "@/features/users/userApi";
import { ROUTES } from "@/utils/constants";
import { toast } from "sonner";

const TIME_SLOTS = [
  "09:00-09:30", "09:30-10:00", "10:00-10:30", "10:30-11:00",
  "11:00-11:30", "11:30-12:00", "14:00-14:30", "14:30-15:00",
  "15:00-15:30", "15:30-16:00", "16:00-16:30", "16:30-17:00",
];

const BookAppointmentPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ patientId: "", doctorId: "", date: "", timeSlot: "", reason: "" });
  const [errors, setErrors] = useState({});
  const [patientSearch, setPatientSearch] = useState("");
  const [doctorSearch, setDoctorSearch] = useState("");
  const [isPatientFocused, setIsPatientFocused] = useState(false);
  const [isDoctorFocused, setIsDoctorFocused] = useState(false);

  const { data: patientsData } = useGetPatientsQuery({ search: patientSearch, limit: 10 });
  const { data: usersData } = useGetUsersQuery({ role: "doctor", search: doctorSearch, limit: 10 });
  const [createAppointment, { isLoading }] = useCreateAppointmentMutation();

  const patients = patientsData?.data?.patients || [];
  const doctors = usersData?.data?.users || [];

  const validate = () => {
    const newErrors = {};
    if (!form.patientId) newErrors.patientId = "Please select a patient";
    if (!form.doctorId) newErrors.doctorId = "Please select a doctor";
    if (!form.date) newErrors.date = "Appointment date is required";
    if (!form.timeSlot) newErrors.timeSlot = "Time slot is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await createAppointment(form).unwrap();
      toast.success("Appointment successfully booked.");
      navigate(ROUTES.APPOINTMENTS);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to book appointment");
    }
  };

  const selectedPatient = patients.find(p => p._id === form.patientId);
  const selectedDoctor = doctors.find(d => d._id === form.doctorId);

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-10">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate(ROUTES.APPOINTMENTS)} className="h-10 w-10 rounded-xl hover:bg-muted border-border/50 shadow-xs">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex flex-col">
          <h1 className="text-3xl font-black font-heading tracking-tight text-foreground">Book Appointment</h1>
          <p className="text-sm font-medium text-muted-foreground mt-0.5">Schedule a new consultation session.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="rounded-3xl border-border/50 bg-background/60 backdrop-blur-xl shadow-sm overflow-hidden">
          <div className="h-1.5 w-full bg-linear-to-r from-teal-500 to-emerald-500" />
          <CardHeader className="border-b border-border/50 bg-muted/20 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
                 <CalendarPlus className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <CardTitle className="text-xl font-black text-foreground tracking-tight">Session Details</CardTitle>
                <CardDescription className="text-xs font-bold uppercase tracking-widest mt-0.5">Please provide patient and schedule info</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 md:p-8 space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Patient Selection */}
              <div className="space-y-3 relative">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                   <User className="w-3.5 h-3.5" /> Select Patient <span className="text-rose-500">*</span>
                </Label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search name or ID..."
                    value={selectedPatient && !isPatientFocused ? selectedPatient.name : patientSearch}
                    onChange={(e) => { setPatientSearch(e.target.value); setForm(p => ({ ...p, patientId: "" })); }}
                    onFocus={() => { setIsPatientFocused(true); setPatientSearch(""); }}
                    onBlur={() => setTimeout(() => setIsPatientFocused(false), 200)}
                    className={`pl-10 h-12 rounded-xl border-border/50 bg-muted/50 focus-visible:ring-teal-500/50 text-[15px] font-medium transition-colors ${errors.patientId ? "border-rose-500/50 bg-rose-500/5 focus-visible:ring-rose-500/50" : ""}`}
                  />
                </div>
                {errors.patientId && <p className="text-[11px] font-bold text-rose-500 uppercase tracking-widest">{errors.patientId}</p>}
                
                {isPatientFocused && patientSearch && !form.patientId && (
                  <div className="absolute top-16 inset-x-0 z-50 bg-background/95 backdrop-blur-xl border border-border rounded-xl overflow-hidden shadow-2xl max-h-60 overflow-y-auto">
                    {patients.length > 0 ? patients.map(patient => (
                      <button
                        key={patient._id}
                        type="button"
                        className="w-full px-4 py-3 flex items-center justify-between hover:bg-teal-500/10 transition-colors border-b border-border/50 last:border-0"
                        onClick={() => { setForm(p => ({ ...p, patientId: patient._id })); setPatientSearch(""); setIsPatientFocused(false); }}
                      >
                        <span className="font-bold text-sm text-foreground truncate">{patient.name}</span>
                        <span className="text-[11px] font-bold tracking-widest text-muted-foreground bg-muted px-2 py-0.5 rounded-md shrink-0">{patient.phone}</span>
                      </button>
                    )) : (
                       <div className="p-4 text-center text-sm font-medium text-muted-foreground">No patients found</div>
                    )}
                  </div>
                )}
                
                {selectedPatient && !isPatientFocused && (
                   <div className="flex items-center justify-between p-3 bg-teal-500/5 border border-teal-500/20 rounded-xl">
                      <span className="text-sm font-bold text-teal-900 dark:text-teal-100">{selectedPatient.name}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-teal-700 dark:text-teal-300">Selected</span>
                   </div>
                )}
              </div>

              {/* Doctor Selection */}
              <div className="space-y-3 relative">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                   <Stethoscope className="w-3.5 h-3.5" /> Assigned Doctor <span className="text-rose-500">*</span>
                </Label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search doctor..."
                    value={selectedDoctor && !isDoctorFocused ? selectedDoctor.name : doctorSearch}
                    onChange={(e) => { setDoctorSearch(e.target.value); setForm(p => ({ ...p, doctorId: "" })); }}
                    onFocus={() => { setIsDoctorFocused(true); setDoctorSearch(""); }}
                    onBlur={() => setTimeout(() => setIsDoctorFocused(false), 200)}
                    className={`pl-10 h-12 rounded-xl border-border/50 bg-muted/50 focus-visible:ring-emerald-500/50 text-[15px] font-medium transition-colors ${errors.doctorId ? "border-rose-500/50 bg-rose-500/5 focus-visible:ring-rose-500/50" : ""}`}
                  />
                </div>
                {errors.doctorId && <p className="text-[11px] font-bold text-rose-500 uppercase tracking-widest">{errors.doctorId}</p>}

                {isDoctorFocused && doctorSearch && !form.doctorId && (
                  <div className="absolute top-16 inset-x-0 z-50 bg-background/95 backdrop-blur-xl border border-border rounded-xl overflow-hidden shadow-2xl max-h-60 overflow-y-auto">
                    {doctors.length > 0 ? doctors.map(doctor => (
                      <button
                        key={doctor._id}
                        type="button"
                        className="w-full px-4 py-3 flex items-center justify-between hover:bg-emerald-500/10 transition-colors border-b border-border/50 last:border-0"
                        onClick={() => { setForm(p => ({ ...p, doctorId: doctor._id })); setDoctorSearch(""); setIsDoctorFocused(false); }}
                      >
                        <span className="font-bold text-sm text-foreground truncate">{doctor.name}</span>
                        {doctor.specialization && <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted px-2 py-0.5 rounded-md shrink-0">{doctor.specialization}</span>}
                      </button>
                    )) : (
                       <div className="p-4 text-center text-sm font-medium text-muted-foreground">No doctors found</div>
                    )}
                  </div>
                )}

                {selectedDoctor && !isDoctorFocused && (
                   <div className="flex items-center justify-between p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                      <span className="text-sm font-bold text-emerald-900 dark:text-emerald-100">{selectedDoctor.name}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-300">{selectedDoctor.specialization || "General"}</span>
                   </div>
                )}
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-border/60 pt-8">
              <div className="space-y-3">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                   <Calendar className="w-3.5 h-3.5" /> Date <span className="text-rose-500">*</span>
                </Label>
                <div className="relative">
                   <Input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm(p => ({ ...p, date: e.target.value }))}
                    min={new Date().toISOString().split("T")[0]}
                    className={`h-12 rounded-xl border-border/50 bg-muted/50 focus-visible:ring-teal-500/50 text-[15px] font-medium px-4 ${errors.date ? "border-rose-500/50 bg-rose-500/5 focus-visible:ring-rose-500/50" : ""}`}
                  />
                </div>
                {errors.date && <p className="text-[11px] font-bold text-rose-500 uppercase tracking-widest">{errors.date}</p>}
              </div>

              <div className="space-y-3">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                   <Clock className="w-3.5 h-3.5" /> Time Slot <span className="text-rose-500">*</span>
                </Label>
                <select
                  value={form.timeSlot}
                  onChange={(e) => setForm(p => ({ ...p, timeSlot: e.target.value }))}
                  className={`w-full h-12 px-4 rounded-xl border border-border/50 bg-muted/50 hover:bg-muted text-[15px] font-medium outline-none focus:ring-2 focus:ring-teal-500/50 transition-colors ${errors.timeSlot ? "border-rose-500/50 bg-rose-500/5 focus:ring-rose-500/50 text-rose-900" : ""}`}
                >
                  <option value="" disabled className="text-muted-foreground">Select available time slot</option>
                  {TIME_SLOTS.map(slot => <option key={slot} value={slot}>{slot}</option>)}
                </select>
                {errors.timeSlot && <p className="text-[11px] font-bold text-rose-500 uppercase tracking-widest">{errors.timeSlot}</p>}
              </div>
            </div>

            <div className="space-y-3 border-t border-border/60 pt-8">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5" /> Clinical Reason / Notes
              </Label>
              <Input
                value={form.reason}
                onChange={(e) => setForm(p => ({ ...p, reason: e.target.value }))}
                placeholder="Brief description of symptoms or consultation purpose..."
                className="h-12 rounded-xl border-border/50 bg-muted/50 focus-visible:ring-teal-500/50 text-[15px] font-medium px-4"
              />
            </div>
          </CardContent>
          <div className="p-6 border-t border-border/50 bg-muted/20 flex items-center justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => navigate(ROUTES.APPOINTMENTS)} className="h-12 px-6 rounded-xl font-bold border-border/50 hover:bg-muted">
               Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="h-12 px-8 rounded-xl font-bold bg-linear-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white shadow-lg shadow-teal-500/25 transition-all hover:scale-[1.02]">
               {isLoading ? (
                 <>
                   <Loader2 className="w-5 h-5 animate-spin mr-2" />
                   Confirming...
                 </>
               ) : (
                 "Confirm Booking"
               )}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default BookAppointmentPage;
