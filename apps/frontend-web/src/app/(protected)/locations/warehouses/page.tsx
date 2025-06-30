'use client';

import React, { useEffect, useState, ChangeEvent } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Warehouse2D from '@/app/(protected)/locations/Warehouse2D';
import WarehouseSketchfab from '@/app/(protected)/locations/WarehouseSketchfab';
import PickingList from '@/app/(protected)/locations/PickingList';
import { locations, workers, nodes2D } from '@/app/(protected)/locations/LocationModel';
import { bfsRouteAvoidingWorkers, createAdjacency } from '@/app/(protected)/locations/BFSUtils';
import { FaMapMarkedAlt } from 'react-icons/fa';

// ===== Theme Tokens =====
const theme = {
  colors: {
    background: '#EAF5FA',
    surface: '#FFFFFF',
    border: '#d3e0e9',
    textPrimary: '#333333',
    textSecondary: '#666666',
    accent: '#5ce1e6',
    accentHover: '#54c6d6',
  },
  spacing: (n: number) => `${n * 8}px`,
  radii: { sm: '6px', md: '8px', lg: '12px' },
  font: {
    family: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
    sizes: { base: '1rem', title: '1.25rem', small: '0.9rem' },
  },
};

// ===== Global Styles =====
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background-color: ${theme.colors.background};
    color: ${theme.colors.textPrimary};
    font-family: ${theme.font.family};
  }
`;

// ===== Adjacency Setup =====
const adjacency2D = createAdjacency(
  nodes2D.map(n => n.id),
  [
    ['TL','TR'],['TR','BR'],['BR','BL'],['BL','TL'],
    ['H1L','H1R'],['H2L','H2R'],['H3L','H3R'],['H4L','H4R'],['H5L','H5R'],
    ['TL','H1L'],['H1L','H2L'],['H2L','H3L'],['H3L','H4L'],['H4L','H5L'],['H5L','BL'],
    ['TR','H1R'],['H1R','H2R'],['H2R','H3R'],['H3R','H4R'],['H4R','H5R'],['H5R','BR'],
  ]
);

// ===== Test Picklists =====
const testPicklists: Record<string,string[]> = {
  'Picklist 1': ['A1','A2','A3','B1','B2','B3','C1','C3'],
  'Picklist 2': ['A1','B1','C1'],
  'Picklist 3': ['A3','B3','C3'],
};

// ===== Helpers =====
function mapSlotToNode2D(slotId: string): string {
  const slot = locations.find(l => l.slotId === slotId);
  if (!slot) return 'TL';
  let best = 'TL';
  let bestDist = Infinity;
  nodes2D.forEach(n => {
    const dx = slot.x - n.x;
    const dy = slot.y - n.y;
    const d = Math.hypot(dx,dy);
    if (d < bestDist) { bestDist = d; best = n.id; }
  });
  return best;
}

// ===== Styled Components =====
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing(1)};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing(1)};
`;
const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing(1)};
`;
const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
`;
const Title = styled.h1`
  font-size: ${theme.font.sizes.title};
  margin: 0;
`;
const Subtitle = styled.p`
  font-size: ${theme.font.sizes.base};
  color: ${theme.colors.textSecondary};
  margin: 0;
`;
const ControlRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing(1)};
  flex-wrap: wrap;
`;
const Select = styled.select`
  padding: ${theme.spacing(0.5)};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.sm};
  font-size: ${theme.font.sizes.base};
  background: ${theme.colors.surface};
  color: ${theme.colors.textPrimary};
`;
const ActionButton = styled.button`
  background: ${theme.colors.accent};
  color: #fff;
  border: none;
  padding: ${theme.spacing(0.5)} ${theme.spacing(1)};
  border-radius: ${theme.radii.md};
  cursor: pointer;
  font-size: ${theme.font.sizes.base};
  transition: background 0.2s;
  &:hover { background: ${theme.colors.accentHover}; }
`;
const ButtonRow = styled.div`
  display: flex;
  gap: ${theme.spacing(0.5)};
`;
const TabButton = styled(ActionButton)<{ $active?: boolean }>`
  background: ${({ $active }) => $active ? theme.colors.accentHover : theme.colors.accent};
  opacity: ${({ $active }) => $active ? 1 : 0.8};
`;
const MainLayout = styled.div`
  display: flex;
  gap: ${theme.spacing(1)};
`;
const VisualizationArea = styled.div`
  flex: 1;
  min-height: 600px;
  background: ${theme.colors.surface};
  border-radius: ${theme.radii.md};
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  display: flex;
  align-items: center;
  justify-content: center;
