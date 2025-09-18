"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { List } from "lucide-react";

import { TiptapContent } from "../types";

interface TableOfContentsProps {
  content: TiptapContent | string; 
  className?: string;
}

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents({ content, className }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll("h1, h2, h3"));
    const items: TocItem[] = elements
      .map((elem, index) => {
        const id = elem.id || `heading-${index}`;
        elem.id = id;
        return {
          id,
          text: elem.textContent || "",
          level: parseInt(elem.tagName.substring(1)),
        };
      })
      .filter(item => item.text && item.level > 1);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHeadings(items);

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0px 0px -40% 0px" },
    );

    elements.forEach(elem => observer.observe(elem));

    return () => observer.disconnect();
  }, [content]);

  if (headings.length === 0) return null;

  return (
    <nav className={cn("border border-noir-border bg-noir-bg p-4", className)}>
      <h3 className="text-accent font-mono text-xs uppercase font-bold mb-4 flex items-center gap-2 border-b border-noir-border pb-2">
        <List size={14} />
        INDEX_PROTOCOL
      </h3>
      <ul className="space-y-2">
        {headings.map((heading) => (
          <li 
            key={heading.id} 
            className={cn(
                "text-xs font-mono transition-colors border-l-2 pl-3 py-1 cursor-pointer hover:text-white",
                activeId === heading.id 
                    ? "border-accent text-accent bg-noir-panel/30" 
                    : "border-transparent text-accent-secondary"
            )}
            style={{ marginLeft: `${(heading.level - 2) * 8}px` }}
            onClick={() => {
                document.getElementById(heading.id)?.scrollIntoView({ behavior: "smooth" });
                setActiveId(heading.id);
            }}
          >
            {heading.text}
          </li>
        ))}
      </ul>
    </nav>
  );
}
