"use client"

import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TradeStatusBadge } from "@/components/status-badges"
import {
  formatINR,
  formatNumber,
  formatDateTime,
  type Trade,
} from "@/lib/mock-data"

export function TradesTable({
  trades,
  showAccount,
  accountNames,
}: {
  trades: Trade[]
  showAccount?: boolean
  accountNames?: Record<string, string>
}) {
  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Time</TableHead>
            <TableHead>Symbol</TableHead>
            {showAccount && <TableHead>Client</TableHead>}
            <TableHead>Side</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Qty</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trades.map((t) => (
            <TableRow key={t.id}>
              <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                {formatDateTime(t.timestamp)}
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-mono font-medium">{t.symbol}</span>
                  <span className="text-xs text-muted-foreground">
                    {t.exchange}
                  </span>
                </div>
              </TableCell>
              {showAccount && (
                <TableCell className="text-muted-foreground">
                  {accountNames?.[t.accountId] ?? t.accountId}
                </TableCell>
              )}
              <TableCell>
                <Badge
                  variant="outline"
                  className={
                    t.side === "buy"
                      ? "border-[var(--profit)]/40 text-[var(--profit)]"
                      : "border-[var(--loss)]/40 text-[var(--loss)]"
                  }
                >
                  {t.side.toUpperCase()}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="font-mono text-xs uppercase text-muted-foreground">
                  {t.orderType}
                </span>
              </TableCell>
              <TableCell className="text-right font-mono tabular-nums">
                {formatNumber(t.quantity)}
              </TableCell>
              <TableCell className="text-right font-mono tabular-nums">
                {formatINR(t.price)}
              </TableCell>
              <TableCell>
                <TradeStatusBadge status={t.status} />
              </TableCell>
            </TableRow>
          ))}
          {trades.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={showAccount ? 8 : 7}
                className="h-24 text-center text-muted-foreground"
              >
                No trades found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
