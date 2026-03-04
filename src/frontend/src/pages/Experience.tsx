import { PageHeader } from "@/components/shared/PageHeader";
import { useGetAllExperiences } from "@/hooks/useQueries";
import { Briefcase, Calendar } from "lucide-react";
import { motion } from "motion/react";
import type { Experience as ExperienceType } from "../backend.d";

const defaultExperiences: ExperienceType[] = [
  {
    id: 1n,
    title: "Mobile App Developer",
    company: "Nexus IT Solution",
    duration: "2021 – Present",
    description:
      "Lead mobile developer building Flutter and React Native applications. Implemented enterprise security protocols across 10+ production apps, reducing vulnerability count by 95%. Developed real-time collaboration features, secure payment integrations, and biometric authentication systems.",
    sortOrder: 1n,
  },
  {
    id: 2n,
    title: "Flutter Developer",
    company: "Digital Craft Studios",
    duration: "2020 – 2021",
    description:
      "Built 5+ Flutter apps for clients across FinTech, HealthTech, and EdTech verticals. Focused on clean architecture patterns (BLoC, Provider, Riverpod) and performance optimization. Introduced security auditing process to the team.",
    sortOrder: 2n,
  },
  {
    id: 3n,
    title: "Junior Mobile Developer",
    company: "AppWorks Agency",
    duration: "2019 – 2020",
    description:
      "Started cross-platform development journey with React Native. Built e-commerce and utility apps. Learned fundamentals of mobile security and began OWASP study.",
    sortOrder: 3n,
  },
];

function TimelineItem({
  experience,
  index,
  isLast,
}: {
  experience: ExperienceType;
  index: number;
  isLast: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="relative flex gap-6"
    >
      {/* Timeline connector */}
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-primary/15 border-2 border-primary/40 flex items-center justify-center shrink-0 z-10 glow-cyan-sm">
          <Briefcase className="w-4 h-4 text-cyan" />
        </div>
        {!isLast && (
          <div className="w-px flex-1 bg-gradient-to-b from-primary/30 to-primary/5 mt-2" />
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 pb-10 ${isLast ? "pb-0" : ""}`}>
        <div className="p-5 rounded-xl border border-border bg-card hover:border-primary/30 hover:glow-cyan transition-all duration-300 group">
          <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="font-display font-semibold text-foreground group-hover:text-cyan transition-colors">
                {experience.title}
              </h3>
              <p className="text-sm text-cyan font-medium">
                {experience.company}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
              <Calendar className="w-3 h-3" />
              {experience.duration}
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {experience.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Experience() {
  const { data: experiences = [] } = useGetAllExperiences();
  const displayExperiences =
    experiences.length > 0
      ? [...experiences].sort(
          (a, b) => Number(a.sortOrder) - Number(b.sortOrder),
        )
      : defaultExperiences;

  return (
    <div className="min-h-screen pt-24 pb-20 relative">
      <div className="absolute inset-0 bg-grid opacity-15 pointer-events-none" />
      <div className="container mx-auto px-4">
        <PageHeader
          title="Work Experience"
          subtitle="My professional journey in mobile development and security engineering."
          badge="Career"
        />

        {displayExperiences.length === 0 ? (
          <div className="text-center py-16" data-ocid="experience.empty_state">
            <Briefcase className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">
              No experience data available.
            </p>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            {displayExperiences.map((exp, i) => (
              <TimelineItem
                key={exp.id.toString()}
                experience={exp}
                index={i}
                isLast={i === displayExperiences.length - 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
