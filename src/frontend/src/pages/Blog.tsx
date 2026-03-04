import { PageHeader } from "@/components/shared/PageHeader";
import { SkeletonCards } from "@/components/shared/SkeletonCard";
import { Badge } from "@/components/ui/badge";
import { useGetPublishedBlogPosts } from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Calendar, Tag } from "lucide-react";
import { motion } from "motion/react";
import type { BlogPost } from "../backend.d";

function formatDate(timestamp: bigint): string {
  if (!timestamp || timestamp === 0n) return "Draft";
  try {
    const ms = Number(timestamp / 1_000_000n);
    return new Date(ms).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "Draft";
  }
}

function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileHover={{ y: -4 }}
      className="group rounded-xl border border-border bg-card hover:border-primary/30 hover:glow-cyan transition-all duration-300 overflow-hidden flex flex-col"
      data-ocid={`blog.item.${index + 1}`}
    >
      {/* Cover Image */}
      {post.coverImage ? (
        <div className="h-44 overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="h-44 bg-gradient-to-br from-primary/10 via-navy to-electric/10 flex items-center justify-center">
          <BookOpen className="w-10 h-10 text-primary/30" />
        </div>
      )}

      <div className="flex-1 p-5 space-y-3 flex flex-col">
        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs bg-primary/10 text-cyan border-primary/20"
              >
                <Tag className="w-2.5 h-2.5 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <h2 className="font-display font-semibold text-foreground line-clamp-2 group-hover:text-cyan transition-colors leading-snug">
          {post.title}
        </h2>

        {post.excerpt && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">
            {post.excerpt}
          </p>
        )}

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(post.publishedAt)}
          </div>
          <Link
            to="/blog/$slug"
            params={{ slug: post.slug }}
            className="flex items-center gap-1 text-xs text-cyan font-medium hover:underline"
          >
            Read more
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export default function Blog() {
  const { data: posts = [], isLoading } = useGetPublishedBlogPosts();

  return (
    <div className="min-h-screen pt-24 pb-20 relative">
      <div className="absolute inset-0 bg-dots opacity-15 pointer-events-none" />
      <div className="container mx-auto px-4">
        <PageHeader
          title="Blog & Insights"
          subtitle="Thoughts on mobile development, security engineering, and the Flutter & React Native ecosystem."
          badge="Writing"
        />

        {isLoading ? (
          <SkeletonCards count={6} />
        ) : posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
            data-ocid="blog.empty_state"
          >
            <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-display font-semibold text-foreground mb-2">
              No Posts Yet
            </h3>
            <p className="text-muted-foreground text-sm">
              Articles on mobile security, Flutter tips, and more coming soon.
            </p>
          </motion.div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <BlogCard key={post.id.toString()} post={post} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
