import {
  Landmark,
  Layers,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  formatINR,
  formatNumber,
  formatSignedINR,
  getActiveAccounts,
  getAggregatePnl,
  getOpenPositionsCount,
  getTotalAum,
} from "@/lib/mock-data";
import { pnlClass } from "@/components/pnl-value";

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  valueClass,
  accent,
}: {
  label: string;
  value: string;
  sub: string;
  icon: LucideIcon;
  valueClass?: string;
  accent?: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </span>
          <span
            className={cn(
              "font-mono text-2xl font-semibold tabular-nums",
              valueClass,
            )}
          >
            {value}
          </span>
          <span className="text-xs text-muted-foreground">{sub}</span>
        </div>
        <div
          className={cn(
            "flex size-9 items-center justify-center rounded-md",
            accent ?? "bg-accent text-accent-foreground",
          )}
        >
          <Icon className="size-4.5" />
        </div>
      </CardContent>
    </Card>
  );
}

export function StatCards() {
  // TODO: replace with live Kite Connect data
  const aum = getTotalAum();
  const pnl = getAggregatePnl();
  const openPositions = getOpenPositionsCount();
  const activeClients = getActiveAccounts().length;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Total AUM"
        value={formatINR(aum, { compact: true })}
        sub="Across active accounts"
        icon={Landmark}
      />
      <StatCard
        label="Today's P&L"
        value={formatSignedINR(pnl, { compact: true })}
        sub="Aggregate, all accounts"
        icon={TrendingUp}
        valueClass={pnlClass(pnl)}
        accent={
          pnl >= 0 ? "bg-profit/10 text-profit" : "bg-loss/10 text-loss"
        }
      />
      <StatCard
        label="Open Positions"
        value={formatNumber(openPositions)}
        sub="Live across the book"
        icon={Layers}
      />
      <StatCard
        label="Active Clients"
        value={formatNumber(activeClients)}
        sub="Currently trading"
        icon={Users}
      />
    </div>
  );
}
