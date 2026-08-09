"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { PnlValue } from "@/components/pnl-value"
import { formatINR, formatNumber, type Position } from "@/lib/mock-data"

export function PositionsTable({
  positions,
  showAccount,
  accountNames,
}: {
  positions: Position[]
  showAccount?: boolean
  accountNames?: Record<string, string>
}) {
  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Symbol</TableHead>
            {showAccount && <TableHead>Client</TableHead>}
            <TableHead>Side</TableHead>
            <TableHead>Product</TableHead>
            <TableHead className="text-right">Qty</TableHead>
            <TableHead className="text-right">Avg</TableHead>
            <TableHead className="text-right">LTP</TableHead>
            <TableHead className="text-right">P&L</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {positions.map((p) => (
            <TableRow key={p.id}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-mono font-medium">{p.symbol}</span>
                  <span className="text-xs text-muted-foreground">
                    {p.exchange}
                  </span>
                </div>
              </TableCell>
              {showAccount && (
                <TableCell className="text-muted-foreground">
                  {accountNames?.[p.accountId] ?? p.accountId}
                </TableCell>
              )}
              <TableCell>
                <Badge
                  variant="outline"
                  className={
                    p.side === "long"
                      ? "border-[var(--profit)]/40 text-[var(--profit)]"
                      : "border-[var(--loss)]/40 text-[var(--loss)]"
                  }
                >
                  {p.side.toUpperCase()}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="font-mono text-xs text-muted-foreground">
                  {p.product}
                </span>
              </TableCell>
              <TableCell className="text-right font-mono tabular-nums">
                {formatNumber(p.quantity)}
              </TableCell>
              <TableCell className="text-right font-mono tabular-nums">
                {formatINR(p.avgPrice)}
              </TableCell>
              <TableCell className="text-right font-mono tabular-nums">
                {formatINR(p.lastPrice)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex flex-col items-end">
                  <PnlValue value={p.pnl} />
                  <span
                    className={
                      "text-xs tabular-nums " +
                      (p.pnl >= 0
                        ? "text-[var(--profit)]"
                        : "text-[var(--loss)]")
                    }
                  >
                    {p.pnlPercent >= 0 ? "+" : ""}
                    {p.pnlPercent}%
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {positions.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={showAccount ? 8 : 7}
                className="h-24 text-center text-muted-foreground"
              >
                No open positions.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
