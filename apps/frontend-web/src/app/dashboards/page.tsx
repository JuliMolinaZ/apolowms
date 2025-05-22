"use client";

import React, { useState } from "react";
import styled from "styled-components";
import * as XLSX from "xlsx";
import dynamic from "next/dynamic";
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
   1) IMPORTS MAPA (react-simple-maps) v2
   Nota: ZoomableGroup ya no existe en la versión 2, se usará center y zoom en ComposableMap.
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
   2) DATOS DE PRUEBA
   ============================================== */
const kpiData = [
  { label: "Ítems Totales", value: 1145 },
  { label: "Stock Total (unid.)", value: 23543 },
  { label: "Órdenes Mensuales", value: 2134 },
  { label: "Pendientes de Envío", value: 78 },
];

const inboundOutboundData = [
  { mes: "Ene", inbound: 1200, outbound: 800 },
  { mes: "Feb", inbound: 1100, outbound: 950 },
  { mes: "Mar", inbound: 1500, outbound: 1300 },
  { mes: "Abr", inbound: 1800, outbound: 1200 },
  { mes: "May", inbound: 1600, outbound: 1400 },
  { mes: "Jun", inbound: 2000, outbound: 1700 },
  { mes: "Jul", inbound: 2100, outbound: 1850 },
  { mes: "Ago", inbound: 1950, outbound: 1600 },
  { mes: "Sep", inbound: 2200, outbound: 1900 },
  { mes: "Oct", inbound: 2400, outbound: 2000 },
  { mes: "Nov", inbound: 2500, outbound: 2300 },
  { mes: "Dic", inbound: 2700, outbound: 2500 },
];

const topSKUsData = [
  { sku: "SKU-001", ventas: 320 },
  { sku: "SKU-002", ventas: 280 },
  { sku: "SKU-003", ventas: 150 },
  { sku: "SKU-004", ventas: 100 },
  { sku: "SKU-005", ventas: 90 },
  { sku: "SKU-006", ventas: 75 },
  { sku: "SKU-007", ventas: 60 },
  { sku: "SKU-008", ventas: 50 },
];

const categoryData = [
  { name: "Electrónicos", value: 400 },
  { name: "Ropa", value: 300 },
  { name: "Hogar", value: 200 },
  { name: "Deportes", value: 150 },
  { name: "Jardinería", value: 100 },
  { name: "Oficina", value: 80 },
];

const pickingTimesData = [
  { dia: "Lun", tiempo: 35 },
  { dia: "Mar", tiempo: 40 },
  { dia: "Mié", tiempo: 32 },
  { dia: "Jue", tiempo: 45 },
  { dia: "Vie", tiempo: 38 },
  { dia: "Sáb", tiempo: 25 },
  { dia: "Dom", tiempo: 30 },
];

const orderCompletionData = [
  { mes: "Ene", completadas: 800, fallidas: 50 },
  { mes: "Feb", completadas: 950, fallidas: 40 },
  { mes: "Mar", completadas: 1200, fallidas: 60 },
  { mes: "Abr", completadas: 1300, fallidas: 55 },
  { mes: "May", completadas: 1500, fallidas: 70 },
  { mes: "Jun", completadas: 1700, fallidas: 80 },
  { mes: "Jul", completadas: 1800, fallidas: 75 },
  { mes: "Ago", completadas: 1650, fallidas: 90 },
  { mes: "Sep", completadas: 2000, fallidas: 100 },
  { mes: "Oct", completadas: 2200, fallidas: 120 },
  { mes: "Nov", completadas: 2300, fallidas: 110 },
  { mes: "Dic", completadas: 2450, fallidas: 130 },
];

