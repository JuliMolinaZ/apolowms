import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MetricCard({
  title,
  value,
  change,
  className,
}: {
  title: string;
  value: number;
  change: number;
  className?: string;
}) {
  return (
    <section className={cn("flex flex-col", className)}>
      <h2 className="mb-1 text-sm text-gray-600">{title}</h2>
      <div className="flex items-center gap-2">
        <span className="text-xl font-medium">{value.toLocaleString()}</span>
        <ChangeIndicator change={change} />
      </div>
      <div className="text-xs text-gray-500">Compare to last month</div>
    </section>
  );
}

function ChangeIndicator({ change }: { change: number }) {
  return (
    <span
      className={cn(
        "flex items-center rounded-sm px-1 py-0.5 text-xs",
        change > 0 ? "bg-green-50 text-green-500" : "bg-red-50 text-red-500"
      )}
    >
      {change > 0 ? "+" : ""}
      {Math.round(change * 100)}%
      {change > 0 ? (
        <ArrowUpRight className="ml-0.5 h-3 w-3" />
      ) : (
        <ArrowDownRight className="ml-0.5 h-3 w-3" />
      )}
    </span>
  );
}
