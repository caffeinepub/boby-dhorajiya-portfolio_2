import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetPublishedBlogPosts } from "@/hooks/useQueries";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, Calendar, Tag } from "lucide-react";
import { motion } from "motion/react";

function formatDate(timestamp: bigint): string {
  if (!timestamp || timestamp === 0n) return "Draft";
  try {
    const ms = Number(timestamp / 1_000_000n);
    return new Date(ms).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "Draft";
  }
}

export default function BlogPostPage() {
  const { slug } = useParams({ from: "/public-layout/blog/$slug" });
  const { data: posts = [], isLoading } = useGetPublishedBlogPosts();

  const post = posts.find((p) => p.slug === slug);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <Skeleton className="h-6 w-32 mb-8 shimmer" />
          <Skeleton className="h-8 w-3/4 mb-4 shimmer" />
          <Skeleton className="h-4 w-1/3 mb-8 shimmer" />
          <Skeleton className="h-64 w-full rounded-xl mb-8 shimmer" />
          <div className="space-y-3">
            <Skeleton className="h-4 w-full shimmer" />
            <Skeleton className="h-4 w-full shimmer" />
            <Skeleton className="h-4 w-5/6 shimmer" />
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">
            Post Not Found
          </h1>
          <p className="text-muted-foreground mb-6">
            The blog post you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link to="/blog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-cyan"
          >
            <Link to="/blog">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back to Blog
            </Link>
          </Button>
        </motion.div>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
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

          {/* Title */}
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Calendar className="w-4 h-4" />
            <time>{formatDate(post.publishedAt)}</time>
          </div>

          {/* Cover image */}
          {post.coverImage && (
            <div className="mb-8 rounded-xl overflow-hidden border border-border">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-64 object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div
            className="prose prose-invert prose-sm md:prose-base max-w-none
            prose-headings:font-display prose-headings:text-foreground
            prose-p:text-muted-foreground prose-p:leading-relaxed
            prose-a:text-cyan prose-a:no-underline hover:prose-a:underline
            prose-code:text-cyan prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
            prose-pre:bg-card prose-pre:border prose-pre:border-border prose-pre:rounded-xl
            prose-blockquote:border-l-primary/40 prose-blockquote:text-muted-foreground
            prose-strong:text-foreground
            prose-hr:border-border
          "
          >
            {post.content.split("\n").map((line, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: content lines positional
              <p key={`line-${i}`}>{line || <br />}</p>
            ))}
          </div>
        </motion.article>
      </div>
    </div>
  );
}
