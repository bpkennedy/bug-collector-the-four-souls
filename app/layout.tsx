import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GameProvider } from "../contexts/GameContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bug Collector: The Four Souls",
  description: "Collect bugs, battle, and gather souls in this turn-based strategy game",
};

// Add a timestamp to force reloads
metadata.other = {
  'cache-control': 'no-cache, no-store, must-revalidate',
  'pragma': 'no-cache',
  'expires': '0',
  'version': Date.now().toString()
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
      >
        <GameProvider>
          <main className="min-h-screen flex flex-col">
            {children}
          </main>
        </GameProvider>
      </body>
    </html>
  );
}
