import type { Metadata } from "next"
import { OrderTicket } from "@/components/trade/order-ticket"
import { getLiveAccounts, getLiveSessions, getLiveInstruments } from "@/lib/supabase/data"

export const metadata: Metadata = {
  title: "Place Order",
}

export default async function TradePage() {
  const [allAccounts, sessions, instruments] = await Promise.all([
    getLiveAccounts(),
    getLiveSessions(),
    getLiveInstruments(),
  ])
  const accounts = allAccounts.filter((account) => account.status === "active").map((account) => ({
    ...account,
    session: sessions.find((session) => session.accountId === account.id)?.status ?? "not_started",
  }))

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-mono text-2xl font-semibold tracking-tight text-balance">
          Place Order
        </h1>
        <p className="text-sm text-muted-foreground">
          Compose a single order and route it across multiple client accounts at
          once.
        </p>
      </header>
      <OrderTicket accounts={accounts} instruments={instruments} />
    </div>
  )
}
