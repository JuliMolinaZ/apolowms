'use client';

import React, { useEffect, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Image from 'next/image';
import CappasityViewer from '@/components/Items/CappasityViewer';
import PickingList from '@/app/(protected)/locations/PickingList';
import { locations as allLocations, LocationData } from '@/app/(protected)/locations/LocationModel';
import { API_URL } from '@/lib/config';
import { FaCube, FaTimes } from 'react-icons/fa';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';

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
    danger: '#e53935',
    highlight: '#1976d2',
  },
  spacing: (n: number) => `${n * 8}px`,
  radii: { sm: '6px', md: '8px', lg: '12px' },
  font: {
    family: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
    sizes: { small: '0.9rem', base: '1rem', title: '1.25rem', large: '2rem' },
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

// ===== Models =====
interface LocationInfo {
  location: string;
  quantity: number;
  lastUpdate: string;
  status: 'OK' | 'LOW' | 'OUT';
}
interface Item {
  id: number;
  name: string;
  brand: string;
  price: number;
  stock: number;
  sku: string;
  description: string;
  image?: string;
  viewerUrl?: string;
  barcode?: string;
  otherStock?: LocationInfo[];
}

// ===== Sample Data =====
const sampleItems: Item[] = [
  { id:1, name:"Widget A", brand:"Brand X", price:120, stock:45, sku:"WX-001", description:"High quality widget.", image:"", barcode:"WX001", otherStock:[{location:"L1",quantity:20,lastUpdate:"2025-06-08",status:"OK"}]},
  { id:2, name:"Widget B", brand:"Brand Y", price:80,  stock:15, sku:"WY-002", description:"Economical widget.", image:"", barcode:"WY002", otherStock:[{location:"L2",quantity:5,lastUpdate:"2025-06-07",status:"LOW"}]},
  { id:3, name:"Gadget A", brand:"Brand X", price:200, stock:0,  sku:"GX-003", description:"Out-of-stock gadget.", image:"", barcode:"GX003", otherStock:[{location:"L1",quantity:0,lastUpdate:"2025-06-06",status:"OUT"}]},
  { id:4, name:"Gadget B", brand:"Brand Z", price:150, stock:30, sku:"GZ-004", description:"Popular gadget.", image:"", barcode:"GZ004", otherStock:[{location:"L3",quantity:30,lastUpdate:"2025-06-08",status:"OK"}]},
  { id:5, name:"Tool A",   brand:"Brand Y", price:60,  stock:10, sku:"TY-005", description:"Essential tool.", image:"", barcode:"TY005", otherStock:[{location:"L2",quantity:10,lastUpdate:"2025-06-07",status:"LOW"}]},
  { id:6, name:"Tool B",   brand:"Brand Z", price:90,  stock:55, sku:"TZ-006", description:"Advanced tool.", image:"", barcode:"TZ006", otherStock:[{location:"L3",quantity:55,lastUpdate:"2025-06-08",status:"OK"}]},
  { id:7, name:"Part A",   brand:"Brand X", price:30,  stock:5,  sku:"PX-007", description:"Spare part A.", image:"", barcode:"PX007", otherStock:[{location:"L1",quantity:5,lastUpdate:"2025-06-06",status:"LOW"}]},
  { id:8, name:"Part B",   brand:"Brand Y", price:40,  stock:0,  sku:"PY-008", description:"Spare part B.", image:"", barcode:"PY008", otherStock:[{location:"L2",quantity:0,lastUpdate:"2025-06-05",status:"OUT"}]},
  { id:9, name:"Accessory A",brand:"Brand Z", price:25, stock:25, sku:"AZ-009", description:"Accessory pack.", image:"", barcode:"AZ009", otherStock:[{location:"L3",quantity:25,lastUpdate:"2025-06-08",status:"OK"}]},
  { id:10,name:"Accessory B",brand:"Brand X", price:35, stock:18, sku:"AX-010", description:"Accessory pack B.", image:"", barcode:"AX010", otherStock:[{location:"L1",quantity:18,lastUpdate:"2025-06-07",status:"LOW"}]},
  { id:11,name:"Module A",  brand:"Brand Y", price:300,stock:65, sku:"MY-011", description:"Core module.", image:"", barcode:"MY011", otherStock:[{location:"L2",quantity:65,lastUpdate:"2025-06-08",status:"OK"}]},
  { id:12,name:"Module B",  brand:"Brand Z", price:250,stock:0,  sku:"MZ-012", description:"Limited edition.", image:"", barcode:"MZ012", otherStock:[{location:"L3",quantity:0,lastUpdate:"2025-06-06",status:"OUT"}]},
];

// ===== Helpers =====
const resolveImage = (img?: string) => img || '/logos/cube.svg';
const getStockData = (items: Item[]) => {
  const bins = { OK: 0, LOW: 0, OUT: 0 };
  items.forEach(i => {
    if (i.stock === 0) bins.OUT++;
    else if (i.stock <= 20) bins.LOW++;
    else bins.OK++;
  });
  return Object.entries(bins).map(([name, value]) => ({ name, value }));
};
const getBrandData = (items: Item[]) => {
  const map: Record<string, number> = {};
  items.forEach(i => {
    map[i.brand] = (map[i.brand] || 0) + 1;
  });
  return Object.entries(map).map(([brand, count]) => ({ brand, count }));
};

// ===== Styled Components =====
const Container = styled.div`
  max-width: 1200px; margin: 0 auto; padding: ${theme.spacing(2)};
  display: flex; flex-direction: column; gap: ${theme.spacing(2)};
`;
const Header = styled.div`
  display: flex; align-items: center; gap: ${theme.spacing(1)};
`;
const Title = styled.h1`
  font-size: ${theme.font.sizes.large}; margin: 0;
`;
const Count = styled.span`
  font-size: ${theme.font.sizes.title};
  color: ${theme.colors.highlight};
  margin-left: ${theme.spacing(1)};
`;
const FilterBar = styled.div`
  display: flex; gap: ${theme.spacing(1)}; flex-wrap: wrap;
  background: ${theme.colors.surface};
  padding: ${theme.spacing(1)};
  border-radius: ${theme.radii.md};
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
`;
const FilterInput = styled.input`
  flex: 1 1 200px;
  padding: ${theme.spacing(0.5)};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.sm};
  font-size: ${theme.font.sizes.base};
`;
const FilterSelect = styled.select`
  flex: 1 1 150px;
  padding: ${theme.spacing(0.5)};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.sm};
  font-size: ${theme.font.sizes.base};
`;
const Charts = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing(2)};
  height: 300px;
