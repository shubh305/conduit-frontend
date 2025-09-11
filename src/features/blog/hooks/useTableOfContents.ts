import { useState, useEffect, useRef } from "react";
import { TiptapContent } from "@/features/blog/types";

export interface TableOfContentsItem {
  id: string;
  text: string;
  level: number;
}

interface TiptapNode {
  type: string;
  text?: string;
  content?: TiptapNode[];
  attrs?: {
    level?: number;
  };
}

function extractTextFromNode(node: TiptapNode): string {
  if (node.type === "text") {
    return node.text || "";
  }
  if (node.content) {
    return node.content.map(extractTextFromNode).join("");
  }
  return "";
}

export function useTableOfContents(content: string | TiptapContent) {
  const [toc, setToc] = useState<TableOfContentsItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const contentRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    let items: TableOfContentsItem[] = [];

    if (typeof content === "string") {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, "text/html");
      const headers = Array.from(doc.querySelectorAll("h2, h3"));

      items = headers.map(header => {
        const text = header.textContent || "";
        const level = Number(header.tagName.substring(1));
        const id =
          header.id ||
          text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
        return { id, text, level };
      });
    } else if (content && typeof content === "object" && content.type === "doc" && Array.isArray(content.content)) {
      (content.content as TiptapNode[]).forEach(node => {
        if (node.type === "heading" && node.attrs?.level) {
          const level = node.attrs.level;
          if (level === 2 || level === 3) {
            const text = extractTextFromNode(node);
            const id = text
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, "");
            items.push({ id, text, level });
          }
        }
      });
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToc(items);
  }, [content]);

  useEffect(() => {
    if (!contentRef.current) return;

    const injectIds = () => {
      const headers = contentRef.current?.querySelectorAll("h2, h3");
      if (!headers) return;

      headers.forEach((header, index) => {
        if (toc[index]) {
          header.id = toc[index].id;
        }
      });
    };

    injectIds();

    const mutationObserver = new MutationObserver(() => {
      injectIds();
    });

    mutationObserver.observe(contentRef.current, { childList: true, subtree: true });

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0px 0px -80% 0px" },
    );

    const headers = contentRef.current.querySelectorAll("h2, h3");
    headers.forEach(header => observer.observe(header));

    return () => {
      mutationObserver.disconnect();
      headers.forEach(header => observer.unobserve(header));
    };
  }, [toc, contentRef]);

  return { toc, activeId, contentRef };
}
