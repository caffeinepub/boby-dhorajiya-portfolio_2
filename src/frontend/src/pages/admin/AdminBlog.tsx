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
  useCreateBlogPost,
  useDeleteBlogPost,
  useGetAllBlogPostsAdmin,
  useUpdateBlogPost,
} from "@/hooks/useQueries";
import { BookOpen, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { BlogPost } from "../../backend.d";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const emptyPost: Omit<BlogPost, "id"> = {
  title: "",
  slug: "",
  content: "",
  excerpt: "",
  coverImage: "",
  tags: [],
  isPublished: false,
  publishedAt: 0n,
};

export default function AdminBlog() {
  const { data: posts = [], isLoading } = useGetAllBlogPostsAdmin();
  const createPost = useCreateBlogPost();
  const updatePost = useUpdateBlogPost();
  const deletePost = useDeleteBlogPost();

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<bigint | null>(null);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [form, setForm] = useState<Omit<BlogPost, "id">>(emptyPost);
  const [tagsInput, setTagsInput] = useState("");
  const [slugManual, setSlugManual] = useState(false);

  const openCreate = () => {
    setEditingPost(null);
    setForm(emptyPost);
    setTagsInput("");
    setSlugManual(false);
    setModalOpen(true);
  };

  const openEdit = (post: BlogPost) => {
    setEditingPost(post);
    setForm({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      coverImage: post.coverImage,
      tags: post.tags,
      isPublished: post.isPublished,
      publishedAt: post.publishedAt,
    });
    setTagsInput(post.tags.join(", "));
    setSlugManual(true);
    setModalOpen(true);
  };

  const handleTitleChange = (title: string) => {
    setForm((p) => ({
      ...p,
      title,
      slug: slugManual ? p.slug : generateSlug(title),
    }));
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!form.slug.trim()) {
      toast.error("Slug is required");
      return;
    }

    // Check for duplicate slug
    const existingSlugs = posts
      .filter((p) => !editingPost || p.id !== editingPost.id)
      .map((p) => p.slug);
    if (existingSlugs.includes(form.slug)) {
      toast.error("Slug already exists. Please use a unique slug.");
      return;
    }

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const postData = {
      ...form,
      tags,
      publishedAt:
        form.isPublished && form.publishedAt === 0n
          ? BigInt(Date.now()) * 1_000_000n
          : form.publishedAt,
    };

    try {
      if (editingPost) {
        await updatePost.mutateAsync({
          id: editingPost.id,
          post: { ...postData, id: editingPost.id },
        });
        toast.success("Post updated");
      } else {
        await createPost.mutateAsync({ ...postData, id: 0n });
        toast.success("Post created");
      }
      setModalOpen(false);
    } catch (err) {
      console.error("Failed to save blog post:", err);
      toast.error("Failed to save post");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deletePost.mutateAsync(deleteId);
      toast.success("Post deleted");
    } catch (err) {
      console.error("Failed to delete blog post:", err);
      toast.error("Failed to delete");
    } finally {
      setDeleteId(null);
    }
  };

  const isSaving = createPost.isPending || updatePost.isPending;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground mb-1">
            Blog
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage your blog posts
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="bg-primary/20 text-cyan border border-primary/30 hover:bg-primary/30"
          data-ocid="admin.create_button"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Post
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-7 h-7 animate-spin text-cyan" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16" data-ocid="admin.blog.empty_state">
          <BookOpen className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">No blog posts yet.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post, i) => (
                <TableRow
                  key={post.id.toString()}
                  className="border-border hover:bg-card/50"
                  data-ocid={`admin.blog.item.${i + 1}`}
                >
                  <TableCell className="font-medium text-foreground max-w-[200px] truncate">
                    {post.title}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs font-mono">
                    {post.slug}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 2).map((t) => (
                        <span
                          key={t}
                          className="text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={post.isPublished ? "default" : "secondary"}
                      className={
                        post.isPublished
                          ? "bg-green-400/15 text-green-400 border-green-400/20"
                          : "bg-muted text-muted-foreground"
                      }
                    >
                      {post.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="w-8 h-8 text-muted-foreground hover:text-cyan hover:bg-primary/10"
                        onClick={() => openEdit(post)}
                        data-ocid="admin.edit_button"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="w-8 h-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setDeleteId(post.id)}
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
          className="sm:max-w-2xl bg-card border-border max-h-[90vh] overflow-y-auto"
          data-ocid="admin.modal"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-foreground">
              {editingPost ? "Edit Post" : "New Post"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">
              Fill in the blog post details.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Title *</Label>
              <Input
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Building Secure Flutter Apps"
                className="bg-background"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Slug (auto-generated, editable)</Label>
              <Input
                value={form.slug}
                onChange={(e) => {
                  setSlugManual(true);
                  setForm((p) => ({ ...p, slug: e.target.value }));
                }}
                placeholder="building-secure-flutter-apps"
                className="bg-background font-mono text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Excerpt</Label>
              <Textarea
                value={form.excerpt}
                onChange={(e) =>
                  setForm((p) => ({ ...p, excerpt: e.target.value }))
                }
                rows={2}
                className="bg-background resize-none"
                placeholder="Brief summary..."
              />
            </div>
            <div className="space-y-1.5">
              <Label>Content</Label>
              <Textarea
                value={form.content}
                onChange={(e) =>
                  setForm((p) => ({ ...p, content: e.target.value }))
                }
                rows={8}
                className="bg-background resize-none font-mono text-sm"
                placeholder="Write your post content here..."
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Cover Image URL</Label>
                <Input
                  value={form.coverImage}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, coverImage: e.target.value }))
                  }
                  placeholder="https://..."
                  className="bg-background"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Tags (comma-separated)</Label>
                <Input
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Flutter, Security"
                  className="bg-background"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={form.isPublished}
                onCheckedChange={(v) =>
                  setForm((p) => ({ ...p, isPublished: v }))
                }
                id="isPublished"
              />
              <Label htmlFor="isPublished">Published (visible to public)</Label>
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
              {editingPost ? "Update" : "Publish"}
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
              Delete Post?
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
              disabled={deletePost.isPending}
              className="bg-destructive text-destructive-foreground"
              data-ocid="admin.confirm_button"
            >
              {deletePost.isPending ? (
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
