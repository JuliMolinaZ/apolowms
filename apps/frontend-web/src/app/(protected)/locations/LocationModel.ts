"use client";

export type ClassType = "A" | "B" | "C";

export type LocationData = {
  slotId: string;
  x: number;    // coordenada 2D horizontal
  y: number;    // coordenada 2D vertical
  productSku: string;
  stock: number;
  classType: ClassType; // A, B o C
};

export type Worker = { 
  id: string; 
  x: number; 
  y: number; 
};

export type Node2D = { 
  id: string; 
  x: number; 
  y: number; 
};

export type Node3D = { 
  id: string; 
  x: number; 
  z: number; 
};

/** Ejemplo de racks y su ubicación */
export const locations: LocationData[] = [
  // Clase A
  { slotId: "A1", x: 250, y: 150, productSku: "SKU-A1", stock: 10, classType: "A" },
  { slotId: "A2", x: 350, y: 150, productSku: "SKU-A2", stock: 8,  classType: "A" },
  { slotId: "A3", x: 450, y: 150, productSku: "SKU-A3", stock: 12, classType: "A" },
  // Clase B
  { slotId: "B1", x: 250, y: 250, productSku: "SKU-B1", stock: 6,  classType: "B" },
  { slotId: "B2", x: 350, y: 250, productSku: "SKU-B2", stock: 4,  classType: "B" },
  { slotId: "B3", x: 450, y: 250, productSku: "SKU-B3", stock: 9,  classType: "B" },
  // Clase C
  { slotId: "C1", x: 250, y: 350, productSku: "SKU-C1", stock: 3,  classType: "C" },
  { slotId: "C2", x: 350, y: 350, productSku: "SKU-C2", stock: 0,  classType: "C" },
  { slotId: "C3", x: 450, y: 350, productSku: "SKU-C3", stock: 5,  classType: "C" },
];

/** Ejemplo de trabajadores */
export const workers: Worker[] = [
  { id: "W1", x: 360, y: 200 }, // uno en medio
];

/** Nodos y aristas 2D (para BFS y visualización) */
export const nodes2D: Node2D[] = [
  { id: "TL", x: 0,   y: 0 },
  { id: "TR", x: 800, y: 0 },
  { id: "BL", x: 0,   y: 600 },
  { id: "BR", x: 800, y: 600 },
  // Pasillos horizontales
  { id: "H1L", x: 0,   y: 100 },
  { id: "H1R", x: 800, y: 100 },
  { id: "H2L", x: 0,   y: 200 },
  { id: "H2R", x: 800, y: 200 },
  { id: "H3L", x: 0,   y: 300 },
  { id: "H3R", x: 800, y: 300 },
  { id: "H4L", x: 0,   y: 400 },
  { id: "H4R", x: 800, y: 400 },
  { id: "H5L", x: 0,   y: 500 },
  { id: "H5R", x: 800, y: 500 },
];

export const edges2D: [string, string][] = [
  ["TL", "TR"], ["TR", "BR"], ["BR", "BL"], ["BL", "TL"],
  ["H1L", "H1R"], ["H2L", "H2R"], ["H3L", "H3R"], ["H4L", "H4R"], ["H5L", "H5R"],
  ["TL", "H1L"], ["H1L", "H2L"], ["H2L", "H3L"], ["H3L", "H4L"], ["H4L", "H5L"], ["H5L", "BL"],
  ["TR", "H1R"], ["H1R", "H2R"], ["H2R", "H3R"], ["H3R", "H4R"], ["H4R", "H5R"], ["H5R", "BR"],
];

/** Nodos y aristas 3D (para visualización en 3D) */
export const nodes3D: Node3D[] = [
  { id: "TL", x: -40, z: -30 },
  { id: "TR", x:  40, z: -30 },
  { id: "BL", x: -40, z:  30 },
  { id: "BR", x:  40, z:  30 },
];
export const edges3D: [string, string][] = [
  ["TL", "TR"], ["TR", "BR"], ["BR", "BL"], ["BL", "TL"],
];
