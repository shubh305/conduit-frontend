"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Youtube from "@tiptap/extension-youtube";
import { TiptapContent } from "../types";
import { useTheme, useThemeHelpers } from "@/features/theme/ThemeProvider";
import { cn } from "@/lib/utils";
import { Ruby, RubyText } from "@/features/studio/extensions/Ruby";

import { DictionaryPopup } from "@/features/studio/components/DictionaryPopup";

export function PostContent({ content }: { content: TiptapContent }) {
  const { config } = useTheme();
  const { isCyberCopy, isTerminalCopy, isRoninCopy } = useThemeHelpers();
  const isSerif = config.fontFamily === "serif";

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Underline,
      Ruby,
      RubyText,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-accent hover:underline cursor-pointer transition-all",
        },
      }),
      Youtube.configure({
        controls: false,
      }),
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
            ? "prose-p:font-serif prose-p:leading-[1.9]"
            : "prose-p:leading-relaxed",
        ),
      },
    },
    immediatelyRender: false,
  });

  return (
    <div className="mt-8 transition-colors">
      <EditorContent editor={editor} />
      {editor && <DictionaryPopup editor={editor} />}
    </div>
  );
}
