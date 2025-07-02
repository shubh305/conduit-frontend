"use client";

import { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  isNoir: boolean;
  disabled?: boolean;
}

export function TagInput({ tags, onChange, isNoir, disabled }: TagInputProps) {
  const [input, setInput] = useState("");

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
    onChange(tags.filter((t) => t !== tagToRemove));
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className={cn(
              "inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full border",
              isNoir
                ? "bg-white/10 border-white/20 text-white"
                : "bg-signal-green/10 border-signal-green/30 text-signal-green"
            )}
          >
            #{tag}
            <button
              onClick={() => removeTag(tag)}
              disabled={disabled}
              className="hover:text-red-400 focus:outline-none"
            >
              <X size={12} />
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        disabled={disabled}
        placeholder={tags.length === 0 ? "Add tags (tech, webdev)..." : "Add more..."}
        className={cn(
          "w-full bg-transparent border-b px-0 py-2 text-sm focus:outline-none focus:ring-0",
          isNoir
            ? "border-white/20 text-white placeholder:text-white/20 focus:border-white"
            : "border-gray-800 text-white placeholder:text-gray-600 focus:border-signal-green"
        )}
      />
    </div>
  );
}
