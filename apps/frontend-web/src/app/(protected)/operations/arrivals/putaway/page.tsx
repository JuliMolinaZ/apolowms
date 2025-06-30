'use client';

import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
  Tooltip,
  Legend,
} from 'recharts';
import { FaBoxOpen, FaSave, FaTimes, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

// ===== Theme Tokens =====
const theme = {
  colors: {
    background: '#EAF5FA',
    surface: '#FFFFFF',
    border: '#d3e0e9',
    text: '#333333',
    textSecondary: '#666666',
    accent: '#5ce1e6',
    accentHover: '#54c6d6',
  },
  spacing: (n: number) => `${n * 8}px`,
  radii: { sm: '6px', md: '8px', lg: '12px' },
  font: {
    family: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
    sizes: { small: '0.9rem', base: '1rem', title: '1.1rem', large: '2rem' },
  },
};

// ===== Global Styles =====
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background-color: ${theme.colors.background};
    color: ${theme.colors.text};
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
const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing(1)};
`;
const Title = styled.h1`
  font-size: ${theme.font.sizes.large};
  margin: 0;
`;
const Subtitle = styled.p`
  font-size: ${theme.font.sizes.base};
  color: ${theme.colors.textSecondary};
  margin: 0;
`;
const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: ${theme.spacing(1)};
`;
const DataCard = styled.div`
  background: ${theme.colors.surface};
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
  margin: 0;
  font-size: ${theme.font.sizes.base};
`;
const CardNumber = styled.div`
  font-size: ${theme.font.sizes.large};
  font-weight: bold;
  margin-top: ${theme.spacing(0.5)};
`;
const ChartContainer = styled.div`
  background: ${theme.colors.surface};
  border-radius: ${theme.radii.lg};
  padding: ${theme.spacing(2)};
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  height: 300px;
`;
const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing(1)};
  margin: ${theme.spacing(1)} 0;
  background: ${theme.colors.surface};
  padding: ${theme.spacing(2)};
  border-radius: ${theme.radii.md};
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
`;
const Input = styled.input`
  padding: ${theme.spacing(1)};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.sm};
  font-size: ${theme.font.sizes.base};
  flex: 1 1 150px;
`;
const ActionButton = styled.button`
  background: ${theme.colors.accent};
  color: #fff;
  border: none;
  padding: ${theme.spacing(0.75)} ${theme.spacing(1)};
  border-radius: ${theme.radii.md};
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
  display: flex;
  align-items: center;
  gap: ${theme.spacing(0.5)};
  &:hover { background: ${theme.colors.accentHover}; }
`;
const TableWrapper = styled.div`
  overflow-x: auto;
`;
const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  th, td {
    padding: ${theme.spacing(1)};
    border-bottom: 1px solid ${theme.colors.border};
    text-align: left;
  }
  th {
    background: ${theme.colors.background};
    position: sticky;
    top: 0;
    font-weight: bold;
  }
  tbody tr:nth-child(even) { background: ${theme.colors.background}; }
  tbody tr:hover { background: ${theme.colors.accent}10; }
`;
const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: ${theme.spacing(0.5)};
  margin-right: ${theme.spacing(0.5)};
  font-size: ${theme.font.sizes.base};
