"use client";

import { useEditor, EditorContent, ReactNodeViewRenderer } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import Youtube from "@tiptap/extension-youtube";
import BubbleMenuExtension from "@tiptap/extension-bubble-menu";
import { common, createLowlight } from "lowlight";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { CodeBlockComponent } from "./CodeBlockComponent";
import { EditorToolbar } from "./EditorToolbar";
import { TerminalEditorShell } from "./TerminalEditorShell"
import { cn } from "@/lib/utils";
import { DictionaryPopup } from "./DictionaryPopup";
import { Ruby, RubyText } from "../extensions/Ruby";
import { TiptapContent } from "@/features/blog/types";
import { useTheme, useThemeHelpers, useStudioLabels } from "@/features/theme/ThemeProvider"
import { getEditorContainerClasses, getEditorProseClasses } from "@/lib/theme-variants"

const lowlight = createLowlight(common);


interface TiptapEditorProps {
  content?: string | TiptapContent;
  onChange?: (content: TiptapContent) => void;
  className?: string;
  tenantId?: string;
  title?: string;
  onTitleChange?: (title: string) => void;
  featuredImage?: string | null;
  onFeaturedImageChange?: (url: string | null) => void;
}

export function TiptapEditor({
  content = "",
  onChange,
  className,
  tenantId,
  title,
  onTitleChange,
  featuredImage,
  onFeaturedImageChange,
}: TiptapEditorProps) {
  const { theme, config } = useTheme();
  const { isTerminalCopy, isTechieCopy, isCyberCopy } = useThemeHelpers();
  const { getLabel } = useStudioLabels();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Image,
      Underline,
      Ruby,
      RubyText,
      CodeBlockLowlight.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlockComponent);
        },
      }).configure({
        lowlight,
      }),
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
        addPasteHandler: false,
      }),
      BubbleMenuExtension,
    ],
    content,
    editorProps: {
      attributes: {
        class: getEditorProseClasses(theme, config.isDark),
      },
      handlePaste: (view, event) => {
        const text = event.clipboardData?.getData("text/plain");
        if (text && (text.includes("youtube.com/watch") || text.includes("youtu.be/"))) {
          editor
            ?.chain()
            .focus()
            .insertContent([{ type: "youtube", attrs: { src: text } }, { type: "paragraph" }])
            .run();
          return true;
        }
        return false;
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
        <TerminalEditorShell
          editor={editor}
          title={title}
          onTitleChange={onTitleChange}
          featuredImage={featuredImage}
          onFeaturedImageChange={onFeaturedImageChange}
          tenantId={tenantId}
        />
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

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .ProseMirror iframe {
          pointer-events: none !important;
        }
        .ProseMirror [data-youtube-video] {
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }
        .ProseMirror [data-youtube-video].ProseMirror-selectednode {
          outline: 3px solid var(--accent) !important;
          outline-offset: 4px;
          box-shadow: 0 0 20px var(--accent-glow);
        }
        /* Mobile specific fixes for bubble menu */
        .tippy-box {
          pointer-events: auto !important;
          z-index: 10001 !important;
        }
      `,
        }}
      />
    </div>
  );
}
