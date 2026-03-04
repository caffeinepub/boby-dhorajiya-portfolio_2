import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-3">
      <Skeleton className="h-40 w-full rounded-lg shimmer" />
      <Skeleton className="h-4 w-3/4 shimmer" />
      <Skeleton className="h-3 w-full shimmer" />
      <Skeleton className="h-3 w-5/6 shimmer" />
      <div className="flex gap-2">
        <Skeleton className="h-5 w-16 rounded-full shimmer" />
        <Skeleton className="h-5 w-16 rounded-full shimmer" />
      </div>
    </div>
  );
}

export function SkeletonCards({ count = 6 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      data-ocid="projects.loading_state"
    >
      {(Array(count).fill(null) as null[]).map((_v, i) => {
        const key = `sk-${i}`;
        return <SkeletonCard key={key} />;
      })}
    </div>
  );
}
