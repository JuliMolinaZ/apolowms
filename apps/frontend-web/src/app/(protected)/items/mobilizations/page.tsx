// src/app/mobilizations/page.tsx
'use client';

import React, {
  useState,
  useMemo,
  useEffect,
  ChangeEvent,
  FormEvent,
} from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import {
  FaTruckLoading,
  FaEdit,
  FaTrash,
  FaPlus,
  FaSave,
  FaTimes,
} from 'react-icons/fa';

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
    pending: '#FFA726',
    inProgress: '#29B6F6',
    completed: '#66BB6A',
    danger: '#e53935',
  },
  spacing: (n: number) => `${n * 8}px`,
  radii: { sm: '6px', md: '8px', lg: '12px' },
  font: {
    family: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
    sizes: { small: '0.9rem', base: '1rem', title: '1.5rem' },
  },
};

// ===== Global Styles =====
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background: ${theme.colors.background};
    font-family: ${theme.font.family};
    color: ${theme.colors.textPrimary};
  }
`;

// ===== Data Model =====
interface Mobilization {
  id: string;
  item: string;
  from: string;
  to: string;
  qty: number;
  status: 'Pending' | 'In Progress' | 'Completed';
  date: string; // YYYY-MM-DD
  responsible: string;
  priority: 'High' | 'Medium' | 'Low';
  notes: string;
}

// ===== Demo lookup tables =====
const PRODUCTS = [
  'Shirts', 'Shoes', 'Caps', 'Pants', 'Socks',
  'Jackets', 'Belts', 'Gloves', 'Hats', 'Bags',
];
const LOCATIONS = [
  'Central Warehouse',
  'North Warehouse',
  'South Warehouse',
  'East Depot',
  'West Depot',
];
const USERS = ['Juli', 'Ana', 'Luis', 'Mia', 'Eva', 'Omar', 'Raj', 'Zoe'];

// ===== Generate more demo records =====
const generateDemo = (): Mobilization[] => {
  const statuses: Mobilization['status'][] = [
    'Pending', 'In Progress', 'Completed',
  ];
  const priorities: Mobilization['priority'][] = [
    'High', 'Medium', 'Low',
  ];
  const data: Mobilization[] = [];
  for (let i = 1; i <= 30; i++) {
    const id = `MOB-${String(i).padStart(3, '0')}`;
    const item = PRODUCTS[i % PRODUCTS.length];
    const from = LOCATIONS[i % LOCATIONS.length];
    const to = LOCATIONS[(i + 2) % LOCATIONS.length];
    const qty = Math.floor(Math.random() * 200) + 10;
    const status = statuses[i % statuses.length];
    const priority = priorities[i % priorities.length];
    const date = `2025-06-${String((i % 28) + 1).padStart(2, '0')}`;
    const responsible = USERS[i % USERS.length];
    const notes = `Auto-generated note ${i}`;
    data.push({ id, item, from, to, qty, status, date, responsible, priority, notes });
  }
  return data;
};
const initialData: Mobilization[] = generateDemo();

// ===== Styled Components =====
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing(2)};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing(2)};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing(1)};
`;

const Title = styled.h1`
  font-size: ${theme.font.sizes.title};
  margin: 0;
`;

const FilterBar = styled.div`
  display: flex;
  gap: ${theme.spacing(1)};
  flex-wrap: wrap;
`;

const FilterInput = styled.input`
  flex: 2;
  padding: ${theme.spacing(0.5)};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.sm};
`;

const FilterSelect = styled.select`
  flex: 1;
  padding: ${theme.spacing(0.5)};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.sm};
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill,minmax(180px,1fr));
  gap: ${theme.spacing(2)};
`;

const DataCard = styled.div`
  background: ${theme.colors.surface};
  border-radius: ${theme.radii.md};
  padding: ${theme.spacing(2)};
  text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
`;

const CardTitle = styled.div`
  font-size: ${theme.font.sizes.small};
  color: ${theme.colors.textSecondary};
`;

const CardNumber = styled.div`
  font-size: 2rem;
  font-weight: bold;
`;

const Charts = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing(2)};
  height: 300px;
`;

const ChartWrapper = styled.div`
  background: ${theme.colors.surface};
  border-radius: ${theme.radii.md};
  padding: ${theme.spacing(1)};
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
`;

const FormContainer = styled.form`
  display: grid;
  grid-template-columns: repeat(auto-fill,minmax(180px,1fr));
  gap: ${theme.spacing(1)};
  background: ${theme.colors.surface};
  padding: ${theme.spacing(1)};
  border-radius: ${theme.radii.md};
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
`;

const Select = styled.select`
  padding: ${theme.spacing(0.5)};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.sm};
`;

const TextInput = styled.input`
  padding: ${theme.spacing(0.5)};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.sm};
`;

const NumberInput = styled.input`
  padding: ${theme.spacing(0.5)};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.sm};
