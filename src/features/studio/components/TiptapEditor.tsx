"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorToolbar } from "./EditorToolbar";
import { cn } from "@/lib/utils";
import { TiptapContent } from "@/features/blog/types";

interface TiptapEditorProps {
  content?: string | TiptapContent;
  onChange?: (content: TiptapContent) => void;
  className?: string;
}

export function TiptapEditor({ content = "", onChange, className }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-signal-green hover:underline cursor-pointer",
        },
      }),
      Placeholder.configure({
        placeholder: "Start writing your transmission...",
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: "prose prose-invert prose-noir max-w-none focus:outline-none min-h-[400px] p-6 font-mono text-base md:text-lg leading-relaxed text-gray-300",
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getJSON());
    },
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <div className={cn("border border-noir-border bg-noir-bg flex flex-col", className)}>
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} className="flex-1" />
    </div>
  );
}
