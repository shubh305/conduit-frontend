"use client";
import { useAuth } from "@/features/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { useRef, useEffect } from "react";

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, refreshUser } = useAuth();
  const router = useRouter();

  const hasRefreshed = useRef(false);

  useEffect(() => {
    if (!isLoading && user && !hasRefreshed.current) {
      hasRefreshed.current = true;
      refreshUser();
    }
  }, [user, isLoading, refreshUser]);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login?redirect=/studio");
      } else {
        const tenants = user.tenants;
        console.log("StudioLayout Check:", { user: user.username, tenants: tenants?.length });

        if (tenants && tenants.length === 0) {
          console.warn("No tenants found, redirecting to dashboard");
          router.push("/dashboard");
        }
      }
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-noir-bg flex items-center justify-center font-mono text-foreground-subtle">
        LOADING STUDIO...
      </div>
    );
  }

  return <>{children}</>;
}
