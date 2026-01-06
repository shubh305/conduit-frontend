"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Clock, Hash, User, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/features/theme/ThemeProvider";
import { getSuggestions, Suggestion } from "@/features/search/api";
import { useDebounce } from "@/features/search/hooks/useDebounce";
import { useThemeLabel } from "@/components/theme";
import {
  getPopoverClasses,
  getPopoverItemClasses,
  getPopoverLabelClasses,
} from "@/lib/theme/variants/popover-variants";
import { getInputClasses } from "@/lib/theme/variants/input-variants";

const MAX_RECENT_SEARCHES = 5;

interface SearchInputProps {
  className?: string;
  placeholder?: string;
  autoFocus?: boolean;
}

export function SearchInput({ className, placeholder = "Search...", autoFocus }: SearchInputProps) {
  const router = useRouter()
  const { theme } = useTheme();
  const t = useThemeLabel();
  
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(query, 300);


  useEffect(() => {
    const saved = localStorage.getItem("conduit_recent_searches");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse recent searches", e);
      }
    }
  }, []);


  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedQuery || debouncedQuery.length < 2) {
        setSuggestions([]);
        return;
      }
      
      setLoading(true);
      try {
        const results = await getSuggestions(debouncedQuery);
        setSuggestions(results || []);
      } catch (error) {
        console.error("Suggestion fetch failed", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);


  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const saveRecentSearch = (term: string) => {
    const newRecent = [term, ...recentSearches.filter(s => s !== term)].slice(0, MAX_RECENT_SEARCHES);
    setRecentSearches(newRecent);
    localStorage.setItem("conduit_recent_searches", JSON.stringify(newRecent));
  };

  const handleSearch = (term: string) => {
    if (!term.trim()) return;
    saveRecentSearch(term);
    setIsOpen(false);
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    saveRecentSearch(suggestion.text);
    setIsOpen(false);
    if (suggestion.url) {
      router.push(suggestion.url);
    } else {
      router.push(`/search?q=${encodeURIComponent(suggestion.text)}`);
    }
  };

  const clearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem("conduit_recent_searches");
  };

  return (
    <div ref={wrapperRef} className={cn("relative w-full", className)}>
      <div className="relative">
        <Search
          className={cn(
            "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground",
            theme === "terminal" && "text-accent",
          )}
        />
        <input
          type="text"
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={e => {
            if (e.key === "Enter") {
              handleSearch(query);
            }
          }}
          autoFocus={autoFocus}
          placeholder={placeholder}
          className={cn(
            "w-full h-10 pl-9 pr-4 bg-transparent border text-sm outline-none transition-all",
            getInputClasses(theme),
          )}
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Dropdown - Moved inside for perfect alignment */}
        {isOpen && (
          <div
            className={cn(
              "absolute top-full left-0 right-0 mt-1 z-50 overflow-hidden border",
              getPopoverClasses(theme),
            )}
          >
            {/* Loading State */}
            {loading && (
              <div className="p-4 text-center text-xs text-muted-foreground animate-pulse">
                {t("searchingDatabase")}
              </div>
            )}

            {/* Suggestions */}
            {!loading && suggestions.length > 0 && (
              <div className="py-2">
                <div className={getPopoverLabelClasses(theme)}>Suggestions</div>
                {suggestions.map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={getPopoverItemClasses(theme)}
                  >
                    {suggestion.type === "tag" && <Hash className="w-4 h-4 opacity-50" />}
                    {suggestion.type === "user" && <User className="w-4 h-4 opacity-50" />}
                    {suggestion.type === "post" && <FileText className="w-4 h-4 opacity-50" />}
                    <span>{suggestion.text}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Recent Searches */}
            {!loading && query.length === 0 && recentSearches.length > 0 && (
              <div className="py-2">
                <div className={cn(getPopoverLabelClasses(theme), "flex justify-between items-center")}>
                  <span>Recent</span>
                  <button onClick={clearRecent} className="hover:text-red-500">
                    Clear
                  </button>
                </div>
                {recentSearches.map((term, i) => (
                  <button key={i} onClick={() => handleSearch(term)} className={getPopoverItemClasses(theme)}>
                    <Clock className="w-4 h-4 opacity-50" />
                    <span>{term}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
