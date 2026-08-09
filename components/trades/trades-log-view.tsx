"use client"

import * as React from "react"
import { Search } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group"
import { TradesTable } from "@/components/trades-table"
import { type Trade, type ClientAccount } from "@/lib/mock-data"

export function TradesLogView({
  trades,
  accounts,
}: {
  trades: Trade[]
  accounts: ClientAccount[]
}) {
  const [query, setQuery] = React.useState("")
  const [account, setAccount] = React.useState("all")
  const [status, setStatus] = React.useState("all")
  const [side, setSide] = React.useState("all")

  const accountNames = React.useMemo(() => {
    const map: Record<string, string> = {}
    for (const a of accounts) map[a.id] = a.name
    return map
  }, [accounts])

  const filtered = trades.filter((t) => {
    const matchesQuery = t.symbol
      .toLowerCase()
      .includes(query.toLowerCase())
    const matchesAccount = account === "all" || t.accountId === account
    const matchesStatus = status === "all" || t.status === status
    const matchesSide = side === "all" || t.side === side
    return matchesQuery && matchesAccount && matchesStatus && matchesSide
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <InputGroup className="lg:max-w-xs">
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Search symbol…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </InputGroup>
        <div className="grid grid-cols-3 gap-3 lg:flex lg:items-center">
          <Select value={account} onValueChange={setAccount}>
            <SelectTrigger className="lg:w-44">
              <SelectValue placeholder="Account" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All accounts</SelectItem>
                {accounts.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select value={side} onValueChange={setSide}>
            <SelectTrigger className="lg:w-32">
              <SelectValue placeholder="Side" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Buy & Sell</SelectItem>
                <SelectItem value="buy">Buy</SelectItem>
                <SelectItem value="sell">Sell</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="lg:w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="complete">Complete</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <TradesTable
        trades={filtered}
        showAccount
        accountNames={accountNames}
      />

      <p className="text-xs text-muted-foreground">
        {filtered.length} of {trades.length} orders
      </p>
    </div>
  )
}
