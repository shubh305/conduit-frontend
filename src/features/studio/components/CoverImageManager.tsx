"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Search, Trash2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useThemeHelpers } from "@/features/theme/ThemeProvider";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { UnsplashSelector } from "./UnsplashSelector";
import Image from "next/image";
import { uploadFile } from "@/features/media/api";
import { toast } from "sonner";
import { useRef } from "react";
import {
  getLabel,
  getDialogContentClasses,
  getTabsListClasses,
  getTabsTriggerClasses,
  getUploadZoneClasses,
  getAttributionLinkClasses,
  getRoundedClass,
} from "@/lib/theme-variants";
import { useThemeLabel } from "@/components/theme/ThemeLabel";

interface CoverImageManagerProps {
  value: string | null;
  attribution?: { name: string; url: string } | null;
  onChange: (url: string | null, attribution?: { name: string; url: string } | null) => void;
  tenantId?: string;
  variant?: "editor" | "sidebar";
}

export function CoverImageManager({ value, attribution, onChange, tenantId, variant }: CoverImageManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("upload");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { theme, isCyberCopy, isTechieCopy } = useThemeHelpers();
  const t = useThemeLabel();

  const handleSelect = (url: string | null, attribution?: { name: string; url: string }) => {
    onChange(url, attribution || null);
    setIsOpen(false);
  };

  const handleLocalClick = () => {
    fileInputRef.current?.click();
  };

  const handleUnsplashClick = () => {
    setActiveTab("unsplash");
    setIsOpen(true);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const toastId = toast.loading("Uploading cover image...");
      try {
        const { url } = await uploadFile(file);
        onChange(url, null);
        toast.dismiss(toastId);
        toast.success("Cover image uploaded");
        setIsOpen(false);
      } catch (error) {
        toast.dismiss(toastId);
        toast.error("Failed to upload cover image");
        console.error(error);
      }
    }
    if (e.target) {
      e.target.value = "";
    }
  };


  return (
    <div
      className={cn(
        "relative group w-full mt-2 transition-all duration-300",
        value ? "mb-6" : "mb-2",
        variant === "sidebar" && value ? "aspect-video" : "w-full",
      )}
    >
      {value ? (
        <div
          className={cn(
            "relative w-full overflow-hidden transition-all duration-500",
            variant === "sidebar" ? "aspect-video" : "aspect-[21/9] shadow-xl mb-6",
            getRoundedClass(theme, "lg"),
          )}
        >
          <Image
            src={value}
            alt="Cover"
            fill
            className={cn("object-cover border border-noir-border", getRoundedClass(theme, "lg"))}
          />

          {/* Subtle gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          {attribution && (
            <div className="absolute bottom-4 left-4 z-10">
              <a
                href={attribution.url}
                target="_blank"
                rel="noopener noreferrer"
                className={getAttributionLinkClasses(theme)}
              >
                <Camera size={10} className={isCyberCopy || isTechieCopy ? "text-accent" : ""} />
                {getLabel("photoByOnUnsplash", theme).replace("{name}", attribution.name)}
              </a>
            </div>
          )}
          <div className="absolute top-4 right-4 flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger>
                <Button
                  size="sm"
                  variant="secondary"
                  className={cn(
                    "bg-noir-bg/80 backdrop-blur-sm border-noir-border text-[10px] font-bold uppercase",
                    getRoundedClass(theme, "full"),
                  )}
                  onClick={() => setActiveTab("upload")}
                >
                  {t("changeCover")}
                </Button>
              </DialogTrigger>
              <DialogContent className={getDialogContentClasses(theme)}>
                <DialogHeader>
                  <DialogTitle>{t("changeCover")}</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="upload" value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <div
                    className={cn(
                      "px-6 pt-6 border-b border-noir-border bg-noir-bg",
                      isTechieCopy && "bg-noir-bg border-noir-border",
                    )}
                  >
                    <TabsList className={getTabsListClasses(theme)}>
                      <TabsTrigger value="upload" className={getTabsTriggerClasses(theme)}>
                        {t("uploadTab")}
                      </TabsTrigger>
                      <TabsTrigger value="unsplash" className={getTabsTriggerClasses(theme)}>
                        {t("unsplashTab")}
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  <TabsContent value="upload" className="p-12 animate-in fade-in duration-300">
                    <div className={getUploadZoneClasses(theme)}>
                      <div
                        className={cn(
                          "w-16 h-16 bg-noir-bg border border-noir-border flex items-center justify-center group-hover/upload:scale-110 transition-transform",
                          getRoundedClass(theme, "full"),
                        )}
                      >
                        <Camera
                          size={24}
                          className={cn(
                            "text-foreground-muted group-hover/upload:text-accent transition-colors",
                            isTechieCopy && "text-accent-secondary group-hover/upload:text-accent",
                          )}
                        />
                      </div>
                      <div className="text-center space-y-2">
                        <p className="text-sm font-bold uppercase tracking-widest text-foreground font-display">
                          {t("dropImageHere")}
                        </p>
                        <p className="text-[10px] text-foreground-muted tracking-[0.2em] font-mono">
                          {t("supportedFormats")}
                        </p>
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileChange}
                        accept="image/*"
                      />
                      <Button
                        variant="ghost"
                        className={cn(
                          "px-8 text-[10px] font-black uppercase text-foreground bg-foreground/10 hover:bg-foreground/20",
                          getRoundedClass(theme, "full"),
                        )}
                        onClick={handleLocalClick}
                      >
                        {t("selectFile")}
                      </Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="unsplash" className="h-[650px]">
                    <UnsplashSelector onSelect={handleSelect} tenantId={tenantId} />
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
            <Button
              size="sm"
              className={cn(
                "bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white border-red-500/50 text-[10px] font-bold uppercase",
                getRoundedClass(theme, "full"),
              )}
              onClick={() => onChange(null, null)}
            >
              <Trash2 size={12} />
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col">
          {variant === "editor" && (
            <span
              className={cn(
                "text-[9px] font-black uppercase tracking-[0.2em] mb-2",
                isCyberCopy || isTechieCopy ? "text-accent/50" : "text-foreground-subtle/50",
              )}
            >
              Cover Image
            </span>
          )}
          <div
            className={cn(
              "animate-in fade-in slide-in-from-top-4 duration-500",
              variant === "sidebar"
                ? "grid grid-cols-2 gap-2 py-2"
                : "flex flex-row flex-wrap items-center justify-start gap-4 py-1",
            )}
          >
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept="image/*" />
            <Button
              variant="ghost"
              onClick={handleLocalClick}
              className={cn(
                variant === "sidebar"
                  ? "flex items-center gap-2 px-4 h-9 text-[9px] font-black uppercase tracking-[0.15em] transition-all"
                  : "flex items-center gap-1.5 px-2 md:px-0 h-8 text-[11px] font-bold uppercase tracking-wider transition-all hover:bg-transparent hover:text-accent",
                getRoundedClass(theme, "full"),
                variant === "sidebar" &&
                  (isCyberCopy
                    ? "border border-accent/20 bg-accent/5 hover:bg-accent/10"
                    : theme === "terminal"
                      ? "border border-accent/20 bg-accent/5 hover:bg-accent/20 text-accent font-mono"
                      : "bg-foreground/10 text-foreground hover:bg-foreground/20 hover:scale-105"),
                variant === "editor" && "text-foreground-subtle opacity-60 hover:opacity-100",
              )}
            >
              {variant === "sidebar" ? (
                <Camera
                  size={14}
                  className={isCyberCopy || isTechieCopy || theme === "terminal" ? "text-accent" : "text-foreground"}
                />
              ) : (
                <Plus
                  size={14}
                  className={
                    isCyberCopy || isTechieCopy || theme === "terminal" ? "text-accent" : "text-foreground-subtle"
                  }
                />
              )}
              {theme === "terminal" && variant === "sidebar" ? "ADD --LOCAL" : t("addFromDevice")}
            </Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger>
                <Button
                  variant="ghost"
                  onClick={handleUnsplashClick}
                  className={cn(
                    variant === "sidebar"
                      ? "flex items-center gap-2 px-4 h-9 text-[9px] font-black uppercase tracking-[0.15em] transition-all"
                      : "flex items-center gap-1.5 px-2 md:px-0 h-8 text-[11px] font-bold uppercase tracking-wider transition-all hover:bg-transparent hover:text-accent",
                    getRoundedClass(theme, "full"),
                    variant === "sidebar" &&
                      (isCyberCopy
                        ? "border border-accent/20 bg-accent/5 hover:bg-accent/10"
                        : theme === "terminal"
                          ? "border border-accent/20 bg-accent/5 hover:bg-accent/20 text-accent font-mono"
                          : "bg-foreground/10 text-foreground hover:bg-foreground/20 hover:scale-105"),
                    variant === "editor" && "text-foreground-subtle opacity-60 hover:opacity-100",
                  )}
                >
                  {variant === "sidebar" ? (
                    <Search
                      size={14}
                      className={
                        isCyberCopy || isTechieCopy || theme === "terminal" ? "text-accent" : "text-foreground"
                      }
                    />
                  ) : (
                    <Plus
                      size={14}
                      className={
                        isCyberCopy || isTechieCopy || theme === "terminal" ? "text-accent" : "text-foreground-subtle"
                      }
                    />
                  )}
                  {theme === "terminal" && variant === "sidebar" ? "ADD --REMOTE" : t("addFromUnsplash")}
                </Button>
              </DialogTrigger>
              <DialogContent className={getDialogContentClasses(theme)}>
                <DialogHeader>
                  <DialogTitle>{t("addFromUnsplash")}</DialogTitle>
                </DialogHeader>
                <div className="h-[750px] overflow-hidden">
                  <UnsplashSelector onSelect={handleSelect} tenantId={tenantId} />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}
    </div>
  );
}
