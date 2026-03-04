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
import {
  useCreateCategory,
  useDeleteCategory,
  useGetAllCategories,
  useUpdateCategory,
} from "@/hooks/useQueries";
import { Loader2, Pencil, Plus, Tag, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Category__2 } from "../../backend.d";

const emptyCategory: Omit<Category__2, "id"> = { name: "", sortOrder: 0n };

export default function AdminCategories() {
  const { data: categories = [], isLoading } = useGetAllCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<bigint | null>(null);
  const [editingCat, setEditingCat] = useState<Category__2 | null>(null);
  const [form, setForm] = useState<Omit<Category__2, "id">>(emptyCategory);

  const openCreate = () => {
    setEditingCat(null);
    setForm(emptyCategory);
    setModalOpen(true);
  };
  const openEdit = (c: Category__2) => {
    setEditingCat(c);
    setForm({ name: c.name, sortOrder: c.sortOrder });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    try {
      if (editingCat) {
        await updateCategory.mutateAsync({
          id: editingCat.id,
          category: { ...form, id: editingCat.id },
        });
        toast.success("Category updated");
      } else {
        await createCategory.mutateAsync({ ...form, id: 0n });
        toast.success("Category created");
      }
      setModalOpen(false);
    } catch {
      toast.error("Failed to save");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteCategory.mutateAsync(deleteId);
      toast.success("Deleted");
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleteId(null);
    }
  };

  const isSaving = createCategory.isPending || updateCategory.isPending;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground mb-1">
            Categories
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage project categories
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="bg-primary/20 text-cyan border border-primary/30 hover:bg-primary/30"
          data-ocid="admin.create_button"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-7 h-7 animate-spin text-cyan" />
        </div>
      ) : categories.length === 0 ? (
        <div
          className="text-center py-16"
          data-ocid="admin.categories.empty_state"
        >
          <Tag className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">No categories yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {categories
            .sort((a, b) => Number(a.sortOrder) - Number(b.sortOrder))
            .map((cat, i) => (
              <div
                key={cat.id.toString()}
                className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:border-primary/20 transition-colors"
                data-ocid={`admin.categories.item.${i + 1}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Tag className="w-3.5 h-3.5 text-cyan" />
                  </div>
                  <span className="font-medium text-foreground text-sm">
                    {cat.name}
                  </span>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                    Order: {cat.sortOrder.toString()}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-7 h-7 text-muted-foreground hover:text-cyan hover:bg-primary/10"
                    onClick={() => openEdit(cat)}
                    data-ocid="admin.edit_button"
                  >
                    <Pencil className="w-3 h-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-7 h-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() => setDeleteId(cat.id)}
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
          className="sm:max-w-sm bg-card border-border"
          data-ocid="admin.modal"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-foreground">
              {editingCat ? "Edit Category" : "Add Category"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">
              Fill in the category details.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Name *</Label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="Mobile Apps"
                className="bg-background"
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
                    sortOrder: BigInt(e.target.value || 0),
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
              {editingCat ? "Update" : "Create"}
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
              Delete Category?
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
              disabled={deleteCategory.isPending}
              className="bg-destructive text-destructive-foreground"
              data-ocid="admin.confirm_button"
            >
              {deleteCategory.isPending ? (
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
