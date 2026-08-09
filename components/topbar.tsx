"use client";

import * as React from "react";
import Link from "next/link";
import { ShieldCheck, TrendingUp, TrendingDown } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { formatSignedINR } from "@/lib/mock-data";

// A live-feel aggregate P&L badge. Seeds from the real aggregate value and
// jitters slightly on an interval to simulate a ticking market feed.
// TODO: replace with live Kite Connect data (websocket P&L stream).
function LivePnlBadge({ base }: { base: number }) {
  const [value, setValue] = React.useState(base);
  const [pulse, setPulse] = React.useState(false);

  React.useEffect(() => {
    const id = setInterval(() => {
      const drift = (Math.random() - 0.5) * 12000;
      setValue((v) => Math.round((v + drift) * 100) / 100);
      setPulse(true);
      const t = setTimeout(() => setPulse(false), 350);
      return () => clearTimeout(t);
    }, 2500);
    return () => clearInterval(id);
  }, []);

  const positive = value >= 0;

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md border px-2.5 py-1.5 transition-colors",
        positive
          ? "border-profit/30 bg-profit/10"
          : "border-loss/30 bg-loss/10",
      )}
    >
      <span className="hidden text-[11px] font-medium uppercase tracking-wide text-muted-foreground sm:inline">
        Aggregate P&L
      </span>
      {positive ? (
        <TrendingUp className="size-3.5 text-profit" />
      ) : (
        <TrendingDown className="size-3.5 text-loss" />
      )}
      <span
        className={cn(
          "font-mono text-sm font-semibold tabular-nums transition-opacity",
          positive ? "text-profit" : "text-loss",
          pulse && "opacity-60",
        )}
      >
        {formatSignedINR(value)}
      </span>
      <span className="relative flex size-2">
        <span
          className={cn(
            "absolute inline-flex size-full animate-ping rounded-full opacity-75",
            positive ? "bg-profit" : "bg-loss",
          )}
        />
        <span
          className={cn(
            "relative inline-flex size-2 rounded-full",
            positive ? "bg-profit" : "bg-loss",
          )}
        />
      </span>
    </div>
  );
}

export function Topbar({
  title,
  aggregatePnl,
  pendingAuth,
}: {
  title: string;
  aggregatePnl: number;
  pendingAuth: number;
}) {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-5" />
      <h1 className="text-sm font-semibold tracking-tight">{title}</h1>

      <div className="ml-auto flex items-center gap-2">
        {pendingAuth > 0 && (
          <Button
            render={<Link href="/session" />}
            nativeButton={false}
            variant="outline"
            size="sm"
            className="border-loss/30 bg-loss/5 text-loss hover:bg-loss/10 hover:text-loss"
          >
            <ShieldCheck />
            <span className="hidden sm:inline">
              {pendingAuth} to authenticate
            </span>
            <Badge className="bg-loss text-loss-foreground sm:hidden">
              {pendingAuth}
            </Badge>
          </Button>
        )}
        <LivePnlBadge base={aggregatePnl} />
        <ThemeToggle />
      </div>
    </header>
  );
}
