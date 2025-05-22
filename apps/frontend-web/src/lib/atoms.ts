import { atom } from "jotai";

export interface TicketMetric {
  date: string;
  count: number;
  type: "created" | "resolved";
}

export const ticketChartDataAtom = atom<TicketMetric[]>([
  { date: "2023-01-01", count: 100, type: "created" },
  { date: "2023-01-01", count: 80, type: "resolved" },
  { date: "2023-02-01", count: 150, type: "created" },
  { date: "2023-02-01", count: 120, type: "resolved" },
  // Agrega más datos de ejemplo según necesites
]);
