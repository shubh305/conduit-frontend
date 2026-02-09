"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import Youtube from "@tiptap/extension-youtube";
import BubbleMenuExtension from "@tiptap/extension-bubble-menu";
import { EditorToolbar } from "./EditorToolbar";
import { TerminalEditorShell } from "./TerminalEditorShell"
import { cn } from "@/lib/utils";
import { DictionaryPopup } from "./DictionaryPopup";
import { Ruby, RubyText } from "../extensions/Ruby";
import { TiptapContent } from "@/features/blog/types";
import { useTheme, useThemeHelpers, useStudioLabels } from "@/features/theme/ThemeProvider"
import { getEditorContainerClasses, getEditorProseClasses } from "@/lib/theme-variants"


interface TiptapEditorProps {
  content?: string | TiptapContent;
  onChange?: (content: TiptapContent) => void;
  className?: string;
  tenantId?: string;
}

export function TiptapEditor({ content = "", onChange, className, tenantId }: TiptapEditorProps) {
  const { theme, config } = useTheme();
  const { isTerminalCopy, isTechieCopy, isCyberCopy } = useThemeHelpers();
  const { getLabel } = useStudioLabels();

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
      Placeholder.configure({
        placeholder: getLabel("editor_content_placeholder"),
      }),
      Youtube.configure({
        controls: false,
      }),
      BubbleMenuExtension,
    ],
    content,
    editorProps: {
      attributes: {
        class: getEditorProseClasses(theme, config.isDark),
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getJSON());
    },
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <div
      className={cn(getEditorContainerClasses(theme), "flex flex-col flex-1 min-h-0", className)}
      style={{
        borderRadius: isCyberCopy || isTechieCopy ? "0" : undefined,
        backgroundColor: theme === "journal" || theme === "sakura" ? "var(--journal-paper)" : undefined,
      }}
    >
      {isTerminalCopy ? (
        <TerminalEditorShell editor={editor} />
      ) : (
        <>
          <EditorToolbar
            editor={editor}
            tenantId={tenantId}
            className="px-4 md:px-12 shrink-0 border-b border-[var(--editor-border)]"
          />
          <EditorContent
            editor={editor}
            className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar px-4 md:px-12 py-6 md:py-10 pb-32 md:pb-10"
          />
        </>
      )}
      <DictionaryPopup editor={editor} />
    </div>
  );
}

