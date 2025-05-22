"use client";

import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

/**
 * Componente que representa la escena 3D de un almacén.
 * Incluye un edificio, racks, pallets y un montacargas simple.
 */

export function WarehouseScene() {
  return (
    <Canvas
      // Configuramos la cámara ortográfica para un efecto "isométrico"
      orthographic
      camera={{ zoom: 50, position: [50, 50, 50], near: 1, far: 1000 }}
      style={{ width: "100%", height: "600px", background: "#cccccc" }}
    >
      {/* Controles para navegar la escena con el mouse */}
      <OrbitControls makeDefault />

      {/* Luces básicas */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[100, 100, 100]} intensity={0.5} />

      {/* Edificio (paredes, piso, techo) */}
      <Building />

      {/* Racks con pallets */}
      <Racks />

      {/* Montacargas / forklift */}
      <Forklift position={[10, 0, 10]} />

      {/* Ejemplo de un camión estacionado afuera */}
      <Truck position={[30, 0, -10]} />
    </Canvas>
  );
}

/** Building: Piso, paredes, techo básicos */
function Building() {
  return (
    <group>
      {/* Piso */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#b8b8b8" />
      </mesh>

      {/* Paredes (4 paredes simples) */}
      {/* Pared trasera */}
      <mesh position={[0, 5, -30]}>
        <boxGeometry args={[60, 10, 1]} />
        <meshStandardMaterial color="#888888" />
      </mesh>
      {/* Pared delantera */}
      <mesh position={[0, 5, 30]}>
        <boxGeometry args={[60, 10, 1]} />
        <meshStandardMaterial color="#888888" />
      </mesh>
      {/* Pared izquierda */}
      <mesh position={[-30, 5, 0]}>
        <boxGeometry args={[1, 10, 60]} />
        <meshStandardMaterial color="#888888" />
      </mesh>
      {/* Pared derecha */}
      <mesh position={[30, 5, 0]}>
        <boxGeometry args={[1, 10, 60]} />
        <meshStandardMaterial color="#888888" />
      </mesh>

      {/* Techo */}
      <mesh position={[0, 10, 0]}>
        <boxGeometry args={[60, 1, 60]} />
        <meshStandardMaterial color="#aaaaaa" />
      </mesh>
    </group>
  );
}

/** Racks: Estanterías con pallets */
function Racks() {
  // Simplemente creamos un arreglo de posiciones para racks
  const rackPositions = [
    [-15, 0, -15],
    [-15, 0, 0],
    [-15, 0, 15],
    [0, 0, -15],
    [0, 0, 0],
    [0, 0, 15],
    [15, 0, -15],
    [15, 0, 0],
    [15, 0, 15],
  ];

  return (
    <group>
      {rackPositions.map((pos, i) => (
        <Rack key={i} position={[pos[0], pos[1], pos[2]]} />
      ))}
    </group>
  );
}

function Rack({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Estructura del rack (cuatro postes) */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.5, 6, 0.5]} />
        <meshStandardMaterial color="#555555" />
      </mesh>
      <mesh position={[4, 0, 0]}>
        <boxGeometry args={[0.5, 6, 0.5]} />
        <meshStandardMaterial color="#555555" />
      </mesh>
      <mesh position={[0, 0, 2]}>
        <boxGeometry args={[0.5, 6, 0.5]} />
        <meshStandardMaterial color="#555555" />
      </mesh>
      <mesh position={[4, 0, 2]}>
        <boxGeometry args={[0.5, 6, 0.5]} />
        <meshStandardMaterial color="#555555" />
      </mesh>

      {/* Barras horizontales (nivel inferior y superior) */}
      <mesh position={[2, 1, 0]}>
        <boxGeometry args={[4, 0.3, 0.3]} />
        <meshStandardMaterial color="#777777" />
      </mesh>
      <mesh position={[2, 1, 2]}>
        <boxGeometry args={[4, 0.3, 0.3]} />
        <meshStandardMaterial color="#777777" />
      </mesh>
      <mesh position={[2, 3, 0]}>
        <boxGeometry args={[4, 0.3, 0.3]} />
        <meshStandardMaterial color="#777777" />
      </mesh>
      <mesh position={[2, 3, 2]}>
        <boxGeometry args={[4, 0.3, 0.3]} />
        <meshStandardMaterial color="#777777" />
      </mesh>

      {/* Pallets (uno en cada nivel) */}
      <Pallet position={[2, 1.2, 1]} />
      <Pallet position={[2, 3.2, 1]} />
    </group>
  );
}

/** Pallet con cajas */
function Pallet({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Base del pallet */}
      <mesh>
        <boxGeometry args={[3.5, 0.2, 1.5]} />
        <meshStandardMaterial color="#aa7744" />
      </mesh>

      {/* Cajas sobre el pallet */}
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[3, 2, 1]} />
        <meshStandardMaterial color="#d8c28a" />
      </mesh>
    </group>
  );
}

/** Montacargas / Forklift sencillo */
function Forklift({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Cuerpo principal */}
      <mesh>
        <boxGeometry args={[3, 2, 2]} />
        <meshStandardMaterial color="#ffaa00" />
      </mesh>
      {/* Mástil */}
      <mesh position={[1.2, 1, 1]}>
        <boxGeometry args={[0.2, 3, 0.2]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      {/* Horquillas */}
      <mesh position={[1.2, 0.5, 1.4]}>
        <boxGeometry args={[0.1, 0.1, 1]} />
        <meshStandardMaterial color="#444444" />
      </mesh>
      <mesh position={[1.4, 0.5, 1.4]}>
        <boxGeometry args={[0.1, 0.1, 1]} />
        <meshStandardMaterial color="#444444" />
      </mesh>
      {/* Ruedas (simplificadas como cilindros) */}
      <Wheel position={[-1, -1, 0.7]} />
      <Wheel position={[-1, -1, -0.7]} />
      <Wheel position={[1.5, -1, 0.7]} />
      <Wheel position={[1.5, -1, -0.7]} />
    </group>
  );
}

function Wheel({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <mesh position={position} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.4, 0.4, 0.5, 16]} />
      <meshStandardMaterial color="#000000" />
    </mesh>
  );
}

/** Camión simple */
function Truck({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Cabina */}
      <mesh>
        <boxGeometry args={[3, 3, 2]} />
        <meshStandardMaterial color="#e0e000" />
      </mesh>
      {/* Remolque */}
      <mesh position={[0, 0, -4]}>
        <boxGeometry args={[3, 3, 8]} />
        <meshStandardMaterial color="#5555aa" />
      </mesh>
      {/* Ruedas */}
      <Wheel position={[-1.2, -1.5, 1]} />
      <Wheel position={[1.2, -1.5, 1]} />
      <Wheel position={[-1.2, -1.5, -1]} />
      <Wheel position={[1.2, -1.5, -1]} />
      {/* Para el remolque */}
      <Wheel position={[-1.2, -1.5, -2.5]} />
      <Wheel position={[1.2, -1.5, -2.5]} />
      <Wheel position={[-1.2, -1.5, -5.5]} />
      <Wheel position={[1.2, -1.5, -5.5]} />
    </group>
  );
}
