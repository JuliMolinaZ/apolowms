"use client";

import React from "react";
import styled, { keyframes } from "styled-components";
import { locations } from "../locations/LocationModel";

// Animación para la ruta (efecto de trazo en movimiento)
const dashAnimation = keyframes`
  to {
    stroke-dashoffset: 0;
  }
`;

// Componente para la ruta animada
const AnimatedPolyline = styled.polyline`
  stroke-dasharray: 10;
  stroke-dashoffset: 20;
  animation: ${dashAnimation} 2s linear infinite;
`;

const SvgContainer = styled.svg`
  width: 100%;
  height: 100%;
  background: #eef2f3;
`;

// Animación de aparición para los labels
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

// Etiqueta principal de zona
const ZoneLabel = styled.text`
  font-family: 'Segoe UI', sans-serif;
  font-size: 20px;
  fill: #fff;
  font-weight: bold;
  pointer-events: none;
  opacity: 0;
  animation: ${fadeIn} 1s forwards;
`;

// Sub-etiqueta para subnombres o detalles
const SubLabel = styled.text`
  font-family: 'Segoe UI', sans-serif;
  font-size: 14px;
  fill: #fff;
  pointer-events: none;
  opacity: 0;
  animation: ${fadeIn} 1.5s forwards;
`;

interface Warehouse2DProps {
  /**
   * Array de IDs de nodos que conforman la ruta BFS.
   * Por ejemplo: ["A1", "H2L", "H2R", "B3", ...]
   */
  routeNodes?: string[] | null;
  onSlotClick: (zone: any) => void;
  selectedSlot: any;
}

/**
 * Convierte un nodeId (por ejemplo, "A1") en coordenadas (x,y)
 * utilizando:
 *   1) Si es un slot, se toma la posición de `locations`.
 *   2) Si es una zona genérica (p.ej. "almacenamiento"), se usa un fallback.
 */
function getCoordinatesForNode(nodeId: string): { x: number; y: number } {
  const loc = locations.find((l) => l.slotId === nodeId);
  if (loc) {
    return { x: loc.x, y: loc.y };
  }
  const fallback: Record<string, { x: number; y: number }> = {
    recepcion: { x: 195, y: 150 },
    almacenamiento: { x: 440, y: 270 },
    pasilloPicking: { x: 955, y: 270 },
    picking: { x: 1230, y: 270 },
    pasilloPacking: { x: 955, y: 640 },
    packing: { x: 1230, y: 640 },
    calidad: { x: 195, y: 640 },
    oficinas: { x: 270, y: 860 },
    despacho: { x: 1230, y: 910 },
  };
  return fallback[nodeId] || { x: 50, y: 50 };
}

