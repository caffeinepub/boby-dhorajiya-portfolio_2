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
import { Badge } from "@/components/ui/badge";
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
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useCreateSkill,
  useDeleteSkill,
  useGetAllSkills,
  useUpdateSkill,
} from "@/hooks/useQueries";
import { Category } from "@/hooks/useQueries";
import { Loader2, Pencil, Plus, Trash2, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Skill } from "../../backend.d";

const categoryColors: Record<string, string> = {
  [Category.primary]: "bg-cyan/10 text-cyan border-cyan/20",
  [Category.secondary]: "bg-blue-400/10 text-blue-400 border-blue-400/20",
  [Category.security]: "bg-green-400/10 text-green-400 border-green-400/20",
  [Category.additional]:
    "bg-purple-400/10 text-purple-400 border-purple-400/20",
};

const emptySkill: Omit<Skill, "id"> = {
  name: "",
  category: Category.primary,
  level: 80n,
  icon: "",
  sortOrder: 0n,
};

export default function AdminSkills() {
  const { data: skills = [], isLoading } = useGetAllSkills();
  const createSkill = useCreateSkill();
  const updateSkill = useUpdateSkill();
  const deleteSkill = useDeleteSkill();

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<bigint | null>(null);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [form, setForm] = useState<Omit<Skill, "id">>(emptySkill);
  const [level, setLevel] = useState(80);

  const openCreate = () => {
    setEditingSkill(null);
    setForm(emptySkill);
    setLevel(80);
    setModalOpen(true);
  };

  const openEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setForm({
      name: skill.name,
      category: skill.category,
      level: skill.level,
      icon: skill.icon,
      sortOrder: skill.sortOrder,
    });
    setLevel(Number(skill.level));
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    const skillData = { ...form, level: BigInt(level) };
    try {
      if (editingSkill) {
        await updateSkill.mutateAsync({
          id: editingSkill.id,
          skill: { ...skillData, id: editingSkill.id },
        });
        toast.success("Skill updated");
      } else {
        await createSkill.mutateAsync({ ...skillData, id: 0n });
        toast.success("Skill created");
      }
      setModalOpen(false);
    } catch {
      toast.error("Failed to save skill");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteSkill.mutateAsync(deleteId);
      toast.success("Skill deleted");
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleteId(null);
    }
  };

  const isSaving = createSkill.isPending || updateSkill.isPending;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground mb-1">
            Skills
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage your skills and expertise levels
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="bg-primary/20 text-cyan border border-primary/30 hover:bg-primary/30"
          data-ocid="admin.create_button"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Skill
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-7 h-7 animate-spin text-cyan" />
        </div>
      ) : skills.length === 0 ? (
        <div className="text-center py-16" data-ocid="admin.skills.empty_state">
          <Zap className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">No skills yet.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Level</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {skills.map((skill, i) => (
                <TableRow
                  key={skill.id.toString()}
                  className="border-border hover:bg-card/50"
                  data-ocid={`admin.skills.item.${i + 1}`}
                >
                  <TableCell className="font-medium text-foreground">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{skill.icon || "⚙️"}</span>
                      {skill.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`capitalize text-xs ${categoryColors[skill.category] || ""}`}
                    >
                      {skill.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 min-w-[120px]">
                      <Progress
                        value={Number(skill.level)}
                        className="h-1.5 flex-1"
                      />
                      <span className="text-xs text-cyan font-mono w-8">
                        {skill.level.toString()}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="w-8 h-8 text-muted-foreground hover:text-cyan hover:bg-primary/10"
                        onClick={() => openEdit(skill)}
                        data-ocid="admin.edit_button"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="w-8 h-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setDeleteId(skill.id)}
                        data-ocid="admin.delete_button"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent
          className="sm:max-w-md bg-card border-border"
          data-ocid="admin.modal"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-foreground">
              {editingSkill ? "Edit Skill" : "Add Skill"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">
              Fill in the skill details.
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
                  placeholder="Flutter"
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
              <Label>Category</Label>
              <Select
                value={form.category}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, category: v as Category }))
                }
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Category.primary}>Primary</SelectItem>
                  <SelectItem value={Category.secondary}>Secondary</SelectItem>
                  <SelectItem value={Category.security}>Security</SelectItem>
                  <SelectItem value={Category.additional}>
                    Additional
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Level</Label>
                <span className="text-xs font-mono text-cyan">{level}%</span>
              </div>
              <Slider
                value={[level]}
                onValueChange={([v]) => setLevel(v ?? 80)}
                min={0}
                max={100}
                step={1}
                className="w-full"
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
              {editingSkill ? "Update" : "Create"}
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
              Delete Skill?
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
              disabled={deleteSkill.isPending}
              className="bg-destructive text-destructive-foreground"
              data-ocid="admin.confirm_button"
            >
              {deleteSkill.isPending ? (
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
