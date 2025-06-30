"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import * as XLSX from "xlsx";
import dynamic from "next/dynamic";
import { API_URL } from "@/lib/config";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

/* ==============================================
   1) MAP IMPORTS (react-simple-maps) v2
   Note: ZoomableGroup no longer exists in v2; use center and zoom on ComposableMap.
   ============================================== */
const ComposableMap = dynamic(() =>
  import("react-simple-maps").then((mod) => mod.ComposableMap),
  { ssr: false }
) as any;

const Geographies = dynamic(() =>
  import("react-simple-maps").then((mod) => mod.Geographies),
  { ssr: false }
) as any;

const Geography = dynamic(() =>
  import("react-simple-maps").then((mod) => mod.Geography),
  { ssr: false }
) as any;

const Marker = dynamic(() =>
  import("react-simple-maps").then((mod) => mod.Marker),
  { ssr: false }
) as any;

/* ==============================================
   2) TEST DATA
   ============================================== */

interface KPI {
  label: string;
  value: number;
}

const inboundOutboundData = [
  { month: "Jan", inbound: 1200, outbound: 800 },
  { month: "Feb", inbound: 1100, outbound: 950 },
  { month: "Mar", inbound: 1500, outbound: 1300 },
  { month: "Apr", inbound: 1800, outbound: 1200 },
  { month: "May", inbound: 1600, outbound: 1400 },
  { month: "Jun", inbound: 2000, outbound: 1700 },
  { month: "Jul", inbound: 2100, outbound: 1850 },
  { month: "Aug", inbound: 1950, outbound: 1600 },
  { month: "Sep", inbound: 2200, outbound: 1900 },
  { month: "Oct", inbound: 2400, outbound: 2000 },
  { month: "Nov", inbound: 2500, outbound: 2300 },
  { month: "Dec", inbound: 2700, outbound: 2500 },
];

const topSKUsData = [
  { sku: "SKU-001", sales: 320 },
  { sku: "SKU-002", sales: 280 },
  { sku: "SKU-003", sales: 150 },
  { sku: "SKU-004", sales: 100 },
  { sku: "SKU-005", sales: 90 },
  { sku: "SKU-006", sales: 75 },
  { sku: "SKU-007", sales: 60 },
  { sku: "SKU-008", sales: 50 },
];

const categoryData = [
  { name: "Electronics", value: 400 },
  { name: "Clothing", value: 300 },
  { name: "Home", value: 200 },
  { name: "Sports", value: 150 },
  { name: "Gardening", value: 100 },
  { name: "Office", value: 80 },
];

const pickingTimesData = [
  { day: "Mon", time: 35 },
  { day: "Tue", time: 40 },
  { day: "Wed", time: 32 },
  { day: "Thu", time: 45 },
  { day: "Fri", time: 38 },
  { day: "Sat", time: 25 },
  { day: "Sun", time: 30 },
];

const orderCompletionData = [
  { month: "Jan", completed: 800, failed: 50 },
  { month: "Feb", completed: 950, failed: 40 },
  { month: "Mar", completed: 1200, failed: 60 },
  { month: "Apr", completed: 1300, failed: 55 },
  { month: "May", completed: 1500, failed: 70 },
  { month: "Jun", completed: 1700, failed: 80 },
  { month: "Jul", completed: 1800, failed: 75 },
  { month: "Aug", completed: 1650, failed: 90 },
  { month: "Sep", completed: 2000, failed: 100 },
  { month: "Oct", completed: 2200, failed: 120 },
  { month: "Nov", completed: 2300, failed: 110 },
  { month: "Dec", completed: 2450, failed: 130 },
];