const Warehouse2D: React.FC<Warehouse2DProps> = ({ routeNodes, onSlotClick, selectedSlot }) => {
  // Maneja el clic en una zona o elemento
  const handleZoneClick = (zone: any) => {
    onSlotClick(zone);
  };

  // Construye el string de puntos para el polyline a partir de los IDs de la ruta
  let routePoints = "";
  if (routeNodes && routeNodes.length > 0) {
    routePoints = routeNodes
      .map((nodeId) => {
        const { x, y } = getCoordinatesForNode(nodeId);
        return `${x},${y}`;
      })
      .join(" ");
  }

  // Renderiza los racks (ejemplo para la zona de Almacenamiento)
  const renderRacks = (
    startX: number,
    startY: number,
    columns: number,
    rows: number,
    rackWidth: number,
    rackHeight: number,
    gap: number,
    zoneName: string
  ) => {
    const racks = [];
    for (let col = 0; col < columns; col++) {
      for (let row = 0; row < rows; row++) {
        const x = startX + col * (rackWidth + gap);
        const y = startY + row * (rackHeight + gap);
        racks.push(
          <g
            key={`rack-${zoneName}-${col}-${row}`}
            onClick={() =>
              handleZoneClick({ id: `${zoneName}-rack-${col}-${row}`, label: `${zoneName} Rack ${col}-${row}` })
            }
            style={{ cursor: "pointer" }}
          >
            <rect
              x={x}
              y={y}
              width={rackWidth}
              height={rackHeight}
              fill="url(#gradRacks)"
              stroke="#333"
              strokeWidth="1"
              rx="2"
              ry="2"
            />
            <SubLabel x={x + rackWidth / 2} y={y + rackHeight / 2} textAnchor="middle" dominantBaseline="middle">
              {`${col}-${row}`}
            </SubLabel>
          </g>
        );
      }
    }
    return racks;
  };

  // Renderiza los bins para Picking
  const renderBins = (
    startX: number,
    startY: number,
    columns: number,
    rows: number,
    binWidth: number,
    binHeight: number,
    gap: number,
    zoneName: string
  ) => {
    const bins = [];
    for (let col = 0; col < columns; col++) {
      for (let row = 0; row < rows; row++) {
        const x = startX + col * (binWidth + gap);
        const y = startY + row * (binHeight + gap);
        bins.push(
          <g
            key={`bin-${zoneName}-${col}-${row}`}
            onClick={() =>
              handleZoneClick({ id: `${zoneName}-bin-${col}-${row}`, label: `${zoneName} Bin ${col}-${row}` })
            }
            style={{ cursor: "pointer" }}
          >
            <rect
              x={x}
              y={y}
              width={binWidth}
              height={binHeight}
              fill="url(#gradPicking)"
              stroke="#555"
              strokeWidth="1"
              rx="2"
              ry="2"
            />
            <SubLabel x={x + binWidth / 2} y={y + binHeight / 2} textAnchor="middle" dominantBaseline="middle">
              {`${col}-${row}`}
            </SubLabel>
          </g>
        );
      }
    }
    return bins;
  };

  // Renderiza las estaciones de Packing
  const renderPackingStations = (
    startX: number,
    startY: number,
    count: number,
    stationWidth: number,
    stationHeight: number,
    gap: number,
    zoneName: string
  ) => {
    const stations = [];
    for (let i = 0; i < count; i++) {
      const x = startX + i * (stationWidth + gap);
      stations.push(
        <g
          key={`packing-${zoneName}-${i}`}
          onClick={() =>
            handleZoneClick({ id: `${zoneName}-packing-${i}`, label: `${zoneName} Packing ${i + 1}` })
          }
          style={{ cursor: "pointer" }}
        >
          <rect
            x={x}
            y={startY}
            width={stationWidth}
            height={stationHeight}
            fill="url(#gradPacking)"
            stroke="#444"
            strokeWidth="1"
            rx="4"
            ry="4"
          />
          <SubLabel
            x={x + stationWidth / 2}
            y={startY + stationHeight / 2}
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {`${i + 1}`}
          </SubLabel>
        </g>
      );
    }
    return stations;
  };

  return (
    <SvgContainer viewBox="0 0 1500 1000">
      <defs>
        <linearGradient id="gradRecepcion" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: "#ff7e5f", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#feb47b", stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="gradRacks" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#6a11cb", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#2575fc", stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="gradPicking" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: "#ff9966", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#ff5e62", stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="gradPacking" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: "#00b09b", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#96c93d", stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="gradDespacho" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: "#ff5e62", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#ff9966", stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="gradCalidad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: "#00c6ff", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#0072ff", stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="gradOficinas" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: "#f7971e", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#ffd200", stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* Nombre del Almacén */}
      <text
        x="750"
        y="50"
        textAnchor="middle"
        fontFamily="Segoe UI, sans-serif"
        fontSize="32"
        fill="#333"
        fontWeight="bold"
      >
        Warehouse Demo - Ultimate Impact
      </text>

      {/* Zona de Recepción */}
      <g onClick={() => handleZoneClick({ id: "recepcion", label: "Recepción" })} style={{ cursor: "pointer" }}>
        <rect x="20" y="80" width="350" height="140" fill="url(#gradRecepcion)" stroke="#333" strokeWidth="2" rx="15" ry="15" />
        <ZoneLabel x="195" y="150" textAnchor="middle" dominantBaseline="middle">
          Recepción
        </ZoneLabel>
        <SubLabel x="195" y="180" textAnchor="middle" dominantBaseline="middle">
          Check-In & Salida
        </SubLabel>
      </g>

      {/* Zona de Almacenamiento */}
      <g onClick={() => handleZoneClick({ id: "almacenamiento", label: "Almacenamiento" })} style={{ cursor: "pointer" }}>
        <rect x="20" y="240" width="840" height="350" fill="#fff" stroke="#333" strokeWidth="2" rx="15" ry="15" />
        <ZoneLabel x="440" y="270" textAnchor="middle" dominantBaseline="middle" style={{ fill: "#333", fontSize: "24px" }}>
          Almacenamiento
        </ZoneLabel>
        <SubLabel x="440" y="300" textAnchor="middle" dominantBaseline="middle">
          Racks y Estanterías
        </SubLabel>
        {renderRacks(40, 320, 8, 4, 80, 40, 12, "Almacenamiento")}
      </g>

      {/* Pasillo de Picking */}
      <g onClick={() => handleZoneClick({ id: "pasilloPicking", label: "Pasillo de Picking" })} style={{ cursor: "pointer" }}>
        <rect x="880" y="240" width="150" height="350" fill="#c8d6e5" stroke="#777" strokeDasharray="5,5" strokeWidth="2" rx="10" ry="10" />
        <ZoneLabel x="955" y="270" textAnchor="middle" dominantBaseline="middle" style={{ fill: "#333", fontSize: "20px" }}>
          Pasillo
        </ZoneLabel>
        <SubLabel x="955" y="300" textAnchor="middle" dominantBaseline="middle">
          de Picking
        </SubLabel>
      </g>

      {/* Zona de Picking */}
      <g onClick={() => handleZoneClick({ id: "picking", label: "Picking" })} style={{ cursor: "pointer" }}>
        <rect x="1080" y="240" width="300" height="200" fill="url(#gradPicking)" stroke="#333" strokeWidth="2" rx="15" ry="15" />
        <ZoneLabel x="1230" y="270" textAnchor="middle" dominantBaseline="middle">
          Picking
        </ZoneLabel>
        <SubLabel x="1230" y="300" textAnchor="middle" dominantBaseline="middle">
          Contenedores
        </SubLabel>
        {renderBins(1100, 280, 6, 2, 40, 40, 8, "Picking")}
      </g>

      {/* Pasillo de Packing */}
      <g onClick={() => handleZoneClick({ id: "pasilloPacking", label: "Pasillo de Packing" })} style={{ cursor: "pointer" }}>
        <rect x="880" y="610" width="150" height="250" fill="#c8d6e5" stroke="#777" strokeDasharray="5,5" strokeWidth="2" rx="10" ry="10" />
        <ZoneLabel x="955" y="640" textAnchor="middle" dominantBaseline="middle" style={{ fill: "#333", fontSize: "20px" }}>
          Pasillo
        </ZoneLabel>
        <SubLabel x="955" y="670" textAnchor="middle" dominantBaseline="middle">
          de Packing
        </SubLabel>
      </g>

      {/* Zona de Packing */}
      <g onClick={() => handleZoneClick({ id: "packing", label: "Packing" })} style={{ cursor: "pointer" }}>
        <rect x="1080" y="610" width="300" height="250" fill="url(#gradPacking)" stroke="#333" strokeWidth="2" rx="15" ry="15" />
        <ZoneLabel x="1230" y="640" textAnchor="middle" dominantBaseline="middle">
          Packing
        </ZoneLabel>
        <SubLabel x="1230" y="670" textAnchor="middle" dominantBaseline="middle">
          Estaciones
        </SubLabel>
        {renderPackingStations(1100, 650, 5, 40, 40, 10, "Packing")}
      </g>

      {/* Zona de Calidad */}
      <g onClick={() => handleZoneClick({ id: "calidad", label: "Calidad" })} style={{ cursor: "pointer" }}>
        <rect x="20" y="610" width="350" height="180" fill="url(#gradCalidad)" stroke="#333" strokeWidth="2" rx="15" ry="15" />
        <ZoneLabel x="195" y="640" textAnchor="middle" dominantBaseline="middle">
          Calidad
        </ZoneLabel>
        <SubLabel x="195" y="670" textAnchor="middle" dominantBaseline="middle">
          Control
        </SubLabel>
      </g>

      {/* Zona de Oficinas */}
      <g onClick={() => handleZoneClick({ id: "oficinas", label: "Oficinas" })} style={{ cursor: "pointer" }}>
        <rect x="20" y="810" width="500" height="150" fill="url(#gradOficinas)" stroke="#333" strokeWidth="2" rx="15" ry="15" />
        <ZoneLabel x="270" y="860" textAnchor="middle" dominantBaseline="middle">
          Oficinas
        </ZoneLabel>
        <SubLabel x="270" y="890" textAnchor="middle" dominantBaseline="middle">
          Administración
        </SubLabel>
      </g>

      {/* Zona de Despacho */}
      <g onClick={() => handleZoneClick({ id: "despacho", label: "Despacho" })} style={{ cursor: "pointer" }}>
        <rect x="1080" y="880" width="300" height="80" fill="url(#gradDespacho)" stroke="#333" strokeWidth="2" rx="15" ry="15" />
        <ZoneLabel x="1230" y="910" textAnchor="middle" dominantBaseline="middle">
          Despacho
        </ZoneLabel>
        <SubLabel x="1230" y="935" textAnchor="middle" dominantBaseline="middle">
          Salida
        </SubLabel>
      </g>

      {/* Rutas animadas fijas (ejemplo) */}
      <AnimatedPolyline
        points="1100,320 1050,320 1050,400 1080,400 1080,480 1100,480"
        fill="none"
        stroke="#ff0000"
        strokeWidth="4"
      />
      <AnimatedPolyline
        points="1100,650 1050,650 1050,730 1080,730 1080,810 1100,810"
        fill="none"
        stroke="#0000ff"
        strokeWidth="4"
      />

      {/* Ruta generada por la Picklist, usando las coordenadas reales */}
      {routeNodes && routeNodes.length > 0 && (
        <AnimatedPolyline
          points={routePoints}
          fill="none"
          stroke="#00aa00"
          strokeWidth="3"
        />
      )}
    </SvgContainer>
  );
};

export default Warehouse2D;
