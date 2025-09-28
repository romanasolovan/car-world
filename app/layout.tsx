import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header/header";
import { Providers } from "./provider";
import "modern-normalize";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Car World",
  description: "The best car rental app",
  openGraph: {
    title: `Car World`,
    description: "The best car rental app",
    url: `https://car-world-mu.vercel.app/`,
    siteName: "Car Worl",
    images: [
      {
        url: "https://car-world-mu.vercel.app/open-graph.jpg",
        width: 1200,
        height: 630,
        alt: "og carworld",
      },
    ],
    type: "article",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Providers>
        <body className={`${manrope.variable} ${inter.variable}`}>
          <Header />
          {children}
        </body>
      </Providers>
    </html>
  );
}
