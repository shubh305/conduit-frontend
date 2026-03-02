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
  AlignLeft,
  AlignCenter,
  AlignRight,
  Indent as IndentIcon,
  Outdent,
  Type,
  Highlighter,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { useTheme, useThemeHelpers } from "@/features/theme/ThemeProvider"
import { getToolbarButtonClasses } from "@/lib/theme-variants"
import { uploadFile } from "@/lib/api-client";
import { toast } from "sonner";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useLabels } from "@/features/theme/ThemeProvider";
import { getTextColorPalette, getHighlightPalette } from "@/lib/theme/variants/editor-variants";

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
  const { getLabel: t } = useLabels();
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
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [isHighlightPickerOpen, setIsHighlightPickerOpen] = useState(false);

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
    <Tooltip.Provider delayDuration={400} skipDelayDuration={0}>
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
              <span className="text-[10px] uppercase font-bold text-foreground/50 tracking-wider font-mono">
                {t("insertLink")}
              </span>
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
              placeholder={t("linkUrl")}
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
              placeholder={t("labelText")}
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
              {t("apply")}
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
              <span className="text-[10px] uppercase font-bold text-foreground/50 tracking-wider font-mono">
                {t("insertYoutube")}
              </span>
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
              placeholder={t("youtubeUrl")}
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
              {t("addVideo")}
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
              <span className="text-[10px] uppercase font-bold text-foreground/50 tracking-wider font-mono">
                {t("insertFurigana")}
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
              placeholder={t("reading")}
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
              {t("apply")}
            </button>
          </div>
        )}

        {/* Color Picker Overlay */}
        {isColorPickerOpen && (
          <div
            className={cn(
              "absolute top-full left-0 mt-1 z-[60] p-3 shadow-2xl border animate-in fade-in slide-in-from-top-2",
              "bg-[var(--editor-bg)] border-[var(--editor-border)] shadow-[var(--editor-glow)] w-[200px]",
            )}
            style={{ borderRadius: isCyberCopy ? "0" : config.tokens.borderRadius }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-bold text-foreground/50 tracking-wider font-mono">
                {t("textColor")}
              </span>
              <button
                onClick={() => setIsColorPickerOpen(false)}
                className="p-1 hover:bg-white/10 rounded-full transition-colors group cursor-pointer"
              >
                <X size={12} className="text-foreground/40 group-hover:text-foreground" />
              </button>
            </div>
            <div className="grid grid-cols-5 gap-1.5 focus:outline-none">
              {getTextColorPalette(theme).map(color => (
                <button
                  key={color}
                  onClick={() => {
                    editor.chain().focus().setColor(color).run();
                    setIsColorPickerOpen(false);
                  }}
                  className="w-6 h-6 rounded-sm border border-white/10 hover:scale-110 transition-transform cursor-pointer"
                  style={{ backgroundColor: color }}
                />
              ))}
              <button
                onClick={() => {
                  if (isColorPickerOpen) {
                    editor.chain().focus().unsetColor().run();
                    setIsColorPickerOpen(false);
                  } else {
                    editor.chain().focus().unsetHighlight().run();
                    setIsHighlightPickerOpen(false);
                  }
                }}
                className="col-span-2 text-[10px] uppercase font-mono border border-[var(--editor-border)] hover:bg-white/5 py-1 cursor-pointer"
              >
                {t("reset")}
              </button>
            </div>
          </div>
        )}

        {/* Highlight Picker Overlay */}
        {isHighlightPickerOpen && (
          <div
            className={cn(
              "absolute top-full left-0 mt-1 z-[60] p-3 shadow-2xl border animate-in fade-in slide-in-from-top-2",
              "bg-[var(--editor-bg)] border-[var(--editor-border)] shadow-[var(--editor-glow)] w-[200px]",
            )}
            style={{ borderRadius: isCyberCopy ? "0" : config.tokens.borderRadius }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-bold text-foreground/50 tracking-wider font-mono">
                {t("highlight")}
              </span>
              <button
                onClick={() => setIsHighlightPickerOpen(false)}
                className="p-1 hover:bg-white/10 rounded-full transition-colors group cursor-pointer"
              >
                <X size={12} className="text-foreground/40 group-hover:text-foreground" />
              </button>
            </div>
            <div className="grid grid-cols-5 gap-1.5 focus:outline-none">
              {getHighlightPalette(theme).map(color => (
                <button
                  key={color}
                  onClick={() => {
                    editor.chain().focus().setHighlight({ color }).run();
                    setIsHighlightPickerOpen(false);
                  }}
                  className="w-6 h-6 rounded-sm border border-white/10 hover:scale-110 transition-transform cursor-pointer"
                  style={{ backgroundColor: color }}
                />
              ))}
              <button
                onClick={() => {
                  if (isColorPickerOpen) {
                    editor.chain().focus().unsetColor().run();
                    setIsColorPickerOpen(false);
                  } else {
                    editor.chain().focus().unsetHighlight().run();
                    setIsHighlightPickerOpen(false);
                  }
                }}
                className="col-span-2 text-[10px] uppercase font-mono border border-[var(--editor-border)] hover:bg-white/5 py-1 cursor-pointer"
              >
                {t("reset")}
              </button>
            </div>
          </div>
        )}

        {/* Grouped Toolbar Container */}
        <div className="flex items-center gap-1 p-1 overflow-x-auto no-scrollbar w-full whitespace-nowrap flex-nowrap scroll-smooth">
          {/* Hidden File Input */}
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />

          {/* GROUP 1: HISTORY */}
          <ToolbarGroup>
            <ToolbarButton
              onClick={() => editor.chain().focus().undo().run()}
              isActive={false}
              icon={<Undo size={15} />}
              title="Undo"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().redo().run()}
              isActive={false}
              icon={<Redo size={15} />}
              title="Redo"
            />
          </ToolbarGroup>

          <ToolbarDivider />

          {/* GROUP 2: TYPOGRAPHY */}
          <ToolbarGroup>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive("bold")}
              icon={<Bold size={15} />}
              title="Bold"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive("italic")}
              icon={<Italic size={15} />}
              title="Italic"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              isActive={editor.isActive("underline")}
              icon={<UnderlineIcon size={15} />}
              title="Underline"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleStrike().run()}
              isActive={editor.isActive("strike")}
              icon={<Strikethrough size={15} />}
              title="Strikethrough"
            />
          </ToolbarGroup>

          <ToolbarDivider />

          {/* GROUP 3: HEADINGS & BLOCKS */}
          <ToolbarGroup>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              isActive={editor.isActive("heading", { level: 1 })}
              icon={<Heading1 size={15} />}
              title="Heading 1"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              isActive={editor.isActive("heading", { level: 2 })}
              icon={<Heading2 size={15} />}
              title="Heading 2"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              isActive={editor.isActive("blockquote")}
              icon={<Quote size={15} />}
              title="Blockquote"
            />
          </ToolbarGroup>

          <ToolbarDivider />

          {/* GROUP 4: COLORS & HIGHLIGHTS */}
          <ToolbarGroup className="relative">
            <ToolbarButton
              onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
              isActive={isColorPickerOpen}
              icon={
                <div className="flex items-center gap-0.5">
                  <Type size={15} />
                  <ChevronDown size={8} className="opacity-50" />
                </div>
              }
              title="Text Color"
            />
            <ToolbarButton
              onClick={() => setIsHighlightPickerOpen(!isHighlightPickerOpen)}
              isActive={isHighlightPickerOpen}
              icon={
                <div className="flex items-center gap-0.5">
                  <Highlighter size={15} />
                  <ChevronDown size={8} className="opacity-50" />
                </div>
              }
              title="Highlighting"
            />
          </ToolbarGroup>

          <ToolbarDivider />

          {/* GROUP 5: ALIGNMENT & INDENT */}
          <ToolbarGroup>
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              isActive={editor.isActive({ textAlign: "left" })}
              icon={<AlignLeft size={15} />}
              title="Align Left"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign("center").run()}
              isActive={editor.isActive({ textAlign: "center" })}
              icon={<AlignCenter size={15} />}
              title="Align Center"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              isActive={editor.isActive({ textAlign: "right" })}
              icon={<AlignRight size={15} />}
              title="Align Right"
            />
            <div className="w-px h-3 bg-[var(--editor-border)]/50 mx-0.5" />
            <ToolbarButton
              onClick={() => editor.chain().focus().indent().run()}
              isActive={false}
              icon={<IndentIcon size={15} />}
              title="Indent"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().outdent().run()}
              isActive={false}
              icon={<Outdent size={15} />}
              title="Outdent"
            />
          </ToolbarGroup>

          <ToolbarDivider />

          {/* GROUP 6: LISTS & STRUCTURE */}
          <ToolbarGroup>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive("bulletList")}
              icon={<List size={15} />}
              title="Bullet List"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive("orderedList")}
              icon={<ListOrdered size={15} />}
              title="Ordered List"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              isActive={false}
              icon={<Minus size={15} />}
              title="Horizontal Rule"
            />
          </ToolbarGroup>

          <ToolbarDivider />

          {/* GROUP 7: MEDIA & SPECIAL */}
          <ToolbarGroup>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              isActive={editor.isActive("codeBlock")}
              icon={<Code size={15} />}
              title="Code Block"
            />
            <ToolbarButton
              onClick={toggleLinkInput}
              isActive={editor.isActive("link") || isLinkInputOpen}
              icon={<LinkIcon size={15} />}
              title="Link"
            />
            <ToolbarButton onClick={triggerImageUpload} isActive={false} icon={<ImageIcon size={15} />} title="Image" />
            <ToolbarButton
              onClick={toggleYoutubeInput}
              isActive={isYoutubeInputOpen}
              icon={<Youtube size={15} />}
              title="YouTube"
            />
            {(theme === "sakura" || theme === "ronin" || theme === "journal") && (
              <ToolbarButton
                onClick={toggleRubyInput}
                isActive={isRubyInputOpen}
                icon={<Languages size={15} />}
                title="Furigana"
              />
            )}
          </ToolbarGroup>

          {/* CONTEXTUAL: IMAGE ALIGNMENT */}
          {editor.isActive("image") && (
            <div className="flex items-center gap-0.5 ml-auto bg-accent/5 px-1 py-0.5 rounded border border-accent/20 animate-in fade-in slide-in-from-right-2">
              <span className="text-[9px] uppercase font-bold text-accent/50 mr-1 ml-1 hidden lg:inline">
                Image Align
              </span>
              <ToolbarButton
                onClick={() => editor.chain().focus().updateAttributes("image", { align: "left" }).run()}
                isActive={editor.getAttributes("image").align === "left"}
                icon={<AlignLeft size={14} />}
                title="Image Left"
              />
              <ToolbarButton
                onClick={() => editor.chain().focus().updateAttributes("image", { align: "center" }).run()}
                isActive={editor.getAttributes("image").align === "center" || !editor.getAttributes("image").align}
                icon={<AlignCenter size={14} />}
                title="Image Center"
              />
              <ToolbarButton
                onClick={() => editor.chain().focus().updateAttributes("image", { align: "right" }).run()}
                isActive={editor.getAttributes("image").align === "right"}
                icon={<AlignRight size={14} />}
                title="Image Right"
              />
            </div>
          )}
        </div>
      </div>
    </Tooltip.Provider>
  );
}

function ToolbarGroup({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex items-center gap-0.5 px-0.5", className)}>{children}</div>;
}

function ToolbarDivider() {
  return <div className="w-px h-6 bg-[var(--editor-border)] mx-1 opacity-50" />;
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
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <button
          onClick={onClick}
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
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          side="bottom"
          align="center"
          sideOffset={8}
          className={cn(
            "z-[100] px-3 py-1.5 text-[11px] font-medium animate-in fade-in zoom-in-95 data-[side=bottom]:slide-in-from-top-2",
            "bg-[#161616] text-white border border-white/10 shadow-xl",
            isCyberCopy && "bg-black border-accent/40 font-mono uppercase text-[10px]",
            isTechieCopy && "font-mono border-accent rounded-sm",
          )}
          style={{ borderRadius: isCyberCopy ? "0" : isTechieCopy ? "2px" : "6px" }}
        >
          {title}
          <Tooltip.Arrow className="fill-[#161616]" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
