"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme, useThemeHelpers } from "@/features/theme/ThemeProvider";
import { fetchApi } from "@/lib/api-client";
import Image from "next/image";

interface SearchResults {
  results: UnsplashPhoto[];
  total: number;
  total_pages: number;
}

interface UnsplashPhoto {
  id: string;
  urls: {
    regular: string;
    small: string;
    thumb: string;
  };
  user: {
    name: string;
    username: string;
    links: {
      html: string;
    };
  };
  links: {
    download_location: string;
  };
}

interface UnsplashSelectorProps {
  onSelect: (url: string, attribution?: { name: string; url: string }) => void;
  tenantId?: string;
}

export function UnsplashSelector({ onSelect, tenantId }: UnsplashSelectorProps) {
  const [query, setQuery] = useState("");
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  
  const { theme } = useTheme();
  const { isCyberCopy, isTerminalCopy, isTechieCopy } = useThemeHelpers();

  const searchPhotos = useCallback(async (searchQuery: string, pageNum: number, append = false) => {
    if (!searchQuery) return;
    setLoading(true);
    try {
      const data = await fetchApi<SearchResults>(`/media/unsplash/search?query=${encodeURIComponent(searchQuery)}&page=${pageNum}`, {
        tenantId,
      });
      
      if (append) {
        setPhotos(prev => [...prev, ...data.results]);
      } else {
        setPhotos(data.results);
      }
      setHasMore(pageNum < data.total_pages);
    } catch (error) {
      console.error("Unsplash search failed", error);
    } finally {
      setLoading(false);
    }
  }, [tenantId]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setPage(1);
    searchPhotos(query, 1);
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    searchPhotos(query, nextPage, true);
  };

  const handleSelect = async (photo: UnsplashPhoto) => {
    onSelect(photo.urls.regular, {
      name: photo.user.name,
      url: `${photo.user.links.html}?utm_source=conduit&utm_medium=referral`
    });

    try {
      await fetchApi("/media/unsplash/track", {
        method: "POST",
        body: JSON.stringify({ downloadLocation: photo.links.download_location }),
        tenantId,
      });
    } catch {

    }
  };

  return (
    <div
      className={cn(
        "flex flex-col h-full overflow-hidden",
        theme === "sakura" ? "bg-[var(--journal-paper)]" : "bg-noir-bg",
      )}
    >
      <div
        className={cn(
          "px-2 pt-0 pb-4 md:p-10 border-b border-noir-border shrink-0",
          theme === "sakura" ? "bg-white/40" : "bg-noir-bg/50 backdrop-blur-xl",
        )}
      >
        <form onSubmit={handleSearch} className="flex flex-col items-center gap-2 md:gap-8 max-w-2xl mx-auto">
          <div className="flex flex-col md:flex-row gap-2 w-full">
            <div className="relative flex-1 group">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-subtle group-focus-within:text-accent transition-colors"
                size={18}
              />
              <Input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search high-res assets..."
                className={cn(
                  "pl-12 nuclear-input-reset !border-0 !shadow-none !ring-0 !outline-none h-10 md:h-14 text-sm transition-all !bg-transparent focus:!bg-transparent focus:!border-0 focus:!shadow-none focus:!ring-0 focus:!outline-none",
                  isCyberCopy ? "rounded-none font-mono uppercase border-accent/20" : "rounded-2xl",
                )}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !query}
              className={cn(
                "h-10 md:h-14 px-6 md:px-10 font-black uppercase text-[10px] tracking-widest transition-all shrink-0",
                isCyberCopy
                  ? "bg-accent text-noir-bg rounded-none hover:skew-x-[-10deg]"
                  : cn(
                      "bg-accent rounded-2xl hover:scale-105 shadow-lg shadow-accent/20",
                      theme === "classic" ? "text-black" : "text-white",
                    ),
              )}
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Search"}
            </button>
          </div>
        </form>
      </div>

      <div
        className={cn(
          "flex-1 overflow-y-auto p-2 md:p-8 no-scrollbar scroll-smooth",
          theme === "sakura" && "bg-[var(--journal-paper)]",
        )}
      >
        {photos.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
            {photos.map(photo => (
              <div
                key={photo.id}
                onClick={() => handleSelect(photo)}
                className={cn(
                  "group relative aspect-video cursor-pointer overflow-hidden border transition-all",
                  "border-noir-border",
                  theme === "sakura" ? "hover:border-[#ffb7c5] hover:shadow-lg" : "hover:border-accent",
                  isCyberCopy ? "rounded-none" : "rounded-xl",
                )}
              >
                <Image
                  src={photo.urls.small}
                  alt={photo.user.name}
                  fill
                  className="object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                  <div className="flex items-center justify-between text-[10px] text-white/90">
                    <span className="font-medium truncate">by {photo.user.name}</span>
                    <a
                      href={`${photo.user.links.html}?utm_source=conduit&utm_medium=referral`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-accent transition-colors"
                      onClick={e => e.stopPropagation()}
                    >
                      <ExternalLink size={10} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : !loading && query ? (
          <div className="text-center py-20 text-foreground font-mono text-xs uppercase tracking-widest">
            {isCyberCopy || isTerminalCopy || isTechieCopy
              ? isCyberCopy
                ? "NO_TRANSMISSIONS_FOUND"
                : "NO TRANSMISSIONS FOUND"
              : theme === "sakura"
                ? "結果が見つかりませんでした"
                : "No results found"}
          </div>
        ) : (
          !loading && (
            <div className="text-center py-20 text-foreground-subtle font-mono text-xs uppercase tracking-widest">
              {isTerminalCopy ? "> WAITING_FOR_INPUT..." : "Start searching Unsplash"}
            </div>
          )
        )}

        {hasMore && (
          <div className="flex justify-center mt-6 h-20">
            <Button
              variant="ghost"
              onClick={loadMore}
              disabled={loading}
              className={cn(
                "uppercase text-xs font-bold tracking-widest",
                isCyberCopy ? "font-mono h-10 border border-accent/20 rounded-none" : "rounded-xl",
              )}
            >
              {loading ? <Loader2 className="animate-spin mr-2" size={12} /> : "Load More"}
            </Button>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-noir-border text-center text-[10px] text-foreground font-black uppercase tracking-widest bg-noir-bg">
        Photos provided by{" "}
        <a
          href="https://unsplash.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline"
        >
          Unsplash
        </a>
      </div>
    </div>
  );
}
