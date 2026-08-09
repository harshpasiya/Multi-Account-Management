import type { Metadata } from "next"
import { OrderTicket } from "@/components/trade/order-ticket"
import {
  getActiveAccounts,
  getSessionByAccount,
  getInstruments,
} from "@/lib/mock-data"

export const metadata: Metadata = {
  title: "Place Order",
}

export default function TradePage() {
  const accounts = getActiveAccounts().map((a) => ({
    ...a,
    session: getSessionByAccount(a.id)?.status ?? "not_started",
  }))
  const instruments = getInstruments()

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
