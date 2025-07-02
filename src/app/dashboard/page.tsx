import { OnboardingLanding } from "@/features/onboarding/components/OnboardingLanding";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Dashboard | Conduit",
};

function LoadingFallback() {
  return <div className="min-h-screen flex items-center justify-center bg-noir-bg font-mono text-accent animate-pulse">Loading...</div>;
}

export default function DashboardRoute() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <OnboardingLanding />
    </Suspense>
  );
}
