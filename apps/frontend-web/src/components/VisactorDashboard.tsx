// myorg/apps/frontend-web/src/components/VisactorDashboard.tsx
"use client";

import React from "react";
import styled from "styled-components";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

// Contenedor con estilos inspirados en la plantilla Visactor
const DashboardContainer = styled.div`
  background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const ChartTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  text-align: center;
`;

// Datos de ejemplo para el gráfico
const data = [
  { name: "Ene", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 500 },
  { name: "Abr", value: 200 },
  { name: "May", value: 278 },
  { name: "Jun", value: 189 },
];

const VisactorDashboard: React.FC = () => {
  return (
    <DashboardContainer>
      <ChartTitle>Visactor Dashboard</ChartTitle>
      <LineChart width={500} height={300} data={data}>
        <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
      </LineChart>
    </DashboardContainer>
  );
};

export default VisactorDashboard;
