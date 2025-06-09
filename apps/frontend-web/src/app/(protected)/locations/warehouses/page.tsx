"use client";

import Warehouse2D              from "../../(protected)/locations/Warehouse2D";
import WarehouseSketchfab       from "../../(protected)/locations/WarehouseSketchfab";
import PickingList              from "../../(protected)/locations/PickingList";
import { locations, workers, nodes2D } from "../../(protected)/locations/LocationModel";
import { bfsRouteAvoidingWorkers, createAdjacency } from "../../(protected)/locations/BFSUtils";
import { useState } from "react";
import styled from "styled-components";

/** Función para mapear un slot a su nodo más cercano en 2D */
function mapSlotToNode2D(slotId: string): string {
  const slot = locations.find((l) => l.slotId === slotId);
  if (!slot) return "TL";
  let best = "TL";
  let bestDist = Infinity;
  for (const n of nodes2D) {
    const dx = slot.x - n.x;
    const dy = slot.y - n.y;
    const dist = Math.hypot(dx, dy);
    if (dist < bestDist) {
      bestDist = dist;
      best = n.id;
    }
  }
  return best;
}

// Creamos la tabla de adyacencia para nodos2D
const adjacency2D = createAdjacency(
  nodes2D.map((n) => n.id),
  [
    ["TL", "TR"], ["TR", "BR"], ["BR", "BL"], ["BL", "TL"],
    ["H1L", "H1R"],
    ["H2L", "H2R"],
    ["H3L", "H3R"],
    ["H4L", "H4R"],
    ["H5L", "H5R"],
    ["TL", "H1L"], ["H1L", "H2L"], ["H2L", "H3L"],
    ["H3L", "H4L"], ["H4L", "H5L"], ["H5L", "BL"],
    ["TR", "H1R"], ["H1R", "H2R"], ["H2R", "H3R"],
    ["H3R", "H4R"], ["H4R", "H5R"], ["H5R", "BR"],
  ]
);

// Definimos algunos Picklists de prueba
const testPicklists: Record<string, string[]> = {
  "Picklist 1": ["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C3"],
  "Picklist 2": ["A1", "B1", "C1"],
  "Picklist 3": ["A3", "B3", "C3"],
};

