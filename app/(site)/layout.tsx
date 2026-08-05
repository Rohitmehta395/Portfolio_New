import React from "react";
import { Inter, Outfit } from "next/font/google";
import LenisProvider from "@/components/providers/LenisProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { SignatureLoaderWrapper } from "@/components/providers/SignatureLoaderWrapper";
import { Navbar } from "@/features/navbar/Navbar";
import { Footer } from "@/features/footer/Footer";
import { SpiderWebScrollbar } from "@/features/spider-scroll/SpiderWebScrollbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LenisProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <SignatureLoaderWrapper>
          <div
            className={`${inter.variable} ${outfit.variable} font-sans min-h-screen bg-background text-foreground antialiased selection:bg-foreground selection:text-background flex flex-col transition-colors duration-300`}
          >
            <Navbar />

            <div id="main-content" className="relative flex-1 flex flex-col">
              {children}
            </div>

            <Footer />
            <SpiderWebScrollbar />
          </div>
        </SignatureLoaderWrapper>
      </ThemeProvider>
    </LenisProvider>
  );
}
