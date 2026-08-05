import type { Metadata } from 'next';
import './globals.css';
import { Geist, Great_Vibes } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});
const greatVibes = Great_Vibes({ weight: "400", subsets: ['latin'], variable: '--font-cursive' });

export const metadata: Metadata = {
  title: 'Developer Portfolio',
  description: 'Premium Animated Developer Portfolio',
  icons: {
    icon: '/images/Rohit_Mehta_circle.png',
    shortcut: '/images/Rohit_Mehta_circle.png',
    apple: '/images/Rohit_Mehta_circle.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable, greatVibes.variable)} suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
