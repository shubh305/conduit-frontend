"use client";

import { Button } from "@/components/ui/button";
import { Plus, ExternalLink, Trash2, LayoutGrid, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tenant } from "@/features/blog/types";
import Link from "next/link";
import { useThemeHelpers, useStudioLabels, useTheme } from "@/features/theme/ThemeProvider"
import { WIP_LIMITS } from "@/lib/wip-limits";
import { useState } from "react";
import { EditTenantModal } from "./EditTenantModal";


interface PublicationsConfigProps {
  tenants: Tenant[];
  loading: boolean;
  onDelete: (tenant: { id: string; name: string }) => void;
  onRefresh: () => void;
}

import {
  getConfigItemClasses,
  getConfigItemHeadingClasses,
  getAddButtonClasses,
  getThemeCardClasses,
} from "@/lib/theme-variants"

export function PublicationsConfig({ tenants, loading, onDelete, onRefresh }: PublicationsConfigProps) {
  const { theme } = useTheme();
  const { isCyberCopy, isTechieCopy, isTerminalCopy } = useThemeHelpers();
  const { getLabel } = useStudioLabels();
  const [editTarget, setEditTarget] = useState<Tenant | null>(null);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent/50 animate-pulse">
            {getLabel("loading")}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {tenants.map(tenant => (
            <div key={tenant.id || tenant._id} className={getConfigItemClasses(theme)}>
              <div>
                <h3 className={getConfigItemHeadingClasses(theme)}>{tenant.name}</h3>
                <div className="flex items-center gap-3 text-sm font-mono text-foreground-subtle">
                  <span className={isCyberCopy || isTechieCopy || isTerminalCopy ? "text-accent/50" : ""}>
                    /{tenant.slug}
                  </span>
                  <span className="w-1.5 h-1.5 bg-noir-border rounded-full opacity-30" />
                  <span
                    className={cn(
                      "uppercase text-[10px] font-bold tracking-widest",
                      isCyberCopy || isTechieCopy || isTerminalCopy ? "text-accent/30" : "text-accent/60",
                    )}
                  >
                    {tenant.status || "active"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-foreground-subtle">
                {WIP_LIMITS.showRedirectionArrow && (
                  <Link href={`/${tenant.slug}`} target="_blank">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="w-11 h-11 p-0 transition-all hover:text-accent hover:bg-accent/10"
                    >
                      <ExternalLink size={20} />
                    </Button>
                  </Link>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="w-11 h-11 p-0 transition-all hover:text-accent hover:bg-accent/10"
                  onClick={() => setEditTarget(tenant)}
                >
                  <Settings2 size={20} />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="w-11 h-11 p-0 hover:text-red-500 hover:bg-red-500/10 transition-all"
                  onClick={() => onDelete({ id: tenant.id || tenant._id || "", name: tenant.name })}
                >
                  <Trash2 size={20} />
                </Button>
              </div>
            </div>
          ))}

          {tenants.length === 0 && (
            <div
              className={cn(
                "text-center py-24 border-2 border-dashed border-noir-border bg-noir-bg/20",
                getThemeCardClasses(theme, false).includes("rounded-none") ? "rounded-none" : "rounded-[2rem]",
              )}
            >
              <div className="w-16 h-16 rounded-full bg-noir-panel border border-noir-border flex items-center justify-center mx-auto mb-6 opacity-40">
                <LayoutGrid size={32} />
              </div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-foreground-subtle">
                {getLabel("no_data")}
              </p>
            </div>
          )}

          <div className="pt-8">
            <Link href="/dashboard?action=new-blog">
              <Button type="button" className={getAddButtonClasses(theme)}>
                <Plus size={20} />
                {getLabel("new_publication_btn")}
              </Button>
            </Link>
          </div>

          {editTarget && (
            <EditTenantModal
              isOpen={!!editTarget}
              tenant={editTarget}
              onClose={() => setEditTarget(null)}
              onUpdate={() => {
                onRefresh();
                setEditTarget(null);
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}

