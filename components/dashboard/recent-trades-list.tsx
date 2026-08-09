import { cn } from "@/lib/utils";
import { TradeStatusBadge } from "@/components/status-badges";
import {
  getAccounts,
  getRecentTrades,
  formatINR,
  formatTime,
} from "@/lib/mock-data";

export function RecentTradesList() {
  // TODO: replace with live Kite Connect data
  const trades = getRecentTrades(5);
  const accounts = new Map(getAccounts().map((a) => [a.id, a.name]));

  return (
    <div className="divide-y">
      {trades.map((t) => (
        <div key={t.id} className="flex items-center gap-3 py-2.5">
          <span
            className={cn(
              "flex size-7 shrink-0 items-center justify-center rounded text-[10px] font-bold uppercase",
              t.side === "buy"
                ? "bg-profit/10 text-profit"
                : "bg-loss/10 text-loss",
            )}
          >
            {t.side === "buy" ? "B" : "S"}
          </span>
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-medium">{t.symbol}</span>
              <span className="font-mono text-xs text-muted-foreground tabular-nums">
                {t.quantity} @ {formatINR(t.price)}
              </span>
            </div>
            <span className="truncate text-xs text-muted-foreground">
              {accounts.get(t.accountId)}
            </span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <TradeStatusBadge status={t.status} />
            <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
              {formatTime(t.timestamp)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
