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
import { Switch } from "@/components/ui/switch";
import {
  useCreateSocialLink,
  useDeleteSocialLink,
  useGetAllSocialLinks,
  useUpdateSocialLink,
} from "@/hooks/useQueries";
import { Link2, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { SocialLink } from "../../backend.d";

const emptyLink: Omit<SocialLink, "id"> = {
  platform: "",
  url: "",
  isActive: true,
  sortOrder: 0n,
};

export default function AdminSocialLinks() {
  const { data: links = [], isLoading } = useGetAllSocialLinks();
  const createLink = useCreateSocialLink();
  const updateLink = useUpdateSocialLink();
  const deleteLink = useDeleteSocialLink();

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<bigint | null>(null);
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);
  const [form, setForm] = useState<Omit<SocialLink, "id">>(emptyLink);

  const openCreate = () => {
    setEditingLink(null);
    setForm(emptyLink);
    setModalOpen(true);
  };
  const openEdit = (l: SocialLink) => {
    setEditingLink(l);
    setForm({
      platform: l.platform,
      url: l.url,
      isActive: l.isActive,
      sortOrder: l.sortOrder,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.platform.trim() || !form.url.trim()) {
      toast.error("Platform and URL required");
      return;
    }
    try {
      if (editingLink) {
        await updateLink.mutateAsync({
          id: editingLink.id,
          link: { ...form, id: editingLink.id },
        });
        toast.success("Link updated");
      } else {
        await createLink.mutateAsync({ ...form, id: 0n });
        toast.success("Link created");
      }
      setModalOpen(false);
    } catch {
      toast.error("Failed to save");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteLink.mutateAsync(deleteId);
      toast.success("Deleted");
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleteId(null);
    }
  };

  const isSaving = createLink.isPending || updateLink.isPending;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground mb-1">
            Social Links
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage your social media links
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="bg-primary/20 text-cyan border border-primary/30 hover:bg-primary/30"
          data-ocid="admin.create_button"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Link
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-7 h-7 animate-spin text-cyan" />
        </div>
      ) : links.length === 0 ? (
        <div
          className="text-center py-16"
          data-ocid="admin.social_links.empty_state"
        >
          <Link2 className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">No social links yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {links
            .sort((a, b) => Number(a.sortOrder) - Number(b.sortOrder))
            .map((link, i) => (
              <div
                key={link.id.toString()}
                className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:border-primary/20 transition-colors"
                data-ocid={`admin.social_links.item.${i + 1}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Link2 className="w-3.5 h-3.5 text-cyan" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-foreground text-sm capitalize">
                      {link.platform}
                    </div>
                    <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                      {link.url}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Switch
                    checked={link.isActive}
                    onCheckedChange={async (v) => {
                      try {
                        await updateLink.mutateAsync({
                          id: link.id,
                          link: { ...link, isActive: v },
                        });
                        toast.success(v ? "Link activated" : "Link hidden");
                      } catch {
                        toast.error("Failed to update");
                      }
                    }}
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-7 h-7 text-muted-foreground hover:text-cyan hover:bg-primary/10"
                    onClick={() => openEdit(link)}
                    data-ocid="admin.edit_button"
                  >
                    <Pencil className="w-3 h-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-7 h-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() => setDeleteId(link.id)}
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
              {editingLink ? "Edit Link" : "Add Link"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">
              Fill in the social link details.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Platform *</Label>
              <Input
                value={form.platform}
                onChange={(e) =>
                  setForm((p) => ({ ...p, platform: e.target.value }))
                }
                placeholder="GitHub"
                className="bg-background"
              />
            </div>
            <div className="space-y-1.5">
              <Label>URL *</Label>
              <Input
                value={form.url}
                onChange={(e) =>
                  setForm((p) => ({ ...p, url: e.target.value }))
                }
                placeholder="https://github.com/..."
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
            <div className="flex items-center gap-3">
              <Switch
                checked={form.isActive}
                onCheckedChange={(v) => setForm((p) => ({ ...p, isActive: v }))}
                id="isActive"
              />
              <Label htmlFor="isActive">Active</Label>
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
              {editingLink ? "Update" : "Create"}
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
              Delete Link?
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
              disabled={deleteLink.isPending}
              className="bg-destructive text-destructive-foreground"
              data-ocid="admin.confirm_button"
            >
              {deleteLink.isPending ? (
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
