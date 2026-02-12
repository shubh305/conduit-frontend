import { useTheme, THEMES, THEME_REGISTRY, useStudioLabels } from "@/features/theme/ThemeProvider"
import { cn } from "@/lib/utils"
import { Check, ChevronDown, Palette, LayoutGrid } from "lucide-react"
import { LayoutSelector } from "@/features/studio/components/LayoutSelector"
import { useState } from "react"
import { Tenant } from "@/features/blog/types"

interface AppearanceConfigProps {
  tenants: Tenant[]
}

import {
  getConfigSectionClasses,
  getConfigIconClasses,
  getConfigTitleClasses,
  getThemeCardClasses,
} from "@/lib/theme-variants"

export function AppearanceConfig({ tenants }: AppearanceConfigProps) {
  const { theme, setTheme } = useTheme()
  const { getLabel } = useStudioLabels()

  const [openSection, setOpenSection] = useState<"theme" | "layout" | null>("theme")

  const toggleSection = (section: "theme" | "layout") => {
    setOpenSection(openSection === section ? null : section)
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-4">
        {/* THEME ACCORDION */}
        <div className={getConfigSectionClasses(theme, openSection === "theme")}>
          <button
            onClick={() => toggleSection("theme")}
            className="w-full flex items-center justify-between p-4 md:p-8 outline-none"
          >
            <div className="flex items-center gap-5">
              <div className={getConfigIconClasses(theme, openSection === "theme")}>
                <Palette size={24} />
              </div>
              <div className="text-left">
                <h3 className={getConfigTitleClasses(theme)}>{getLabel("theme") || "Color Theme"}</h3>
                <p className="text-xs text-foreground-subtle">
                  Choose the primary aesthetic for your studio experience.
                </p>
              </div>
            </div>
            <ChevronDown
              size={24}
              className={cn(
                "text-foreground-subtle transition-transform duration-500",
                openSection === "theme" && "rotate-180",
              )}
            />
          </button>

          <div
            className={cn(
              "overflow-hidden transition-all duration-500 ease-in-out",
              openSection === "theme" ? "max-h-[2000px] opacity-100 pb-6 px-4 md:pb-12 md:px-8" : "max-h-0 opacity-0",
            )}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {THEMES.map(themeId => {
                const themeConfig = THEME_REGISTRY[themeId];
                const isSelected = theme === themeId;
                return (
                  <button
                    key={themeId}
                    type="button"
                    onClick={() => setTheme(themeId)}
                    className={getThemeCardClasses(theme, isSelected)}
                  >
                    <div
                      className={cn(
                        "font-mono text-[10px] mb-3 opacity-80 uppercase tracking-[0.2em]",
                        isSelected ? "text-accent" : "",
                      )}
                    >
                      Mode: {themeId}
                    </div>
                    <div
                      className={cn(
                        "text-xl mb-1 tracking-tighter",
                        themeConfig.fontFamily === "mono"
                          ? "font-mono font-black uppercase"
                          : themeConfig.fontFamily === "serif"
                            ? "font-serif italic font-bold"
                            : "font-sans font-black",
                      )}
                    >
                      {themeConfig.label}
                    </div>
                    {isSelected && (
                      <div className="absolute top-6 right-6 w-5 h-5 bg-accent rounded-full flex items-center justify-center text-noir-bg shadow-lg">
                        <Check size={12} strokeWidth={4} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* LAYOUT ACCORDION */}
        <div className={getConfigSectionClasses(theme, openSection === "layout")}>
          <button
            onClick={() => toggleSection("layout")}
            className="w-full flex items-center justify-between p-4 md:p-8 outline-none"
          >
            <div className="flex items-center gap-5">
              <div className={getConfigIconClasses(theme, openSection === "layout")}>
                <LayoutGrid size={24} />
              </div>
              <div className="text-left">
                <h3 className={getConfigTitleClasses(theme)}>{getLabel("layout") || "Global Layout"}</h3>
                <p className="text-xs text-foreground-subtle">Define how your stories are presented to readers.</p>
              </div>
            </div>
            <ChevronDown
              size={24}
              className={cn(
                "text-foreground-subtle transition-transform duration-500",
                openSection === "layout" && "rotate-180",
              )}
            />
          </button>

          <div
            className={cn(
              "overflow-hidden transition-all duration-500 ease-in-out",
              openSection === "layout" ? "max-h-[2000px] opacity-100 pb-6 px-4 md:pb-12 md:px-8" : "max-h-0 opacity-0",
            )}
          >
            {tenants && tenants.length > 0 ? (
              <LayoutSelector tenants={tenants} />
            ) : (
              <div
                className={cn(
                  "py-12 text-center text-foreground-subtle font-mono text-xs uppercase tracking-widest bg-noir-bg/50 border-2 border-dashed border-noir-border",
                  getThemeCardClasses(theme, false).includes("rounded-none") ? "rounded-none" : "rounded-[2rem]",
                )}
              >
                No active publications found for layout configuration.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
