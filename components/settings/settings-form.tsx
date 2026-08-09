"use client"

import * as React from "react"
import { toast } from "sonner"
import { CheckCircle2 } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

export function SettingsForm() {
  const [defaultShare, setDefaultShare] = React.useState("20")
  const [autoReset, setAutoReset] = React.useState(true)
  const [confirmOrders, setConfirmOrders] = React.useState(true)
  const [skipUnauthed, setSkipUnauthed] = React.useState(true)

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Broker connection</CardTitle>
            <Badge className="gap-1 bg-[var(--profit)] text-white">
              <CheckCircle2 className="size-3" />
              Connected
            </Badge>
          </div>
          <CardDescription>
            Zerodha Kite Connect API credentials used to authenticate client
            sessions.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="apikey">API key</Label>
            <Input
              id="apikey"
              defaultValue="kite_live_••••••••4821"
              className="font-mono"
              readOnly
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="secret">API secret</Label>
            <Input
              id="secret"
              type="password"
              defaultValue="supersecretvalue"
              className="font-mono"
              readOnly
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            onClick={() => toast.success("Broker credentials verified")}
          >
            Test connection
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Trading defaults</CardTitle>
          <CardDescription>
            Applied to new accounts and the order ticket.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="share">Default profit share (%)</Label>
            <Input
              id="share"
              inputMode="numeric"
              value={defaultShare}
              onChange={(e) =>
                setDefaultShare(e.target.value.replace(/[^0-9]/g, ""))
              }
              className="font-mono"
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-0.5">
              <Label htmlFor="confirm">Confirm before placing orders</Label>
              <span className="text-xs text-muted-foreground">
                Show a review step for multi-account orders.
              </span>
            </div>
            <Switch
              id="confirm"
              checked={confirmOrders}
              onCheckedChange={setConfirmOrders}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-0.5">
              <Label htmlFor="skip">Skip unauthenticated accounts</Label>
              <span className="text-xs text-muted-foreground">
                Silently drop accounts without a live session.
              </span>
            </div>
            <Switch
              id="skip"
              checked={skipUnauthed}
              onCheckedChange={setSkipUnauthed}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daily session</CardTitle>
          <CardDescription>
            Client Kite sessions expire at end of each trading day.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-0.5">
              <Label htmlFor="autoreset">Auto-expire at market close</Label>
              <span className="text-xs text-muted-foreground">
                Reset all sessions at 3:30 PM IST automatically.
              </span>
            </div>
            <Switch
              id="autoreset"
              checked={autoReset}
              onCheckedChange={setAutoReset}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manager profile</CardTitle>
          <CardDescription>Displayed on payout receipts.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" defaultValue="Harsh Pasiya" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="firm">Firm / SEBI reg.</Label>
            <Input id="firm" defaultValue="INH000000000" className="font-mono" />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => toast.success("Settings saved")}>
            Save changes
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
