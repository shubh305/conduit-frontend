import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { TERMINAL_HOVER_TEXT_ACCENT } from "@/features/blog/layouts/terminal/styles";

export interface ConfigPost {
  id: string;
  title: string;
  slug: string;
  authorUsername?: string;
  publishedAt: string;
  likesCount?: number;
  readingTimeMinutes?: number;
}

interface ActiveProcessesWidgetProps {
  posts: ConfigPost[];
  tenantSlug: string;
  className?: string;
}

/**
 * Terminal Widget: Active Processes (top style)
 * Visualizes posts as running processes.
 */
export function ActiveProcessesWidget({ posts, tenantSlug, className }: ActiveProcessesWidgetProps) {
  // Take top 5 recent or trending
  const processData = React.useMemo(() => {
    return posts.slice(0, 5).map(post => {
      const pid = post.id.slice(-4);
      const user = post.authorUsername || "root";

      const seed = post.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const cpuValue = ((seed % 100) / 10 + (post.likesCount || 0)).toFixed(1);
      const memValue = (post.readingTimeMinutes || 2.0).toFixed(1);

      return { pid, user, cpu: cpuValue, mem: memValue, id: post.id, slug: post.slug, title: post.title };
    });
  }, [posts]);

  return (
    <div className={cn("border border-accent p-4 relative font-mono text-xs", className)}>
      <div className="absolute top-[-10px] left-4 bg-black px-2 text-accent">top - 12:00:01 up 10 days</div>

      <div className="mt-2 space-y-1">
        <div className="grid grid-cols-[1fr_1fr_1fr_1fr_3fr] gap-2 text-accent/50 border-b border-accent/20 pb-1 mb-1">
          <span>PID</span>
          <span>USER</span>
          <span>%CPU</span>
          <span>%MEM</span>
          <span>COMMAND</span>
        </div>

        {processData.length === 0 ? (
          <div className="text-accent/30 py-2 text-center text-[10px] italic">No active processes.</div>
        ) : (
          processData.map(proc => {
            return (
              <Link
                key={proc.id}
                href={`/${tenantSlug}/${proc.slug}`}
                className={cn(
                  "grid grid-cols-[1fr_1fr_1fr_1fr_3fr] gap-2 text-foreground-muted group hover:bg-accent/10 transition-colors cursor-pointer",
                )}
              >
                <span className="text-accent/70">{proc.pid}</span>
                <span>{proc.user}</span>
                <span className={parseFloat(proc.cpu) > 10 ? "text-accent" : ""}>{proc.cpu}</span>
                <span>{proc.mem}</span>
                <span className={cn("truncate", TERMINAL_HOVER_TEXT_ACCENT)}>./{proc.title}</span>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
