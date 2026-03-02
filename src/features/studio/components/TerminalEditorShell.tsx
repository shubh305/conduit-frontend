"use client";

import { useState, useRef, useEffect } from "react";
import { Editor, EditorContent } from "@tiptap/react";
import { cn } from "@/lib/utils";
import { useThemeLabel } from "@/components/theme";
import {
  X,
  Link as LinkIcon,
  Youtube,
  Languages,
  Code,
  List,
  ListOrdered,
  Quote,
  Image as ImageIcon,
  Minus,
  Loader2,
} from "lucide-react";
import { uploadFile as apiUploadImage } from "@/features/media/api";
import { toast } from "sonner";

interface TerminalEditorShellProps {
  editor: Editor;
  filename?: string;
  title?: string;
  onTitleChange?: (title: string) => void;
  featuredImage?: string | null;
  onFeaturedImageChange?: (url: string | null) => void;
  tenantId?: string;
}

export function TerminalEditorShell({
  editor,
  filename = "article.md",
  title = "",
  onTitleChange,
}: TerminalEditorShellProps) {
  const t = useThemeLabel();
  const insertLabel = t("statusDrafts");
  const saveLabel = t("saveChanges");

  const [isLinkInputOpen, setIsLinkInputOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [isYoutubeInputOpen, setIsYoutubeInputOpen] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [isRubyInputOpen, setIsRubyInputOpen] = useState(false);
  const [rubyText, setRubyText] = useState("");

  const linkInputRef = useRef<HTMLInputElement>(null);
  const youtubeInputRef = useRef<HTMLInputElement>(null);
  const rubyInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [lineNumbers, setLineNumbers] = useState(10);

  useEffect(() => {
    if (!editor) return;

    const updateLineNumbers = () => {
      const editorElement = editor.options.element as HTMLElement;
      if (editorElement) {
        const pmElement = editorElement.querySelector(".ProseMirror") as HTMLElement;
        const height = pmElement ? pmElement.scrollHeight : editorElement.scrollHeight;
        const count = Math.max(10, Math.ceil(height / 28.8));
        setLineNumbers(count);
      }
    };

    updateLineNumbers();
    editor.on("update", updateLineNumbers);

    return () => {
      editor.off("update", updateLineNumbers);
    };
  }, [editor]);

  if (!editor) return null;

  const handleLinkKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (linkUrl) {
        editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run();
      }
      setIsLinkInputOpen(false);
      setLinkUrl("");
    } else if (e.key === "Escape") {
      setIsLinkInputOpen(false);
    }
  };

  const handleYoutubeKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (youtubeUrl) {
        editor
          .chain()
          .focus()
          .insertContent([{ type: "youtube", attrs: { src: youtubeUrl } }, { type: "paragraph" }])
          .run();
      }
      setIsYoutubeInputOpen(false);
      setYoutubeUrl("");
    } else if (e.key === "Escape") {
      setIsYoutubeInputOpen(false);
    }
  };

  const handleRubyKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (rubyText) {
        editor.commands.setRuby(rubyText);
      }
      setIsRubyInputOpen(false);
      setRubyText("");
    } else if (e.key === "Escape") {
      setIsRubyInputOpen(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const toastId = toast.loading("Uploading image...");
      try {
        const { url } = await apiUploadImage(file);
        editor.chain().focus().setImage({ src: url }).run();
        toast.dismiss(toastId);
        toast.success("Image uploaded");
      } catch (e) {
        toast.dismiss(toastId);
        toast.error("Failed to upload image");
        console.error(e);
      } finally {
        setIsUploading(false);
      }
    }
    if (event.target) {
      event.target.value = "";
    }
  };

  return (
    <div className="flex flex-col bg-black font-mono text-foreground relative h-full">
      {/* Retro Toolbar (Sticky Top) */}
      <div className="border-b border-accent/20 p-2 flex items-center justify-between text-accent font-mono text-base select-none bg-black sticky top-12 md:top-20 z-30">
        <div className="flex items-center gap-6">
          <div className="flex gap-2">
            <button
              onClick={() => editor.chain().focus().undo().run()}
              className="hover:bg-accent hover:text-black px-2 py-1 transition-colors"
              title={t("undo") || "Undo"}
            >
              u
            </button>
            <button
              onClick={() => editor.chain().focus().redo().run()}
              className="hover:bg-accent hover:text-black px-2 py-1 transition-colors"
              title={t("redo") || "Redo"}
            >
              r
            </button>
          </div>
          <span className="text-accent/30">|</span>
          <div className="flex gap-2 font-bold">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={cn(
                "hover:bg-accent hover:text-black px-2 py-1 transition-colors",
                editor.isActive("bold") && "bg-accent text-black",
              )}
              title={t("bold") || "Bold"}
            >
              B
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={cn(
                "hover:bg-accent hover:text-black px-2 py-1 italic transition-colors",
                editor.isActive("italic") && "bg-accent text-black",
              )}
              title={t("italic") || "Italic"}
            >
              I
            </button>
            <button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={cn(
                "hover:bg-accent hover:text-black px-2 py-1 underline transition-colors",
                editor.isActive("underline") && "bg-accent text-black",
              )}
              title={t("underline") || "Underline"}
            >
              U
            </button>
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={cn(
                "hover:bg-accent hover:text-black px-2 py-1 transition-colors",
                editor.isActive("strike") && "bg-accent text-black",
              )}
              title={t("strikethrough") || "Strikethrough"}
            >
              S
            </button>
          </div>
          <span className="text-accent/30">|</span>
          <div className="flex gap-2">
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={cn(
                "hover:bg-accent hover:text-black px-2 py-1 transition-colors",
                editor.isActive("heading", { level: 1 }) && "bg-accent text-black",
              )}
              title={t("h1") || "H1"}
            >
              h1
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={cn(
                "hover:bg-accent hover:text-black px-2 py-1 transition-colors",
                editor.isActive("heading", { level: 2 }) && "bg-accent text-black",
              )}
              title={t("h2") || "H2"}
            >
              h2
            </button>
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={cn(
                "hover:bg-accent hover:text-black px-2 py-1 transition-colors",
                editor.isActive("bulletList") && "bg-accent text-black",
              )}
              title={t("bulletList") || "Bullet List"}
            >
              <List size={14} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={cn(
                "hover:bg-accent hover:text-black px-2 py-1 transition-colors",
                editor.isActive("orderedList") && "bg-accent text-black",
              )}
              title={t("orderedList") || "Ordered List"}
            >
              <ListOrdered size={14} />
            </button>
            <button
              onClick={() => setIsLinkInputOpen(true)}
              className={cn(
                "hover:bg-accent hover:text-black px-2 py-1 transition-colors",
                editor.isActive("link") && "bg-accent text-black",
              )}
              title={t("insertLink") || "Link"}
            >
              <LinkIcon size={14} />
            </button>
            <button
              onClick={() => {
                setIsRubyInputOpen(true);
                setTimeout(() => rubyInputRef.current?.focus(), 50);
              }}
              className={cn(
                "hover:bg-accent hover:text-black px-2 py-1 transition-colors",
                editor.isActive("ruby") && "bg-accent text-black",
              )}
              title={t("insertFurigana") || "Ruby/Furigana"}
            >
              <Languages size={14} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={cn(
                "hover:bg-accent hover:text-black px-2 py-1 transition-colors",
                editor.isActive("codeBlock") && "bg-accent text-black",
              )}
              title={t("codeBlock") || "Code Block"}
            >
              <Code size={14} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={cn(
                "hover:bg-accent hover:text-black px-2 py-1 transition-colors",
                editor.isActive("blockquote") && "bg-accent text-black",
              )}
              title={t("blockquote") || "Blockquote"}
            >
              <Quote size={14} />
            </button>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="hover:bg-accent hover:text-black px-2 py-1 transition-colors"
              title={t("insertImage") || "Insert Image"}
            >
              {isUploading ? <Loader2 size={14} className="animate-spin" /> : <ImageIcon size={14} />}
            </button>
            <button
              onClick={() => {
                setIsYoutubeInputOpen(true);
                setTimeout(() => youtubeInputRef.current?.focus(), 50);
              }}
              className={cn("hover:bg-accent hover:text-black px-2 py-1 transition-colors")}
              title={t("insertYoutube") || "YouTube"}
            >
              <Youtube size={14} />
            </button>
            <button
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              className="hover:bg-accent hover:text-black px-2 py-1 transition-colors"
              title={t("horizontalRule") || "Horizontal Rule"}
            >
              <Minus size={14} />
            </button>
          </div>
        </div>
        <div>
          <span className="text-accent/50 pr-2 hidden md:block">-- {saveLabel.toUpperCase()} --</span>
        </div>
      </div>

      {/* Main Area (Lines + Content) */}
      <div className="flex-1 relative flex flex-col bg-black min-h-[300px]" ref={editorContainerRef}>
        <div className="flex w-full min-h-full">
          {/* Line Numbers Column */}
          <div
            className="w-12 pt-6 pb-6 text-right pr-3 text-accent/30 select-none bg-black border-r border-accent/10 text-sm leading-[1.8] flex flex-col font-mono shrink-0"
            aria-hidden="true"
          >
            {Array.from({ length: lineNumbers }).map((_, i) => (
              <div key={i} className="h-[28.8px] flex items-center justify-end">
                {i + 1}
              </div>
            ))}
            <div className="text-accent/20 flex-1 relative overflow-hidden">
              {Array.from({ length: 15 }).map((_, i) => (
                <div key={`tilde-${i}`} className="h-[28.8px] flex items-center justify-end">
                  ~
                </div>
              ))}
            </div>
          </div>

          {/* Editor Area */}
          <div className="flex-1 relative flex flex-col pt-4">
            {/* Overlays */}
            {isLinkInputOpen && (
              <div className="absolute top-0 left-0 z-50 bg-black border border-accent p-2 font-mono text-xs w-64 m-4 shadow-[0_0_20px_rgba(var(--accent-rgb),0.3)]">
                <div className="flex justify-between mb-2 text-accent opacity-50">
                  <span>{t("insertLink")}</span>
                  <button onClick={() => setIsLinkInputOpen(false)} className="cursor-pointer">
                    <X size={12} />
                  </button>
                </div>
                <input
                  ref={linkInputRef}
                  value={linkUrl}
                  onChange={e => setLinkUrl(e.target.value)}
                  onKeyDown={handleLinkKeyDown}
                  placeholder={t("linkUrl")}
                  className="w-full bg-black border-b border-accent outline-none text-accent py-1"
                />
                <div className="mt-2 text-[10px] text-accent/30 text-right uppercase">{t("apply")} (ENTER)</div>
              </div>
            )}

            {isYoutubeInputOpen && (
              <div className="absolute top-0 left-0 z-50 bg-black border border-accent p-2 font-mono text-xs w-64 m-4 shadow-[0_0_20px_rgba(var(--accent-rgb),0.3)]">
                <div className="flex justify-between mb-2 text-accent opacity-50">
                  <span>{t("insertYoutube")}</span>
                  <button onClick={() => setIsYoutubeInputOpen(false)} className="cursor-pointer">
                    <X size={12} />
                  </button>
                </div>
                <input
                  ref={youtubeInputRef}
                  value={youtubeUrl}
                  onChange={e => setYoutubeUrl(e.target.value)}
                  onKeyDown={handleYoutubeKeyDown}
                  placeholder={t("youtubeUrl")}
                  className="w-full nuclear-input-reset !bg-transparent !border-0 !shadow-none !ring-0 !outline-none border-accent border-b text-accent py-1 focus:!bg-transparent focus:!border-0 focus:!shadow-none focus:!ring-0 focus:!outline-none"
                />
                <div className="mt-2 text-[10px] text-accent/30 text-right uppercase">{t("apply")} (ENTER)</div>
              </div>
            )}

            {isRubyInputOpen && (
              <div className="absolute top-0 left-0 z-50 bg-black border border-accent p-2 font-mono text-xs w-64 m-4 shadow-[0_0_20px_rgba(var(--accent-rgb),0.3)]">
                <div className="flex justify-between mb-2 text-accent opacity-50">
                  <span>{t("insertFurigana")}</span>
                  <button onClick={() => setIsRubyInputOpen(false)} className="cursor-pointer">
                    <X size={12} />
                  </button>
                </div>
                <input
                  ref={rubyInputRef}
                  value={rubyText}
                  onChange={e => setRubyText(e.target.value)}
                  onKeyDown={handleRubyKeyDown}
                  placeholder={t("reading")}
                  className="w-full nuclear-input-reset !bg-transparent !border-0 !shadow-none !ring-0 !outline-none border-accent border-b text-accent py-1 focus:!bg-transparent focus:!border-0 focus:!shadow-none focus:!ring-0 focus:!outline-none"
                />
                <div className="mt-2 text-[10px] text-accent/30 text-right uppercase">{t("apply")} (ENTER)</div>
              </div>
            )}

            <div className="px-6 mb-2">
              <input
                type="text"
                value={title}
                onChange={e => onTitleChange?.(e.target.value)}
                placeholder={t("editor_title_placeholder") || "Title..."}
                className="w-full nuclear-input-reset !bg-transparent !border-0 !shadow-none !ring-0 !outline-none text-2xl font-bold text-accent placeholder:text-accent/20 focus:!bg-transparent focus:!border-0 focus:!shadow-none focus:!ring-0 focus:!outline-none p-0"
              />
            </div>
            <EditorContent
              editor={editor}
              className="outline-none p-0 [&_.ProseMirror]:min-h-[300px] [&_.ProseMirror]:p-6 [&_.ProseMirror]:pt-2 [&_.ProseMirror]:outline-none [&_.ProseMirror]:text-foreground [&_.ProseMirror]:font-mono [&_.ProseMirror]:leading-[1.8] [&_.is-editor-empty:before]:text-accent/50"
            />
          </div>
        </div>
      </div>

      {/* Status Bar (Sticky Bottom) */}
      <div className="h-8 bg-accent text-black flex justify-between items-center px-4 md:px-6 text-xs md:text-sm font-bold border-t border-black sticky bottom-0 z-30 shrink-0">
        <div className="flex items-center gap-6">
          <span className="bg-black text-accent px-2">-- {insertLabel} --</span>
          <span>{filename}</span>
          {editor.isActive("heading", { level: 1 }) && <span>[H1]</span>}
          {editor.isActive("heading", { level: 2 }) && <span>[H2]</span>}
          {editor.isActive("bold") && <span>[BOLD]</span>}
          {editor.isActive("italic") && <span>[ITALIC]</span>}
          {editor.isActive("underline") && <span>[UNDERLINE]</span>}
          {editor.isActive("codeBlock") && <span>[CODE_BLOCK]</span>}
          {editor.isActive("link") && <span>[LINK]</span>}
          {editor.isActive("ruby") && <span>[FURIGANA]</span>}
        </div>
        <div className="flex items-center gap-6">
          <span>utf-8</span>
          <span>unix</span>
          <span>{editor.storage.characterCount?.words() || 0} words</span>
          <span>100%</span>
          <span>Ln {editor.state.selection.$head.parentOffset}, Col 1</span>
        </div>
      </div>
    </div>
  );
}
