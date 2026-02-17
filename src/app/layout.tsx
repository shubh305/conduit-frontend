import type { Metadata } from "next";
import { Inter_Tight, JetBrains_Mono, Playfair_Display, Cinzel, Noto_Sans, Spectral } from "next/font/google"
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/features/theme/ThemeProvider";
import { AuthProvider } from "@/features/auth/AuthProvider";
import { LibraryProvider } from "@/features/library/context/LibraryContext";
import { LayoutWrapper } from "@/components/shared/LayoutWrapper";
import { Toaster } from "@/components/ui/sonner";
import QueryProvider from "@/providers/QueryProvider";
import { FluidicWrapper } from "@/features/theme/FluidicWrapper";
import { StatusBarLoader } from "@/features/layout/components/StatusBarLoader";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { SWRegistration } from "@/components/pwa/SWRegistration";

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "700", "900"],
})

const noto = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto",
  weight: ["300", "400", "700"],
})

const spectral = Spectral({
  subsets: ["latin"],
  variable: "--font-spectral",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
})

export const metadata: Metadata = {
  title: "Conduit",
  description: "Multi-tenant blogging platform",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.svg",
    apple: "/pwa-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Conduit",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#000000",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          interTight.variable,
          jetbrainsMono.variable,
          playfair.variable,
          cinzel.variable,
          noto.variable,
          spectral.variable,
          "antialiased bg-noir-bg text-foreground min-h-screen",
        )}
      >
        <QueryProvider>
          <ThemeProvider>
            <AuthProvider>
              <LibraryProvider>
                <StatusBarLoader />
                <FluidicWrapper>
                  <LayoutWrapper>
                    {children}
                    <InstallPrompt />
                    <SWRegistration />
                  </LayoutWrapper>
                  <Toaster />
                </FluidicWrapper>
              </LibraryProvider>
            </AuthProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
