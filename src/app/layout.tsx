import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {ClerkProvider} from "@clerk/nextjs";
import Providers from "@/app/Providers";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ChopIt - URL Shortening Made Easy",
  description: "Create short, memorable URLs with ChopIt. Track clicks and generate QR codes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white`}>
          <Providers>
            <Navbar />
            <main className="container mx-auto px-4">
              {children}
            </main>
            <footer className="mt-20 py-6 text-center text-gray-400 text-sm">
              <p>© {new Date().getFullYear()} ChopIt. All rights reserved.</p>
            </footer>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
