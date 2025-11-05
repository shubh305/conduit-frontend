"use client";

import { cn } from "@/lib/utils";
import { TERMINAL_HOVER_TEXT_ACCENT } from "@/features/blog/layouts/terminal/styles";

interface TagStat {
  name: string;
  count: number;
}

interface DiskUsageWidgetProps {
  tags: TagStat[];
  className?: string;
}

/**
 * Terminal Widget: Disk Usage (df -h style)
 * Visualizes tags as storage partitions.
 */
export function DiskUsageWidget({ tags, className }: DiskUsageWidgetProps) {
  const topTags = [...tags].sort((a, b) => b.count - a.count).slice(0, 5);

  const maxCount = Math.max(...tags.map(t => t.count), 1);

  return (
    <div className={cn("border border-accent p-4 relative font-mono text-xs", className)}>
      <div className="absolute top-[-10px] left-4 bg-black px-2 text-accent">df -h</div>

      <div className="mt-2 space-y-2">
        <div className="grid grid-cols-[3fr_1fr_1fr_1fr_2fr] gap-2 text-accent/50 border-b border-accent/20 pb-1 mb-1">
          <span>Filesystem</span>
          <span>Size</span>
          <span>Used</span>
          <span>Avail</span>
          <span>Mounted on</span>
        </div>

        {topTags.length === 0 ? (
          <div className="text-accent/30 py-2 text-center text-[10px] italic">No filesystems mounted.</div>
        ) : (
          topTags.map((tag, i) => {
            const percentage = Math.round((tag.count / maxCount) * 100);
            // Construct ASCII bar [###...]
            const barLength = 5;
            const filled = Math.ceil((percentage / 100) * barLength);
            const bar = "[" + "#".repeat(filled) + ".".repeat(barLength - filled) + "]";

            const size = tag.name.length * 10 + "G";
            const used = Math.floor((percentage / 100) * parseInt(size)) + "G";

            return (
              <div
                key={tag.name}
                className={cn(
                  "grid grid-cols-[3fr_1fr_1fr_1fr_2fr] gap-2 text-foreground-muted group hover:bg-accent/10 transition-colors cursor-pointer",
                )}
              >
                <span className={TERMINAL_HOVER_TEXT_ACCENT}>/dev/sda{i + 1}</span>
                <span>{size}</span>
                <span>{used}</span>
                <span className={percentage > 80 ? "text-red-500" : ""}>
                  {bar} {percentage}%
                </span>
                <span className="truncate text-accent/70">/mnt/{tag.name}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
