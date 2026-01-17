import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header, Footer } from "@/components/layout";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "KurdFreelance - Kurdistan's Premier Freelance Marketplace",
    template: "%s | KurdFreelance",
  },
  description:
    "Connect with talented freelancers and find quality projects in Kurdistan. Lower fees, local payment methods, and quality-focused matching.",
  keywords: [
    "freelance",
    "Kurdistan",
    "Iraq",
    "jobs",
    "hire",
    "developers",
    "designers",
    "freelancers",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
