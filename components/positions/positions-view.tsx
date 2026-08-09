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
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PositionsTable } from "@/components/positions-table"
import { PnlValue } from "@/components/pnl-value"
import {
  formatNumber,
  type Position,
  type ClientAccount,
} from "@/lib/mock-data"

export function PositionsView({
  positions,
  accounts,
}: {
  positions: Position[]
  accounts: ClientAccount[]
}) {
  const [query, setQuery] = React.useState("")
  const [account, setAccount] = React.useState("all")
  const [groupBy, setGroupBy] = React.useState<"none" | "symbol">("none")

  const accountNames = React.useMemo(() => {
    const map: Record<string, string> = {}
    for (const a of accounts) map[a.id] = a.name
    return map
  }, [accounts])

  const filtered = positions.filter((p) => {
    const matchesQuery = p.symbol
      .toLowerCase()
      .includes(query.toLowerCase())
    const matchesAccount = account === "all" || p.accountId === account
    return matchesQuery && matchesAccount
  })

  const grouped = React.useMemo(() => {
    if (groupBy !== "symbol") return null
    const map = new Map<
      string,
      { symbol: string; qty: number; pnl: number; accounts: number }
    >()
    for (const p of filtered) {
      const cur = map.get(p.symbol) ?? {
        symbol: p.symbol,
        qty: 0,
        pnl: 0,
        accounts: 0,
      }
      cur.qty += p.quantity
      cur.pnl += p.pnl
      cur.accounts += 1
      map.set(p.symbol, cur)
    }
    return [...map.values()].sort((a, b) => Math.abs(b.pnl) - Math.abs(a.pnl))
  }, [filtered, groupBy])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <InputGroup className="sm:max-w-xs">
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Search symbol…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </InputGroup>
        <Select value={account} onValueChange={(value) => setAccount(value ?? "all")}>
          <SelectTrigger className="sm:w-48">
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
        <ToggleGroup
          value={[groupBy]}
          onValueChange={(v) => v[0] && setGroupBy(v[0] as "none" | "symbol")}
          variant="outline"
          className="sm:ml-auto"
        >
          <ToggleGroupItem value="none">Flat</ToggleGroupItem>
          <ToggleGroupItem value="symbol">By symbol</ToggleGroupItem>
        </ToggleGroup>
      </div>

      {groupBy === "symbol" && grouped ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {grouped.map((g) => (
            <Card key={g.symbol}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="font-mono text-base">
                    {g.symbol}
                  </CardTitle>
                  <PnlValue value={g.pnl} compact />
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {formatNumber(g.qty)} qty across {g.accounts}{" "}
                {g.accounts === 1 ? "account" : "accounts"}
              </CardContent>
            </Card>
          ))}
          {grouped.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No positions match your filters.
            </p>
          )}
        </div>
      ) : (
        <PositionsTable
          positions={filtered}
          showAccount
          accountNames={accountNames}
        />
      )}

      <p className="text-xs text-muted-foreground">
        {filtered.length} open {filtered.length === 1 ? "position" : "positions"}
      </p>
    </div>
  )
}
