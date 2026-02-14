"use client";

import { useTheme, useThemeHelpers } from "@/features/theme/ThemeProvider";
import { cn, getMediaUrl, getPostUrl } from "@/lib/utils";
import { Search as SearchIcon } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { globalSearch } from "@/features/search/api";
import { FeedItem } from "@/features/feed/types";
import { Profile } from "@/features/profile/types";
import { Button } from "@/components/ui/button";
import { useLibrary } from "@/features/library/context/LibraryContext";
import { SearchInput } from "./SearchInput";
import { useThemeLabel } from "@/components/theme";
import { semanticSearch } from "@/features/search/api";
import { toast } from "sonner";

type Tab = "posts" | "publications" | "people";

interface Publication {
  id: string;
  slug: string;
  name: string;
  description: string;
}

export function SearchPageContainer({ initialTenantSlug }: { initialTenantSlug?: string }) {
  const { config, mounted } = useTheme();
  const { isCyberCopy, isSakuraCopy, isRoninCopy, isJournalCopy, isTerminalCopy } = useThemeHelpers();
  const searchParams = useSearchParams();

  const query = searchParams.get("q") || "";
  const isSemantic = searchParams.get("semantic") === "true";
  const [activeTab, setActiveTab] = useState<Tab>("posts");
  const tabs: Tab[] = ["posts", "publications", "people"];

  const t = useThemeLabel();

  if (!mounted) {
    return (
      <div className="min-h-screen bg-noir-bg pt-24 px-6 md:px-0">
        <div className="max-w-4xl mx-auto animate-pulse">
          <div className="h-20 w-3/4 bg-foreground/5 rounded-2xl mb-12" />
          <div className="h-10 w-full bg-foreground/5 rounded-full" />
        </div>
      </div>
    );
  }

  const handleAiToggle = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (isSemantic) params.delete("semantic");
    else params.set("semantic", "true");
    window.location.href = `/search?${params.toString()}`;
  };

  const tabLabels: Record<Tab, string> = {
    posts: t("postsTab"),
    publications: t("publicationsTab"),
    people: t("peopleTab"),
  };

  // --- TERMINAL HEADER ---
  if (isTerminalCopy) {
    return (
      <div className="min-h-screen bg-noir-bg text-accent font-mono p-4 pt-24 max-w-6xl mx-auto">
        <div className="md:hidden mb-12">
          <div className="text-[10px] text-accent/50 uppercase tracking-[0.3em] mb-4">{t("newSearch")}</div>
          <SearchInput
            placeholder="root@conduit:~$ grep -r ..."
            autoFocus
            className="w-full"
            isAiActive={isSemantic}
            onAiToggle={handleAiToggle}
          />
        </div>

        <div className="border-b border-accent pb-4 mb-4">
          <div className="flex flex-wrap items-center gap-2 text-lg md:text-xl">
            <span className="text-accent">root@conduit:~$</span>
            <span>grep -r</span>
            <span className="text-white">&quot;{query}&quot;</span>
            <span>.</span>
            <span className="text-accent/60">--type={activeTab}</span>
            {isSemantic && <span className="text-accent font-bold ml-2">--semantic</span>}
            <span className="animate-pulse w-2 h-5 bg-accent inline-block align-middle ml-1" />
          </div>

          <div className="flex justify-between items-end mt-4">
            <div className="flex gap-4 text-sm">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "hover:bg-accent hover:text-black px-2 transition-colors",
                    activeTab === tab ? "bg-accent text-black font-bold" : "text-accent",
                  )}
                >
                  [ --{tab} ]
                </button>
              ))}
            </div>

            {/* Terminal AI Toggle - Moved to SearchInput */}
          </div>
        </div>

        <SearchResults query={query} tab={activeTab} currentTenantSlug={initialTenantSlug} isSemantic={isSemantic} />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "min-h-screen text-foreground transition-all",
        isRoninCopy || isSakuraCopy || isJournalCopy ? "bg-transparent" : "bg-noir-bg",
      )}
    >
      {/* Header Area */}
      <div className="pt-8 md:pt-24 pb-8 px-6 md:px-0 border-b border-noir-border">
        <div className="max-w-4xl mx-auto">
          <div className="md:hidden mb-12">
            <div className="text-[10px] font-mono text-foreground-subtle uppercase tracking-[0.3em] mb-4">
              {t("newSearch")}
            </div>
            <SearchInput
              placeholder={t("search")}
              autoFocus
              className="w-full"
              isAiActive={isSemantic}
              onAiToggle={handleAiToggle}
            />
          </div>

          <div className="flex flex-col gap-4 mb-12">
            <span className="text-[10px] font-mono text-foreground-subtle uppercase tracking-[0.3em]">
              {t("searchResults")}
            </span>
            <div className="flex items-baseline gap-4">
              <SearchIcon size={24} className="text-accent opacity-50" />
              <span
                className={cn(
                  "text-5xl md:text-7xl font-black leading-tight break-words",
                  isCyberCopy
                    ? "font-display uppercase tracking-tighter"
                    : config.fontFamily === "serif"
                      ? "font-serif italic"
                      : "font-sans",
                )}
              >
                {query || "..."}
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-10 overflow-x-auto no-scrollbar">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "pb-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-all border-b-2 whitespace-nowrap",
                  activeTab === tab
                    ? "border-accent text-accent"
                    : "border-transparent text-foreground-subtle hover:text-foreground",
                  isCyberCopy ? "font-mono" : "font-sans",
                )}
              >
                {tabLabels[tab]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Container */}
      <div className="max-w-4xl mx-auto px-6 md:px-0 py-16">
        <SearchResults query={query} tab={activeTab} currentTenantSlug={initialTenantSlug} isSemantic={isSemantic} />
      </div>
    </div>
  );
}

