import type { Metadata } from "next"
import { AccountsTable } from "@/components/accounts/accounts-table"
import {
  getAccounts,
  getAccountPnl,
  getTotalAum,
  formatINR,
} from "@/lib/mock-data"

export const metadata: Metadata = {
  title: "Client Accounts",
}

export default function AccountsPage() {
  const accounts = getAccounts()
  const pnlByAccount: Record<string, number> = {}
  for (const a of accounts) {
    pnlByAccount[a.id] = getAccountPnl(a.id)
  }
  const totalAum = getTotalAum()
  const activeCount = accounts.filter((a) => a.status === "active").length

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-mono text-2xl font-semibold tracking-tight text-balance">
          Client Accounts
        </h1>
        <p className="text-sm text-muted-foreground">
          {activeCount} active {activeCount === 1 ? "book" : "books"} &middot;{" "}
          {formatINR(totalAum, { compact: true })} capital under management
        </p>
      </header>

      <AccountsTable
        accounts={accounts}
        pnlByAccount={pnlByAccount}
        defaultShare={20}
      />
    </div>
  )
}
