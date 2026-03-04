import { BookOpen, Eye, FolderOpen, HelpCircle, Tag } from "lucide-react";
import { motion } from "motion/react";

const sections = [
  {
    icon: FolderOpen,
    title: "How to Add Projects",
    color: "text-cyan",
    bg: "bg-cyan/10",
    steps: [
      "Go to Projects → Click 'Add Project'",
      "Fill in: Title, Description, Category (Mobile/Web/Backend)",
      "Add tags separated by commas (e.g., Flutter, Firebase)",
      "Optionally add Live URL and Repo URL",
      "Toggle 'Active' to make it visible on the public site",
      "Click 'Create' to save",
    ],
  },
  {
    icon: Eye,
    title: "How to Toggle Visibility",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    steps: [
      "In the Projects table, find the project you want to show/hide",
      "Toggle the Switch in the 'Status' column",
      "Active (ON) = visible on the public portfolio",
      "Inactive (OFF) = hidden from visitors, still in your admin",
      "Changes take effect immediately",
    ],
  },
  {
    icon: Tag,
    title: "How to Manage Categories",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    steps: [
      "Go to Categories → Click 'Add Category'",
      "Enter a name (e.g., 'Featured Projects')",
      "Set Sort Order to control display order (lower = first)",
      "Categories are used to filter and organize projects",
      "Edit or delete categories at any time",
      "Note: Built-in project categories (Mobile/Web/Backend) are separate",
    ],
  },
  {
    icon: BookOpen,
    title: "How to Manage Blogs",
    color: "text-green-400",
    bg: "bg-green-400/10",
    steps: [
      "Go to Blog → Click 'New Post'",
      "Enter Title — the slug is auto-generated (but editable)",
      "Write your content in the Content field (plain text or markdown-like)",
      "Add an Excerpt for the blog list preview",
      "Add Tags to categorize your post",
      "Toggle 'Published' to make the post public",
      "Unpublished posts are saved as drafts and not visible to visitors",
      "Slugs must be unique — duplicate slugs will be rejected",
    ],
  },
];

export default function AdminHelp() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <HelpCircle className="w-5 h-5 text-cyan" />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Help Guide
          </h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Everything you need to know to manage your portfolio
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {sections.map((section, i) => {
          const Icon = section.icon;
          return (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-xl border border-border bg-card"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-9 h-9 rounded-lg ${section.bg} flex items-center justify-center shrink-0`}
                >
                  <Icon className={`w-5 h-5 ${section.color}`} />
                </div>
                <h2
                  className={`font-display font-semibold text-base ${section.color}`}
                >
                  {section.title}
                </h2>
              </div>
              <ol className="space-y-2">
                {section.steps.map((step) => (
                  <li key={step} className="flex gap-3 text-sm">
                    <span className="font-mono text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded h-fit shrink-0 mt-0.5">
                      #
                    </span>
                    <span className="text-muted-foreground">{step}</span>
                  </li>
                ))}
              </ol>
            </motion.div>
          );
        })}
      </div>

      {/* General tips */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6 p-6 rounded-xl border border-primary/20 bg-primary/5"
      >
        <h2 className="font-display font-semibold text-cyan mb-3">
          General Tips
        </h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex gap-2">
            <span className="text-cyan">→</span> All changes are saved to the
            blockchain — they're permanent and immutable
          </li>
          <li className="flex gap-2">
            <span className="text-cyan">→</span> The public site reflects
            changes immediately after saving
          </li>
          <li className="flex gap-2">
            <span className="text-cyan">→</span> Use Sort Order to control the
            display sequence (lower numbers appear first)
          </li>
          <li className="flex gap-2">
            <span className="text-cyan">→</span> This Help Guide is only
            accessible from the admin panel
          </li>
          <li className="flex gap-2">
            <span className="text-cyan">→</span> For SEO, keep meta titles under
            60 chars and descriptions under 160 chars
          </li>
        </ul>
      </motion.div>
    </div>
  );
}
