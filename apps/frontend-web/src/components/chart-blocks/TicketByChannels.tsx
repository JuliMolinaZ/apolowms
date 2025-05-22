"use client";

import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import styled from "styled-components";

const data = [
  { channel: "Email", tickets: 400 },
  { channel: "Phone", tickets: 300 },
  { channel: "Chat", tickets: 500 },
  { channel: "Social", tickets: 200 },
];

const ChartWrapper = styled.div`
  width: 100%;
  height: 300px;
`;

export default function TicketByChannels() {
  return (
    <ChartWrapper>
      <BarChart width={400} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="channel" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="tickets" fill="#8884d8" />
      </BarChart>
    </ChartWrapper>
  );
}