function SearchResults({
  query,
  tab,
  currentTenantSlug,
  isSemantic,
}: {
  query: string;
  tab: Tab;
  currentTenantSlug?: string;
  isSemantic: boolean;
}) {
  const { config } = useTheme();
  const { isCyberCopy, isSakuraCopy, isDarkMode, isTerminalCopy } = useThemeHelpers();
  const { isUserFollowed, toggleUser } = useLibrary();
  const t = useThemeLabel();

  const [posts, setPosts] = useState<FeedItem[]>([]);
  const [people, setPeople] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!query) return;
      setIsLoading(true);
      try {
        if (isSemantic && tab === "posts") {
          const response = await semanticSearch(query);
          setPosts(response.results);
        } else {
          const response = await globalSearch(query);
          const { results } = response;
          setPosts(results.posts || []);
          setPeople(results.users || []);
        }
      } catch (e) {
        console.error(e);
        toast.error("Search failed");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [query, isSemantic, tab]);

  if (!query)
    return (
      <div className={cn("text-center py-20", isTerminalCopy ? "text-accent/50 text-sm" : "")}>
        <p
          className={cn(
            "text-foreground-subtle font-mono text-xs uppercase tracking-widest animate-pulse",
            isTerminalCopy ? "text-accent/50" : "",
          )}
        >
          {t("waitingForSignal")}
        </p>
      </div>
    );

  const publications: Publication[] = [];

  const getPostLink = (post: FeedItem) => getPostUrl(post, currentTenantSlug);

  // --- TERMINAL VIEW ---
  if (isTerminalCopy) {
    return (
      <div className="space-y-6 pt-4">
        {isLoading && <div className="text-accent/50 animate-pulse text-sm">* Searching database... [LOADING]</div>}

        {!isLoading && tab === "posts" && (
          <div className="space-y-2">
            {posts.length === 0 && (
              <div className="text-accent/30 text-xs italic">* No stories found for the given pattern.</div>
            )}
            {posts.map(post => (
              <div
                key={post.postId}
                className="font-mono text-[10px] md:text-sm flex gap-2 items-baseline group overflow-hidden py-0.5"
              >
                <span className="text-accent/30 lowercase shrink-0">./</span>
                <Link
                  href={getPostLink(post)}
                  className="text-accent hover:bg-accent hover:text-black px-1 transition-all shrink-0"
                >
                  {post.tenantSlug ? `${post.tenantSlug}/` : ""}
                  {post.postSlug}.md
                </Link>
                <span className="text-white shrink-0">:</span>
                <span className="text-foreground-muted truncate group-hover:text-foreground-subtle transition-all">
                  {post.excerpt || post.title} -- ...
                </span>
              </div>
            ))}
          </div>
        )}

        {!isLoading && tab === "people" && (
          <div className="space-y-2">
            {people.length === 0 && (
              <div className="text-accent/30 text-xs italic">* No entities found matching the query.</div>
            )}
            {people.map(person => (
              <div
                key={person.id}
                className="font-mono text-[10px] md:text-sm flex gap-2 items-baseline group overflow-hidden py-0.5"
              >
                <span className="text-accent/30 shrink-0">[user]</span>
                <Link
                  href={`/u/${person.username}`}
                  className="text-accent hover:bg-accent hover:text-black px-1 transition-all shrink-0"
                >
                  @{person.username}
                </Link>
                <span className="text-white shrink-0">:</span>
                <span className="text-foreground-muted truncate group-hover:text-foreground-subtle transition-all">
                  {person.bio || "No bio signal recorded."}
                </span>
              </div>
            ))}
          </div>
        )}

        {!isLoading && tab === "publications" && (
          <div className="text-accent/30 text-xs italic">
            * Transmission lookup not attached to this terminal session.
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {isLoading && (
        <div className="flex flex-col items-center gap-4 py-20">
          <div
            className={cn(
              "w-12 h-12 border-4 border-t-accent rounded-full animate-spin",
              isSemantic ? "border-accent/40 shadow-[0_0_15px_rgba(var(--accent-rgb),0.3)]" : "border-accent/20",
            )}
          />
          <div className="text-foreground-subtle font-mono text-[10px] uppercase tracking-[0.3em]">
            {isSemantic ? "Synthesizing Neural Results..." : t("searchingDatabase")}
          </div>
        </div>
      )}

      {!isLoading && tab === "posts" && (
        <div className="grid gap-16">
          {posts.length === 0 && (
            <div className="text-foreground-subtle text-center py-20 border border-dashed border-noir-border rounded-xl">
              {t("noStoriesFound")}
            </div>
          )}

          {posts.map(post => {
            return (
              <div
                key={post.postId}
                className={cn(
                  "group flex justify-between gap-12 items-start transition-all",
                  isSakuraCopy ? "card p-8 rounded-3xl border-transparent" : "",
                )}
              >
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-4 mb-2">
                    <Link
                      href={`/u/${post.authorUsername}`}
                      className="flex items-center gap-2 hover:text-accent transition-all group/author"
                    >
                      <div
                        className={cn(
                          "w-6 h-6 flex items-center justify-center text-[10px] font-bold border border-noir-border bg-noir-panel",
                          isCyberCopy ? "rounded-none" : "rounded-full",
                        )}
                      >
                        {post.authorName?.[0]}
                      </div>
                      <span
                        className={cn(
                          "text-[10px] font-bold uppercase tracking-widest",
                          isCyberCopy ? "font-mono" : "font-sans",
                        )}
                      >
                        {post.authorName}
                      </span>
                    </Link>
                    <span className="text-noir-border text-[10px]">/</span>
                    <span className="text-[10px] text-foreground-subtle font-mono">
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Title & Excerpt */}
                  <Link
                    href={getPostLink(post)}
                    className="block space-y-3 group-hover:bg-accent/5 p-2 -ml-2 rounded-xl transition-all"
                  >
                    <h2
                      className={cn(
                        "text-2xl font-bold leading-tight group-hover:text-accent transition-colors",
                        isCyberCopy
                          ? "font-mono uppercase tracking-tighter text-balance"
                          : config.fontFamily === "serif"
                            ? "font-serif italic"
                            : "font-sans",
                      )}
                    >
                      {post.title}
                    </h2>
                    <p
                      className={cn(
                        "text-sm line-clamp-2 leading-relaxed text-foreground-muted",
                        config.fontFamily === "serif" ? "font-serif" : "font-sans",
                      )}
                    >
                      {post.excerpt}
                    </p>
                  </Link>

                  {/* Meta / Actions */}
                  <div className="flex items-center gap-3 pt-2">
                    <span
                      className={cn(
                        "px-2 py-0.5 text-[8px] uppercase tracking-widest font-black border",
                        isCyberCopy
                          ? "border-accent/30 text-accent font-mono"
                          : "border-noir-border text-foreground-subtle rounded-md",
                      )}
                    >
                      {post.tags?.[0] || "Story"}
                    </span>
                    {post.tenantSlug && (
                      <>
                        <span className="text-noir-border text-[10px]">/</span>
                        <span className="text-[9px] font-bold uppercase text-foreground-subtle tracking-tighter">
                          {post.tenantName}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Aspect Ratio Controlled Image */}
                {post.featuredImage && (
                  <Link
                    href={getPostLink(post)}
                    className={cn(
                      "hidden sm:block w-36 h-36 shrink-0 overflow-hidden border border-noir-border transition-all duration-700",
                      isCyberCopy ? "rounded-none" : "rounded-2xl shadow-xl hover:shadow-accent/10",
                    )}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getMediaUrl(post.featuredImage)}
                      alt=""
                      className={cn(
                        "w-full h-full object-cover transition-all duration-700",
                        isDarkMode
                          ? "grayscale group-hover:grayscale-0 opacity-80 group-hover:opacity-100"
                          : "opacity-90 group-hover:opacity-100",
                      )}
                    />
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* PEOPLE TAB */}
      {!isLoading && tab === "people" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {people.length === 0 && (
            <div className="col-span-full text-foreground-subtle text-center py-20 italic">{t("noNodesFound")}</div>
          )}
          {people.map(person => {
            const isFollowed = isUserFollowed(person.id);
            return (
              <div
                key={person.id}
                className={cn(
                  "flex items-center justify-between p-6 border transition-all hover:bg-noir-panel group",
                  isCyberCopy ? "border-noir-border rounded-none" : "border-noir-border rounded-2xl",
                )}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "w-12 h-12 overflow-hidden flex items-center justify-center font-bold text-lg border border-noir-border bg-noir-bg shadow-inner",
                      isCyberCopy ? "rounded-none" : "rounded-full",
                    )}
                  >
                    {person.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={getMediaUrl(person.avatar)} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-accent/20 font-serif italic">{person.username[0].toUpperCase()}</span>
                    )}
                  </div>
                  <div>
                    <div
                      className={cn(
                        "font-bold text-base transition-colors group-hover:text-accent",
                        isCyberCopy ? "font-mono uppercase" : "font-sans",
                      )}
                    >
                      {person.username}
                    </div>
                    <div className="text-[10px] text-foreground-subtle font-mono uppercase tracking-widest line-clamp-1">
                      {person.bio || "No bio signal."}
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "h-8 text-[10px] px-6 uppercase tracking-widest transition-all",
                    isCyberCopy
                      ? "rounded-none border-accent/40 text-accent font-mono"
                      : "rounded-full border-noir-border",
                    isFollowed && "bg-accent text-noir-bg border-accent",
                  )}
                  onClick={() => toggleUser(person.id)}
                >
                  {isFollowed ? t("followingAction") : t("followAction")}
                </Button>
              </div>
            );
          })}
        </div>
      )}

      {/* PUBLICATIONS TAB */}
      {!isLoading && tab === "publications" && (
        <div className="grid gap-6">
          {publications.length === 0 && (
            <div className="text-foreground-subtle text-center py-20 italic">{t("noFrequenciesFound")}</div>
          )}
        </div>
      )}
    </div>
  );
}
