import { cn } from "@/lib/utils";
import { formatSignedINR } from "@/lib/mock-data";

export function pnlClass(value: number) {
  if (value > 0) return "text-profit";
  if (value < 0) return "text-loss";
  return "text-muted-foreground";
}

export function PnlValue({
  value,
  compact,
  className,
  showZeroSign = true,
}: {
  value: number;
  compact?: boolean;
  className?: string;
  showZeroSign?: boolean;
}) {
  const text =
    value === 0 && !showZeroSign
      ? formatSignedINR(0, { compact }).replace("+", "")
      : formatSignedINR(value, { compact });
  return (
    <span className={cn("tabular-nums font-mono", pnlClass(value), className)}>
      {text}
    </span>
  );
}

export function PnlPercent({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const sign = value > 0 ? "+" : "";
  return (
    <span className={cn("tabular-nums font-mono", pnlClass(value), className)}>
      {sign}
      {value.toFixed(2)}%
    </span>
  );
}
