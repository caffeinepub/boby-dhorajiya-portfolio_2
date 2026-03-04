import { Clock } from "lucide-react";

export function AvailabilityBadge({ className = "" }: { className?: string }) {
  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-xs font-medium ${className}`}
    >
      <div className="relative shrink-0">
        <div className="w-2 h-2 rounded-full bg-cyan" />
        <div className="absolute inset-0 w-2 h-2 rounded-full bg-cyan animate-ping opacity-60" />
      </div>
      <Clock className="w-3.5 h-3.5 text-cyan shrink-0" />
      <span className="text-cyan whitespace-nowrap">
        Available: 9:00 AM – 8:00 PM
      </span>
    </div>
  );
}