const warehouseCapacityData = [
  { name: "Almacén Central", used: 8000, free: 2000, total: 10000 },
  { name: "Almacén Norte", used: 7000, free: 3000, total: 10000 },
  { name: "Almacén Sur", used: 6500, free: 1500, total: 8000 },
  { name: "Almacén Este", used: 3000, free: 2000, total: 5000 },
  { name: "Almacén Oeste", used: 4000, free: 4000, total: 8000 },
  { name: "Almacén Aux", used: 1200, free: 1800, total: 3000 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A461D8", "#FF6AB2"];

/* MAPA: Escala alta para ver más cerca */
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
  { name: "Tokio-WH9", coordinates: [139.6503, 35.6762], totalStock: 16, status: "OK" },
  { name: "Houston-WH3", coordinates: [-95.3698, 29.7604], totalStock: 25, status: "OK" },
  { name: "Los Angeles-WH5", coordinates: [-118.2437, 34.0522], totalStock: 7, status: "LOW" },
  { name: "Berlín-WH10", coordinates: [13.4050, 52.5200], totalStock: 12, status: "OK" },
  { name: "Shanghái-WH12", coordinates: [121.4737, 31.2304], totalStock: 30, status: "OK" },
];

/* ==============================================
   3) COMPONENTE PRINCIPAL
   ============================================== */
export default function DashboardsPage() {
  // Estado para zoom y centro
  const [mapCenter, setMapCenter] = useState<[number, number]>([0, 20]);
  const [mapZoom, setMapZoom] = useState(1);

  // Al hacer clic en la lista lateral
  const handleListClick = (wh: WarehouseMarker) => {
    setMapCenter(wh.coordinates);
    setMapZoom(4);
  };

  // Al hacer clic en un marcador
  const handleMarkerClick = (wh: WarehouseMarker) => {
    setMapCenter(wh.coordinates);
    setMapZoom(4);
  };

  // Exportar data a Excel
  const exportChartDataToExcel = (dataArray: any[], sheetName: string) => {
    const workbook = XLSX.utils.book_new();
    const sheet = XLSX.utils.json_to_sheet(dataArray);
    XLSX.utils.book_append_sheet(workbook, sheet, sheetName);
    XLSX.writeFile(workbook, `${sheetName}.xlsx`);
  };

  return (
    <DashboardContainer>
      {/* Encabezado */}
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

      {/* GRID PRINCIPAL */}
      <DashboardGrid>
        {/* AREA CHART */}
        <AreaChartWrapper>
          <ChartHeader>
            <ChartTitle>Rendimiento Órdenes</ChartTitle>
            <DownloadButton
              onClick={() => exportChartDataToExcel(orderCompletionData, "RendimientoOrdenes")}
            >
              ↓
            </DownloadButton>
          </ChartHeader>
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={orderCompletionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCompletadas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorFallidas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ffc658" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="mes" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="completadas"
                  stroke="#82ca9d"
                  fill="url(#colorCompletadas)"
                  animationDuration={1500}
                />
                <Area
                  type="monotone"
                  dataKey="fallidas"
                  stroke="#ffc658"
                  fill="url(#colorFallidas)"
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </AreaChartWrapper>

        {/* LINE CHART - Inbound vs Outbound */}
        <LineChartWrapper>
          <ChartHeader>
            <ChartTitle>Flujo Mensual</ChartTitle>
            <DownloadButton
              onClick={() => exportChartDataToExcel(inboundOutboundData, "FlujoMensual")}
            >
              ↓
            </DownloadButton>
          </ChartHeader>
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={inboundOutboundData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="5 5" stroke="#ccc" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="inbound"
                  stroke="#8884d8"
                  strokeWidth={2}
                  name="Entradas"
                  animationDuration={1500}
                />
                <Line
                  type="monotone"
                  dataKey="outbound"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  name="Salidas"
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </LineChartWrapper>

        {/* BARRAS - TOP SKUs */}
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
                <Bar dataKey="ventas" fill="#82ca9d" animationDuration={1500} name="Ventas" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </BarChartWrapper>

        {/* PIE CHART - Categorías */}
        <PieChartWrapper>
          <ChartHeader>
            <ChartTitle>Categorías</ChartTitle>
            <DownloadButton
              onClick={() => exportChartDataToExcel(categoryData, "Categorias")}
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

        {/* STACKED BAR - Capacidad */}
        <CapacityBarWrapper>
          <ChartHeader>
            <ChartTitle>Capacidad Almacenes</ChartTitle>
            <DownloadButton
              onClick={() =>
                exportChartDataToExcel(warehouseCapacityData, "CapacidadAlmacenes")
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
                  name="Usado"
                />
                <Bar
                  dataKey="free"
                  stackId="cap"
                  fill="#82ca9d"
                  animationDuration={1500}
                  name="Libre"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CapacityBarWrapper>

        {/* LINE CHART - Tiempo de Picking */}
        <PickingLineWrapper>
          <ChartHeader>
            <ChartTitle>Tiempo Picking</ChartTitle>
            <DownloadButton
              onClick={() => exportChartDataToExcel(pickingTimesData, "TiempoPicking")}
            >
              ↓
            </DownloadButton>
          </ChartHeader>
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={pickingTimesData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="5 5" stroke="#ccc" />
                <XAxis dataKey="dia" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="tiempo"
                  stroke="#8884d8"
                  strokeWidth={2}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </PickingLineWrapper>

        {/* MAPA + DETALLE (sin ZoomableGroup, usando center y zoom en ComposableMap) */}
        <MapWrapper>
          <ChartHeader>
            <ChartTitle>Mapa de Sucursales</ChartTitle>
            <DownloadButton
              onClick={() => exportChartDataToExcel(warehouseMapData, "MapaSucursales")}
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
            <ChartTitle>Detalle del Mapa</ChartTitle>
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
   4) ESTILOS
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
