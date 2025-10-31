"use client";

import { useThemeHelpers } from "@/features/theme/ThemeProvider";
import { cn, getMediaUrl } from "@/lib/utils";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { searchPosts, searchUsers } from "@/features/search/api";
import { useState, useEffect } from "react";
import { Profile } from "@/features/profile/types";
import { useLibrary } from "@/features/library/context/LibraryContext";

interface Publication {
  id: string;
  slug: string;
  name: string;
  description: string;
}

export function SearchSidebar() {
  const { isCyberCopy, isSakuraCopy } = useThemeHelpers();
  const searchParams = useSearchParams();
  const query = (searchParams.get("q") || "").toLowerCase();
  
  const { isUserFollowed, toggleUser } = useLibrary();
  
  const [relevantTags, setRelevantTags] = useState<string[]>([]);
  const [relevantPeople, setRelevantPeople] = useState<Profile[]>([]);

  useEffect(() => {
    if (!query) return;
    searchPosts(query)
      .then(res => {
        if (res.data) {
          const tags = new Set<string>();
          res.data.forEach(p => p.tags.forEach(t => tags.add(t)));
          setRelevantTags(Array.from(tags).slice(0, 10));
        }
      })
      .catch(() => {});

    searchUsers(query)
      .then(res => {
        if (res.users) {
          setRelevantPeople(res.users.slice(0, 5));
        }
      })
      .catch(() => {});
  }, [query]);

  const relevantPubs: Publication[] = [];

  return (
    <div className="flex flex-col gap-12">
      {/* Topics matching query */}
      {relevantTags.length > 0 && (
        <div>
          <h3 className={cn("mb-6 font-bold uppercase tracking-[0.2em] transition-colors text-[10px]", isCyberCopy ? "text-accent font-mono" : "text-foreground-subtle")}>
            {isSakuraCopy ? "関連するトピック" : "Topics matching"} &quot;{query}&quot;
          </h3>
          <div className="flex flex-wrap gap-3">
            {relevantTags.map(tag => (
              <Link
                key={tag}
                href={`/tag/${tag}`}
                className={cn(
                  "px-4 py-2 text-xs transition-all border shadow-sm",
                  "bg-noir-panel border-noir-border text-foreground-subtle hover:text-accent hover:border-accent",
                  isCyberCopy ? "rounded-none font-mono" : "rounded-full",
                )}
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* People matching query */}
      {relevantPeople.length > 0 && (
        <div>
          <h3 className={cn("mb-6 font-bold uppercase tracking-[0.2em] transition-colors text-[10px]", isCyberCopy ? "text-accent font-mono" : "text-foreground-subtle")}>
            {isSakuraCopy ? "関連するユーザー" : "People matching"} &quot;{query}&quot;
          </h3>
          <div className="flex flex-col gap-6">
            {relevantPeople.map(person => {
              const isFollowed = isUserFollowed(person.id);
              return (
                <div key={person.id} className="flex items-center justify-between group">
                  <Link href={`/u/${person.username}`} className="flex items-center gap-4">
                    <div
                      className={cn(
                        "w-10 h-10 flex items-center justify-center overflow-hidden border border-noir-border bg-noir-bg shadow-inner transition-transform group-hover:scale-105",
                        isCyberCopy ? "rounded-none" : "rounded-full",
                      )}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={getMediaUrl(person.avatar)} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="transition-all">
                      <div className={cn("text-sm font-bold leading-tight mb-0.5 group-hover:text-accent", isCyberCopy ? "text-foreground font-mono uppercase" : "text-foreground font-sans")}>
                        {person.username}
                      </div>
                      <div className="text-[10px] text-foreground-subtle line-clamp-1 font-mono uppercase tracking-tighter">{person.bio || "No signal detected."}</div>
                    </div>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleUser(person.id)}
                    className={cn(
                      "h-8 text-[10px] px-6 transition-all uppercase tracking-widest font-bold",
                      "bg-noir-bg border-noir-border hover:border-accent hover:text-accent",
                      isCyberCopy ? "rounded-none font-mono" : "rounded-full",
                      isFollowed && "bg-accent text-noir-bg border-accent",
                    )}
                  >
                    {isFollowed ? (isSakuraCopy ? "フォロー中" : "Linked") : isSakuraCopy ? "フォロー" : "Link"}
                  </Button>
                </div>
              );
            })}
          </div>
          {relevantPeople.length > 3 && (
            <Link
              href={`/search/people?q=${query}`}
              className={cn(
                "inline-flex items-center mt-6 text-[10px] font-bold uppercase tracking-[0.2em] transition-all hover:text-accent hover:translate-x-1",
                isCyberCopy ? "text-accent font-mono" : "text-foreground-subtle",
              )}
            >
              See all results
            </Link>
          )}
        </div>
      )}

      {/* Publications matching query */}
      {relevantPubs.length > 0 && (
        <div>
          <h3 className={cn("mb-6 font-bold uppercase tracking-[0.2em] transition-colors text-[10px]", isCyberCopy ? "text-accent font-mono" : "text-foreground-subtle")}>
            {isSakuraCopy ? "関連するパブリケーション" : "Publications matching"} &quot;{query}&quot;
          </h3>
          {/* Add pub list here if needed */}
        </div>
      )}
    </div>
  );
}
