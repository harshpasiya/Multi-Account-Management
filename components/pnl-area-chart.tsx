"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatINR, type PnlPoint } from "@/lib/mock-data";

const chartConfig = {
  cumulative: {
    label: "Cumulative P&L",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function PnlAreaChart({
  data,
  height = "h-64",
}: {
  data: PnlPoint[];
  height?: string;
}) {
  return (
    <ChartContainer config={chartConfig} className={`${height} w-full`}>
      <AreaChart data={data} margin={{ left: 4, right: 8, top: 8, bottom: 0 }}>
        <defs>
          <linearGradient id="fillPnl" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.35} />
            <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.4} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={28}
          tickFormatter={(v: string) =>
            new Date(v).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
            })
          }
          className="text-xs"
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={52}
          tickFormatter={(v: number) => formatINR(v, { compact: true })}
          className="text-xs"
        />
        <ChartTooltip
          cursor={{ strokeDasharray: "3 3" }}
          content={
            <ChartTooltipContent
              labelFormatter={(v) =>
                new Date(v as string).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              }
              formatter={(value) => formatINR(Number(value))}
            />
          }
        />
        <Area
          dataKey="cumulative"
          type="monotone"
          stroke="var(--chart-1)"
          strokeWidth={2}
          fill="url(#fillPnl)"
        />
      </AreaChart>
    </ChartContainer>
  );
}
