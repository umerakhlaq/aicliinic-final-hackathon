import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, User, Phone, Mail, MapPin, Activity, Calendar, FileText, AlertTriangle, Syringe, Clock, Edit2, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import StatusBadge from "@/components/shared/StatusBadge";
import EmptyState from "@/components/shared/EmptyState";
import { useGetPatientQuery, useGetPatientHistoryQuery, useUpdatePatientMutation } from "@/features/patients/patientApi";
import { ROUTES } from "@/utils/constants";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";

const InfoRow = ({ label, value, icon: Icon }) => (
  <div className="flex gap-3 items-center p-3 rounded-xl bg-muted/30 border border-border/50">
    {Icon && (
      <div className="h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-lg bg-background border border-border/50">
        <Icon className="h-4 w-4 text-teal-600" />
      </div>
    )}
    <div className="flex-1 min-w-0">
      <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">{label}</p>
      <p className="text-[14px] font-bold text-foreground truncate">{value || "—"}</p>
    </div>
  </div>
);

const TimelineItem = ({ item }) => {
  const icons = { appointment: Calendar, prescription: FileText, diagnosis: Activity };
  const _colors = { 
    appointment: "bg-blue-500/10 text-blue-600 border-blue-500/20", 
    prescription: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", 
    diagnosis: "bg-purple-500/10 text-purple-600 border-purple-500/20" 
  };
  const Icon = icons[item.type] || Activity;
  const colorClass = _colors[item.type] || "bg-muted text-muted-foreground border-border";

  return (
    <div className="flex gap-4 group">
      <div className="flex flex-col items-center">
        <div className={`h-11 w-11 rounded-full flex items-center justify-center border transition-all group-hover:scale-110 ${colorClass}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="w-px h-full bg-border/50 my-2 group-last:hidden" />
      </div>
      <div className="flex-1 pb-6 mt-1">
        <div className="rounded-2xl border border-border/50 bg-background/50 backdrop-blur-sm p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold tracking-widest uppercase text-foreground bg-muted px-2 py-0.5 rounded-full">{item.type}</span>
                <span className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              
              {item.type === "appointment" && (
                <div className="pt-1">
                  <p className="text-sm font-medium text-muted-foreground">Consultation with <span className="text-foreground font-bold">Dr. {item.doctorId?.name}</span></p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs font-bold bg-muted px-2 py-1 rounded-md">{item.timeSlot}</span>
                    <StatusBadge status={item.status} />
                  </div>
                </div>
              )}
              {item.type === "prescription" && (
                <div className="pt-1">
                  <p className="text-sm font-medium text-muted-foreground">Prescribed by <span className="text-foreground font-bold">Dr. {item.doctorId?.name}</span></p>
                  <p className="text-sm font-bold mt-1 max-w-lg bg-teal-500/5 p-2 rounded-lg border border-teal-500/10 text-teal-900 dark:text-teal-400">"{item.diagnosis}"</p>
                </div>
              )}
              {item.type === "diagnosis" && (
                <div className="pt-1">
                  <p className="text-sm font-medium text-muted-foreground">Logged by <span className="text-foreground font-bold">Dr. {item.doctorId?.name}</span></p>
                  <div className="mt-2">
                    <StatusBadge status={item.riskLevel} />
                  </div>
                </div>
              )}
            </div>
            
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-muted shrink-0">
              <ArrowLeft className="h-4 w-4 rotate-135" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PatientDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin, isReceptionist } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  const { data: patientData, isLoading } = useGetPatientQuery(id);
  const { data: historyData } = useGetPatientHistoryQuery(id);
  const [updatePatient, { isLoading: isUpdating }] = useUpdatePatientMutation();

  const patient = patientData?.data?.patient;
  const timeline = historyData?.data?.timeline || [];

  const handleEditSave = async () => {
    try {
      await updatePatient({ id, ...editForm }).unwrap();
      toast.success("Patient updated");
      setIsEditing(false);
    } catch (err) {
      toast.error(err?.data?.message || "Update failed");
    }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center py-24">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-teal-500/30 border-t-teal-600" />
        <p className="text-sm font-bold text-muted-foreground animate-pulse tracking-widest uppercase">Loading Profile...</p>
      </div>
    </div>
  );

  if (!patient) return (
    <div className="py-20">
      <EmptyState title="Patient Disconnected" description="This patient record could not be found or has been removed." icon={User} />
    </div>
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate(ROUTES.PATIENTS)} className="h-10 w-10 rounded-xl border-2 hover:bg-muted">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl lg:text-4xl font-black font-heading tracking-tight text-foreground">{patient.name}</h1>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mt-1">Patient Profile ID: <span className="opacity-70">{patient._id.slice(-6)}</span></p>
          </div>
        </div>
        {(isAdmin || isReceptionist) && !isEditing && (
          <Button className="h-10 rounded-xl font-bold bg-teal-50/50 text-teal-700 hover:bg-teal-100 hover:text-teal-800 border-0" onClick={() => { setEditForm({ name: patient.name, phone: patient.phone, email: patient.email, address: patient.address }); setIsEditing(true); }}>
            <Edit2 className="h-4 w-4 mr-2" /> Modify Record
          </Button>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Patient Profile Column */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="rounded-3xl border-border/50 bg-background/60 backdrop-blur-xl shadow-sm overflow-hidden">
            <div className="h-2 w-full bg-linear-to-r from-teal-500 to-emerald-500" />
            <CardHeader className="text-center pb-2 pt-8 relative">
              <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-teal-500/10 to-transparent -z-10" />
              <div className="mx-auto h-24 w-24 rounded-full bg-background border-[4px] border-background shadow-xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-teal-500 to-emerald-500 opacity-20" />
                <span className="text-4xl font-black text-teal-600 dark:text-teal-400 capitalize">{patient.name.charAt(0)}</span>
              </div>
              <CardTitle className="mt-4 text-2xl font-black tracking-tight">{patient.name}</CardTitle>
              <div className="flex items-center justify-center gap-2 mt-2 text-[13px] font-bold text-muted-foreground uppercase tracking-widest">
                <span>{patient.age} YRS</span>
                <span className="h-1 w-1 bg-border rounded-full" />
                <span>{patient.gender}</span>
                <span className="h-1 w-1 bg-border rounded-full" />
                <span className={patient.bloodGroup ? "text-rose-500" : ""}>{patient.bloodGroup || "N/A Blood"}</span>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Name</Label>
                    <Input className="h-11 rounded-xl" value={editForm.name || ""} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Phone</Label>
                    <Input className="h-11 rounded-xl" value={editForm.phone || ""} onChange={e => setEditForm(p => ({ ...p, phone: e.target.value }))} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Email</Label>
                    <Input className="h-11 rounded-xl" value={editForm.email || ""} onChange={e => setEditForm(p => ({ ...p, email: e.target.value }))} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Address</Label>
                    <Input className="h-11 rounded-xl" value={editForm.address || ""} onChange={e => setEditForm(p => ({ ...p, address: e.target.value }))} />
                  </div>
                  <div className="flex gap-2 justify-end pt-2">
                    <Button variant="outline" className="h-10 rounded-xl font-bold border-2" onClick={() => setIsEditing(false)}>Cancel</Button>
                    <Button className="h-10 rounded-xl font-bold bg-teal-600 hover:bg-teal-700 text-white" onClick={handleEditSave} disabled={isUpdating}>{isUpdating ? "Saving..." : "Save Changes"}</Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <InfoRow icon={Phone} label="Phone Number" value={patient.phone} />
                  <InfoRow icon={Mail} label="Email Address" value={patient.email} />
                  <InfoRow icon={MapPin} label="Residential Address" value={patient.address} />
                  <InfoRow icon={Calendar} label="Date Registered" value={new Date(patient.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric'})} />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Medical Alerts Card */}
          {(patient.allergies?.length > 0 || patient.chronicConditions?.length > 0) && (
            <Card className="rounded-3xl border-rose-500/20 shadow-sm bg-rose-500/5 backdrop-blur-xl overflow-hidden text-rose-950 dark:text-rose-100">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-black tracking-tight flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-rose-500 shrink-0" />
                  Medical Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {patient.allergies?.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[11px] font-bold uppercase tracking-widest opacity-60 flex items-center gap-1.5">
                      <Syringe className="h-3.5 w-3.5" /> Known Allergies
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {patient.allergies.map((a, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-md bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-500/20">{a}</span>
                      ))}
                    </div>
                  </div>
                )}
                
                {patient.chronicConditions?.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <p className="text-[11px] font-bold uppercase tracking-widest opacity-60 flex items-center gap-1.5">
                      <Activity className="h-3.5 w-3.5" /> Chronic Conditions
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {patient.chronicConditions.map((c, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-md border-2 border-rose-500/30 font-bold text-xs">{c}</span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* History Column */}
        <div className="lg:col-span-2">
          <Card className="rounded-3xl border-border/50 bg-background/60 backdrop-blur-xl shadow-sm h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-6 border-b border-border/50">
              <CardTitle className="text-xl font-black tracking-tight flex items-center gap-2">
                <History className="h-5 w-5 text-teal-600" /> Interaction Timeline
              </CardTitle>
              <Button asChild size="sm" className="h-9 rounded-lg font-bold bg-teal-500/10 text-teal-700 hover:bg-teal-500/20 border-0">
                <Link to={`${ROUTES.APPOINTMENTS}/book`}>Schedule Visit</Link>
              </Button>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              {timeline.length === 0 ? (
                <div className="py-12">
                  <EmptyState title="No Clinical History" description="Once the patient attends an appointment, receives a prescription, or gets a diagnosis logged, it will appear chronologically here." icon={FileText} />
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute left-[21px] top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-border to-transparent hidden sm:block" />
                  <div className="space-y-6">
                    {timeline.map((item, i) => <TimelineItem key={i} item={item} />)}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PatientDetailPage;
