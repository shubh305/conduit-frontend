import { ShellLayout } from "@/features/layout/components/ShellLayout";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ShellLayout>
      {children}
    </ShellLayout>
  );
}
