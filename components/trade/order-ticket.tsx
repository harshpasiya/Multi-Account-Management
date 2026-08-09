"use client"

import * as React from "react"
import { toast } from "sonner"
import { Check, Search } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
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
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  formatINR,
  formatNumber,
  type ClientAccount,
  type Instrument,
} from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export function OrderTicket({
  accounts,
  instruments,
}: {
  accounts: (ClientAccount & { session: string })[]
  instruments: Instrument[]
}) {
  const [side, setSide] = React.useState<"buy" | "sell">("buy")
  const [symbol, setSymbol] = React.useState(instruments[0]?.symbol ?? "")
  const [orderType, setOrderType] = React.useState("market")
  const [product, setProduct] = React.useState("MIS")
  const [qty, setQty] = React.useState("50")
  const [price, setPrice] = React.useState("")
  const [selected, setSelected] = React.useState<string[]>(
    accounts.filter((a) => a.session === "active").map((a) => a.id),
  )
  const [query, setQuery] = React.useState("")

  const authedAccounts = accounts.filter((a) => a.session === "active")
  const filtered = accounts.filter(
    (a) =>
      a.name.toLowerCase().includes(query.toLowerCase()) ||
      a.zerodhaClientId.toLowerCase().includes(query.toLowerCase()),
  )

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  function selectAllAuthed() {
    setSelected(authedAccounts.map((a) => a.id))
  }

  const quantity = Number.parseInt(qty || "0", 10)
  const estPrice = Number.parseFloat(price || "0")
  const showPrice = orderType === "limit" || orderType === "sl"

  function placeOrder() {
    if (selected.length === 0) {
      toast.error("Select at least one client account")
      return
    }
    if (!quantity || quantity <= 0) {
      toast.error("Enter a valid quantity")
      return
    }
    const notAuthed = selected.filter(
      (id) => accounts.find((a) => a.id === id)?.session !== "active",
    )
    if (notAuthed.length > 0) {
      toast.warning(
        `${notAuthed.length} selected ${notAuthed.length === 1 ? "account is" : "accounts are"} not authenticated and will be skipped`,
      )
    }
    const placed = selected.length - notAuthed.length
    toast.success(
      `${side.toUpperCase()} ${formatNumber(quantity)} ${symbol} sent to ${placed} ${placed === 1 ? "account" : "accounts"}`,
      {
        description: `${orderType.toUpperCase()} · ${product}${showPrice ? ` @ ${formatINR(estPrice)}` : " @ market"}`,
      },
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <Card>
        <CardHeader>
          <CardTitle>Order Ticket</CardTitle>
          <CardDescription>
            One ticket, fanned out across every selected client account.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <ToggleGroup
            value={[side]}
            onValueChange={(v) => v[0] && setSide(v[0] as "buy" | "sell")}
            className="w-full"
          >
            <ToggleGroupItem
              value="buy"
              className={cn(
                "flex-1 data-[state=on]:bg-[var(--profit)] data-[state=on]:text-white",
              )}
            >
              BUY
            </ToggleGroupItem>
            <ToggleGroupItem
              value="sell"
              className={cn(
                "flex-1 data-[state=on]:bg-[var(--loss)] data-[state=on]:text-white",
              )}
            >
              SELL
            </ToggleGroupItem>
          </ToggleGroup>

          <div className="flex flex-col gap-2">
            <Label htmlFor="symbol">Instrument</Label>
            <Select value={symbol} onValueChange={(value) => setSymbol(value ?? symbol)}>
              <SelectTrigger id="symbol">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {instruments.map((i) => (
                    <SelectItem key={i.symbol} value={i.symbol}>
                      <span className="font-mono">{i.symbol}</span>
                      <span className="ml-2 text-muted-foreground">
                        {i.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="qty">Quantity</Label>
              <Input
                id="qty"
                inputMode="numeric"
                value={qty}
                onChange={(e) => setQty(e.target.value.replace(/[^0-9]/g, ""))}
                className="font-mono"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="product">Product</Label>
              <Select value={product} onValueChange={(value) => setProduct(value ?? product)}>
                <SelectTrigger id="product">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="MIS">MIS · Intraday</SelectItem>
                    <SelectItem value="CNC">CNC · Delivery</SelectItem>
                    <SelectItem value="NRML">NRML · Normal</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="ordertype">Order type</Label>
              <Select value={orderType} onValueChange={(value) => setOrderType(value ?? orderType)}>
                <SelectTrigger id="ordertype">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="market">Market</SelectItem>
                    <SelectItem value="limit">Limit</SelectItem>
                    <SelectItem value="sl">Stop loss</SelectItem>
                    <SelectItem value="sl-m">SL market</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                inputMode="decimal"
                placeholder={showPrice ? "0.00" : "At market"}
                disabled={!showPrice}
                value={price}
                onChange={(e) =>
                  setPrice(e.target.value.replace(/[^0-9.]/g, ""))
                }
                className="font-mono"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col items-stretch gap-3">
          <Separator />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Fan-out</span>
            <span className="font-mono">
              {selected.length} {selected.length === 1 ? "account" : "accounts"}{" "}
              &middot; {formatNumber(quantity * selected.length)} total qty
            </span>
          </div>
          <Button
            size="lg"
            onClick={placeOrder}
            className={cn(
              "w-full text-white",
              side === "buy"
                ? "bg-[var(--profit)] hover:bg-[var(--profit)]/90"
                : "bg-[var(--loss)] hover:bg-[var(--loss)]/90",
            )}
          >
            {side === "buy" ? "Place BUY order" : "Place SELL order"}
          </Button>
        </CardFooter>
      </Card>

      <Card className="flex flex-col">
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base">Client accounts</CardTitle>
              <CardDescription>
                {authedAccounts.length} authenticated today
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={selectAllAuthed}>
              All authed
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-3">
          <InputGroup>
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Filter accounts…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </InputGroup>
          <div className="flex flex-col gap-1.5">
            {filtered.map((a) => {
              const isSelected = selected.includes(a.id)
              const authed = a.session === "active"
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => toggle(a.id)}
                  className={cn(
                    "flex items-center justify-between rounded-md border px-3 py-2 text-left transition-colors",
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/50",
                    !authed && "opacity-60",
                  )}
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{a.name}</span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {a.zerodhaClientId}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {!authed && (
                      <Badge variant="outline" className="text-xs">
                        no auth
                      </Badge>
                    )}
                    <span
                      className={cn(
                        "flex size-5 items-center justify-center rounded-full border",
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground/30",
                      )}
                    >
                      {isSelected && <Check className="size-3" />}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
