'use client';

import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
} from 'recharts';
import { FaBoxes, FaEdit, FaSave, FaTimes, FaTrash } from 'react-icons/fa';
import { ShoppingCart, Clock, PackageCheck, PauseCircle } from 'lucide-react';

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
const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing(1)};
  margin-bottom: ${theme.spacing(1)};
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
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing(0.5)};
  font-size: ${theme.font.sizes.base};
  margin: 0;
`;
const CardNumber = styled.div`
  font-size: ${theme.font.sizes.large};
  font-weight: bold;
  margin: ${theme.spacing(0.5)} 0;
`;
const CardInfo = styled.div`
  font-size: ${theme.font.sizes.small};
  color: ${theme.colors.textSecondary};
`;
const ChartContainer = styled.div`
  background: ${theme.colors.surface};
  border-radius: ${theme.radii.lg};
  padding: ${theme.spacing(2)};
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  height: 300px;
`;
const TableWrapper = styled.div`
  overflow-x: auto;
  margin-top: ${theme.spacing(1)};
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
const ActionButton = styled.button`
  background: ${theme.colors.accent};
  color: #fff;
  border: none;
  padding: ${theme.spacing(0.5)} ${theme.spacing(1)};
  border-radius: ${theme.radii.md};
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
  &:hover { background: ${theme.colors.accentHover}; }
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
interface Packing {
  id: number;
  packingId: string;
  product: string;
  quantity: number;
  packingDate: string;
  status: string;
}
interface StatusDatum { name: string; value: number; }

// ===== Demo Data =====
const initialData: Packing[] = [
  { id: 1, packingId: 'PKG-001', product: 'Producto A', quantity: 100, packingDate: '2025-04-14T08:30:00', status: 'Completed' },
  { id: 2, packingId: 'PKG-002', product: 'Producto B', quantity: 50,  packingDate: '2025-04-15T09:00:00', status: 'Pending' },
  { id: 3, packingId: 'PKG-003', product: 'Producto C', quantity: 75,  packingDate: '2025-04-15T10:15:00', status: 'In Progress' },
  { id: 4, packingId: 'PKG-004', product: 'Producto D', quantity: 200, packingDate: '2025-04-16T11:45:00', status: 'Completed' },
  { id: 5, packingId: 'PKG-005', product: 'Producto E', quantity: 120, packingDate: '2025-04-16T14:30:00', status: 'Pending' },
  { id: 6, packingId: 'PKG-006', product: 'Producto F', quantity: 30,  packingDate: '2025-04-17T09:20:00', status: 'In Progress' },
  { id: 7, packingId: 'PKG-007', product: 'Producto G', quantity: 60,  packingDate: '2025-04-17T15:00:00', status: 'Completed' },
  { id: 8, packingId: 'PKG-008', product: 'Producto H', quantity: 90,  packingDate: '2025-04-18T10:00:00', status: 'Pending' },
];
const pieColors = [theme.colors.accent, theme.colors.accentHover, theme.colors.border];
const getStatusData = (data: Packing[]): StatusDatum[] => [
  { name: 'Completed', value: data.filter(d => d.status === 'Completed').length },
  { name: 'Pending',   value: data.filter(d => d.status === 'Pending').length },
  { name: 'In Progress',value: data.filter(d => d.status === 'In Progress').length },
];

// ===== Component =====
export default function PackingDashboard() {
  const [data, setData] = useState<Packing[]>([]);
  const [form, setForm] = useState<Omit<Packing,'id'>>({ packingId: '', product: '', quantity: 0, packingDate: '', status: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Omit<Packing,'id'>>(form);

  // Load demo data
  useEffect(() => { setData(initialData); }, []);

  // Handlers
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: name === 'quantity' ? +value : value }));
  };
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newId = data.length ? Math.max(...data.map(d=>d.id)) + 1 : 1;
    setData(prev => [...prev, { id: newId, ...form }]);
    setForm({ packingId: '', product: '', quantity: 0, packingDate: '', status: '' });
  };
  const startEdit = (p: Packing) => { setEditingId(p.id); setEditForm({ ...p }); };
  const handleEditChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm(f => ({ ...f, [name]: name === 'quantity' ? +value : value }));
  };
  const saveEdit = (id: number) => {
    setData(d => d.map(p => p.id === id ? { id, ...editForm } : p));
    setEditingId(null);
  };
  const cancelEdit = () => setEditingId(null);
  const deleteRow = (id: number) => setData(d => d.filter(p => p.id !== id));

  // KPIs
  const total = data.length;
  const completed = getStatusData(data)[0].value;
  const pending   = getStatusData(data)[1].value;
  const inProg    = getStatusData(data)[2].value;

  return (
    <>
      <GlobalStyle />
      <Container>
        <Header>
          <FaBoxes size={32} color={theme.colors.accent} />
          <div>
            <Title>Packing Dashboard</Title>
            <Subtitle>Coordinación y seguimiento de packing</Subtitle>
          </div>
        </Header>

        {/* KPI Cards + Pie Chart */}
        <CardsGrid>
          <DataCard>
            <CardTitle><ShoppingCart size={20} /> Total Packings</CardTitle>
            <CardNumber>{total}</CardNumber>
            <CardInfo>records</CardInfo>
          </DataCard>
          <DataCard>
            <CardTitle><PackageCheck size={20} /> Completed</CardTitle>
            <CardNumber>{completed}</CardNumber>
            <CardInfo>records</CardInfo>
          </DataCard>
          <DataCard>
            <CardTitle><Clock size={20} /> Pending</CardTitle>
            <CardNumber>{pending}</CardNumber>
            <CardInfo>records</CardInfo>
          </DataCard>
          <DataCard>
            <CardTitle><PauseCircle size={20} /> In Progress</CardTitle>
            <CardNumber>{inProg}</CardNumber>
            <CardInfo>records</CardInfo>
          </DataCard>
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={getStatusData(data)} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {getStatusData(data).map((entry,index) => (
                    <Cell key={index} fill={pieColors[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardsGrid>

        {/* Add Packing Form */}
        <form onSubmit={handleSubmit} style={{ display:'flex', gap: theme.spacing(1), flexWrap:'wrap', margin: theme.spacing(1) + ' 0' }}>
          <input name="packingId" placeholder="Packing ID" value={form.packingId} onChange={handleChange} required style={{padding:theme.spacing(1),border:`1px solid ${theme.colors.border}`,borderRadius:theme.radii.sm}} />
          <input name="product" placeholder="Product" value={form.product} onChange={handleChange} required style={{padding:theme.spacing(1),border:`1px solid ${theme.colors.border}`,borderRadius:theme.radii.sm}} />
          <input name="quantity" type="number" placeholder="Qty" value={form.quantity||''} onChange={handleChange} required style={{padding:theme.spacing(1),border:`1px solid ${theme.colors.border}`,borderRadius:theme.radii.sm,width:'80px'}} />
          <input name="packingDate" type="datetime-local" value={form.packingDate} onChange={handleChange} required style={{padding:theme.spacing(1),border:`1px solid ${theme.colors.border}`,borderRadius:theme.radii.sm}} />
          <input name="status" placeholder="Status" value={form.status} onChange={handleChange} required style={{padding:theme.spacing(1),border:`1px solid ${theme.colors.border}`,borderRadius:theme.radii.sm}} />
          <ActionButton type="submit">Add</ActionButton>
        </form>

        {/* Packing Table */}
        <TableWrapper>
          <StyledTable>
            <thead>
              <tr>
                <th>ID</th><th>Packing ID</th><th>Product</th><th>Qty</th><th>Date</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{editingId===p.id ? <input name="packingId" value={editForm.packingId} onChange={handleEditChange} style={{width:'100%',padding:theme.spacing(0.5)}}/> : p.packingId}</td>
                  <td>{editingId===p.id ? <input name="product" value={editForm.product} onChange={handleEditChange} style={{width:'100%',padding:theme.spacing(0.5)}}/> : p.product}</td>
                  <td>{editingId===p.id ? <input name="quantity" type="number" value={editForm.quantity||''} onChange={handleEditChange} style={{width:'60px',padding:theme.spacing(0.5)}}/> : p.quantity}</td>
                  <td>{editingId===p.id ? <input name="packingDate" type="datetime-local" value={editForm.packingDate} onChange={handleEditChange} style={{padding:theme.spacing(0.5)}}/> : new Date(p.packingDate).toLocaleString()}</td>
                  <td>{editingId===p.id ? <input name="status" value={editForm.status} onChange={handleEditChange} style={{width:'100%',padding:theme.spacing(0.5)}}/> : p.status}</td>
                  <td>
                    {editingId===p.id ? (
                      <>
                        <IconButton onClick={() => saveEdit(p.id)}><FaSave color={theme.colors.accent}/></IconButton>
                        <IconButton onClick={cancelEdit}><FaTimes color={theme.colors.accentHover}/></IconButton>
                      </>
                    ) : (
                      <>
                        <IconButton onClick={() => startEdit(p)}><FaEdit color={theme.colors.accentHover}/></IconButton>
                        <IconButton onClick={() => deleteRow(p.id)}><FaTrash color={theme.colors.accentHover}/></IconButton>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </TableWrapper>

        {/* Quantity by Product Bar Chart */}
        <ChartContainer>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top:20, right:20, left:0, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.border} />
              <XAxis dataKey="product" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="quantity" fill={theme.colors.accent} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </Container>
    </>
  );
}