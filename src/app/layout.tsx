import type { Metadata } from "next";
import { Inter_Tight, JetBrains_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/features/theme/ThemeProvider";
import { AuthProvider } from "@/features/auth/AuthProvider";
import { LibraryProvider } from "@/features/library/context/LibraryContext";
import { LayoutWrapper } from "@/components/shared/LayoutWrapper";
import { Toaster } from "@/components/ui/sonner";

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

export const metadata: Metadata = {
  title: "Conduit",
  description: "Multi-tenant blogging platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          interTight.variable,
          jetbrainsMono.variable,
          playfair.variable,
          "antialiased bg-noir-bg text-white min-h-screen"
        )}
      >
        <ThemeProvider>
          <AuthProvider>
            <LibraryProvider>
              <LayoutWrapper>
                {children}
                <Toaster />
              </LayoutWrapper>
            </LibraryProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
