"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { TiptapContent } from "../types";

export function PostContent({ content }: { content: TiptapContent }) {
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
    ],
    content,
    editable: false,
    editorProps: {
      attributes: {
        class: "prose prose-invert prose-noir max-w-none text-gray-300 font-mono text-base md:text-lg leading-relaxed focus:outline-none",
      },
    },
    immediatelyRender: false, 
  });

  return (
    <article className="mt-8">
      <EditorContent editor={editor} />
    </article>
  );
}
