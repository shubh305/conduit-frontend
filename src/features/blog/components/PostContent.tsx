"use client";

import { useEditor, EditorContent, ReactNodeViewRenderer } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Youtube from "@tiptap/extension-youtube";
import { TiptapContent } from "../types";
import { useTheme, useThemeHelpers } from "@/features/theme/ThemeProvider";
import { cn } from "@/lib/utils";
import { Ruby, RubyText } from "@/features/studio/extensions/Ruby";

import { DictionaryPopup } from "@/features/studio/components/DictionaryPopup";
import { CatalystExtension } from "@/features/studio/extensions/CatalystExtension";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import { CodeBlockComponent } from "@/features/studio/components/CodeBlockComponent";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import { Indent } from "@/features/studio/extensions/Indent";
import { AlignedImage } from "@/features/studio/extensions/AlignedImage";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Highlight } from "@tiptap/extension-highlight";
import { TextAlign } from "@tiptap/extension-text-align";
import { useRef, useEffect } from "react";

const lowlight = createLowlight(common);

export function PostContent({ content }: { content: TiptapContent }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const { config } = useTheme();
  const { isCyberCopy, isTerminalCopy, isRoninCopy } = useThemeHelpers();
  const isSerif = config.fontFamily === "serif";

  const editor = useEditor({
    extensions: [
      StarterKit,
      AlignedImage,
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Indent,
      Ruby,
      RubyText,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-accent hover:underline cursor-pointer transition-all",
          target: "_self",
        },
      }),
      Youtube.configure({
        controls: false,
      }),
      CatalystExtension,
      CodeBlockLowlight.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlockComponent);
        },
      }).configure({
        lowlight,
      }),
      Table.configure({
        resizable: false,
        HTMLAttributes: {
          class:
            "border-collapse table-fixed w-full mb-4 border border-[var(--editor-border)] rounded-md overflow-hidden",
        },
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content,
    editable: false,
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-invert max-w-none focus:outline-none transition-all duration-500",
          "prose-p:text-foreground/90 prose-headings:text-foreground",
          isCyberCopy
            ? "prose-base md:prose-lg prose-p:font-mono prose-headings:font-display prose-headings:uppercase tracking-tight prose-p:leading-8"
            : isTerminalCopy
              ? "prose-p:font-mono prose-headings:font-bold prose-headings:uppercase tracking-tight"
              : isRoninCopy
                ? "prose-base md:prose-lg prose-p:font-serif prose-p:leading-loose"
                : "prose-p:font-sans",
          isSerif && !isTerminalCopy && !isRoninCopy
            ? "prose-p:font-serif prose-p:leading-[1.7]"
            : "prose-p:leading-[1.7]",
          "prose-p:mb-6",
        ),
      },
    },
    immediatelyRender: false,
  });

  const initialScrollDoneRef = useRef(false);

  useEffect(() => {
    if (!contentRef.current) return;

    const injectIds = () => {
      const headings = contentRef.current?.querySelectorAll("h1, h2, h3, h4, h5, h6");
      headings?.forEach(heading => {
        if (!heading.id) {
          const text = heading.textContent || "";
          const id = text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
          if (id) {
            heading.id = id;
          }
        }
        if (heading instanceof HTMLElement) {
          heading.style.scrollMarginTop = "140px";
        }
      });

      if (!initialScrollDoneRef.current && window.location.hash) {
        const id = decodeURIComponent(window.location.hash.replace("#", ""));
        const element = document.getElementById(id);
        if (element) {
          setTimeout(() => {
            const el = document.getElementById(id);
            if (el) {
              el.scrollIntoView({ behavior: "auto" });
              setTimeout(() => {
                el.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }
          }, 500);
          initialScrollDoneRef.current = true;
        }
      }
    };

    injectIds();
    const observer = new MutationObserver(() => {
      injectIds();
    });
    observer.observe(contentRef.current, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [content, editor]);

  const handleClick = (e: React.MouseEvent) => {
    const target = (e.target as HTMLElement).closest("a");
    if (!target) return;
    const href = target.getAttribute("href");
    if (!href) return;
    try {
      const url = new URL(href, window.location.href);
      if (url.origin === window.location.origin && url.hash) {
        const id = decodeURIComponent(url.hash.replace("#", ""));
        const element = document.getElementById(id);
        if (element) {
          e.preventDefault();
          element.scrollIntoView({ behavior: "smooth" });
          if (url.pathname === window.location.pathname) {
            window.history.pushState(null, "", url.hash);
          }
        }
      }
    } catch {}
  };

  return (
    <div className="mt-8 transition-colors" ref={contentRef} onClick={handleClick}>
      <EditorContent editor={editor} />
      {editor && <DictionaryPopup editor={editor} />}
    </div>
  );
}
