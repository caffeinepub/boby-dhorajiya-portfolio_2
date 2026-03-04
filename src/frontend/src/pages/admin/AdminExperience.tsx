import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateExperience,
  useDeleteExperience,
  useGetAllExperiences,
  useUpdateExperience,
} from "@/hooks/useQueries";
import { Briefcase, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Experience } from "../../backend.d";

const safeBigInt = (val: string | number, fallback = 0n): bigint => {
  try {
    const n = typeof val === "number" ? val : Number.parseInt(val, 10);
    if (Number.isNaN(n)) return fallback;
    return BigInt(Math.max(0, Math.floor(n)));
  } catch {
    return fallback;
  }
};

const emptyExp: Omit<Experience, "id"> = {
  title: "",
  company: "",
  duration: "",
  description: "",
  sortOrder: 0n,
};

export default function AdminExperience() {
  const { data: experiences = [], isLoading } = useGetAllExperiences();
  const createExp = useCreateExperience();
  const updateExp = useUpdateExperience();
  const deleteExp = useDeleteExperience();

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<bigint | null>(null);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [form, setForm] = useState<Omit<Experience, "id">>(emptyExp);

  const openCreate = () => {
    setEditingExp(null);
    setForm(emptyExp);
    setModalOpen(true);
  };
  const openEdit = (exp: Experience) => {
    setEditingExp(exp);
    setForm({
      title: exp.title,
      company: exp.company,
      duration: exp.duration,
      description: exp.description,
      sortOrder: exp.sortOrder,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.company.trim()) {
      toast.error("Title and Company are required");
      return;
    }
    try {
      if (editingExp) {
        await updateExp.mutateAsync({
          id: editingExp.id,
          exp: { ...form, id: editingExp.id },
        });
        toast.success("Experience updated");
      } else {
        await createExp.mutateAsync({ ...form, id: 0n });
        toast.success("Experience created");
      }
      setModalOpen(false);
      setForm(emptyExp);
      setEditingExp(null);
    } catch (err) {
      console.error("Failed to save experience:", err);
      toast.error("Failed to save");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteExp.mutateAsync(deleteId);
      toast.success("Deleted");
    } catch (err) {
      console.error("Failed to delete experience:", err);
      toast.error("Failed to delete");
    } finally {
      setDeleteId(null);
    }
  };

  const isSaving = createExp.isPending || updateExp.isPending;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground mb-1">
            Experience
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage your work history
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="bg-primary/20 text-cyan border border-primary/30 hover:bg-primary/30"
          data-ocid="admin.create_button"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Experience
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-7 h-7 animate-spin text-cyan" />
        </div>
      ) : experiences.length === 0 ? (
        <div
          className="text-center py-16"
          data-ocid="admin.experience.empty_state"
        >
          <Briefcase className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">No experience entries yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {experiences
            .sort((a, b) => Number(a.sortOrder) - Number(b.sortOrder))
            .map((exp, i) => (
              <div
                key={exp.id.toString()}
                className="p-4 rounded-xl border border-border bg-card flex items-start gap-4 hover:border-primary/20 transition-colors"
                data-ocid={`admin.experience.item.${i + 1}`}
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Briefcase className="w-4 h-4 text-cyan" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-display font-semibold text-foreground text-sm">
                      {exp.title}
                    </span>
                    <span className="text-xs text-cyan">@ {exp.company}</span>
                  </div>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {exp.duration}
                  </span>
                  {exp.description && (
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                      {exp.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-7 h-7 text-muted-foreground hover:text-cyan hover:bg-primary/10"
                    onClick={() => openEdit(exp)}
                    data-ocid="admin.edit_button"
                  >
                    <Pencil className="w-3 h-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-7 h-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() => setDeleteId(exp.id)}
                    data-ocid="admin.delete_button"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
        </div>
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent
          className="sm:max-w-md bg-card border-border"
          data-ocid="admin.modal"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-foreground">
              {editingExp ? "Edit Experience" : "Add Experience"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">
              Fill in the experience details.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Title *</Label>
              <Input
                value={form.title}
                onChange={(e) =>
                  setForm((p) => ({ ...p, title: e.target.value }))
                }
                placeholder="Mobile App Developer"
                className="bg-background"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Company *</Label>
              <Input
                value={form.company}
                onChange={(e) =>
                  setForm((p) => ({ ...p, company: e.target.value }))
                }
                placeholder="Nexus IT Solution"
                className="bg-background"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Duration</Label>
              <Input
                value={form.duration}
                onChange={(e) =>
                  setForm((p) => ({ ...p, duration: e.target.value }))
                }
                placeholder="2021 – Present"
                className="bg-background"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                rows={3}
                className="bg-background resize-none"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Sort Order</Label>
              <Input
                type="number"
                value={Number(form.sortOrder)}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    sortOrder: safeBigInt(e.target.value),
                  }))
                }
                className="bg-background"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setModalOpen(false)}
              className="border-border"
              data-ocid="admin.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                void handleSave();
              }}
              disabled={isSaving}
              className="bg-primary/20 text-cyan border border-primary/30 hover:bg-primary/30"
              data-ocid="admin.save_button"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              {editingExp ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
      >
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">
              Delete Experience?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="border-border"
              data-ocid="admin.cancel_button"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                void handleDelete();
              }}
              disabled={deleteExp.isPending}
              className="bg-destructive text-destructive-foreground"
              data-ocid="admin.confirm_button"
            >
              {deleteExp.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
