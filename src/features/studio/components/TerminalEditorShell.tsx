"use client";

import { Editor, EditorContent } from "@tiptap/react";
import { cn } from "@/lib/utils";
import { ThemePage } from "@/components/theme/ThemePage";
import { useThemeLabel } from "@/components/theme";

interface TerminalEditorShellProps {
  editor: Editor;
  filename?: string;
}

export function TerminalEditorShell({ editor, filename = "new_post.md" }: TerminalEditorShellProps) {
  const t = useThemeLabel();
  const insertLabel = t("statusDrafts");
  const saveLabel = t("saveChanges");

  if (!editor) return null;

  return (
    <ThemePage className="p-0 overflow-hidden">
      <div className="flex flex-col h-full bg-black font-mono text-foreground relative overflow-hidden">
        {/* Retro Toolbar (Fixed Top) */}
        <div className="border-b border-accent/20 p-2 flex items-center justify-between text-accent font-mono text-base select-none bg-black z-10">
          <div className="flex items-center gap-6">
            <div className="flex gap-2">
              <button
                onClick={() => editor.chain().focus().undo().run()}
                className="hover:bg-accent hover:text-black px-2 py-1 transition-colors"
                title="Undo"
              >
                u
              </button>
              <button
                onClick={() => editor.chain().focus().redo().run()}
                className="hover:bg-accent hover:text-black px-2 py-1 transition-colors"
                title="Redo"
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
              >
                B
              </button>
              <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={cn(
                  "hover:bg-accent hover:text-black px-2 py-1 italic transition-colors",
                  editor.isActive("italic") && "bg-accent text-black",
                )}
              >
                I
              </button>
              <button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={cn(
                  "hover:bg-accent hover:text-black px-2 py-1 underline transition-colors",
                  editor.isActive("underline") && "bg-accent text-black",
                )}
              >
                U
              </button>
              <button
                onClick={() => editor.chain().focus().toggleCode().run()}
                className={cn(
                  "hover:bg-accent hover:text-black px-2 py-1 transition-colors",
                  editor.isActive("code") && "bg-accent text-black",
                )}
              >
                &lt;&gt;
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
              >
                H1
              </button>
              <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={cn(
                  "hover:bg-accent hover:text-black px-2 py-1 transition-colors",
                  editor.isActive("heading", { level: 2 }) && "bg-accent text-black",
                )}
              >
                H2
              </button>
            </div>
          </div>
          <div>
            <span className="text-accent/50 pr-2 hidden md:block">-- {saveLabel.toUpperCase()} --</span>
          </div>
        </div>

        {/* Main Scrollable Area (Lines + Content) */}
        <div className="flex-1 flex overflow-y-auto custom-scrollbar-cyber relative">
          <div className="flex w-full min-h-full">
            {/* Line Numbers Column */}
            <div
              className="w-12 pt-6 pb-6 text-right pr-3 text-accent/30 select-none bg-black border-r border-accent/10 text-sm leading-[1.8] flex flex-col font-mono"
              aria-hidden="true"
            >
              {Array.from({ length: 100 }).map((_, i) => (
                <div key={i} className="h-[28px]">
                  {i + 1}
                </div>
              ))}
              <div className="text-accent/20 flex-1 relative">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={`tilde-${i}`} className="h-[28px]">
                    ~
                  </div>
                ))}
              </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 relative flex flex-col">
              <EditorContent
                editor={editor}
                className="flex-1 outline-none p-0 [&_.ProseMirror]:min-h-full [&_.ProseMirror]:p-6 [&_.ProseMirror]:outline-none [&_.ProseMirror]:text-foreground [&_.ProseMirror]:font-mono [&_.ProseMirror]:leading-[1.8] [&_.is-editor-empty:before]:text-accent/50"
              />
            </div>
          </div>
        </div>

        {/* Status Bar (Fixed Bottom) */}
        <div className="h-8 bg-accent text-black flex justify-between items-center px-4 md:px-6 text-xs md:text-sm font-bold border-t border-black z-10 shrink-0">
          <div className="flex items-center gap-6">
            <span className="bg-black text-accent px-2">-- {insertLabel} --</span>
            <span>{filename}</span>
            {editor.isActive("heading", { level: 1 }) && <span>[H1]</span>}
            {editor.isActive("bold") && <span>[BOLD]</span>}
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
    </ThemePage>
  );
}
