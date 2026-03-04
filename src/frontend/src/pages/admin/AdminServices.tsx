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

const safeBigInt = (val: string | number, fallback = 0n): bigint => {
  try {
    const n = typeof val === "number" ? val : Number.parseInt(val, 10);
    if (Number.isNaN(n)) return fallback;
    return BigInt(Math.max(0, Math.floor(n)));
  } catch {
    return fallback;
  }
};
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
  useCreateService,
  useDeleteService,
  useGetAllServices,
  useUpdateService,
} from "@/hooks/useQueries";
import { Loader2, Pencil, Plus, Settings, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Service } from "../../backend.d";

const emptyService: Omit<Service, "id"> = {
  title: "",
  description: "",
  icon: "",
  sortOrder: 0n,
};

export default function AdminServices() {
  const { data: services = [], isLoading } = useGetAllServices();
  const createService = useCreateService();
  const updateService = useUpdateService();
  const deleteService = useDeleteService();

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<bigint | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [form, setForm] = useState<Omit<Service, "id">>(emptyService);

  const openCreate = () => {
    setEditingService(null);
    setForm(emptyService);
    setModalOpen(true);
  };
  const openEdit = (s: Service) => {
    setEditingService(s);
    setForm({
      title: s.title,
      description: s.description,
      icon: s.icon,
      sortOrder: s.sortOrder,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    try {
      if (editingService) {
        await updateService.mutateAsync({
          id: editingService.id,
          service: { ...form, id: editingService.id },
        });
        toast.success("Service updated");
      } else {
        await createService.mutateAsync({ ...form, id: 0n });
        toast.success("Service created");
      }
      setModalOpen(false);
    } catch (err) {
      console.error("Failed to save service:", err);
      toast.error("Failed to save");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteService.mutateAsync(deleteId);
      toast.success("Deleted");
    } catch (err) {
      console.error("Failed to delete service:", err);
      toast.error("Failed to delete");
    } finally {
      setDeleteId(null);
    }
  };

  const isSaving = createService.isPending || updateService.isPending;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground mb-1">
            Services
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage your service offerings
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="bg-primary/20 text-cyan border border-primary/30 hover:bg-primary/30"
          data-ocid="admin.create_button"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-7 h-7 animate-spin text-cyan" />
        </div>
      ) : services.length === 0 ? (
        <div
          className="text-center py-16"
          data-ocid="admin.services.empty_state"
        >
          <Settings className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">No services yet.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {services
            .sort((a, b) => Number(a.sortOrder) - Number(b.sortOrder))
            .map((service, i) => (
              <div
                key={service.id.toString()}
                className="p-5 rounded-xl border border-border bg-card hover:border-primary/20 transition-colors group"
                data-ocid={`admin.services.item.${i + 1}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{service.icon || "⚙️"}</span>
                    <div>
                      <div className="font-display font-semibold text-foreground text-sm">
                        {service.title}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {service.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-7 h-7 text-muted-foreground hover:text-cyan hover:bg-primary/10"
                      onClick={() => openEdit(service)}
                      data-ocid="admin.edit_button"
                    >
                      <Pencil className="w-3 h-3" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-7 h-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={() => setDeleteId(service.id)}
                      data-ocid="admin.delete_button"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
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
              {editingService ? "Edit Service" : "Add Service"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">
              Fill in the service details.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Title *</Label>
                <Input
                  value={form.title}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, title: e.target.value }))
                  }
                  placeholder="Flutter Development"
                  className="bg-background"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Icon (emoji)</Label>
                <Input
                  value={form.icon}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, icon: e.target.value }))
                  }
                  placeholder="🦋"
                  className="bg-background"
                />
              </div>
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
              {editingService ? "Update" : "Create"}
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
              Delete Service?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This cannot be undone.
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
              disabled={deleteService.isPending}
              className="bg-destructive text-destructive-foreground"
              data-ocid="admin.confirm_button"
            >
              {deleteService.isPending ? (
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
