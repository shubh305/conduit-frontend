"use client";

import { User as UserIcon, Shield } from "lucide-react"
import { useTheme, useThemeHelpers, useStudioLabels } from "@/features/theme/ThemeProvider"
import { getHeadingClasses } from "@/lib/theme-variants"
import { cn } from "@/lib/utils"
import { useAuth } from "@/features/auth/AuthProvider"
import { updateCurrentUser } from "@/features/auth/api"
import { User } from "@/features/auth/types"
import { ThemeCard } from "@/components/theme"


import { TerminalNanoLayout } from "./sections/TerminalNanoLayout"
import { ProfileSection } from "./sections/ProfileSection"
import { AccountSection } from "./sections/AccountSection"

import { useState, useEffect, useRef } from "react"
import { toast } from "sonner"

type SettingsTab = "profile" | "account"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [isSaving, setIsSaving] = useState(false);
  const { theme } = useTheme();
  const { getLabel } = useStudioLabels();
  const { isCyberCopy, isJournalCopy, isTerminalCopy, isTechieCopy } = useThemeHelpers();
  const { user, refreshUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<Partial<User>>({});

  const publicProfileTitle = getLabel("profile");
  const profileTabLabel = getLabel("profile");
  const accountTabLabel = getLabel("account_security");
  const changeAvatarLabel = getLabel("change_avatar");
  const saveChangesLabel = getLabel("save_changes");
  const savingText = getLabel("loading");
  const socialNetworksLabel = getLabel("social_networks");
  const accountSecurityTitle = getLabel("account_security");

  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName,
        tagline: user.tagline,
        location: user.location,
        bio: user.bio,
        avatar: user.avatar,
        email: user.email,
        socialLinks: user.socialLinks || {},
      });
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    try {
      if (activeTab === "profile") {
        await updateCurrentUser({
          displayName: formData.displayName,
          tagline: formData.tagline,
          location: formData.location,
          bio: formData.bio,
          avatar: formData.avatar,
          socialLinks: formData.socialLinks,
        });
        await refreshUser();
        toast.success(getLabel("profile_updated"));
      } else {
        toast.success(getLabel("settings_saved"));
      }
    } catch {
      toast.error(isCyberCopy ? "WRITE_ERROR" : "Save failed");
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: "profile", label: profileTabLabel, icon: UserIcon },
    { id: "account", label: accountTabLabel, icon: Shield },
  ] as const;

  if (!user) {
    return (
      <div className="p-8 font-mono text-foreground-subtle uppercase tracking-widest text-center mt-20">{`// AUTHORIZATION_REQUIRED...`}</div>
    );
  }

  // ---------------------------------------------------------
  // TERMINAL Layout
  // ---------------------------------------------------------
  if (isTerminalCopy) {
    return (
      <TerminalNanoLayout formData={formData} setFormData={setFormData} isSaving={isSaving} handleSave={handleSave} />
    );
  }

  // ---------------------------------------------------------
  // Standard Layout
  // ---------------------------------------------------------
  return (
    <div
      className={cn(
        "min-h-screen transition-all duration-500",
        isTechieCopy ? "bg-[#050608]" : isCyberCopy ? "bg-[#08090a]" : "bg-noir-bg",
      )}
    >
      {/* HEADER SECTION */}
      <div
        className={cn(
          "w-full pt-16 pb-32 px-6 md:px-12 transition-all duration-500",
          isTechieCopy
            ? "bg-[var(--bg-primary)] border-b border-[var(--bg-panel)]/50"
            : isCyberCopy || isTerminalCopy
              ? "bg-noir-panel/40 border-b border-accent/10"
              : isJournalCopy
                ? "bg-journal-paper border-b border-accent/5"
                : "bg-noir-panel border-b border-noir-border/30",
        )}
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
          <header className="relative max-w-2xl">
            <h1 className={cn("text-4xl md:text-5xl font-bold tracking-tighter mb-4", getHeadingClasses(theme))}>
              {activeTab === "profile" ? publicProfileTitle : accountSecurityTitle}
            </h1>
            <p
              className={cn(
                "text-base transition-colors opacity-70",
                isCyberCopy || isTerminalCopy || isTechieCopy ? "font-mono text-accent/60" : "text-foreground-subtle",
                isJournalCopy && "font-serif italic text-lg",
                isTechieCopy && "text-[var(--accent)]/50 tracking-wider uppercase text-[12px]",
              )}
            >
              {activeTab === "profile" ? getLabel("profile_desc_long") : getLabel("account_desc_long")}
            </p>

            {(isCyberCopy || isTechieCopy || isTerminalCopy) && (
              <div className="absolute -top-6 left-0 text-[10px] font-mono text-accent/40 uppercase tracking-[0.4em]">
                {isTechieCopy ? "IDENTITY_SYSPREP_v4.2" : isTerminalCopy ? "TTY.IDENT.v3" : "SYS.IDENTITY.v2"}
              </div>
            )}
          </header>

          {/* Module Label for Techie/Technical */}
          {(isTechieCopy || isTerminalCopy || isCyberCopy) && (
            <div className="hidden md:block py-2 px-6 border border-[var(--bg-panel)] bg-[var(--bg-primary)] text-[10px] font-mono text-accent/50 rounded-md tracking-widest backdrop-blur-xl">
              {isTechieCopy ? "MODULE::CONFIG_0x3F" : "[SYSTEM_ACTIVE]"}
            </div>
          )}
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 -mt-12 pb-24">
        <ThemeCard
          className={cn(
            "transition-all duration-300 relative overflow-hidden",
            "p-8 md:p-12 shadow-2xl backdrop-blur-sm",
            isTechieCopy && "border-white/5 bg-[var(--bg-primary)]/80 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]",
            isCyberCopy && "bg-noir-bg/90 border-accent/20",
            !isCyberCopy && !isTechieCopy && !isJournalCopy && !isTerminalCopy && "bg-noir-panel",
          )}
        >
          {/* Internal Tab Selector */}
          <div
            className={cn(
              "flex flex-wrap items-center gap-4 mb-12 border-b pb-6",
              isTechieCopy || isTerminalCopy || isCyberCopy ? "border-noir-border/10" : "border-noir-border/10",
              isTechieCopy && "border-[var(--bg-panel)]",
            )}
          >
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as SettingsTab)}
                className={cn(
                  "flex items-center gap-3 px-8 py-3 text-[11px] font-mono uppercase tracking-[0.2em] transition-all relative whitespace-nowrap",
                  activeTab === tab.id
                    ? isTechieCopy
                      ? "text-[var(--accent)] font-bold bg-[var(--bg-panel)]/50 shadow-[0_0_20px_rgba(var(--accent-rgb),0.05)] border border-[var(--bg-panel)] rounded-lg"
                      : isJournalCopy
                        ? "text-journal-ink bg-accent/5 rounded-xl italic font-serif"
                        : "text-accent font-bold bg-accent/5 rounded-full"
                    : "text-foreground-subtle hover:text-foreground hover:bg-noir-hover rounded-full",
                  (isCyberCopy || isTechieCopy || isTerminalCopy) && "rounded-none",
                )}
              >
                <tab.icon size={16} className={activeTab === tab.id ? "" : "opacity-30"} />
                {tab.label}
                {activeTab === tab.id && isTechieCopy && (
                  <span className="absolute -bottom-[25px] left-0 w-full h-0.5 bg-[var(--accent)] shadow-[0_0_15px_var(--accent)]" />
                )}
              </button>
            ))}
          </div>

          <div className="max-w-4xl">
            <form
              onSubmit={handleSave}
              className={cn("animate-in fade-in duration-500", isJournalCopy ? "space-y-6" : "space-y-10")}
            >
              {/* PROFILE SECTION */}
              {activeTab === "profile" && user && (
                <ProfileSection
                  user={user}
                  formData={formData}
                  setFormData={setFormData}
                  isSaving={isSaving}
                  fileInputRef={fileInputRef}
                  labels={{ publicProfileTitle, changeAvatarLabel, saveChangesLabel, savingText, socialNetworksLabel }}
                />
              )}

              {/* ACCOUNT SECTION */}
              {activeTab === "account" && user && <AccountSection user={user} />}
            </form>
          </div>
        </ThemeCard>
      </div>
    </div>
  );
}



