"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useTheme, useThemeHelpers } from "@/features/theme/ThemeProvider"
import { ProfileHeader } from "@/features/profile/components/ProfileHeader";
import { getProfile } from "@/features/profile/api";
import { getTenant, getPosts, getUserTenants } from "@/features/blog/api";
import { Profile } from "@/features/profile/types";
import { Tenant } from "@/features/blog/types";
import { FeedItem } from "@/features/feed/types";
import { useAuth } from "@/features/auth/AuthProvider";
import { getMediaUrl, cn } from "@/lib/utils";
import { toast } from "sonner";
import { Calendar, Globe, Terminal, Settings, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link"
import { FeedCard } from "@/features/feed/components/FeedCard";
import { TerminalFeedCard } from "@/features/feed/components/TerminalFeedCard";
import { useThemeLabel } from "@/components/theme";
import { getHeadingClasses } from "@/lib/theme-variants";

export default function UserProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const { theme } = useTheme()
  const { isTerminalCopy, isCyberCopy, isSakuraCopy, isTechieCopy } = useThemeHelpers()
  const { user: currentUser } = useAuth();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<FeedItem[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isOwner = currentUser?.username === username;

  // Theme-aware labels
  const t = useThemeLabel();
  const loadingText = t("loadingProfile");
  const writesAtLabel = t("writesAt");
  const recentActivityLabel = t("recentActivity");
  const manageLabel = t("manage");
  const noTransmissionsText = t("noTransmissions");
  const visitLabel = t("visit");
  const memberSinceLabel = t("memberSince");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { user } = await getProfile(username);
        setProfile(user);

        try {
          const userTenants = await getUserTenants(user.id);
          setTenants(userTenants || []);
        } catch (err) {
          console.error("Failed to load user tenants", err);
          toast.error("Failed to load transmissions");
        }

        try {
          const { tenant } = await getTenant(username);
          if (tenant) {
            const { data } = await getPosts(tenant.id, { limit: 10 });
            const feedItems: FeedItem[] = data.map(post => ({
              tenantId: tenant.id,
              tenantSlug: tenant.slug,
              tenantName: tenant.name,
              postId: post.id,
              postSlug: post.slug,
              title: post.title,
              excerpt: post.excerpt,
              featuredImage: getMediaUrl(post.featuredImage),
              authorName: post.authorName,
              authorUsername: post.authorUsername || username,
              tags: post.tags,
              publishedAt: post.publishedAt,
              viewsCount: post.viewsCount,
              likesCount: post.likesCount || 0,
              commentsCount: post.commentsCount || 0,
            }));
            setPosts(feedItems);
          }
        } catch (err) {
          console.log("No tenant found for user, or failed to fetch posts", err);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchData();
    }
  }, [username]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-foreground-subtle font-mono">{loadingText}</div>;
  }

  if (error || !profile) {
    return <div className="min-h-screen flex items-center justify-center text-signal-red font-mono">{error || "User not found"}</div>;
  }

  const uptimeDays = profile.joinedAt ? Math.floor((new Date().getTime() - new Date(profile.joinedAt).getTime()) / (1000 * 60 * 60 * 24)) : 0;
  const joinDate = profile.joinedAt || profile.createdAt ? new Date(profile.joinedAt || profile.createdAt || "").toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "OCT, 2018";

  return (
    <div
      className={cn(
        "max-w-5xl mx-auto profile-container",
        isTerminalCopy ? "space-y-6 p-2 md:p-8" : "space-y-8 p-0 md:p-0",
      )}
    >
      {/* 1. Header Section */}
      <ProfileHeader key={profile.id} user={profile} isOwner={isOwner} />

      <div
        className={cn(
          "py-4 flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-widest text-foreground-subtle relative",
          isTerminalCopy
            ? "border-y border-accent/20 bg-black py-2 justify-start px-4 text-accent/70"
            : isTechieCopy
              ? "border-y border-white/5 bg-[var(--bg-panel)]/30 py-3 justify-start px-8 text-[var(--accent)]/60"
              : isCyberCopy
                ? "border-t border-b border-accent/20 bg-accent/5"
                : "border-t border-b border-noir-border bg-noir-panel/30",
        )}
      >
        {isTerminalCopy ? (
          <span className="flex items-center gap-4 w-full">
            <span>[UPTIME: {uptimeDays} DAYS]</span>
            <span className="hidden md:inline">[GROUPS: USER, WRITER]</span>
            <span className="ml-auto">[TTY: pts/0]</span>
          </span>
        ) : isTechieCopy ? (
          <span className="flex items-center gap-8 w-full">
            <span className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full animate-pulse" /> STATUS: ACTIVE
            </span>
            <span className="hidden md:inline">SYSTEM_UPTIME: {uptimeDays}d</span>
            <span className="hidden md:inline">ACCESS_LEVEL: 0x4F</span>
            <span className="ml-auto font-bold opacity-100 text-[var(--accent)]">
              {memberSinceLabel} {joinDate}
            </span>
          </span>
        ) : (
          <>
            <Calendar size={12} />
            {memberSinceLabel} {joinDate}
          </>
        )}

        {(isCyberCopy || isTechieCopy || isTerminalCopy) && (
          <div className="absolute -top-6 left-0 text-[10px] font-mono text-accent/40 uppercase tracking-[0.4em]">
            {isTechieCopy ? "SPEC_SHEET_v4.2" : isTerminalCopy ? "TTY.IDENT.v3" : "USER.IDENT.v1"}
          </div>
        )}
      </div>

      {/* 2. Writes At Section */}
      <section className="space-y-6">
        {!isTerminalCopy && (
          <div className="flex items-center justify-between border-b border-noir-border pb-4">
            <h2 className={cn("text-xl font-bold flex items-center gap-3 text-foreground", getHeadingClasses(theme))}>
              <Globe size={20} className="text-accent" />
              {writesAtLabel}
            </h2>
            {isOwner && (
              <Link
                href="/studio/config"
                className="text-xs font-mono flex items-center gap-2 font-bold transition-colors text-foreground-muted hover:text-accent"
              >
                <Settings size={14} /> {manageLabel}
              </Link>
            )}
          </div>
        )}

        {isTerminalCopy ? (
          /* Terminal Mounts Table */
          <TerminalMountsTable tenants={tenants} noMountsText={noTransmissionsText} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tenants.map(t => (
              <div
                key={t.id}
                className={cn(
                  "p-5 border flex items-center justify-between group transition-all",
                  "border-noir-border bg-noir-panel/30 hover:border-accent",
                )}
              >
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="font-bold text-foreground group-hover:text-accent transition-colors">{t.name}</h3>
                    <p className="font-mono text-[10px] text-foreground-subtle">
                      {t.customDomain || `${t.slug}.conduit.app`}
                    </p>
                  </div>
                </div>
                <Link href={`/${t.slug}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 px-4 rounded-full border-noir-border hover:bg-noir-hover text-xs font-bold gap-2 transition-all text-accent hover:border-accent"
                  >
                    <ExternalLink size={14} /> {visitLabel}
                  </Button>
                </Link>
              </div>
            ))}
            {tenants.length === 0 && (
              <div className="col-span-full py-8 text-center border font-mono text-xs text-foreground-subtle border-dashed border-noir-border">
                {noTransmissionsText}
              </div>
            )}
          </div>
        )}
      </section>

      {/* . Recent Activity Section */}
      <section className="space-y-8">
        {!isTerminalCopy && (
          <div className="flex items-center justify-between border-b border-noir-border pb-4">
            <h2 className={cn("text-xl font-bold flex items-center gap-3 text-foreground", getHeadingClasses(theme))}>
              <Terminal size={20} className="text-accent" />
              {recentActivityLabel}
            </h2>
          </div>
        )}

        {isTerminalCopy ? (
          <TerminalActivityLog posts={posts} />
        ) : (
          <div className="space-y-6">
            {posts.map((post, idx) => (
              <div key={post.postId}>
                <div className="relative pl-12">
                  {/* Timeline Marker */}
                  <div className="absolute left-0 top-2 bottom-0 w-px bg-noir-border">
                    <div
                      className={cn(
                        "absolute -left-1.5 top-0 w-3 h-3 border-2 bg-noir-bg",
                        isCyberCopy
                          ? "border-accent"
                          : isSakuraCopy
                            ? "border-accent bg-accent"
                            : "border-foreground rounded-full",
                      )}
                    />
                    {idx < posts.length - 1 && <div className="absolute left-0 top-3 bottom-0 w-px bg-noir-border" />}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[10px] font-mono text-foreground-subtle uppercase">
                      <span>{new Date(post.publishedAt).toLocaleDateString("en-US")}</span>
                      <span className="w-1 h-1 bg-noir-border rounded-full" />
                      <span className="text-foreground">{isSakuraCopy ? "Post Published" : "TRANS_NODE_LINKED"}</span>
                    </div>
                    <FeedCard item={post} variant="compact" />
                  </div>
                </div>
              </div>
            ))}

            {posts.length === 0 && (
              <div className="py-24 text-center border border-dashed border-noir-border bg-noir-panel/30">
                <p className="font-mono text-[10px] text-foreground-subtle uppercase tracking-[0.3em]">
                  No activity detected on this frequency.
                </p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

// ============================================================================
// Terminal Sub-Components
// ============================================================================

function TerminalMountsTable({ tenants, noMountsText }: { tenants: Tenant[]; noMountsText: string }) {
  return (
    <div className="font-mono text-xs md:text-sm">
      <div className="text-accent mb-2 animate-pulse">$ df -h</div>
      <div className="border border-accent/30 bg-black p-4 shadow-[0_0_10px_rgba(74,246,38,0.05)]">
        <div className="grid grid-cols-[2fr_1fr_1fr_3fr] text-accent/50 mb-3 border-b border-accent/20 pb-2 px-2 uppercase tracking-wider">
          <div>Filesystem</div>
          <div>Type</div>
          <div>Size (Est)</div>
          <div>Mounted on</div>
        </div>
        {tenants.map(t => (
          <Link key={t.id} href={`/${t.slug}`}>
            <div className="grid grid-cols-[2fr_1fr_1fr_3fr] hover:bg-accent hover:text-black transition-colors py-2 px-2 cursor-pointer border-l-2 border-transparent hover:border-black group">
              <span className="truncate pr-4 font-bold">{t.name}</span>
              <span className="opacity-70">ext4</span>
              <span className="opacity-70">1.2G</span>
              <span className="truncate font-mono group-hover:font-bold">/mnt/{t.slug}</span>
            </div>
          </Link>
        ))}
        {tenants.length === 0 && <div className="py-4 text-center text-accent/30">{noMountsText}</div>}
      </div>
    </div>
  );
}

function TerminalActivityLog({ posts }: { posts: FeedItem[] }) {
  return (
    <div className="font-mono text-xs md:text-sm">
      <div className="text-accent mb-2 animate-pulse">$ history | grep &apos;activity&apos; | tail -n 20</div>
      <div className="border border-accent/30 bg-black min-h-[300px] p-0 relative">
        {/* Header */}
        <div className="bg-accent/10 border-b border-accent/20 px-4 py-1 flex items-center justify-between text-[10px] text-accent/60 select-none">
          <span>PID USER TIME COMMAND</span>
          <span>STATUS: RUNNING</span>
        </div>
        {/* Log Stream */}
        <div className="p-2 space-y-0.5">
          {posts.map(post => (
            <div key={post.postId} className="group flex items-center hover:bg-accent/5 -mx-2 px-2 transition-colors">
              <span className="text-foreground-muted mr-3 shrink-0 opacity-50 text-[10px] w-12 text-right">
                {post.postId.slice(-4)}
              </span>
              <div className="flex-1">
                <TerminalFeedCard item={post} />
              </div>
            </div>
          ))}
        </div>
        {posts.length === 0 && <div className="p-8 text-center text-accent/30">[NO_HISTORY_FOUND]</div>}

        {/* Blinking Cursor at bottom of log */}
        <div className="p-2 text-accent blink-cursor before:content-['$_']"></div>
      </div>
    </div>
  )
}
