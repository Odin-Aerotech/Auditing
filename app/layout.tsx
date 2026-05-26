import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
  title: "Auditing Dashboard",
  description: "Internal audit and performance tracking system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-screen">

        {/* SIDEBAR */}
        <div className="w-60 bg-gray-800 text-white p-4">
          <h2 className="text-xl font-bold mb-6">Audit App</h2>

          <Link
            href="/"
            className="block p-2 rounded mb-2 hover:bg-gray-700"
          >
            Audit Dashboard
          </Link>

          <Link
            href="/audit-data"
            className="block p-2 rounded hover:bg-gray-700"
          >
            Audit Data
          </Link>

          <Link
            href="/CAPA-dashboard"
            className="block p-2 rounded hover:bg-gray-700"
          >
            CAPA Dashboard
          </Link>
        </div>

        {/* ✅ MAIN CONTENT AREA */}
        <div className="flex-1 p-6 bg-gray-100">
          {children}
        </div>

      </body>
    </html>
  );
}