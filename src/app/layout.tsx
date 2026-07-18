import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HR Fashion | Premium Garment Manufacturing & Fashion",
  description: "HR Fashion is a premium garment manufacturer and fashion label, specializing in high-quality apparel production and modern designs.",
};

import { Navbar } from "@/components/layout/Navbar";
import { ConditionalFooter } from "@/components/layout/ConditionalFooter";
import { Providers } from "@/components/providers";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans pt-16`}>
        <Providers>
          <Navbar />
          {children}
          <ConditionalFooter />
          <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
