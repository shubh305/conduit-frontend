"use client";

import { Editor } from "@tiptap/react";
import { useEffect, useState, useCallback, useRef } from "react";
import { Loader2, Book, Layers, Volume2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme, useThemeHelpers } from "@/features/theme/ThemeProvider";
import { fetchApi } from "@/lib/api-client";
import { createPortal } from "react-dom";
import {
  getPopoverClasses,
  getPopoverLabelClasses,
  getPopoverItemClasses,
} from "@/lib/theme/variants/popover-variants";

interface DictionaryData {
  word: string;
  phonetic?: string;
  phonetics: {
    text?: string;
    audio?: string;
  }[];
  meanings: {
    partOfSpeech: string;
    definitions: { definition: string }[];
    synonyms: string[];
    antonyms: string[];
  }[];
  metadata?: {
    is_correct?: boolean;
    suggestions?: string[];
  };
}

interface DictionaryPopupProps {
  editor: Editor;
}

export function DictionaryPopup({ editor }: DictionaryPopupProps) {
  const { theme } = useTheme();
  const { isCyberCopy, isTechieCopy, isTerminalCopy } = useThemeHelpers();
  const [word, setWord] = useState<string | null>(null);
  const [data, setData] = useState<DictionaryData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [position, setPosition] = useState<{ top: number; left: number; placement: 'top' | 'bottom' } | null>(null);
  const [mounted, setMounted] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const playAudio = useCallback((url: string) => {
    const audio = new Audio(url);
    audio.play().catch(e => console.error("Failed to play pronunciation audio", e));
  }, []);

  const handleReplace = useCallback(
    (suggestion: string) => {
      const { from, to } = editor.state.selection;
      editor.chain().focus().insertContentAt({ from, to }, suggestion).run();
      setWord(null);
      setPosition(null);
    },
    [editor],
  );

  const fetchDictionaryData = useCallback(async (selectedWord: string, reading?: string) => {
    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await fetchApi<DictionaryData[]>("/dictionary/lookup", {
        method: "POST",
        body: JSON.stringify({
          word: selectedWord,
          reading: reading,
        }),
      });

      if (result && result.length > 0) {
        setData(result[0]);
      } else {
        setError("Word not found in lexicon.");
      }
    } catch {
      setError("Lexicon resolution failed.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updatePosition = useCallback(() => {
    const { view } = editor;
    const { selection } = editor.state;

    if (selection.empty) {
      setPosition(null);
      setWord(null);
      return;
    }

    const start = view.coordsAtPos(selection.from);
    const end = view.coordsAtPos(selection.to);

    let left = (start.left + end.left) / 2;
    let top = start.top;
    let placement: "top" | "bottom" = "top";
    const toolbar = document.querySelector(".editor-toolbar");
    const toolbarRect = toolbar?.getBoundingClientRect();
    const safeTopLimit = toolbarRect ? toolbarRect.bottom + 10 : 80;

    const isMobile = window.innerWidth < 640;
    const popupWidth = isMobile ? window.innerWidth - 32 : 320;
    const popupHeight = 350;
    const padding = 16;

    if (isMobile) {
      left = window.innerWidth / 2;
    } else {
      if (left - popupWidth / 2 < padding) {
        left = popupWidth / 2 + padding;
      } else if (left + popupWidth / 2 > window.innerWidth - padding) {
        left = window.innerWidth - popupWidth / 2 - padding;
      }
    }

    const spaceAbove = start.top - safeTopLimit;
    const spaceBelow = window.innerHeight - end.bottom - padding;

    if (spaceAbove > popupHeight || spaceAbove > spaceBelow) {
      top = start.top - 12;
      placement = "top";
    } else {
      top = end.bottom + 12;
      placement = "bottom";
    }

    setPosition({ top, left, placement });
  }, [editor]);

  useEffect(() => {
    const handleSelectionUpdate = () => {
      const { from, to } = editor.state.selection;
      if (from === to) {
        if (!document.activeElement?.closest(".dictionary-popup")) {
          setPosition(null);
          setWord(null);
        }
        return;
      }

      const text = editor.state.doc.textBetween(from, to, " ");
      const trimmedText = text.trim();

      if (trimmedText && trimmedText.length < 30) {
        let cleanWord = "";
        const readings: string[] = [];
        let reading: string | undefined;

        editor.state.doc.nodesBetween(from, to, (node, pos, parent) => {
          if (node.type.name === "ruby") {
            let rubyBase = "";
            let rubyRt = "";

            node.content.forEach((child, childOffset) => {
              const childPos = pos + 1 + childOffset;
              const childEnd = childPos + child.nodeSize;

              const relativeFrom = Math.max(from, childPos);
              const relativeTo = Math.min(to, childEnd);

              if (relativeFrom < relativeTo) {
                if (child.type.name === "rt") {
                  rubyRt += child.textBetween(relativeFrom - childPos, relativeTo - childPos);
                } else if (child.isText) {
                  rubyBase += child.textBetween(relativeFrom - childPos, relativeTo - childPos);
                }
              }
            });

            cleanWord += rubyBase;

            if (rubyRt && rubyRt !== rubyBase) {
              readings.push(rubyRt);
            }

            return false;
          } else if (node.isText) {
            if (parent && parent.type.name !== "ruby" && parent.type.name !== "rt") {
              const relativeFrom = Math.max(from, pos);
              const relativeTo = Math.min(to, pos + node.nodeSize);
              cleanWord += node.textBetween(relativeFrom - pos, relativeTo - pos);
            }
          }
        });

        if (readings.length > 0) {
          reading = readings.join("");
        }

        cleanWord = cleanWord.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").trim();

        if (cleanWord && (cleanWord !== word || reading)) {
          setWord(cleanWord);
          updatePosition();

          // Only send reading if word contains Japanese characters
          const hasJapanese = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(cleanWord);
          const validReading = reading && hasJapanese ? reading : undefined;

          fetchDictionaryData(cleanWord, validReading);
        } else if (cleanWord) {
          updatePosition();
        }
      } else {
        if (!document.activeElement?.closest(".dictionary-popup")) {
          setPosition(null);
          setWord(null);
        }
      }
    };

    editor.on("selectionUpdate", handleSelectionUpdate);
    editor.on("focus", handleSelectionUpdate);

    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate);
      editor.off("focus", handleSelectionUpdate);
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [editor, word, fetchDictionaryData, updatePosition]);

  if (!word || !position || !mounted) return null;

  const audioUrl = data?.phonetics.find(p => p.audio)?.audio;
  const phoneticText = data?.phonetic || data?.phonetics.find(p => p.text)?.text;

  const showDefinitions = data && data.meanings.length > 0;
  const showSuggestions =
    editor.isEditable &&
    data &&
    data.metadata &&
    data.metadata.is_correct === false &&
    data.metadata.suggestions &&
    data.metadata.suggestions.length > 0;

  return createPortal(
    <div
      ref={popupRef}
      onMouseDown={e => e.preventDefault()}
      className={cn(
        "dictionary-popup fixed z-[9999] -translate-x-1/2 mb-2 pointer-events-auto",
        "w-[calc(100vw-32px)] sm:w-[320px] p-4 shadow-2xl border animate-in fade-in zoom-in-95",
        getPopoverClasses(theme),
        "!bg-opacity-100 !backdrop-blur-none",
        position.placement === "top" ? "-translate-y-full" : "translate-y-0",
      )}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        opacity: 1,
      }}
    >
      <div className="flex items-center gap-2 mb-3 border-b border-border pb-2">
        <Book size={14} className="text-accent shrink-0" />
        <div className="flex flex-col min-w-0 flex-1">
          <h3
            className={cn(
              "text-sm font-bold uppercase tracking-wider truncate text-foreground",
              (isCyberCopy || isTechieCopy || isTerminalCopy) && "font-mono",
            )}
          >
            {word}
          </h3>
          {phoneticText && (
            <span className="text-[10px] text-muted-foreground font-mono tracking-tight truncate">{phoneticText}</span>
          )}
        </div>

        <div className="flex items-center gap-1 ml-auto">
          {audioUrl && (
            <button
              onClick={() => playAudio(audioUrl)}
              className="p-1 hover:bg-muted rounded transition-colors text-accent/70 hover:text-accent cursor-pointer"
              title="Listen"
            >
              <Volume2 size={14} />
            </button>
          )}
          <button
            onClick={() => {
              setPosition(null);
              setWord(null);
            }}
            className="p-1 hover:bg-muted rounded transition-colors text-muted-foreground hover:text-foreground cursor-pointer"
            title="Close Lexicon"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-6 flex flex-col items-center justify-center gap-2 text-muted-foreground">
          <Loader2 size={24} className="animate-spin" />
          <span className="text-[10px] uppercase font-mono tracking-tighter">Querying Lexicon...</span>
        </div>
      ) : error ? (
        <div className="py-4 text-center">
          <p className="text-xs text-muted-foreground italic font-mono">{error}</p>
        </div>
      ) : showDefinitions ? (
        <div className="space-y-4 max-h-[260px] overflow-y-auto no-scrollbar pr-1">
          {data!.meanings.map((meaning, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-[10px] uppercase font-mono bg-muted px-1.5 py-0.5 text-muted-foreground font-bold tracking-wider rounded-sm">
                  {meaning.partOfSpeech}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-foreground/90 font-medium">
                {meaning.definitions[0]?.definition}
              </p>

              {(meaning.synonyms?.length > 0 || meaning.antonyms?.length > 0) && (
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border mt-2">
                  {meaning.synonyms?.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-accent/80 tracking-wide">Synonyms</span>
                      <div className="flex flex-wrap gap-1.5">
                        {meaning.synonyms.slice(0, 3).map((s, i) => (
                          <span
                            key={i}
                            className="text-xs text-muted-foreground hover:text-accent transition-colors cursor-default font-medium"
                          >
                            {s}
                            {i < Math.min(meaning.synonyms.length, 3) - 1 ? "," : ""}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {meaning.antonyms?.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-red-500/80 tracking-wide">Antonyms</span>
                      <div className="flex flex-wrap gap-1.5">
                        {meaning.antonyms.slice(0, 3).map((a, i) => (
                          <span
                            key={i}
                            className="text-xs text-muted-foreground hover:text-red-400 transition-colors cursor-default font-medium"
                          >
                            {a}
                            {i < Math.min(meaning.antonyms.length, 3) - 1 ? "," : ""}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : showSuggestions ? (
        <div className="space-y-3">
          <div className={cn(getPopoverLabelClasses(theme), "text-amber-500 mb-2 border-none px-0")}>Did you mean:</div>
          <div className="flex flex-col gap-1.5">
            {data!.metadata!.suggestions!.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleReplace(suggestion)}
                className={cn(
                  getPopoverItemClasses(theme),
                  "rounded border border-border/50 justify-between px-3 !bg-opacity-100",
                  "cursor-pointer",
                )}
              >
                <span className="font-mono">{suggestion}</span>
                <span className="text-[9px] uppercase opacity-50">Apply</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="py-4 text-center">
          <p className="text-xs text-muted-foreground italic font-mono">No definitions found.</p>
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-border flex justify-between items-center px-1 opacity-80 hover:opacity-100 transition-opacity">
        <span className="text-[10px] text-muted-foreground font-bold font-mono tracking-[0.2em] uppercase truncate ml-1">
          Noir Dictionary v1.0
        </span>
        <Layers size={12} className="text-muted-foreground shrink-0" />
      </div>
    </div>,
    document.body,
  );
}