`;
const ChartBox = styled.div`
  background: ${theme.colors.surface};
  border-radius: ${theme.radii.md};
  padding: ${theme.spacing(1)};
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
`;
const ItemsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill,minmax(240px,1fr));
  gap: ${theme.spacing(2)};
`;
const Card = styled.div`
  background: ${theme.colors.surface};
  border-radius: ${theme.radii.lg};
  padding: ${theme.spacing(2)};
  text-align: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  transition: transform 0.2s, box-shadow 0.2s;
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  }
`;
const ImageWrapper = styled.div`
  position: relative; width:100%; height:180px;
  overflow:hidden; border-radius:${theme.radii.md};
  background:#f8f8f8;
`;
const ItemName = styled.h3`
  margin: ${theme.spacing(1)} 0 ${theme.spacing(0.5)};
  font-size: ${theme.font.sizes.base};
`;
const ItemBrand = styled.div`
  font-size:${theme.font.sizes.small};
  color:${theme.colors.textSecondary};
`;
const ItemPrice = styled.div`
  font-size:${theme.font.sizes.base};
  color:${theme.colors.danger};
  font-weight:600;
`;
const LoadMore = styled.button`
  background:${theme.colors.accent}; color:#fff; border:none;
  padding:${theme.spacing(1)} ${theme.spacing(2)};
  border-radius:${theme.radii.md}; cursor:pointer;
  font-size:${theme.font.sizes.base};
  align-self:center; transition:background 0.2s;
  &:hover{background:${theme.colors.accentHover};}
`;
const TableContainer = styled.div`
  background:${theme.colors.surface};
  border-radius:${theme.radii.lg};
  padding:${theme.spacing(2)};
  box-shadow:0 2px 8px rgba(0,0,0,0.05);
  overflow-x:auto;
`;
const StyledTable = styled.table`
  width:100%; border-collapse:collapse;
  th, td { border:1px solid ${theme.colors.border}; padding:${theme.spacing(1)}; text-align:left; }
  th { background:${theme.colors.accentHover}20; position:sticky; top:0; }
  tbody tr:hover { background:${theme.colors.accentHover}10; }
`;
const Pagination = styled.div`
  display:flex; justify-content:center; gap:${theme.spacing(1)}; margin-top:${theme.spacing(1)};
`;
const PageButton = styled.button`
  padding:${theme.spacing(0.5)} ${theme.spacing(1)};
  border:1px solid ${theme.colors.border};
  background:${theme.colors.surface};
  cursor:pointer; border-radius:${theme.radii.sm};
  font-size:${theme.font.sizes.base};
  &:disabled{opacity:0.5; cursor:default;}
`;
const DetailOverlay = styled.div`
  position:fixed; top:0; left:0; right:0; bottom:0;
  background:rgba(0,0,0,0.4);
  display:flex; align-items:center; justify-content:center;
  z-index:1000;
`;
const DetailCard = styled.div`
  background:${theme.colors.surface};
  border-radius:${theme.radii.lg};
  width:90%; max-width:900px;
  padding:${theme.spacing(3)};
  box-shadow:0 6px 20px rgba(0,0,0,0.15);
  position:relative;
`;
const CloseButton = styled.button`
  position:absolute; top:${theme.spacing(1)}; right:${theme.spacing(1)};
  background:none; border:none; font-size:${theme.font.sizes.large};
  cursor:pointer; color:${theme.colors.textSecondary};
  &:hover{color:${theme.colors.accent};}
`;
const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing(2)};
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;
const LeftCol = styled.div`
  display: flex; flex-direction: column; gap: ${theme.spacing(1)};
`;
const RightCol = styled.div`
  display: flex; flex-direction: column; gap: ${theme.spacing(1)};
`;
const ProductImage = styled.div`
  width:100%; height:300px;
  background:#fafafa; border-radius:${theme.radii.md};
  overflow:hidden; display:flex; align-items:center; justify-content:center;
`;
const InfoRow = styled.div`
  display:flex; justify-content:space-between; flex-wrap:wrap; gap:${theme.spacing(1)};
`;
const InfoBlock = styled.div`
  flex: 1;
`;
const Label = styled.div`
  font-weight:600; color:${theme.colors.textPrimary};
  margin-bottom:${theme.spacing(0.5)};
`;
const Value = styled.div`
  color:${theme.colors.textSecondary};
`;
const BottomSection = styled.div`
  margin-top:${theme.spacing(2)};
`;
const LocationsTable = styled.table`
  width:100%; border-collapse:collapse; font-size:${theme.font.sizes.small};
  thead th { padding:${theme.spacing(0.5)}; background:${theme.colors.accentHover}20; color:${theme.colors.textSecondary}; font-weight:600; }
  tbody tr { border-bottom:1px solid ${theme.colors.border}; }
  td { padding:${theme.spacing(0.5)}; color:${theme.colors.textSecondary}; }
`;
const StatusBadge = styled.span<{status:'OK'|'LOW'|'OUT'}>`
  padding:${theme.spacing(0.3)} ${theme.spacing(0.5)};
  border-radius:${theme.radii.sm};
  font-size:${theme.font.sizes.small};
  text-transform:uppercase;
  background-color:${props =>
    props.status==='OK'? '#C8E6C9':
    props.status==='LOW'? '#FFE082':'#FFCDD2'};
  color:${props =>
    props.status==='OK'? '#2E7D32':
    props.status==='LOW'? '#795548':'#C62828'};
`;

