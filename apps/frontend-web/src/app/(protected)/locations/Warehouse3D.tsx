"use client";

import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Line } from "@react-three/drei";
import * as THREE from "three";
import styled from "styled-components";
import { LocationData, nodes3D, edges3D, locations } from "./LocationModel";

function Building3D() {
  return (
    <group>
      {/* Piso 80x60 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[80, 60]} />
        <meshStandardMaterial color="#cccccc" side={THREE.DoubleSide} />
      </mesh>

      {/* 4 paredes sencillas */}
      <mesh position={[0, 3, -30]} receiveShadow>
        <boxGeometry args={[80, 6, 1]} />
        <meshStandardMaterial color="#888" />
      </mesh>
      <mesh position={[0, 3, 30]} receiveShadow>
        <boxGeometry args={[80, 6, 1]} />
        <meshStandardMaterial color="#888" />
      </mesh>
      <mesh position={[-40, 3, 0]} receiveShadow>
        <boxGeometry args={[1, 6, 60]} />
        <meshStandardMaterial color="#888" />
      </mesh>
      <mesh position={[40, 3, 0]} receiveShadow>
        <boxGeometry args={[1, 6, 60]} />
        <meshStandardMaterial color="#888" />
      </mesh>
    </group>
  );
}

function Route3D({ routeNodes }: { routeNodes: string[] | null }) {
  if (!routeNodes || routeNodes.length < 2) return null;

  const points: [number, number, number][] = routeNodes.map((id) => {
    const n = nodes3D.find((nn) => nn.id === id)!;
    // y = 0.1 => altura de la línea
    return [n.x, 0.1, n.z];
  });

  return <Line points={points} color="#007BFF" lineWidth={3} dashed={false} />;
}

function Location3D(props: {
  loc: LocationData;
  onClick: (loc: LocationData) => void;
  isSelected: boolean;
}) {
  const { loc, onClick, isSelected } = props;
  const [hovered, setHovered] = useState(false);

  // Escala x,y => X,Z en 3D
  function scaleX(val: number) {
    return -40 + (val / 800) * 80;
  }
  function scaleZ(val: number) {
    return -30 + (val / 600) * 60;
  }

  const X = scaleX(loc.x);
  const Z = scaleZ(loc.y);

  let baseColor = "red";
  if (loc.classType === "A") baseColor = "green";
  if (loc.classType === "B") baseColor = "blue";

  const color = hovered ? "orange" : baseColor;

  return (
    <group
      position={[X, 2, Z]}
      onClick={() => onClick(loc)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {isSelected && (
        <mesh>
          <boxGeometry args={[2.2, 2.2, 2.2]} />
          <meshBasicMaterial color="yellow" wireframe />
        </mesh>
      )}
    </group>
  );
}

function Warehouse3D(props: {
  routeNodes: string[] | null;
  onSlotClick: (loc: LocationData) => void;
  selectedSlot: LocationData | null;
}) {
  const { routeNodes, onSlotClick, selectedSlot } = props;

  return (
    <VisualizationCard>
      <Canvas
        shadows
        camera={{ position: [60, 50, 60], fov: 60 }}
        style={{ width: "100%", height: "100%" }}
      >
        <OrbitControls makeDefault />
        <ambientLight intensity={0.6} />
        <directionalLight position={[20, 40, 20]} intensity={0.8} castShadow />

        <Building3D />

        {/* Renderizamos cada rack como un cubo */}
        {locations.map((loc) => (
          <Location3D
            key={loc.slotId}
            loc={loc}
            onClick={onSlotClick}
            isSelected={selectedSlot?.slotId === loc.slotId}
          />
        ))}

        <Route3D routeNodes={routeNodes} />
      </Canvas>
    </VisualizationCard>
  );
}

export default Warehouse3D;

const VisualizationCard = styled.div`
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 0.4rem;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  overflow: hidden;
  position: relative;
`;