const warehouseCapacityData = [
  { name: "Central Warehouse", used: 8000, free: 2000, total: 10000 },
  { name: "North Warehouse", used: 7000, free: 3000, total: 10000 },
  { name: "South Warehouse", used: 6500, free: 1500, total: 8000 },
  { name: "East Warehouse", used: 3000, free: 2000, total: 5000 },
  { name: "West Warehouse", used: 4000, free: 4000, total: 8000 },
  { name: "Auxiliary Warehouse", used: 1200, free: 1800, total: 3000 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A461D8", "#FF6AB2"];

/* MAP: Higher scale for closer zoom */
interface WarehouseMarker {
  name: string;
  coordinates: [number, number];
  totalStock: number;
  status: "OK" | "LOW";
}

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const warehouseMapData: WarehouseMarker[] = [
  { name: "CDMX-WH1", coordinates: [-99.1332, 19.4326], totalStock: 80, status: "OK" },
  { name: "Monterrey-WH2", coordinates: [-100.3161, 25.6866], totalStock: 50, status: "LOW" },
  { name: "Tokyo-WH9", coordinates: [139.6503, 35.6762], totalStock: 16, status: "OK" },
  { name: "Houston-WH3", coordinates: [-95.3698, 29.7604], totalStock: 25, status: "OK" },
  { name: "LosAngeles-WH5", coordinates: [-118.2437, 34.0522], totalStock: 7, status: "LOW" },
  { name: "Berlin-WH10", coordinates: [13.4050, 52.5200], totalStock: 12, status: "OK" },
  { name: "Shanghai-WH12", coordinates: [121.4737, 31.2304], totalStock: 30, status: "OK" },
];

/* ==============================================
   3) MAIN COMPONENT
   ============================================== */
export default function DashboardsPage() {
  // State for map center and zoom
  const [mapCenter, setMapCenter] = useState<[number, number]>([0, 20]);
  const [mapZoom, setMapZoom] = useState(1);
  const [kpiData, setKpiData] = useState<KPI[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Click on side list item
  const handleListClick = (wh: WarehouseMarker) => {
    setMapCenter(wh.coordinates);
    setMapZoom(4);
  };

  // Click on a marker
  const handleMarkerClick = (wh: WarehouseMarker) => {
    setMapCenter(wh.coordinates);
    setMapZoom(4);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_URL}/dashboard/kpis`);
        const data = await res.json();
        setKpiData([
          { label: 'Total Items', value: data.items || 0 },
          { label: 'Total Stock (units)', value: data.stock || 0 },
          { label: 'Monthly Orders', value: data.orders || 0 },
          { label: 'Incidents', value: data.incidents || 0 },
        ]);
      } catch (err) {
        console.error('Error fetching KPIs', err);
      }

      try {
        const resN = await fetch(`${API_URL}/dashboard/notifications`);
        const notifData = await resN.json();
        if (Array.isArray(notifData)) {
          setNotifications(notifData);
        }
      } catch (err) {
        console.error('Error fetching notifications', err);
      }
    };

    fetchData();
  }, []);

  // Export data to Excel
  const exportChartDataToExcel = (dataArray: any[], sheetName: string) => {
    const workbook = XLSX.utils.book_new();
    const sheet = XLSX.utils.json_to_sheet(dataArray);
    XLSX.utils.book_append_sheet(workbook, sheet, sheetName);
    XLSX.writeFile(workbook, `${sheetName}.xlsx`);
  };

  return (
    <DashboardContainer>
      {/* Header */}
      <Header>
        <TitleSection>
          <TitleImage src="/logos/dashboard.svg" alt="Dashboard Icon" />
          <TitleText>Dashboard</TitleText>
        </TitleSection>
      </Header>

      {/* KPIs */}
      <KPISection>
        {kpiData.map((kpi, i) => (
          <KPICard key={i}>
            <KPIValue>{kpi.value}</KPIValue>
            <KPILabel>{kpi.label}</KPILabel>
          </KPICard>
        ))}
      </KPISection>

      {notifications.length > 0 && (
        <ul>
          {notifications.map((n, idx) => (
            <li key={idx}>{n.message}</li>
          ))}
        </ul>
      )}

      {/* MAIN GRID */}
      <DashboardGrid>
        {/* AREA CHART */}
        <AreaChartWrapper>
          <ChartHeader>
            <ChartTitle>Order Performance</ChartTitle>
            <DownloadButton
              onClick={() => exportChartDataToExcel(orderCompletionData, "OrderPerformance")}
            >
              ↓
            </DownloadButton>
          </ChartHeader>
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={orderCompletionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorFailed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ffc658" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="completed"
                  stroke="#82ca9d"
                  fill="url(#colorCompleted)"
                  animationDuration={1500}
                />
                <Area
                  type="monotone"
                  dataKey="failed"
                  stroke="#ffc658"
                  fill="url(#colorFailed)"
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </AreaChartWrapper>

        {/* LINE CHART - Inbound vs Outbound */}
        <LineChartWrapper>
          <ChartHeader>
            <ChartTitle>Monthly Flow</ChartTitle>
            <DownloadButton
              onClick={() => exportChartDataToExcel(inboundOutboundData, "MonthlyFlow")}
            >
              ↓
            </DownloadButton>
          </ChartHeader>
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={inboundOutboundData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="5 5" stroke="#ccc" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="inbound"
                  stroke="#8884d8"
                  strokeWidth={2}
                  name="Inbound"
                  animationDuration={1500}
                />
                <Line
                  type="monotone"
                  dataKey="outbound"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  name="Outbound"
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </LineChartWrapper>

        {/* BARS - TOP SKUs */}
        <BarChartWrapper>
          <ChartHeader>
            <ChartTitle>Top SKUs</ChartTitle>
            <DownloadButton
              onClick={() => exportChartDataToExcel(topSKUsData, "TopSKUs")}
            >
              ↓
            </DownloadButton>
          </ChartHeader>
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topSKUsData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                <XAxis dataKey="sku" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#82ca9d" animationDuration={1500} name="Sales" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </BarChartWrapper>

        {/* PIE CHART - CATEGORIES */}
        <PieChartWrapper>
          <ChartHeader>
            <ChartTitle>Categories</ChartTitle>
            <DownloadButton
              onClick={() => exportChartDataToExcel(categoryData, "Categories")}
            >
              ↓
            </DownloadButton>
          </ChartHeader>
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  label
                  animationDuration={1500}
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </PieChartWrapper>

        {/* STACKED BAR - WAREHOUSE CAPACITY */}
        <CapacityBarWrapper>
          <ChartHeader>
            <ChartTitle>Warehouse Capacity</ChartTitle>
            <DownloadButton
              onClick={() =>
                exportChartDataToExcel(warehouseCapacityData, "WarehouseCapacity")
              }
            >
              ↓
            </DownloadButton>
          </ChartHeader>
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={warehouseCapacityData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="5 5" stroke="#ccc" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="used"
                  stackId="cap"
                  fill="#f66c7b"
                  animationDuration={1500}
                  name="Used"
                />
                <Bar
                  dataKey="free"
                  stackId="cap"
                  fill="#82ca9d"
                  animationDuration={1500}
                  name="Free"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CapacityBarWrapper>

        {/* LINE CHART - PICKING TIME */}
        <PickingLineWrapper>
          <ChartHeader>
            <ChartTitle>Picking Time</ChartTitle>
            <DownloadButton
              onClick={() => exportChartDataToExcel(pickingTimesData, "PickingTime")}
            >
              ↓
            </DownloadButton>
          </ChartHeader>
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={pickingTimesData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="5 5" stroke="#ccc" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="time"
                  stroke="#8884d8"
                  strokeWidth={2}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </PickingLineWrapper>

        {/* MAP + DETAIL (using center and zoom on ComposableMap) */}
        <MapWrapper>
          <ChartHeader>
            <ChartTitle>Warehouse Locations Map</ChartTitle>
            <DownloadButton
              onClick={() => exportChartDataToExcel(warehouseMapData, "WarehouseMap")}
            >
              ↓
            </DownloadButton>
          </ChartHeader>
          <BigMapContainer>
            <ResponsiveContainer width="100%" height="100%">
              <ComposableMap center={mapCenter} zoom={mapZoom}>
                <Geographies geography={geoUrl}>
                  {({ geographies }: { geographies: any[] }) =>
                    geographies.map((geo) => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill="#e0e0e0"
                        stroke="#999"
                        strokeWidth={0.5}
                      />
                    ))
                  }
                </Geographies>
                {warehouseMapData.map((wh) => (
                  <Marker
                    key={wh.name}
                    coordinates={wh.coordinates}
                    onClick={() => {
                      setMapCenter(wh.coordinates);
                      setMapZoom(4);
                    }}
                  >
                    <circle
                      r={5}
                      fill={wh.status === "OK" ? "#00C49F" : "#FFBB28"}
                      stroke="#FFF"
                      strokeWidth={1.5}
                      style={{ cursor: "pointer" }}
                    />
                    <text
                      x={8}
                      y={2}
                      textAnchor="start"
                      style={{
                        fontFamily: "sans-serif",
                        fontSize: "10px",
                        fill: "#333",
                        pointerEvents: "none",
                      }}
                    >
                      {wh.name} ({wh.totalStock})
                    </text>
                  </Marker>
                ))}
              </ComposableMap>
            </ResponsiveContainer>
          </BigMapContainer>
        </MapWrapper>

        <MapDetailWrapper>
          <ChartHeader>
            <ChartTitle>Map Details</ChartTitle>
          </ChartHeader>
          <MapDetailBox>
            {warehouseMapData.map((wh) => (
              <DetailItem
                key={wh.name}
                onClick={() => {
                  setMapCenter(wh.coordinates);
                  setMapZoom(4);
                }}
              >
                <span>{wh.name} ({wh.totalStock})</span>
                <Dot status={wh.status} />
              </DetailItem>
            ))}
          </MapDetailBox>
        </MapDetailWrapper>
      </DashboardGrid>
    </DashboardContainer>
  );
}

/* ==============================================
   4) STYLES
   ============================================== */

const DashboardContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #fdfdfd;
  padding: 1rem 2rem;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  gap: 0.75rem;
`;

const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const TitleImage = styled.img`
  width: 48px;
  height: 48px;
`;

const TitleText = styled.h1`
  font-size: 2rem;
  color: #333;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0;
`;

const KPISection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const KPICard = styled.div`
  background: #fff;
  border-radius: 0.75rem;
  padding: 1rem;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
  }
`;

const KPIValue = styled.div`
  font-size: 1.6rem;
  font-weight: bold;
  color: #333;
`;

const KPILabel = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-top: 0.3rem;
`;

const DashboardGrid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto auto auto;
  grid-template-areas:
    "area area line bar"
    "pie capacity picking bar"
    "map map map mapDetail";
`;

const AreaChartWrapper = styled.div`
  grid-area: area;
  background: #fff;
  border-radius: 0.75rem;
  padding: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const LineChartWrapper = styled.div`
  grid-area: line;
  background: #fff;
  border-radius: 0.75rem;
  padding: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const BarChartWrapper = styled.div`
  grid-area: bar;
  background: #fff;
  border-radius: 0.75rem;
  padding: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const PieChartWrapper = styled.div`
  grid-area: pie;
  background: #fff;
  border-radius: 0.75rem;
  padding: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const CapacityBarWrapper = styled.div`
  grid-area: capacity;
  background: #fff;
  border-radius: 0.75rem;
  padding: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const PickingLineWrapper = styled.div`
  grid-area: picking;
  background: #fff;
  border-radius: 0.75rem;
  padding: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const MapWrapper = styled.div`
  grid-area: map;
  background: linear-gradient(135deg, #f9f9f9, #f3f3f3);
  border-radius: 0.75rem;
  padding: 0.5rem;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.1);
`;

const MapDetailWrapper = styled.div`
  grid-area: mapDetail;
  background: #fff;
  border-radius: 0.75rem;
  padding: 0.5rem;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.1);
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.5rem;
`;

const ChartTitle = styled.h3`
  font-size: 0.95rem;
  font-weight: bold;
  color: #444;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
`;

const DownloadButton = styled.button`
  background: #007bff;
  color: #fff;
  border: none;
  padding: 0.4rem 0.7rem;
  border-radius: 0.3rem;
  cursor: pointer;
  font-size: 0.8rem;
  &:hover {
    background: #0056b3;
  }
`;

const ChartContainer = styled.div`
  width: 100%;
  height: 220px;
  margin-top: 0.5rem;
`;

const BigMapContainer = styled.div`
  width: 100%;
  height: 450px;
  border-radius: 0.5rem;
  overflow: hidden;
  background: #fafafa;
  margin-top: 0.5rem;
`;

const MapDetailBox = styled.div`
  padding: 0.5rem;
  font-size: 0.9rem;
  color: #555;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
  span {
    color: #333;
    font-size: 0.9rem;
  }
`;

const Dot = styled.div<{ status: "OK" | "LOW" }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ status }) => (status === "OK" ? "#00C49F" : "#FFBB28")};
`;
