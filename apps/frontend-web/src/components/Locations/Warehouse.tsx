"use client";

import React from "react";
import { WarehouseScene } from "./WarehouseScene";

/**
 * Componente de alto nivel que muestra el almacén 3D.
 */
export function Warehouse() {
  return (
    <div style={{ padding: "1rem" }}>
      <h1>Almacén 3D</h1>
      <p>Ejemplo básico de modelado 3D con react-three-fiber (vista ortográfica).</p>
      <WarehouseScene />
    </div>
  );
}