`;

const DateInput = styled.input`
  padding: ${theme.spacing(0.5)};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.sm};
`;

const TextArea = styled.textarea`
  grid-column: span 2;
  padding: ${theme.spacing(0.5)};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.sm};
  resize: vertical;
`;

const ActionButton = styled.button<{ color?: string }>`
  background: ${({ color }) => color || theme.colors.accent};
  color: #fff;
  border: none;
  padding: ${theme.spacing(0.5)};
  border-radius: ${theme.radii.sm};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${theme.spacing(0.5)};
  &:hover { opacity: 0.9; }
`;

const TableContainer = styled.div`
  background: ${theme.colors.surface};
  border-radius: ${theme.radii.md};
  overflow-x: auto;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
`;

const StyledTable = styled.table`
  width: 100%; border-collapse: collapse;
  th, td {
    border: 1px solid ${theme.colors.border};
    padding: ${theme.spacing(1)};
    text-align: left;
  }
  th {
    background: ${theme.colors.accentHover}20;
    position: sticky; top: 0;
  }
  tbody tr:hover {
    background: ${theme.colors.accentHover}10;
  }
`;

const StatusBadge = styled.span<{ status: Mobilization['status'] }>`
  padding: 0.25rem 0.5rem;
  border-radius: ${theme.radii.sm};
  color: #fff;
  background: ${({ status }) =>
    status === 'Pending'      ? theme.colors.pending :
    status === 'In Progress' ? theme.colors.inProgress :
                                theme.colors.completed};
  font-size: ${theme.font.sizes.small};
`;

const Pagination = styled.div`
  display: flex; justify-content: center; gap: ${theme.spacing(1)};
  margin-top: ${theme.spacing(1)};
`;

const PageButton = styled.button`
  padding: ${theme.spacing(0.5)} ${theme.spacing(1)};
  border: 1px solid ${theme.colors.border};
  background: ${theme.colors.surface};
  border-radius: ${theme.radii.sm};
  cursor: pointer;
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

