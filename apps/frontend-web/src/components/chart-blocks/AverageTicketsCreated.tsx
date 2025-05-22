// src/components/chart-blocks/AverageTicketsCreated.tsx
"use client";

import dynamic from "next/dynamic";
import { useAtomValue } from "jotai";
import type { IBarChartSpec } from "@visactor/vchart";
import { ticketChartDataAtom } from "@/lib/atoms";
import type { TicketMetric } from "@/lib/atoms";

// Importamos VChart dinámicamente para asegurarnos de que se ejecute solo en el cliente.
const VChart = dynamic(
  () => import("@visactor/react-vchart").then((mod) => mod.VChart),
  { ssr: false }
);

const generateSpec = (data: TicketMetric[]): IBarChartSpec => ({
  width: 400, // Ancho definido
  height: 300, // Alto definido
  type: "bar",
  data: [
    {
      id: "barData",
      values: data,
    },
  ],
  xField: "date",
  yField: "count",
  seriesField: "type",
  padding: [10, 0, 10, 0],
  legends: { visible: false },
  stack: false,
  tooltip: { trigger: ["click", "hover"] },
  bar: {
    state: {
      hover: { outerBorder: { distance: 2, lineWidth: 2 } },
    },
    style: {
      cornerRadius: [12, 12, 12, 12],
      zIndex: (datum: any) => (datum.type === "resolved" ? 2 : 1),
    },
  },
});

export default function AverageTicketsCreated() {
  const ticketChartData = useAtomValue(ticketChartDataAtom);
  const spec = generateSpec(ticketChartData);
  return <VChart spec={spec} />;
}
