"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useThemeHelpers } from "@/features/theme/ThemeProvider";

interface DateTimePickerProps {
  value: string | null;
  onChange: (date: string) => void;
  disabled?: boolean;
}

export function DateTimePicker({ value, onChange, disabled }: DateTimePickerProps) {
  const { isCyberCopy, isNoir, isSakuraCopy, isJournalCopy, isTerminalCopy } = useThemeHelpers();
  const [prevValue, setPrevValue] = useState(value);
  const [localValue, setLocalValue] = useState(() => {
    if (!value) return "";
    const date = new Date(value);
    const tzOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
  });

  if (value !== prevValue) {
    setPrevValue(value);
    if (value) {
      const date = new Date(value);
      const tzOffset = date.getTimezoneOffset() * 60000;
      const localISOTime = new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
      setLocalValue(localISOTime);
    } else {
      setLocalValue("");
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newVal = e.target.value;
    if (!newVal) {
      setLocalValue("");
      return;
    }

    const date = new Date(newVal);
    if (isNaN(date.getTime())) return;

    // Snap to 10m intervals
    const minutes = date.getMinutes();
    const roundedMinutes = Math.round(minutes / 10) * 10;

    if (minutes !== roundedMinutes) {
      date.setMinutes(roundedMinutes);
      const tzOffset = date.getTimezoneOffset() * 60000;
      newVal = new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
    }

    setLocalValue(newVal);
    onChange(new Date(newVal).toISOString());
  };

  // Base input styles based on theme
  const getThemeStyles = () => {
    if (isCyberCopy) {
      return "bg-black border border-signal-green text-signal-green font-mono placeholder:text-signal-green/50 focus:border-signal-green focus:shadow-[0_0_10px_rgba(50,255,100,0.3)] rounded-none";
    }
    if (isNoir) {
      return "bg-noir-bg border border-white/20 text-white font-sans placeholder:text-white/20 focus:border-white rounded-md";
    }
    if (isSakuraCopy) {
      return "bg-white/80 border border-pink-200 text-gray-800 font-serif placeholder:text-pink-300 focus:border-pink-400 focus:ring-1 focus:ring-pink-200 rounded-lg";
    }
    if (isJournalCopy) {
      return "bg-[#f4ebd0] border border-[#d8c8a0] text-[#4a3b2a] font-serif placeholder:text-[#4a3b2a]/40 focus:border-[#4a3b2a] rounded-sm";
    }
    if (isTerminalCopy) {
      return "bg-black border border-[#33ff33] text-[#33ff33] font-mono placeholder:text-[#33ff33]/50 focus:border-[#33ff33] rounded-none";
    }

    return "bg-background border border-border text-foreground rounded-md focus:ring-2 focus:ring-ring";
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        type="datetime-local"
        value={localValue}
        onChange={handleChange}
        disabled={disabled}
        min={new Date().toISOString().slice(0, 16)}
        className={cn(
          "w-full px-3 py-2 text-sm outline-none transition-all",
          getThemeStyles(),
          disabled && "opacity-50 cursor-not-allowed"
        )}
      />
      <p className={cn(
        "text-[10px]",
        isCyberCopy || isTerminalCopy ? "font-mono" : "font-sans",
        isCyberCopy ? "text-signal-green/60" : "text-foreground-subtle"
      )}>
        {isSakuraCopy ? "※ 10分単位で指定可能" : "10-minute intervals only"}
      </p>
    </div>
  );
}
