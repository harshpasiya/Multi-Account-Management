import type { Metadata } from "next"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ReportsTable } from "@/components/reports/reports-table"
import { formatINR } from "@/lib/mock-data"
import { getLiveReports, getLiveAccounts } from "@/lib/supabase/data"

export const metadata: Metadata = {
  title: "Payout Reports",
}

export default async function ReportsPage() {
  const [reports, accounts] = await Promise.all([getLiveReports(), getLiveAccounts()])
  const accountNames: Record<string, string> = {}
  for (const a of accounts) accountNames[a.id] = a.name

  const totalPayable = reports
    .filter((r) => r.status !== "paid")
    .reduce((s, r) => s + r.netPayable, 0)
  const collected = reports
    .filter((r) => r.status === "paid")
    .reduce((s, r) => s + r.netPayable, 0)
  const pendingCount = reports.filter(
    (r) => r.status === "draft" || r.status === "finalized",
  ).length

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-mono text-2xl font-semibold tracking-tight text-balance">
          Payout Reports
        </h1>
        <p className="text-sm text-muted-foreground">
          Period P&L statements and profit-share receipts per client.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Collected (paid)</CardDescription>
            <CardTitle className="font-mono text-xl tabular-nums text-[var(--profit)]">
              {formatINR(collected, { compact: true })}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Outstanding</CardDescription>
            <CardTitle className="font-mono text-xl tabular-nums">
              {formatINR(totalPayable, { compact: true })}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Awaiting action</CardDescription>
            <CardTitle className="font-mono text-xl tabular-nums">
              {pendingCount} {pendingCount === 1 ? "report" : "reports"}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <ReportsTable reports={reports} accountNames={accountNames} />
    </div>
  )
}
