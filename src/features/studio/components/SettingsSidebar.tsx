"use client";

import { X, Pencil, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { TagInput } from "@/components/ui/tag-input";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useTheme, useThemeHelpers } from "@/features/theme/ThemeProvider";
import { CoverImageManager } from "./CoverImageManager";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import {
  getSettingsSidebarClasses,
  getSettingsHeaderClasses,
  getSettingsLabelClasses,
  getSettingsInputContainerClasses,
  getSettingsStatsGridClasses,
  getSettingsPublishButtonClasses,
  ThemeVariant,
} from "@/lib/theme-variants";

interface SettingsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  slug: string;
  tags: string[];
  featuredImage: string | null;
  featuredImageAttribution?: { name: string; url: string } | null;
  onUpdate: (updates: { slug?: string; tags?: string[]; featuredImage?: string | null; featuredImageAttribution?: { name: string; url: string } | null }) => void;
  tenantId?: string;
  postTitle?: string;
  authorUsername?: string;
  onPublish?: () => void;
  onSchedule?: (date: string) => void;
  scheduledAt?: string | null;
  isPublishing?: boolean;
  status?: string;
  readingTimeMinutes?: number;
  wordCount?: number;
  paragraphsCount?: number;
}

export function SettingsSidebar({
  isOpen,
  onClose,
  slug,
  tags,
  featuredImage,
  featuredImageAttribution,
  onUpdate,
  tenantId,
  postTitle,
  authorUsername,
  onPublish,
  onSchedule,
  scheduledAt,
  isPublishing,
  status,
  readingTimeMinutes,
  wordCount,
  paragraphsCount,
}: SettingsSidebarProps) {
  const { theme, config } = useTheme()
  const { isCyberCopy, isSakuraCopy, isJournalCopy, isTechieCopy } = useThemeHelpers()
  const [localSlug, setLocalSlug] = useState(slug)
  const [isEditingSlug, setIsEditingSlug] = useState(false)
  const [scheduleDate, setScheduleDate] = useState<string | null>(scheduledAt || null)

  useEffect(() => {

    if (status === "published") {
      setScheduleDate(null)
    } else if (scheduledAt) {
      setScheduleDate(scheduledAt)
    }
  }, [scheduledAt, status])

  useEffect(() => {
    setLocalSlug(slug)
  }, [slug])

  const handleSlugBlur = () => {
    const cleanSlug = localSlug
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "")

    setLocalSlug(cleanSlug)
    onUpdate({ slug: cleanSlug })
    setIsEditingSlug(false)
  }

  const regenerateSlug = useCallback(() => {
    if (!postTitle) return;
    const newSlug = postTitle
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    if (newSlug !== localSlug) {
      setLocalSlug(newSlug);
      onUpdate({ slug: newSlug });
    }
  }, [postTitle, localSlug, onUpdate]);

  useEffect(() => {
    if (!postTitle || !slug || isEditingSlug) return;

    const isRealTitle = postTitle.trim().toLowerCase() !== "untitled" && postTitle.trim().length > 0;

    if (isRealTitle) {
      regenerateSlug();
    }
  }, [postTitle, slug, regenerateSlug, isEditingSlug]);

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-sm z-[140] transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
      />

      <div className={cn(getSettingsSidebarClasses(theme), isOpen ? "translate-x-0" : "translate-x-full")}>
        <div
          className={cn(
            "flex items-center justify-between p-6 border-b",
            isTechieCopy ? "border-noir-border" : "border-noir-border",
          )}
        >
          <h2
            className={cn(
              getSettingsHeaderClasses(theme),
              config.fontFamily === "serif" && !isJournalCopy && "font-serif italic",
            )}
          >
            {isSakuraCopy
              ? "Draft Settings (下書きの設定)"
              : isJournalCopy
                ? "Entry Settings"
                : isTechieCopy
                  ? "CONFIG_PANEL"
                  : "Draft Settings"}
          </h2>
          <button
            onClick={onClose}
            className={cn(
              "transition-colors cursor-pointer",
              isTechieCopy ? "text-accent-secondary hover:text-accent" : "text-foreground/40 hover:text-accent",
            )}
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 md:px-6 py-6 pb-[120px] space-y-8 no-scrollbar">
          <div className="space-y-3">
            <label className={getSettingsLabelClasses(theme)}>
              {isSakuraCopy
                ? "Cover Image (カバー画像)"
                : isJournalCopy
                  ? "Featured Image"
                  : isTechieCopy
                    ? "VISUAL_DATA"
                    : "Cover Image"}
            </label>

            <CoverImageManager
              value={featuredImage}
              attribution={featuredImageAttribution}
              onChange={(url, attr) => onUpdate({ featuredImage: url, featuredImageAttribution: attr })}
              tenantId={tenantId}
              variant="sidebar"
            />
          </div>

          <div className="space-y-3">
            <label className={getSettingsLabelClasses(theme)}>
              {isSakuraCopy
                ? "Slug (スラッグ)"
                : isJournalCopy
                  ? "URL Slug"
                  : isTechieCopy
                    ? "RESOURCE_PATH"
                    : "Article Slug"}
            </label>

            <div className={getSettingsInputContainerClasses(theme, isEditingSlug)}>
              <span
                className={cn(
                  "pl-3 text-xs select-none",
                  isTechieCopy ? "text-accent-secondary" : "text-foreground/40",
                )}
              >
                /
              </span>
              <input
                type="text"
                value={localSlug}
                onChange={e => setLocalSlug(e.target.value)}
                onBlur={handleSlugBlur}
                readOnly={!isEditingSlug}
                autoFocus={isEditingSlug}
                onKeyDown={e => e.key === "Enter" && handleSlugBlur()}
                className={cn(
                  "flex-1 bg-transparent px-1 py-3 text-sm focus:outline-none transition-colors",
                  isTechieCopy ? "text-accent" : "text-foreground",
                  !isEditingSlug &&
                    (isTechieCopy ? "cursor-default text-accent-secondary" : "cursor-default text-foreground/40"),
                )}
              />
              <button
                onClick={() => (isEditingSlug ? handleSlugBlur() : setIsEditingSlug(true))}
                className={cn(
                  "p-3 transition-colors",
                  isTechieCopy ? "text-accent-secondary hover:text-accent" : "text-foreground-subtle hover:text-accent",
                )}
              >
                {isEditingSlug ? <Check size={16} /> : <Pencil size={16} />}
              </button>
            </div>

            <p className="text-[9px] text-foreground/40 font-mono uppercase tracking-tighter px-1">
              URL: /u/{authorUsername || "user"}/{localSlug}
            </p>

            {postTitle && !isEditingSlug && (
              <button
                onClick={regenerateSlug}
                className={cn(
                  "text-[9px] underline font-mono uppercase px-1",
                  isTechieCopy ? "text-accent-secondary hover:text-accent" : "text-foreground/60 hover:text-accent",
                )}
              >
                {isSakuraCopy ? "Reset to title (タイトルから生成)" : "Reset to match title"}
              </button>
            )}
          </div>

          <div className={getSettingsStatsGridClasses(theme)}>
            <div className="flex flex-col gap-1">
              <span className="text-[8px] text-foreground/40 uppercase tracking-wider font-bold whitespace-nowrap">
                Word count
              </span>
              <span
                className={cn(
                  "text-[10px] font-bold whitespace-nowrap",
                  isCyberCopy || isTechieCopy ? "font-mono" : "",
                  isTechieCopy && "text-accent",
                )}
              >
                {wordCount || 0} words
              </span>
            </div>
            <div
              className={cn(
                "flex flex-col gap-1 border-x px-2 justify-center",
                isTechieCopy ? "border-noir-border" : "border-noir-border/30",
              )}
            >
              <span className="text-[8px] text-foreground/40 uppercase tracking-wider font-bold whitespace-nowrap">
                Paragraphs
              </span>
              <span
                className={cn(
                  "text-[10px] font-bold whitespace-nowrap",
                  isCyberCopy || isTechieCopy ? "font-mono" : "",
                  isTechieCopy && "text-accent",
                )}
              >
                {paragraphsCount || 0} paras
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[8px] text-foreground/40 uppercase tracking-wider font-bold whitespace-nowrap">
                Read time
              </span>
              <span
                className={cn(
                  "text-[10px] font-bold whitespace-nowrap",
                  isCyberCopy || isTechieCopy ? "font-mono" : "",
                  isTechieCopy && "text-accent",
                )}
              >
                {readingTimeMinutes || 1} min{readingTimeMinutes !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <label className={getSettingsLabelClasses(theme)}>
              {isSakuraCopy ? "Tags (タグ)" : isJournalCopy ? "Topics" : "Tags"}
            </label>
            <TagInput tags={tags} onChange={newTags => onUpdate({ tags: newTags })} theme={theme as ThemeVariant} />
            <p className="text-[10px] text-foreground/40 italic">
              {isSakuraCopy
                ? "最大5つのタグを追加できます。"
                : isJournalCopy
                  ? "Add topics to help readers find your entry."
                  : "Add up to 5 tags to improve discoverability."}
            </p>
          </div>
        </div>

        <div
          className={cn(
            "p-6 border-t font-mono text-center text-[10px] space-y-4",
            isTechieCopy
              ? "bg-noir-bg border-noir-border text-accent-secondary"
              : "border-noir-border text-foreground/40 bg-noir-panel/50",
          )}
        >
          {status !== "published" && (
            <div className="space-y-3 pt-2 mb-4">
              <label className={cn(getSettingsLabelClasses(theme), "text-left mb-2")}>
                {isSakuraCopy ? "予約投稿 (オプション)" : "Schedule (Optional)"}
              </label>

              <DateTimePicker value={scheduleDate} onChange={setScheduleDate} disabled={isPublishing} />
              {scheduleDate && (
                <div className="text-left mt-1">
                  <button
                    onClick={() => setScheduleDate(null)}
                    className="text-[9px] text-foreground/40 hover:text-red-500 underline decoration-dotted transition-colors"
                  >
                    {isSakuraCopy ? "予約をクリア" : "Clear schedule"}
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center text-[10px] opacity-70 px-1">
              <span />
              {scheduleDate && <span className="text-accent">{isSakuraCopy ? "予約モード" : "SCHEDULE MODE"}</span>}
            </div>

            {(onPublish || onSchedule) && (
              <>
                <Button
                  onClick={() => {
                    if (scheduleDate && onSchedule && status !== "scheduled") {
                      onSchedule(scheduleDate);
                    } else if (scheduleDate && onSchedule && status === "scheduled") {
                      onSchedule(scheduleDate);
                    } else if (onPublish) {
                      onPublish();
                    }
                  }}
                  disabled={isPublishing}
                  className={getSettingsPublishButtonClasses(theme)}
                >
                  {isPublishing
                    ? isCyberCopy || isTechieCopy
                      ? "PROCESSING..."
                      : "Processing..."
                    : scheduleDate && status !== "scheduled"
                      ? isCyberCopy
                        ? "CONFIRM_TIMER"
                        : isTechieCopy
                          ? "CONFIRM_CRON"
                          : isSakuraCopy
                            ? "予約投稿する"
                            : "Schedule Post"
                      : status === "scheduled" && !scheduleDate
                        ? isSakuraCopy
                          ? "今すぐ公開"
                          : "Publish Now"
                        : status === "scheduled"
                          ? isSakuraCopy
                            ? "予約を更新"
                            : "Update Schedule"
                          : isCyberCopy
                            ? "INIT_TRANSMISSION"
                            : isTechieCopy
                              ? "DEPLOY_TO_PROD"
                              : isJournalCopy
                                ? "Publish Entry"
                                : "Publish Now"}
                </Button>

                {status === "scheduled" && onPublish && (
                  <button
                    onClick={onPublish}
                    disabled={isPublishing}
                    className="text-[10px] font-bold uppercase tracking-widest text-foreground/60 hover:text-accent transition-colors underline decoration-dotted mt-1"
                  >
                    {isSakuraCopy ? "今すぐ公開する" : "Publish immediately instead"}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
