import type { Metadata } from "next"
import { TradesLogView } from "@/components/trades/trades-log-view"
import { getLiveTrades, getLiveAccounts } from "@/lib/supabase/data"

export const metadata: Metadata = {
  title: "Order Log",
}

export default async function TradesPage() {
  const [trades, accounts] = await Promise.all([getLiveTrades(), getLiveAccounts()])

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-mono text-2xl font-semibold tracking-tight text-balance">
          Order Log
        </h1>
        <p className="text-sm text-muted-foreground">
          Every order across all client accounts, newest first.
        </p>
      </header>
      <TradesLogView trades={trades} accounts={accounts} />
    </div>
  )
}
