import { PageHeader } from "@/components/shared/PageHeader";
import { SkeletonCards } from "@/components/shared/SkeletonCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetActiveProjects } from "@/hooks/useQueries";
import { Category__1 } from "@/hooks/useQueries";
import { ExternalLink, Folder, Github } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Project } from "../backend.d";

const filterCategories = [
  { value: "all", label: "All" },
  { value: Category__1.mobile, label: "Mobile" },
  { value: Category__1.web, label: "Web" },
  { value: Category__1.backend, label: "Backend" },
] as const;

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      whileHover={{ y: -4 }}
      className="group rounded-xl border border-border bg-card hover:border-primary/30 hover:glow-cyan transition-all duration-300 overflow-hidden flex flex-col"
      data-ocid={`projects.item.${index + 1}`}
    >
      {/* Image */}
      <div className="relative h-44 bg-gradient-to-br from-navy to-background overflow-hidden">
        {project.imageUrl ? (
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-electric/10">
            <Folder className="w-12 h-12 text-primary/30" />
          </div>
        )}
        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <Badge className="bg-black/60 text-cyan border-primary/30 text-xs capitalize backdrop-blur-sm">
            {project.category}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-5 space-y-3">
        <h3 className="font-display font-semibold text-foreground line-clamp-1 group-hover:text-cyan transition-colors">
          {project.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {project.description}
        </p>

        {/* Tags */}
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-full text-xs bg-muted text-muted-foreground border border-border"
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 4 && (
              <span className="px-2 py-0.5 rounded-full text-xs text-muted-foreground">
                +{project.tags.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Links */}
      <div className="p-5 pt-0 flex gap-2">
        {project.liveUrl && (
          <Button
            asChild
            size="sm"
            variant="outline"
            className="flex-1 text-xs border-border hover:border-primary/40 hover:text-cyan hover:bg-primary/5"
          >
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-3 h-3 mr-1.5" />
              Live Demo
            </a>
          </Button>
        )}
        {project.repoUrl && (
          <Button
            asChild
            size="sm"
            variant="outline"
            className="flex-1 text-xs border-border hover:border-primary/40 hover:text-cyan hover:bg-primary/5"
          >
            <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
              <Github className="w-3 h-3 mr-1.5" />
              Code
            </a>
          </Button>
        )}
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState("all");
  const { data: projects = [], isLoading } = useGetActiveProjects();

  const filtered =
    activeFilter === "all"
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  return (
    <div className="min-h-screen pt-24 pb-20 relative">
      <div className="absolute inset-0 bg-dots opacity-15 pointer-events-none" />
      <div className="container mx-auto px-4">
        <PageHeader
          title="My Projects"
          subtitle="A selection of mobile and web applications I've built with a focus on security and performance."
          badge="Portfolio"
        />

        {/* Filter Tabs */}
        <div className="flex justify-center mb-8">
          <Tabs value={activeFilter} onValueChange={setActiveFilter}>
            <TabsList className="bg-card border border-border p-1">
              {filterCategories.map((cat) => (
                <TabsTrigger
                  key={cat.value}
                  value={cat.value}
                  data-ocid="projects.filter.tab"
                  className="data-[state=active]:bg-primary/20 data-[state=active]:text-cyan text-muted-foreground hover:text-foreground text-sm px-4"
                >
                  {cat.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Content */}
        {isLoading ? (
          <SkeletonCards count={6} />
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
            data-ocid="projects.empty_state"
          >
            <Folder className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-display font-semibold text-foreground mb-2">
              No Projects Found
            </h3>
            <p className="text-muted-foreground text-sm">
              {activeFilter === "all"
                ? "No projects available yet. Check back soon!"
                : `No ${activeFilter} projects found.`}
            </p>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((project, i) => (
                <ProjectCard
                  key={project.id.toString()}
                  project={project}
                  index={i}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
