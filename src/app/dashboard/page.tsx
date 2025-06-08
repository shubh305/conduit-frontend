import { OnboardingLanding } from "@/features/onboarding/components/OnboardingLanding";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Conduit",
};

export default function DashboardRoute() {
  return <OnboardingLanding />;
}
