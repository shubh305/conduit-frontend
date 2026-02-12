"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ThemedButton } from "@/components/ui/themed-button";
import { Input } from "@/components/ui/input";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { useThemeHelpers, useStudioLabels } from "@/features/theme/ThemeProvider";
import { cn, getMediaUrl } from "@/lib/utils";
import { User } from "@/features/auth/types";
import { uploadFile } from "@/features/upload/api";

interface ProfileSectionProps {
  user: User;
  formData: Partial<User>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<User>>>;
  isSaving: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  labels: {
    publicProfileTitle: string;
    changeAvatarLabel: string;
    saveChangesLabel: string;
    savingText: string;
    socialNetworksLabel: string;
  };
}

export function ProfileSection({
  user,
  formData,
  setFormData,
  isSaving,
  fileInputRef,
  labels,
}: ProfileSectionProps) {
  const { isCyberCopy, isJournalCopy, isTerminalCopy, isTechieCopy } = useThemeHelpers();
  const { getLabel } = useStudioLabels();


  const techieInputClasses = "rounded-lg border-[var(--accent)]/20 bg-black/40 font-mono focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/20 hover:bg-black/60 transition-all duration-200";

  return (
    <div className={cn(isJournalCopy ? "space-y-6" : "space-y-10")}>
      <div className="space-y-4">
        {/* Avatar */}
        <div className="flex items-center gap-6">
          <div
            className="w-20 h-20 bg-noir-hover border border-noir-border flex items-center justify-center overflow-hidden relative group"
            style={{
              borderRadius: isCyberCopy || isTechieCopy || isTerminalCopy ? "0" : "var(--theme-radius-xl, 16px)",
            }}
          >
            {formData.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={getMediaUrl(formData.avatar)} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-bold text-foreground-subtle">{user.username[0]?.toUpperCase()}</span>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async e => {
                const file = e.target.files?.[0];
                if (!file) return;

                const toastId = toast.loading("Uploading avatar...");
                try {
                  const { url } = await uploadFile(file);
                  setFormData(prev => ({ ...prev, avatar: url }));
                  toast.success("Avatar uploaded", { id: toastId });
                } catch (err) {
                  console.error(err);
                  toast.error("Failed to upload avatar", { id: toastId });
                }
              }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "font-mono text-[10px] uppercase tracking-widest",
                isTechieCopy &&
                  "border-[var(--accent)]/30 text-[var(--accent)] hover:bg-[var(--accent)] hover:text-black",
                (isCyberCopy || isTerminalCopy) &&
                  "border-accent/40 text-accent hover:bg-accent hover:text-noir-bg rounded-none",
              )}
            >
              {labels.changeAvatarLabel}
            </Button>
            <span className="text-[10px] font-mono text-foreground-subtle opacity-50 tracking-wider">
              MAX 5MB. JPG/PNG.
            </span>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label
              className={cn(
                "text-[10px] uppercase tracking-widest font-mono",
                isCyberCopy || isTerminalCopy || isTechieCopy ? "text-accent/50 font-bold" : "text-foreground-subtle",
                isJournalCopy && "font-serif italic text-sm text-journal-ink/60",
              )}
            >
              {getLabel("display_name")}
            </label>
            <Input
              value={formData.displayName || ""}
              onChange={e => setFormData({ ...formData, displayName: e.target.value })}
              className={cn(
                "bg-transparent border-noir-border transition-all focus:border-accent",
                isCyberCopy || isTerminalCopy
                  ? "rounded-none font-mono"
                  : isJournalCopy
                    ? "rounded-lg border-accent/20 bg-journal-parchment/10 font-serif italic"
                    : isTechieCopy
                      ? techieInputClasses
                      : "rounded-xl",
              )}
            />
          </div>
          <div className="space-y-2">
            <label
              className={cn(
                "text-[10px] uppercase tracking-widest font-mono",
                isCyberCopy || isTerminalCopy || isTechieCopy ? "text-accent/50 font-bold" : "text-foreground-subtle",
                isJournalCopy && "font-serif italic text-sm text-journal-ink/60",
              )}
            >
              {getLabel("tagline")}
            </label>
            <Input
              placeholder="e.g. Writer & Creator"
              value={formData.tagline || ""}
              onChange={e => setFormData({ ...formData, tagline: e.target.value })}
              className={cn(
                "bg-transparent border-noir-border transition-all focus:border-accent",
                isCyberCopy || isTerminalCopy
                  ? "rounded-none font-mono"
                  : isJournalCopy
                    ? "rounded-lg border-accent/20 bg-journal-parchment/10 font-serif italic"
                    : isTechieCopy
                      ? techieInputClasses
                      : "rounded-xl",
              )}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            className={cn(
              "text-[10px] uppercase tracking-widest font-mono",
              isCyberCopy || isTerminalCopy || isTechieCopy ? "text-accent/50 font-bold" : "text-foreground-subtle",
              isJournalCopy && "font-serif italic text-sm text-journal-ink/60",
            )}
          >
            {getLabel("location")}
          </label>
          <Input
            placeholder="e.g. Tokyo, Japan"
            value={formData.location || ""}
            onChange={e => setFormData({ ...formData, location: e.target.value })}
            className={cn(
              "bg-transparent border-noir-border transition-all focus:border-accent",
              isCyberCopy || isTerminalCopy
                ? "rounded-none font-mono"
                : isJournalCopy
                  ? "rounded-lg border-accent/20 bg-journal-parchment/10 font-serif italic"
                  : isTechieCopy
                    ? techieInputClasses
                    : "rounded-xl",
            )}
          />
        </div>

        <div className="space-y-2">
          <label
            className={cn(
              "text-[10px] uppercase tracking-widest font-mono",
              isCyberCopy || isTerminalCopy || isTechieCopy ? "text-accent/50 font-bold" : "text-foreground-subtle",
              isJournalCopy && "font-serif italic text-sm text-journal-ink/60",
            )}
          >
            {getLabel("bio")}
          </label>
          <textarea
            className={cn(
              "flex w-full min-h-[120px] border px-4 py-3 text-sm transition-all outline-none",
              "bg-transparent border-noir-border text-foreground focus:border-accent",
              isCyberCopy || isTerminalCopy
                ? "font-mono no-scrollbar rounded-none"
                : isJournalCopy
                  ? "rounded-lg border-accent/20 bg-journal-parchment/10 font-serif italic"
                  : isTechieCopy
                    ? techieInputClasses
                    : "rounded-xl font-sans",
            )}
            style={{
              borderRadius:
                isCyberCopy || isTerminalCopy
                  ? "0"
                  : isJournalCopy
                    ? "8px"
                    : isTechieCopy
                      ? "10px"
                      : "var(--theme-radius-xl, 12px)",
            }}
            value={formData.bio || ""}
            onChange={e => setFormData({ ...formData, bio: e.target.value })}
          />
        </div>

        {/* Social Links Sub-section */}
        <div
          className={cn(
            "space-y-6 pt-10 border-t",
            isJournalCopy ? "border-accent/10" : "border-noir-border/30",
            (isTechieCopy || isTerminalCopy || isCyberCopy) && "border-white/5",
          )}
        >
          <h3
            className={cn(
              "text-[10px] font-bold uppercase tracking-[0.3em] font-mono",
              isCyberCopy || isTerminalCopy || isTechieCopy ? "text-accent" : "text-foreground-subtle",
              isJournalCopy && "font-serif italic text-lg text-journal-ink tracking-normal opacity-80",
            )}
          >
            {labels.socialNetworksLabel}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {(["linkedin", "github", "twitter", "website"] as const).map(key => (
              <div key={key} className="space-y-2">
                <label
                  className={cn(
                    "text-[9px] uppercase font-mono tracking-widest",
                    isCyberCopy || isTerminalCopy || isTechieCopy ? "text-accent/40" : "text-foreground-subtle",
                    isJournalCopy && "font-serif italic tracking-normal text-xs text-journal-ink/60",
                  )}
                >
                  {key}
                </label>
                <Input
                  placeholder={key === "website" ? "https://yourpage.com" : `https://${key}.com/...`}
                  value={formData.socialLinks?.[key] || ""}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      socialLinks: { ...(prev.socialLinks || {}), [key]: e.target.value },
                    }))
                  }
                  className={cn(
                    "h-10 text-xs bg-transparent border-noir-border transition-all focus:border-accent",
                    isCyberCopy || isTerminalCopy
                      ? "rounded-none font-mono"
                      : isJournalCopy
                        ? "rounded-lg border-accent/20 bg-journal-parchment/10 font-serif italic"
                        : isTechieCopy
                          ? techieInputClasses
                          : "rounded-xl",
                  )}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4 flex justify-end">
          <ThemedButton type="submit" disabled={isSaving}>
            <Save size={16} className="mr-2" />
            {isSaving ? labels.savingText : labels.saveChangesLabel}
          </ThemedButton>
        </div>
      </div>
    </div>
  );
}
