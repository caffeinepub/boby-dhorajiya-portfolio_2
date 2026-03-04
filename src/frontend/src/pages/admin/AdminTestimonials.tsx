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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateTestimonial,
  useDeleteTestimonial,
  useGetAllTestimonials,
  useUpdateTestimonial,
} from "@/hooks/useQueries";
import { Loader2, Pencil, Plus, Star, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Testimonial } from "../../backend.d";

const emptyT: Omit<Testimonial, "id"> = {
  name: "",
  role: "",
  company: "",
  content: "",
  avatarUrl: "",
  rating: 5n,
  sortOrder: 0n,
};

export default function AdminTestimonials() {
  const { data: testimonials = [], isLoading } = useGetAllTestimonials();
  const createT = useCreateTestimonial();
  const updateT = useUpdateTestimonial();
  const deleteT = useDeleteTestimonial();

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<bigint | null>(null);
  const [editingT, setEditingT] = useState<Testimonial | null>(null);
  const [form, setForm] = useState<Omit<Testimonial, "id">>(emptyT);
  const [rating, setRating] = useState(5);

  const openCreate = () => {
    setEditingT(null);
    setForm(emptyT);
    setRating(5);
    setModalOpen(true);
  };
  const openEdit = (t: Testimonial) => {
    setEditingT(t);
    setForm({
      name: t.name,
      role: t.role,
      company: t.company,
      content: t.content,
      avatarUrl: t.avatarUrl,
      rating: t.rating,
      sortOrder: t.sortOrder,
    });
    setRating(Number(t.rating));
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.content.trim()) {
      toast.error("Name and Content are required");
      return;
    }
    const data = { ...form, rating: BigInt(rating) };
    try {
      if (editingT) {
        await updateT.mutateAsync({
          id: editingT.id,
          testimonial: { ...data, id: editingT.id },
        });
        toast.success("Testimonial updated");
      } else {
        await createT.mutateAsync({ ...data, id: 0n });
        toast.success("Testimonial created");
      }
      setModalOpen(false);
    } catch {
      toast.error("Failed to save");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteT.mutateAsync(deleteId);
      toast.success("Deleted");
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleteId(null);
    }
  };

  const isSaving = createT.isPending || updateT.isPending;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground mb-1">
            Testimonials
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage client testimonials
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="bg-primary/20 text-cyan border border-primary/30 hover:bg-primary/30"
          data-ocid="admin.create_button"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Testimonial
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-7 h-7 animate-spin text-cyan" />
        </div>
      ) : testimonials.length === 0 ? (
        <div
          className="text-center py-16"
          data-ocid="admin.testimonials.empty_state"
        >
          <Users className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">No testimonials yet.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {testimonials.map((t, i) => (
            <div
              key={t.id.toString()}
              className="p-5 rounded-xl border border-border bg-card hover:border-primary/20 transition-colors"
              data-ocid={`admin.testimonials.item.${i + 1}`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    {t.avatarUrl && <AvatarImage src={t.avatarUrl} />}
                    <AvatarFallback className="bg-primary/10 text-cyan text-xs">
                      {t.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-foreground text-sm">
                      {t.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t.role} · {t.company}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-7 h-7 text-muted-foreground hover:text-cyan hover:bg-primary/10"
                    onClick={() => openEdit(t)}
                    data-ocid="admin.edit_button"
                  >
                    <Pencil className="w-3 h-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-7 h-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() => setDeleteId(t.id)}
                    data-ocid="admin.delete_button"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <div className="flex gap-0.5 mb-2">
                {[0, 1, 2, 3, 4].map((j) => (
                  <Star
                    key={j}
                    className={`w-3 h-3 ${j < Number(t.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2 italic">
                "{t.content}"
              </p>
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
              {editingT ? "Edit Testimonial" : "Add Testimonial"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">
              Fill in the testimonial details.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Name *</Label>
                <Input
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="John Doe"
                  className="bg-background"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Role</Label>
                <Input
                  value={form.role}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, role: e.target.value }))
                  }
                  placeholder="CTO"
                  className="bg-background"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Company</Label>
              <Input
                value={form.company}
                onChange={(e) =>
                  setForm((p) => ({ ...p, company: e.target.value }))
                }
                placeholder="Acme Inc"
                className="bg-background"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Content *</Label>
              <Textarea
                value={form.content}
                onChange={(e) =>
                  setForm((p) => ({ ...p, content: e.target.value }))
                }
                rows={3}
                className="bg-background resize-none"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Avatar URL</Label>
              <Input
                value={form.avatarUrl}
                onChange={(e) =>
                  setForm((p) => ({ ...p, avatarUrl: e.target.value }))
                }
                placeholder="https://..."
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Rating</Label>
                <span className="text-xs text-cyan font-mono">
                  {rating} / 5
                </span>
              </div>
              <Slider
                value={[rating]}
                onValueChange={([v]) => setRating(v ?? 5)}
                min={1}
                max={5}
                step={1}
                className="w-full"
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
              {editingT ? "Update" : "Create"}
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
              Delete Testimonial?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Cannot be undone.
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
              disabled={deleteT.isPending}
              className="bg-destructive text-destructive-foreground"
              data-ocid="admin.confirm_button"
            >
              {deleteT.isPending ? (
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
