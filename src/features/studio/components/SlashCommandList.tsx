import React, { forwardRef, useEffect, useImperativeHandle, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Editor, Range } from "@tiptap/core";

export interface SlashCommandItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  command: (props: { editor: Editor; range: Range }) => void;
}

export interface SlashCommandListProps {
  items: SlashCommandItem[];
  command: (item: SlashCommandItem) => void;
  editor: Editor;
  range: Range;
}

export const SlashCommandList = forwardRef(({ items, command }: SlashCommandListProps, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = useCallback((index: number) => {
    const item = items[index];
    if (item) {
      command(item);
    }
  }, [items, command]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedIndex(0);
  }, [items.length]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === "ArrowUp") {
        setSelectedIndex((i) => (i + items.length - 1) % items.length);
        return true;
      }

      if (event.key === "ArrowDown") {
        setSelectedIndex((i) => (i + 1) % items.length);
        return true;
      }

      if (event.key === "Enter") {
        selectItem(selectedIndex);
        return true;
      }

      return false;
    },
  }), [selectedIndex, items, selectItem]);

  return (
    <div className="z-50 w-72 overflow-hidden rounded-xl border border-[var(--editor-border)] bg-[var(--editor-bg)] shadow-2xl animate-in fade-in zoom-in-95 duration-200 p-1.5">
      <div className="max-h-96 overflow-y-auto custom-scrollbar">
        {items.length > 0 ? (
          items.map((item, index) => (
            <button
              key={index}
              onClick={() => selectItem(index)}
              onMouseEnter={() => setSelectedIndex(index)}
              className={cn(
                "group flex w-full cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-all duration-150",
                index === selectedIndex ? "bg-accent/10 translate-x-0.5" : "hover:bg-accent/5"
              )}
            >
              <div className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--editor-border)] bg-[var(--editor-bg)] transition-all duration-200 shadow-sm",
                index === selectedIndex ? "border-accent/40 shadow-accent/5" : ""
              )}>
                <div className={cn(
                  "transition-transform duration-200 scale-90",
                  index === selectedIndex ? "scale-100 text-accent" : "text-muted-foreground"
                )}>
                  {item.icon}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className={cn(
                  "text-[13px] font-bold leading-tight transition-colors",
                  index === selectedIndex ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                )}>
                  {item.title}
                </div>
                <div className="text-[11px] text-muted-foreground/80 leading-snug line-clamp-1 mt-0.5 font-medium">
                  {item.description}
                </div>
              </div>
            </button>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="h-10 w-10 text-muted-foreground/20 italic font-serif text-3xl">/</div>
            <div className="mt-2 text-sm text-muted-foreground font-medium">No results found</div>
          </div>
        )}
      </div>
    </div>
  );
});

SlashCommandList.displayName = "SlashCommandList";