// ===== Component =====
export default function MobilizationsPage() {
  const [data, setData] = useState<Mobilization[]>(initialData);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All'|Mobilization['status']>('All');
  const [page, setPage] = useState(1);

  // Form state
  const blank = {
    item: '', from: '', to: '', qty: 0,
    status: 'Pending' as Mobilization['status'],
    date: '', responsible: '', priority: 'Medium' as Mobilization['priority'],
    notes: '',
  };
  const [form, setForm] = useState<Omit<Mobilization,'id'>>(blank);
  const [editingId, setEditingId] = useState<string|null>(null);

  // Handlers
  const handleFormChange = (e: ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(f => ({
      ...f,
      [name]: name === 'qty' ? Number(value) : value,
    }));
  };
  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    const nextId = `MOB-${String(data.length+1).padStart(3,'0')}`;
    setData(d => [...d, { id: nextId, ...form }]);
    setForm(blank);
  };
  const handleEditClick = (m: Mobilization) => {
    setEditingId(m.id);
    const { id, ...rest } = m;
    setForm(rest);
  };
  const handleSave = () => {
    setData(d => d.map(m => m.id === editingId ? { id: m.id, ...form } : m));
    setEditingId(null);
    setForm(blank);
  };
  const handleCancel = () => {
    setEditingId(null);
    setForm(blank);
  };
  const handleDelete = (id: string) => {
    setData(d => d.filter(m => m.id !== id));
  };

  // Filters & pagination
  const filtered = useMemo(() => data.filter(m =>
    m.item.toLowerCase().includes(search.toLowerCase()) &&
    (statusFilter === 'All' || m.status === statusFilter)
  ), [data, search, statusFilter]);
  const total     = filtered.length;
  const pending   = filtered.filter(m => m.status==='Pending').length;
  const inProg    = filtered.filter(m => m.status==='In Progress').length;
  const completed = filtered.filter(m => m.status==='Completed').length;

  const statusData = [
    { name: 'Pending',      value: pending   },
    { name: 'In Progress',  value: inProg    },
    { name: 'Completed',    value: completed },
  ];
  const originCounts: Record<string,number> = {};
  filtered.forEach(m => originCounts[m.from] = (originCounts[m.from]||0)+1);
  const originData = Object.entries(originCounts).map(([from,count]) => ({ from, count }));

  const perPage   = 10;
  const pageCount = Math.ceil(total / perPage);
  const pageData  = filtered.slice((page-1)*perPage, page*perPage);

  useEffect(() => { if (page > pageCount) setPage(1); }, [pageCount]);

  return (
    <>
      <GlobalStyle />
      <Container>
        <Header>
          <FaTruckLoading size={32} color={theme.colors.accent} />
          <Title>Stock Movements</Title>
        </Header>

        <FilterBar>
          <FilterInput
            placeholder="Search item..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <FilterSelect
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
          >
            <option>All</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </FilterSelect>
        </FilterBar>

        <CardsGrid>
          <DataCard><CardTitle>Total</CardTitle><CardNumber>{total}</CardNumber></DataCard>
          <DataCard><CardTitle>Pending</CardTitle><CardNumber>{pending}</CardNumber></DataCard>
          <DataCard><CardTitle>In Progress</CardTitle><CardNumber>{inProg}</CardNumber></DataCard>
          <DataCard><CardTitle>Completed</CardTitle><CardNumber>{completed}</CardNumber></DataCard>
        </CardsGrid>

        <Charts>
          <ChartWrapper>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {statusData.map((_, i) => (
                    <Cell key={i} fill={[
                      theme.colors.pending,
                      theme.colors.inProgress,
                      theme.colors.completed,
                    ][i]} />
                  ))}
                </Pie>
                <Tooltip /><Legend verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
          </ChartWrapper>
          <ChartWrapper>
            <ResponsiveContainer>
              <BarChart data={originData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.border} />
                <XAxis dataKey="from" stroke={theme.colors.textSecondary} />
                <YAxis stroke={theme.colors.textSecondary} />
                <Tooltip /><Bar dataKey="count" fill={theme.colors.accent} />
              </BarChart>
            </ResponsiveContainer>
          </ChartWrapper>
        </Charts>

        <FormContainer onSubmit={editingId ? (e) => { e.preventDefault(); handleSave(); } : handleAdd}>
          <Select name="item" value={form.item} onChange={handleFormChange} required>
            <option value="" disabled>Select item</option>
            {PRODUCTS.map(p => <option key={p}>{p}</option>)}
          </Select>
          <Select name="from" value={form.from} onChange={handleFormChange} required>
            <option value="" disabled>From location</option>
            {LOCATIONS.map(l => <option key={l}>{l}</option>)}
          </Select>
          <Select name="to" value={form.to} onChange={handleFormChange} required>
            <option value="" disabled>To location</option>
            {LOCATIONS.map(l => <option key={l}>{l}</option>)}
          </Select>
          <NumberInput
            name="qty"
            type="number"
            min="1"
            placeholder="Qty"
            value={form.qty}
            onChange={handleFormChange}
            required
          />
          <DateInput
            name="date"
            type="date"
            value={form.date}
            onChange={handleFormChange}
            required
          />
          <Select name="responsible" value={form.responsible} onChange={handleFormChange} required>
            <option value="" disabled>Responsible</option>
            {USERS.map(u => <option key={u}>{u}</option>)}
          </Select>
          <Select name="status" value={form.status} onChange={handleFormChange}>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </Select>
          <Select name="priority" value={form.priority} onChange={handleFormChange}>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </Select>
          <TextArea
            name="notes"
            rows={2}
            placeholder="Notes..."
            value={form.notes}
            onChange={handleFormChange}
          />
          {editingId ? (
            <>
              <ActionButton type="button" color={theme.colors.accent} onClick={handleSave}>
                <FaSave /> Save
              </ActionButton>
              <ActionButton type="button" color={theme.colors.danger} onClick={handleCancel}>
                <FaTimes /> Cancel
              </ActionButton>
            </>
          ) : (
            <ActionButton type="submit" color={theme.colors.accent}>
              <FaPlus /> Add
            </ActionButton>
          )}
        </FormContainer>

        <TableContainer>
          <StyledTable>
            <thead>
              <tr>
                <th>ID</th><th>Item</th><th>From</th><th>To</th>
                <th>Qty</th><th>Date</th><th>Status</th><th>Priority</th><th>Responsible</th><th>Notes</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageData.map(m => (
                <tr key={m.id}>
                  <td>{m.id}</td>
                  <td>{m.item}</td>
                  <td>{m.from}</td>
                  <td>{m.to}</td>
                  <td>{m.qty}</td>
                  <td>{m.date}</td>
                  <td><StatusBadge status={m.status}>{m.status}</StatusBadge></td>
                  <td>{m.priority}</td>
                  <td>{m.responsible}</td>
                  <td>{m.notes}</td>
                  <td>
                    <ActionButton color={theme.colors.accentHover} onClick={() => handleEditClick(m)}>
                      <FaEdit />
                    </ActionButton>
                    <ActionButton color={theme.colors.danger} onClick={() => handleDelete(m.id)}>
                      <FaTrash />
                    </ActionButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </TableContainer>

        <Pagination>
          <PageButton disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Prev</PageButton>
          {Array.from({ length: pageCount }, (_, i) => (
            <PageButton
              key={i}
              disabled={page === i + 1}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </PageButton>
          ))}
          <PageButton disabled={page >= pageCount} onClick={() => setPage(p => p + 1)}>Next</PageButton>
        </Pagination>
      </Container>
    </>
  );
}
