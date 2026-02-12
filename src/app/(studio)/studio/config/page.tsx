"use client";

import { useState, useEffect, Suspense, useCallback } from "react"
import { toast } from "sonner";
import { useTheme, useStudioLabels } from "@/features/theme/ThemeProvider";
import { getHeadingClasses } from "@/components/theme"
import { getSubtitleClasses, ThemeVariant } from "@/lib/theme-variants"
import { useAuth } from "@/features/auth/AuthProvider";
import { useSearchParams } from "next/navigation";
import { getMyTenants, deleteTenant } from "@/features/blog/api";
import { Tenant } from "@/features/blog/types";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { ThemePage } from "@/components/theme"
import { cn } from "@/lib/utils"


import { PublicationsConfig } from "@/features/studio/components/config/PublicationsConfig"
import { AppearanceConfig } from "@/features/studio/components/config/AppearanceConfig"
import { NotificationsConfig } from "@/features/studio/components/config/NotificationsConfig"

type ConfigTab = "transmissions" | "appearance" | "notifications"

function ConfigContent() {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab") as ConfigTab

  const [activeTab, setActiveTab] = useState<ConfigTab>("transmissions")
  const { theme } = useTheme()
  const { getLabel } = useStudioLabels()
  const { user, refreshUser } = useAuth()

  useEffect(() => {
    if (tabParam && ["transmissions", "appearance", "notifications"].includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [tabParam])


  const [tenants, setTenants] = useState<Tenant[]>([])
  const [loadingTenants, setLoadingTenants] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const loadTenants = useCallback(async () => {
    setLoadingTenants(true)
    try {
      const data = await getMyTenants()
      setTenants(data || [])
    } catch (err) {
      console.error("Failed to load tenants", err)
    } finally {
      setLoadingTenants(false)
    }
  }, [])

  useEffect(() => {
    if (user) {
      loadTenants()
    }
  }, [user, loadTenants])

  const handleDeletePublication = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await deleteTenant(deleteTarget.id)
      toast.success(getLabel("delete_success"))
      setTenants(prev => prev.filter(t => t.id !== deleteTarget.id && t._id !== deleteTarget.id))
      setDeleteTarget(null)
      refreshUser()
    } catch (error) {
      console.error("Failed to delete publication", error)
      toast.error("Critical failure during termination.")
    } finally {
      setIsDeleting(false)
    }
  }

  if (!user) {
    return <div className="p-20 text-center font-mono text-red-500 uppercase">Authorization Required</div>
  }

  return (
    <ThemePage>
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-2 md:py-12">
        <header className="mb-4 md:mb-16">
          <h1 className={cn("text-4xl font-bold tracking-tight mb-4 transition-all", getHeadingClasses(theme))}>
            {activeTab === "transmissions" && getLabel("publications")}
            {activeTab === "appearance" && getLabel("appearance")}
            {activeTab === "notifications" && getLabel("notifications")}
          </h1>
          <p className={cn("text-sm transition-colors opacity-70", getSubtitleClasses(theme as ThemeVariant))}>
            {activeTab === "transmissions" && getLabel("publications_desc")}
            {activeTab === "appearance" && getLabel("appearance_desc")}
            {activeTab === "notifications" && getLabel("notifications_desc")}
          </p>
          <div className="h-px w-full bg-noir-border opacity-30 mt-4" />
        </header>

        <main>
          {activeTab === "transmissions" && (
            <PublicationsConfig
              tenants={tenants}
              loading={loadingTenants}
              onDelete={setDeleteTarget}
              onRefresh={loadTenants}
            />
          )}

          {activeTab === "appearance" && <AppearanceConfig tenants={tenants} />}

          {activeTab === "notifications" && <NotificationsConfig />}
        </main>

        <DeleteDialog
          isOpen={!!deleteTarget}
          title={getLabel("delete_title")}
          description={
            theme === "cyber" || theme === "techie" || theme === "terminal"
              ? `This will permanently offline "${deleteTarget?.name}". This process is irreversible.`
              : `Are you sure you want to delete "${deleteTarget?.name}"? All archives will be lost.`
          }
          isDeleting={isDeleting}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeletePublication}
        />
      </div>
    </ThemePage>
  );
}

export default function ConfigPage() {
  return (
    <Suspense
      fallback={
        <div className="p-20 text-center font-mono text-xs uppercase animate-pulse">Initializing Systems...</div>
      }
    >
      <ConfigContent />
    </Suspense>
  )
}
