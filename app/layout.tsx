import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SAST Report Explorer",
  description:
    "Simple viewer for GitLab Static Application Security Testing (SAST) reports.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-screen overflow-hidden">
      <body
        className={`${inter.className} bg-slate-100 overflow-auto h-screen dark:bg-slate-800`}
      >
        {children}
      </body>
    </html>
  );
}
