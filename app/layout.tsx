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

const haloHandletter = localFont({
  src: "./fonts/HaloHandletter.otf",
  variable: "--font-halo",
  display: "swap",
});

const ndot = localFont({
  src: "./fonts/Ndot57-Regular.otf",
  variable: "--font-ndot",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sth1ra.vercel.app"),
  title: "sthira",
  description: "Make the Focus Environment Adapt to You.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${haloHandletter.variable} ${ndot.variable} overflow-hidden`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Workbench&display=swap" rel="stylesheet" />
        <link rel="preconnect" href="https://fonts.bunny.net" />
        <link href="https://fonts.bunny.net/css?family=krub:200i,300,400,500,600,700" rel="stylesheet" />
      </head>
      <body className="h-screen w-screen overflow-hidden m-0 p-0">{children}</body>
    </html>
  );
}
