"use client";

import { Editor } from "@tiptap/react";
import { useEffect, useState, useCallback, useRef } from "react";
import { Loader2, Book, Layers, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useThemeHelpers } from "@/features/theme/ThemeProvider";

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
}

interface DictionaryPopupProps {
  editor: Editor;
}

export function DictionaryPopup({ editor }: DictionaryPopupProps) {
  const { isCyberCopy, isTechieCopy, isTerminalCopy } = useThemeHelpers();
  const [word, setWord] = useState<string | null>(null);
  const [data, setData] = useState<DictionaryData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [position, setPosition] = useState<{ top: number; left: number; placement: 'top' | 'bottom' } | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const playAudio = useCallback((url: string) => {
    const audio = new Audio(url);
    audio.play().catch(e => console.error("Failed to play pronunciation audio", e));
  }, []);

  const fetchDictionaryData = useCallback(async (selectedWord: string) => {
    setIsLoading(true);
    setError(null);
    setData(null);
    
    try {
      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${selectedWord}`);
      
      if (res.ok) {
        const result = await res.json();
        setData(result[0]);
      } else {
        const wikiRes = await fetch(`https://en.wiktionary.org/api/rest_v1/page/definition/${selectedWord}`);
        if (wikiRes.ok) {
          const wikiData = await wikiRes.json() as Record<string, Array<{
            partOfSpeech: string;
            definitions: Array<{ definition: string }>;
          }>>;
          
          const sections = Object.keys(wikiData);
          if (sections.length > 0) {
            setData({
              word: selectedWord,
              meanings: wikiData[sections[0]].slice(0, 3).map((m) => ({
                partOfSpeech: m.partOfSpeech.toLowerCase(),
                definitions: m.definitions.map((d) => ({ definition: d.definition.replace(/<[^>]*>?/gm, '') })),
                synonyms: [],
                antonyms: []
              })),
              phonetics: []
            });
          } else {
            setError("Word not found in lexicon.");
          }
        } else {
          setError("Word not found in lexicon.");
        }
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
    let placement: 'top' | 'bottom' = 'top';

    const isMobile = window.innerWidth < 640;
    const popupWidth = isMobile ? window.innerWidth - 32 : 320;
    const popupHeight = 300;
    const padding = 16;

    if (left - popupWidth / 2 < padding) {
      left = popupWidth / 2 + padding;
    } else if (left + popupWidth / 2 > window.innerWidth - padding) {
      left = window.innerWidth - popupWidth / 2 - padding;
    }

    if (top - popupHeight < padding) {
      top = end.bottom + 10;
      placement = 'bottom';
    } else {
      top = start.top - 10;
      placement = 'top';
    }

    setPosition({ top, left, placement });
  }, [editor]);

  useEffect(() => {
    const handleSelectionUpdate = () => {
      const { from, to } = editor.state.selection;
      if (from === to) {
        if (!document.activeElement?.closest('.dictionary-popup')) {
            setPosition(null);
            setWord(null);
        }
        return;
      }

      const text = editor.state.doc.textBetween(from, to, " ");
      const trimmedText = text.trim();

      if (trimmedText && !trimmedText.includes(" ") && trimmedText.length < 30) {
        const cleanWord = trimmedText.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");
        if (cleanWord && cleanWord !== word) {
          setWord(cleanWord);
          updatePosition();
          fetchDictionaryData(cleanWord);
        } else if (cleanWord) {
          updatePosition();
        }
      } else {
        if (!document.activeElement?.closest('.dictionary-popup')) {
            setPosition(null);
            setWord(null);
        }
      }
    };

    editor.on("selectionUpdate", handleSelectionUpdate);
    editor.on("focus", handleSelectionUpdate);
    
    const handleBlur = () => {
        setTimeout(() => {
            if (!document.activeElement?.closest('.dictionary-popup')) {
                setPosition(null);
                setWord(null);
            }
        }, 200);
    };
    editor.on("blur", handleBlur);

    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate);
      editor.off("focus", handleSelectionUpdate);
      editor.off("blur", handleBlur);
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [editor, word, fetchDictionaryData, updatePosition]);

  if (!word || !position) return null;

  const audioUrl = data?.phonetics.find(p => p.audio)?.audio;
  const phoneticText = data?.phonetic || data?.phonetics.find(p => p.text)?.text;

  return (
    <div
      ref={popupRef}
      className={cn(
        "dictionary-popup fixed z-[9999] -translate-x-1/2 mb-2 pointer-events-auto",
        "w-[calc(100vw-32px)] sm:w-[320px] p-4 shadow-2xl border animate-in fade-in zoom-in-95",
        "bg-zinc-950/95 backdrop-blur-md border-zinc-800 text-zinc-100",
        position.placement === 'top' ? "-translate-y-full" : "translate-y-0",
        isCyberCopy && "rounded-none border-accent/40 shadow-[0_0_20px_rgba(var(--accent-rgb),0.2)]",
        isTerminalCopy && "font-mono border-green-500/30 bg-black/90",
        !isCyberCopy && "rounded-lg"
      )}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      <div className="flex items-center gap-2 mb-3 border-b border-zinc-800 pb-2">
        <Book size={12} className="text-accent shrink-0" />
        <div className="flex flex-col min-w-0 flex-1">
          <h3 className={cn(
            "text-xs font-bold uppercase tracking-wider truncate",
            (isCyberCopy || isTechieCopy || isTerminalCopy) && "font-mono"
          )}>
            {word}
          </h3>
          {phoneticText && (
            <span className="text-[9px] text-zinc-500 font-mono tracking-tight truncate">
              {phoneticText}
            </span>
          )}
        </div>

        {audioUrl && (
          <button
            onClick={() => playAudio(audioUrl)}
            className="p-1 hover:bg-zinc-800 rounded transition-colors text-accent/70 hover:text-accent ml-auto"
            title="Listen to pronunciation"
          >
            <Volume2 size={12} />
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="py-6 flex flex-col items-center justify-center gap-2 text-zinc-500">
          <Loader2 size={20} className="animate-spin" />
          <span className="text-[8px] uppercase font-mono tracking-tighter">Querying Lexicon...</span>
        </div>
      ) : error ? (
        <div className="py-4 text-center">
          <p className="text-[10px] text-zinc-500 italic font-mono">{error}</p>
        </div>
      ) : data ? (
        <div className="space-y-3 max-h-[220px] overflow-y-auto no-scrollbar pr-1">
          {data.meanings.map((meaning, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[8px] uppercase font-mono bg-zinc-800 px-1.5 py-0.5 text-zinc-400">
                  {meaning.partOfSpeech}
                </span>
              </div>
              <p className="text-[11px] leading-relaxed text-zinc-300">
                {meaning.definitions[0]?.definition}
              </p>
              
              {(meaning.synonyms?.length > 0 || meaning.antonyms?.length > 0) && (
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-zinc-900 mt-1.5">
                  {meaning.synonyms?.length > 0 && (
                    <div className="space-y-0.5">
                      <span className="text-[8px] uppercase font-bold text-accent/70">Synonyms</span>
                      <div className="flex flex-wrap gap-1">
                        {meaning.synonyms.slice(0, 3).map((s, i) => (
                          <span key={i} className="text-[9px] text-zinc-500 hover:text-accent transition-colors cursor-default truncate max-w-full">
                            {s}{i < Math.min(meaning.synonyms.length, 3) - 1 ? "," : ""}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {meaning.antonyms?.length > 0 && (
                    <div className="space-y-0.5">
                      <span className="text-[8px] uppercase font-bold text-red-500/70">Antonyms</span>
                      <div className="flex flex-wrap gap-1">
                        {meaning.antonyms.slice(0, 3).map((a, i) => (
                          <span key={i} className="text-[9px] text-zinc-500 hover:text-red-400 transition-colors cursor-default truncate max-w-full">
                            {a}{i < Math.min(meaning.antonyms.length, 3) - 1 ? "," : ""}
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
      ) : null}

      <div className="mt-4 pt-2 border-t border-zinc-900 flex justify-between items-center px-1">
         <span className="text-[8px] text-zinc-600 font-mono tracking-widest uppercase truncate ml-1">Noir Dictionary v1.4</span>
         <Layers size={10} className="text-zinc-800 shrink-0" />
      </div>
    </div>
  );
}
