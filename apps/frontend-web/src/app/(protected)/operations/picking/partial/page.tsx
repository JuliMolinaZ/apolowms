'use client';
import React, { useEffect, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { ShoppingCart, Clock, PackageCheck, PauseCircle } from 'lucide-react';

// ===== Theme Tokens =====
const theme = {
  colors: {
    background: '#EAF5FA',
    cardBg: '#FFFFFF',
    hoverBg: '#f4f9fc',
    border: '#d3e0e9',
    text: '#333333',
    accent: '#5ce1e6',
    accentHover: '#54c6d6',
  },
  spacing: (n: number) => `${n * 8}px`,
  radii: {
    sm: '6px',
    md: '8px',
    lg: '12px',
  },
  font: {
    family: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
    small: '0.9rem',
    base: '1rem',
    title: '1.1rem',
    large: '2rem',
  },
};

// ===== Global Styles =====
const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${theme.colors.background};
    color: ${theme.colors.text};
    margin: 0;
    padding: 0;
    font-family: ${theme.font.family};
  }
`;

// ===== Styled Components =====
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing(1)};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing(1)};
`;

const Header = styled.h1`
  font-size: 2rem;
  margin-bottom: ${theme.spacing(1)};
  text-align: center;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: ${theme.spacing(1)};
`;

const DataCard = styled.div`
  background: ${theme.colors.cardBg};
  border-radius: ${theme.radii.lg};
  padding: ${theme.spacing(2)};
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  }
`;

const CardTitle = styled.h3`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing(0.5)};
  font-size: ${theme.font.title};
  margin: 0;
`;

const CardNumber = styled.div`
  font-size: ${theme.font.large};
  font-weight: bold;
  margin: ${theme.spacing(0.5)} 0;
`;

const CardInfo = styled.div`
  font-size: ${theme.font.small};
  color: #666;
`;

const ChartContainer = styled.div`
  background: ${theme.colors.cardBg};
  border-radius: ${theme.radii.lg};
  padding: ${theme.spacing(2)};
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  height: 300px;
`;

const ActionButton = styled.button`
  background: ${theme.colors.accent};
  color: #fff;
  border: none;
  padding: ${theme.spacing(0.75)} ${theme.spacing(1)};
  border-radius: ${theme.radii.md};
  font-weight: bold;
  cursor: pointer;
  align-self: center;
  margin: ${theme.spacing(1)} 0;
  transition: background 0.3s;
  &:hover {
    background: ${theme.colors.accentHover};
  }
`;

const TableWrapper = styled.div`
  overflow-x: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: ${theme.spacing(1)};

  th, td {
    padding: ${theme.spacing(1)};
    border-bottom: 1px solid ${theme.colors.border};
    text-align: center;
  }

  th {
    background: ${theme.colors.hoverBg};
    position: sticky;
    top: 0;
  }

  tbody tr:nth-child(even) {
    background: ${theme.colors.hoverBg};
  }

  tbody tr:hover {
    background: ${theme.colors.hoverBg};
  }
`;

const IconButton = styled.button`
  background: ${theme.colors.accent};
  border: none;
  color: #fff;
  padding: ${theme.spacing(0.5)};
  margin: 0 ${theme.spacing(0.25)};
  border-radius: ${theme.radii.sm};
  cursor: pointer;
  transition: background 0.2s;
  font-size: ${theme.font.small};
  &:hover {
    background: ${theme.colors.accentHover};
  }
`;

// ===== Types =====
interface Picking {
  id: number;
  orderNumber: string;
  quantity: number;
}

interface Trend {
  day: string;
  picks: number;
}

