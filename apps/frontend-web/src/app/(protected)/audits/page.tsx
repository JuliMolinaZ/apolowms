// src/app/audits/page.tsx
'use client';

import React, {
  useState,
  useMemo,
  ChangeEvent,
  FormEvent,
  useEffect,
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
  LineChart,
  Line,
} from 'recharts';
import {
  FaClipboardCheck,
  FaCalendarAlt,
  FaClock,
} from 'react-icons/fa';

// ===== Theme Tokens =====
const theme = {
  colors: {
    background: '#F4FBFF',
    surface: '#FFFFFF',
    border: '#d3e0e9',
    textPrimary: '#333333',
    textSecondary: '#555555',
    accent: '#6ADBEF',
    accentHover: '#5CE1E6',
    open: '#FFA726',
    inReview: '#29B6F6',
    closed: '#66BB6A',
    danger: '#E53935',
    picking: '#4BBF73',
    packing: '#F9A826',
    mobilization: '#FF5757',
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

// ===== Data Models =====
interface Audit {
  id: string;
  timestamp: string;   // ISO string
  auditor: string;
  area: string;
  status: 'Open' | 'In Review' | 'Closed';
  findings: number;
  notes: string;
}

interface ProcessTimes {
  metric: 'Picking' | 'Packing' | 'Mobilization';
  avgMins: number;
}

// ===== Demo Data =====
const AREAS = ['Receiving', 'Storage', 'Picking', 'Packing', 'Shipping'];
const USERS = ['Alice', 'Bob', 'Carol', 'Dave', 'Eve'];

const generateAudits = (): Audit[] => {
  const statuses: Audit['status'][] = ['Open','In Review','Closed'];
  const data: Audit[] = [];
  for (let i = 1; i <= 50; i++) {
    const id = `AUD-${String(i).padStart(3,'0')}`;
    const date = new Date(2025, 5, (i % 28) + 1, (8 + i) % 12, (i * 13) % 60);
    const timestamp = date.toISOString();
    const auditor = USERS[i % USERS.length];
    const area = AREAS[i % AREAS.length];
    const status = statuses[i % statuses.length];
    const findings = Math.floor(Math.random() * 5);
    const notes = `Demo note #${i}`;
    data.push({ id, timestamp, auditor, area, status, findings, notes });
  }
  return data;
};

const demoAudits = generateAudits();
const demoProcessTimes: ProcessTimes[] = [
  { metric: 'Picking', avgMins: 5 + Math.random() * 5 },
  { metric: 'Packing', avgMins: 8 + Math.random() * 5 },
  { metric: 'Mobilization', avgMins: 6 + Math.random() * 5 },
];

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
  align-items: center;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: ${theme.spacing(0.5)};
  font-size: ${theme.font.sizes.small};
  color: ${theme.colors.textSecondary};
`;

const TextInput = styled.input`
  padding: ${theme.spacing(0.5)};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.sm};
  font-size: ${theme.font.sizes.base};
`;

const DateInput = styled.input`
  padding: ${theme.spacing(0.5)};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.sm};
  font-size: ${theme.font.sizes.base};
`;

const Select = styled.select`
  padding: ${theme.spacing(0.5)};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.sm};
  font-size: ${theme.font.sizes.base};
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill,minmax(160px,1fr));
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
  grid-template-columns: 1fr 1fr 1fr;
  gap: ${theme.spacing(2)};
  min-height: 300px;
`;

const ChartWrapper = styled.div`
  background: ${theme.colors.surface};
  border-radius: ${theme.radii.md};
  padding: ${theme.spacing(2)};
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
`;

const TableContainer = styled.div`
  background: ${theme.colors.surface};
  border-radius: ${theme.radii.md};
  overflow-x: auto;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: ${theme.font.sizes.small};

  th, td {
    border: 1px solid ${theme.colors.border};
    padding: ${theme.spacing(1)};
    text-align: left;
  }

  th {
    background: ${theme.colors.accentHover}20;
    position: sticky;
    top: 0;
  }

  tbody tr:hover {
    background: ${theme.colors.accentHover}10;
  }
`;

const StatusBadge = styled.span<{ status: Audit['status'] }>`
  padding: 0.25rem 0.5rem;
  border-radius: ${theme.radii.sm};
  color: #fff;
  background: ${({ status }) =>
    status === 'Open'       ? theme.colors.open :
    status === 'In Review' ? theme.colors.inReview :
                              theme.colors.closed};
  font-size: ${theme.font.sizes.small};
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: ${theme.spacing(1)};
  margin-top: ${theme.spacing(1)};
`;

const PageButton = styled.button`
  padding: ${theme.spacing(0.5)} ${theme.spacing(1)};
  border: 1px solid ${theme.colors.border};
  background: ${theme.colors.surface};
  border-radius: ${theme.radii.sm};
  cursor: pointer;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// ===== Component =====