export default function LocationsPage() {
  // Solo tendremos vista 2D y Sketchfab (modelo avanzado)
  const [viewMode, setViewMode] = useState<"2D" | "Sketchfab">("2D");
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [selectedPicklistKey, setSelectedPicklistKey] = useState<string>("Picklist 1");
  const [routeNodes, setRouteNodes] = useState<string[] | null>(null);
  const [pickingItems, setPickingItems] = useState<any[]>([]);
  const [isCollected, setIsCollected] = useState<boolean>(false);

  const handleSlotClick = (loc: any) => {
    setSelectedLocation(loc);
  };

  // Calcula la ruta concatenada para recorrer todos los slots del Picklist
  const computePicklistRoute = () => {
    const picklist = testPicklists[selectedPicklistKey];
    if (!picklist || picklist.length === 0) {
      setRouteNodes(null);
      setPickingItems([]);
      return;
    }
    let fullRoute: string[] = [];
    // Inicia desde el primer slot del Picklist
    let currentNode = mapSlotToNode2D(picklist[0]);
    fullRoute.push(currentNode);
    for (let i = 1; i < picklist.length; i++) {
      const nextNode = mapSlotToNode2D(picklist[i]);
      const routeSegment = bfsRouteAvoidingWorkers(currentNode, nextNode, adjacency2D, nodes2D, workers);
      if (routeSegment) {
        // Evitar duplicar el nodo de conexión
        if (fullRoute[fullRoute.length - 1] === routeSegment[0]) {
          routeSegment.shift();
        }
        fullRoute = fullRoute.concat(routeSegment);
        currentNode = nextNode;
      }
    }
    setRouteNodes(fullRoute);
    setIsCollected(false);
    const items = locations.filter((loc) => picklist.includes(loc.slotId));
    setPickingItems(items);
  };

  const clearRoute = () => {
    setRouteNodes(null);
    setPickingItems([]);
    setIsCollected(false);
  };

  // Estimamos el tiempo (por ejemplo, 0.5 minutos por nodo recorrido)
  const estimatedTime = routeNodes ? Math.round(routeNodes.length * 0.5) : 0;

  return (
    <PageContainer>
      <HeaderRow>
        <PageTitle>Almacén Interactivo - Picklist Demo</PageTitle>
      </HeaderRow>

      <ControlRow>
        <div>
          <label>Selecciona Picklist:</label>
          <select
            value={selectedPicklistKey}
            onChange={(e) => setSelectedPicklistKey(e.target.value)}
            style={{ marginLeft: "0.5rem", marginRight: "1rem" }}
          >
            {Object.keys(testPicklists).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </div>
        <Button onClick={computePicklistRoute}>Generar Ruta Picklist</Button>
        <Button onClick={clearRoute}>Limpiar Ruta</Button>
      </ControlRow>

      <ButtonRow>
        <TabButton $active={viewMode === "2D"} onClick={() => setViewMode("2D")}>
          Vista 2D
        </TabButton>
        <TabButton $active={viewMode === "Sketchfab"} onClick={() => setViewMode("Sketchfab")}>
          Modelo Avanzado
        </TabButton>
      </ButtonRow>

      <MainLayout>
        <VisualizationArea>
          {viewMode === "2D" && (
            <Warehouse2D
              routeNodes={routeNodes}
              onSlotClick={handleSlotClick}
              selectedSlot={selectedLocation}
            />
          )}
          {viewMode === "Sketchfab" && (
            <WarehouseSketchfab onClose={() => setViewMode("2D")} />
          )}
        </VisualizationArea>

        <InfoPanel>
          <Section>
            <h3>Detalles de la Ubicación</h3>
            {selectedLocation ? (
              <>
                <p>
                  <strong>Slot:</strong> {selectedLocation.slotId}
                </p>
                <p>
                  <strong>SKU:</strong> {selectedLocation.productSku}
                </p>
                <p>
                  <strong>Stock:</strong> {selectedLocation.stock}
                </p>
                <p>
                  <strong>Clase:</strong> {selectedLocation.classType}
                </p>
              </>
            ) : (
              <p>Selecciona una ubicación para ver detalles</p>
            )}
          </Section>

          <Section>
            <h3>Detalles de Ruta Picklist</h3>
            {routeNodes && routeNodes.length > 0 ? (
              <>
                <p>
                  <strong>Ruta:</strong> {routeNodes.join(" -> ")}
                </p>
                <p>
                  <strong>Tiempo estimado:</strong> {estimatedTime} minutos
                </p>
                <p>
                  <strong>Estado:</strong> {isCollected ? "Recolectado" : "Pendiente"}
                </p>
                {!isCollected && (
                  <Button onClick={() => setIsCollected(true)}>Marcar como Recolectado</Button>
                )}
              </>
            ) : (
              <p>No se ha generado una ruta.</p>
            )}
          </Section>

          <Section>
            <PickingList items={pickingItems} />
          </Section>
        </InfoPanel>
      </MainLayout>
    </PageContainer>
  );
}

const PageContainer = styled.div`
  width: 100%;
  min-height: calc(100vh - 60px);
  padding: 1rem 2rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  color: #000;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const PageTitle = styled.h2`
  font-size: 1.5rem;
  color: #000;
  margin: 0;
`;

const ControlRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  color: #000;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Button = styled.button`
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 0.4rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 0.9rem;
  &:hover {
    background-color: #0056b3;
  }
`;

// Usamos transient prop para evitar pasar "active" al DOM:
const TabButton = styled(Button)<{ $active?: boolean }>`
  background-color: ${({ $active }) => ($active ? "#0056b3" : "#007bff")};
  opacity: ${({ $active }) => ($active ? 1 : 0.8)};
`;

const MainLayout = styled.div`
  display: flex;
  flex: 1;
  gap: 1rem;
`;

const VisualizationArea = styled.div`
  flex: 1;
  min-height: 700px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  color: #000;
`;

const InfoPanel = styled.div`
  width: 300px;
  min-height: 200px;
  background: #fff;
  border-radius: 0.4rem;
  padding: 1rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  color: #000;
`;

const Section = styled.div`
  margin-bottom: 1rem;
`;
