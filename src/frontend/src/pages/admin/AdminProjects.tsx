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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateProject,
  useDeleteProject,
  useGetAllCategories,
  useGetAllProjectsAdmin,
  useUpdateProject,
} from "@/hooks/useQueries";
import { Category__1 } from "@/hooks/useQueries";
import { FolderOpen, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Project } from "../../backend.d";

const emptyProject: Omit<Project, "id"> = {
  title: "",
  description: "",
  imageUrl: "",
  liveUrl: "",
  repoUrl: "",
  category: Category__1.mobile,
  tags: [],
  isActive: true,
  sortOrder: 0n,
};

export default function AdminProjects() {
  const { data: projects = [], isLoading } = useGetAllProjectsAdmin();
  const { data: customCategories = [] } = useGetAllCategories();
  // Built-in categories + custom categories from admin
  const allCategories = [
    { value: Category__1.mobile, label: "Mobile" },
    { value: Category__1.web, label: "Web" },
    { value: Category__1.backend, label: "Backend" },
    ...customCategories.map((c) => ({
      value: c.name.toLowerCase(),
      label: c.name,
    })),
  ];
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<bigint | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [form, setForm] = useState<Omit<Project, "id">>(emptyProject);
  const [tagsInput, setTagsInput] = useState("");

  const openCreate = () => {
    setEditingProject(null);
    setForm(emptyProject);
    setTagsInput("");
    setModalOpen(true);
  };

  const openEdit = (project: Project) => {
    setEditingProject(project);
    setForm({
      title: project.title,
      description: project.description,
      imageUrl: project.imageUrl,
      liveUrl: project.liveUrl,
      repoUrl: project.repoUrl,
      category: project.category,
      tags: project.tags,
      isActive: project.isActive,
      sortOrder: project.sortOrder,
    });
    setTagsInput(project.tags.join(", "));
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const projectData = { ...form, tags };

    try {
      if (editingProject) {
        await updateProject.mutateAsync({
          id: editingProject.id,
          project: { ...projectData, id: editingProject.id },
        });
        toast.success("Project updated");
      } else {
        await createProject.mutateAsync({ ...projectData, id: 0n });
        toast.success("Project created");
      }
      setModalOpen(false);
    } catch (err) {
      console.error("Failed to save project:", err);
      toast.error("Failed to save project");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteProject.mutateAsync(deleteId);
      toast.success("Project deleted");
    } catch (err) {
      console.error("Failed to delete project:", err);
      toast.error("Failed to delete project");
    } finally {
      setDeleteId(null);
    }
  };

  const isSaving = createProject.isPending || updateProject.isPending;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground mb-1">
            Projects
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage your portfolio projects
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="bg-primary/20 text-cyan border border-primary/30 hover:bg-primary/30"
          data-ocid="admin.create_button"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      {isLoading ? (
        <div
          className="flex justify-center py-16"
          data-ocid="admin.projects.loading_state"
        >
          <Loader2 className="w-7 h-7 animate-spin text-cyan" />
        </div>
      ) : projects.length === 0 ? (
        <div
          className="text-center py-16"
          data-ocid="admin.projects.empty_state"
        >
          <FolderOpen className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">
            No projects yet. Create your first one!
          </p>
        </div>
      ) : (
        <div
          className="rounded-xl border border-border overflow-hidden"
          data-ocid="admin.projects_table"
        >
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Title</TableHead>
                <TableHead className="text-muted-foreground">
                  Category
                </TableHead>
                <TableHead className="text-muted-foreground">Tags</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project, i) => (
                <TableRow
                  key={project.id.toString()}
                  className="border-border hover:bg-card/50"
                  data-ocid={`admin.projects.item.${i + 1}`}
                >
                  <TableCell className="font-medium text-foreground max-w-[200px] truncate">
                    {project.title}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className="capitalize text-xs bg-primary/10 text-cyan border-primary/20"
                    >
                      {project.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {project.tags.slice(0, 2).map((t) => (
                        <span
                          key={t}
                          className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded"
                        >
                          {t}
                        </span>
                      ))}
                      {project.tags.length > 2 && (
                        <span className="text-xs text-muted-foreground">
                          +{project.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={project.isActive}
                      onCheckedChange={async (checked) => {
                        try {
                          await updateProject.mutateAsync({
                            id: project.id,
                            project: { ...project, isActive: checked },
                          });
                          toast.success(
                            checked ? "Project activated" : "Project hidden",
                          );
                        } catch (err) {
                          console.error(
                            "Failed to update project status:",
                            err,
                          );
                          toast.error("Failed to update");
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="w-8 h-8 text-muted-foreground hover:text-cyan hover:bg-primary/10"
                        onClick={() => openEdit(project)}
                        data-ocid="admin.edit_button"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="w-8 h-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setDeleteId(project.id)}
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

      {/* Create/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent
          className="sm:max-w-lg bg-card border-border max-h-[90vh] overflow-y-auto"
          data-ocid="admin.modal"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-foreground">
              {editingProject ? "Edit Project" : "Add Project"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">
              {editingProject
                ? "Update the project details below."
                : "Fill in the project details."}
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
                placeholder="Flutter Banking App"
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
                placeholder="Project description..."
                rows={3}
                className="bg-background resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) =>
                    setForm((p) => ({ ...p, category: v as Category__1 }))
                  }
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {allCategories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
            <div className="space-y-1.5">
              <Label>Tags (comma-separated)</Label>
              <Input
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Flutter, Dart, Firebase"
                className="bg-background"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Image URL</Label>
              <Input
                value={form.imageUrl}
                onChange={(e) =>
                  setForm((p) => ({ ...p, imageUrl: e.target.value }))
                }
                placeholder="https://..."
                className="bg-background"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Live URL</Label>
                <Input
                  value={form.liveUrl}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, liveUrl: e.target.value }))
                  }
                  placeholder="https://..."
                  className="bg-background"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Repo URL</Label>
                <Input
                  value={form.repoUrl}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, repoUrl: e.target.value }))
                  }
                  placeholder="https://github.com/..."
                  className="bg-background"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={form.isActive}
                onCheckedChange={(v) => setForm((p) => ({ ...p, isActive: v }))}
                id="isActive"
              />
              <Label htmlFor="isActive">Active (visible on public site)</Label>
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
              {editingProject ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
      >
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">
              Delete Project?
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
              disabled={deleteProject.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-ocid="admin.confirm_button"
            >
              {deleteProject.isPending ? (
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
