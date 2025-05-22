// src/components/chart-blocks/Conversions.tsx
"use client";

import dynamic from "next/dynamic";
import type { ICirclePackingChartSpec } from "@visactor/vchart";
import { convertions } from "@/data/convertions";
import { addThousandsSeparator } from "@/lib/utils";

// Importación dinámica de VChart para evitar SSR
const VChart = dynamic(
  () => import("@visactor/react-vchart").then((mod) => mod.VChart),
  { ssr: false }
);

const spec: ICirclePackingChartSpec = {
  width: 400,
  height: 300,
  data: [{ id: "data", values: convertions }],
  type: "circlePacking",
  categoryField: "name",
  valueField: "value",
  drill: true,
  padding: 0,
  layoutPadding: 5,
  label: {
    style: {
      fill: "white",
      stroke: false,
      visible: (d: any) => d.depth === 0,
      text: (d: any) => addThousandsSeparator(d.value),
      fontSize: (d: any) => d.radius / 2,
      dy: (d: any) => d.radius / 8,
    },
  },
  legends: [{ visible: true, orient: "top", position: "start", padding: 0 }],
  tooltip: {
    trigger: ["click", "hover"],
    mark: { content: { value: (d: any) => addThousandsSeparator(d?.value) } },
  },
  animationEnter: { easing: "cubicInOut" },
  animationExit: { easing: "cubicInOut" },
  animationUpdate: { easing: "cubicInOut" },
};

export default function Conversions() {
  return <VChart spec={spec} />;
}