export default function AuditsPage() {
  const [audits, setAudits] = useState<Audit[]>(demoAudits);
  const [searchAuditor, setSearchAuditor] = useState('');
  const [areaFilter, setAreaFilter] = useState<'All' | string>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | Audit['status']>('All');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [page, setPage] = useState(1);

  // Filtering & pagination
  const filtered = useMemo(() => {
    return audits.filter(a => {
      if (searchAuditor && !a.auditor.toLowerCase().includes(searchAuditor.toLowerCase())) return false;
      if (areaFilter !== 'All' && a.area !== areaFilter) return false;
      if (statusFilter !== 'All' && a.status !== statusFilter) return false;
      if (fromDate && new Date(a.timestamp) < new Date(fromDate)) return false;
      if (toDate && new Date(a.timestamp) > new Date(toDate + 'T23:59:59')) return false;
      return true;
    });
  }, [audits, searchAuditor, areaFilter, statusFilter, fromDate, toDate]);

  const total = filtered.length;
  const openCount = filtered.filter(a => a.status === 'Open').length;
  const reviewCount = filtered.filter(a => a.status === 'In Review').length;
  const closedCount = filtered.filter(a => a.status === 'Closed').length;

  const statusData = [
    { name: 'Open', value: openCount },
    { name: 'In Review', value: reviewCount },
    { name: 'Closed', value: closedCount },
  ];

  const areaCounts: Record<string, number> = {};
  filtered.forEach(a => areaCounts[a.area] = (areaCounts[a.area] || 0) + 1);
  const areaData = Object.entries(areaCounts).map(([area, count]) => ({ area, count }));

  const perPage = 10;
  const pageCount = Math.ceil(total / perPage);
  const pageData = filtered.slice((page - 1) * perPage, page * perPage);

  // Process times demo
  const [times] = useState<ProcessTimes[]>(demoProcessTimes);

  return (
    <>
      <GlobalStyle />
      <Container>
        <Header>
          <FaClipboardCheck size={32} color={theme.colors.accent} />
          <Title>Warehouse Audits Dashboard</Title>
        </Header>

        <FilterBar>
          <Label><FaCalendarAlt /> From:
            <DateInput
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </Label>
          <Label><FaCalendarAlt /> To:
            <DateInput
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </Label>
          <Label>Auditor:
            <TextInput
              placeholder="Search..."
              value={searchAuditor}
              onChange={(e) => setSearchAuditor(e.target.value)}
            />
          </Label>
          <Label>Area:
            <Select
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
            >
              <option>All</option>
              {AREAS.map(a => <option key={a}>{a}</option>)}
            </Select>
          </Label>
          <Label>Status:
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <option>All</option>
              <option>Open</option>
              <option>In Review</option>
              <option>Closed</option>
            </Select>
          </Label>
        </FilterBar>

        <CardsGrid>
          <DataCard>
            <CardTitle>Total Audits</CardTitle>
            <CardNumber>{total}</CardNumber>
          </DataCard>
          <DataCard>
            <CardTitle>Open</CardTitle>
            <CardNumber>{openCount}</CardNumber>
          </DataCard>
          <DataCard>
            <CardTitle>In Review</CardTitle>
            <CardNumber>{reviewCount}</CardNumber>
          </DataCard>
          <DataCard>
            <CardTitle>Closed</CardTitle>
            <CardNumber>{closedCount}</CardNumber>
          </DataCard>
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
                      theme.colors.open,
                      theme.colors.inReview,
                      theme.colors.closed,
                    ][i]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
          </ChartWrapper>
          <ChartWrapper>
            <ResponsiveContainer>
              <BarChart data={areaData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.border} />
                <XAxis dataKey="area" stroke={theme.colors.textSecondary} />
                <YAxis stroke={theme.colors.textSecondary} />
                <Tooltip />
                <Bar dataKey="count" fill={theme.colors.accent} />
              </BarChart>
            </ResponsiveContainer>
          </ChartWrapper>
          <ChartWrapper>
            <ResponsiveContainer>
              <LineChart data={times} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.border} />
                <XAxis dataKey="metric" stroke={theme.colors.textSecondary} />
                <YAxis stroke={theme.colors.textSecondary} />
                <Tooltip />
                <Line type="monotone" dataKey="avgMins" stroke={theme.colors.accent} strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </ChartWrapper>
        </Charts>

        <TableContainer>
          <StyledTable>
            <thead>
              <tr>
                <th>ID</th>
                <th>Date & Time</th>
                <th>Auditor</th>
                <th>Area</th>
                <th>Findings</th>
                <th>Status</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {pageData.map(a => (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td>{new Date(a.timestamp).toLocaleString()}</td>
                  <td>{a.auditor}</td>
                  <td>{a.area}</td>
                  <td>{a.findings}</td>
                  <td><StatusBadge status={a.status}>{a.status}</StatusBadge></td>
                  <td>{a.notes}</td>
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
