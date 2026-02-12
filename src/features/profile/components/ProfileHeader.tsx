"use client";

import { User } from "@/features/auth/types";
import { Profile } from "@/features/profile/types";
import { useTheme, useThemeHelpers } from "@/features/theme/ThemeProvider";
import { getLabel } from "@/lib/theme/labels";
import { Button } from "@/components/ui/button";
import { Settings, MapPin, ShieldCheck, Globe, ExternalLink, Loader2 } from "lucide-react";
import { BrandIcon, BrandType } from "@/components/ui/brand-icon";
import Link from "next/link";
import Image from "next/image";
import { getMediaUrl, cn } from "@/lib/utils";
import { useFollowUser } from "../hooks/useFollowUser";

interface ProfileHeaderProps {
  user: User | Profile;
  isOwner?: boolean;
}

interface ExtendedProfile extends Partial<User & Profile> {
  website?: string;
  tagline?: string;
  socialLinks?: {
    website?: string;
    github?: string;
    twitter?: string;
    linkedin?: string;
    stackoverflow?: string;
    instagram?: string;
  };
  joinedAt?: string;
  image?: string;
  stats?: {
    followers: number;
    following: number;
    posts: number;
  };
}

export function ProfileHeader({ user, isOwner }: ProfileHeaderProps) {
  const { config, theme } = useTheme();
  const { isCyberCopy, isSakuraCopy, isRoninCopy, isOctaneCopy, isJournalCopy, isTerminalCopy, isTechieCopy } =
    useThemeHelpers();
  const profile = user as ExtendedProfile;

  const {
    isFollowing,
    followersCount: optimisticFollowers,
    isLoading,
    toggleFollow,
  } = useFollowUser({
    userId: user.id || "",
    initialIsFollowing: profile.isFollowing,
    initialFollowersCount: profile.stats?.followers || 0,
  });

  const displayFollowersCount = isOwner ? profile.stats?.followers || 0 : optimisticFollowers;
  const followingCount = profile.stats?.following || 0;

  const displayName = profile.displayName || profile.username || "User";
  const bio = profile.bio || getLabel("noBio", theme);
  const rawAvatar = profile.avatar || profile.image;
  const avatar = getMediaUrl(rawAvatar) || "";

  const { isVerified, isPro, location, tagline, socialLinks } = profile;

  const isClassic =
    !isTerminalCopy &&
    !isCyberCopy &&
    !isSakuraCopy &&
    !isRoninCopy &&
    !isOctaneCopy &&
    !isJournalCopy &&
    !isTechieCopy;

  // Render function for Follow Button
  const renderActionButton = () => {
    if (isOwner) {
      return (
        <Link href="/studio/settings">
          {isClassic ? (
            <div className="px-8 py-2.5 border border-noir-border hover:border-accent hover:bg-accent/5 text-foreground text-[10px] uppercase tracking-[0.2em] transition-all font-mono font-bold inline-block cursor-pointer">
              {getLabel("editProfileButton", theme)}
            </div>
          ) : (
            <Button
              variant="outline"
              className={cn(
                "h-9 uppercase tracking-widest gap-2 transition-all font-mono text-[10px]",
                isCyberCopy || isTechieCopy
                  ? "rounded-none border-accent bg-accent/5 text-accent hover:bg-accent hover:text-noir-bg shadow-[0_0_15px_rgba(var(--accent-rgb),0.2)]"
                  : isRoninCopy
                    ? "rounded-none border-b border-accent/50 text-accent hover:bg-accent/10"
                    : isOctaneCopy
                      ? "rounded-sm border-accent-warm bg-accent/5 text-accent hover:bg-accent/10"
                      : "rounded-full border-noir-border text-foreground-subtle hover:text-accent hover:border-accent hover:bg-noir-hover",
                isTechieCopy && "rounded-lg border-[var(--accent)]/30 hover:border-[var(--accent)] shadow-none",
              )}
            >
              <Settings size={14} /> {getLabel("editProfileButton", theme)}
            </Button>
          )}
        </Link>
      );
    }

    // Follow / Unfollow Button
    return (
      <Button
        onClick={toggleFollow}
        disabled={isLoading}
        className={cn(
          "transition-all uppercase text-[10px] tracking-[0.2em] font-black shadow-xl",
          isFollowing
            ? "bg-transparent border border-noir-border text-foreground hover:border-red-500 hover:text-red-500"
            : "bg-foreground text-noir-bg hover:bg-accent hover:shadow-accent/20",
          isClassic ? "px-10 h-10" : "h-9 px-6",
          (isCyberCopy || isTechieCopy) && "rounded-none",
          isTechieCopy &&
            isFollowing &&
            "border-[var(--accent)]/50 text-[var(--accent)] hover:border-red-500 hover:text-red-500",
          isTechieCopy && !isFollowing && "bg-[var(--accent)] text-black hover:bg-white",
          isLoading && "opacity-70 cursor-wait",
        )}
      >
        {isLoading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
        {isFollowing ? getLabel("unfollowButton", theme) : getLabel("followButton", theme)}
      </Button>
    );
  };

  // ---------------------------------------------------------
  // TERMINAL Layout
  // ---------------------------------------------------------
  if (isTerminalCopy) {
    return (
      <div className="font-mono text-xs md:text-sm text-foreground bg-black border border-accent p-6 mb-8 w-full shadow-[0_0_10px_rgba(74,246,38,0.1)]">
        <div className="mb-4 text-foreground-muted border-b border-accent/30 pb-2">$ finger {user.username}</div>

        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8">
          <div className="border border-accent/50 p-1 bg-black">
            {rawAvatar ? (
              <div className="relative w-full aspect-square grayscale contrast-125">
                <Image src={avatar} alt={user.username || "User"} fill className="object-cover opacity-80" />
                <div className="absolute inset-0 bg-[url('/images/grid.png')] opacity-20 pointer-events-none" />
              </div>
            ) : (
              <div className="w-full aspect-square flex items-center justify-center border border-dashed border-accent/30 text-accent/30">
                [NO_IMAGE]
              </div>
            )}
            <div className="text-center mt-2 text-[10px] text-accent font-bold">[UID: {user.id?.slice(0, 8)}]</div>
          </div>

          {/* Info Table */}
          <div className="space-y-2">
            <div className="grid grid-cols-[100px_1fr] gap-2">
              <span className="text-foreground-muted">Login:</span>
              <span className="text-accent font-bold">{user.username}</span>
            </div>
            <div className="grid grid-cols-[100px_1fr] gap-2">
              <span className="text-foreground-muted">Name:</span>
              <span className="text-accent">{displayName}</span>
            </div>
            <div className="grid grid-cols-[100px_1fr] gap-2">
              <span className="text-foreground-muted">Directory:</span>
              <span>/home/{user.username}</span>
            </div>
            <div className="grid grid-cols-[100px_1fr] gap-2">
              <span className="text-foreground-muted">Shell:</span>
              <span>/bin/zsh</span>
            </div>
            <div className="grid grid-cols-[100px_1fr] gap-2">
              <span className="text-foreground-muted">Last Login:</span>
              <span>{new Date().toDateString()}</span>
            </div>

            <div className="h-px bg-accent/20 my-4" />

            {/* Plan Info */}
            <div className="grid grid-cols-[100px_1fr] gap-2">
              <span className="text-foreground-muted">Plan:</span>
              <div className="flex gap-2">
                <span className={isPro ? "text-accent font-bold" : "text-foreground-subtle"}>
                  {getLabel("proLabel", theme)}
                </span>
                {isVerified && <span className="text-accent">[VERIFIED]</span>}
              </div>
            </div>

            {/* Bio */}
            <div className="grid grid-cols-[100px_1fr] gap-2">
              <span className="text-foreground-muted">Bio:</span>
              <span className="italic text-foreground-muted">&quot;{bio || "No description."}&quot;</span>
            </div>

            {/* Network / Social Links */}
            {socialLinks && Object.values(socialLinks).some(Boolean) && (
              <div className="grid grid-cols-[100px_1fr] gap-2 mt-4">
                <span className="text-foreground-muted">Network:</span>
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  {Object.entries(socialLinks).map(([key, value]) => {
                    if (!value) return null;
                    return (
                      <Link
                        key={key}
                        href={value}
                        target="_blank"
                        className="text-accent underline decoration-accent/30 hover:bg-accent hover:text-black hover:decoration-transparent transition-all"
                      >
                        {`[${key.toUpperCase()}]`}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="grid grid-cols-[100px_1fr] gap-2 mt-4">
              <span className="text-foreground-muted">Stats:</span>
              <div className="flex gap-4">
                <span>
                  {followingCount} <span className="text-foreground-subtle">following</span>
                </span>
                <span>
                  {displayFollowersCount} <span className="text-foreground-subtle">followers</span>
                </span>
              </div>
            </div>

            <div className="mt-6 flex items-start">
              {!isOwner && (
                <button
                  onClick={toggleFollow}
                  disabled={isLoading}
                  className={cn(
                    "bg-accent text-black px-3 py-1 text-xs font-bold hover:bg-white hover:text-black transition-colors uppercase disabled:opacity-50",
                    isFollowing &&
                      "bg-transparent text-accent border border-accent hover:bg-red-500 hover:text-black hover:border-red-500",
                  )}
                >
                  {isFollowing ? getLabel("unfollowButton", theme) : getLabel("followButton", theme)}
                </button>
              )}
              {isOwner && (
                <Link
                  href="/studio/settings"
                  className="bg-accent text-black px-3 py-1 text-xs font-bold hover:bg-white hover:text-black transition-colors"
                >
                  {getLabel("editProfileButton", theme)}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
  // ---------------------------------------------------------
  // Other Layouts
  // ---------------------------------------------------------
  if (isCyberCopy || isSakuraCopy || isRoninCopy || isOctaneCopy || isJournalCopy || isTechieCopy) {
    return (
      <div
        className={cn(
          "border p-6 mb-8 relative overflow-hidden group transition-all duration-500",
          "border-noir-border bg-noir-bg shadow-2xl",
          isSakuraCopy ? "rounded-3xl hover:shadow-accent/5" : "backdrop-blur-sm",
          isOctaneCopy && "border-l-4 border-l-accent-warm octane-texture",
          isJournalCopy ? "rounded-2xl bg-noir-panel border-accent/20 shadow-lg p-3 md:p-10 mb-4" : "p-2 md:p-10 mb-8",
          isTechieCopy && "border-white/5 bg-[var(--bg-primary)] p-4 md:p-6 mb-8 rounded-lg shadow-2xl",
        )}
      >
        {/* Decorative Elements */}
        {isCyberCopy && (
          <>
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-accent/50" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-accent/50" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-accent/50" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-accent/50" />
          </>
        )}
        {isTechieCopy && (
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        )}
        {isSakuraCopy && (
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/5 blur-[100px] rounded-full pointer-events-none" />
        )}

        <div
          className={cn(
            "flex flex-col md:flex-row relative z-10",
            isTechieCopy ? "items-center md:items-start gap-6" : "items-stretch gap-10",
            isJournalCopy && "gap-6",
          )}
        >
          {/* Avatar Area */}
          <div
            className={cn(
              "relative shrink-0 flex flex-col items-center",
              isTechieCopy && "p-8 bg-[var(--bg-panel)]/30 border-r border-white/5",
            )}
          >
            <div
              className={cn(
                "p-2 bg-noir-panel shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all",
                isCyberCopy || isTechieCopy
                  ? "w-24 h-24 md:w-32 md:h-32 border-2 border-noir-border"
                  : isRoninCopy
                    ? "w-24 h-24 md:w-32 md:h-32 border border-noir-border bg-noir-bg"
                    : isOctaneCopy
                      ? "w-24 h-24 md:w-32 md:h-32 border-2 border-accent-warm rounded-sm octane-avatar"
                      : isJournalCopy
                        ? "w-24 h-24 md:w-36 md:h-36 rounded-full border-2 border-accent/30 hover:border-accent"
                        : "w-24 h-24 md:w-36 md:h-36 rounded-full border border-noir-border hover:border-accent",
                isTechieCopy &&
                  "border-[var(--accent)]/30 p-1 shadow-[0_0_40px_rgba(var(--accent-rgb),0.1)] rounded-lg",
              )}
            >
              <div
                className={cn(
                  "w-full h-full relative overflow-hidden flex items-center justify-center bg-noir-bg",
                  isCyberCopy || isRoninCopy || isOctaneCopy || isTechieCopy
                    ? "border border-noir-border"
                    : "rounded-full",
                  isTechieCopy && "rounded-md",
                )}
              >
                {rawAvatar ? (
                  <Image
                    src={avatar}
                    alt={user.username}
                    fill
                    className={cn(
                      "object-cover transition-transform duration-700 group-hover:scale-110",
                      (isRoninCopy || isTechieCopy) && "ronin-image",
                      isOctaneCopy && "octane-image",
                    )}
                  />
                ) : (
                  <span
                    className={cn(
                      "font-bold text-accent/20 uppercase",
                      isCyberCopy || isTechieCopy
                        ? "text-4xl md:text-6xl font-mono"
                        : "text-5xl md:text-7xl font-serif italic",
                    )}
                  >
                    {user.username[0]}
                  </span>
                )}
              </div>
            </div>
            <div
              className={cn(
                "mt-3 border border-noir-border px-3 py-1 text-[9px] font-mono text-foreground-subtle uppercase tracking-widest bg-noir-bg/50",
                isSakuraCopy ? "rounded-full" : "",
                isTechieCopy && "rounded-md border-[var(--accent)]/20 text-[var(--accent)]/50 font-bold",
              )}
            >
              {getLabel("uidLabel", theme)}: {user.id?.slice(0, 8) || user.username.toUpperCase()}
            </div>
          </div>

          {/* Info Area */}
          <div
            className={cn(
              "flex-1 space-y-6 w-full pt-2",
              isTechieCopy && "p-8 bg-transparent text-center md:text-left",
            )}
          >
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h1
                  className={cn(
                    "text-2xl md:text-5xl font-black text-foreground mb-1 transition-all leading-tight",
                    isCyberCopy || isTechieCopy
                      ? "font-display uppercase tracking-tighter"
                      : isRoninCopy
                        ? "font-serif ronin-slash"
                        : isOctaneCopy
                          ? "font-sans uppercase tracking-tight"
                          : isJournalCopy
                            ? "font-serif"
                            : config.fontFamily === "serif"
                              ? "font-serif italic"
                              : "font-sans",
                    isTechieCopy && "text-[var(--accent)] drop-shadow-[0_0_15px_rgba(var(--accent-rgb),0.3)]",
                  )}
                >
                  {displayName}
                </h1>
                <div
                  className={cn(
                    "text-xs md:text-sm flex items-center gap-3 font-mono",
                    isCyberCopy || isTechieCopy ? "text-accent" : "text-foreground-subtle",
                  )}
                >
                  <span className={isSakuraCopy || isTechieCopy ? "text-accent" : ""}>@{user.username}</span>
                  {tagline && <span className="opacity-50 text-[10px]">| {tagline}</span>}
                  {isVerified && <ShieldCheck size={14} className="text-accent" />}
                  {isPro && (
                    <span
                      className={cn(
                        "px-1.5 py-0.5 text-[8px] border font-bold tracking-widest",
                        isCyberCopy || isTechieCopy
                          ? "bg-accent/10 text-accent border-accent/30"
                          : "bg-accent/10 text-accent px-1.5 py-0.5 text-[8px] border border-accent/30 font-bold tracking-widest",
                      )}
                    >
                      {getLabel("proLabel", theme)}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div>{renderActionButton()}</div>
            </div>

            {/* Social Links Bar */}
            {socialLinks && Object.values(socialLinks).some(Boolean) && (
              <div
                className={cn(
                  "flex items-center gap-4 md:gap-6 py-2 md:py-3 px-4 md:px-6 border bg-noir-bg/50 backdrop-blur-md w-full md:w-fit flex-wrap justify-center md:justify-start",
                  isCyberCopy || isTechieCopy ? "border-accent/20" : "border-noir-border rounded-xl md:rounded-2xl",
                  isTechieCopy && "rounded-lg bg-[var(--bg-panel)]/40 border-white/5",
                )}
              >
                {Object.entries(socialLinks).map(([key, value]) => {
                  if (!value) return null;
                  const isBrand = ["github", "twitter", "linkedin", "instagram"].includes(key);

                  if (isBrand) {
                    return (
                      <Link
                        key={key}
                        href={value}
                        target="_blank"
                        className="text-foreground-subtle hover:text-accent transition-all hover:scale-110"
                      >
                        <BrandIcon brand={key as BrandType} size={16} />
                      </Link>
                    );
                  }

                  const Icon =
                    {
                      website: Globe,
                      stackoverflow: ExternalLink,
                    }[key] || Globe;
                  return (
                    <Link
                      key={key}
                      href={value}
                      target="_blank"
                      className="text-foreground-subtle hover:text-accent transition-all hover:scale-110"
                    >
                      <Icon size={16} />
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Main Content Area : Standard Layout */}
            {!isTechieCopy && (
              <>
                {/* Bio */}
                <div
                  className={cn(
                    "max-h-40 overflow-y-auto pr-4 no-scrollbar border p-5 transition-all text-sm leading-relaxed",
                    isCyberCopy || isTechieCopy
                      ? "border-noir-border bg-black/20 font-mono text-foreground-subtle"
                      : isRoninCopy
                        ? "border-l-2 border-accent/30 bg-transparent pl-4 italic text-foreground-muted border-t-0 border-r-0 border-b-0 p-0"
                        : isJournalCopy
                          ? "border-accent/10 bg-accent/5 rounded-xl font-serif text-foreground-muted shadow-inner italic"
                          : "border-accent/10 bg-accent/5 rounded-2xl font-sans text-foreground-muted shadow-inner",
                    isTechieCopy &&
                      "bg-[var(--bg-panel)]/40 border-white/5 rounded-lg text-[13px] text-[var(--foreground-muted)]",
                  )}
                >
                  {isTechieCopy && (
                    <div className="text-[10px] text-[var(--accent)] font-bold mb-2 tracking-widest uppercase opacity-70">
                      Module::Description
                    </div>
                  )}
                  {bio}
                </div>

                <div className="flex flex-wrap items-center gap-8 pt-2">
                  <div className="flex items-center gap-2 text-[10px] font-mono text-foreground-subtle uppercase tracking-widest">
                    <span className={cn("text-foreground font-bold", isTechieCopy && "text-[var(--accent)]")}>
                      {followingCount}
                    </span>{" "}
                    {getLabel("followingLabel", theme)}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-foreground-subtle uppercase tracking-widest">
                    <span className={cn("text-foreground font-bold", isTechieCopy && "text-[var(--accent)]")}>
                      {displayFollowersCount}
                    </span>{" "}
                    {getLabel("followersLabel", theme)}
                  </div>
                  {location && (
                    <div className="flex items-center gap-2 text-[10px] font-mono text-foreground-subtle uppercase tracking-widest">
                      <MapPin size={10} className={cn("text-accent", isTechieCopy && "text-[var(--accent)]")} />{" "}
                      {location}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Expanded Layout (Techie) */}
        {isTechieCopy && (
          <>
            <div className="w-full bg-[var(--bg-panel)]/40 border border-white/5 rounded-lg p-4 md:p-6 text-sm text-[var(--foreground-muted)] font-mono leading-relaxed relative group mt-6">
              <div className="text-[10px] text-[var(--accent)] font-bold mb-2 tracking-widest uppercase opacity-70 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full animate-pulse" />
                Module::Description
              </div>
              {bio}
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-8 border-t border-white/5 pt-4">
              <div className="flex items-center gap-2 text-[10px] font-mono text-foreground-subtle uppercase tracking-widest group cursor-default">
                <span className="text-[var(--accent)] font-bold text-sm group-hover:scale-110 transition-transform block">
                  {followingCount}
                </span>
                {getLabel("followingLabel", theme)}
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-foreground-subtle uppercase tracking-widest group cursor-default">
                <span className="text-[var(--accent)] font-bold text-sm group-hover:scale-110 transition-transform block">
                  {displayFollowersCount}
                </span>
                {getLabel("followersLabel", theme)}
              </div>
              {location && (
                <div className="flex items-center gap-2 text-[10px] font-mono text-foreground-subtle uppercase tracking-widest ml-auto">
                  <MapPin size={10} className="text-[var(--accent)]" /> {location}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  }

  // ---------------------------------------------------------
  // Classic Row Layout
  // ---------------------------------------------------------
  return (
    <div className="mb-20 max-w-6xl mx-auto px-2 md:px-6">
      <div className="flex flex-col-reverse md:flex-row justify-between items-start gap-12 pt-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="flex-1 space-y-8 w-full">
          <div>
            <h1
              className={cn(
                "text-3xl md:text-6xl font-black tracking-tighter text-foreground mb-4 md:mb-2 leading-tight",
                config.fontFamily === "serif"
                  ? "font-serif italic"
                  : config.fontFamily === "mono"
                    ? "font-mono tracking-tight"
                    : "font-sans",
              )}
            >
              {displayName}
            </h1>
            <div className="flex items-center gap-4 text-foreground-subtle text-sm font-mono tracking-widest uppercase">
              <span className="text-accent font-bold">@{user.username}</span>
              {tagline && <span className="opacity-50">/ {tagline}</span>}
              {isVerified && <ShieldCheck size={16} className="text-accent" />}
            </div>
          </div>

          {/* Social Links Bar */}
          {socialLinks && Object.values(socialLinks).some(Boolean) && (
            <div className="flex flex-wrap items-center gap-6 md:gap-8 py-4 border-t border-b border-noir-border w-full md:w-fit transition-all justify-center md:justify-start">
              {Object.entries(socialLinks).map(([key, value]) => {
                if (!value) return null;
                const isBrand = ["github", "twitter", "linkedin", "instagram"].includes(key);

                if (isBrand) {
                  return (
                    <Link key={key} href={value} target="_blank">
                      <BrandIcon
                        brand={key as BrandType}
                        size={18}
                        className="text-foreground-subtle hover:text-accent transition-all hover:scale-125"
                      />
                    </Link>
                  );
                }

                const Icon =
                  {
                    website: Globe,
                    stackoverflow: ExternalLink,
                  }[key] || Globe;
                return (
                  <Link key={key} href={value} target="_blank">
                    <Icon
                      size={18}
                      className="text-foreground-subtle hover:text-accent transition-all hover:scale-125"
                    />
                  </Link>
                );
              })}
            </div>
          )}

          {/* Bio */}
          <div className="max-h-60 overflow-y-auto pr-10 no-scrollbar group">
            <p
              className={cn(
                "text-xl text-foreground-muted leading-relaxed border-l-4 border-accent/20 pl-8 transition-all group-hover:border-accent italic",
                config.fontFamily === "serif"
                  ? "font-serif"
                  : config.fontFamily === "mono"
                    ? "font-mono not-italic text-sm"
                    : "font-sans",
              )}
            >
              {bio}
            </p>
          </div>

          <div className="flex flex-wrap gap-12 py-6 border-t border-b border-noir-border">
            <div className="text-[10px] uppercase tracking-[0.3em] font-mono">
              <span className="text-foreground font-black text-base mr-3">{followingCount}</span>
              <span className="text-foreground-subtle">{getLabel("followingLabel", theme)}</span>
            </div>
            <div className="text-[10px] uppercase tracking-[0.3em] font-mono">
              <span className="text-foreground font-black text-base mr-3">{displayFollowersCount}</span>
              <span className="text-foreground-subtle">{getLabel("followersLabel", theme)}</span>
            </div>
          </div>

          <div className="flex items-center gap-6 pt-6">{renderActionButton()}</div>
        </div>

        <div className="shrink-0 group">
          <div
            className={cn(
              "w-40 h-40 md:w-56 md:h-56 relative bg-noir-panel border border-noir-border transition-all duration-500 overflow-hidden shadow-2xl group-hover:shadow-accent/10",
              !isCyberCopy ? "rounded-full" : "rounded-none",
            )}
          >
            {rawAvatar ? (
              <Image
                src={avatar}
                alt={user.username}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-90 group-hover:opacity-100"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-6xl md:text-8xl font-black text-accent/10 font-serif italic uppercase transition-all group-hover:text-accent/20 group-hover:scale-110">
                  {user.username[0]}
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-tr from-noir-bg/40 to-transparent pointer-events-none transition-opacity group-hover:opacity-0" />
          </div>
        </div>
      </div>
    </div>
  );
}
