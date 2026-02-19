"use client";

import { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Quote,
  Image as ImageIcon,
  Link as LinkIcon,
  Undo,
  Redo,
  Heading1,
  Heading2,
  Minus,
  Youtube,
  Languages,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { useTheme, useThemeHelpers } from "@/features/theme/ThemeProvider"
import { getToolbarButtonClasses } from "@/lib/theme-variants"
import { uploadFile } from "@/lib/api-client";
import { toast } from "sonner";

export function EditorToolbar({
  editor,
  tenantId,
  className,
}: {
  editor: Editor;
  tenantId?: string;
  className?: string;
}) {
  const { config, theme } = useTheme();
  const { isCyberCopy, isSakuraCopy, isOctaneCopy, isTechieCopy } = useThemeHelpers();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLinkInputOpen, setIsLinkInputOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkLabel, setLinkLabel] = useState("");
  const [isYoutubeInputOpen, setIsYoutubeInputOpen] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const youtubeInputRef = useRef<HTMLInputElement>(null);
  const [isRubyInputOpen, setIsRubyInputOpen] = useState(false);
  const [rubyText, setRubyText] = useState("");
  const rubyInputRef = useRef<HTMLInputElement>(null);

  if (!editor) return null;

  const toggleLinkInput = () => {
    if (editor.isActive("link")) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      setIsLinkInputOpen(false);
      setLinkUrl("");
      setLinkLabel("");
    } else {
      if (isLinkInputOpen) {
        setIsLinkInputOpen(false);
      } else {
        const previousUrl = editor.getAttributes("link").href;
        const { from, to } = editor.state.selection;
        const selectedText = editor.state.doc.textBetween(from, to, " ");
        
        setLinkUrl(previousUrl || "");
        setLinkLabel(selectedText || "");
        setIsLinkInputOpen(true);
      }
    }
  };

  const applyLink = () => {
    if (linkUrl) {
      if (linkLabel && editor.state.selection.empty) {
        editor.chain().focus().insertContent(`<a href="${linkUrl}">${linkLabel}</a> `).run();
      } else {
        editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run();
      }
    } else {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    }
    setIsLinkInputOpen(false);
    setLinkUrl("");
    setLinkLabel("");
  };

  const handleLinkKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      applyLink();
    } else if (e.key === "Escape") {
      setIsLinkInputOpen(false);
    }
  };

  const toggleYoutubeInput = () => {
    if (isYoutubeInputOpen) {
      setIsYoutubeInputOpen(false);
      setYoutubeUrl("");
    } else {
      setIsYoutubeInputOpen(true);
      setTimeout(() => youtubeInputRef.current?.focus(), 50);
    }
  };

  const addYoutubeVideo = () => {
    if (youtubeUrl) {
      editor
        .chain()
        .focus()
        .insertContent([{ type: "youtube", attrs: { src: youtubeUrl } }, { type: "paragraph" }])
        .run();
      setIsYoutubeInputOpen(false);
      setYoutubeUrl("");
    }
  };

  const handleYoutubeKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addYoutubeVideo();
    } else if (e.key === "Escape") {
      setIsYoutubeInputOpen(false);
    }
  };

  const toggleRubyInput = () => {
    if (isRubyInputOpen) {
      setIsRubyInputOpen(false);
      setRubyText("");
    } else {
      setIsRubyInputOpen(true);
      setTimeout(() => rubyInputRef.current?.focus(), 50);
    }
  };

  const applyRuby = () => {
    if (rubyText) {
      editor.commands.setRuby(rubyText);
      setIsRubyInputOpen(false);
      setRubyText("");
    }
  };

  const handleRubyKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      applyRuby();
    } else if (e.key === "Escape") {
      setIsRubyInputOpen(false);
    }
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const toastId = toast.loading("Uploading image...");
      try {
        const url = await uploadFile(file, tenantId);
        editor.chain().focus().setImage({ src: url }).run();
        toast.dismiss(toastId);
        toast.success("Image uploaded");
      } catch (e) {
        toast.dismiss(toastId);
        toast.error("Failed to upload image");
        console.error(e);
      }
    }
    if (event.target) {
      event.target.value = "";
    }
  };

  return (
    <div
      className={cn(
        "editor-toolbar flex flex-col sticky top-0 z-50 relative transition-colors",
        "bg-[var(--editor-bg)] border-b border-[var(--editor-border)]",
        isSakuraCopy && "bg-white/50 backdrop-blur-sm",
        isOctaneCopy && "octane-panel border-b-accent-warm/20",
        theme === "journal" && "bg-[var(--journal-paper)] border-b-accent/20 shadow-sm",
        className,
      )}
    >
      {/* Overlays - Positioned Absolute to the main toolbar container */}

      {/* Link Input Overlay */}
      {isLinkInputOpen && (
        <div
          className={cn(
            "absolute top-full left-0 mt-1 z-[60] flex flex-col gap-2 p-3 shadow-2xl border animate-in fade-in slide-in-from-top-2",
            "bg-[var(--editor-bg)] border-[var(--editor-border)] shadow-[var(--editor-glow)] min-w-[300px] w-full md:w-auto",
          )}
          style={{ borderRadius: isCyberCopy ? "0" : config.tokens.borderRadius }}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase font-bold text-foreground/50 tracking-wider">Insert Link</span>
            <button
              onClick={() => setIsLinkInputOpen(false)}
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors group cursor-pointer"
            >
              <X size={14} className="text-foreground/40 group-hover:text-foreground" />
            </button>
          </div>
          <input
            autoFocus
            type="text"
            value={linkUrl}
            onChange={e => setLinkUrl(e.target.value)}
            onKeyDown={handleLinkKeyDown}
            placeholder="URL (https://...)"
            className={cn(
              "bg-[var(--bg-primary)] border border-[var(--editor-border)] px-3 py-1.5 text-sm text-foreground focus:border-accent outline-none",
              (isCyberCopy || isTechieCopy) && "font-mono uppercase text-xs",
            )}
            style={{ borderRadius: isCyberCopy ? "0" : "4px" }}
          />
          <input
            type="text"
            value={linkLabel}
            onChange={e => setLinkLabel(e.target.value)}
            onKeyDown={handleLinkKeyDown}
            placeholder="Link text (optional)"
            className={cn(
              "bg-[var(--bg-primary)] border border-[var(--editor-border)] px-3 py-1.5 text-sm text-foreground focus:border-accent outline-none",
              (isCyberCopy || isTechieCopy) && "font-mono uppercase text-xs",
            )}
            style={{ borderRadius: isCyberCopy ? "0" : "4px" }}
          />
          <button
            onClick={applyLink}
            className={cn(
              "text-accent hover:text-foreground px-3 py-1.5 text-xs uppercase font-mono border border-accent/20 rounded hover:bg-accent/10 transition-colors w-full mt-1 cursor-pointer",
              isTechieCopy && "text-noir-bg bg-accent border-none hover:bg-white hover:text-black font-bold",
            )}
            style={{ borderRadius: isCyberCopy ? "0" : "4px" }}
          >
            Apply
          </button>
        </div>
      )}

      {/* Youtube Input Overlay */}
      {isYoutubeInputOpen && (
        <div
          className={cn(
            "absolute top-full left-0 mt-1 z-[60] flex flex-col gap-2 p-3 shadow-2xl border animate-in fade-in slide-in-from-top-2",
            "bg-[var(--editor-bg)] border-[var(--editor-border)] shadow-[var(--editor-glow)] min-w-[300px] w-full md:w-auto",
          )}
          style={{ borderRadius: isCyberCopy ? "0" : config.tokens.borderRadius }}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase font-bold text-foreground/50 tracking-wider">Insert YouTube</span>
            <button
              onClick={() => setIsYoutubeInputOpen(false)}
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors group cursor-pointer"
            >
              <X size={14} className="text-foreground/40 group-hover:text-foreground" />
            </button>
          </div>
          <input
            ref={youtubeInputRef}
            autoFocus
            type="text"
            value={youtubeUrl}
            onChange={e => setYoutubeUrl(e.target.value)}
            onKeyDown={handleYoutubeKeyDown}
            placeholder="https://youtube.com/..."
            className={cn(
              "bg-[var(--bg-primary)] border border-[var(--editor-border)] px-3 py-1.5 text-sm text-foreground focus:border-accent outline-none",
              (isCyberCopy || isTechieCopy) && "font-mono uppercase text-xs",
            )}
            style={{ borderRadius: isCyberCopy ? "0" : "4px" }}
          />
          <button
            onClick={addYoutubeVideo}
            className={cn(
              "text-accent hover:text-foreground px-3 py-1.5 text-xs uppercase font-mono border border-accent/20 rounded hover:bg-accent/10 transition-colors w-full mt-1 cursor-pointer",
              isTechieCopy && "text-noir-bg bg-accent border-none hover:bg-white hover:text-black font-bold",
            )}
            style={{ borderRadius: isCyberCopy ? "0" : "4px" }}
          >
            Add Video
          </button>
        </div>
      )}

      {/* Ruby Input Overlay */}
      {isRubyInputOpen && (
        <div
          className={cn(
            "absolute top-full left-0 mt-1 z-[60] flex flex-col gap-2 p-3 shadow-2xl border animate-in fade-in slide-in-from-top-2",
            "bg-[var(--editor-bg)] border-[var(--editor-border)] shadow-[var(--editor-glow)] min-w-[240px] w-full md:w-auto",
          )}
          style={{ borderRadius: isCyberCopy ? "0" : config.tokens.borderRadius }}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase font-bold text-foreground/50 tracking-wider">
              Insert Furigana
            </span>
            <button
              onClick={() => setIsRubyInputOpen(false)}
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors group cursor-pointer"
            >
              <X size={14} className="text-foreground/40 group-hover:text-foreground" />
            </button>
          </div>
          <input
            ref={rubyInputRef}
            autoFocus
            type="text"
            value={rubyText}
            onChange={e => setRubyText(e.target.value)}
            onKeyDown={handleRubyKeyDown}
            placeholder="Reading..."
            className={cn(
              "bg-[var(--bg-primary)] border border-[var(--editor-border)] px-3 py-1.5 text-sm text-foreground focus:border-accent outline-none",
              (isCyberCopy || isTechieCopy) && "font-mono uppercase text-xs",
            )}
            style={{ borderRadius: isCyberCopy ? "0" : "4px" }}
          />
          <button
            onClick={applyRuby}
            className={cn(
              "text-accent hover:text-foreground px-3 py-1.5 text-xs uppercase font-mono border border-accent/20 rounded hover:bg-accent/10 transition-colors w-full mt-1 cursor-pointer",
              isTechieCopy && "text-noir-bg bg-accent border-none hover:bg-white hover:text-black font-bold",
            )}
            style={{ borderRadius: isCyberCopy ? "0" : "4px" }}
          >
            Apply
          </button>
        </div>
      )}

      {/* Scrolling Buttons Container */}
      <div className="flex items-center gap-1 p-2 overflow-x-auto md:flex-wrap no-scrollbar w-full">
        {/* Hidden File Input */}
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />

        {/* Toolbar Groups */}
        <div className="flex items-center gap-0.5">
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            isActive={false}
            icon={<Undo size={16} />}
            title="Undo"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            isActive={false}
            icon={<Redo size={16} />}
            title="Redo"
          />
        </div>

        <div className={cn("w-px h-6 mx-2 bg-[var(--editor-border)]")} />

        <div className="flex items-center gap-0.5">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
            icon={<Bold size={16} />}
            title="Bold"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
            icon={<Italic size={16} />}
            title="Italic"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive("underline")}
            icon={<UnderlineIcon size={16} />}
            title="Underline"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive("strike")}
            icon={<Strikethrough size={16} />}
            title="Strikethrough"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            isActive={editor.isActive("codeBlock")}
            icon={<Code size={16} />}
            title="Code Block"
          />
          <ToolbarButton
            onClick={toggleLinkInput}
            isActive={editor.isActive("link") || isLinkInputOpen}
            icon={<LinkIcon size={16} />}
            title="Link"
          />
          {(theme === "sakura" || theme === "ronin" || theme === "journal") && (
            <ToolbarButton
              onClick={toggleRubyInput}
              isActive={isRubyInputOpen}
              icon={<Languages size={16} />}
              title="Furigana (Ruby)"
            />
          )}
        </div>

        <div className={cn("w-px h-6 mx-2 bg-[var(--editor-border)]")} />

        <div className="flex items-center gap-0.5">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive("heading", { level: 1 })}
            icon={<Heading1 size={16} />}
            title="Heading 1"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive("heading", { level: 2 })}
            icon={<Heading2 size={16} />}
            title="Heading 2"
          />
        </div>

        <div className={cn("w-px h-6 mx-2 bg-[var(--editor-border)]")} />

        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive("bulletList")}
            icon={<List size={16} />}
            title="Bullet List"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive("orderedList")}
            icon={<ListOrdered size={16} />}
            title="Ordered List"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive("blockquote")}
            icon={<Quote size={16} />}
            title="Blockquote"
          />
          <ToolbarButton
            onClick={triggerImageUpload}
            isActive={false}
            icon={<ImageIcon size={16} />}
            title="Insert Image"
          />
          <ToolbarButton
            onClick={toggleYoutubeInput}
            isActive={isYoutubeInputOpen}
            icon={<Youtube size={16} />}
            title="Insert YouTube"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            isActive={false}
            icon={<Minus size={16} />}
            title="Horizontal Rule"
          />
        </div>
      </div>
    </div>
  );
}

function ToolbarButton({
  onClick,
  isActive,
  icon,
  title,
}: {
  onClick: () => void
  isActive: boolean
  icon: React.ReactNode
  title: string
}) {
  const { config, theme } = useTheme()
  const { isCyberCopy, isTechieCopy } = useThemeHelpers()

  return (
    <button
      onClick={onClick}
      title={title}
      type="button"
      className={cn(
        getToolbarButtonClasses(theme, isActive),
        isCyberCopy ? "rounded-none" : "rounded-lg",
        isTechieCopy && "rounded-sm",
      )}
      style={{ borderRadius: isCyberCopy ? "0" : isTechieCopy ? "2px" : config.tokens.borderRadius }}
    >
      {icon}
    </button>
  )
}
