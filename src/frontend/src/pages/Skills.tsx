import { PageHeader } from "@/components/shared/PageHeader";
import { SkeletonCards } from "@/components/shared/SkeletonCard";
import { Progress } from "@/components/ui/progress";
import { useGetAllSkills } from "@/hooks/useQueries";
import { Category } from "@/hooks/useQueries";
import { Zap } from "lucide-react";
import { motion } from "motion/react";
import type { Skill } from "../backend.d";

const categoryConfig: Record<
  string,
  { label: string; color: string; bg: string; order: number }
> = {
  [Category.primary]: {
    label: "Primary Skills",
    color: "text-cyan",
    bg: "bg-cyan/10",
    order: 1,
  },
  [Category.secondary]: {
    label: "Secondary Skills",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    order: 2,
  },
  [Category.security]: {
    label: "Security Expertise",
    color: "text-green-400",
    bg: "bg-green-400/10",
    order: 3,
  },
  [Category.additional]: {
    label: "Additional Skills",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    order: 4,
  },
};

const defaultSkills: Skill[] = [
  {
    id: 1n,
    name: "Flutter",
    category: Category.primary,
    level: 95n,
    icon: "🦋",
    sortOrder: 1n,
  },
  {
    id: 2n,
    name: "Dart",
    category: Category.primary,
    level: 92n,
    icon: "🎯",
    sortOrder: 2n,
  },
  {
    id: 3n,
    name: "React Native",
    category: Category.secondary,
    level: 88n,
    icon: "⚛️",
    sortOrder: 3n,
  },
  {
    id: 4n,
    name: "JavaScript",
    category: Category.secondary,
    level: 85n,
    icon: "⚡",
    sortOrder: 4n,
  },
  {
    id: 5n,
    name: "TypeScript",
    category: Category.secondary,
    level: 80n,
    icon: "🔷",
    sortOrder: 5n,
  },
  {
    id: 6n,
    name: "Mobile Security (OWASP)",
    category: Category.security,
    level: 90n,
    icon: "🛡️",
    sortOrder: 6n,
  },
  {
    id: 7n,
    name: "JWT Authentication",
    category: Category.security,
    level: 92n,
    icon: "🔐",
    sortOrder: 7n,
  },
  {
    id: 8n,
    name: "Secure API Design",
    category: Category.security,
    level: 88n,
    icon: "🔒",
    sortOrder: 8n,
  },
  {
    id: 9n,
    name: "AES Encryption",
    category: Category.security,
    level: 85n,
    icon: "🔑",
    sortOrder: 9n,
  },
  {
    id: 10n,
    name: "Firebase",
    category: Category.additional,
    level: 82n,
    icon: "🔥",
    sortOrder: 10n,
  },
  {
    id: 11n,
    name: "REST APIs",
    category: Category.additional,
    level: 90n,
    icon: "🔌",
    sortOrder: 11n,
  },
  {
    id: 12n,
    name: "Git & CI/CD",
    category: Category.additional,
    level: 80n,
    icon: "🔧",
    sortOrder: 12n,
  },
];

function SkillRow({ skill, delay }: { skill: Skill; delay: number }) {
  const level = Number(skill.level);
  const config =
    categoryConfig[skill.category] ?? categoryConfig[Category.additional];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4 }}
      className="group flex items-center gap-4 p-3 rounded-lg hover:bg-card/50 transition-colors"
    >
      <div className="w-9 h-9 rounded-lg bg-card border border-border flex items-center justify-center text-lg shrink-0 group-hover:border-primary/30 transition-colors">
        {skill.icon || "🔧"}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm font-medium text-foreground truncate">
            {skill.name}
          </span>
          <span
            className={`text-xs font-mono font-bold ${config.color} ml-2 shrink-0`}
          >
            {level}%
          </span>
        </div>
        <Progress value={level} className="h-1.5 bg-muted" />
      </div>
    </motion.div>
  );
}

export default function Skills() {
  const { data: skills = [], isLoading } = useGetAllSkills();
  const displaySkills = skills.length > 0 ? skills : defaultSkills;

  const grouped = Object.entries(categoryConfig)
    .sort(([, a], [, b]) => a.order - b.order)
    .map(([key, config]) => ({
      key,
      config,
      skills: displaySkills
        .filter((s) => s.category === key)
        .sort((a, b) => Number(b.level) - Number(a.level)),
    }))
    .filter((g) => g.skills.length > 0);

  return (
    <div className="min-h-screen pt-24 pb-20 relative">
      <div className="absolute inset-0 bg-grid opacity-15 pointer-events-none" />
      <div className="container mx-auto px-4">
        <PageHeader
          title="Skills & Expertise"
          subtitle="My technical toolkit built through years of mobile development and security engineering."
          badge="Capabilities"
        />

        {isLoading ? (
          <SkeletonCards count={4} />
        ) : (
          <div className="grid sm:grid-cols-2 gap-6">
            {grouped.map((group) => (
              <motion.div
                key={group.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-5 rounded-xl border border-border bg-card hover:border-primary/20 transition-colors"
              >
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className={`w-8 h-8 rounded-lg ${group.config.bg} flex items-center justify-center`}
                  >
                    <Zap className={`w-4 h-4 ${group.config.color}`} />
                  </div>
                  <h2
                    className={`font-display font-semibold text-base ${group.config.color}`}
                  >
                    {group.config.label}
                  </h2>
                  <span className="ml-auto text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {group.skills.length} skills
                  </span>
                </div>

                {/* Skills */}
                <div className="space-y-1">
                  {group.skills.map((skill, i) => (
                    <SkillRow
                      key={skill.id.toString()}
                      skill={skill}
                      delay={i * 0.06}
                    />
                  ))}
                </div>
              </motion.div>
            ))}

            {grouped.length === 0 && (
              <div
                className="col-span-2 text-center py-16 text-muted-foreground"
                data-ocid="skills.empty_state"
              >
                <Zap className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                <p>No skills data available.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
