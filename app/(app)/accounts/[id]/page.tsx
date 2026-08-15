import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { AccountStatusBadge, SessionStatusBadge } from "@/components/status-badges"
import { PnlValue } from "@/components/pnl-value"
import { PnlAreaChart } from "@/components/pnl-area-chart"
import { PositionsTable } from "@/components/positions-table"
import { TradesTable } from "@/components/trades-table"
import { formatINR, formatDate } from "@/lib/mock-data"
import {
  getLiveAccount,
  getLivePositions,
  getLiveTrades,
  getLiveReports,
  getLiveSessions,
  getLiveAccountPnlHistory,
} from "@/lib/supabase/data"
import { ReportsTable } from "@/components/reports/reports-table"

export default async function AccountDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [accountResult, positions, trades, reports, sessions, history] = await Promise.all([
    getLiveAccount(id).catch(() => null),
    getLivePositions(id),
    getLiveTrades(id),
    getLiveReports(id),
    getLiveSessions(),
    getLiveAccountPnlHistory(id),
  ])
  const account = accountResult
  if (!account) notFound()

  const pnl = positions.reduce((sum, position) => sum + position.pnl, 0)
  const session = sessions.find((item) => item.accountId === id)

  const invested = positions.reduce(
    (s, p) => s + p.avgPrice * p.quantity,
    0,
  )

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Button
          variant="ghost"
          size="sm"
          render={<Link href="/accounts" />}
          nativeButton={false}
          className="-ml-2 mb-2"
        >
          <ArrowLeft data-icon="inline-start" />
          All accounts
        </Button>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <h1 className="font-mono text-2xl font-semibold tracking-tight">
                {account.name}
              </h1>
              <AccountStatusBadge status={account.status} />
            </div>
            <p className="text-sm text-muted-foreground">
              Zerodha ID{" "}
              <span className="font-mono text-foreground">
                {account.zerodhaClientId}
              </span>{" "}
              &middot; Joined {formatDate(account.joinedDate)}
            </p>
          </div>
          {session && (
            <div className="flex items-center gap-2 rounded-md border px-3 py-2">
              <span className="text-xs text-muted-foreground">
                Today&apos;s session
              </span>
              <SessionStatusBadge status={session.status} />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Capital</CardDescription>
            <CardTitle className="font-mono text-xl tabular-nums">
              {formatINR(account.capitalContributed, { compact: true })}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Open P&L</CardDescription>
            <CardTitle className="font-mono text-xl">
              <PnlValue value={pnl} compact />
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Deployed</CardDescription>
            <CardTitle className="font-mono text-xl tabular-nums">
              {formatINR(invested, { compact: true })}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Profit share</CardDescription>
            <CardTitle className="font-mono text-xl tabular-nums">
              {account.profitSharePercent}%
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>P&L trend</CardTitle>
          <CardDescription>Cumulative P&L over the last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <PnlAreaChart data={history} />
        </CardContent>
      </Card>

      {account.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Notes</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {account.notes}
          </CardContent>
        </Card>
      )}

      <div>
        <Tabs defaultValue="positions">
          <TabsList>
            <TabsTrigger value="positions">
              Positions ({positions.length})
            </TabsTrigger>
            <TabsTrigger value="trades">Trades ({trades.length})</TabsTrigger>
            <TabsTrigger value="reports">
              Payouts ({reports.length})
            </TabsTrigger>
          </TabsList>
          <Separator className="my-4" />
          <TabsContent value="positions">
            <PositionsTable positions={positions} />
          </TabsContent>
          <TabsContent value="trades">
            <TradesTable trades={trades} />
          </TabsContent>
          <TabsContent value="reports">
            <ReportsTable reports={reports} accountNames={{ [id]: account.name }} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
