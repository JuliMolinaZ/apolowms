// src/app/locations/page.tsx
"use client";

import React from "react";
import DashboardMenuPage, { MenuCard } from "@/components/DashboardMenuPage";
import { sidebarItems } from "@/components/Sidebar/sidebarItems";

export default function LocationsPage() {
  // buscamos el ítem padre "locations" (asegúrate que label coincida)
  const parent = sidebarItems.find(
    (item) => item.label.toLowerCase() === "locations"
  );

  // convertimos cada subItem en MenuCard
  const cards: MenuCard[] = parent
    ? parent.subItems.map((sub) => ({
        key: sub.label,
        number: sub.count ?? 0,
        route: sub.path,
      }))
    : [];

  // asignamos iconos según el mismo mapping
  const logosMapping: Record<string, string> = parent
    ? Object.fromEntries(
        parent.subItems.map((sub) => [sub.label, sub.icon])
      )
    : {};

  return (
    <DashboardMenuPage
      title="Locations"
      cards={cards}
      logosMapping={logosMapping}
      showWelcome={false} // ocultamos el saludo
    />
  );
}
