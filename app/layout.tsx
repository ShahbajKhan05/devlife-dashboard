
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DevLife | Shahbaj Khan",
  description:
    "Full-stack developer portfolio, projects, skills and GitHub activity.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        className={`${inter.variable} min-h-dvh bg-[#FFFAD8] text-[#191919] antialiased`}
      >
        <Sidebar />
        <div className="flex min-h-dvh flex-col lg:ml-60">
          <main id="top" className="min-w-0 flex-1 pt-16 lg:pt-0">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
