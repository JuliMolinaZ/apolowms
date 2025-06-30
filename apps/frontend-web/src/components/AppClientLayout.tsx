"use client";

import React from "react";
import LanguageProvider from "@/components/LanguageProvider";
import ClientSplash from "@/app/ClientSplash";
import ProtectedLayout from "@/app/(protected)/layout";

export default function AppClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <ClientSplash>
        <ProtectedLayout>
          {children}
        </ProtectedLayout>
      </ClientSplash>
    </LanguageProvider>
  );
}