// src/app/items/page.tsx  (Landing de Items)
"use client";

import React from "react";
import DashboardMenuPage, { MenuCard } from "@/components/DashboardMenuPage";

export default function ItemsPage() {
  // Definimos manualmente las 2 cards: Items y Movilizaciones
  const cards: MenuCard[] = [
    {
      key: "Items",
      number: 9,
      route: "/items/items",
    },
    {
      key: "Movilizaciones",
      number: 3,
      route: "/items/mobilizations",
    },
  ];

  const logosMapping: Record<string, string> = {
    Items: "cube.svg",
    Movilizaciones: "cube.svg", // Ajusta el icono si lo deseas
  };

  return (
    <DashboardMenuPage
      title="Items"
      cards={cards}
      logosMapping={logosMapping}
      showWelcome={false} // Oculta el saludo
    />
  );
}