// ===== Component =====
export default function ItemsDashboard() {
  const [items, setItems] = useState<Item[]>([]);
  const [selected, setSelected] = useState<Item|null>(null);
  const [filterName, setFilterName] = useState('');
  const [filterBrand, setFilterBrand] = useState('All');
  const [visibleCount, setVisibleCount] = useState(8); // show 8 initially
  const [tablePage, setTablePage] = useState(1);

  useEffect(() => {
    setItems(sampleItems);
  }, []);

  const brands = Array.from(new Set(items.map(i => i.brand)));
  const filtered = items.filter(i =>
    i.name.toLowerCase().includes(filterName.toLowerCase()) &&
    (filterBrand === 'All' || i.brand === filterBrand)
  );

  const pageCount = Math.ceil(filtered.length / 10);
  const tableData = filtered.slice((tablePage - 1) * 10, tablePage * 10);

  const defaultLoc = allLocations[0];
  const pickingListData: LocationData[] = (selected?.otherStock || []).map(info => {
    const full = allLocations.find(l => l.slotId === info.location);
    return full
      ? full
      : { ...defaultLoc, slotId: info.location, stock: info.quantity };
  });

  return (
    <>
      <GlobalStyle />
      <Container>
        <Header>
          <FaCube size={32} color={theme.colors.accent} />
          <Title>Items <Count>{filtered.length}</Count></Title>
        </Header>

        {/* Prominent Filters */}
        <FilterBar>
          <FilterInput
            placeholder="Buscar por nombre..."
            value={filterName}
            onChange={e => setFilterName(e.target.value)}
          />
          <FilterSelect
            value={filterBrand}
            onChange={e => setFilterBrand(e.target.value)}
          >
            <option>All</option>
            {brands.map(b => <option key={b}>{b}</option>)}
          </FilterSelect>
        </FilterBar>

        {/* Charts reflecting filtered items */}
        <Charts>
          <ChartBox>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getBrandData(filtered)}>
                <XAxis dataKey="brand" stroke={theme.colors.textSecondary}/>
                <YAxis stroke={theme.colors.textSecondary}/>
                <Tooltip/>
                <Bar dataKey="count" fill={theme.colors.accent}/>
              </BarChart>
            </ResponsiveContainer>
          </ChartBox>
          <ChartBox>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={getStockData(filtered)}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {getStockData(filtered).map((d,i) => (
                    <Cell key={i} fill={[
                      theme.colors.accent,
                      theme.colors.accentHover,
                      theme.colors.danger
                    ][i]}/>
                  ))}
                </Pie>
                <Tooltip/>
                <Legend verticalAlign="bottom"/>
              </PieChart>
            </ResponsiveContainer>
          </ChartBox>
        </Charts>

        {/* Items Grid, show 8 */}
        <ItemsGrid>
          {filtered.slice(0, visibleCount).map(item => (
            <Card key={item.id} onClick={() => setSelected(item)}>
              <ImageWrapper>
                <Image
                  src={resolveImage(item.image)}
                  alt={item.name}
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </ImageWrapper>
              <ItemName>{item.name}</ItemName>
              <ItemBrand>{item.brand}</ItemBrand>
              <ItemPrice>${item.price}</ItemPrice>
            </Card>
          ))}
        </ItemsGrid>
        {visibleCount < filtered.length && (
          <LoadMore onClick={() => setVisibleCount(c => c + 8)}>
            Ver más
          </LoadMore>
        )}

        {/* Paginated Table */}
        <TableContainer>
          <StyledTable>
            <thead>
              <tr>
                <th>ID</th><th>Name</th><th>Brand</th><th>Stock</th><th>SKU</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map(i => (
                <tr key={i.id}>
                  <td>{i.id}</td>
                  <td>{i.name}</td>
                  <td>{i.brand}</td>
                  <td>{i.stock}</td>
                  <td>{i.sku}</td>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </TableContainer>

        <Pagination>
          <PageButton
            disabled={tablePage <= 1}
            onClick={() => setTablePage(p => p - 1)}
          >Prev</PageButton>
          {[...Array(pageCount)].map((_, idx) => (
            <PageButton
              key={idx}
              disabled={tablePage === idx + 1}
              onClick={() => setTablePage(idx + 1)}
            >{idx + 1}</PageButton>
          ))}
          <PageButton
            disabled={tablePage >= pageCount}
            onClick={() => setTablePage(p => p + 1)}
          >Next</PageButton>
        </Pagination>

        {/* Detail Overlay */}
        {selected && (
          <DetailOverlay>
            <DetailCard>
              <CloseButton onClick={() => setSelected(null)}>
                <FaTimes />
              </CloseButton>
              <DetailGrid>
                <LeftCol>
                  <ProductImage>
                    {selected.viewerUrl
                      ? <CappasityViewer src={selected.viewerUrl} />
                      : <Image
                          src={resolveImage(selected.image)}
                          alt={selected.name}
                          fill
                          style={{ objectFit: 'contain' }}
                        />
                    }
                  </ProductImage>
                  <InfoRow>
                    <InfoBlock>
                      <Label>Precio</Label>
                      <Value>${selected.price}</Value>
                    </InfoBlock>
                    <InfoBlock>
                      <Label>Stock</Label>
                      <Value style={{ color: theme.colors.highlight }}>
                        {selected.stock}
                      </Value>
                    </InfoBlock>
                  </InfoRow>
                  <InfoBlock>
                    <Label>Descripción</Label>
                    <Value>{selected.description}</Value>
                  </InfoBlock>
                </LeftCol>

                <RightCol>
                  <InfoBlock>
                    <Label>Nombre</Label>
                    <Value>{selected.name}</Value>
                  </InfoBlock>
                  <InfoBlock>
                    <Label>SKU</Label>
                    <Value>{selected.sku}</Value>
                  </InfoBlock>
                  <InfoBlock>
                    <Label>Marca</Label>
                    <Value>{selected.brand}</Value>
                  </InfoBlock>

                  {selected.otherStock && (
                    <BottomSection>
                      <Label>Otras Ubicaciones</Label>
                      <LocationsTable>
                        <thead>
                          <tr>
                            <th>Loc</th><th>Cant</th><th>Fecha</th><th>Estado</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selected.otherStock.map((loc,i)=>(
                            <tr key={i}>
                              <td>{loc.location}</td>
                              <td style={{ color: theme.colors.highlight }}>
                                {loc.quantity}
                              </td>
                              <td>{loc.lastUpdate}</td>
                              <td>
                                <StatusBadge status={loc.status}>
                                  {loc.status}
                                </StatusBadge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </LocationsTable>
                    </BottomSection>
                  )}

                  <BottomSection>
                    <Label>Picking List</Label>
                    <PickingList items={
                      (selected.otherStock || []).map(info => {
                        const full = allLocations.find(l => l.slotId === info.location);
                        return full
                          ? full
                          : { ...allLocations[0], slotId: info.location, stock: info.quantity };
                      })
                    }/>
                  </BottomSection>
                </RightCol>
              </DetailGrid>
            </DetailCard>
          </DetailOverlay>
        )}
      </Container>
    </>
  );
}
