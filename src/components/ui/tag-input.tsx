"use client";

import { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";

import { ThemeVariant, getTagClasses, getTagInputClasses, getTagRemoveButtonClasses } from "@/lib/theme-variants";
import { useThemeHelpers, useStudioLabels } from "@/features/theme/ThemeProvider";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  theme: ThemeVariant;
  disabled?: boolean;
}

export function TagInput({ tags, onChange, theme, disabled }: TagInputProps) {
  const [input, setInput] = useState("");
  const { isTerminalCopy, isCyberCopy, isTechieCopy } = useThemeHelpers();
  const { getLabel } = useStudioLabels();

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && input === "" && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const addTag = () => {
    const trimmed = input.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
      setInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(t => t !== tagToRemove));
  };

  const activeStatus = getLabel("input_active_status");

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map(tag => (
          <span key={tag} className={getTagClasses(theme)}>
            {isTerminalCopy && ">"} #{tag}
            <button onClick={() => removeTag(tag)} disabled={disabled} className={getTagRemoveButtonClasses(theme)}>
              <X size={10} strokeWidth={3} />
            </button>
          </span>
        ))}
      </div>
      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          disabled={disabled}
          placeholder={tags.length === 0 ? "Add tags (tech, webdev)..." : "Add more..."}
          className={getTagInputClasses(theme)}
        />
        {activeStatus && (isCyberCopy || isTerminalCopy || isTechieCopy) && (
          <div className="absolute right-0 bottom-2 text-[8px] font-mono text-accent/30 pointer-events-none uppercase">
            {activeStatus}
          </div>
        )}
      </div>
    </div>
  );
}
