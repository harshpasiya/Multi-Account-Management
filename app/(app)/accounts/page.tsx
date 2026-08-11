import type { Metadata } from "next"
import { AccountsTable } from "@/components/accounts/accounts-table"
import { formatINR } from "@/lib/mock-data"
import { getLiveAccounts, getLivePositions } from "@/lib/supabase/data"

export const metadata: Metadata = {
  title: "Client Accounts",
}

export default async function AccountsPage() {
  const [accounts, positions] = await Promise.all([getLiveAccounts(), getLivePositions()])
  const pnlByAccount: Record<string, number> = {}
  for (const position of positions) {
    pnlByAccount[position.accountId] = (pnlByAccount[position.accountId] ?? 0) + position.pnl
  }
  const totalAum = accounts.reduce((sum, account) => sum + account.capitalContributed, 0)
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
