"use client";
 
import { useEditor, EditorContent, ReactNodeViewRenderer } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import Youtube from "@tiptap/extension-youtube";
import BubbleMenuExtension from "@tiptap/extension-bubble-menu";
import { common, createLowlight } from "lowlight";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import MarkdownIt from "markdown-it";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import { CodeBlockComponent } from "./CodeBlockComponent";
import { EditorToolbar } from "./EditorToolbar";
import { TerminalEditorShell } from "./TerminalEditorShell";
import { cn } from "@/lib/utils";
import { DictionaryPopup } from "./DictionaryPopup";
import { Ruby, RubyText } from "../extensions/Ruby";
import { TiptapContent } from "@/features/blog/types";
import { useTheme, useThemeHelpers, useStudioLabels } from "@/features/theme/ThemeProvider";
import { getEditorContainerClasses, getEditorProseClasses } from "@/lib/theme-variants";
import { CatalystExtension } from "../extensions/CatalystExtension";
import { uploadFile, uploadFileFromUrl } from "@/features/media/api";
import { toast } from "sonner";
import { Indent } from "../extensions/Indent";
import { AlignedImage } from "../extensions/AlignedImage";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Highlight } from "@tiptap/extension-highlight";
import { TextAlign } from "@tiptap/extension-text-align";

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
          target: "_self",
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
      CatalystExtension,
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class:
            "border-collapse table-fixed w-full mb-4 border border-[var(--editor-border)] rounded-md overflow-hidden",
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: "border-b border-[var(--editor-border)]",
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: "bg-accent/5 font-bold p-3 text-left border-r border-[var(--editor-border)] last:border-r-0",
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: "p-3 border-r border-[var(--editor-border)] last:border-r-0 text-sm",
        },
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: getEditorProseClasses(theme, config.isDark),
      },
      handlePaste: (view, event) => {
        if (view.state.selection.$from.parent.type.name === "codeBlock") {
          return false;
        }

        const text = event.clipboardData?.getData("text/plain");
        const html = event.clipboardData?.getData("text/html");

        if (text) {
          const isFromCodeViewer =
            html && (html.match(/<pre/i) || html.match(/vscode/i) || html.match(/font-family:.*monospace/i));

          let handleAsMarkdown = false;

          if (isFromCodeViewer) {
            if (/^```/m.test(text) || /^#{1,6}\s/m.test(text)) {
              handleAsMarkdown = true;
            }
          } else {
            const isMarkdown = /^#{1,6}\s|\*\*|__|\*|_|\[.*\]\(.*\)|\n\s*-\s|\n\s*\*\s|\n\s*\d+\.\s|```|^\s*> /m.test(
              text,
            );
            if (isMarkdown) {
              handleAsMarkdown = true;
            }
          }

          if (handleAsMarkdown) {
            event.preventDefault();
            try {
              const md = new MarkdownIt({ html: true, breaks: true });
              const parsedHtml = md.render(text);
              editor?.chain().focus().insertContent(parsedHtml).run();
            } catch (e) {
              console.error("Markdown parsing failed:", e);
              editor?.chain().focus().insertContent(text).run();
            }
            return true;
          }
        }

        // Handle YouTube
        if (text && (text.includes("youtube.com/watch") || text.includes("youtu.be/"))) {
          editor
            ?.chain()
            .focus()
            .insertContent([{ type: "youtube", attrs: { src: text } }, { type: "paragraph" }])
            .run();
          return true;
        }

        if (text && text.match(/^https?:\/\/.*?\.(gif|jpe?g|png|webp|svg)$/i)) {
          const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL;
          if (storageUrl && text.includes(storageUrl)) {
            editor?.chain().focus().setImage({ src: text }).run();
            return true;
          }

          event.preventDefault();
          const toastId = toast.loading("Processing external image...");
          uploadFileFromUrl(text)
            .then(data => {
              editor?.chain().focus().setImage({ src: data.url }).run();
              toast.dismiss(toastId);
              toast.success("Image added to storage");
            })
            .catch(err => {
              toast.dismiss(toastId);
              editor?.chain().focus().setImage({ src: text }).run();
              console.error("External upload failed, using original link:", err);
            });
          return true;
        }

        const items = Array.from(event.clipboardData?.items || []);
        const imageItems = items.filter(item => item.type.startsWith("image/"));
        const hasTextContent = !!(
          event.clipboardData?.getData("text/plain") || event.clipboardData?.getData("text/html")
        );

        if (imageItems.length > 0) {
          if (!hasTextContent) {
            event.preventDefault();
          }

          imageItems.forEach(async item => {
            const file = item.getAsFile();
            if (file) {
              const toastId = toast.loading("Uploading image natively...");
              try {
                const { url } = await uploadFile(file);
                editor?.chain().focus().setImage({ src: url }).run();
                toast.dismiss(toastId);
              } catch (e) {
                toast.dismiss(toastId);
                console.error("Paste upload failed:", e);
              }
            }
          });

          if (!hasTextContent) return true;
        }
        return false;
      },
      handleDrop: (view, event, slice, moved) => {
        if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
          const file = event.dataTransfer.files[0];
          if (file.type.startsWith("image/")) {
            event.preventDefault();
            const toastId = toast.loading("Uploading dropped image...");
            uploadFile(file)
              .then(data => {
                const node = view.state.schema.nodes.image.create({ src: data.url });
                const transaction = view.state.tr.replaceSelectionWith(node);
                view.dispatch(transaction);
                toast.dismiss(toastId);
                toast.success("Image uploaded");
              })
              .catch(err => {
                toast.dismiss(toastId);
                toast.error("Failed to upload dropped image");
                console.error(err);
              });
            return true;
          }
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      onChange?.(json);

      editor.state.doc.descendants((node, pos) => {
        if (node.type.name === "image") {
          const src = node.attrs.src;
          const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL;

          if (src && src.startsWith("http") && (!storageUrl || !src.includes(storageUrl))) {
            uploadFileFromUrl(src)
              .then(data => {
                editor.chain().focus().setNodeSelection(pos).updateAttributes("image", { src: data.url }).run();
              })
              .catch(err => {
                console.error("Re-hosting failed for:", src, err);
              });
          }
        }
        return true;
      });
    },
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <div
      className={cn(
        getEditorContainerClasses(theme),
        "flex flex-col min-h-0",
        !isTerminalCopy && "flex-grow",
        className,
      )}
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
            className="px-4 md:px-12 shrink-0 border-b border-[var(--editor-border)] sticky top-12 md:top-[84px] z-30 bg-[var(--editor-bg)]"
          />
          <EditorContent
            editor={editor}
            className="px-4 md:px-12 pt-4 md:pt-16 pb-32 md:pb-8 min-h-[calc(100vh-600px)] flex-grow [&_.ProseMirror]:leading-[1.7] [&_.ProseMirror_p]:mb-6"
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
        /* Table Styles for Pro Look */
        .ProseMirror table {
          border-collapse: collapse;
          table-layout: fixed;
          width: 100%;
          margin: 0;
          overflow: hidden;
        }
        .ProseMirror table td,
        .ProseMirror table th {
          min-width: 1em;
          border: 1px solid var(--editor-border);
          padding: 8px 12px;
          vertical-align: top;
          box-sizing: border-box;
          position: relative;
        }
        .ProseMirror table th {
          font-weight: bold;
          text-align: left;
          background-color: rgba(var(--accent-rgb), 0.05);
        }
        .ProseMirror table .selectedCell:after {
          z-index: 2;
          position: absolute;
          content: "";
          left: 0; right: 0; top: 0; bottom: 0;
          background: rgba(var(--accent-rgb), 0.1);
          pointer-events: none;
        }
        .ProseMirror table .column-resize-handle {
          position: absolute;
          right: -2px;
          top: 0;
          bottom: 0;
          width: 4px;
          z-index: 20;
          background-color: var(--accent);
          pointer-events: none;
        }
        /* Code Block Specific Editor Styles - High Visibility */
        .ProseMirror .code-block-wrapper,
        .ProseMirror pre {
          background-color: var(--code-bg) !important;
          color: var(--code-text) !important;
          border: 1px solid var(--code-border) !important;
          display: block !important;
          min-height: 1.5rem;
          margin: 1.5rem 0 !important;
          opacity: 1 !important;
          visibility: visible !important;
          border-radius: 0.75rem !important;
          padding: 1.25rem !important;
        }
        .ProseMirror .code-block-wrapper pre,
        .ProseMirror pre {
          background-color: transparent !important;
          color: inherit !important;
          padding: 0 !important;
          margin: 0 !important;
          border: none !important;
          opacity: 1 !important;
          visibility: visible !important;
          display: block !important;
        }
        .ProseMirror .code-block-wrapper code,
        .ProseMirror code {
          background-color: transparent !important;
          color: inherit !important;
          padding: 0 !important;
          border: none !important;
          display: block !important;
          opacity: 1 !important;
          visibility: visible !important;
        }
      `,
        }}
      />
    </div>
  );
}
