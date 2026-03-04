import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetDashboardStats } from "@/hooks/useQueries";
import {
  BookOpen,
  FolderOpen,
  Loader2,
  Mail,
  Settings,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

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
    </div>
  );
}
