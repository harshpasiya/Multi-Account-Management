import type { Metadata } from "next"
import { Card, CardHeader, CardDescription, CardTitle } from "@/components/ui/card"
import { PositionsView } from "@/components/positions/positions-view"
import { PnlValue } from "@/components/pnl-value"
import {
  getPositions,
  getAccounts,
  getAggregatePnl,
  formatNumber,
} from "@/lib/mock-data"

export const metadata: Metadata = {
  title: "Positions",
}

export default function PositionsPage() {
  const positions = getPositions()
  const accounts = getAccounts()
  const aggregate = getAggregatePnl()
  const winners = positions.filter((p) => p.pnl >= 0).length
  const losers = positions.length - winners

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-mono text-2xl font-semibold tracking-tight text-balance">
          Positions
        </h1>
        <p className="text-sm text-muted-foreground">
          Live open positions aggregated across every client book.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Aggregate P&L</CardDescription>
            <CardTitle className="font-mono text-xl">
              <PnlValue value={aggregate} compact />
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Open positions</CardDescription>
            <CardTitle className="font-mono text-xl tabular-nums">
              {formatNumber(positions.length)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>In profit</CardDescription>
            <CardTitle className="font-mono text-xl tabular-nums text-[var(--profit)]">
              {winners}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>In loss</CardDescription>
            <CardTitle className="font-mono text-xl tabular-nums text-[var(--loss)]">
              {losers}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <PositionsView positions={positions} accounts={accounts} />
    </div>
  )
}
