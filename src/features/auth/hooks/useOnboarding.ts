"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/features/auth/AuthProvider";

export function useOnboarding() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    if (pathname === "/walkthrough") return;

    const isAuthRoute = ["/login", "/signup", "/forgot-password"].some(route =>
      pathname.startsWith(route)
    );
    if (isAuthRoute) return;

    // Check onboarding status
    const localCompleted = localStorage.getItem("conduit_onboarding_completed") === "true";
    let onboardingCompleted = localCompleted;

    if (user && !onboardingCompleted) {
      onboardingCompleted = !!user.onboardingCompleted;
    }

    if (!onboardingCompleted) {
      router.push("/walkthrough");
    }
  }, [user, isLoading, pathname, router]);
}
