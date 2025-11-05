import Link from "next/link";
import { FeedItem } from "../types";

interface TerminalFeedCardProps {
  item: FeedItem;
}

export function TerminalFeedCard({ item }: TerminalFeedCardProps) {
  const validDate = item.publishedAt ? new Date(item.publishedAt) : new Date();
  const dateStr = validDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const getPostUrl = () => {
    if (item.tenantSlug === "default" && item.authorUsername) {
      return `/u/${item.authorUsername}/${item.postSlug}`;
    }
    return `/${item.tenantSlug}/${item.postSlug}`;
  };

  return (
    <Link 
      href={getPostUrl()} 
      className="group block font-mono text-sm py-1 px-2 hover:bg-accent hover:text-black transition-colors"
    >
      <div className="flex items-center gap-4">
        <span className="text-foreground-muted group-hover:text-black w-24 shrink-0">
          [drwxr-xr-x]
        </span>
        <span className="text-accent group-hover:text-black w-32 shrink-0">
          root@{item.authorUsername || "user"}
        </span>
        <span className="text-foreground-muted group-hover:text-black w-16 shrink-0 text-right">
          4096
        </span>
        <span className="text-foreground-subtle group-hover:text-black w-36 shrink-0">
          [{dateStr}]
        </span>
        <span className="text-foreground group-hover:text-black truncate">
          {item.title}
        </span>
      </div>
    </Link>
  );
}