// ===== Component =====
export default function PickingDashboard() {
  // Demo data
  const demoPickings: Picking[] = [
    { id: 1, orderNumber: 'A1001', quantity: 12 },
    { id: 2, orderNumber: 'A1002', quantity: 8 },
    { id: 3, orderNumber: 'A1003', quantity: 20 },
    { id: 4, orderNumber: 'A1004', quantity: 5 },
    { id: 5, orderNumber: 'A1005', quantity: 16 },
  ];
  const trendData: Trend[] = [
    { day: 'Mon', picks: 120 },
    { day: 'Tue', picks: 98 },
    { day: 'Wed', picks: 132 },
    { day: 'Thu', picks: 110 },
    { day: 'Fri', picks: 145 },
    { day: 'Sat', picks: 80 },
    { day: 'Sun', picks: 60 },
  ];

  // State
  const [pickings, setPickings] = useState<Picking[]>([]);
  const [newOrderNumber, setNewOrderNumber] = useState('');
  const [newQuantity, setNewQuantity] = useState<number>(0);

  // KPIs
  const totalPicks = demoPickings.reduce((sum, p) => sum + p.quantity, 0);
  const avgPerOrder = (totalPicks / demoPickings.length).toFixed(1);

  // Fetch demo data
  useEffect(() => {
    // In real use: fetch(`${API_URL}/picking`)...
    setPickings(demoPickings);
  }, []);

  // Handlers
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    // POST to API_URL...
    setPickings(prev => [
      ...prev,
      { id: prev.length + 1, orderNumber: newOrderNumber, quantity: newQuantity },
    ]);
    setNewOrderNumber('');
    setNewQuantity(0);
  };

  const handleEdit = (id: number) => {
    alert(`Editar picking #${id}`);
  };

  const handleDelete = (id: number) => {
    setPickings(prev => prev.filter(p => p.id !== id));
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <Header>Picking Dashboard</Header>

        <CardsGrid>
          <DataCard>
            <CardTitle><ShoppingCart size={20} /> Total Picks Today</CardTitle>
            <CardNumber>{totalPicks}</CardNumber>
            <CardInfo>{demoPickings.length} orders</CardInfo>
          </DataCard>
          <DataCard>
            <CardTitle><Clock size={20} /> Avg Qty / Order</CardTitle>
            <CardNumber>{avgPerOrder}</CardNumber>
            <CardInfo>per order</CardInfo>
          </DataCard>
          <DataCard>
            <CardTitle><PackageCheck size={20} /> Avg Process Time</CardTitle>
            <CardNumber>115 mins</CardNumber>
            <CardInfo>per order</CardInfo>
          </DataCard>
          <DataCard>
            <CardTitle><PauseCircle size={20} /> On Hold Orders</CardTitle>
            <CardNumber>4</CardNumber>
            <CardInfo>awaiting stock</CardInfo>
          </DataCard>
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="picks" fill={theme.colors.accent} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardsGrid>

        <ActionButton onClick={() => alert('Ver reporte detallado')}>
          View Detailed Report
        </ActionButton>

        <form onSubmit={handleCreate} style={{ display: 'flex', justifyContent: 'center', gap: theme.spacing(1) }}>
          <input
            type="text"
            placeholder="Order #"
            value={newOrderNumber}
            onChange={e => setNewOrderNumber(e.target.value)}
            required
            style={{
              padding: theme.spacing(1),
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.radii.sm,
              width: '150px',
            }}
          />
          <input
            type="number"
            placeholder="Qty"
            value={newQuantity}
            onChange={e => setNewQuantity(Number(e.target.value))}
            required
            style={{
              padding: theme.spacing(1),
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.radii.sm,
              width: '100px',
            }}
          />
          <ActionButton type="submit">Add</ActionButton>
        </form>

        <TableWrapper>
          <StyledTable>
            <thead>
              <tr>
                <th>ID</th>
                <th>Order #</th>
                <th>Qty</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pickings.map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.orderNumber}</td>
                  <td>{p.quantity}</td>
                  <td>
                    <IconButton onClick={() => handleEdit(p.id)}>Edit</IconButton>
                    <IconButton onClick={() => handleDelete(p.id)}>Delete</IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </TableWrapper>
      </Container>
    </>
  );
}
