"use client";
import React from "react";
import DashboardMenuPage from "@/components/DashboardMenuPage";

const logosMapping = {
  picking: "pickin.svg",
  packing: "packing.svg",
  putaway: "putaway.svg",
};

const cards = [
  { key: "picking", number: 12, route: "/operations/picking" },
  { key: "packing", number: 32, route: "/operations/packing" },
  { key: "putaway", number: 21, route: "/operations/putaway" },
];

export default function OperationsPage() {
  return (
    <DashboardMenuPage
      title="Operations"      
      cards={cards}
      logosMapping={logosMapping}
      showWelcome={false}    
    />
  );
}
