"use client";

import { Button } from "@/components/ui/button";
import { X, Check, Image as ImageIcon, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { UserBlog } from "./OnboardingLanding";
import { cn } from "@/lib/utils";
import { useTheme, useThemeHelpers, useStudioLabels } from "@/features/theme/ThemeProvider"
import { createTenant } from "@/features/blog/api";
import { toast } from "sonner";
import { handleApiError } from "@/lib/error-utils";
import { useAuth } from "@/features/auth/AuthProvider";
import { uploadFile } from "@/features/media/api";
import { ThemeVariant, getHeadingClasses } from "@/lib/theme-variants"
import { fetchApi } from "@/lib/api-client";

interface CreateBlogModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (blog: UserBlog) => void;
}

export function CreateBlogModal({ isOpen, onClose, onCreate }: CreateBlogModalProps) {
  const { theme } = useTheme()
  const { isCyberCopy, isSakuraCopy, isRoninCopy, isOctaneCopy, isJournalCopy, isTerminalCopy } = useThemeHelpers()
  const { refreshUser } = useAuth();
  const { getLabel } = useStudioLabels()
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [isSubdomainAvailable, setIsSubdomainAvailable] = useState<boolean | null>(null);
  const [logo, setLogo] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { url } = await uploadFile(file);
      setLogo(url);
      toast.success(getLabel("logo_uploaded_success"))
    } catch (error) {
      handleApiError(error, "Failed to upload logo");
    } finally {
      setIsUploading(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);

    if (!subdomain || subdomain === name.toLowerCase().replace(/[^a-z0-9]/g, "")) {
      setSubdomain(newName.toLowerCase().replace(/[^a-z0-9]/g, ""));
    }
  };

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!subdomain) {
        setIsSubdomainAvailable(null);
      } else {
        if (subdomain.length < 3) {
          setIsSubdomainAvailable(false);
          return;
        }
        try {
          const data = await fetchApi<{ available: boolean }>(`/tenants/check-slug?slug=${subdomain}`);
          setIsSubdomainAvailable(data.available);
        } catch (e) {
          console.error("Failed to check slug", e);
          setIsSubdomainAvailable(false);
        }
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [subdomain]);

  const handleSubmit = async () => {
    setIsCreating(true);
    try {
      const { tenant } = await createTenant({
        name,
        slug: subdomain,
        theme,
        logo,
        description,
      });

      const newBlog: UserBlog = {
        id: tenant.id,
        name: tenant.name,
        subdomain: tenant.slug,
        logo: tenant.logo || `https://api.dicebear.com/7.x/identicon/svg?seed=${tenant.slug}`,
        postsCount: 0,
      };

      toast.success(getLabel("site_created_success"))
      await refreshUser();
      onCreate(newBlog);
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create blog. Slug might be taken.");
    } finally {
      setIsCreating(false);
    }
  };

  if (!isOpen) return null;

  // --- TERMINAL MODE ---
  if (isTerminalCopy) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-noir-bg/90 backdrop-blur-sm">
        <div className="w-full max-w-2xl border border-accent bg-noir-bg shadow-[0_0_30px_rgba(var(--accent-rgb),0.2)] font-mono text-sm text-accent">
          {/* Header */}
          <div className="bg-accent text-black p-2 font-bold flex justify-between">
            <span>{getLabel("create_site_title")}</span>
            <button onClick={onClose} className="hover:bg-noir-bg hover:text-accent px-1">
              [X]
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-[150px_1fr] items-center gap-4">
              <label className="text-right">{getLabel("site_name_label")}</label>
              <input
                value={name}
                onChange={handleNameChange}
                className="bg-noir-bg border-b border-accent text-foreground outline-none focus:bg-accent/10 px-2 py-1 uppercase"
                placeholder="ENTER_NAME"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-[150px_1fr] items-center gap-4">
              <label className="text-right">{getLabel("site_description_label")}</label>
              <input
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="bg-noir-bg border-b border-accent text-foreground outline-none focus:bg-accent/10 px-2 py-1"
                placeholder="ENTER_DESC"
              />
            </div>

            <div className="grid grid-cols-[150px_1fr] items-center gap-4">
              <label className="text-right">{getLabel("site_handle_label")}</label>
              <div className="flex items-center">
                <span className="text-accent/50">/mnt/</span>
                <input
                  value={subdomain}
                  onChange={e => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  className="bg-noir-bg border-b border-accent text-accent outline-none focus:bg-accent/10 px-2 py-1 w-full"
                  placeholder="slug"
                />
              </div>
            </div>

            <div className="pl-[166px] min-h-[20px]">
              {isSubdomainAvailable === null && subdomain.length > 0 && (
                <span className="animate-pulse">Checking availability...</span>
              )}
              {isSubdomainAvailable === true && (
                <span className="text-green-500">{getLabel("available")} Mount point available.</span>
              )}
              {isSubdomainAvailable === false && (
                <span className="text-red-500">{getLabel("in_use")} Mount point conflict.</span>
              )}
            </div>

            <div className="grid grid-cols-[150px_1fr] items-start gap-4">
              <label className="text-right pt-2">ICON DATA:</label>
              <div className="flex gap-4">
                <div className="w-16 h-16 border border-accent border-dashed flex items-center justify-center relative hover:bg-accent/10 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    disabled={isUploading}
                  />
                  {logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={logo} alt="" className="w-full h-full object-cover grayscale" />
                  ) : (
                    <span className="text-2xl text-accent/50">+</span>
                  )}
                </div>
                <div className="text-xs text-accent/50 pt-2">
                  {isUploading ? "UPLOADING_STREAM..." : "DRAG_DROP OR CLICK"}
                  <br />
                  MAX: 2MB
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-accent/30 flex justify-end gap-4">
            <button onClick={onClose} className="px-4 py-2 hover:bg-red-900/50 hover:text-red-500 transition-colors">
              {getLabel("retreat")}
            </button>
            <button
              onClick={handleSubmit}
              disabled={!name || !subdomain || !isSubdomainAvailable || isCreating}
              className={cn(
                "px-6 py-2 bg-accent text-black font-bold hover:bg-white transition-colors",
                (!name || !subdomain || !isSubdomainAvailable || isCreating) &&
                  "opacity-50 cursor-not-allowed bg-accent/20 text-accent",
              )}
            >
              {isCreating ? "INITIALIZING..." : "[ EXECUTE ]"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300",
        isSakuraCopy
          ? "bg-white/60 backdrop-blur-md"
          : isJournalCopy
            ? "bg-journal-paper/90 backdrop-blur-sm"
            : "bg-black/80 backdrop-blur-md",
      )}
    >
      <div
        className={cn(
          "w-full max-w-2xl relative overflow-hidden transition-all duration-500",
          "border shadow-2xl",
          isSakuraCopy
            ? "rounded-3xl bg-noir-panel border-noir-border"
            : isRoninCopy
              ? "rounded-sm bg-noir-bg border-accent/20"
              : isOctaneCopy
                ? "rounded-sm bg-noir-bg border-accent/40 shadow-accent/5"
                : isJournalCopy
                  ? "rounded-2xl bg-noir-panel border-accent/20 shadow-2xl"
                  : "rounded-none bg-noir-bg border-noir-border",
        )}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-foreground-subtle hover:text-accent transition-colors z-10 cursor-pointer"
        >
          <X size={24} />
        </button>

        <div className="p-8 md:p-12 lg:p-16">
          <h2
            className={cn(
              "text-3xl font-black mb-10 transition-colors tracking-widest",
              isJournalCopy ? "capitalize" : "uppercase",
              getHeadingClasses(theme as ThemeVariant),
            )}
          >
            {getLabel("create_site_title")}
          </h2>

          <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            {/* Form Side */}
            <div className="flex-1 space-y-8">
              <div className="group">
                <label
                  className={cn(
                    "block mb-2 font-mono text-[10px] uppercase tracking-[0.3em] transition-colors",
                    isCyberCopy
                      ? "text-accent/50 group-focus-within:text-accent"
                      : "text-foreground-subtle group-focus-within:text-foreground",
                  )}
                >
                  {getLabel("site_name_label")}
                </label>
                <input
                  value={name}
                  onChange={handleNameChange}
                  placeholder={getLabel("site_name_placeholder")}
                  className={cn(
                    "w-full outline-none transition-all py-3 shadow-inner",
                    "border-b border-noir-border focus:border-accent text-foreground font-bold text-lg",
                    isRoninCopy ? "placeholder:text-accent/50" : "placeholder:text-foreground-subtle/20",
                    isJournalCopy
                      ? "font-serif h-12 text-xl border border-accent/20 rounded-lg px-4 bg-noir-hover/20"
                      : "px-4 bg-noir-panel",
                    isCyberCopy ? "font-mono h-12" : isRoninCopy ? "font-serif h-12 text-2xl" : "font-sans h-10",
                  )}
                  autoFocus
                />
              </div>

              <div className="group">
                <label
                  className={cn(
                    "block mb-2 font-mono text-[10px] uppercase tracking-[0.3em] transition-colors",
                    isCyberCopy
                      ? "text-accent/50 group-focus-within:text-accent"
                      : "text-foreground-subtle group-focus-within:text-foreground",
                  )}
                >
                  {getLabel("site_description_label")}
                </label>
                <input
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder={getLabel("site_description_placeholder")}
                  className={cn(
                    "w-full outline-none transition-all py-3 shadow-inner",
                    "border-b border-noir-border focus:border-accent text-foreground font-bold text-lg",
                    isRoninCopy ? "placeholder:text-accent/50" : "placeholder:text-foreground-subtle/20",
                    isJournalCopy
                      ? "font-serif h-12 text-sm border border-accent/20 rounded-lg px-4 bg-noir-hover/20"
                      : "px-4 bg-noir-panel",
                    isCyberCopy
                      ? "font-mono h-12 text-sm"
                      : isRoninCopy
                        ? "font-serif h-12 text-lg"
                        : "font-sans h-10 text-sm",
                  )}
                />
              </div>

              <div className="group">
                <label
                  className={cn(
                    "block mb-2 font-mono text-[10px] uppercase tracking-[0.3em] transition-colors",
                    isCyberCopy
                      ? "text-accent/50 group-focus-within:text-accent"
                      : "text-foreground-subtle group-focus-within:text-foreground",
                  )}
                >
                  {getLabel("site_handle_label")}
                </label>
                <p className="text-[10px] text-foreground-subtle mb-4 font-mono uppercase tracking-[0.1em]">
                  {getLabel("site_handle_desc")}
                </p>

                <div
                  className={cn(
                    "flex items-center overflow-hidden transition-all border shadow-inner",
                    "border-noir-border focus-within:border-accent",
                    isSubdomainAvailable === true && "border-accent/40",
                    isCyberCopy || isOctaneCopy
                      ? "rounded-none h-14 px-4 border-accent/20 bg-noir-panel"
                      : isJournalCopy
                        ? "rounded-lg h-12 px-4 border-accent/20 bg-noir-hover/20"
                        : "rounded-xl h-12 px-5 bg-noir-panel",
                  )}
                >
                  <input
                    value={subdomain}
                    onChange={e => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-9-]/g, ""))}
                    className={cn(
                      "bg-transparent border-none text-foreground w-full h-full focus:ring-0 outline-none font-mono text-sm font-bold",
                      isRoninCopy ? "placeholder:text-accent/50" : "placeholder:text-foreground-subtle/20",
                    )}
                    placeholder="frequency-id"
                  />
                  <span className="text-foreground-subtle font-mono text-[10px] tracking-widest border-l border-noir-border pl-4 ml-4 whitespace-nowrap opacity-60">
                    .octanebrew.dev
                  </span>
                </div>

                {isSubdomainAvailable === true && (
                  <div className="mt-3 flex items-center gap-2 text-accent font-mono text-[9px] uppercase tracking-widest animate-in fade-in slide-in-from-left-2 transition-all">
                    <Check size={12} className="stroke-[3px]" />
                    {">> "}
                    {getLabel("available")}
                  </div>
                )}
                {isSubdomainAvailable === false && subdomain.length >= 3 && (
                  <div className="mt-3 flex items-center gap-2 text-red-500 font-mono text-[9px] uppercase tracking-widest animate-pulse">
                    <X size={12} className="stroke-[3px]" />
                    {">> "}
                    {getLabel("in_use")}
                  </div>
                )}
              </div>
            </div>

            {/* Visual Side */}
            <div className="w-full md:w-48 flex flex-row md:flex-col items-center justify-start gap-6 md:gap-0">
              <div
                className={cn(
                  "w-24 h-24 md:w-36 md:h-36 flex items-center justify-center mb-0 md:mb-6 relative overflow-hidden group cursor-pointer transition-all border shadow-2xl",
                  "bg-noir-panel border-noir-border hover:border-accent",
                  isCyberCopy
                    ? "rounded-none"
                    : isJournalCopy
                      ? "rounded-xl border-accent/20 bg-journal-paper shadow-inner"
                      : "rounded-3xl",
                )}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 z-10 cursor-pointer"
                  disabled={isUploading}
                />
                {logo || name ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={logo || `https://api.dicebear.com/7.x/identicon/svg?seed=${subdomain || "temp"}`}
                    alt="Preview"
                    className={cn(
                      "w-full h-full object-cover transition-all duration-700",
                      isUploading ? "scale-110 blur-sm brightness-50" : "group-hover:scale-110",
                    )}
                  />
                ) : (
                  <ImageIcon className="text-foreground-subtle/20" size={48} />
                )}
                <div
                  className={cn(
                    "absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-[9px] font-mono font-black uppercase tracking-[0.2em] bg-noir-bg/60 text-foreground backdrop-blur-[2px]",
                    isUploading && "opacity-100 bg-noir-bg/80",
                  )}
                >
                  {isUploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 size={16} className="animate-spin text-accent" />
                      <span>{getLabel("loading")}</span>
                    </div>
                  ) : (
                    "Upload Icon"
                  )}
                </div>
              </div>
              <div className="text-left md:text-center space-y-1">
                <p className="text-foreground font-bold font-mono uppercase text-[10px] tracking-widest">Icon</p>
                <p className="text-[10px] text-foreground-subtle font-mono uppercase tracking-tighter">
                  Recommended: 512x512px
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          className={cn(
            "p-8 md:px-12 md:pb-12 flex justify-end items-center gap-6 bg-noir-panel/50 backdrop-blur-md",
            isJournalCopy && "bg-noir-hover/10 border-t border-accent/10",
          )}
        >
          <Button
            variant="ghost"
            onClick={onClose}
            className={cn(
              "font-mono uppercase tracking-[0.2em] transition-all text-[10px]",
              isCyberCopy || isOctaneCopy ? "rounded-none" : "rounded-full",
              isJournalCopy && "font-serif italic hover:bg-journal-ink-muted/5 rounded-lg text-foreground",
              isSakuraCopy && "text-foreground",
            )}
          >
            {getLabel("retreat")}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!name || !subdomain || !isSubdomainAvailable || isCreating}
            className={cn(
              "h-12 px-12 transition-all font-mono uppercase font-black tracking-[0.2em] text-[10px] shadow-xl",
              isCyberCopy
                ? "bg-accent text-noir-bg hover:brightness-110 rounded-none"
                : isRoninCopy
                  ? "bg-accent/20 border border-accent text-accent hover:bg-accent hover:text-noir-bg rounded-none"
                  : isOctaneCopy
                    ? "bg-accent text-noir-bg hover:bg-accent/90 rounded-none border border-accent font-bold"
                    : isJournalCopy
                      ? "bg-accent text-noir-bg hover:bg-accent-secondary rounded-xl shadow-md hover:shadow-lg font-serif italic border-none h-12"
                      : "bg-foreground text-noir-bg hover:bg-accent rounded-full",
            )}
          >
            {isCreating ? getLabel("loading") : getLabel("new_publication_btn")}
          </Button>
        </div>
      </div>
    </div>
  );
}

