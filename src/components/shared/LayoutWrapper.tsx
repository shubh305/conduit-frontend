import { ShellLayout } from "@/features/layout/components/ShellLayout";
import { Suspense } from "react";
import { SpotlightProvider, SpotlightOverlay } from "@/components/tour/TourSpotlight";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <SpotlightProvider>
        <ShellLayout>{children}</ShellLayout>
        <SpotlightOverlay />
      </SpotlightProvider>
    </Suspense>
  );
}
