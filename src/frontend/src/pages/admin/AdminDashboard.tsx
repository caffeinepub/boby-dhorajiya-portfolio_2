import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetDashboardStats, useResetAllData } from "@/hooks/useQueries";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  BookOpen,
  FolderOpen,
  Loader2,
  Mail,
  Settings,
  Trash2,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const statConfig = [
  {
    key: "projectsCount",
    label: "Total Projects",
    icon: FolderOpen,
    color: "text-cyan",
    bg: "bg-cyan/10",
  },
  {
    key: "blogsCount",
    label: "Total Blogs",
    icon: BookOpen,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    key: "skillsCount",
    label: "Total Skills",
    icon: Zap,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
  {
    key: "leadsCount",
    label: "Total Leads",
    icon: Mail,
    color: "text-green-400",
    bg: "bg-green-400/10",
  },
  {
    key: "servicesCount",
    label: "Total Services",
    icon: Settings,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
  },
  {
    key: "testimonialsCount",
    label: "Testimonials",
    icon: Users,
    color: "text-pink-400",
    bg: "bg-pink-400/10",
  },
];

export default function AdminDashboard() {
  const { data: stats, isLoading } = useGetDashboardStats();
  const resetMutation = useResetAllData();
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleReset = async () => {
    try {
      await resetMutation.mutateAsync("");
      setDialogOpen(false);
      toast.success(
        "Database reset successfully. Please log out and log in again to re-register as admin.",
        { duration: 5000 },
      );
      setTimeout(() => {
        navigate({ to: "/admin/login" });
      }, 2000);
    } catch {
      toast.error("Reset failed. Try again.");
    }
  };

  return (
    <div className="p-8" data-ocid="admin.dashboard_panel">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground mb-1">
          Dashboard
        </h1>
        <p className="text-muted-foreground text-sm">
          Overview of your portfolio content
        </p>
      </div>

      {isLoading ? (
        <div
          className="flex justify-center py-16"
          data-ocid="admin.dashboard_loading_state"
        >
          <Loader2 className="w-8 h-8 animate-spin text-cyan" />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {statConfig.map((stat, i) => {
            const Icon = stat.icon;
            const value = stats
              ? Number((stats as Record<string, bigint>)[stat.key])
              : 0;
            return (
              <motion.div
                key={stat.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <Card className="border-border bg-card hover:border-primary/30 hover:glow-cyan-sm transition-all duration-300">
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.label}
                    </CardTitle>
                    <div
                      className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center`}
                    >
                      <Icon className={`w-4 h-4 ${stat.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div
                      className={`font-display text-3xl font-bold ${stat.color}`}
                    >
                      {value}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-12"
      >
        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-red-500/15 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-red-400" />
            </div>
            <h2 className="font-display text-base font-semibold text-red-400 tracking-wide uppercase">
              Danger Zone
            </h2>
          </div>
          <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
            Permanently wipe all portfolio data and reset admin access. This
            action cannot be undone. Use only when you need a fresh start.
          </p>

          <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="gap-2 bg-red-600 hover:bg-red-700 text-white border-0"
                data-ocid="admin.reset_database_button"
              >
                <Trash2 className="w-4 h-4" />
                Reset Database
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent
              className="border-red-500/40 bg-card"
              data-ocid="admin.reset_dialog"
            >
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2 text-red-400">
                  <AlertTriangle className="w-5 h-5" />
                  Reset All Data?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-muted-foreground leading-relaxed">
                  This will permanently delete{" "}
                  <span className="text-foreground font-medium">ALL data</span>{" "}
                  — projects, skills, services, blogs, testimonials,
                  experiences, contacts, and social links — and reset admin
                  access. You will need to log in again to re-register as admin.
                  <br />
                  <br />
                  <span className="text-red-400 font-medium">
                    This action cannot be undone.
                  </span>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  className="border-border hover:bg-muted"
                  data-ocid="admin.reset_cancel_button"
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleReset}
                  disabled={resetMutation.isPending}
                  className="bg-red-600 hover:bg-red-700 text-white focus:ring-red-500"
                  data-ocid="admin.reset_confirm_button"
                >
                  {resetMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Resetting…
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Reset Everything
                    </>
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </motion.div>
    </div>
  );
}
