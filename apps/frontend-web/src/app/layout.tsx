// src/app/layout.tsx
import LanguageProvider from "@/components/LanguageProvider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";
import ClientSplash from "./ClientSplash";
import FloatingChatButton from "@/components/ButtonIA/FloatingChatButton";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "APOLO",
  description: "APOLOWARE",
  icons: {
    icon: "../../public/logos/Apoloware.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClientProviders>
          <LanguageProvider>
            <ClientSplash>{children}</ClientSplash>
          </LanguageProvider>
          <FloatingChatButton />
        </ClientProviders>
      </body>
    </html>
  );
}

