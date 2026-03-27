import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Search, Eye, Pencil, Trash2, UserX, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import EmptyState from "@/components/shared/EmptyState";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import useAuth from "@/hooks/useAuth";
import { useGetPatientsQuery, useDeletePatientMutation } from "@/features/patients/patientApi";
import { ROUTES } from "@/utils/constants";
import { toast } from "sonner";

const PatientListPage = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);
  const { isAdmin, isReceptionist } = useAuth();
  const navigate = useNavigate();

  const { data, isLoading } = useGetPatientsQuery({ search, page, limit: 10 });
  const [deletePatient, { isLoading: isDeleting }] = useDeletePatientMutation();

  const patients = data?.data?.patients || [];
  const pagination = data?.data?.pagination || {};

  const handleDelete = async () => {
    try {
      await deletePatient(deleteId).unwrap();
      toast.success("Patient deleted successfully");
      setDeleteId(null);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete patient");
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black font-heading tracking-tight text-foreground flex items-center gap-3">
            Patient Directory
          </h1>
          <p className="text-[15px] font-medium text-muted-foreground mt-1.5">
            Manage your clinic's patient records and history
          </p>
        </div>
        {(isAdmin || isReceptionist) && (
          <Button asChild size="lg" className="h-12 rounded-xl font-bold bg-linear-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 shadow-lg shadow-teal-500/20 text-white border-0 transition-all hover:scale-[1.02]">
            <Link to={ROUTES.PATIENTS + "/add"}>
              <Plus className="h-5 w-5 mr-2" />
              Register Patient
            </Link>
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="relative max-w-md w-full">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-muted-foreground" />
        </div>
        <Input
          placeholder="Search by name, phone, or ID..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="pl-11 h-12 rounded-2xl border-border/50 bg-background/80 backdrop-blur-sm shadow-sm font-medium text-[15px] focus-visible:ring-teal-500/50"
        />
      </div>

      {/* Table */}
      <Card className="rounded-3xl border-border/50 shadow-sm overflow-hidden bg-background/60 backdrop-blur-xl">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <div className="flex flex-col items-center space-y-4">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-teal-500/30 border-t-teal-600" />
                <p className="text-sm font-bold text-muted-foreground animate-pulse tracking-widest uppercase">Loading Records...</p>
              </div>
            </div>
          ) : patients.length === 0 ? (
            <div className="py-24">
              <EmptyState 
                title="No patient records found" 
                description={search ? "We couldn't find any patients matching your search criteria." : "Your patient directory is currently empty. Add a patient to get started."} 
                icon={UserX}
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border/50 bg-muted/20">
                  <tr>
                    <th className="px-6 py-4 text-left text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Name</th>
                    <th className="px-6 py-4 text-left text-[11px] font-bold text-muted-foreground uppercase tracking-widest hidden sm:table-cell">Details</th>
                    <th className="px-6 py-4 text-left text-[11px] font-bold text-muted-foreground uppercase tracking-widest hidden md:table-cell">Contact</th>
                    <th className="px-6 py-4 text-left text-[11px] font-bold text-muted-foreground uppercase tracking-widest hidden lg:table-cell">Blood</th>
                    <th className="px-6 py-4 text-left text-[11px] font-bold text-muted-foreground uppercase tracking-widest hidden lg:table-cell">Registered</th>
                    <th className="px-6 py-4 text-right text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {patients.map((patient) => (
                    <tr key={patient._id} className="hover:bg-muted/30 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3.5">
                          <div className="h-10 w-10 rounded-full bg-linear-to-br from-teal-500/20 to-emerald-500/20 flex flex-shrink-0 items-center justify-center border border-teal-500/30">
                            <span className="text-sm font-black text-teal-700 dark:text-teal-400">{patient.name.charAt(0).toUpperCase()}</span>
                          </div>
                          <div>
                            <p className="font-bold text-[15px] text-foreground group-hover:text-teal-600 transition-colors">{patient.name}</p>
                            <p className="text-[12px] font-medium text-muted-foreground sm:hidden tracking-tight">{patient.age} yrs • {patient.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                        <div className="flex items-center gap-2">
                           <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-muted text-muted-foreground text-xs font-bold uppercase tracking-wider">
                             {patient.gender}
                           </span>
                           <span className="text-sm font-medium text-foreground">{patient.age} yrs</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                        <p className="text-[14px] font-medium text-foreground">{patient.phone}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                        {patient.bloodGroup ? (
                           <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 text-xs font-bold border border-rose-500/20">
                             {patient.bloodGroup}
                           </span>
                        ) : <span className="text-muted-foreground">—</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-muted-foreground hidden lg:table-cell">
                        {new Date(patient.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-50 sm:group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" asChild className="h-9 w-9 rounded-lg hover:bg-teal-50 hover:text-teal-600 text-muted-foreground">
                            <Link to={`${ROUTES.PATIENTS}/${patient._id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          {(isAdmin || isReceptionist) && (
                            <Button variant="ghost" size="icon" onClick={() => navigate(`${ROUTES.PATIENTS}/${patient._id}`)} className="h-9 w-9 rounded-lg hover:bg-amber-50 hover:text-amber-600 text-muted-foreground">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          )}
                          {isAdmin && (
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-rose-50 text-muted-foreground hover:text-rose-600" onClick={() => setDeleteId(patient._id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
            Showing Page <span className="text-foreground">{pagination.page}</span> of <span className="text-foreground">{pagination.totalPages}</span>
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-10 rounded-xl font-bold border-2" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
              Previous
            </Button>
            <Button variant="outline" size="sm" className="h-10 rounded-xl font-bold border-2" disabled={page === pagination.totalPages} onClick={() => setPage(p => p + 1)}>
              Next
            </Button>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        title="Delete Patient Record"
        description="Are you sure you want to delete this patient? All associated appointments, prescriptions, and diagnosis histories will also be permanently removed. This action cannot be undone."
        confirmLabel="Delete Permanently"
        variant="destructive"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default PatientListPage;