`;

// ===== Types =====
interface Putaway {
  id: number;
  receiptId: string;
  location: string;
  quantity: number;
  createdAt: string;
}
interface LocationDatum {
  location: string;
  count: number;
}

// ===== Demo Data =====
const initialData: Putaway[] = [
  { id: 1, receiptId: 'RCPT-101', location: 'A1', quantity: 120, createdAt: '2025-06-01T08:00:00' },
  { id: 2, receiptId: 'RCPT-102', location: 'B2', quantity: 60,  createdAt: '2025-06-02T09:30:00' },
  { id: 3, receiptId: 'RCPT-103', location: 'A1', quantity: 30,  createdAt: '2025-06-02T11:15:00' },
  { id: 4, receiptId: 'RCPT-104', location: 'C3', quantity: 200, createdAt: '2025-06-03T10:20:00' },
  { id: 5, receiptId: 'RCPT-105', location: 'B2', quantity: 90,  createdAt: '2025-06-03T14:45:00' },
];
const getLocationData = (data: Putaway[]): LocationDatum[] => {
  const map: Record<string, number> = {};
  data.forEach(p => { map[p.location] = (map[p.location] || 0) + 1; });
  return Object.entries(map).map(([location, count]) => ({ location, count }));
};

// ===== Component =====
export default function PutawayDashboard() {
  const [data, setData] = useState<Putaway[]>([]);
  const [form, setForm] = useState<Omit<Putaway, 'id' | 'createdAt'>>({ receiptId: '', location: '', quantity: 0 });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Omit<Putaway, 'id' | 'createdAt'>>({ receiptId: '', location: '', quantity: 0 });

  useEffect(() => { setData(initialData); }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: name === 'quantity' ? +value : value }));
  };
  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    const id = data.length ? Math.max(...data.map(d => d.id)) + 1 : 1;
    setData(prev => [...prev, { id, createdAt: new Date().toISOString(), ...form }]);
    setForm({ receiptId: '', location: '', quantity: 0 });
  };
  const startEdit = (p: Putaway) => { setEditingId(p.id); setEditForm({ receiptId: p.receiptId, location: p.location, quantity: p.quantity }); };
  const handleEditChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm(f => ({ ...f, [name]: name === 'quantity' ? +value : value }));
  };
  const saveEdit = (id: number) => {
    setData(d => d.map(p => p.id === id ? { id, createdAt: p.createdAt, ...editForm } : p));
    setEditingId(null);
  };
  const cancelEdit = () => setEditingId(null);
  const deleteRow = (id: number) => setData(d => d.filter(p => p.id !== id));

  // Metrics
  const total = data.length;
  const totalItems = data.reduce((sum, p) => sum + p.quantity, 0);
  const uniqueLoc = getLocationData(data).length;
  const avgQty = total ? (totalItems / total).toFixed(1) : '0';

  return (
    <>
      <GlobalStyle />
      <Container>
        <Header>
          <FaBoxOpen size={32} color={theme.colors.accent} />
          <div>
            <Title>Putaway Dashboard</Title>
            <Subtitle>Organización y seguimiento de putaway</Subtitle>
          </div>
        </Header>

        <CardsGrid>
          <DataCard>
            <CardTitle>Total Putaways</CardTitle>
            <CardNumber>{total}</CardNumber>
          </DataCard>
          <DataCard>
            <CardTitle>Total Items</CardTitle>
            <CardNumber>{totalItems}</CardNumber>
          </DataCard>
          <DataCard>
            <CardTitle>Unique Locations</CardTitle>
            <CardNumber>{uniqueLoc}</CardNumber>
          </DataCard>
          <DataCard>
            <CardTitle>Avg Qty/Putaway</CardTitle>
            <CardNumber>{avgQty}</CardNumber>
          </DataCard>
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getLocationData(data)} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.border} />
                <XAxis dataKey="location" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill={theme.colors.accent} name="Count" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardsGrid>

        <Form onSubmit={handleAdd}>
          <Input name="receiptId" value={form.receiptId} onChange={handleChange} placeholder="Receipt ID" required />
          <Input name="quantity" type="number" value={form.quantity || ''} onChange={handleChange} placeholder="Quantity" required />
          <Input name="location" value={form.location} onChange={handleChange} placeholder="Location" required />
          <ActionButton type="submit">
            <FaPlus /> Add Putaway
          </ActionButton>
        </Form>

        <TableWrapper>
          <StyledTable>
            <thead>
              <tr>
                <th>ID</th><th>Receipt ID</th><th>Qty</th><th>Location</th><th>Date</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{editingId===p.id ? <Input value={editForm.receiptId} name="receiptId" onChange={handleEditChange} /> : p.receiptId}</td>
                  <td>{editingId===p.id ? <Input value={editForm.quantity || ''} name="quantity" type="number" onChange={handleEditChange} style={{width:'80px'}} /> : p.quantity}</td>
                  <td>{editingId===p.id ? <Input value={editForm.location} name="location" onChange={handleEditChange} /> : p.location}</td>
                  <td>{new Date(p.createdAt).toLocaleString()}</td>
                  <td>
                    {editingId===p.id ? (
                      <>
                        <IconButton onClick={()=>saveEdit(p.id)}><FaSave color={theme.colors.accent} /></IconButton>
                        <IconButton onClick={cancelEdit}><FaTimes color={theme.colors.accentHover} /></IconButton>
                      </>
                    ) : (
                      <>
                        <IconButton onClick={()=>startEdit(p)}><FaEdit color={theme.colors.accentHover} /></IconButton>
                        <IconButton onClick={()=>deleteRow(p.id)}><FaTrash color={theme.colors.accentHover} /></IconButton>
                      </>
                    )}
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