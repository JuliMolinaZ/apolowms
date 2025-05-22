"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export default function ChartTitle({
  title,
  icon,
  className,
}: {
  title: string;
  icon: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {icon}
      <h2 className="text-lg font-medium">{title}</h2>
    </div>
  );
}
