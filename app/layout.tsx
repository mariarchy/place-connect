import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const drukWide = localFont({
  src: "./Druk Wide Medium App.ttf",
  variable: "--font-druk-wide",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PLACE Connect — Connect with Culture",
  description: "Connect with authentic communities through culture",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${drukWide.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
