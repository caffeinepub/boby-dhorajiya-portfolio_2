import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useGetSeoSettings, useUpdateSeoSettings } from "@/hooks/useQueries";
import { Loader2, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminSEO() {
  const { data: seo, isLoading } = useGetSeoSettings();
  const updateSeo = useUpdateSeoSettings();

  const [form, setForm] = useState({
    metaTitle: "",
    metaDescription: "",
    ogImage: "",
  });

  useEffect(() => {
    if (seo) {
      setForm({
        metaTitle: seo.metaTitle,
        metaDescription: seo.metaDescription,
        ogImage: seo.ogImage,
      });
    }
  }, [seo]);

  const handleSave = async () => {
    if (!form.metaTitle.trim()) {
      toast.error("Meta title is required");
      return;
    }
    try {
      await updateSeo.mutateAsync(form);
      toast.success("SEO settings saved");
    } catch (err) {
      console.error("Failed to save SEO settings:", err);
      toast.error("Failed to save SEO settings");
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground mb-1">
          SEO Settings
        </h1>
        <p className="text-muted-foreground text-sm">
          Configure meta tags and Open Graph settings
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-7 h-7 animate-spin text-cyan" />
        </div>
      ) : (
        <div className="max-w-xl">
          <div className="p-6 rounded-xl border border-border bg-card space-y-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Settings className="w-4 h-4 text-cyan" />
              </div>
              <span className="font-display font-semibold text-foreground">
                Meta Configuration
              </span>
            </div>

            <div className="space-y-1.5">
              <Label>Meta Title *</Label>
              <Input
                value={form.metaTitle}
                onChange={(e) =>
                  setForm((p) => ({ ...p, metaTitle: e.target.value }))
                }
                placeholder="Boby Dhorajiya | Flutter & React Native Developer"
                className="bg-background"
              />
              <p className="text-xs text-muted-foreground">
                {form.metaTitle.length}/60 chars recommended
              </p>
            </div>

            <div className="space-y-1.5">
              <Label>Meta Description</Label>
              <Textarea
                value={form.metaDescription}
                onChange={(e) =>
                  setForm((p) => ({ ...p, metaDescription: e.target.value }))
                }
                placeholder="Mobile app developer specializing in Flutter and React Native..."
                rows={3}
                className="bg-background resize-none"
              />
              <p className="text-xs text-muted-foreground">
                {form.metaDescription.length}/160 chars recommended
              </p>
            </div>

            <div className="space-y-1.5">
              <Label>Open Graph Image URL</Label>
              <Input
                value={form.ogImage}
                onChange={(e) =>
                  setForm((p) => ({ ...p, ogImage: e.target.value }))
                }
                placeholder="https://yourdomain.com/og-image.png"
                className="bg-background"
              />
              <p className="text-xs text-muted-foreground">
                Recommended: 1200×630px
              </p>
            </div>

            {form.ogImage && (
              <div className="rounded-lg overflow-hidden border border-border">
                <img
                  src={form.ogImage}
                  alt="OG Preview"
                  className="w-full h-40 object-cover"
                />
              </div>
            )}

            <Button
              onClick={() => {
                void handleSave();
              }}
              disabled={updateSeo.isPending}
              className="w-full bg-primary/20 text-cyan border border-primary/30 hover:bg-primary/30"
              data-ocid="admin.seo.save_button"
            >
              {updateSeo.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              Save SEO Settings
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
