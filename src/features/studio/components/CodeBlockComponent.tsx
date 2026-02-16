"use client";

import { NodeViewWrapper, NodeViewContent, NodeViewProps } from "@tiptap/react";
import { Check, Clipboard, Trash2, Sparkles, ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const languages = [
  { label: "Plain Text", value: "null" },
  { label: "JavaScript", value: "javascript" },
  { label: "TypeScript", value: "typescript" },
  { label: "HTML", value: "xml" },
  { label: "CSS", value: "css" },
  { label: "Python", value: "python" },
  { label: "JSON", value: "json" },
  { label: "Bash", value: "bash" },
  { label: "Rust", value: "rust" },
  { label: "Go", value: "go" },
  { label: "C++", value: "cpp" },
  { label: "Java", value: "java" },
  { label: "YAML", value: "yaml" },
];

export const CodeBlockComponent = ({
  node,
  updateAttributes,
  editor,
  getPos,
  deleteNode,
}: NodeViewProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { language: defaultLanguage } = node.attrs;

  const copyToClipboard = async () => {
    // Get text content and ensure newlines are explicitly preserved
    const text = node.content.textBetween(0, node.content.size, "\n");
    if (text) {
      try {
        const html = `<pre><code class="language-${defaultLanguage || ""}">$&#123;text&#125;</code></pre>`.replace("$&#123;text&#125;", text);
        const blobText = new Blob([text], { type: "text/plain" });
        const blobHtml = new Blob([html], { type: "text/html" });
        const data = [new ClipboardItem({
          "text/plain": blobText,
          "text/html": blobHtml,
        })];
        await navigator.clipboard.write(data);
      } catch {
        // Fallback to plain text if ClipboardItem API fails or is not supported
        await navigator.clipboard.writeText(text);
      }
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const formatCode = async () => {
    try {
      const prettier = await import("prettier/standalone");
      const estree = await import("prettier/plugins/estree");
      const html = await import("prettier/plugins/html");
      const postcss = await import("prettier/plugins/postcss");

      const text = node.content.textBetween(0, node.content.size, "\n");
      const lang = defaultLanguage || "";
      
      let parser = "babel";
      const plugins: unknown[] = [estree];

      if (lang === "typescript" || lang === "ts" || lang === "tsx") {
        const typescript = await import("prettier/plugins/typescript");
        parser = "typescript";
        plugins.push(typescript);
      } else if (lang === "json") {
        const babel = await import("prettier/plugins/babel");
        parser = "json";
        plugins.push(babel);
      } else if (lang === "html" || lang === "xml") {
        parser = "html";
        plugins.push(html);
      } else if (lang === "css" || lang === "scss" || lang === "less") {
        parser = "css";
        plugins.push(postcss);
      } else {
        const babel = await import("prettier/plugins/babel");
        parser = "babel";
        plugins.push(babel);
      }

      const formatted = await prettier.format(text, {
        parser,
        plugins: plugins as unknown as import("prettier").Plugin[],
        semi: true,
        singleQuote: true,
      });

      if (typeof getPos === "function") {
        const from = getPos();
        if (from !== undefined) {
          const to = from + node.nodeSize;
          editor.chain().focus().insertContentAt({ from, to }, {
            type: "codeBlock",
            attrs: { language: defaultLanguage },
            content: [{ type: "text", text: formatted.trim() }]
          }).run();
        }
      }
    } catch (e) {
      console.error("Formatting failed", e);
    }
  };

  const handleLanguageChange = (lang: string) => {
    updateAttributes({ language: lang === "null" ? null : lang });
    setIsDropdownOpen(false);
  };

  const currentLanguageLabel =
    languages.find(l => l.value === (defaultLanguage || "null"))?.label || "Plain Text";

  return (
    <NodeViewWrapper className="code-block-wrapper my-8 group relative rounded-xl overflow-hidden border border-[var(--code-border)] bg-[var(--code-bg)] shadow-2xl transition-all hover:shadow-accent/5 max-w-4xl mx-auto">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--code-border)] bg-[var(--code-header)] backdrop-blur-md sticky top-0 z-10">
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-[var(--code-text)] opacity-50 hover:opacity-100 transition-opacity py-1 group/lang cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-accent/50 group-hover/lang:bg-accent transition-colors shrink-0" />
            {currentLanguageLabel}
            <ChevronDown
              size={12}
              className={cn("transition-transform duration-300", isDropdownOpen && "rotate-180")}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 z-50 py-2 bg-[var(--code-dropdown-bg)] border border-[var(--code-border)] rounded-xl shadow-2xl min-w-[160px] max-h-[300px] overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-2 backdrop-blur-xl">
              {languages.map(lang => (
                <button
                  key={lang.value}
                  onClick={() => handleLanguageChange(lang.value)}
                  className={cn(
                    "w-full text-left px-4 py-2 text-[10px] uppercase font-bold tracking-widest transition-all cursor-pointer",
                    (defaultLanguage || "null") === lang.value
                      ? "text-accent bg-accent/5"
                      : "text-[var(--code-text)] opacity-40 hover:opacity-100 hover:bg-black/5",
                  )}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={copyToClipboard}
            className="p-1.5 text-[var(--code-text)] opacity-30 hover:opacity-100 hover:bg-black/5 rounded-lg transition-all active:scale-95 cursor-pointer"
            title="Copy Code"
          >
            {isCopied ? <Check size={14} className="text-emerald-400" /> : <Clipboard size={14} />}
          </button>

          <button
            onClick={formatCode}
            className="p-1.5 text-[var(--code-text)] opacity-30 hover:opacity-100 hover:bg-black/5 rounded-lg transition-all active:scale-95 group/format cursor-pointer"
            title="Pretty Format (Auto-align)"
          >
            <Sparkles size={14} className="group-hover/format:animate-pulse" />
          </button>

          <button
            onClick={deleteNode}
            className="p-1.5 text-[var(--code-text)] opacity-30 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all active:scale-95 cursor-pointer"
            title="Delete Block"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <pre className="p-5 overflow-x-auto selection:bg-accent/30 no-scrollbar bg-transparent">
        <NodeViewContent
          as="div"
          className={cn(
            defaultLanguage && `language-${defaultLanguage}`,
            "block font-mono text-sm leading-relaxed text-[var(--code-text)]",
          )}
        />
      </pre>
    </NodeViewWrapper>
  );
};
