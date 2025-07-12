import { ShellLayout } from "@/features/layout/components/ShellLayout";
import { Suspense } from "react";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <ShellLayout>{children}</ShellLayout>
    </Suspense>
  );
}