`;
const InfoPanel = styled.div`
  width: 300px;
  background: ${theme.colors.surface};
  border-radius: ${theme.radii.md};
  padding: ${theme.spacing(1)};
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing(1)};
`;
const Section = styled.div`
  font-size: ${theme.font.sizes.small};
`;

// ===== Component =====
export default function LocationsDashboard() {
  const [viewMode, setViewMode] = useState<'2D'|'Sketchfab'>('2D');
  const [selectedPicklist, setSelectedPicklist] = useState<string>('Picklist 1');
  const [routeNodes, setRouteNodes] = useState<string[]|null>(null);
  const [pickingItems, setPickingItems] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [isCollected, setIsCollected] = useState<boolean>(false);

  const computeRoute = () => {
    const list = testPicklists[selectedPicklist] || [];
    if (!list.length) { setRouteNodes(null); setPickingItems([]); return; }
    let route:string[] = [];
    let curr = mapSlotToNode2D(list[0]);
    route.push(curr);
    for (let i=1;i<list.length;i++){
      const next = mapSlotToNode2D(list[i]);
      const seg = bfsRouteAvoidingWorkers(curr,next,adjacency2D,nodes2D,workers);
      if(seg){ if(route[route.length-1]===seg[0]) seg.shift(); route.push(...seg); curr=next; }
    }
    setRouteNodes(route);
    setPickingItems(locations.filter(l=>list.includes(l.slotId)));
    setIsCollected(false);
  };
  const clear = () => { setRouteNodes(null); setPickingItems([]); setIsCollected(false); };
  const estTime = routeNodes ? Math.round(routeNodes.length*0.5) : 0;

  return (
    <>
      <GlobalStyle />
      <Container>
        <Header>
          <FaMapMarkedAlt size={32} color={theme.colors.accent} />
          <TitleBlock>
            <Title>Almacén Interactivo</Title>
            <Subtitle>Picklist Demo</Subtitle>
          </TitleBlock>
        </Header>

        <ControlRow>
          <div>
            <label>Picklist:</label>
            <Select value={selectedPicklist} onChange={(e)=>setSelectedPicklist(e.target.value)}>
              {Object.keys(testPicklists).map(k=><option key={k} value={k}>{k}</option>)}
            </Select>
          </div>
          <ActionButton onClick={computeRoute}>Generar Ruta</ActionButton>
          <ActionButton onClick={clear}>Limpiar</ActionButton>
        </ControlRow>

        <ButtonRow>
          <TabButton $active={viewMode==='2D'} onClick={()=>setViewMode('2D')}>Vista 2D</TabButton>
          <TabButton $active={viewMode==='Sketchfab'} onClick={()=>setViewMode('Sketchfab')}>3D Avanzado</TabButton>
        </ButtonRow>

        <MainLayout>
          <VisualizationArea>
            {viewMode==='2D'
              ? <Warehouse2D routeNodes={routeNodes} onSlotClick={setSelectedLocation} selectedSlot={selectedLocation} />
              : <WarehouseSketchfab onClose={()=>setViewMode('2D')} />
            }
          </VisualizationArea>

          <InfoPanel>
            <Section>
              <h3>Detalles de Ubicación</h3>
              {selectedLocation ? (
                <>
                  <p><strong>Slot:</strong> {selectedLocation.slotId}</p>
                  <p><strong>SKU:</strong> {selectedLocation.productSku}</p>
                  <p><strong>Stock:</strong> {selectedLocation.stock}</p>
                  <p><strong>Clase:</strong> {selectedLocation.classType}</p>
                </>
              ) : <p>Selecciona un slot para ver detalles.</p>}
            </Section>

            <Section>
              <h3>Ruta Picklist</h3>
              {routeNodes && routeNodes.length>0 ? (
                <>
                  <p><strong>Ruta:</strong> {routeNodes.join(' → ')}</p>
                  <p><strong>Tiempo Estimado:</strong> {estTime} min</p>
                  <p><strong>Estado:</strong> {isCollected ? 'Recolectado' : 'Pendiente'}</p>
                  {!isCollected && <ActionButton onClick={()=>setIsCollected(true)}>Marcar Recolectado</ActionButton>}
                </>
              ) : <p>No hay ruta generada.</p>}
            </Section>

            <Section>
              <h3>Items Picklist</h3>
              <PickingList items={pickingItems} />
            </Section>
          </InfoPanel>
        </MainLayout>
      </Container>
    </>
  );
}