import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, UserPlus, HeartPulse, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreatePatientMutation } from "@/features/patients/patientApi";
import { ROUTES } from "@/utils/constants";
import { toast } from "sonner";

const GENDERS = ["male", "female", "other"];
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

const AddPatientPage = () => {
  const navigate = useNavigate();
  const [createPatient, { isLoading }] = useCreatePatientMutation();

  const [form, setForm] = useState({
    name: "", age: "", gender: "", phone: "", email: "",
    address: "", bloodGroup: "", allergies: "", chronicConditions: "",
    emergencyContact: { name: "", phone: "", relation: "" },
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("ec_")) {
      const field = name.replace("ec_", "");
      setForm(prev => ({ ...prev, emergencyContact: { ...prev.emergencyContact, [field]: value } }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.age) newErrors.age = "Age is required";
    if (!form.gender) newErrors.gender = "Gender is required";
    if (!form.phone.trim()) newErrors.phone = "Phone is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...form,
      age: parseInt(form.age),
      allergies: form.allergies ? form.allergies.split(",").map(s => s.trim()).filter(Boolean) : [],
      chronicConditions: form.chronicConditions ? form.chronicConditions.split(",").map(s => s.trim()).filter(Boolean) : [],
    };

    try {
      const res = await createPatient(payload).unwrap();
      toast.success("Patient registered successfully");
      navigate(`${ROUTES.PATIENTS}/${res.data.patient._id}`);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to register patient");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate(ROUTES.PATIENTS)} className="h-10 w-10 rounded-xl border-2 hover:bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-black font-heading tracking-tight text-foreground">Register New Patient</h1>
          <p className="text-[15px] font-medium text-muted-foreground mt-1 text-balance">
            Create a secure medical record for your new patient.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="rounded-3xl border-border/50 shadow-sm bg-background/60 backdrop-blur-xl overflow-hidden">
          <div className="h-1.5 w-full bg-linear-to-r from-teal-500 to-emerald-500" />
          <CardHeader className="pb-4 bg-muted/20 border-b border-border/50">
            <CardTitle className="text-lg font-black tracking-tight flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-teal-600" /> Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest">Full Name *</Label>
              <Input name="name" value={form.name} onChange={handleChange} placeholder="John Doe" className="h-12 rounded-xl border-border/50 bg-background focus-visible:ring-teal-500/50 shadow-xs" />
              {errors.name && <p className="text-xs font-bold text-rose-500">{errors.name}</p>}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest">Age *</Label>
                <Input name="age" type="number" value={form.age} onChange={handleChange} placeholder="25" min="0" max="150" className="h-12 rounded-xl border-border/50 bg-background focus-visible:ring-teal-500/50 shadow-xs" />
                {errors.age && <p className="text-xs font-bold text-rose-500">{errors.age}</p>}
              </div>
              <div className="space-y-2">
                <Label className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest">Gender *</Label>
                <select name="gender" value={form.gender} onChange={handleChange} className="w-full h-12 px-3 rounded-xl border border-border/50 bg-background text-sm shadow-xs focus-visible:outline-none focus:ring-2 focus:ring-teal-500/50">
                  <option value="">Select</option>
                  {GENDERS.map(g => <option key={g} value={g} className="capitalize">{g}</option>)}
                </select>
                {errors.gender && <p className="text-xs font-bold text-rose-500">{errors.gender}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest">Phone Number *</Label>
              <Input name="phone" value={form.phone} onChange={handleChange} placeholder="+1 555 000 0000" className="h-12 rounded-xl border-border/50 bg-background focus-visible:ring-teal-500/50 shadow-xs" />
              {errors.phone && <p className="text-xs font-bold text-rose-500">{errors.phone}</p>}
            </div>

            <div className="space-y-2">
              <Label className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest">Email Address</Label>
              <Input name="email" type="email" value={form.email} onChange={handleChange} placeholder="patient@email.com" className="h-12 rounded-xl border-border/50 bg-background focus-visible:ring-teal-500/50 shadow-xs" />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest">Residential Address</Label>
              <Input name="address" value={form.address} onChange={handleChange} placeholder="123 Street Name, City, State" className="h-12 rounded-xl border-border/50 bg-background focus-visible:ring-teal-500/50 shadow-xs" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-border/50 shadow-sm bg-background/60 backdrop-blur-xl overflow-hidden">
          <CardHeader className="pb-4 bg-muted/20 border-b border-border/50">
            <CardTitle className="text-lg font-black tracking-tight flex items-center gap-2">
              <HeartPulse className="h-5 w-5 text-rose-500" /> Medical Info
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest">Blood Type</Label>
              <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange} className="w-full h-12 px-3 rounded-xl border border-border/50 bg-background text-sm shadow-xs focus-visible:outline-none focus:ring-2 focus:ring-rose-500/50">
                <option value="">Unknown</option>
                {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest">Known Allergies <span className="opacity-60">(Comma separated)</span></Label>
              <Input name="allergies" value={form.allergies} onChange={handleChange} placeholder="Penicillin, Peanuts" className="h-12 rounded-xl border-border/50 bg-background focus-visible:ring-rose-500/50 shadow-xs" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest">Chronic Conditions <span className="opacity-60">(Comma separated)</span></Label>
              <Input name="chronicConditions" value={form.chronicConditions} onChange={handleChange} placeholder="Type 2 Diabetes, Hypertension" className="h-12 rounded-xl border-border/50 bg-background focus-visible:ring-rose-500/50 shadow-xs" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-border/50 shadow-sm bg-background/60 backdrop-blur-xl overflow-hidden">
          <CardHeader className="pb-4 bg-muted/20 border-b border-border/50">
            <CardTitle className="text-lg font-black tracking-tight flex items-center gap-2">
              <PhoneCall className="h-5 w-5 text-amber-500" /> Emergency Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest">Contact Name</Label>
              <Input name="ec_name" value={form.emergencyContact.name} onChange={handleChange} placeholder="Kin's Name" className="h-12 rounded-xl border-border/50 bg-background focus-visible:ring-amber-500/50 shadow-xs" />
            </div>
            <div className="space-y-2">
              <Label className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest">Contact Phone</Label>
              <Input name="ec_phone" value={form.emergencyContact.phone} onChange={handleChange} placeholder="+1 555 000 0000" className="h-12 rounded-xl border-border/50 bg-background focus-visible:ring-amber-500/50 shadow-xs" />
            </div>
            <div className="space-y-2">
              <Label className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest">Relationship</Label>
              <Input name="ec_relation" value={form.emergencyContact.relation} onChange={handleChange} placeholder="Spouse, Sibling, etc." className="h-12 rounded-xl border-border/50 bg-background focus-visible:ring-amber-500/50 shadow-xs" />
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
          <Button type="button" variant="outline" className="h-12 px-8 rounded-xl font-bold border-2" onClick={() => navigate(ROUTES.PATIENTS)}>Cancel Process</Button>
          <Button type="submit" className="h-12 px-8 rounded-xl font-bold bg-linear-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 shadow-lg shadow-teal-500/20 text-white border-0 transition-transform hover:scale-[1.02]" disabled={isLoading}>
            {isLoading ? "Encrypting & Storing..." : "Register Patient securely"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddPatientPage;
